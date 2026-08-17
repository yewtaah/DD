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

The set is themed by format: **brass** shields for individual events, **steel**
for team events. That is a visual cue, not the source of truth — the site still
reads `pair:true` in `data/tournaments.js` to decide what is a pair event.

| File | Frame | Used by event(s) | Years |
|---|---|---|---|
| `badge-Skeet.webp` | brass | Skeet Shooting | all six |
| `badge-HomeRunDerby.webp` | brass | Home Run Derby | all six |
| `badge-DiscGolf.webp` | brass | Disc Golf | 2019, 2021, 2022, 2023 |
| `badge-Shooting.webp` | brass | Shooting Gallery **and** ".22 Shoot" | 2021, 2022, 2023 |
| `badge-LongDrive.webp` | brass | "Long Golf Ball" **and** "Long Drive" | 2021, 2022, 2023 |
| `badge-Shuriken.webp` | brass | Shuriken **and** "Chinese Stars" | 2015, 2021, 2022 |
| `badge-FieldGoal.webp` | brass | Field Goal Kicking | 2015, 2018, 2019 |
| `badge-Darts.webp` | brass | Darts | 2015 |
| `badge-GoldenTee.webp` | brass | Golden Tee | 2015 |
| `badge-GoKarts.webp` | brass | Go Karts | 2018 only |
| `badge-TopGolf.webp` | brass | TopGolf | 2015, 2018, 2019 |
| `badge-BeerPong.webp` | steel | Beer Pong | all six |
| `badge-CornHole.webp` | steel | Corn Hole | all six |
| `badge-KanJam.webp` | steel | Kan Jam | 2018, 2019, 2021, 2022, 2023 |
| `badge-Washers.webp` | steel | Washers | 2018, 2019, 2021, 2022, 2023 |
| `badge-ShuffleBoard.webp` | steel | Shuffle Board | 2015, 2018, 2019 |
| `badge-Kickball.webp` | steel | Kickball | 2023 |

Two badges intentionally serve two event names each — Shuriken/Chinese Stars and
Shooting Gallery/.22 Shoot are the same activity renamed between years.

All 17 events now have a real badge; the `images/D2-*.png` legacy pictogram set
is fully retired from `data/tournaments.js` (the files remain on disk, unused).

## Outstanding

**`badge-Skeet.webp` has the wrong art.** The title reads SKEET SHOOTING
correctly, but the illustration is a TopGolf driving range and the tagline says
"TOPGOLF SHARPSHOOTER!". Shipped as-is because the title and frame are right,
but it wants regenerating — skeet opens every tournament and is the most-seen
badge on the site.

**Everything is upscaled.** The `*200.png` exports are roughly 199x270 (the
TopGolf source is closer, 437x560), against a 512 target — mostly a ~1.9x
upscale. It holds up at tile size and will look soft on a high-DPI screen.
Exporting at 512 would fix it for free.

## Banner theme split

All 17 events now have a photo banner (`index.html`'s `BANNERS` map covers every
canonical event name; nothing falls back to the plain gradient anymore). The
backdrop follows the same brass/steel split as the badge frame:

- **Individual events (brass badge) → Texas hill country.** `banner-Skeet.webp`
  is the reference: the badge rendered as a wooden sign staked in a Vacek Ranch
  pasture, windmill and fence line in frame.
- **Team events (steel badge) → cold industrial / steel.** `banner-CornHole.webp`
  is the reference: the badge floating in a dim steel-and-neon interior, no
  outdoor scene at all.

Export at **1600x873** (or any 1.83:1 image - it gets cover-cropped to that
ratio on import), full-bleed, no transparency needed. Keep the bottom third
uncluttered: the site lays a dark gradient plus the event title over the
bottom ~35% of the banner (`.gscrim` in index.html), so anything essential
down there gets partially obscured by white text.
