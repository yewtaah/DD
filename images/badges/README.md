# Event badges

Illustrated badges used as the event tiles in the Chronicles view on the site
homepage. Referenced from `data/tournaments.js` as `/images/badges/...`.

## Drop-in convention

The site picks these up **automatically** — any file whose path contains
`/badges/` is rendered full-bleed with its text label suppressed, because the
artwork already carries the event name and tagline. No code change is needed to
swap artwork; just replace the file at the same path.

## Making a new badge

Generated badges almost always arrive with a **fake** transparent background:
the generator paints a transparency checkerboard into the RGB pixels and hands
back a file whose alpha channel is 255 everywhere. It previews as transparent
and renders on the page as a badge sitting on a white waffle.

Run every new badge through the keyer, which floods the checkerboard out from
the border, trims, squares and re-encodes:

```sh
python tools/badge-key.py images/badges/YourExport.png images/badges/badge-Darts.webp
```

Then point that event's `icon` at it in `data/tournaments.js`. Add `--debug` to
also write a mask PNG showing exactly what got keyed.

### Artwork notes

- **Export at 512×512.** The set is 512; a 256 export gets upscaled and reads
  visibly softer than its neighbours on a high-DPI screen.
- **Transparent background**, or at minimum a plain light one the keyer can
  flood out. Tiles sit on dark charcoal (`#1a1a19`), so any baked-in background
  reads as a rectangle.
- Roughly square. The tile scales to full width, so a consistent aspect ratio
  keeps the grid even.
- Keep the name and tagline inside the artwork; the tile does not print it
  again.
- Generate each badge individually — badges cropped out of one composite sheet
  came out visibly clipped at the edges.

## Current set

| File | Used by event(s) | Years |
|---|---|---|
| `badge-Skeet.webp` | Skeet Shooting | all six |
| `badge-HomeRunDerby.webp` | Home Run Derby | all six |
| `badge-CornHole.webp` | Corn Hole | all six |
| `badge-BeerPong.webp` | Beer Pong | all six |
| `badge-KanJam.webp` | Kan Jam | 2018, 2019, 2021, 2022, 2023 |
| `badge-Washers.webp` | Washers | 2018, 2019, 2021, 2022, 2023 |
| `badge-DiscGolf.webp` | Disc Golf | 2019, 2021, 2022, 2023 |
| `badge-Shooting.webp` | Shooting Gallery **and** ".22 Shoot" | 2021, 2022, 2023 |
| `badge-LongDrive.webp` | "Long Golf Ball" **and** "Long Drive" | 2021, 2022, 2023 |
| `badge-Shuriken.webp` | Shuriken **and** "Chinese Stars" | 2015, 2021, 2022 |
| `badge-FieldGoal.webp` | Field Goal Kicking | 2015, 2018, 2019 |
| `badge-GoldenTee.webp` | Golden Tee | 2015 |
| `badge-Darts.webp` | Darts | 2015 |
| `badge-Kickball.webp` | Kickball | 2023 |

Two badges intentionally serve two event names each — Shuriken/Chinese Stars and
Shooting Gallery/.22 Shoot are the same activity renamed between years.

## Still missing

Three events have no badge and fall back to the flat `images/D2-*.png`
pictograms, which render in a "legacy" tile that keeps a text label underneath
so they look intentional rather than broken:

- **Shuffle Board** (2015, 2018, 2019)
- **TopGolf** (2015, 2018, 2019)
- **Go Karts** (2018 only)

## Known quality problem — see issue #6

The badges generated before `badge-Darts.webp` were keyed with an earlier
canvas-based method that left **visible dithered checkerboard residue** around
the artwork. It is obvious in the Chronicles grid: Skeet, Golden Tee, Home Run
Derby, Field Goal and Shuriken all sit in a speckled rectangle, and Corn Hole
has a fainter halo. Washers, Kickball and Beer Pong were never keyed at all and
are fully opaque (~6% clear pixels versus ~70% on a correctly keyed badge).

`badge-Darts.webp` is the reference for how these should look. Regenerating the
rest at 512 and running them through `tools/badge-key.py` is the fix.
