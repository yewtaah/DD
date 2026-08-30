import hashlib
import hmac
import json
import os
import secrets
import time

import boto3
from botocore.exceptions import ClientError

# Live scorekeeping API for the Darwin Decathlon site. Fronts the Aurora
# Serverless v2 Postgres cluster (see data/schema.sql, DEPLOYMENT.md) via the
# RDS Data API - no VPC networking needed by this Lambda.
#
# Auth model is deliberately simple: one shared password per tournament_event
# (scorekeeper_credentials), checked fresh on every write rather than via a
# signed session token. This is a low-stakes internal tool for a private
# friend-group tournament, not a system that needs session management - see
# the "shared per-event password" decision in the PR this shipped with.
#
# PII BOUNDARY: this function only ever touches players.first_name/last_name
# (already public - names appear in published standings on the site) and
# free-text scorekeeper names typed in at login. Never touches
# players.email/phone - those columns exist in the schema but nothing here
# reads or writes them.

CLUSTER_ARN = os.environ["CLUSTER_ARN"]
SECRET_ARN = os.environ["SECRET_ARN"]
DATABASE_NAME = os.environ.get("DATABASE_NAME", "ddlive")

_rds = boto3.client("rds-data")

# The cluster auto-pauses to zero capacity when idle (MinCapacity=0, see
# DEPLOYMENT.md). The first Data API call after a pause kicks off a resume
# that takes ~15 seconds, and until it completes calls fail with
# DatabaseResumingException (or, transiently, DatabaseUnavailableException).
# Retry through that window instead of surfacing a one-off 500 to the
# scorekeeper. Budget stays under API Gateway's hard 30-second integration
# timeout; the frontend's soft-fail handling covers the rare request that
# outlives it.
_RESUME_RETRY_SECONDS = 20
_RESUME_ERROR_CODES = {"DatabaseResumingException", "DatabaseUnavailableException"}


def _sql(text, params=None):
    kwargs = dict(
        resourceArn=CLUSTER_ARN,
        secretArn=SECRET_ARN,
        database=DATABASE_NAME,
        sql=text,
        includeResultMetadata=True,
    )
    if params:
        kwargs["parameters"] = params
    deadline = time.monotonic() + _RESUME_RETRY_SECONDS
    while True:
        try:
            return _rds.execute_statement(**kwargs)
        except ClientError as err:
            code = err.response.get("Error", {}).get("Code")
            if code not in _RESUME_ERROR_CODES or time.monotonic() >= deadline:
                raise
            time.sleep(2)


def _param(name, value):
    if value is None:
        return {"name": name, "value": {"isNull": True}}
    if isinstance(value, bool):
        return {"name": name, "value": {"booleanValue": value}}
    if isinstance(value, int):
        return {"name": name, "value": {"longValue": value}}
    if isinstance(value, float):
        return {"name": name, "value": {"doubleValue": value}}
    return {"name": name, "value": {"stringValue": str(value)}}


def _rows(result):
    cols = [c["label"] for c in result.get("columnMetadata", [])]
    out = []
    for record in result.get("records", []):
        row = {}
        for col, field in zip(cols, record):
            row[col] = next(iter(field.values())) if field and not field.get("isNull") else None
        out.append(row)
    return out


def _hash_password(password, salt_hex):
    salt = bytes.fromhex(salt_hex)
    return hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100_000).hex()


def _check_password(tournament_event_id, password):
    res = _sql(
        "SELECT password_hash, password_salt FROM scorekeeper_credentials WHERE tournament_event_id = :teid",
        [_param("teid", tournament_event_id)],
    )
    rows = _rows(res)
    if not rows:
        return False
    stored_hash, salt_hex = rows[0]["password_hash"], rows[0]["password_salt"]
    candidate = _hash_password(password, salt_hex)
    return hmac.compare_digest(candidate, stored_hash)


def _response(status, body):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(body, default=str),
    }


def _find_or_create_player(full_name):
    full_name = full_name.strip()
    parts = full_name.split(" ", 1)
    first, last = parts[0], (parts[1] if len(parts) > 1 else "")
    res = _sql(
        "SELECT player_id FROM players WHERE lower(first_name || ' ' || last_name) = lower(:full)",
        [_param("full", full_name)],
    )
    rows = _rows(res)
    if rows:
        return rows[0]["player_id"]
    res = _sql(
        "INSERT INTO players (first_name, last_name) VALUES (:f, :l) RETURNING player_id",
        [_param("f", first), _param("l", last)],
    )
    return _rows(res)[0]["player_id"]


def handle_login(body):
    teid = int(body["tournament_event_id"])
    password = body.get("password", "")
    name = (body.get("name") or "").strip()
    if not name:
        return _response(400, {"error": "Enter your name"})
    if not _check_password(teid, password):
        return _response(401, {"error": "Wrong password"})
    return _response(200, {"ok": True, "name": name})


