#!/usr/bin/env python3
"""Regenerates data/tournaments.js, data/media.js, data/event-notes.js from
the live Aurora DB (dd-live-scoring) - the database is the system of record;
these files are its published, static-site-consumable form.

Run this any time you've fixed something in the DB and want the site to
pick it up. This script + a normal `git commit && git push` is the whole
workflow - it does NOT commit or push for you, review the diff first like
any other change.

Each file keeps its hand-written header comment (PII boundary, data-
provenance notes, TO ADD A PHOTO instructions, etc) verbatim, followed by a
GENERATED marker and a machine-built data body. Don't hand-edit the data
body - it will be overwritten the next time this runs. If the prose itself
needs to change, edit the HEADER_* constants below.

Note on output style: the data body is emitted as clean, valid
window.X = {...}; JS (quoted keys, via json.dumps) rather than reproducing
the original files' unquoted-key hand style - so the first run of this
script will show a large diff even where the underlying values haven't
changed. That's expected and one-time-ish per file; subsequent diffs after
that are just the actual data changes.

Usage: python tools/db_export_to_files.py
"""
import datetime
import json
import os
import time

import boto3
from botocore.exceptions import ClientError

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGION = "us-east-1"
CLUSTER_ARN = "arn:aws:rds:us-east-1:654700647887:cluster:dd-live-scoring"
SECRET_ARN = "arn:aws:secretsmanager:us-east-1:654700647887:secret:rds!cluster-fa08f829-599f-421d-a358-c173da062646-HVosre"
DATABASE = "ddlive"

_rds = boto3.client("rds-data", region_name=REGION)

# The cluster auto-pauses to zero capacity when idle (MinCapacity=0, see
# DEPLOYMENT.md), so the first query of a run usually lands mid-resume and
# fails with DatabaseResumingException until the ~15-second wake-up
# completes. Retry through it - this script is run by a human at a
# terminal, so the budget is generous rather than gateway-constrained.
_RESUME_RETRY_SECONDS = 120
_RESUME_ERROR_CODES = {"DatabaseResumingException", "DatabaseUnavailableException"}


def sql(text, params=None):
    kwargs = dict(resourceArn=CLUSTER_ARN, secretArn=SECRET_ARN, database=DATABASE,
                   sql=text, includeResultMetadata=True)
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
            print("  ...database is resuming from auto-pause, retrying...")
            time.sleep(3)


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


