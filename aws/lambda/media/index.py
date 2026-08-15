import base64
import json
import os
import uuid

import boto3

# Photo upload API for the Darwin Decathlon Field Notes gallery (issue #11).
# Fronts the same Aurora Serverless v2 Postgres cluster as dd-scorekeeper (see
# data/schema.sql, DEPLOYMENT.md) via the RDS Data API, plus S3 for the photo
# bytes themselves and Bedrock for an AI-drafted caption.
#
# PRIVACY / SCOPE NOTE: the vision call below drafts a caption and guesses the
# *activity* in a photo - it never attempts to identify who is in it. Real
# participant tagging would mean matching faces against reference images of
# real, named private individuals, which needs its own explicit-consent
# collection flow that does not exist yet. Until that exists, participant
# names are typed in by a human moderator during review (handle_approve),
# exactly like data/media.js is tagged today. Do not wire facial recognition
# into this file without that consent flow built first.
#
# Every upload lands with status='pending' and is invisible to the public
# site. Nothing here writes to a public location - handle_approve moves the
# S3 object into approved/ and flips the DB row, but wiring the public
# gallery to actually read approved rows is a separate follow-up (see
# CLAUDE.md / the issue this shipped against).

CLUSTER_ARN = os.environ["CLUSTER_ARN"]
SECRET_ARN = os.environ["SECRET_ARN"]
DATABASE_NAME = os.environ.get("DATABASE_NAME", "ddlive")
MEDIA_BUCKET = os.environ["MEDIA_BUCKET"]
ADMIN_SECRET_ARN = os.environ["ADMIN_SECRET_ARN"]
BEDROCK_MODEL_ID = "us.anthropic.claude-haiku-4-5"

MAX_IMAGE_BYTES = 8 * 1024 * 1024
ALLOWED_EXTENSIONS = {".jpg": "jpeg", ".jpeg": "jpeg", ".png": "png", ".webp": "webp"}
PRESIGN_EXPIRY_SECONDS = 15 * 60

_rds = boto3.client("rds-data")
_s3 = boto3.client("s3")
_secrets = boto3.client("secretsmanager")
_bedrock = boto3.client("bedrock-runtime")

_admin_password_cache = None


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


def _response(status, body):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(body, default=str),
    }


def _admin_password():
    global _admin_password_cache
    if _admin_password_cache is None:
        secret = _secrets.get_secret_value(SecretId=ADMIN_SECRET_ARN)
        _admin_password_cache = json.loads(secret["SecretString"])["password"]
    return _admin_password_cache


def _check_admin(body_or_params):
    return bool(body_or_params.get("password")) and body_or_params["password"] == _admin_password()


def _resolve_event(slug):
    rows = _rows(_sql(
        """SELECT te.tournament_event_id, te.tournament_id
           FROM tournament_events te
           JOIN events e ON e.event_id = te.event_id
           WHERE e.slug = :slug
           ORDER BY te.tournament_id DESC
           LIMIT 1""",
        [_param("slug", slug)],
    ))
    return rows[0] if rows else None


def _resolve_player_id(full_name):
    """Exact-match lookup only - unlike the scorekeeper Lambda's
    _find_or_create_player, a photo-tag typo should never silently create a
    phantom player row. Returns None (tag_value text is kept regardless) if
    nothing matches."""
    rows = _rows(_sql(
        "SELECT player_id FROM players WHERE lower(first_name || ' ' || last_name) = lower(:full)",
        [_param("full", full_name.strip())],
    ))
    return rows[0]["player_id"] if rows else None


def _known_activities():
    rows = _rows(_sql("SELECT name FROM events WHERE is_active = TRUE ORDER BY name"))
    return [r["name"] for r in rows]


