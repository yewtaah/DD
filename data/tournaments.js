/*
 * Darwin Decathlon - publishable tournament data for the v2.0 live site.
 *
 * PII BOUNDARY: names only. No emails, no phone numbers, no home addresses.
 * NOTE: the 2019 rules deck lists a street address for the Bateman House
 * events. That address is deliberately NOT reproduced here - this file ships
 * to a public website. Venue is recorded as "Bateman House" only.
 *
 * Sources (all primary, from Scott's Google Drive):
 *   2015  DD1 Scorecard.pdf            + D2 2015 Rules.pdf
 *   2018  Darwin Decathlon 2018 Final Results.pdf
 *         (cross-checked against the 2018 results slide in the 2019 deck)
 *   2019  DD3 Scorecard.pdf            + Darwin Decathlon Tres 2019.pdf
 *   2021  DD 2021 Scorecard.pdf        + DD4 Recap.pdf
 *   2022  DD5 2022 FINAL SCORECARD.pdf
 *   2023  DD6 2023.pdf
 *
 * TOTALS ARE AS PRINTED on each scorecard. In several rows the printed Total
 * is 0.5 higher than the sum of the visible cells (e.g. 2018 Murrill prints 81
 * but the row sums to 80.5; 2019 Whitzel prints 75 but sums to 74.5). The
 * printed totals are what the tournament published and what Champs.html
 * records, so they are authoritative here. `sumsCleanly:false` flags the years
 * where this happens - do not "fix" these by recomputing.
 *
 * GENERATED FILE - DO NOT HAND-EDIT THE DATA BELOW.
 * The database (dd-live-scoring) is the system of record. Fix an error
 * there, then regenerate: python tools/db_export_to_files.py
 * Last generated: 2026-08-17 10:19
 */