def clean_numbers(obj):
    """Postgres NUMERIC columns round-trip through Python as floats (e.g.
    74.0) even for whole-number values the source data always wrote as
    plain integers (74). Cosmetic only (JS doesn't distinguish int/float),
    but keeps the generated file readable and the diff quieter."""
    if isinstance(obj, float) and obj.is_integer():
        return int(obj)
    if isinstance(obj, dict):
        return {k: clean_numbers(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [clean_numbers(v) for v in obj]
    return obj


NOW = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

HEADER_TOURNAMENTS = f"""/*
 * Darwin Decathlon - publishable tournament data for the v2.0 live site.
 *
 * PII BOUNDARY: names only. No emails, no phone numbers, no home addresses.
 * NOTE: the 2019 rules deck lists a street address for the Bateman House
 * events. That address is deliberately NOT reproduced here - this file ships
 * to a public website. Venue is recorded as "Bateman House" only.
 *
 * Sources (all primary, from Scott's Google Drive):
 *   2015  DD1 Scorecard.pdf            + D2 2015 Rules.pdf
 *   2018  Darwin Decathlon 2018 Final Results.pdf
 *         (cross-checked against the 2018 results slide in the 2019 deck)
 *   2019  DD3 Scorecard.pdf            + Darwin Decathlon Tres 2019.pdf
 *   2021  DD 2021 Scorecard.pdf        + DD4 Recap.pdf
 *   2022  DD5 2022 FINAL SCORECARD.pdf
 *   2023  DD6 2023.pdf
 *
 * TOTALS ARE AS PRINTED on each scorecard. In several rows the printed Total
 * is 0.5 higher than the sum of the visible cells (e.g. 2018 Murrill prints 81
 * but the row sums to 80.5; 2019 Whitzel prints 75 but sums to 74.5). The
 * printed totals are what the tournament published and what Champs.html
 * records, so they are authoritative here. `sumsCleanly:false` flags the years
 * where this happens - do not "fix" these by recomputing.
 *
 * GENERATED FILE - DO NOT HAND-EDIT THE DATA BELOW.
 * The database (dd-live-scoring) is the system of record. Fix an error
 * there, then regenerate: python tools/db_export_to_files.py
 * Last generated: {NOW}
 */

"""

HEADER_EVENT_NOTES = f"""/*
 * Darwin Decathlon - event briefings.
 *
 * The prose that used to live on the v1 per-event pages (Skeet.html,
 * Shuriken.html, BeerPong.html and friends), carried forward into the v2 field
 * guide so every event page has something to actually READ - not just a table
 * of who beat whom.
 *
 * PROVENANCE
 *   Every rule below traces to one of two primary sources, recorded in `source`:
 *     "v1 page"    - the 2023 per-event rules pages in this repo. Rules are
 *                    reproduced faithfully; the surrounding prose is punched up.
 *     "2015 deck"  - DD-2015-Rules.pdf. Terse by nature (they were slides), so
 *                    these entries are shorter and honest about it.
 *     "unrecorded" - no rules sheet survives. Blurb only, and the page says so.
 *                    Do NOT invent rules for these; ask someone who was there.
 *
 * SHAPE
 *   blurb   - the hook. One or two sentences, shown under the banner.
 *   rules   - array of bullets. How the event is actually scored.
 *   snafu   - the lurking penalty for the bottom of the field. Optional.
 *   savior  - the bonus/wildcard that can rescue a round. Optional.
 *
 * Keys MUST be the CANONICAL event name used in tournaments.js - renames are
 * folded, so "Shuriken" (not "Chinese Stars"), "Shooting Gallery" (not
 * ".22 Shoot"), "Long Drive" (not "Long Golf Ball").
 *
 * GENERATED FILE - DO NOT HAND-EDIT THE DATA BELOW.
 * The database (dd-live-scoring) is the system of record. Fix an error
 * there, then regenerate: python tools/db_export_to_files.py
 * Last generated: {NOW}
 */

"""

HEADER_MEDIA = f"""/*
 * Darwin Decathlon - event photos and captions.
 *
 * TO ADD A PHOTO
 *   1. Drop the image anywhere under images/.
 *   2. Add an entry to the `media` table in the database (event must match
 *      the CANONICAL event name used in tournaments.js - renames are folded
 *      together, so use "Shuriken" (not "Chinese Stars"), "Shooting Gallery"
 *      (not ".22 Shoot") and "Long Drive" (not "Long Golf Ball")), then
 *      regenerate this file: python tools/db_export_to_files.py
 *   3. Tag `people` with competitor names EXACTLY as spelled in tournaments.js.
 *      The field guide then looks up how each tagged person actually scored in
 *      that event that year and writes the commentary itself - a correct name
 *      is what makes the joke land. Leave `people` empty and no commentary is
 *      generated, which is the right default for a photo whose subjects
 *      haven't been confirmed.
 *
 * ON CAPTIONS
 *   Captions for older, unreviewed photos are deliberately plain - better a
 *   flat caption than an invented one.
 *
 * PRIVACY
 *   `people` is names only - those already appear in published standings.
 *   Never add contact details, and never caption a photo with a street address
 *   or a precise private location. Any competitor may ask for a photo to be
 *   pulled; honour it immediately, no questions asked. Only status='approved'
 *   rows in the database are exported here - pending/rejected uploads never
 *   reach this file.
 *
 * GENERATED FILE - DO NOT HAND-EDIT THE DATA BELOW.
 * The database (dd-live-scoring) is the system of record. Fix an error
 * there, then regenerate: python tools/db_export_to_files.py
 * Last generated: {NOW}
 */

"""


# ---------------------------------------------------------------------------
# data/tournaments.js
# ---------------------------------------------------------------------------
def fetch_venues():
    vs = rows(sql(
        """SELECT venue_id, name, address, city, latitude, longitude, geo_precision, is_private_residence
           FROM venues ORDER BY venue_id"""
    ))
    out = []
    for v in vs:
        years = [r["year"] for r in rows(sql(
            """SELECT DISTINCT t.year FROM tournament_events te
               JOIN tournaments t ON t.tournament_id=te.tournament_id
               WHERE te.venue_id=:vid AND t.tournament_type='decathlon' ORDER BY t.year""",
            [param("vid", v["venue_id"])]))]
        events = [r["name"] for r in rows(sql(
            """SELECT DISTINCT e.name FROM tournament_events te
               JOIN events e ON e.event_id=te.event_id
               JOIN tournaments t ON t.tournament_id=te.tournament_id
               WHERE te.venue_id=:vid AND t.tournament_type='decathlon' ORDER BY e.name""",
            [param("vid", v["venue_id"])]))]
        # PII BOUNDARY (see CLAUDE.md): a private residence's street address
        # must NEVER be published, even if one is ever set in the database -
        # this check is deliberately redundant with "don't put one there in
        # the first place" so a future DB edit can't silently leak one.
        address = None if v["is_private_residence"] else v["address"]
        out.append({
            "name": v["name"], "address": address, "city": v["city"],
            "lat": float(v["latitude"]) if v["latitude"] is not None else None,
            "lon": float(v["longitude"]) if v["longitude"] is not None else None,
            "precision": v["geo_precision"], "private": bool(v["is_private_residence"]),
            "years": years, "events": events,
        })
    return out


def fetch_tournaments():
    ts = rows(sql(
        """SELECT tournament_id, year, title, subtitle, dates_label, location, notes,
                  max_points, sums_cleanly, champion_player_id, co_champion_player_id
           FROM tournaments WHERE tournament_type='decathlon' ORDER BY year"""
    ))
    out = []
    for t in ts:
        tid = t["tournament_id"]

        te_rows = rows(sql(
            """SELECT te.tournament_event_id, te.event_order, e.name, te.event_short_label,
                      te.event_day, te.event_time_label, te.event_clock_minutes, v.name AS venue_name,
                      e.icon_asset, te.scoring_basis, te.rules_text, te.snafu_text,
                      te.is_pair_event, te.is_debut, te.game_master
               FROM tournament_events te
               JOIN events e ON e.event_id=te.event_id
               LEFT JOIN venues v ON v.venue_id=te.venue_id
               WHERE te.tournament_id=:tid ORDER BY te.event_order""",
            [param("tid", tid)],
        ))
        event_list = []
        for e in te_rows:
            entry = {"n": e["event_order"], "name": e["name"], "short": e["event_short_label"],
                      "day": e["event_day"]}
            if e["event_time_label"] is not None:
                entry["time"] = e["event_time_label"]
            if e["event_clock_minutes"] is not None:
                entry["t"] = float(e["event_clock_minutes"])
            entry["venue"] = e["venue_name"]
            entry["icon"] = e["icon_asset"]
            entry["basis"] = e["scoring_basis"]
            if e["rules_text"] is not None:
                entry["rules"] = e["rules_text"]
            entry["snafu"] = e["snafu_text"]
            if e["is_pair_event"]:
                entry["pair"] = True
            if e["is_debut"]:
                entry["newThisYear"] = True
            if e["game_master"] is not None:
                entry["gameMaster"] = e["game_master"]
            event_list.append(entry)

        result_rows = rows(sql(
            """SELECT p.first_name, p.last_name, te.event_order, r.points_awarded
               FROM results r
               JOIN tournament_events te ON te.tournament_event_id=r.tournament_event_id
               JOIN players p ON p.player_id=r.player_id
               WHERE te.tournament_id=:tid""",
            [param("tid", tid)],
        ))
        by_player = {}
        for r in result_rows:
            name = f"{r['first_name']} {r['last_name']}".strip()
            by_player.setdefault(name, {})[r["event_order"]] = (
                float(r["points_awarded"]) if r["points_awarded"] is not None else None
            )

        overrides = {}
        if not t["sums_cleanly"]:
            ov_rows = rows(sql(
                """SELECT p.first_name, p.last_name, o.total_points FROM tournament_point_overrides o
                   JOIN players p ON p.player_id=o.player_id WHERE o.tournament_id=:tid""",
                [param("tid", tid)],
            ))
            overrides = {f"{o['first_name']} {o['last_name']}".strip(): float(o["total_points"])
                          for o in ov_rows}

        def total_for(name, points):
            if name in overrides:
                return overrides[name]
            return sum(v for v in points if v is not None)

        player_list = []
        for name, pts_by_order in sorted(by_player.items()):
            points = [pts_by_order.get(e["n"]) for e in event_list]
            player_list.append((total_for(name, points), {"name": name, "points": points}))
        player_list.sort(key=lambda x: -x[0])
        player_list = [p for _, p in player_list]

        champion_name = None
        if t["champion_player_id"]:
            cp = rows(sql("SELECT first_name, last_name FROM players WHERE player_id=:pid",
                           [param("pid", t["champion_player_id"])]))[0]
            champion_name = f"{cp['first_name']} {cp['last_name']}".strip()
        co_champion_name = None
        if t["co_champion_player_id"]:
            cp = rows(sql("SELECT first_name, last_name FROM players WHERE player_id=:pid",
                           [param("pid", t["co_champion_player_id"])]))[0]
            co_champion_name = f"{cp['first_name']} {cp['last_name']}".strip()

        champion_points = None
        if champion_name and champion_name in by_player:
            champ_points_list = [by_player[champion_name].get(e["n"]) for e in event_list]
            champion_points = total_for(champion_name, champ_points_list)

        entry = {
            "year": t["year"], "title": t["title"], "subtitle": t["subtitle"] or "",
            "dates": t["dates_label"], "location": t["location"], "champion": champion_name,
        }
        if co_champion_name:
            entry["coChampion"] = co_champion_name
        entry["championPoints"] = champion_points
        entry["maxPoints"] = float(t["max_points"]) if t["max_points"] is not None else None
        entry["sumsCleanly"] = bool(t["sums_cleanly"])
        if t["notes"]:
            entry["note"] = t["notes"]
        if overrides:
            entry["totals"] = overrides
        entry["events"] = event_list
        entry["players"] = player_list
        out.append(entry)
    return out


def build_known_champions(tournaments_out):
    out = []
    for t in tournaments_out:
        entry = {"year": t["year"], "name": t["champion"], "points": t["championPoints"],
                  "hasScorecard": True, "players": len(t["players"])}
        if t.get("coChampion"):
            entry["coChampion"] = t["coChampion"]
        out.append(entry)
    return out


def write_tournaments_js():
    venues = fetch_venues()
    tournaments = fetch_tournaments()
    known_champions = build_known_champions(tournaments)
    data = clean_numbers({"venues": venues, "tournaments": tournaments, "knownChampions": known_champions})
    body = "window.DD_DATA = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n"
    path = os.path.join(REPO_ROOT, "data", "tournaments.js")
    with open(path, "w", encoding="utf-8") as f:
        f.write(HEADER_TOURNAMENTS + body)
    print(f"Wrote {path} ({len(tournaments)} tournaments, {len(venues)} venues)")


# ---------------------------------------------------------------------------
# data/event-notes.js
# ---------------------------------------------------------------------------
def fetch_event_notes():
    es = rows(sql(
        """SELECT event_id, name, notes_blurb, notes_rules, notes_snafu, notes_savior, notes_source
           FROM events WHERE notes_blurb IS NOT NULL ORDER BY event_id"""
    ))
    out = {}
    for e in es:
        entry = {"source": e["notes_source"], "blurb": e["notes_blurb"]}
        rules = e["notes_rules"]
        if isinstance(rules, str):
            rules = json.loads(rules)
        entry["rules"] = rules or []
        if e["notes_snafu"]:
            entry["snafu"] = e["notes_snafu"]
        if e["notes_savior"]:
            entry["savior"] = e["notes_savior"]
        out[e["name"]] = entry
    return out


def write_event_notes_js():
    notes = fetch_event_notes()
    body = "window.DD_EVENT_NOTES = " + json.dumps(notes, indent=2, ensure_ascii=False) + ";\n"
    path = os.path.join(REPO_ROOT, "data", "event-notes.js")
    with open(path, "w", encoding="utf-8") as f:
        f.write(HEADER_EVENT_NOTES + body)
    print(f"Wrote {path} ({len(notes)} events)")


# ---------------------------------------------------------------------------
# data/media.js
# ---------------------------------------------------------------------------
def fetch_media():
    ms = rows(sql(
        """SELECT m.media_id, e.name AS event_name, t.year, m.blob_url, m.caption, v.name AS venue_name
           FROM media m
           JOIN events e ON e.event_id=m.event_id
           LEFT JOIN tournaments t ON t.tournament_id=m.tournament_id
           LEFT JOIN venues v ON v.venue_id=m.venue_id
           WHERE m.status='approved'
           ORDER BY e.name, m.blob_url"""
    ))
    out = []
    for m in ms:
        tags = rows(sql(
            "SELECT tag_value FROM media_tags WHERE media_id=:mid AND tag_type='participant' ORDER BY tag_value",
            [param("mid", m["media_id"])],
        ))
        entry = {"event": m["event_name"], "year": m["year"], "file": m["blob_url"],
                  "caption": m["caption"], "people": [tg["tag_value"] for tg in tags]}
        if m["venue_name"]:
            entry["venue"] = m["venue_name"]
        out.append(entry)
    return out


def write_media_js():
    media = fetch_media()
    body = "window.DD_MEDIA = " + json.dumps(media, indent=2, ensure_ascii=False) + ";\n"
    path = os.path.join(REPO_ROOT, "data", "media.js")
    with open(path, "w", encoding="utf-8") as f:
        f.write(HEADER_MEDIA + body)
    print(f"Wrote {path} ({len(media)} approved photos)")


def main():
    write_tournaments_js()
    write_event_notes_js()
    write_media_js()
    print("\nDone. Review with: git diff data/tournaments.js data/media.js data/event-notes.js")
    print("Nothing was committed or pushed - that's your call, same as any other change.")


if __name__ == "__main__":
    main()
