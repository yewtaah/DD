# Roster reconciliation — flags for manual review

Generated 2026-08-02. Scope: every player appearing on any of the six primary
scorecards, reconciled against `data/roster.csv`.

**No raw emails or phone numbers appear in this file** — `data/*.md` is NOT
covered by `.gitignore`, so this file could be committed to the public repo.
Values live in `data/roster.csv` (gitignored). Keep it that way.

## Sources read (all primary, Scott's Drive, owner yewtaah@gmail.com)

| Year | File | Players |
|---|---|---|
| 2015 | `DD1 Scorecard.pdf` | 10 |
| 2018 | `Darwin Decathlon 2018 Final Results.pdf` | 8 |
| 2019 | `DD3 Scorecard.pdf` | 12 |
| 2021 | `DD 2021 Scorecard.pdf` | 12 |
| 2022 | `DD5 2022 FINAL SCORECARD.pdf` | 10 |
| 2023 | `DD6 2023.pdf` | 9 |

Contact cross-reference: `DarwinDecathlon.xlsx` → "Candidates" sheet.

Result: **21 distinct players**. `roster.csv` held 10 (the 2015 field only);
11 were added.

---

## FLAG 1 — Jason Perkins has two different emails on file

Two sources disagree:

- `DD1 Scorecard.pdf` (2015) and the existing `roster.csv` row both carry a
  **work address at his employer's domain**.
- The `DarwinDecathlon.xlsx` Candidates sheet carries a **personal gmail
  address** for the same person.

`roster.csv` currently keeps the work address (unchanged from before). The
work address is ~11 years old and he may well have changed employers.
**Needs a human decision — I did not overwrite it.**

## FLAG 2 — "Vacek" on the 2018 scorecard (resolved 2026-08-17)

The 2018 results sheet lists **surnames only**. It shows one `Vacek`, finishing
3rd on 67 points. Both **Duane Vacek** and **Dan Vacek** are historical
players, so the surname alone didn't resolve it on paper — confirmed directly
by Scott instead: it was **Duane Vacek**. `data/tournaments.js` already
recorded it that way; this just makes it definitive rather than inherited.
The same surname-only ambiguity applies to `Brown`, `Kloss` and `Register` on
that sheet, though those were never actually in question since no second
Brown/Kloss/Register has ever played.

## FLAG 3 — Five players have no contact information anywhere

Present on scorecards, absent from every contact source found:

- **Trey Wolfe** (2019 only, finished 3rd on 60)
- **Dan Vacek** (2019, 2021, 2022, 2023 — **2021 Grand Champion**)
- **Shawn East** (2021, 2022; also 2023 washers Game Master)
- **Billy Jarrell** (2021 only, one event, 32 pts)
- **Brad Klaerner** (2023 only, finished 7th on 52)

Dan Vacek having no contact record is the conspicuous one — he won a
tournament. Added to `roster.csv` with name only, blank email/phone.

## FLAG 4 — Jerry Durbin: candidate, never a player

The Candidates sheet lists a **Jerry Durbin** with an email. He does **not**
appear on any of the six scorecards. **Deliberately NOT added** to
`roster.csv` — the roster is historical players. Add him only if you want it
to double as an invite list.

## FLAG 5 — unresolved initials in scorecard official rows

- **2021**, Score Keeper row: `BJ SK DV BM SB SE DV CQ TR TK`. `SK` matches
  no 2021 player's initials. Likely a typo for `SB` (Bateman) or `TK` (Kloss).
- **2019**, Score Keeper row: `BM AC TR SS JB TW SB DV CQ JP`. `JB` matches no
  2019 player; `JP` (Jason Perkins) also officiated but did not compete that
  year. `JB` may be Billy Jarrell two years before his only recorded appearance.

Officials, not competitors — no roster impact, but they hint at attendees who
never made a scorecard.

## FLAG 6 — `data/results.csv` still only holds 2015 (superseded, see below)

`results.csv` carries per-event rows for 2015 only (10 players × 10 events).
At the time this was written, the other five tournaments were fully populated
in `data/tournaments.js` but had never been loaded into the CSV/DB path.
`data/data-provenance.md` (then `UNVERIFIED-claims.md`) described 2019/2021/2022
as needing visual transcription — that work turned out to already be done in
`tournaments.js`.

**Update:** the DB, not the CSV, is now the durable store for this. All six
tournaments' per-event results were imported into the live Aurora database
(`tournaments`/`results`/`tournament_events` tables) via
`tools/db_import_from_files.py`, and the values round-tripped correctly on
export back to `tournaments.js` (see `tools/db_export_to_files.py`) — a
second, independent validation pass that this flag's "that work now appears
to be done" assessment was correct. `results.csv` itself remains
2015-only and gitignored; it's no longer the thing that matters here.

## NOTE — 2015 totals, printed vs. computed (fixed 2026-08-17)

`DD1 Scorecard.pdf` prints Conacher **74**, Bateman **54**, Murrill **42**,
Perkins **35**. `DarwinDecathlon.xlsx` computes the same rows as **73.5**,
**53.5**, **41.5**, **34.5** — exactly 0.5 lower.

This is the source of the "consistently 0.5 low" pattern that
`data/data-provenance.md` attributes to a bad third-party AI synthesis. The
synthesis was most likely reading the **spreadsheet**, not the scorecard.

Per existing project policy the **printed total wins** — but when this note
was originally written, that policy hadn't actually been applied to 2015 in
`data/tournaments.js`: the file marked 2015 `sumsCleanly:true` with no
override, so three of these four players (everyone but the champion, whose
hero-stat number happened to be hardcoded separately) were silently showing
the computed **0.5-low** total everywhere on the live site — standings,
Career Arc, Chronicles. "No change is needed" was wrong; the change just
hadn't been made yet. Fixed via `tournament_point_overrides` in the DB
(2015 is now `sumsCleanly:false` with all four printed totals recorded),
propagated to `data/tournaments.js` via `tools/db_export_to_files.py`.

---

## Not verifiable in this session

Google **Contacts** is not an available connector (only Gmail, Calendar and
Drive are authorized). The contact column was therefore verified against
Drive's Candidates sheet, **not** against Google Contacts as requested. The
five players in FLAG 3 and the conflict in FLAG 1 are exactly what a Contacts
lookup would have resolved.
