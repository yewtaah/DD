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

## FLAG 2 — "Vacek" on the 2018 scorecard is ambiguous

The 2018 results sheet lists **surnames only**. It shows one `Vacek`, finishing
3rd on 67 points. Both **Duane Vacek** and **Dan Vacek** are historical
players, so the surname alone does not resolve it.

`live/data/tournaments.js` records this as **Duane Vacek**. That is plausible
— Duane appears in 2019 and Dan's first confirmed appearance is also 2019 —
but the 2018 scorecard itself does not prove it. Inherited, not verified.
The same ambiguity applies to `Brown`, `Kloss` and `Register` on that sheet,
though those are unambiguous in practice since no second Brown/Kloss/Register
has ever played.

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

## FLAG 6 — `data/results.csv` still only holds 2015

`results.csv` carries per-event rows for 2015 only (10 players × 10 events).
The other five tournaments are fully populated in `live/data/tournaments.js`
but have never been loaded into the CSV/DB path. `UNVERIFIED-claims.md`
describes 2019/2021/2022 as needing visual transcription — **that work now
appears to be done** in `tournaments.js`. Out of scope for this pass; the
roster is complete regardless.

## NOTE — 2015 totals, printed vs. computed (not a new issue)

`DD1 Scorecard.pdf` prints Conacher **74**, Bateman **54**, Murrill **42**,
Perkins **35**. `DarwinDecathlon.xlsx` computes the same rows as **73.5**,
**53.5**, **41.5**, **34.5** — exactly 0.5 lower.

This is the source of the "consistently 0.5 low" pattern that
`UNVERIFIED-claims.md` attributes to a bad third-party AI synthesis. The
synthesis was most likely reading the **spreadsheet**, not the scorecard.
Per existing project policy the **printed total wins**, so 74 stands and no
change is needed — but the log's framing of that source as simply "wrong"
could be softened to "read the wrong artifact".

---

## Not verifiable in this session

Google **Contacts** is not an available connector (only Gmail, Calendar and
Drive are authorized). The contact column was therefore verified against
Drive's Candidates sheet, **not** against Google Contacts as requested. The
five players in FLAG 3 and the conflict in FLAG 1 are exactly what a Contacts
lookup would have resolved.
