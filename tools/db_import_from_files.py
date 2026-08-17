#!/usr/bin/env python3
"""One-time backfill: data/tournaments.js + data/media.js + data/event-notes.js
into the live Aurora DB (dd-live-scoring), making the DB the system of
record instead of these hand-maintained files.

RUN THIS ONCE, MANUALLY, after applying the schema additions in
data/schema.sql (see the "Database as system of record" work - the schema
migration is a separate handoff script, not part of this one). Safe to
re-run: every insert either upserts against one of the schema's existing
unique constraints, or does an exact-match lookup first and skips if the
row is already there.

These three files are JS, not JSON - data/tournaments.js has real
arithmetic expressions in it (e.g. `t:17.5*60`), so this script does not
regex/json.loads them. Instead it launches headless Edge against a tiny
local harness page that <script src>'s the same three files index.html
uses, lets the browser's own JS engine evaluate them, and reads back
window.DD_DATA / DD_MEDIA / DD_EVENT_NOTES serialized to JSON.

Player/event/venue matching is exact-name-only, same philosophy as
aws/lambda/media/index.py's _resolve_player_id - a typo should never
silently create a phantom row. Anything that can't be resolved is printed
as a warning and skipped, not guessed.

Usage:
    python tools/db_import_from_files.py           # does the import
    python tools/db_import_from_files.py --dry-run # parses + validates only, no DB writes
"""
import html
import json
import os
import re
import subprocess
import sys

import boto3

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE_CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]

REGION = "us-east-1"
CLUSTER_ARN = "arn:aws:rds:us-east-1:654700647887:cluster:dd-live-scoring"
SECRET_ARN = "arn:aws:secretsmanager:us-east-1:654700647887:secret:rds!cluster-fa08f829-599f-421d-a358-c173da062646-HVosre"
DATABASE = "ddlive"

DRY_RUN = "--dry-run" in sys.argv

_rds = None if DRY_RUN else boto3.client("rds-data", region_name=REGION)

# Same alias map as index.html's ALIAS constant - renames fold to one canonical name.
ALIAS = {
    "Chinese Stars": "Shuriken",
    ".22 Shoot": "Shooting Gallery",
    "Long Golf Ball": "Long Drive",
}
canonical = lambda n: ALIAS.get(n, n)


def sql(text, params=None):
    kwargs = dict(resourceArn=CLUSTER_ARN, secretArn=SECRET_ARN, database=DATABASE,
                   sql=text, includeResultMetadata=True)
    if params:
        kwargs["parameters"] = params
    return _rds.execute_statement(**kwargs)


def param(name, value):
    if value is None:
        return {"name": name, "value": {"isNull": True}}
    if isinstance(value, bool):
        return {"name": name, "value": {"booleanValue": value}}
    if isinstance(value, int):
        return {"name": name, "value": {"longValue": value}}
    if isinstance(value, float):
        return {"name": name, "value": {"doubleValue": value}}
    return {"name": name, "value": {"stringValue": str(value)}}


def rows(result):
    cols = [c["label"] for c in result.get("columnMetadata", [])]
    out = []
    for record in result.get("records", []):
        row = {}
        for col, field in zip(cols, record):
            row[col] = None if (not field or field.get("isNull")) else next(iter(field.values()))
        out.append(row)
    return out


def find_edge():
    for path in EDGE_CANDIDATES:
        if os.path.exists(path):
            return path
    raise RuntimeError("msedge.exe not found in the usual install locations - "
                        "edit EDGE_CANDIDATES at the top of this script.")


def load_data_files():
    """Execute the three window.DD_* files in a real browser (not a JS
    parser) and read back JSON. See module docstring for why."""
    edge = find_edge()
    harness_path = os.path.join(REPO_ROOT, "data", "_import_harness_TEMP.html")
    harness_html = """<!doctype html><html><body>
<script src="tournaments.js"></script>
<script src="event-notes.js"></script>
<script src="media.js"></script>
<pre id="out"></pre>
<script>
document.getElementById('out').textContent = JSON.stringify({
  tournaments: window.DD_DATA, notes: window.DD_EVENT_NOTES, media: window.DD_MEDIA
});
</script>
</body></html>"""
    with open(harness_path, "w", encoding="utf-8") as f:
        f.write(harness_html)
    try:
        file_url = "file:///" + harness_path.replace(os.sep, "/")
        result = subprocess.run(
            [edge, "--headless=new", "--disable-gpu", "--allow-file-access-from-files",
             "--dump-dom", file_url],
            capture_output=True, text=True, timeout=30,
        )
        m = re.search(r'<pre id="out">(.*?)</pre>', result.stdout, re.DOTALL)
        if not m:
            raise RuntimeError("Could not find serialized data in headless browser output - "
                                "stderr was:\n" + result.stderr)
        return json.loads(html.unescape(m.group(1)))
    finally:
        if os.path.exists(harness_path):
            os.unlink(harness_path)


