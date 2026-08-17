# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public site for the Darwin Decathlon, a private backyard tournament among friends
(darwindecathlon.com). The frontend is a **static site with no build step, no
bundler, and no package manager** — plain HTML/CSS/JS. It does have a small
server-side component (`api/`): a Q&A chatbot backend, duplicated as an Azure
Function and an AWS Lambda so it can run on either of the two clouds the site
is deployed to in parallel — see **Deployment**, below.

- `index.html` — the whole v2.0 "LIVE" site: five tabs (DD Live, Chronicles, Field
  Notes, Gallery, Stats) in one file, self-contained `<style>` and `<script>` blocks,
  no framework, no external JS dependencies. Charts in Chronicles are hand-built SVG
  (`el()` helper around `document.createElementNS`), not a charting library. Gallery
  (search/filter over every photo) and Stats (a lifetime "baseball card" per player)
  are pure client-side views over the same `window.DD_DATA`/`DD_MEDIA` globals every
  other tab reads — no separate data source, no new network calls.
- `Weather.html` — the one surviving v1 page, built on the HTML5 UP "Stellar" template
  (`assets/css/main.css`). It's a standalone 3-day-forecast widget with no equivalent
  in `index.html`, so it wasn't retired with the rest of the v1 event pages (see below).
- `agent/natasha-persona.md` — record of the system prompt / config for "Natasha,"
  the D-ID AI persona embedded in the DD Live tab (live, not just planned). This is
  a config document, not code that runs in this repo — the source of truth is
  D-ID's own dashboard, not this file.
- `api/` — the chatbot backend that answers tournament Q&A in the DD Live tab.
  Grounds itself only in `data/tournaments.js`, fetched live from whichever cloud is
  serving it (see [`DEPLOYMENT.md`](DEPLOYMENT.md)) — never the gitignored CSVs.
- `aws/lambda/` — the AWS-only backends with no Azure equivalent: `scorekeeper`
  (live scorekeeping writes) and `media` (photo upload + AI-drafted captions +
  moderation gate). Both talk to the Aurora Postgres cluster via the RDS Data API.
  See [`DEPLOYMENT.md`](DEPLOYMENT.md).
- `admin/media-review.html` — unlinked (URL-only), password-gated moderation page
  for photo uploads. Approve/reject, edit the AI-drafted caption, tag people by hand.
- `tools/*.py` — run-manually scripts, not part of any pipeline: `badge-key.py` /
  `optimize-images.py` for image prep, and `db_import_from_files.py` /
  `db_export_to_files.py` for the database (see "Data architecture" below —
  these two are how `data/*.js` actually gets edited now).

## Deployment

This site runs on **two independent, fully-live cloud deployments at once** —
AWS and Azure — both auto-deploying from every push to `main`. AWS currently
serves `darwindecathlon.com`; Azure is kept running as a warm fallback,
reachable at its own hostname. Full architecture, request-flow diagrams for
both clouds, and the reasoning behind keeping both live:
**[`DEPLOYMENT.md`](DEPLOYMENT.md)**.

## Running it locally

No install step. Serve the repo root and open the site:

```
python -m http.server 8123
```

Then visit `http://localhost:8123/` (or `/?event=<slug>#notes`, `/?year=2019`,
`/?year=ALL` to deep-link specific views — see Routing/state below).

There is no linter or build command for the frontend. `tests/test_scorekeeper_api.py`
is the one real test suite in the repo, covering the live-scorekeeping API
(`aws/lambda/scorekeeper`) — integration tests against the actual deployed
endpoint, not mocks; see the file's docstring for why and how to run it.
`.github/workflows/main.yml` is inert scaffolding (`echo Hello, world!`). There is no
CI gate to satisfy before committing. `.github/workflows/azure-static-web-apps-*.yml`
is one of the two deploy pipelines — see **Deployment**, above, for the other (AWS Amplify,
which has no checked-in workflow file since it deploys via a direct
repo webhook instead).

To sanity-check a change visually, a headless-browser screenshot/DOM-dump against
the local server (Edge `--headless=new --dump-dom` or `--screenshot`) is the
established pattern in this repo — see `.claude/settings.local.json` for the exact
invocations previously used.

## Data architecture (read this before touching index.html)

`index.html` renders entirely from three globals loaded via plain `<script src>` tags,
in this order:

1. `data/tournaments.js` → `window.DD_DATA` — venues + every tournament's results.
   This is the source of truth for scores, standings, champions, and win-probability
   simulations.
2. `data/event-notes.js` → `window.DD_EVENT_NOTES` — rules/blurb/snafu prose per
   event, keyed by **canonical event name**.
3. `data/media.js` → media captions/tags, keyed the same way.

That much hasn't changed. What has: **as of 2026-08-17, these three files are
generated, not hand-edited.** The Aurora Postgres cluster (`dd-live-scoring`,
`data/schema.sql`) is the actual system of record now. To fix a wrong score, a
typo'd caption, or a missing rule, edit the database and run
`python tools/db_export_to_files.py` — it rewrites all three files from the DB and
leaves each one's hand-written header comment (PII boundary, provenance notes)
untouched, only the data body is regenerated. **Don't hand-edit the data body of
these three files directly** — the next export will silently overwrite it.
`tools/db_import_from_files.py` is the reverse direction, a one-time backfill run
once to get the DB caught up to what the files had; it's not part of the normal
workflow going forward. Both scripts write real IAM-credentialed DB traffic, so if
an agent tries to run them and is blocked, that's a deliberate guardrail (see
`DEPLOYMENT.md`) — bundle the fix into a script and hand it to a human to run,
same as any other live-DB mutation in this repo.

