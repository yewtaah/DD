/*
 * Darwin Decathlon - event photos and captions.
 *
 * Static stand-in for the `media` / `media_tags` tables in data/schema.sql.
 * When the blob-storage pipeline lands this gets replaced by a query; until
 * then it is hand-maintained and it is the ONLY place captions live.
 *
 * TO ADD A PHOTO
 *   1. Drop the image anywhere under images/.
 *   2. Add an entry below. `event` must match the CANONICAL event name used in
 *      tournaments.js - renames are folded together, so use "Shuriken" (not
 *      "Chinese Stars"), "Shooting Gallery" (not ".22 Shoot") and "Long Drive"
 *      (not "Long Golf Ball").
 *   3. Tag `people` with competitor names EXACTLY as spelled in tournaments.js.
 *      The field guide then looks up how each tagged person actually scored in
 *      that event that year and writes the commentary itself - a correct name
 *      is what makes the joke land. Leave `people` empty and no commentary is
 *      generated, which is the right default for a photo whose subjects
 *      haven't been confirmed.
 *
 * ON CAPTIONS
 *   Captions for the older images below are deliberately plain: those photos
 *   have not been reviewed to confirm who is in them or which year they are
 *   from. Better a flat caption than an invented one. Tag `people` and `year`
 *   as they get identified and the page fills itself in.
 *
 * PRIVACY
 *   `people` is names only - those already appear in published standings.
 *   Never add contact details, and never caption a photo with a street address
 *   or a precise private location. Any competitor may ask for a photo to be
 *   pulled; honour it immediately, no questions asked.
 */

window.DD_MEDIA = [
  /* ---------- confirmed ---------- */
  {
    event: "Home Run Derby", year: 2021,
    file: "../images/HRD2021.JPG",
    caption: "Terry Register steps in, ready for his swing at the plate.",
    people: ["Terry Register"], venue: "Vacek Ranch"
  },
  {
    event: "Kan Jam", year: 2021,
    // Filename originally read 2018; corrected to 2021 - the windmill and
    // outbuildings match the Vacek Ranch photos in DD4 Recap.pdf, and the
    // ranch did not host the tournament until 2021.
    file: "../images/KanJam2021Windmill.png",
    caption: "Kan Jam at dusk under the windmill, cornhole boards still set up alongside.",
    people: [], venue: "Vacek Ranch"
  },
  {
    event: "Shuffle Board", year: 2019,
    file: "../images/Shuffleboard.jpg",
    caption: "Shuffleboard night at Rosenberger Construction, who opened up the office for the Friday session.",
    people: [], venue: "Rosenberger Construction"
  },
  {
    event: "Shuffle Board", year: 2019,
    file: "../images/Shuffleboard2.jpg",
    caption: "The board at Rosenberger Construction - eight throws, puck fully over the line to count.",
    people: [], venue: "Rosenberger Construction"
  },
  {
    event: "TopGolf", year: 2018,
    file: "../images/DarwinTopGolf2018.jpg",
    caption: "The 2018 field at TopGolf.",
    people: [], venue: "TopGolf"
  },

  /* ---------- archive: matched by filename, details unconfirmed ---------- */
  { event: "Skeet Shooting", year: null, file: "../images/Skeet.jpg",
    caption: "Skeet - the event that has opened every tournament since 2015.", people: [] },
  { event: "Skeet Shooting", year: null, file: "../images/Skeet2.jpg",
    caption: "Clay in the air.", people: [] },
  { event: "Skeet Shooting", year: null, file: "../images/Skeet3.jpg",
    caption: "Shotguns away before the beers come out - the tradition, and the reason skeet goes first.", people: [] },

  { event: "Shooting Gallery", year: null, file: "../images/ShootingGallery.jpg",
    caption: "The shooting gallery - clay targets in the tree line, .22 rifle.", people: [] },

  { event: "Long Drive", year: null, file: "../images/LongDrive.jpg",
    caption: "Long drive - furthest ball wins, five shots to find it.", people: [] },

  { event: "Home Run Derby", year: null, file: "../images/HomeRunDerby.jpg",
    caption: "Ten swings, most home runs. The event that started the whole idea.", people: [] },

  { event: "Kan Jam", year: null, file: "../images/KanJam.jpg",
    caption: "Team precision frisbee at thirty feet.", people: [] },

  { event: "Corn Hole", year: null, file: "../images/CornHole.jpg",
    caption: "Corn hole - bags on the board, teams on the same side.", people: [] },

  { event: "Beer Pong", year: null, file: "../images/BeerPong.jpg",
    caption: "The grand finale, and the one event nobody has ever claimed to be sober for.", people: [] },

  { event: "Washers", year: null, file: "../images/Washers.jpg",
    caption: "Washers - play to exactly 21, bust and you go back to 11.", people: [] },

  { event: "Disc Golf", year: null, file: "../images/DiscGolf.jpg",
    caption: "Disc golf - lowest total strokes takes it.", people: [] },
  { event: "Disc Golf", year: null, file: "../images/DiscGolf2.jpg",
    caption: "Out on the course.", people: [] },

  { event: "Shuriken", year: null, file: "../images/Shuriken.jpg",
    caption: "Throwing stars and knives - banned after 2015 over neighbour concerns, pardoned in 2021.", people: [] },

  { event: "Field Goal Kicking", year: null, file: "../images/FieldGoal.jpg",
    caption: "Field goals - start close, move back five yards a round until only one kicker is left.", people: [] },

  { event: "TopGolf", year: null, file: "../images/TopGolf.jpg",
    caption: "TopGolf - highest score, and a Jaeger shot waiting on the red target.", people: [] },
  { event: "TopGolf", year: null, file: "../images/TopGolf2.jpg",
    caption: "In the bay.", people: [] },

  { event: "Go Karts", year: 2018, file: "../images/GoKarts.jpg",
    caption: "Go karts - contested exactly once, in 2018, and never seen again.", people: [] },
  { event: "Go Karts", year: 2018, file: "../images/RaceCars.jpg",
    caption: "The 2018 grid.", people: [] }
];
