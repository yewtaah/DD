/*
 * Darwin Decathlon - event photos and captions.
 *
 * TO ADD A PHOTO
 *   1. Drop the image anywhere under images/.
 *   2. Add an entry to the `media` table in the database (event must match
 *      the CANONICAL event name used in tournaments.js - renames are folded
 *      together, so use "Shuriken" (not "Chinese Stars"), "Shooting Gallery"
 *      (not ".22 Shoot") and "Long Drive" (not "Long Golf Ball")), then
 *      regenerate this file: python tools/db_export_to_files.py
 *   3. Tag `people` with competitor names EXACTLY as spelled in tournaments.js.
 *      The field guide then looks up how each tagged person actually scored in
 *      that event that year and writes the commentary itself - a correct name
 *      is what makes the joke land. Leave `people` empty and no commentary is
 *      generated, which is the right default for a photo whose subjects
 *      haven't been confirmed.
 *
 * ON CAPTIONS
 *   Captions for older, unreviewed photos are deliberately plain - better a
 *   flat caption than an invented one.
 *
 * PRIVACY
 *   `people` is names only - those already appear in published standings.
 *   Never add contact details, and never caption a photo with a street address
 *   or a precise private location. Any competitor may ask for a photo to be
 *   pulled; honour it immediately, no questions asked. Only status='approved'
 *   rows in the database are exported here - pending/rejected uploads never
 *   reach this file.
 *
 * GENERATED FILE - DO NOT HAND-EDIT THE DATA BELOW.
 * The database (dd-live-scoring) is the system of record. Fix an error
 * there, then regenerate: python tools/db_export_to_files.py
 * Last generated: 2026-08-17 10:19
 */

