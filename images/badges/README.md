# Event badges

Illustrated hex badges used as the event tiles in the Chronicles view on the
site homepage. Referenced from `data/tournaments.js` as `/images/badges/...`.

## Drop-in convention

The site picks these up **automatically** — any file whose path contains
`/badges/` is rendered full-bleed with its text label suppressed, because the
artwork already carries the event name and tagline. No code change is needed to
swap artwork; just replace the file at the same path.

Use these exact filenames:

| File | Used by event(s) | Years |
|---|---|---|
| `badge-Skeet.png` | Skeet Shooting | all six |
| `badge-HomeRunDerby.png` | Home Run Derby | all six |
| `badge-Washers.png` | Washers | 2018, 2019, 2021, 2022, 2023 |
| `badge-DiscGolf.png` | Disc Golf | 2019, 2021, 2022, 2023 |
| `badge-KanJam.png` | Kan Jam | 2018, 2019, 2021, 2022, 2023 |
| `badge-CornHole.png` | Corn Hole | all six |
| `badge-BeerPong.png` | Beer Pong | all six |
| `badge-Shuriken.png` | Shuriken **and** "Chinese Stars" | 2015, 2021, 2022 |
| `badge-Kickball.png` | Kickball | 2023 |
| `badge-Shooting.png` | Shooting Gallery **and** ".22 Shoot" | 2021, 2022, 2023 |
| `badge-LongDrive.png` | "Long Golf Ball" **and** "Long Drive" | 2021, 2022, 2023 |

Two badges intentionally serve two event names each — Shuriken/Chinese Stars and
Shooting Gallery/.22 Shoot are the same activity renamed between years.

## Still missing

Six retired events have **no badge** and still fall back to the older flat
`images/D2-*.png` pictograms. They render in a "legacy" tile that keeps a text
label underneath, so they look intentional rather than broken:

- **Golden Tee** (2015)
- **Shuffle Board** (2015, 2018, 2019)
- **Darts** (2015)
- **TopGolf** (2015, 2018, 2019)
- **Go Karts** (2018 only)
- **Field Goal Kicking** (2015, 2018, 2019)

Adding a badge for any of them is just: generate the art, save it here as
`badge-<Name>.png`, and point that event's `icon` at it in
`live/data/tournaments.js`.

## Artwork notes

- **Transparent background** preferred — tiles sit on a dark charcoal surface
  (`#1a1a19`) and a baked-in background will read as a visible rectangle.
- Roughly square aspect. The tile scales to full width, so a consistent aspect
  ratio across badges keeps the grid even.
- Keep the name and tagline inside the artwork; the tile deliberately does not
  print it again.
- Careful with a shared source image: badges cropped out of a single composite
  sheet were visibly clipped at the edges. Generating each badge individually
  avoids this.
