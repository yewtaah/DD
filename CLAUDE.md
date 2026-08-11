# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public site for the Darwin Decathlon, a private backyard tournament among friends
(darwindecathlon.com). It's a **static site with no build step, no bundler, no package
manager, and no server-side code** — plain HTML/CSS/JS deployed as-is to Azure Static
Web Apps.

- `index.html` — the whole v2.0 "LIVE" site: three tabs (DD Live, Chronicles, Field
  Notes) in one file, self-contained `<style>` and `<script>` blocks, no framework, no
  external JS dependencies. Charts in Chronicles are hand-built SVG (`el()` helper
  around `document.createElementNS`), not a charting library.
- `Weather.html` — the one surviving v1 page, built on the HTML5 UP "Stellar" template
  (`assets/css/main.css`). It's a standalone 3-day-forecast widget with no equivalent
  in `index.html`, so it wasn't retired with the rest of the v1 event pages (see below).
- `agent/natasha-persona.md` — record of the system prompt / config for "Natasha,"
  the D-ID AI persona embedded in the DD Live tab (live, not just planned). This is
  a config document, not code that runs in this repo — the source of truth is
  D-ID's own dashboard, not this file.
- `tools/*.py` — one-off Pillow scripts (`badge-key.py`, `optimize-images.py`) for
  image prep, run manually, not part of any pipeline.

## Running it locally

No install step. Serve the repo root and open the site:

```
python -m http.server 8123
```

Then visit `http://localhost:8123/` (or `/?event=<slug>#notes`, `/?year=2019`,
`/?year=ALL` to deep-link specific views — see Routing/state below).

There is no test suite, linter, or build command. `.github/workflows/main.yml` is
inert scaffolding (`echo Hello, world!`) — the real deploy pipeline is
`.github/workflows/azure-static-web-apps-*.yml`, which pushes straight to Azure
Static Web Apps on every push/PR to `main`. There is no CI gate to satisfy before
committing.

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

**Canonical event names matter.** Renamed events get folded onto one canonical key
across all three files — e.g. always `"Shuriken"` (never "Chinese Stars"),
`"Shooting Gallery"` (never ".22 Shoot"), `"Long Drive"` (never "Long Golf Ball").
`people` tags in `media.js` must exactly match a player name in `tournaments.js`, or
the field guide's auto-generated commentary for that photo silently doesn't fire.

`data/schema.sql` describes a normalized DB schema (tournaments/players/events/
venues/results/media) that the flat-file data above is meant to eventually back
onto — not implemented yet. `data/*.template.csv` are the tracked, dummy-data
examples of that schema shape.

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
  `tournaments.js`). The printed number is kept as authoritative and the
  discrepancy is documented, not "corrected." Don't recompute these.
- **Simulated data must stay labeled as simulated.** Win-probability figures in
  Chronicles are retrospective Monte Carlo output, not recorded historical odds —
  never present or generate them as if they were tracked live.
- Unverified claims live in `data/UNVERIFIED-claims.md` / `data/roster-discrepancies.md`
  rather than being silently deleted or silently trusted.

## Routing / state in index.html

- Tabs are `#live` / `#chronicles` / `#notes`, driven by `location.hash` and a
  `TABS` array — see `selectTab()`.
- `?year=2019` or `?year=ALL` deep-links Chronicles to a specific tournament or
  all-time view; `?event=<slug>#notes` deep-links Field Notes straight into one
  event's guide via `openGuide()`.
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
  redirects above. These redirects are **Azure-only**: `python -m http.server`
  won't honor them, so a locally served old URL will just 404. `Weather.html` was
  kept as-is since nothing in `index.html` replaces it.

## Licensing note

Everything in the repo is MIT (`LICENSE`) except: photographs of real people (a
copyright license can't grant likeness rights) and the HTML5 UP "Stellar" template
under `assets/` (CC BY 3.0, its own file, footer attribution required). See
`DISCLAIMER.md` for the full participant-privacy and licensing notice — treat it as
authoritative if a change touches attribution, participant data, or the Natasha persona.