# ---------------------------------------------------------------------------
# Lookups, built once from what's already in the DB (events are pre-seeded
# by schema.sql; players/venues/tournaments get filled in as we go).
# ---------------------------------------------------------------------------
def build_event_lookup():
    return {r["name"]: r["event_id"] for r in rows(sql("SELECT event_id, name FROM events"))}


def get_or_create_player(name, cache):
    if name in cache:
        return cache[name]
    existing = rows(sql(
        "SELECT player_id FROM players WHERE lower(first_name || ' ' || last_name) = lower(:full)",
        [param("full", name)],
    ))
    if existing:
        cache[name] = existing[0]["player_id"]
        return cache[name]
    parts = name.strip().split(" ", 1)
    first, last = parts[0], (parts[1] if len(parts) > 1 else "")
    new_id = rows(sql(
        "INSERT INTO players (first_name, last_name) VALUES (:f, :l) RETURNING player_id",
        [param("f", first), param("l", last)],
    ))[0]["player_id"]
    cache[name] = new_id
    print(f"  + created player: {name}")
    return new_id


def find_venue(name, venue_cache):
    """Exact-match only - a near-miss (e.g. 'American Shooting Center' vs the
    venues[] entry 'American Shooting Centers') is logged and left NULL
    rather than guessed. Fix the source string if you want it linked."""
    if name in venue_cache:
        return venue_cache[name]
    existing = rows(sql("SELECT venue_id FROM venues WHERE name = :n", [param("n", name)]))
    venue_cache[name] = existing[0]["venue_id"] if existing else None
    if not existing:
        print(f"  ! no venue match for '{name}' - left NULL, not guessed")
    return venue_cache[name]


def import_venues(venues):
    print(f"\n=== venues ({len(venues)}) ===")
    for v in venues:
        print(f"  {v['name']}")
        existing = rows(sql("SELECT venue_id FROM venues WHERE name = :n", [param("n", v["name"])]))
        if existing:
            continue
        # PII BOUNDARY (see CLAUDE.md): never import a street address for a
        # private residence, even if one somehow ends up in the source file.
        address = None if v.get("private") else v.get("address")
        sql(
            """INSERT INTO venues (name, address, city, latitude, longitude, geo_precision, is_private_residence)
               VALUES (:name, :address, :city, :lat, :lon, :prec, :priv)""",
            [
                param("name", v["name"]), param("address", address), param("city", v.get("city")),
                param("lat", v.get("lat")), param("lon", v.get("lon")),
                param("prec", v["precision"]), param("priv", v["private"]),
            ],
        )