window.DD_DATA = {
  "venues": [
    {
      "name": "American Shooting Centers",
      "address": "16500 Westheimer Pkwy, Houston, TX 77082",
      "city": "Houston, TX",
      "lat": 29.7444,
      "lon": -95.6564,
      "precision": "rooftop",
      "private": false,
      "years": [
        2015,
        2018,
        2019
      ],
      "events": [
        "Skeet Shooting"
      ]
    },
    {
      "name": "George Bush Park",
      "address": null,
      "city": "Houston, TX",
      "lat": 29.748,
      "lon": -95.669,
      "precision": "parcel",
      "private": false,
      "years": [
        2015
      ],
      "events": [
        "Home Run Derby"
      ]
    },
    {
      "name": "West Oaks Little League",
      "address": null,
      "city": "Houston, TX",
      "lat": 29.743,
      "lon": -95.669,
      "precision": "rooftop",
      "private": false,
      "years": [
        2019
      ],
      "events": [
        "Home Run Derby"
      ]
    },
    {
      "name": "Rosenberger Construction",
      "address": "21501 Park Row Blvd #300, Katy, TX 77449",
      "city": "Katy, TX",
      "lat": 29.7877,
      "lon": -95.7433,
      "precision": "rooftop",
      "private": false,
      "years": [
        2019
      ],
      "events": [
        "Shuffle Board",
        "Washers"
      ]
    },
    {
      "name": "Cinco Ranch High School",
      "address": null,
      "city": "Katy, TX",
      "lat": 29.7314,
      "lon": -95.7737,
      "precision": "rooftop",
      "private": false,
      "years": [
        2019
      ],
      "events": [
        "Field Goal Kicking"
      ]
    },
    {
      "name": "WFDD Park",
      "address": null,
      "city": "Katy, TX",
      "lat": 29.731,
      "lon": -95.776,
      "precision": "parcel",
      "private": false,
      "years": [
        2019
      ],
      "events": [
        "Disc Golf"
      ]
    },
    {
      "name": "TopGolf Houston (I-10)",
      "address": "1030 Memorial Brook Blvd, Houston, TX 77084",
      "city": "Houston, TX",
      "lat": 29.7853,
      "lon": -95.6635,
      "precision": "rooftop",
      "private": false,
      "years": [
        2015,
        2019
      ],
      "events": [
        "TopGolf"
      ]
    },
    {
      "name": "Beck Jr. High",
      "address": null,
      "city": "Katy, TX",
      "lat": 29.7443,
      "lon": -95.7526,
      "precision": "rooftop",
      "private": false,
      "years": [
        2015
      ],
      "events": [
        "Field Goal Kicking"
      ]
    },
    {
      "name": "Bateman House",
      "address": null,
      "city": "Katy, TX",
      "lat": 29.744,
      "lon": -95.76,
      "precision": "locality",
      "private": true,
      "years": [
        2015,
        2019
      ],
      "events": [
        "Beer Pong",
        "Corn Hole",
        "Kan Jam",
        "Shuriken"
      ]
    },
    {
      "name": "Vacek Ranch",
      "address": null,
      "city": "Texas Hill Country",
      "lat": 29.81,
      "lon": -97.08,
      "precision": "locality",
      "private": true,
      "years": [
        2021,
        2022,
        2023
      ],
      "events": [
        "Beer Pong",
        "Corn Hole",
        "Disc Golf",
        "Home Run Derby",
        "Kan Jam",
        "Kickball",
        "Long Drive",
        "Shooting Gallery",
        "Shuriken",
        "Skeet Shooting",
        "Washers"
      ]
    },
    {
      "name": "Stars Sports Bar",
      "address": "414 W Grand Pkwy S #190, Katy, TX 77494",
      "city": "Katy, TX",
      "lat": null,
      "lon": null,
      "precision": "unknown",
      "private": false,
      "years": [
        2015
      ],
      "events": [
        "Darts",
        "Golden Tee",
        "Shuffle Board"
      ]
    }
  ],
  "tournaments": [
    {
      "year": 2015,
      "title": "1st Annual Darwin Decathlon",
      "subtitle": "Man-Ness Competition",
      "dates": "July 31 - August 1, 2015",
      "location": "Katy, TX",
      "champion": "Andy Conacher",
      "championPoints": 74,
      "maxPoints": 100,
      "sumsCleanly": false,
      "totals": {
        "Andy Conacher": 74,
        "Scott Bateman": 54,
        "Ben Murrill": 42,
        "Jason Perkins": 35
      },
      "events": [
        {
          "n": 1,
          "name": "Skeet Shooting",
          "short": "Skeet",
          "day": "Fri",
          "time": "5:30pm",
          "t": 1050,
          "venue": "American Shooting Centers",
          "icon": "images/badges/badge-Skeet.webp",
          "basis": "Most targets hit",
          "rules": "American standard skeet rules. Option can be taken at any station.",
          "snafu": "Under 10 targets = shotgun a beer"
        },
        {
          "n": 2,
          "name": "Golden Tee",
          "short": "Golden Tee",
          "day": "Fri",
          "time": "9:00pm",
          "t": 1260,
          "venue": "Stars Sports Bar",
          "icon": "images/badges/badge-GoldenTee.webp",
          "basis": "Fewest strokes on 9 holes",
          "rules": "Upgraded clubs/balls/tees acceptable.",
          "snafu": "Drink for the rough or a bunker; in the water = Grape Ape shot"
        },
        {
          "n": 3,
          "name": "Shuffle Board",
          "short": "Shuffle",
          "day": "Fri",
          "time": "9:00pm",
          "t": 1260,
          "venue": "Stars Sports Bar",
          "icon": "images/badges/badge-ShuffleBoard.webp",
          "basis": "Most points",
          "rules": "Total score on 8 throws. Puck must be completely over the line.",
          "snafu": "0 points = Goldschlager shot"
        },
        {
          "n": 4,
          "name": "Darts",
          "short": "Darts",
          "day": "Fri",
          "time": "9:00pm",
          "t": 1260,
          "venue": "Stars Sports Bar",
          "icon": "images/badges/badge-Darts.webp",
          "basis": "Highest score",
          "rules": "15 darts, total of all points.",
          "snafu": "Under 20 = drink a cosmopolitan martini"
        },
        {
          "n": 5,
          "name": "Home Run Derby",
          "short": "Derby",
          "day": "Sat",
          "time": "9:00am",
          "t": 540,
          "venue": "George Bush Park",
          "icon": "images/badges/badge-HomeRunDerby.webp",
          "basis": "Most home runs",
          "rules": "10 swings.",
          "snafu": "Fail to clear the infield on the fly = wear a pink tutu"
        },
        {
          "n": 6,
          "name": "TopGolf",
          "short": "TopGolf",
          "day": "Sat",
          "time": "12:00pm",
          "t": 720,
          "venue": "TopGolf Houston (I-10)",
          "icon": "images/badges/badge-TopGolf.webp",
          "basis": "Highest score",
          "rules": "One round of TopDrive.",
          "snafu": "Red target = Jaeger shot"
        },
        {
          "n": 7,
          "name": "Field Goal Kicking",
          "short": "Field Goal",
          "day": "Sat",
          "time": "2:00pm",
          "t": 840,
          "venue": "Beck Jr. High",
          "icon": "images/badges/badge-FieldGoal.webp",
          "basis": "Furthest kick",
          "rules": "Start at 15 yards, move back 5 yards each round. Ties kick off until one player misses.",
          "snafu": null
        },
        {
          "n": 8,
          "name": "Shuriken",
          "short": "Shuriken",
          "day": "Sat",
          "time": "4:00pm",
          "t": 960,
          "venue": "Bateman House",
          "icon": "images/badges/badge-Shuriken.webp",
          "basis": "Highest score",
          "rules": "3 lightweight stars, 1 heavy star, 3 lightweight knives, 3 weighted knives. Sum of all points; score the lowest value touched.",
          "snafu": null
        },
        {
          "n": 9,
          "name": "Corn Hole",
          "short": "Corn Hole",
          "day": "Sat",
          "time": "5:00pm",
          "t": 1020,
          "venue": "Bateman House",
          "icon": "images/badges/badge-CornHole.webp",
          "basis": "Tournament",
          "rules": "5-team single elimination, teams ordered by current standings.",
          "snafu": null,
          "pair": true
        },
        {
          "n": 10,
          "name": "Beer Pong",
          "short": "Beer Pong",
          "day": "Sat",
          "time": "7:00pm",
          "t": 1140,
          "venue": "Bateman House",
          "icon": "images/badges/badge-BeerPong.webp",
          "basis": "Tournament",
          "rules": "5-team single elimination, teams ordered by current standings.",
          "snafu": null,
          "pair": true
        }
      ],
      "players": [
        {
          "name": "Andy Conacher",
          "points": [
            5,
            9.5,
            10,
            9,
            10,
            5,
            9,
            5,
            3.5,
            7.5
          ]
        },
        {
          "name": "Michael Marine",
          "points": [
            7.5,
            4,
            3,
            7,
            4.5,
            10,
            9,
            5,
            7.5,
            5.5
          ]
        },
        {
          "name": "Ryan Whitzel",
          "points": [
            10,
            1,
            3,
            6,
            9,
            9,
            9,
            2,
            9.5,
            3.5
          ]
        },
        {
          "name": "Steve Salverino",
          "points": [
            3,
            2,
            6,
            8,
            7,
            7,
            6,
            9,
            3.5,
            9.5
          ]
        },
        {
          "name": "Chuck Niesner",
          "points": [
            6,
            9.5,
            6,
            10,
            8,
            3,
            1.5,
            10,
            3.5,
            1.5
          ]
        },
        {
          "name": "Scott Bateman",
          "points": [
            7.5,
            7.5,
            3,
            5,
            4.5,
            4,
            4,
            5,
            3.5,
            9.5
          ]
        },
        {
          "name": "Matt Roland",
          "points": [
            4,
            7.5,
            1,
            0,
            4.5,
            6,
            6,
            2,
            9.5,
            3.5
          ]
        },
        {
          "name": "Ben Murrill",
          "points": [
            2,
            2.5,
            8.5,
            3,
            4.5,
            8,
            6,
            2,
            3.5,
            1.5
          ]
        },
        {
          "name": "Jim Thompson",
          "points": [
            1,
            5,
            8.5,
            2,
            1.5,
            0,
            3,
            8,
            3.5,
            7.5
          ]
        },
        {
          "name": "Jason Perkins",
          "points": [
            0,
            2.5,
            6,
            1,
            1.5,
            2,
            1.5,
            7,
            7.5,
            5.5
          ]
        }
      ]
    },
    {
      "year": 2018,
      "title": "Darwin Decathlon Dos",
      "subtitle": "",
      "dates": "2018",
      "location": "Katy / Houston, TX",
      "champion": "Ben Murrill",
      "championPoints": 81,
      "maxPoints": 100,
      "sumsCleanly": false,
      "note": "Only 8 competitors, so each event distributed 52 points instead of 55. Murrill's printed total is 81; his row sums to 80.5.",
      "totals": {
        "Ben Murrill": 81,
        "Steve Salverino": 70,
        "Duane Vacek": 67,
        "Cameron Brown": 66,
        "Andy Conacher": 64,
        "Scott Bateman": 60,
        "Terry Kloss": 57,
        "Terry Register": 56
      },
      "events": [
        {
          "n": 1,
          "name": "Skeet Shooting",
          "short": "Skeet",
          "day": "Day 1",
          "venue": "American Shooting Centers",
          "icon": "images/badges/badge-Skeet.webp",
          "basis": "Most targets hit",
          "snafu": null
        },
        {
          "n": 2,
          "name": "Home Run Derby",
          "short": "Derby",
          "day": "Day 1",
          "venue": null,
          "icon": "images/badges/badge-HomeRunDerby.webp",
          "basis": "Most home runs",
          "snafu": null
        },
        {
          "n": 3,
          "name": "Shuffle Board",
          "short": "Shuffle",
          "day": "Day 1",
          "venue": null,
          "icon": "images/badges/badge-ShuffleBoard.webp",
          "basis": "Most points",
          "snafu": null,
          "pair": true
        },
        {
          "n": 4,
          "name": "Washers",
          "short": "Washers",
          "day": "Day 1",
          "venue": null,
          "icon": "images/badges/badge-Washers.webp",
          "basis": "Most points",
          "snafu": null,
          "pair": true
        },
        {
          "n": 5,
          "name": "Go Karts",
          "short": "Go Karts",
          "day": "Day 2",
          "venue": null,
          "icon": "images/badges/badge-GoKarts.webp",
          "basis": "Fastest lap",
          "snafu": null
        },
        {
          "n": 6,
          "name": "TopGolf",
          "short": "TopGolf",
          "day": "Day 2",
          "venue": null,
          "icon": "images/badges/badge-TopGolf.webp",
          "basis": "Highest score",
          "snafu": null
        },
        {
          "n": 7,
          "name": "Field Goal Kicking",
          "short": "Field Goal",
          "day": "Day 2",
          "venue": null,
          "icon": "images/badges/badge-FieldGoal.webp",
          "basis": "Furthest kick",
          "snafu": null
        },
        {
          "n": 8,
          "name": "Corn Hole",
          "short": "Corn Hole",
          "day": "Day 2",
          "venue": null,
          "icon": "images/badges/badge-CornHole.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true
        },
        {
          "n": 9,
          "name": "Kan Jam",
          "short": "Kan Jam",
          "day": "Day 2",
          "venue": null,
          "icon": "images/badges/badge-KanJam.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true
        },
        {
          "n": 10,
          "name": "Beer Pong",
          "short": "Beer Pong",
          "day": "Day 2",
          "venue": null,
          "icon": "images/badges/badge-BeerPong.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true
        }
      ],
      "players": [
        {
          "name": "Ben Murrill",
          "points": [
            6,
            6.5,
            9.5,
            7.5,
            7,
            10,
            5.5,
            9.5,
            9.5,
            9.5
          ]
        },
        {
          "name": "Steve Salverino",
          "points": [
            10,
            6.5,
            4.5,
            9.5,
            6,
            4,
            9.5,
            7.5,
            9.5,
            3
          ]
        },
        {
          "name": "Duane Vacek",
          "points": [
            8.5,
            4,
            7.5,
            9.5,
            5,
            7,
            7.5,
            3,
            7.5,
            7.5
          ]
        },
        {
          "name": "Cameron Brown",
          "points": [
            8.5,
            6.5,
            9.5,
            7.5,
            4,
            3,
            5.5,
            9.5,
            6,
            6
          ]
        },
        {
          "name": "Andy Conacher",
          "points": [
            3,
            10,
            4.5,
            4.5,
            10,
            9,
            7.5,
            3,
            3,
            9.5
          ]
        },
        {
          "name": "Scott Bateman",
          "points": [
            4,
            9,
            4.5,
            4.5,
            8,
            5,
            4,
            7.5,
            7.5,
            6
          ]
        },
        {
          "name": "Terry Kloss",
          "points": [
            5,
            6.5,
            7.5,
            4.5,
            3,
            8,
            3,
            6,
            6,
            7.5
          ]
        },
        {
          "name": "Terry Register",
          "points": [
            7,
            3,
            4.5,
            4.5,
            9,
            6,
            9.5,
            6,
            3,
            3
          ]
        }
      ]
    },
    {
      "year": 2019,
      "title": "Darwin Decathlon Tres",
      "subtitle": "",
      "dates": "May 31 - June 1, 2019",
      "location": "Cinco Ranch, TX",
      "champion": "Ryan Whitzel",
      "championPoints": 75,
      "maxPoints": 100,
      "sumsCleanly": false,
      "note": "Largest field on record - 12 competitors. Whitzel scored an 11 in skeet via the bonus-shot rule, above the nominal 10-point max.",
      "totals": {
        "Ryan Whitzel": 75,
        "Cameron Brown": 71,
        "Trey Wolfe": 60,
        "Ben Murrill": 52,
        "Duane Vacek": 51,
        "Scott Bateman": 47,
        "Steve Salverino": 46,
        "Andy Conacher": 45,
        "Carlos Quinteros": 35,
        "Dan Vacek": 33,
        "Terry Register": 33,
        "Jason Wall": 3.5
      },
      "events": [
        {
          "n": 1,
          "name": "Skeet Shooting",
          "short": "Skeet",
          "day": "Fri",
          "time": "5:00pm",
          "t": 1020,
          "venue": "American Shooting Centers",
          "icon": "images/badges/badge-Skeet.webp",
          "basis": "Count of targets hit, round of 50",
          "rules": "Random 3-dice selection for a bonus point shot - hit that target and you get +1 on the decathlon scoreboard.",
          "snafu": "Under 10 = shotgun a beer"
        },
        {
          "n": 2,
          "name": "Home Run Derby",
          "short": "Derby",
          "day": "Fri",
          "time": "7:00pm",
          "t": 1140,
          "venue": "West Oaks Little League",
          "icon": "images/badges/badge-HomeRunDerby.webp",
          "basis": "Points on 10 swings",
          "rules": "1pt outfield on the fly, 2pt fence, 5pt home run. Dice roll picks a daily double - double points on that swing for everyone.",
          "snafu": null
        },
        {
          "n": 3,
          "name": "Washers",
          "short": "Washers",
          "day": "Fri",
          "time": "9:00pm",
          "t": 1260,
          "venue": "Rosenberger Construction",
          "icon": "images/badges/badge-Washers.webp",
          "basis": "Single elimination tournament",
          "rules": "1st place chooses a partner, then 2nd, and so on. Points split between the team: (10+9)/2 = 9.5.",
          "snafu": null,
          "pair": true
        },
        {
          "n": 4,
          "name": "Shuffle Board",
          "short": "Shuffle",
          "day": "Fri",
          "time": "9:00pm",
          "t": 1260,
          "venue": "Rosenberger Construction",
          "icon": "images/badges/badge-ShuffleBoard.webp",
          "basis": "Single elimination tournament",
          "rules": "Same partner-draft format as washers.",
          "snafu": null,
          "pair": true
        },
        {
          "n": 5,
          "name": "Disc Golf",
          "short": "Disc Golf",
          "day": "Sat",
          "time": "10:00am",
          "t": 600,
          "venue": "WFDD Park",
          "icon": "images/badges/badge-DiscGolf.webp",
          "basis": "18 holes, total strokes",
          "rules": "Run up must be on the pad or behind your previous location. Back-foot putts allowed. Closest to pin on #9 takes 2 strokes off your total.",
          "snafu": null,
          "newThisYear": true
        },
        {
          "n": 6,
          "name": "Field Goal Kicking",
          "short": "Field Goal",
          "day": "Sat",
          "time": "12:00pm",
          "t": 720,
          "venue": "Cinco Ranch High School",
          "icon": "images/badges/badge-FieldGoal.webp",
          "basis": "Furthest kick",
          "rules": "Start at the 10 yard line, 3 attempts at each spot.",
          "snafu": null
        },
        {
          "n": 7,
          "name": "TopGolf",
          "short": "TopGolf",
          "day": "Sat",
          "time": "1:30pm",
          "t": 810,
          "venue": "TopGolf Houston (I-10)",
          "icon": "images/badges/badge-TopGolf.webp",
          "basis": "TopScore with TopTracer, most points",
          "snafu": "Red target = Jaeger shot"
        },
        {
          "n": 8,
          "name": "Kan Jam",
          "short": "Kan Jam",
          "day": "Sat",
          "time": "7:00pm",
          "t": 1140,
          "venue": "Bateman House",
          "icon": "images/badges/badge-KanJam.webp",
          "basis": "Single elimination tournament",
          "rules": "30 foot distance. At 13 points the next player gets a football throw for the game.",
          "snafu": null,
          "pair": true
        },
        {
          "n": 9,
          "name": "Corn Hole",
          "short": "Corn Hole",
          "day": "Sat",
          "time": "7:00pm",
          "t": 1140,
          "venue": "Bateman House",
          "icon": "images/badges/badge-CornHole.webp",
          "basis": "Single elimination tournament",
          "rules": "Team on the same board side. All 4 in = instant win.",
          "snafu": null,
          "pair": true
        },
        {
          "n": 10,
          "name": "Beer Pong",
          "short": "Beer Pong",
          "day": "Sat",
          "time": "9:00pm",
          "t": 1260,
          "venue": "Bateman House",
          "icon": "images/badges/badge-BeerPong.webp",
          "basis": "Double elimination tournament",
          "rules": "Random team assignment. Each player gets one 'blue ball' per game, called before the shot - make it and you pick a 2nd cup the opponent drinks.",
          "snafu": null,
          "pair": true
        }
      ],
      "players": [
        {
          "name": "Ryan Whitzel",
          "points": [
            11,
            10,
            9.5,
            7.5,
            null,
            null,
            10,
            9.5,
            7.5,
            9.5
          ]
        },
        {
          "name": "Cameron Brown",
          "points": [
            4,
            3,
            7.5,
            9.5,
            10,
            10,
            null,
            7.5,
            9.5,
            9.5
          ]
        },
        {
          "name": "Trey Wolfe",
          "points": [
            1,
            9,
            7.5,
            9.5,
            3,
            4.5,
            9,
            1.5,
            9.5,
            5.5
          ]
        },
        {
          "name": "Ben Murrill",
          "points": [
            1,
            2,
            3.5,
            1.5,
            9,
            4.5,
            8,
            9.5,
            7.5,
            5.5
          ]
        },
        {
          "name": "Duane Vacek",
          "points": [
            5.5,
            1,
            5.5,
            5.5,
            7,
            8,
            6,
            1.5,
            3.5,
            7.5
          ]
        },
        {
          "name": "Scott Bateman",
          "points": [
            5.5,
            7,
            3.5,
            1.5,
            8,
            4.5,
            4,
            7.5,
            1.5,
            3.5
          ]
        },
        {
          "name": "Steve Salverino",
          "points": [
            7.5,
            4,
            9.5,
            7.5,
            5,
            7,
            5,
            null,
            null,
            null
          ]
        },
        {
          "name": "Andy Conacher",
          "points": [
            9,
            6,
            5.5,
            5.5,
            4,
            4.5,
            3,
            5.5,
            1.5,
            null
          ]
        },
        {
          "name": "Carlos Quinteros",
          "points": [
            1,
            8,
            null,
            null,
            null,
            null,
            7,
            5.5,
            5.5,
            7.5
          ]
        },
        {
          "name": "Dan Vacek",
          "points": [
            3,
            5,
            1.5,
            3.5,
            6,
            1.5,
            2,
            3.5,
            3.5,
            3.5
          ]
        },
        {
          "name": "Terry Register",
          "points": [
            7.5,
            null,
            1.5,
            3.5,
            1,
            9,
            1,
            3.5,
            5.5,
            null
          ]
        },
        {
          "name": "Jason Wall",
          "points": [
            null,
            null,
            null,
            null,
            2,
            1.5,
            null,
            null,
            null,
            null
          ]
        }
      ]
    },
    {
      "year": 2021,
      "title": "Darwin Decathlon 4",
      "subtitle": "",
      "dates": "April 16-18, 2021",
      "location": "Vacek Ranch, Central Texas",
      "champion": "Dan Vacek",
      "championPoints": 71,
      "maxPoints": 100,
      "sumsCleanly": true,
      "note": "First tournament after the 2020 COVID cancellation, and the first at the Vacek country estate. Shuriken returned after being pulled in late 2015 over neighbor concerns.",
      "events": [
        {
          "n": 1,
          "name": "Skeet Shooting",
          "short": "Skeet",
          "day": "Fri",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Skeet.webp",
          "basis": "Most targets hit",
          "rules": "Hand throwers used for a rustic angle. Bateman scored a perfect 25.",
          "snafu": null
        },
        {
          "n": 2,
          "name": "Home Run Derby",
          "short": "Derby",
          "day": "Fri",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-HomeRunDerby.webp",
          "basis": "Most home runs",
          "snafu": null
        },
        {
          "n": 3,
          "name": "Washers",
          "short": "Washers",
          "day": "Fri",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Washers.webp",
          "basis": "Most points",
          "snafu": null,
          "pair": true
        },
        {
          "n": 4,
          "name": "Long Drive",
          "short": "Long Drive",
          "day": "Sat",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-LongDrive.webp",
          "basis": "Furthest drive",
          "snafu": null,
          "newThisYear": true
        },
        {
          "n": 5,
          "name": "Disc Golf",
          "short": "Disc Golf",
          "day": "Sat",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-DiscGolf.webp",
          "basis": "Total strokes",
          "snafu": null
        },
        {
          "n": 6,
          "name": "Shooting Gallery",
          "short": "Gallery",
          "day": "Sat",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Shooting.webp",
          "basis": "Most targets hit",
          "rules": "Shot from the country back patio.",
          "snafu": null,
          "newThisYear": true
        },
        {
          "n": 7,
          "name": "Shuriken",
          "short": "Shuriken",
          "day": "Sat",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Shuriken.webp",
          "basis": "Highest score",
          "rules": "Returned after being banned in late 2015 over neighbor concerns.",
          "snafu": null
        },
        {
          "n": 8,
          "name": "Corn Hole",
          "short": "Corn Hole",
          "day": "Sat",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-CornHole.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true
        },
        {
          "n": 9,
          "name": "Kan Jam",
          "short": "Kan Jam",
          "day": "Sat",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-KanJam.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true
        },
        {
          "n": 10,
          "name": "Beer Pong",
          "short": "Beer Pong",
          "day": "Sat",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-BeerPong.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true
        }
      ],
      "players": [
        {
          "name": "Dan Vacek",
          "points": [
            0.5,
            8.5,
            9.5,
            6,
            8,
            5,
            9,
            9.5,
            9.5,
            5.5
          ]
        },
        {
          "name": "Ben Murrill",
          "points": [
            4.5,
            6,
            5.5,
            8,
            4.5,
            8,
            10,
            7.5,
            7.5,
            5.5
          ]
        },
        {
          "name": "Cameron Brown",
          "points": [
            4.5,
            8.5,
            7.5,
            1,
            10,
            4,
            6,
            9.5,
            9.5,
            5.5
          ]
        },
        {
          "name": "Scott Bateman",
          "points": [
            10,
            6,
            3.5,
            3,
            2.5,
            6.5,
            5,
            7.5,
            7.5,
            5.5
          ]
        },
        {
          "name": "Shawn East",
          "points": [
            8,
            6,
            1.5,
            7,
            9,
            2,
            3,
            3.5,
            5.5,
            5.5
          ]
        },
        {
          "name": "Duane Vacek",
          "points": [
            8,
            3.5,
            3.5,
            4,
            6.5,
            10,
            4,
            1.5,
            1.5,
            5.5
          ]
        },
        {
          "name": "Carlos Quinteros",
          "points": [
            3,
            0.5,
            null,
            9,
            4.5,
            1,
            8,
            5.5,
            3.5,
            5.5
          ]
        },
        {
          "name": "Terry Register",
          "points": [
            2,
            2,
            9.5,
            null,
            1,
            3,
            7,
            5.5,
            3.5,
            5.5
          ]
        },
        {
          "name": "Terry Kloss",
          "points": [
            0.5,
            3.5,
            null,
            5,
            6.5,
            6.5,
            2,
            3.5,
            5.5,
            5.5
          ]
        },
        {
          "name": "Jason Wall",
          "points": [
            6,
            0.5,
            7.5,
            2,
            2.5,
            9,
            1,
            1.5,
            1.5,
            5.5
          ]
        },
        {
          "name": "Andy Conacher",
          "points": [
            8,
            10,
            5.5,
            10,
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        {
          "name": "Billy Jarrell",
          "points": [
            null,
            null,
            1.5,
            null,
            null,
            null,
            null,
            null,
            null,
            null
          ]
        }
      ]
    },
    {
      "year": 2022,
      "title": "Darwin Decathlon 5",
      "subtitle": "",
      "dates": "2022",
      "location": "Vacek Ranch, TX",
      "champion": "Cameron Brown",
      "coChampion": "Terry Register",
      "championPoints": 65,
      "maxPoints": 100,
      "sumsCleanly": false,
      "note": "The only tie in tournament history - Brown and Register both finished on 65. Settled by a sudden-death washers duel, which Brown won.",
      "totals": {
        "Cameron Brown": 65,
        "Terry Register": 65,
        "Shawn East": 61,
        "Duane Vacek": 60,
        "Ben Murrill": 58,
        "Scott Bateman": 57,
        "Dan Vacek": 54,
        "Carlos Quinteros": 54,
        "Jason Wall": 46,
        "Terry Kloss": 25
      },
      "events": [
        {
          "n": 1,
          "name": "Skeet Shooting",
          "short": "Skeet",
          "day": "Day 1",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Skeet.webp",
          "basis": "Most targets hit",
          "snafu": null
        },
        {
          "n": 2,
          "name": "Home Run Derby",
          "short": "Derby",
          "day": "Day 1",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-HomeRunDerby.webp",
          "basis": "Most home runs",
          "snafu": null
        },
        {
          "n": 3,
          "name": "Washers",
          "short": "Washers",
          "day": "Day 1",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Washers.webp",
          "basis": "Most points",
          "snafu": null,
          "pair": true
        },
        {
          "n": 4,
          "name": "Disc Golf",
          "short": "Disc Golf",
          "day": "Day 1",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-DiscGolf.webp",
          "basis": "Total strokes",
          "snafu": null
        },
        {
          "n": 5,
          "name": "Kan Jam",
          "short": "Kan Jam",
          "day": "Day 1",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-KanJam.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true
        },
        {
          "n": 6,
          "name": "Shooting Gallery",
          "short": ".22 Shoot",
          "day": "Day 2",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Shooting.webp",
          "basis": "Most targets hit",
          "snafu": null
        },
        {
          "n": 7,
          "name": "Long Drive",
          "short": "Long Drive",
          "day": "Day 2",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-LongDrive.webp",
          "basis": "Furthest drive",
          "snafu": null
        },
        {
          "n": 8,
          "name": "Shuriken",
          "short": "Stars",
          "day": "Day 2",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Shuriken.webp",
          "basis": "Highest score",
          "rules": "The Shuriken event under its other name.",
          "snafu": null
        },
        {
          "n": 9,
          "name": "Corn Hole",
          "short": "Corn Hole",
          "day": "Day 2",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-CornHole.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true
        },
        {
          "n": 10,
          "name": "Beer Pong",
          "short": "Beer Pong",
          "day": "Day 2",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-BeerPong.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true
        }
      ],
      "players": [
        {
          "name": "Cameron Brown",
          "points": [
            7,
            2.5,
            9.5,
            7.5,
            9.5,
            1,
            3,
            10,
            9.5,
            5.5
          ]
        },
        {
          "name": "Terry Register",
          "points": [
            4.5,
            7.5,
            7.5,
            2,
            5.5,
            9,
            4,
            8,
            7.5,
            9.5
          ]
        },
        {
          "name": "Shawn East",
          "points": [
            8,
            4,
            9.5,
            5,
            3.5,
            2,
            10,
            4,
            5.5,
            9.5
          ]
        },
        {
          "name": "Duane Vacek",
          "points": [
            4.5,
            7.5,
            1.5,
            9.5,
            1.5,
            4,
            9,
            7,
            7.5,
            7.5
          ]
        },
        {
          "name": "Ben Murrill",
          "points": [
            9,
            2.5,
            1.5,
            6,
            7.5,
            3,
            9,
            6,
            9.5,
            3.5
          ]
        },
        {
          "name": "Scott Bateman",
          "points": [
            10,
            5,
            3.5,
            3,
            9.5,
            6,
            6,
            5,
            3.5,
            5.5
          ]
        },
        {
          "name": "Carlos Quinteros",
          "points": [
            6,
            10,
            7.5,
            4,
            7.5,
            6,
            1.5,
            2,
            5.5,
            3.5
          ]
        },
        {
          "name": "Dan Vacek",
          "points": [
            2,
            9,
            3.5,
            9.5,
            5.5,
            9,
            1.5,
            3,
            3.5,
            7.5
          ]
        },
        {
          "name": "Jason Wall",
          "points": [
            3,
            6,
            5.5,
            7.5,
            3.5,
            9,
            7,
            1,
            1.5,
            1.5
          ]
        },
        {
          "name": "Terry Kloss",
          "points": [
            null,
            null,
            null,
            null,
            1.5,
            6,
            5,
            9,
            1.5,
            1.5
          ]
        }
      ]
    },
    {
      "year": 2023,
      "title": "Darwin Decathlon 6",
      "subtitle": "",
      "dates": "2023",
      "location": "Vacek Ranch, TX",
      "champion": "Cameron Brown",
      "championPoints": 76,
      "maxPoints": 100,
      "sumsCleanly": false,
      "note": "Cameron Brown's second title, and the highest winning score since 2018. Kickball replaced Shuriken this year.",
      "totals": {
        "Cameron Brown": 76,
        "Andy Conacher": 72,
        "Duane Vacek": 69,
        "Ben Murrill": 68,
        "Dan Vacek": 66,
        "Scott Bateman": 54,
        "Brad Klaerner": 52,
        "Jason Wall": 46,
        "Carlos Quinteros": 34
      },
      "events": [
        {
          "n": 1,
          "name": "Skeet Shooting",
          "short": "Skeet",
          "day": "Day 1",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Skeet.webp",
          "basis": "Most targets hit",
          "snafu": null,
          "gameMaster": "Bateman"
        },
        {
          "n": 2,
          "name": "Home Run Derby",
          "short": "Derby",
          "day": "Day 1",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-HomeRunDerby.webp",
          "basis": "Most home runs",
          "snafu": null,
          "gameMaster": "Quinteros"
        },
        {
          "n": 3,
          "name": "Washers",
          "short": "Washers",
          "day": "Day 1",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Washers.webp",
          "basis": "Most points",
          "snafu": null,
          "pair": true,
          "gameMaster": "East"
        },
        {
          "n": 4,
          "name": "Kan Jam",
          "short": "Kan Jam",
          "day": "Day 1",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-KanJam.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true,
          "gameMaster": "Duane Vacek"
        },
        {
          "n": 5,
          "name": "Corn Hole",
          "short": "Corn Hole",
          "day": "Day 1",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-CornHole.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true,
          "gameMaster": "Brown"
        },
        {
          "n": 6,
          "name": "Shooting Gallery",
          "short": ".22 Shoot",
          "day": "Day 2",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Shooting.webp",
          "basis": "Most targets hit",
          "snafu": null,
          "gameMaster": "Wall"
        },
        {
          "n": 7,
          "name": "Long Drive",
          "short": "Long Drive",
          "day": "Day 2",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-LongDrive.webp",
          "basis": "Furthest drive",
          "snafu": null,
          "gameMaster": "Murrill"
        },
        {
          "n": 8,
          "name": "Disc Golf",
          "short": "Disc Golf",
          "day": "Day 2",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-DiscGolf.webp",
          "basis": "Total strokes",
          "snafu": null,
          "gameMaster": "Wall"
        },
        {
          "n": 9,
          "name": "Kickball",
          "short": "Kickball",
          "day": "Day 2",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-Kickball.webp",
          "basis": "Tournament",
          "snafu": null,
          "newThisYear": true,
          "gameMaster": "Brown"
        },
        {
          "n": 10,
          "name": "Beer Pong",
          "short": "Beer Pong",
          "day": "Day 2",
          "venue": "Vacek Ranch",
          "icon": "images/badges/badge-BeerPong.webp",
          "basis": "Tournament",
          "snafu": null,
          "pair": true,
          "gameMaster": "Dan Vacek"
        }
      ],
      "players": [
        {
          "name": "Cameron Brown",
          "points": [
            7.5,
            4.5,
            9.5,
            7.5,
            9.5,
            9,
            8,
            9,
            8,
            3.5
          ]
        },
        {
          "name": "Andy Conacher",
          "points": [
            10,
            10,
            5.5,
            5.5,
            5.5,
            7.5,
            8,
            6,
            8,
            5.5
          ]
        },
        {
          "name": "Duane Vacek",
          "points": [
            7.5,
            4.5,
            3.5,
            9.5,
            7.5,
            2,
            7,
            10,
            8,
            9.5
          ]
        },
        {
          "name": "Ben Murrill",
          "points": [
            6,
            3,
            7.5,
            3.5,
            9.5,
            5.5,
            10,
            5,
            8,
            9.5
          ]
        },
        {
          "name": "Dan Vacek",
          "points": [
            5,
            7,
            3.5,
            9.5,
            3.5,
            10,
            4,
            8,
            8,
            7.5
          ]
        },
        {
          "name": "Scott Bateman",
          "points": [
            9,
            6,
            7.5,
            3.5,
            5.5,
            3.5,
            6,
            4,
            3.5,
            5.5
          ]
        },
        {
          "name": "Brad Klaerner",
          "points": [
            4,
            8,
            5.5,
            5.5,
            7.5,
            5.5,
            3,
            2,
            3.5,
            7.5
          ]
        },
        {
          "name": "Jason Wall",
          "points": [
            2.5,
            2,
            9.5,
            7.5,
            3.5,
            3.5,
            3,
            7,
            3.5,
            3.5
          ]
        },
        {
          "name": "Carlos Quinteros",
          "points": [
            2.5,
            4.5,
            null,
            null,
            null,
            7.5,
            11,
            3,
            3.5,
            2
          ]
        }
      ]
    }
  ],
  "knownChampions": [
    {
      "year": 2015,
      "name": "Andy Conacher",
      "points": 74,
      "hasScorecard": true,
      "players": 10
    },
    {
      "year": 2018,
      "name": "Ben Murrill",
      "points": 81,
      "hasScorecard": true,
      "players": 8
    },
    {
      "year": 2019,
      "name": "Ryan Whitzel",
      "points": 75,
      "hasScorecard": true,
      "players": 12
    },
    {
      "year": 2021,
      "name": "Dan Vacek",
      "points": 71,
      "hasScorecard": true,
      "players": 12
    },
    {
      "year": 2022,
      "name": "Cameron Brown",
      "points": 65,
      "hasScorecard": true,
      "players": 10,
      "coChampion": "Terry Register"
    },
    {
      "year": 2023,
      "name": "Cameron Brown",
      "points": 76,
      "hasScorecard": true,
      "players": 9
    }
  ]
};