def _int_field(body, key, default=0):
    v = body.get(key)
    if v in (None, ""):
        return default
    try:
        return int(v)
    except (TypeError, ValueError):
        return default


def _upsert_result(teid, player_id, raw_score, entered_by, partner_player_id=None,
                    placement=None, details=None):
    """Insert or update one player's result row for a tournament_event, replace
    its result_details, and log the write to results_audit. Shared by every
    event-specific submit handler - Golden Tee (individual) and Corn Hole
    (one call per partner) both go through this."""
    existing = _rows(_sql(
        "SELECT result_id FROM results WHERE tournament_event_id = :teid AND player_id = :pid",
        [_param("teid", teid), _param("pid", player_id)],
    ))

    new_values = {
        "raw_score": raw_score, "entered_by": entered_by,
        "partner_player_id": partner_player_id, "placement": placement,
        "details": details or {},
    }

    if existing:
        result_id = existing[0]["result_id"]
        old = _rows(_sql("SELECT * FROM results WHERE result_id = :rid", [_param("rid", result_id)]))[0]
        _sql(
            """UPDATE results SET raw_score = :score, partner_player_id = :partner,
                   placement = :placement, updated_by = :who, updated_at = now()
               WHERE result_id = :rid""",
            [_param("score", raw_score), _param("partner", partner_player_id),
             _param("placement", placement), _param("who", entered_by), _param("rid", result_id)],
        )
        _sql("DELETE FROM result_details WHERE result_id = :rid", [_param("rid", result_id)])
        action = "update"
        old_values = old
    else:
        result_id = _rows(_sql(
            """INSERT INTO results (tournament_event_id, player_id, partner_player_id, raw_score,
                                     placement, entered_by, entered_at)
               VALUES (:teid, :pid, :partner, :score, :placement, :who, now()) RETURNING result_id""",
            [_param("teid", teid), _param("pid", player_id), _param("partner", partner_player_id),
             _param("score", raw_score), _param("placement", placement), _param("who", entered_by)],
        ))[0]["result_id"]
        action = "insert"
        old_values = None

    for detail_type, value in (details or {}).items():
        _sql(
            "INSERT INTO result_details (result_id, detail_type, value) VALUES (:rid, :dt, :v)",
            [_param("rid", result_id), _param("dt", detail_type), _param("v", float(value))],
        )

    _sql(
        """INSERT INTO results_audit (result_id, action, changed_by, old_values, new_values)
           VALUES (:rid, :action, :who, :old::jsonb, :new::jsonb)""",
        [
            _param("rid", result_id), _param("action", action), _param("who", entered_by),
            _param("old", json.dumps(old_values)), _param("new", json.dumps(new_values)),
        ],
    )
    return result_id


def handle_submit_golden_tee(body):
    teid = int(body["tournament_event_id"])
    password = body.get("password", "")
    entered_by = (body.get("name") or "").strip()
    if not entered_by:
        return _response(400, {"error": "Enter your name"})
    if not _check_password(teid, password):
        return _response(401, {"error": "Wrong password"})

    player_name = (body.get("player_name") or "").strip()
    if not player_name:
        return _response(400, {"error": "player_name is required"})
    try:
        strokes = float(body["strokes"])
    except (KeyError, TypeError, ValueError):
        return _response(400, {"error": "strokes must be a number"})

    player_id = _find_or_create_player(player_name)
    details = {
        "great_shot_points": _int_field(body, "great_shot_points"),
        "rough_bunker_count": _int_field(body, "rough_bunker_count"),
        "water_count": _int_field(body, "water_count"),
    }
    result_id = _upsert_result(teid, player_id, strokes, entered_by, details=details)
    return _response(200, {"ok": True, "result_id": result_id, "player_id": player_id})