def import_tournaments(tournaments, event_lookup, player_cache, venue_cache):
    for t in tournaments:
        print(f"\n=== {t['year']} - {t['title']} ===")
        existing = rows(sql("SELECT tournament_id FROM tournaments WHERE year = :y AND name = :n",
                             [param("y", t["year"]), param("n", t["title"])]))
        if existing:
            tournament_id = existing[0]["tournament_id"]
            print(f"  already imported as tournament_id={tournament_id}, updating fields")
            sql(
                """UPDATE tournaments SET title=:title, subtitle=:subtitle, dates_label=:dates,
                   location=:loc, max_points=:mp, sums_cleanly=:sc, notes=:notes
                   WHERE tournament_id=:tid""",
                [
                    param("title", t["title"]), param("subtitle", t.get("subtitle") or None),
                    param("dates", t.get("dates")), param("loc", t.get("location")),
                    param("mp", t.get("maxPoints")), param("sc", t.get("sumsCleanly", True)),
                    param("notes", t.get("note")), param("tid", tournament_id),
                ],
            )
        else:
            tournament_id = rows(sql(
                """INSERT INTO tournaments (year, name, title, subtitle, dates_label, location,
                                             max_points, sums_cleanly, notes)
                   VALUES (:year, :name, :title, :subtitle, :dates, :loc, :mp, :sc, :notes)
                   RETURNING tournament_id""",
                [
                    param("year", t["year"]), param("name", t["title"]),
                    param("title", t["title"]), param("subtitle", t.get("subtitle") or None),
                    param("dates", t.get("dates")), param("loc", t.get("location")),
                    param("mp", t.get("maxPoints")), param("sc", t.get("sumsCleanly", True)),
                    param("notes", t.get("note")),
                ],
            ))[0]["tournament_id"]
            print(f"  created tournament_id={tournament_id}")

        # tournament_events - one row per event played this year
        te_ids = {}
        for ei, e in enumerate(t["events"]):
            cname = canonical(e["name"])
            event_id = event_lookup.get(cname)
            if event_id is None:
                print(f"  ! unknown event '{e['name']}' (canonical '{cname}') - skipping this event entirely")
                continue
            venue_id = find_venue(e["venue"], venue_cache) if e.get("venue") else None
            print(f"  event {e['n']:>2}: {cname}")
            existing_te = rows(sql(
                "SELECT tournament_event_id FROM tournament_events WHERE tournament_id=:tid AND event_id=:eid",
                [param("tid", tournament_id), param("eid", event_id)],
            ))
            fields = [
                param("tid", tournament_id), param("eid", event_id), param("vid", venue_id),
                param("order", e["n"]), param("pair", bool(e.get("pair"))),
                param("basis", e.get("basis")), param("rules", e.get("rules")),
                param("snafu", e.get("snafu")), param("short", e.get("short")),
                param("day", e.get("day")), param("time", e.get("time")),
                param("clock", e.get("t")), param("debut", bool(e.get("newThisYear"))),
                param("gm", e.get("gameMaster")),
            ]
            if existing_te:
                te_id = existing_te[0]["tournament_event_id"]
                sql(
                    """UPDATE tournament_events SET venue_id=:vid, event_order=:order, is_pair_event=:pair,
                       scoring_basis=:basis, rules_text=:rules, snafu_text=:snafu,
                       event_short_label=:short, event_day=:day, event_time_label=:time,
                       event_clock_minutes=:clock, is_debut=:debut, game_master=:gm
                       WHERE tournament_event_id=:teid""",
                    fields + [param("teid", te_id)],
                )
            else:
                te_id = rows(sql(
                    """INSERT INTO tournament_events (tournament_id, event_id, venue_id, event_order,
                        is_pair_event, scoring_basis, rules_text, snafu_text, event_short_label,
                        event_day, event_time_label, event_clock_minutes, is_debut, game_master)
                       VALUES (:tid, :eid, :vid, :order, :pair, :basis, :rules, :snafu, :short,
                               :day, :time, :clock, :debut, :gm)
                       RETURNING tournament_event_id""",
                    fields,
                ))[0]["tournament_event_id"]
            te_ids[ei] = te_id

        # results - one row per player per event they actually played
        for p in t["players"]:
            player_id = get_or_create_player(p["name"], player_cache)
            for ei, pts in enumerate(p["points"]):
                if pts is None or ei not in te_ids:
                    continue
                te_id = te_ids[ei]
                existing_r = rows(sql(
                    "SELECT result_id FROM results WHERE tournament_event_id=:teid AND player_id=:pid",
                    [param("teid", te_id), param("pid", player_id)],
                ))
                if existing_r:
                    sql("UPDATE results SET points_awarded=:pts WHERE result_id=:rid",
                        [param("pts", pts), param("rid", existing_r[0]["result_id"])])
                else:
                    sql(
                        """INSERT INTO results (tournament_event_id, player_id, points_awarded)
                           VALUES (:teid, :pid, :pts)""",
                        [param("teid", te_id), param("pid", player_id), param("pts", pts)],
                    )
        print(f"  {len(t['players'])} players' results loaded")

        # champion / co-champion
        champ_id = get_or_create_player(t["champion"], player_cache)
        co_champ_id = get_or_create_player(t["coChampion"], player_cache) if t.get("coChampion") else None
        sql("UPDATE tournaments SET champion_player_id=:c, co_champion_player_id=:cc WHERE tournament_id=:tid",
            [param("c", champ_id), param("cc", co_champ_id), param("tid", tournament_id)])

        # printed-total overrides, only for sumsCleanly:false years
        if t.get("totals"):
            for name, total in t["totals"].items():
                pid = get_or_create_player(name, player_cache)
                existing_o = rows(sql(
                    "SELECT 1 FROM tournament_point_overrides WHERE tournament_id=:tid AND player_id=:pid",
                    [param("tid", tournament_id), param("pid", pid)],
                ))
                if existing_o:
                    sql("UPDATE tournament_point_overrides SET total_points=:tot WHERE tournament_id=:tid AND player_id=:pid",
                        [param("tot", total), param("tid", tournament_id), param("pid", pid)])
                else:
                    sql(
                        """INSERT INTO tournament_point_overrides (tournament_id, player_id, total_points)
                           VALUES (:tid, :pid, :tot)""",
                        [param("tid", tournament_id), param("pid", pid), param("tot", total)],
                    )
            print(f"  {len(t['totals'])} printed-total overrides loaded (sumsCleanly=false)")


