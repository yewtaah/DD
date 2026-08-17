# Data provenance

Where the tournament history comes from, and the corrections made getting it
right. Everything below is settled — nothing here is a pending question;
where something was once uncertain, the resolution and who made the call are
recorded alongside it.

**Primary sources** (all in Scott's Google Drive, owner `yewtaah@gmail.com`):

| Year | Scorecard | Rules deck |
|---|---|---|
| 2015 | `DD1 Scorecard.pdf` | `D2 2015 Rules.pdf` |
| 2018 | `Darwin Decathlon 2018 Final Results.pdf` | — |
| 2019 | `DD3 Scorecard.pdf` | `Darwin Decathlon Tres 2019.pdf` |
| 2021 | `DD 2021 Scorecard.pdf` | — |
| 2022 | `DD5 2022 FINAL SCORECARD.pdf` | — |
| 2023 | `DD6 2023.pdf` | — |

Six tournaments, 2015–2023. No others were held — the DD1–DD6 numbering is
complete, confirmed directly by Scott (2026-08-17).

---

## Champions

Every champion is sourced from the original scorecard. 2015–2022 were also
cross-checked against `Champs.html` when this record was first built (that
page is since retired — a v1 page, 301-redirected into Chronicles per
`CLAUDE.md`'s routing notes). 2023 is sourced from `DD6 2023.pdf` directly,
same as it's cited in `data/tournaments.js`'s own header, and its values
round-tripped unchanged through the 2026-08-17 database migration — the DB
was backfilled from this exact data and exported it back out byte-identical
on every value that matters, an independent second confirmation.

| Year | Champion | Points | Field |
|---|---|---|---|
| 2015 | Andy Conacher | 74 | 10 |
| 2018 | Ben Murrill | **81** (highest winning score on record) | 8 |
| 2019 | Ryan Whitzel | 75 | 12 (largest field) |
| 2021 | Dan Vacek | 71 | 12 |
| 2022 | Cameron Brown *and* Terry Register | 65 each — **the tie** | 10 |
| 2023 | Cameron Brown (2nd title) | 76 | 9 |

2018's 3rd-place finisher (67 pts) was recorded only as "Vacek" on that
year's scorecard — surname only, and both Duane and Dan Vacek are real
players. Confirmed directly by Scott (2026-08-17): **Duane Vacek**.

## Event lineups

| Year | Events |
|---|---|
| 2015 | Skeet, Golden Tee, Shuffleboard, Darts, Home Run Derby, TopGolf, Field Goal, Shuriken, Corn Hole, Beer Pong |
| 2018 | Skeet, Derby, Shuffleboard, Washers, Go Karts, TopGolf, Field Goal, Corn Hole, Kan Jam, Beer Pong |
| 2019 | Skeet, HR Derby, Washers, Shuffleboard, Disc Golf, Field Goal, TopGolf, Kan Jam, Corn Hole, Beer Pong |
| 2021 | Skeet, HR Derby, Washers, Long Drive, Disc Golf, Shooting Gallery, Shuriken, Corn Hole, Kan Jam, Beer Pong |
| 2022 | Skeet, HR Derby, Washers, Disc Golf, Kan Jam, Shooting Gallery, Long Drive, Shuriken, Corn Hole, Beer Pong |
| 2023 | Skeet, HR Derby, Washers, Kan Jam, Corn Hole, Shooting Gallery, Long Drive, Disc Golf, Kickball, Beer Pong |

- Disc Golf introduced 2019.
- Long Drive (golf) introduced 2021.
- The country shooting gallery introduced 2021.
- Go Karts contested exactly once, 2018, at **K1 Speed** (Katy / Houston, TX
  area — confirmed directly by Scott, 2026-08-17; no street address on file).
- Shuriken returned in 2021 after its 2015 exile, and continued in 2022 and
  2023 under the same canonical name (renamed "Chinese Stars" and
  ".22 Shoot"/"Shooting Gallery" in various years' scorecards — folded to one
  canonical key everywhere, per `CLAUDE.md`'s canonical-event-name rule).
- Kickball replaced Shuriken in the rotation starting 2023.
- The **points-per-event scale follows field size**: 8 players in 2018 → 52
  points per event; 10–12 players → 55. The rule is "10 for 1st, 9 for 2nd, …",
  so the total depends on how many players showed up.

---

## A bad third-party synthesis (rejected, 2026-08-02)

Someone pasted an AI-generated summary of tournament history that got
several things wrong, consistently in the same direction:

| Claim | Actual | Error |
|---|---|---|
| Andy Conacher 73.5 pts | **74** | 0.5 low |
| Ryan Whitzel 74.5 pts | **75** | 0.5 low |
| Cameron Brown 70.5 pts (2019) | **71** | 0.5 low |
| Ben Murrill 52 pts as 2019 4th | 52 is right, but framed as a different year's dataset | misattributed |
| The 10-player scorecard is "2018 Dos" | It is **2015** — deck titled "1ST ANNUAL … July 31 – August 1 2015" | wrong year |
| Andy Conacher took the 2018 Grand Championship | **Ben Murrill, 81 pts**; Conacher finished **5th** on 64 | wrong |
| Shuriken "banned in 2015" | Shuriken was **event #8 in 2015** (Sat 4pm, Bateman House) | fabricated |

Pattern: point totals consistently 0.5 below actual, years shifted by one
tournament. That source was most likely reading `DarwinDecathlon.xlsx` — see
"2015 printed vs. computed totals" below, which explains exactly where the
0.5-low pattern comes from — rather than the actual scorecards. Recorded
here, not deleted, so the same wrong numbers don't get re-imported later.

## 2015 printed vs. computed totals (fixed 2026-08-17)

`DD1 Scorecard.pdf` prints Conacher **74**, Bateman **54**, Murrill **42**,
Perkins **35**. A companion spreadsheet, `DarwinDecathlon.xlsx`, computes the
same four rows as **73.5**, **53.5**, **41.5**, **34.5** — exactly 0.5 lower
each time, and is the direct source of the rejected synthesis's "0.5 low"
error pattern above (it read the spreadsheet, not the scorecard).

Per this project's standing policy, the printed total is authoritative. That
policy exists in `data/tournaments.js` as `tournaments.sumsCleanly` /
`tournament_point_overrides` in the database — 2015 is now flagged
`sumsCleanly:false` with all four printed totals recorded as overrides, the
same mechanism already used for 2018/2019/2022/2023. (For a while this fix
hadn't actually been applied even though the policy called for it — three of
the four players were silently showing the 0.5-low computed total across the
site. That's what "fixed 2026-08-17" above refers to.)

---

## Venue addresses (confirmed 2026-08-17)

| Venue | Address |
|---|---|
| American Shooting Centers | 16500 Westheimer Pkwy, Houston, TX 77082 |
| TopGolf Houston (I-10) | 1030 Memorial Brook Blvd, Houston, TX 77084 |
| Rosenberger Construction | 21501 Park Row Blvd #300, Katy, TX 77449 |
| Stars Sports Bar | 414 W Grand Pkwy S #190, Katy, TX 77494 |
| K1 Speed (2018 Go Karts) | Katy / Houston, TX — general area only, no street address on file |

Bateman House and Vacek Ranch are private residences and are excluded from
this on purpose — see the PII boundary in `CLAUDE.md`. Neither has an
address in the database, and both scripts in `tools/`
(`db_import_from_files.py`, `db_export_to_files.py`) refuse to write one for
either even if the database somehow acquires one later.

---

## Event-level data: fully loaded

Every tournament, 2015 through 2023, has real per-event scores in
`data/tournaments.js` — all of it transcribed from the primary scorecards
above, none of it unvalidated flat-text extraction. Independently
re-validated during the 2026-08-17 database migration: all 564 individual
results were imported into Aurora (`tools/db_import_from_files.py`) and
exported back out unchanged (`tools/db_export_to_files.py`), which would
have surfaced any column-misalignment as a value that didn't round-trip.
None did.