def _draft_caption(image_bytes, image_format, activities):
    """Vision call: caption + best-guess activity only. Deliberately never
    asked to name anyone - see the module docstring."""
    system_prompt = (
        "You help caption photos for a private backyard sports tournament's website. "
        "Write exactly two lines:\n"
        "CAPTION: a single plain sentence describing the scene (no names, no guessing who anyone is)\n"
        "ACTIVITY: your best guess at which of these activities is shown, or 'none' if unclear: "
        + ", ".join(activities)
        + "\nNever speculate about anyone's identity. Output nothing else."
    )
    try:
        response = _bedrock.converse(
            modelId=BEDROCK_MODEL_ID,
            system=[{"text": system_prompt}],
            messages=[{
                "role": "user",
                "content": [
                    {"image": {"format": image_format, "source": {"bytes": image_bytes}}},
                    {"text": "Caption this photo."},
                ],
            }],
            inferenceConfig={"maxTokens": 200},
        )
        text = response["output"]["message"]["content"][0]["text"]
        caption, activity = None, None
        for line in text.splitlines():
            if line.startswith("CAPTION:"):
                caption = line[len("CAPTION:"):].strip() or None
            elif line.startswith("ACTIVITY:"):
                guess = line[len("ACTIVITY:"):].strip()
                activity = guess if guess and guess.lower() != "none" else None
        return caption, activity
    except Exception as err:
        print(f"vision captioning failed (non-fatal): {err}")
        return None, None


def handle_upload(body):
    event_slug = (body.get("event_slug") or "").strip()
    uploader_name = (body.get("uploader_name") or "").strip()
    image_b64 = body.get("image_base64") or ""
    filename = (body.get("filename") or "").strip()

    if not event_slug:
        return _response(400, {"error": "event_slug is required"})
    if not uploader_name:
        return _response(400, {"error": "Enter your name"})
    if body.get("consent") is not True:
        return _response(400, {"error": "Consent from everyone in the photo is required"})
    if not image_b64:
        return _response(400, {"error": "image_base64 is required"})

    ext = os.path.splitext(filename)[1].lower()
    image_format = ALLOWED_EXTENSIONS.get(ext)
    if not image_format:
        return _response(400, {"error": "Unsupported image type - use jpg, png, or webp"})

    try:
        image_bytes = base64.b64decode(image_b64, validate=True)
    except Exception:
        return _response(400, {"error": "image_base64 is not valid base64"})
    if len(image_bytes) > MAX_IMAGE_BYTES:
        return _response(400, {"error": "Image too large (8MB max)"})

    tevent = _resolve_event(event_slug)
    if not tevent:
        return _response(404, {"error": "Unknown event"})

    media_key = f"pending/{uuid.uuid4()}{ext}"
    _s3.put_object(Bucket=MEDIA_BUCKET, Key=media_key, Body=image_bytes,
                    ContentType=f"image/{image_format}")

    caption, activity = _draft_caption(image_bytes, image_format, _known_activities())

    media_id = _rows(_sql(
        """INSERT INTO media (tournament_id, tournament_event_id, blob_url, uploaded_by,
                               upload_source, caption, status)
           VALUES (:tid, :teid, :url, :who, 'qr_feed', :caption, 'pending')
           RETURNING media_id""",
        [
            _param("tid", tevent["tournament_id"]), _param("teid", tevent["tournament_event_id"]),
            _param("url", media_key), _param("who", uploader_name), _param("caption", caption),
        ],
    ))[0]["media_id"]

    if activity:
        _sql(
            """INSERT INTO media_tags (media_id, tag_type, tag_value, source)
               VALUES (:mid, 'activity', :val, 'ai')""",
            [_param("mid", media_id), _param("val", activity)],
        )

    return _response(200, {"ok": True, "media_id": media_id})


def handle_get_pending(params):
    if not _check_admin(params):
        return _response(401, {"error": "Wrong password"})
    rows = _rows(_sql(
        """SELECT media_id, blob_url, caption, uploaded_by, created_at
           FROM media WHERE status = 'pending' ORDER BY created_at ASC"""
    ))
    tag_rows = _rows(_sql(
        """SELECT mt.media_id, mt.tag_type, mt.tag_value
           FROM media_tags mt JOIN media m ON m.media_id = mt.media_id
           WHERE m.status = 'pending'"""
    ))
    tags_by_media = {}
    for t in tag_rows:
        tags_by_media.setdefault(t["media_id"], []).append({"type": t["tag_type"], "value": t["tag_value"]})

    for r in rows:
        r["tags"] = tags_by_media.get(r["media_id"], [])
        r["preview_url"] = _s3.generate_presigned_url(
            "get_object", Params={"Bucket": MEDIA_BUCKET, "Key": r["blob_url"]},
            ExpiresIn=PRESIGN_EXPIRY_SECONDS,
        )
    return _response(200, {"pending": rows})


