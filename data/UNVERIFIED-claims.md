# Claim verification log

Status of third-party claims about Darwin Decathlon history, checked against
primary sources.

**Primary sources** (all in Scott's Google Drive, owner `yewtaah@gmail.com`):

| Year | Scorecard | Rules deck |
|---|---|---|
| 2015 | `DD1 Scorecard.pdf` | `D2 2015 Rules.pdf` |
| 2018 | `Darwin Decathlon 2018 Final Results.pdf` | — |
| 2019 | `DD3 Scorecard.pdf` | `Darwin Decathlon Tres 2019.pdf` |
| 2021 | `DD 2021 Scorecard.pdf` | — |
| 2022 | `DD5 2022 FINAL SCORECARD.pdf` | — |

---

## VERIFIED — champions

Every champion below is confirmed by the original scorecard **and** independently
matches `Champs.html`. Two sources, exact agreement.

| Year | Champion | Points | Field |
|---|---|---|---|
| 2015 | Andy Conacher | 74 | 10 |
| 2018 | Ben Murrill | **81** (highest winning score on record) | 8 |
| 2019 | Ryan Whitzel | 75 | 12 (largest field) |
| 2021 | Dan Vacek | 71 | 12 |
| 2022 | Cameron Brown *and* Terry Register | 65 each — **the tie** | 10 |

---

## VERIFIED — event lineups (rotation confirmed)

| Year | Events |
|---|---|
| 2015 | Skeet, Golden Tee, Shuffleboard, Darts, Home Run Derby, TopGolf, Field Goal, Shuriken, Corn Hole, Beer Pong |
| 2018 | Skeet, Derby, Shuffleboard, Washers, **Go Karts**, TopGolf, Field Goal, Cornhole, Kan Jam, Pong |
| 2019 | Skeet, HR Derby, Washers, Shuffleboard, **Disc Golf**, Field Goals, TopGolf, Kan Jam, Corn Hole, Beer Pong |
| 2021 | Skeet, HR Derby, Washers, **Long Golf Ball**, Disc Golf, **Shooting Gallery**, **Shuriken**, Corn Hole, Kan Jam, Beer Pong |
| 2022 | Skeet, HR Derby, Washers, Disc Golf, Kan Jam, **.22 Shoot**, Corn Hole, **Long Drive**, **Chinese Stars**, Beer Pong |

Confirms these previously-unverified claims:
- Disc Golf introduced **2019** — CONFIRMED
- "Long Ball" golf drive introduced **2021** — CONFIRMED
- Country shooting gallery **2021** — CONFIRMED
- Go Karts were a 2018 event — CONFIRMED (supports the "K1 Speed" venue claim,
  though the venue itself is still unconfirmed)
- Shuriken returned in **2021** and continued in 2022 as "Chinese Stars" — CONFIRMED

Also note the **points-per-event scale follows field size**: 8 players in 2018 →
52 points per event; 10-12 players → 55. The rule is "10 for 1st, 9 for 2nd, …",
so the total depends on how many players show up.

---

## REJECTED — contradicted by primary sources

From a third-party AI synthesis pasted 2026-08-02. Every numeric claim it made
was wrong in the same direction.

| Claim | Truth | Verdict |
|---|---|---|
| Andy Conacher 73.5 pts | **74** | WRONG (0.5 low) |
| Ryan Whitzel 74.5 pts | **75** | WRONG (0.5 low) |
| Cameron Brown 70.5 pts (2019) | **71** | WRONG (0.5 low) |
| Ben Murrill 52 pts as 2019 4th | 52 is right, but framed as a different year's dataset | MISATTRIBUTED |
| The 10-player scorecard is "2018 Dos" | It is **2015** — deck titled "1ST ANNUAL … July 31 – August 1 2015" | WRONG YEAR |
| Andy Conacher took the 2018 Grand Championship | **Ben Murrill, 81 pts**; Conacher finished **5th** on 64 | WRONG |
| Shuriken "banned in 2015" | Shuriken was **event #8 in 2015** (Sat 4pm, Bateman House) | FABRICATED |

**Pattern:** point totals consistently 0.5 below actual, and years shifted by one
tournament. Do not use this source for numbers or dates.

---

## STILL UNVERIFIED

- Venue names for 2018 (American Shooting Center / K1 Speed claimed), 2019, 2021, 2022.
  The 2021/2022 scorecards reference the Vacek Ranch family of venues indirectly
  but do not state addresses.
- Whether tournaments were held in 2016, 2017 or 2020. The numbering
  (DD1=2015, DD2=2018, DD3=2019, DD4=2021, DD5=2022, DD6=2023) implies **no**,
  but absence of a scorecard is not proof.
- Disc golf closest-to-pin hole number: current site says hole #9, the synthesis
  claimed hole #10 for 2019. Likely changed between years — needs the 2019 deck.

---

## NOT YET LOADED — event-level data

Champion/total data for all five years is verified and loaded. **Per-event scores
are only loaded for 2015.**

For 2018 the extracted text is clean (8 players x 10 events, no gaps) and could be
loaded directly. For **2019, 2021 and 2022** the text extraction is unreliable —
players missed events, so values no longer line up with their column headers, and
the 2021 extraction interleaves headers with data. Those three need the scorecard
rendered visually and read column-by-column before loading, exactly as was done
for 2015. Loading them from the flat text would silently assign scores to the
wrong events.
