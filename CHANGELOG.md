# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/). Versions are
semver (`MAJOR.MINOR.PATCH`) tracked in `VERSION` — this file started life at 2.1.0,
continuing the "v2.0" the site already called itself in `CLAUDE.md`; nothing before that
was formally versioned.

## 2.3.0 — 2026-08-16

### Added
- **Gallery** tab: search and filter every photo on record (free-text search
  across caption/event/venue/people, event dropdown, year chips). Reads the
  same `window.DD_MEDIA` that Field Notes' `photosFor()` already draws from —
  one dataset, two views, so a photo added to `data/media.js` shows up in
  both automatically.
- **Stats** tab: a lifetime "baseball card" per player — tournaments played,
  titles, best finish, career average points, best event, full
  tournament-by-tournament history, event titles, and their tagged photos.
  Deep-linkable via `?player=<slug>#stats`, mirroring Field Notes'
  `?event=<slug>#notes`.
- `buildPlayerStats()` hoists per-player lifetime numbers (`PLAYERS`) out of
  the Chronicles Career Arc chart, which used to compute its own copy inline.
  Career Arc now reads from the same `PLAYERS` registry the Stats tab uses,
  so a title star on the chart and a title counted on a player's card can
  never drift apart.

### Scope notes
- Gallery and Stats are read-only views over the existing static data
  (`data/tournaments.js`, `data/media.js`) — they do not yet pull in
  moderator-approved uploads from the `dd-media` Lambda/Aurora pipeline
  built for issue #11. That's the same "public gallery still reads
  `data/media.js`" follow-up noted in 2.2.0 below, now shared by two tabs
  instead of one.

## 2.2.0 — 2026-08-15

### Added
- Photo upload for the Field Notes gallery (issue #11), AWS-only — see
  `DEPLOYMENT.md`. The "Add a photo" button now submits to a real endpoint
  instead of an `alert()`: `aws/lambda/media` (`/api/media`) stores the photo
  in a new private S3 bucket, drafts a caption and activity guess via
  Bedrock, and holds it for moderation (`media.status`) before anything is
  public.
- `admin/media-review.html`: unlinked, password-gated moderation page —
  approve/reject pending uploads, edit the AI-drafted caption, add
  participant names by hand.
- `media` / `media_tags` tables created on the existing `dd-live-scoring`
  Aurora cluster (schema already existed in `data/schema.sql`, never
  provisioned until now); added `media.status` for the moderation gate.

### Scope notes
- Participant auto-tagging (matching faces to real people) is deliberately
  **not** built — it would need a consent-collection system that doesn't
  exist. The vision call only drafts a caption + activity guess, never a
  person's identity; moderators tag people by hand.
- The public gallery still reads `data/media.js`, not the new `media` table —
  wiring approved uploads into Field Notes is a follow-up.

## 2.1.0 — 2026-08-14

### Added
- Live scorekeeping, backed by a real relational database for the first time
  (Aurora Serverless v2 PostgreSQL, accessed via the RDS Data API — see
  `DEPLOYMENT.md`). Ported `data/schema.sql` from an unprovisioned Azure SQL
  draft to Postgres, fixing a real Kickball/Shuriken naming bug and a missing
  Go Karts event in the process.
- Scorekeeper login + entry forms for **Golden Tee** (strokes over nine holes,
  great-shot points, rough/bunker and water counts) and **Corn Hole** (pairs
  to 21, with the "Belize'd" instant walk-off win recorded).
- A read-only "Live Scorekeeping" viewer on each piloted event's Field Notes
  page, showing what's been entered so far without touching Chronicles or
  the all-time standings.
- `aws/lambda/scorekeeper`: the Lambda + API Gateway behind `/api/scorekeeper`.
- `tests/test_scorekeeper_api.py`: real integration tests against the live
  API (see the file's own docstring for why these hit real infrastructure
  instead of mocking it).

### Fixed
- `data/media.js`: two photos (`WashersConacher.jpg`, `BeerPongWallDrain.webp`)
  were misfiled under Corn Hole in the previous pass; moved back to Washers
  and Beer Pong respectively.