def _get_media(media_id):
    rows = _rows(_sql("SELECT media_id, blob_url, status FROM media WHERE media_id = :mid",
                       [_param("mid", media_id)]))
    return rows[0] if rows else None


def handle_approve(media_id, body):
    if not _check_admin(body):
        return _response(401, {"error": "Wrong password"})
    media = _get_media(media_id)
    if not media:
        return _response(404, {"error": "Not found"})

    new_key = media["blob_url"].replace("pending/", "approved/", 1)
    _s3.copy_object(Bucket=MEDIA_BUCKET, CopySource={"Bucket": MEDIA_BUCKET, "Key": media["blob_url"]},
                     Key=new_key)
    _s3.delete_object(Bucket=MEDIA_BUCKET, Key=media["blob_url"])

    caption = body.get("caption")
    if caption:
        _sql(
            "UPDATE media SET status = 'approved', blob_url = :url, caption = :caption WHERE media_id = :mid",
            [_param("mid", media_id), _param("url", new_key), _param("caption", caption)],
        )
    else:
        _sql(
            "UPDATE media SET status = 'approved', blob_url = :url WHERE media_id = :mid",
            [_param("mid", media_id), _param("url", new_key)],
        )

    for name in (body.get("people") or []):
        name = (name or "").strip()
        if not name:
            continue
        _sql(
            """INSERT INTO media_tags (media_id, tag_type, tag_value, player_id, source)
               VALUES (:mid, 'participant', :val, :pid, 'manual')""",
            [_param("mid", media_id), _param("val", name), _param("pid", _resolve_player_id(name))],
        )

    return _response(200, {"ok": True})


def handle_reject(media_id, body):
    if not _check_admin(body):
        return _response(401, {"error": "Wrong password"})
    media = _get_media(media_id)
    if not media:
        return _response(404, {"error": "Not found"})
    _s3.delete_object(Bucket=MEDIA_BUCKET, Key=media["blob_url"])
    _sql("UPDATE media SET status = 'rejected' WHERE media_id = :mid", [_param("mid", media_id)])
    return _response(200, {"ok": True})


def handle_delete(media_id, params):
    if not _check_admin(params):
        return _response(401, {"error": "Wrong password"})
    media = _get_media(media_id)
    if not media:
        return _response(404, {"error": "Not found"})
    _s3.delete_object(Bucket=MEDIA_BUCKET, Key=media["blob_url"])
    _sql("DELETE FROM media_tags WHERE media_id = :mid", [_param("mid", media_id)])
    _sql("DELETE FROM media WHERE media_id = :mid", [_param("mid", media_id)])
    return _response(200, {"ok": True})


def handler(event, context):
    method = (event.get("requestContext", {}).get("http", {}) or {}).get("method", "GET")
    path = event.get("rawPath", "")
    segments = [s for s in path.split("/") if s]  # e.g. ['api','media','123','approve']

    if method == "OPTIONS":
        return _response(200, {})

    try:
        if method == "POST" and segments[-1:] == ["upload"]:
            return handle_upload(json.loads(event.get("body") or "{}"))
        if method == "GET" and segments[-1:] == ["pending"]:
            return handle_get_pending(event.get("queryStringParameters") or {})
        if method == "POST" and len(segments) >= 2 and segments[-1] in ("approve", "reject") and segments[-2].isdigit():
            media_id = int(segments[-2])
            body = json.loads(event.get("body") or "{}")
            return handle_approve(media_id, body) if segments[-1] == "approve" else handle_reject(media_id, body)
        if method == "DELETE" and segments[-1:] and segments[-1].isdigit():
            return handle_delete(int(segments[-1]), event.get("queryStringParameters") or {})
        return _response(404, {"error": "not found"})
    except Exception as err:
        print(f"media API error: {err}")
        return _response(500, {"error": "internal error"})