def import_event_notes(notes, event_lookup):
    print(f"\n=== event-notes ({len(notes)}) ===")
    for name, note in notes.items():
        cname = canonical(name)
        event_id = event_lookup.get(cname)
        if event_id is None:
            print(f"  ! unknown event '{name}' in event-notes.js - skipping")
            continue
        print(f"  {cname}")
        sql(
            """UPDATE events SET notes_blurb=:blurb, notes_rules=CAST(:rules AS JSONB),
               notes_snafu=:snafu, notes_savior=:savior, notes_source=:source
               WHERE event_id=:eid""",
            [
                param("blurb", note.get("blurb")), param("rules", json.dumps(note.get("rules", []))),
                param("snafu", note.get("snafu")), param("savior", note.get("savior")),
                param("source", note.get("source")), param("eid", event_id),
            ],
        )


def import_media(media, event_lookup, venue_cache, tournament_by_year):
    print(f"\n=== media ({len(media)}) ===")
    for m in media:
        cname = canonical(m["event"])
        event_id = event_lookup.get(cname)
        if event_id is None:
            print(f"  ! unknown event '{m['event']}' for {m['file']} - skipping")
            continue
        tournament_id = tournament_by_year.get(m.get("year")) if m.get("year") else None
        venue_id = find_venue(m["venue"], venue_cache) if m.get("venue") else None
        print(f"  {m['file']} ({cname}{', ' + str(m['year']) if m.get('year') else ''})")
        existing = rows(sql("SELECT media_id FROM media WHERE blob_url = :url", [param("url", m["file"])]))
        if existing:
            continue
        te_id = None
        if tournament_id:
            te_row = rows(sql(
                "SELECT tournament_event_id FROM tournament_events WHERE tournament_id=:tid AND event_id=:eid",
                [param("tid", tournament_id), param("eid", event_id)],
            ))
            te_id = te_row[0]["tournament_event_id"] if te_row else None
        media_id = rows(sql(
            """INSERT INTO media (tournament_id, tournament_event_id, event_id, venue_id, blob_url,
                                   caption, upload_source, status)
               VALUES (:tid, :teid, :eid, :vid, :url, :caption, 'admin', 'approved')
               RETURNING media_id""",
            [
                param("tid", tournament_id), param("teid", te_id), param("eid", event_id),
                param("vid", venue_id), param("url", m["file"]), param("caption", m.get("caption")),
            ],
        ))[0]["media_id"]
        for person in m.get("people", []):
            # Exact-match only for photo tags - never auto-create a player from a
            # photo caption typo (same rule aws/lambda/media/index.py already
            # follows for participant tagging on approval).
            existing_p = rows(sql(
                "SELECT player_id FROM players WHERE lower(first_name || ' ' || last_name) = lower(:full)",
                [param("full", person)],
            ))
            pid = existing_p[0]["player_id"] if existing_p else None
            if pid is None:
                print(f"    ! no player match for tagged person '{person}' - tag kept as text, player_id NULL")
            sql(
                """INSERT INTO media_tags (media_id, tag_type, tag_value, player_id, source)
                   VALUES (:mid, 'participant', :val, :pid, 'manual')""",
                [param("mid", media_id), param("val", person), param("pid", pid)],
            )


def main():
    print("Loading data/tournaments.js, data/media.js, data/event-notes.js via headless browser...")
    data = load_data_files()
    print(f"Parsed: {len(data['tournaments']['tournaments'])} tournaments, "
          f"{len(data['tournaments']['venues'])} venues, {len(data['notes'])} event-notes, "
          f"{len(data['media'])} media entries.")

    if DRY_RUN:
        print("\n--dry-run: parsing only, no DB connection, no writes.\n")
        return

    event_lookup = build_event_lookup()
    print(f"\n{len(event_lookup)} events already in DB (reference data from schema.sql).")

    player_cache = {}
    venue_cache = {}

    import_venues(data["tournaments"]["venues"])
    import_tournaments(data["tournaments"]["tournaments"], event_lookup, player_cache, venue_cache)
    import_event_notes(data["notes"], event_lookup)

    tournament_by_year = {
        r["year"]: r["tournament_id"]
        for r in rows(sql("SELECT tournament_id, year FROM tournaments WHERE tournament_type='decathlon'"))
    }
    import_media(data["media"], event_lookup, venue_cache, tournament_by_year)

    print("\nDone. Spot-check a few tricky values against the live DB before trusting this:")
    print("  - 2018/2019/2022/2023 tournament_point_overrides (sumsCleanly=false years)")
    print("  - 2022 tournaments.co_champion_player_id")
    print("  - a few events.notes_blurb values")


if __name__ == "__main__":
    main()