**Canonical event names matter.** Renamed events get folded onto one canonical key
across all three files — e.g. always `"Shuriken"` (never "Chinese Stars"),
`"Shooting Gallery"` (never ".22 Shoot"), `"Long Drive"` (never "Long Golf Ball").
`people` tags in `media.js` must exactly match a player name in `tournaments.js`, or
the field guide's auto-generated commentary for that photo silently doesn't fire.
This still holds with the DB as source — `events.name`/`events.slug` are the
canonical key there too, and `tools/db_import_from_files.py`'s player/venue/event
matching is exact-name-only by design (never auto-creates on a near-miss).

`data/schema.sql` describes the normalized DB schema (tournaments/players/events/
venues/results/media) the flat-file data above is generated from — implemented as
of 2026-08-17 (see the export-pipeline paragraph above). `data/*.template.csv` are
the tracked, dummy-data examples of that schema shape; the real gitignored CSVs
were never the DB's data source and remain irrelevant to this pipeline.

### The PII boundary — the one rule that overrides normal instincts here

This is a public repo about real, named private individuals. There is a hard line
between what's published and what's gitignored:

- **Published (tracked in git):** `data/tournaments.js`, `data/event-notes.js`,
  `data/media.js` — names, event scores, finishing positions, photos. These are
  PII-scrubbed by construction.
- **Never published (gitignored, `data/*.csv` except `*.template.csv`):**
  `data/roster.csv`, `data/results.csv`, `data/venues.csv`,
  `data/tournament_events.csv` — real working data that carries emails, phone
  numbers, and one private home address.
- **Never wire `index.html` (or the Natasha agent) to the `.csv` files.** Only
  `data/tournaments.js` and `data/schema.sql` are approved grounding sources — this
  is stated explicitly in the `index.html` header comment and in
  `agent/natasha-persona.md`.
- Venue entries carry a `precision` field (`rooftop` / `parcel` / `locality` /
  `unknown`) and a `private` flag. Anything `private:true` (e.g. "Bateman House",
  "Vacek Ranch") is deliberately geocoded only to locality precision — never
  tighten this or attach a street address, even though one exists in a source PDF
  in the repo (`DD-2015-Rules.pdf`).
- If asked to add/import real tournament data, keep contact info out of any
  git-tracked file, and don't relax the `.gitignore` rule for `data/*.csv`.

### Data-integrity conventions

- **Printed totals win.** Several historical scorecards have a printed Total that
  doesn't match the sum of visible cells (flagged via `sumsCleanly:false` in
  `tournaments.js`, `tournament_point_overrides` in the DB). The printed number is
  kept as authoritative and the discrepancy is documented, not "corrected." Don't
  recompute these.
- **Simulated data must stay labeled as simulated.** Win-probability figures in
  Chronicles are retrospective Monte Carlo output, not recorded historical odds —
  never present or generate them as if they were tracked live.
- **Nothing on the site hedges.** Scott made a deliberate call (2026-08-17) that
  the site never presents data as "unverified" or "a claim pending confirmation" —
  if something is genuinely unknown, ask him directly and record his answer as
  definitive, rather than shipping a hedge like "(unconfirmed)" into published
  content. `data/data-provenance.md` records sourcing and past corrections as
  settled history, not open questions; `data/roster-discrepancies.md` is private
  roster/contact bookkeeping (never surfaced on the site) and can still flag things
  for his review, but public-facing data itself should read as fact.

## Routing / state in index.html

- Tabs are `#live` / `#chronicles` / `#notes` / `#gallery` / `#stats`, driven by
  `location.hash` and a `TABS` array — see `selectTab()`.
- `?year=2019` or `?year=ALL` deep-links Chronicles to a specific tournament or
  all-time view; `?event=<slug>#notes` deep-links Field Notes straight into one
  event's guide via `openGuide()`; `?player=<slug>#stats` does the same for a
  Stats card via `openStatsCard()`.
- `staticwebapp.config.json` 301-redirects the old `/live` and `/live/*` paths to
  `/` (the v2 site used to be served from `/live/`) and blocks `/data/*.csv` from
  being served (404) even though the templates are static files in the deployed
  output — the real per-tournament CSVs are gitignored so this is a redundant
  belt-and-suspenders rule, not the actual PII control.
- The v1 per-event pages (`Skeet.html`, `Champs.html`, etc.) were removed from the
  repo and now live only as 301 redirects in `staticwebapp.config.json`, each
  pointing at its field-guide entry (`/?event=<slug>#notes`) or Chronicles
  (`/#chronicles`). Azure SWA route rules apply before static file serving, so this
  works even though the files no longer exist — same mechanism as the `/live`
  redirects above. **This file governs Azure's deployment specifically** — the AWS
  deployment reads none of it; its equivalent redirect/header rules live in AWS
  Amplify's own app config, ported by hand from this file (see
  [`DEPLOYMENT.md`](DEPLOYMENT.md)). If you change routing behavior here, the
  Amplify side needs the same change made separately or the two clouds will
  silently diverge. Either way, none of these redirects fire under
  `python -m http.server`: a locally served old URL just 404s. `Weather.html` was
  kept as-is since nothing in `index.html` replaces it.

## Licensing note

Everything in the repo is MIT (`LICENSE`) except: photographs of real people (a
copyright license can't grant likeness rights) and the HTML5 UP "Stellar" template
under `assets/` (CC BY 3.0, its own file, footer attribution required). See
`DISCLAIMER.md` for the full participant-privacy and licensing notice — treat it as
authoritative if a change touches attribution, participant data, or the Natasha persona.