window.DD_MEDIA = [
  {
    "event": "Beer Pong",
    "year": null,
    "file": "/images/BeerBongStart.jpg",
    "caption": "Cups racked, game about to start.",
    "people": []
  },
  {
    "event": "Beer Pong",
    "year": null,
    "file": "/images/BeerPongFinish.jpg",
    "caption": "Cups scattered across the grass after the game broke up.",
    "people": []
  },
  {
    "event": "Beer Pong",
    "year": null,
    "file": "/images/BeerPong.jpg",
    "caption": "The grand finale, and the one event nobody has ever claimed to be sober for.",
    "people": []
  },
  {
    "event": "Beer Pong",
    "year": null,
    "file": "/images/BeerPongLeaflock.jpg",
    "caption": "A night match at Leaflock.",
    "people": []
  },
  {
    "event": "Beer Pong",
    "year": null,
    "file": "/images/BeerPongSetup.jpg",
    "caption": "Setting up for a solo practice round.",
    "people": []
  },
  {
    "event": "Beer Pong",
    "year": null,
    "file": "/images/BeerPongWallDrain.webp",
    "caption": "Racking cups on a folding table in the yard.",
    "people": [
      "Jason Wall"
    ]
  },
  {
    "event": "Beer Pong",
    "year": null,
    "file": "/images/BeerPongWall.jpg",
    "caption": "Jason Wall calls his shot.",
    "people": [
      "Jason Wall"
    ]
  },
  {
    "event": "Corn Hole",
    "year": null,
    "file": "/images/CornholeBatemanDanVacek.jpg",
    "caption": "Scott Bateman and Dan Vacek between throws.",
    "people": [
      "Dan Vacek",
      "Scott Bateman"
    ],
    "venue": "Vacek Ranch"
  },
  {
    "event": "Corn Hole",
    "year": null,
    "file": "/images/CornholeDuane.jpg",
    "caption": "Duane Vacek releases a bag toward the board.",
    "people": [
      "Duane Vacek"
    ],
    "venue": "Vacek Ranch"
  },
  {
    "event": "Corn Hole",
    "year": null,
    "file": "/images/CornHole.jpg",
    "caption": "Corn hole - bags on the board, teams on the same side.",
    "people": []
  },
  {
    "event": "Darts",
    "year": 2015,
    "file": "/images/Darts2015SalverinoConacherWhitzel.jpg",
    "caption": "A throw mid-motion at the bar in 2015.",
    "people": [
      "Andy Conacher",
      "Ryan Whitzel",
      "Steve Salverino"
    ]
  },
  {
    "event": "Disc Golf",
    "year": 2023,
    "file": "/images/DiscGolf2023.jpg",
    "caption": "The 2023 field, tailgate-style before the round.",
    "people": []
  },
  {
    "event": "Disc Golf",
    "year": null,
    "file": "/images/DiscGolf2.jpg",
    "caption": "Out on the course.",
    "people": []
  },
  {
    "event": "Disc Golf",
    "year": null,
    "file": "/images/DiscGolfBrown.jpg",
    "caption": "Cameron Brown releases a drive as the gallery watches.",
    "people": [
      "Cameron Brown"
    ]
  },
  {
    "event": "Disc Golf",
    "year": null,
    "file": "/images/DiscGolfCrew.jpg",
    "caption": "The disc golf crew, tailgate-side.",
    "people": []
  },
  {
    "event": "Disc Golf",
    "year": null,
    "file": "/images/DiscGolf.jpg",
    "caption": "Disc golf - lowest total strokes takes it.",
    "people": []
  },
  {
    "event": "Disc Golf",
    "year": null,
    "file": "/images/DiscGolfWall.jpg",
    "caption": "A disc that found the one spot on the course nobody was aiming for.",
    "people": []
  },
  {
    "event": "Field Goal Kicking",
    "year": null,
    "file": "/images/FieldGoalCinco.jpg",
    "caption": "Under stormy skies at Cinco Ranch High School.",
    "people": [],
    "venue": "Cinco Ranch High School"
  },
  {
    "event": "Field Goal Kicking",
    "year": null,
    "file": "/images/FieldGoalEasy.jpg",
    "caption": "Lining up an attempt.",
    "people": []
  },
  {
    "event": "Field Goal Kicking",
    "year": null,
    "file": "/images/FieldGoal.jpg",
    "caption": "Field goals - start close, move back five yards a round until only one kicker is left.",
    "people": []
  },
  {
    "event": "Go Karts",
    "year": 2018,
    "file": "/images/GoKarts.jpg",
    "caption": "Go karts - contested exactly once, in 2018, and never seen again.",
    "people": []
  },
  {
    "event": "Go Karts",
    "year": 2018,
    "file": "/images/KartCheckIn.jpg",
    "caption": "Checking in for the one and only Go Karts outing, 2018.",
    "people": []
  },
  {
    "event": "Go Karts",
    "year": 2018,
    "file": "/images/KartConacher.jpg",
    "caption": "Andy Conacher at the track, 2018.",
    "people": [
      "Andy Conacher"
    ]
  },
  {
    "event": "Go Karts",
    "year": 2018,
    "file": "/images/KartStart.jpg",
    "caption": "Waiting on the grid, 2018.",
    "people": []
  },
  {
    "event": "Go Karts",
    "year": 2018,
    "file": "/images/KartWTF.jpg",
    "caption": "A reaction that needs no caption, 2018.",
    "people": []
  },
  {
    "event": "Go Karts",
    "year": 2018,
    "file": "/images/RaceCars.jpg",
    "caption": "The 2018 grid.",
    "people": []
  },
  {
    "event": "Golden Tee",
    "year": null,
    "file": "/images/GoldenTeeSDB.jpg",
    "caption": "Lining up an approach shot, second stroke of the hole.",
    "people": []
  },
  {
    "event": "Golden Tee",
    "year": null,
    "file": "/images/GoldenTeeTerryKloss.jpg",
    "caption": "Terry Kloss next to the cabinet, thumbs up.",
    "people": [
      "Terry Kloss"
    ]
  },
  {
    "event": "Home Run Derby",
    "year": null,
    "file": "/images/HomeRunDerbyDuane.jpg",
    "caption": "Duane Vacek mid-swing.",
    "people": [
      "Duane Vacek"
    ],
    "venue": "Vacek Ranch"
  },
  {
    "event": "Home Run Derby",
    "year": null,
    "file": "/images/HomeRunDerbyField.jpg",
    "caption": "Batter, pitching machine, and the whole outfield laid out at Vacek Ranch.",
    "people": [],
    "venue": "Vacek Ranch"
  },
  {
    "event": "Home Run Derby",
    "year": null,
    "file": "/images/HomeRunDerby.jpg",
    "caption": "Ten swings, most home runs. The event that started the whole idea.",
    "people": []
  },
  {
    "event": "Home Run Derby",
    "year": 2021,
    "file": "/images/HRD2021.JPG",
    "caption": "Terry Register steps in, ready for his swing at the plate.",
    "people": [
      "Terry Register"
    ],
    "venue": "Vacek Ranch"
  },
  {
    "event": "Kan Jam",
    "year": null,
    "file": "/images/KanJamCamBro.jpg",
    "caption": "Cameron Brown in a backyard Kan Jam match.",
    "people": [
      "Cameron Brown"
    ]
  },
  {
    "event": "Kan Jam",
    "year": null,
    "file": "/images/KanJamDuane.jpg",
    "caption": "Duane Vacek under the covered patio.",
    "people": [
      "Duane Vacek"
    ]
  },
  {
    "event": "Kan Jam",
    "year": null,
    "file": "/images/KanJam.jpg",
    "caption": "Team precision frisbee at thirty feet.",
    "people": []
  },
  {
    "event": "Kan Jam",
    "year": null,
    "file": "/images/KanJamKloss.jpg",
    "caption": "Terry Kloss going for the deflection.",
    "people": [
      "Terry Kloss"
    ]
  },
  {
    "event": "Kan Jam",
    "year": null,
    "file": "/images/KanJamWallBrown.jpg",
    "caption": "Jason Wall and Cameron Brown, mid-match.",
    "people": [
      "Cameron Brown",
      "Jason Wall"
    ]
  },
  {
    "event": "Kickball",
    "year": null,
    "file": "/images/KickballBateman.jpg",
    "caption": "Scott Bateman fields one under the lights.",
    "people": [
      "Scott Bateman"
    ]
  },
  {
    "event": "Long Drive",
    "year": null,
    "file": "/images/LongDrive.jpg",
    "caption": "Long drive - furthest ball wins, five shots to find it.",
    "people": []
  },
  {
    "event": "Long Drive",
    "year": null,
    "file": "/images/LongDriveReady.jpg",
    "caption": "The field gathers for Long Drive.",
    "people": []
  },
  {
    "event": "Long Drive",
    "year": null,
    "file": "/images/LongDriveWall.jpg",
    "caption": "Jason Wall unloads off the tee.",
    "people": [
      "Jason Wall"
    ]
  },
  {
    "event": "Shooting Gallery",
    "year": 2022,
    "file": "/images/22Active.jpg",
    "caption": "Three shooters mid-round, clay just released.",
    "people": []
  },
  {
    "event": "Shooting Gallery",
    "year": 2022,
    "file": "/images/22After.jpg",
    "caption": "The group after a round at the gallery.",
    "people": []
  },
  {
    "event": "Shooting Gallery",
    "year": 2022,
    "file": "/images/22Chill.jpg",
    "caption": "Taking aim off the deck rail.",
    "people": []
  },
  {
    "event": "Shooting Gallery",
    "year": 2022,
    "file": "/images/22Group.jpg",
    "caption": "The 2022 Shooting Gallery group, cased up and ready.",
    "people": []
  },
  {
    "event": "Shooting Gallery",
    "year": null,
    "file": "/images/ShootingGallery.jpg",
    "caption": "The shooting gallery - clay targets in the tree line, .22 rifle.",
    "people": []
  },
  {
    "event": "Shuffle Board",
    "year": 2019,
    "file": "/images/DarwinRosenberger.jpg",
    "caption": "The Rosenberger Construction crew, Friday night.",
    "people": [],
    "venue": "Rosenberger Construction"
  },
  {
    "event": "Shuffle Board",
    "year": 2019,
    "file": "/images/Shuffleboard2.jpg",
    "caption": "The board at Rosenberger Construction - eight throws, puck fully over the line to count.",
    "people": [],
    "venue": "Rosenberger Construction"
  },
  {
    "event": "Shuffle Board",
    "year": 2019,
    "file": "/images/Shuffleboard.jpg",
    "caption": "Shuffleboard night at Rosenberger Construction, who opened up the office for the Friday session.",
    "people": [],
    "venue": "Rosenberger Construction"
  },
  {
    "event": "Shuriken",
    "year": null,
    "file": "/images/Shuriken.jpg",
    "caption": "Throwing stars and knives - banned after 2015 over neighbour concerns, pardoned in 2021.",
    "people": []
  },
  {
    "event": "Shuriken",
    "year": null,
    "file": "/images/ShurikenLoad.jpg",
    "caption": "Stars and knives laid out and loaded into their cases before the round.",
    "people": []
  },
  {
    "event": "Shuriken",
    "year": null,
    "file": "/images/ShurikenWall.jpg",
    "caption": "Jason Wall prepping his stars beside the target shed.",
    "people": [
      "Jason Wall"
    ]
  },
  {
    "event": "Skeet Shooting",
    "year": null,
    "file": "/images/Skeet2.jpg",
    "caption": "Clay in the air.",
    "people": []
  },
  {
    "event": "Skeet Shooting",
    "year": null,
    "file": "/images/Skeet3.jpg",
    "caption": "Shotguns away before the beers come out - the tradition, and the reason skeet goes first.",
    "people": []
  },
  {
    "event": "Skeet Shooting",
    "year": null,
    "file": "/images/Skeet.jpg",
    "caption": "Skeet - the event that has opened every tournament since 2015.",
    "people": []
  },
  {
    "event": "Skeet Shooting",
    "year": null,
    "file": "/images/SkeetShells.jpg",
    "caption": "Spent shells in the grass after a round.",
    "people": []
  },
  {
    "event": "TopGolf",
    "year": 2018,
    "file": "/images/DarwinTopGolf2018.jpg",
    "caption": "The 2018 field at TopGolf.",
    "people": []
  },
  {
    "event": "TopGolf",
    "year": null,
    "file": "/images/TopGolf2.jpg",
    "caption": "In the bay.",
    "people": []
  },
  {
    "event": "TopGolf",
    "year": null,
    "file": "/images/TopGolf.jpg",
    "caption": "TopGolf - highest score, and a Jaeger shot waiting on the red target.",
    "people": []
  },
  {
    "event": "TopGolf",
    "year": null,
    "file": "/images/TopGolfScorecard.jpg",
    "caption": "The bay leaderboard: Murrill's 550 well clear of the field.",
    "people": []
  },
  {
    "event": "Washers",
    "year": null,
    "file": "/images/WashersConacher.jpg",
    "caption": "A washers game underway indoors, game night.",
    "people": [
      "Andy Conacher"
    ]
  },
  {
    "event": "Washers",
    "year": null,
    "file": "/images/Washers.jpg",
    "caption": "Washers - play to exactly 21, bust and you go back to 11.",
    "people": []
  }
];
