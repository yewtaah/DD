import hashlib
import hmac
import json
import os
import secrets

import boto3

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
    return _rds.execute_statement(**kwargs)


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


def handle_submit_score(body):
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

    def _int_field(key):
        v = body.get(key)
        if v in (None, ""):
            return 0
        try:
            return int(v)
        except (TypeError, ValueError):
            return 0

    great_shot_points = _int_field("great_shot_points")
    rough_bunker_count = _int_field("rough_bunker_count")
    water_count = _int_field("water_count")

    player_id = _find_or_create_player(player_name)

    existing = _rows(_sql(
        "SELECT result_id FROM results WHERE tournament_event_id = :teid AND player_id = :pid",
        [_param("teid", teid), _param("pid", player_id)],
    ))

    new_values = {
        "raw_score": strokes,
        "entered_by": entered_by,
        "great_shot_points": great_shot_points,
        "rough_bunker_count": rough_bunker_count,
        "water_count": water_count,
    }

    if existing:
        result_id = existing[0]["result_id"]
        old = _rows(_sql("SELECT * FROM results WHERE result_id = :rid", [_param("rid", result_id)]))[0]
        _sql(
            """UPDATE results SET raw_score = :score, updated_by = :who, updated_at = now()
               WHERE result_id = :rid""",
            [_param("score", strokes), _param("who", entered_by), _param("rid", result_id)],
        )
        _sql("DELETE FROM result_details WHERE result_id = :rid", [_param("rid", result_id)])
        action = "update"
        old_values = old
    else:
        result_id = _rows(_sql(
            """INSERT INTO results (tournament_event_id, player_id, raw_score, entered_by, entered_at)
               VALUES (:teid, :pid, :score, :who, now()) RETURNING result_id""",
            [_param("teid", teid), _param("pid", player_id), _param("score", strokes), _param("who", entered_by)],
        ))[0]["result_id"]
        action = "insert"
        old_values = None

    for detail_type, value in (
        ("great_shot_points", great_shot_points),
        ("rough_bunker_count", rough_bunker_count),
        ("water_count", water_count),
    ):
        _sql(
            "INSERT INTO result_details (result_id, detail_type, value) VALUES (:rid, :dt, :v)",
            [_param("rid", result_id), _param("dt", detail_type), _param("v", float(value))],
        )

    _sql(
        """INSERT INTO results_audit (result_id, action, changed_by, old_values, new_values)
           VALUES (:rid, :action, :who, :old::jsonb, :new::jsonb)""",
        [
            _param("rid", result_id),
            _param("action", action),
            _param("who", entered_by),
            _param("old", json.dumps(old_values)),
            _param("new", json.dumps(new_values)),
        ],
    )

    return _response(200, {"ok": True, "result_id": result_id, "player_id": player_id})


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
        """SELECT r.result_id, p.first_name || ' ' || p.last_name AS player_name,
                  r.raw_score, r.entered_by, r.entered_at, r.updated_by, r.updated_at
           FROM results r JOIN players p ON p.player_id = r.player_id
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
        if method == "POST" and path.endswith("/scores"):
            return handle_submit_score(json.loads(event.get("body") or "{}"))
        if method == "GET" and path.endswith("/scores"):
            return handle_get_scores(event.get("queryStringParameters") or {})
        if method == "GET" and path.endswith("/event"):
            return handle_get_event(event.get("queryStringParameters") or {})
        return _response(404, {"error": "not found"})
    except Exception as err:
        print(f"scorekeeper API error: {err}")
        return _response(500, {"error": "internal error"})