def handle_submit_corn_hole(body):
    """Corn Hole is a pairs game to 21 (no bust). Records only the final score
    per team, not individual throws - see result_details usage. Both partners
    on a team get their own results row, each raw_score set to their team's
    final score and each pointing at the other via partner_player_id, so
    per-player aggregation and "who partners with whom" queries both work
    without any pairs-specific view. A 'Belize'd' instant win (all 4 bags by
    one player in one turn) is recorded as a result_details flag on the
    winning team's two rows rather than a separate table - it's exactly the
    kind of one-off per-event detail result_details exists for."""
    teid = int(body["tournament_event_id"])
    password = body.get("password", "")
    entered_by = (body.get("name") or "").strip()
    if not entered_by:
        return _response(400, {"error": "Enter your name"})
    if not _check_password(teid, password):
        return _response(401, {"error": "Wrong password"})

    def _name(key):
        return (body.get(key) or "").strip()

    team_a = [_name("team_a_player1"), _name("team_a_player2")]
    team_b = [_name("team_b_player1"), _name("team_b_player2")]
    if not all(team_a) or not all(team_b):
        return _response(400, {"error": "All four player names are required"})

    try:
        score_a = float(body["team_a_score"])
        score_b = float(body["team_b_score"])
    except (KeyError, TypeError, ValueError):
        return _response(400, {"error": "team_a_score and team_b_score must be numbers"})

    belized_team = body.get("belized_team")  # 'a', 'b', or falsy/None
    if belized_team not in ("a", "b", None, ""):
        return _response(400, {"error": "belized_team must be 'a', 'b', or empty"})

    a_ids = [_find_or_create_player(n) for n in team_a]
    b_ids = [_find_or_create_player(n) for n in team_b]

    a_won = belized_team == "a" or (not belized_team and score_a >= score_b)
    b_won = belized_team == "b" or (not belized_team and score_b > score_a)

    result_ids = []
    for ids, score, partner_ids, won, is_team_a in (
        (a_ids, score_a, a_ids, a_won, True), (b_ids, score_b, b_ids, b_won, False),
    ):
        for i, pid in enumerate(ids):
            partner_id = partner_ids[1 - i]
            details = {}
            if belized_team == ("a" if is_team_a else "b"):
                details["belized_win"] = 1
            result_ids.append(_upsert_result(
                teid, pid, score, entered_by,
                partner_player_id=partner_id, placement=(1 if won else 2), details=details,
            ))

    # Tag all four rows from this submission with a shared game_group so the
    # UI can show "who played whom" as one line - see the column comment in
    # data/schema.sql. Using the lowest result_id keeps this stable across
    # later edits to the same four players (UPDATE never changes result_id).
    game_group = min(result_ids)
    _sql(
        f"UPDATE results SET game_group = :gg WHERE result_id IN ({','.join(':id'+str(i) for i in range(len(result_ids)))})",
        [_param("gg", game_group)] + [_param(f"id{i}", rid) for i, rid in enumerate(result_ids)],
    )

    return _response(200, {"ok": True, "result_ids": result_ids, "game_group": game_group})


def handle_get_event(params):
    slug = params.get("slug", "")
    if not slug:
        return _response(400, {"error": "slug is required"})
    rows = _rows(_sql(
        """SELECT te.tournament_event_id, t.name AS tournament_name, t.tournament_type,
                  e.name AS event_name, e.scoring_direction
           FROM tournament_events te
           JOIN events e ON e.event_id = te.event_id
           JOIN tournaments t ON t.tournament_id = te.tournament_id
           WHERE e.slug = :slug
           ORDER BY t.tournament_id DESC
           LIMIT 1""",
        [_param("slug", slug)],
    ))
    if not rows:
        return _response(404, {"error": "no tournament_event found for that slug"})
    return _response(200, rows[0])


def handle_get_scores(params):
    teid = int(params["tournament_event_id"])
    results = _rows(_sql(
        """SELECT r.result_id, r.player_id, p.first_name || ' ' || p.last_name AS player_name,
                  r.partner_player_id, pp.first_name || ' ' || pp.last_name AS partner_name,
                  r.game_group, r.raw_score, r.placement, r.entered_by, r.entered_at, r.updated_by, r.updated_at
           FROM results r
           JOIN players p ON p.player_id = r.player_id
           LEFT JOIN players pp ON pp.player_id = r.partner_player_id
           WHERE r.tournament_event_id = :teid
           ORDER BY r.raw_score ASC NULLS LAST""",
        [_param("teid", teid)],
    ))
    details = _rows(_sql(
        """SELECT rd.result_id, rd.detail_type, rd.value
           FROM result_details rd
           JOIN results r ON r.result_id = rd.result_id
           WHERE r.tournament_event_id = :teid""",
        [_param("teid", teid)],
    ))
    by_result = {}
    for d in details:
        by_result.setdefault(d["result_id"], {})[d["detail_type"]] = d["value"]
    for r in results:
        r["details"] = by_result.get(r["result_id"], {})
    return _response(200, {"results": results})


def handler(event, context):
    method = (event.get("requestContext", {}).get("http", {}) or {}).get("method", "GET")
    path = event.get("rawPath", "")

    if method == "OPTIONS":
        return _response(200, {})

    try:
        if method == "POST" and path.endswith("/login"):
            return handle_login(json.loads(event.get("body") or "{}"))
        if method == "POST" and path.endswith("/scores/golden-tee"):
            return handle_submit_golden_tee(json.loads(event.get("body") or "{}"))
        if method == "POST" and path.endswith("/scores/corn-hole"):
            return handle_submit_corn_hole(json.loads(event.get("body") or "{}"))
        if method == "GET" and path.endswith("/scores"):
            return handle_get_scores(event.get("queryStringParameters") or {})
        if method == "GET" and path.endswith("/event"):
            return handle_get_event(event.get("queryStringParameters") or {})
        return _response(404, {"error": "not found"})
    except Exception as err:
        print(f"scorekeeper API error: {err}")
        return _response(500, {"error": "internal error"})
