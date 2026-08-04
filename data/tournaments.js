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
 */

window.DD_DATA = {

  /* ---------------------------------------------------------------------
   * VENUES - WGS84 / EPSG:4326 decimal degrees.
   *
   * `precision` is not decoration. Read it before rendering anything:
   *   rooftop  - desk-geocoded from a real street address; safe to pin
   *   parcel   - large site (park/ranch); point is inside it, not exact
   *   locality - town centroid ONLY, deliberately coarse
   *
   * `private:true` means a private residence or private property. Those are
   * recorded at locality precision on purpose and must NEVER be pinned to the
   * actual parcel, geocoded further, or labeled with a street address - even
   * though the 2019 rules deck happens to contain one. Any map built on this
   * data must respect the flag (draw a region, not a pin).
   * ------------------------------------------------------------------- */
  venues: [
    { name:"American Shooting Centers",   city:"Houston, TX", lat:29.7444, lon:-95.6564, precision:"rooftop",  private:false, years:[2015,2019], events:["Skeet Shooting"] },
    { name:"George Bush Park",            city:"Houston, TX", lat:29.7480, lon:-95.6690, precision:"parcel",   private:false, years:[2015],      events:["Home Run Derby"] },
    { name:"West Oaks Little League",     city:"Houston, TX", lat:29.7430, lon:-95.6690, precision:"rooftop",  private:false, years:[2019],      events:["Home Run Derby"] },
    { name:"Rosenberger Construction",    city:"Katy, TX",    lat:29.7877, lon:-95.7433, precision:"rooftop",  private:false, years:[2019],      events:["Washers","Shuffle Board"] },
    { name:"Cinco Ranch High School",     city:"Katy, TX",    lat:29.7314, lon:-95.7737, precision:"rooftop",  private:false, years:[2019],      events:["Field Goal Kicking"] },
    { name:"WFDD Park",                   city:"Katy, TX",    lat:29.7310, lon:-95.7760, precision:"parcel",   private:false, years:[2019],      events:["Disc Golf"] },
    { name:"TopGolf Houston (I-10)",      city:"Houston, TX", lat:29.7853, lon:-95.6635, precision:"rooftop",  private:false, years:[2019],      events:["TopGolf"] },
    { name:"Beck Jr. High",               city:"Katy, TX",    lat:29.7443, lon:-95.7526, precision:"rooftop",  private:false, years:[2015],      events:["Field Goal Kicking"] },
    { name:"Bateman House",               city:"Katy, TX",    lat:29.7440, lon:-95.7600, precision:"locality", private:true,  years:[2015,2019], events:["Shuriken","Corn Hole","Kan Jam","Beer Pong"] },
    { name:"Vacek Ranch",                 city:"Texas Hill Country", lat:29.8100, lon:-97.0800, precision:"locality", private:true, years:[2021,2022,2023], events:["All events"] },
    // Recorded but not geocoded - location never captured.
    { name:"Stars Sports Bar",            city:"Katy, TX",    lat:null, lon:null, precision:"unknown", private:false, years:[2015], events:["Golden Tee","Shuffle Board","Darts"] }
  ],

  tournaments: [
    {
      year: 2015,
      title: "1st Annual Darwin Decathlon",
      subtitle: "Man-Ness Competition",
      dates: "July 31 - August 1, 2015",
      location: "Katy, TX",
      champion: "Andy Conacher",
      championPoints: 74,
      maxPoints: 100,
      sumsCleanly: true,
      events: [
        { n:1,  name:"Skeet Shooting",     short:"Skeet",      day:"Fri", time:"5:30pm", t:17.5*60, venue:"American Shooting Center", icon:"/images/badges/badge-Skeet.webp",
          basis:"Most targets hit", rules:"American standard skeet rules. Option can be taken at any station.", snafu:"Under 10 targets = shotgun a beer" },
        { n:2,  name:"Golden Tee",         short:"Golden Tee", day:"Fri", time:"9:00pm", t:21*60,   venue:"Stars Sports Bar", icon:"/images/badges/badge-GoldenTee.webp",
          basis:"Fewest strokes on 9 holes", rules:"Upgraded clubs/balls/tees acceptable.", snafu:"Drink for the rough or a bunker; in the water = Grape Ape shot" },
        { n:3,  name:"Shuffle Board",      short:"Shuffle",    day:"Fri", time:"9:00pm", t:21*60,   venue:"Stars Sports Bar", icon:"/images/D2-Shuffleboard.png",
          basis:"Most points", rules:"Total score on 8 throws. Puck must be completely over the line.", snafu:"0 points = Goldschlager shot" },
        { n:4,  name:"Darts",              short:"Darts",      day:"Fri", time:"9:00pm", t:21*60,   venue:"Stars Sports Bar", icon:"/images/badges/badge-Darts.webp",
          basis:"Highest score", rules:"15 darts, total of all points.", snafu:"Under 20 = drink a cosmopolitan martini" },
        { n:5,  name:"Home Run Derby",     short:"Derby",      day:"Sat", time:"9:00am", t:9*60,    venue:"George Bush Park", icon:"/images/badges/badge-HomeRunDerby.webp",
          basis:"Most home runs", rules:"10 swings.", snafu:"Fail to clear the infield on the fly = wear a pink tutu" },
        { n:6,  name:"TopGolf",            short:"TopGolf",    day:"Sat", time:"12:00pm", t:12*60,  venue:"TopGolf", icon:"/images/D2-TopGolf.png",
          basis:"Highest score", rules:"One round of TopDrive.", snafu:"Red target = Jaeger shot" },
        { n:7,  name:"Field Goal Kicking", short:"Field Goal", day:"Sat", time:"2:00pm", t:14*60,   venue:"Beck Jr. High", icon:"/images/badges/badge-FieldGoal.webp",
          basis:"Furthest kick", rules:"Start at 15 yards, move back 5 yards each round. Ties kick off until one player misses.", snafu:null },
        { n:8,  name:"Shuriken",           short:"Shuriken",   day:"Sat", time:"4:00pm", t:16*60,   venue:"Bateman House", icon:"/images/badges/badge-Shuriken.webp",
          basis:"Highest score", rules:"3 lightweight stars, 1 heavy star, 3 lightweight knives, 3 weighted knives. Sum of all points; score the lowest value touched.", snafu:null },
        { n:9,  name:"Corn Hole",          short:"Corn Hole",  day:"Sat", time:"5:00pm", t:17*60,   venue:"Bateman House", icon:"/images/badges/badge-CornHole.webp", pair:true,
          basis:"Tournament", rules:"5-team single elimination, teams ordered by current standings.", snafu:null },
        { n:10, name:"Beer Pong",          short:"Beer Pong",  day:"Sat", time:"7:00pm", t:19*60,   venue:"Bateman House", icon:"/images/badges/badge-BeerPong.webp", pair:true,
          basis:"Tournament", rules:"5-team single elimination, teams ordered by current standings.", snafu:null }
      ],
      players: [
        { name:"Andy Conacher",   points:[5,   9.5, 10,  9,  10,  5,  9,   5,  3.5, 7.5] },
        { name:"Michael Marine",  points:[7.5, 4,   3,   7,  4.5, 10, 9,   5,  7.5, 5.5] },
        { name:"Ryan Whitzel",    points:[10,  1,   3,   6,  9,   9,  9,   2,  9.5, 3.5] },
        { name:"Steve Salverino", points:[3,   2,   6,   8,  7,   7,  6,   9,  3.5, 9.5] },
        { name:"Chuck Niesner",   points:[6,   9.5, 6,   10, 8,   3,  1.5, 10, 3.5, 1.5] },
        { name:"Scott Bateman",   points:[7.5, 7.5, 3,   5,  4.5, 4,  4,   5,  3.5, 9.5] },
        { name:"Matt Roland",     points:[4,   7.5, 1,   0,  4.5, 6,  6,   2,  9.5, 3.5] },
        { name:"Ben Murrill",     points:[2,   2.5, 8.5, 3,  4.5, 8,  6,   2,  3.5, 1.5] },
        { name:"Jim Thompson",    points:[1,   5,   8.5, 2,  1.5, 0,  3,   8,  3.5, 7.5] },
        { name:"Jason Perkins",   points:[0,   2.5, 6,   1,  1.5, 2,  1.5, 7,  7.5, 5.5] }
      ]
    },

    {
      year: 2018,
      title: "Darwin Decathlon Dos",
      subtitle: "",
      dates: "2018",
      location: "Katy / Houston, TX",
      champion: "Ben Murrill",
      championPoints: 81,
      maxPoints: 100,
      sumsCleanly: false,
      note: "Only 8 competitors, so each event distributed 52 points instead of 55. Murrill's printed total is 81; his row sums to 80.5.",
      totals: { "Ben Murrill":81, "Steve Salverino":70, "Duane Vacek":67, "Cameron Brown":66,
                "Andy Conacher":64, "Scott Bateman":60, "Terry Kloss":57, "Terry Register":56 },
      events: [
        { n:1,  name:"Skeet Shooting",     short:"Skeet",      day:"Day 1", venue:"American Shooting Center", icon:"/images/badges/badge-Skeet.webp", basis:"Most targets hit" },
        { n:2,  name:"Home Run Derby",     short:"Derby",      day:"Day 1", venue:null, icon:"/images/badges/badge-HomeRunDerby.webp", basis:"Most home runs" },
        { n:3,  name:"Shuffle Board",      short:"Shuffle",    day:"Day 1", venue:null, icon:"/images/D2-Shuffleboard.png", basis:"Most points", pair:true },
        { n:4,  name:"Washers",            short:"Washers",    day:"Day 1", venue:null, icon:"/images/badges/badge-Washers.webp", basis:"Most points", pair:true },
        { n:5,  name:"Go Karts",           short:"Go Karts",   day:"Day 2", venue:"K1 Speed (unconfirmed)", icon:"/images/D2-TBD.png", basis:"Fastest lap" },
        { n:6,  name:"TopGolf",            short:"TopGolf",    day:"Day 2", venue:null, icon:"/images/D2-TopGolf.png", basis:"Highest score" },
        { n:7,  name:"Field Goal Kicking", short:"Field Goal", day:"Day 2", venue:null, icon:"/images/badges/badge-FieldGoal.webp", basis:"Furthest kick" },
        { n:8,  name:"Corn Hole",          short:"Corn Hole",  day:"Day 2", venue:null, icon:"/images/badges/badge-CornHole.webp", basis:"Tournament", pair:true },
        { n:9,  name:"Kan Jam",            short:"Kan Jam",    day:"Day 2", venue:null, icon:"/images/badges/badge-KanJam.webp", basis:"Tournament", pair:true },
        { n:10, name:"Beer Pong",          short:"Beer Pong",  day:"Day 2", venue:null, icon:"/images/badges/badge-BeerPong.webp", basis:"Tournament", pair:true }
      ],
      players: [
        { name:"Ben Murrill",     points:[6,   6.5, 9.5, 7.5, 7,  10, 5.5, 9.5, 9.5, 9.5] },
        { name:"Steve Salverino", points:[10,  6.5, 4.5, 9.5, 6,  4,  9.5, 7.5, 9.5, 3  ] },
        { name:"Duane Vacek",     points:[8.5, 4,   7.5, 9.5, 5,  7,  7.5, 3,   7.5, 7.5] },
        { name:"Cameron Brown",   points:[8.5, 6.5, 9.5, 7.5, 4,  3,  5.5, 9.5, 6,   6  ] },
        { name:"Andy Conacher",   points:[3,   10,  4.5, 4.5, 10, 9,  7.5, 3,   3,   9.5] },
        { name:"Scott Bateman",   points:[4,   9,   4.5, 4.5, 8,  5,  4,   7.5, 7.5, 6  ] },
        { name:"Terry Kloss",     points:[5,   6.5, 7.5, 4.5, 3,  8,  3,   6,   6,   7.5] },
        { name:"Terry Register",  points:[7,   3,   4.5, 4.5, 9,  6,  9.5, 6,   3,   3  ] }
      ]
    },

    {
      year: 2019,
      title: "Darwin Decathlon Tres",
      subtitle: "",
      dates: "May 31 - June 1, 2019",
      location: "Cinco Ranch, TX",
      champion: "Ryan Whitzel",
      championPoints: 75,
      maxPoints: 100,
      sumsCleanly: false,
      note: "Largest field on record - 12 competitors. Whitzel scored an 11 in skeet via the bonus-shot rule, above the nominal 10-point max.",
      totals: { "Ryan Whitzel":75, "Cameron Brown":71, "Trey Wolfe":60, "Ben Murrill":52,
                "Duane Vacek":51, "Scott Bateman":47, "Steve Salverino":46, "Andy Conacher":45,
                "Carlos Quinteros":35, "Dan Vacek":33, "Terry Register":33, "Jason Wall":3.5 },
      events: [
        { n:1,  name:"Skeet Shooting",     short:"Skeet",      day:"Fri", time:"5:00pm",  t:17*60,   venue:"American Shooting Centers", icon:"/images/badges/badge-Skeet.webp",
          basis:"Count of targets hit, round of 50", rules:"Random 3-dice selection for a bonus point shot - hit that target and you get +1 on the decathlon scoreboard.", snafu:"Under 10 = shotgun a beer" },
        { n:2,  name:"Home Run Derby",     short:"Derby",      day:"Fri", time:"7:00pm",  t:19*60,   venue:"West Oaks Little League Fields", icon:"/images/badges/badge-HomeRunDerby.webp",
          basis:"Points on 10 swings", rules:"1pt outfield on the fly, 2pt fence, 5pt home run. Dice roll picks a daily double - double points on that swing for everyone.", snafu:null },
        { n:3,  name:"Washers",            short:"Washers",    day:"Fri", time:"9:00pm",  t:21*60,   venue:"Rosenberger Construction", icon:"/images/badges/badge-Washers.webp", pair:true,
          basis:"Single elimination tournament", rules:"1st place chooses a partner, then 2nd, and so on. Points split between the team: (10+9)/2 = 9.5.", snafu:null },
        { n:4,  name:"Shuffle Board",      short:"Shuffle",    day:"Fri", time:"9:00pm",  t:21*60,   venue:"Rosenberger Construction", icon:"/images/D2-Shuffleboard.png", pair:true,
          basis:"Single elimination tournament", rules:"Same partner-draft format as washers.", snafu:null },
        { n:5,  name:"Disc Golf",          short:"Disc Golf",  day:"Sat", time:"10:00am", t:10*60,   venue:"WFDD Park", icon:"/images/badges/badge-DiscGolf.webp",
          basis:"18 holes, total strokes", rules:"Run up must be on the pad or behind your previous location. Back-foot putts allowed. Closest to pin on #9 takes 2 strokes off your total.", snafu:null, newThisYear:true },
        { n:6,  name:"Field Goal Kicking", short:"Field Goal", day:"Sat", time:"12:00pm", t:12*60,   venue:"Cinco Ranch High School", icon:"/images/badges/badge-FieldGoal.webp",
          basis:"Furthest kick", rules:"Start at the 10 yard line, 3 attempts at each spot.", snafu:null },
        { n:7,  name:"TopGolf",            short:"TopGolf",    day:"Sat", time:"1:30pm",  t:13.5*60, venue:"I-10 TopGolf", icon:"/images/D2-TopGolf.png",
          basis:"TopScore with TopTracer, most points", rules:null, snafu:"Red target = Jaeger shot" },
        { n:8,  name:"Kan Jam",            short:"Kan Jam",    day:"Sat", time:"7:00pm",  t:19*60,   venue:"Bateman House", icon:"/images/badges/badge-KanJam.webp", pair:true,
          basis:"Single elimination tournament", rules:"30 foot distance. At 13 points the next player gets a football throw for the game.", snafu:null },
        { n:9,  name:"Corn Hole",          short:"Corn Hole",  day:"Sat", time:"7:00pm",  t:19*60,   venue:"Bateman House", icon:"/images/badges/badge-CornHole.webp", pair:true,
          basis:"Single elimination tournament", rules:"Team on the same board side. All 4 in = instant win.", snafu:null },
        { n:10, name:"Beer Pong",          short:"Beer Pong",  day:"Sat", time:"9:00pm",  t:21*60,   venue:"Bateman House", icon:"/images/badges/badge-BeerPong.webp", pair:true,
          basis:"Double elimination tournament", rules:"Random team assignment. Each player gets one 'blue ball' per game, called before the shot - make it and you pick a 2nd cup the opponent drinks.", snafu:null }
      ],
      // null = did not play that event
      players: [
        { name:"Ryan Whitzel",    points:[11,   10,  9.5, 7.5, null, null, 10,  9.5, 7.5, 9.5 ] },
        { name:"Cameron Brown",   points:[4,    3,   7.5, 9.5, 10,   10,   null,7.5, 9.5, 9.5 ] },
        { name:"Trey Wolfe",      points:[1,    9,   7.5, 9.5, 3,    4.5,  9,   1.5, 9.5, 5.5 ] },
        { name:"Ben Murrill",     points:[1,    2,   3.5, 1.5, 9,    4.5,  8,   9.5, 7.5, 5.5 ] },
        { name:"Duane Vacek",     points:[5.5,  1,   5.5, 5.5, 7,    8,    6,   1.5, 3.5, 7.5 ] },
        { name:"Scott Bateman",   points:[5.5,  7,   3.5, 1.5, 8,    4.5,  4,   7.5, 1.5, 3.5 ] },
        { name:"Steve Salverino", points:[7.5,  4,   9.5, 7.5, 5,    7,    5,   null,null,null] },
        { name:"Andy Conacher",   points:[9,    6,   5.5, 5.5, 4,    4.5,  3,   5.5, 1.5, null] },
        { name:"Carlos Quinteros",points:[1,    8,   null,null,null, null, 7,   5.5, 5.5, 7.5 ] },
        { name:"Dan Vacek",       points:[3,    5,   1.5, 3.5, 6,    1.5,  2,   3.5, 3.5, 3.5 ] },
        { name:"Terry Register",  points:[7.5,  null,1.5, 3.5, 1,    9,    1,   3.5, 5.5, null] },
        { name:"Jason Wall",      points:[null, null,null,null,2,    1.5,  null,null,null,null] }
      ]
    },

    {
      year: 2021,
      title: "Darwin Decathlon 4",
      subtitle: "",
      dates: "April 16-18, 2021",
      location: "Vacek Ranch, Central Texas",
      champion: "Dan Vacek",
      championPoints: 71,
      maxPoints: 100,
      sumsCleanly: true,
      note: "First tournament after the 2020 COVID cancellation, and the first at the Vacek country estate. Shuriken returned after being pulled in late 2015 over neighbor concerns.",
      events: [
        { n:1,  name:"Skeet Shooting",    short:"Skeet",      day:"Fri", venue:"Vacek Ranch", icon:"/images/badges/badge-Skeet.webp", basis:"Most targets hit",
          rules:"Hand throwers used for a rustic angle. Bateman scored a perfect 25." },
        { n:2,  name:"Home Run Derby",    short:"Derby",      day:"Fri", venue:"Vacek Ranch", icon:"/images/badges/badge-HomeRunDerby.webp", basis:"Most home runs" },
        { n:3,  name:"Washers",           short:"Washers",    day:"Fri", venue:"Vacek Ranch", icon:"/images/badges/badge-Washers.webp", basis:"Most points", pair:true },
        { n:4,  name:"Long Golf Ball",    short:"Long Drive", day:"Sat", venue:"Vacek Ranch", icon:"/images/badges/badge-LongDrive.webp", basis:"Furthest drive", newThisYear:true },
        { n:5,  name:"Disc Golf",         short:"Disc Golf",  day:"Sat", venue:"Vacek Ranch", icon:"/images/badges/badge-DiscGolf.webp", basis:"Total strokes" },
        { n:6,  name:"Shooting Gallery",  short:"Gallery",    day:"Sat", venue:"Vacek Ranch", icon:"/images/badges/badge-Shooting.webp", basis:"Most targets hit",
          rules:"Shot from the country back patio.", newThisYear:true },
        { n:7,  name:"Shuriken",          short:"Shuriken",   day:"Sat", venue:"Vacek Ranch", icon:"/images/badges/badge-Shuriken.webp", basis:"Highest score",
          rules:"Returned after being banned in late 2015 over neighbor concerns." },
        { n:8,  name:"Corn Hole",         short:"Corn Hole",  day:"Sat", venue:"Vacek Ranch", icon:"/images/badges/badge-CornHole.webp", basis:"Tournament", pair:true },
        { n:9,  name:"Kan Jam",           short:"Kan Jam",    day:"Sat", venue:"Vacek Ranch", icon:"/images/badges/badge-KanJam.webp", basis:"Tournament", pair:true },
        { n:10, name:"Beer Pong",         short:"Beer Pong",  day:"Sat", venue:"Vacek Ranch", icon:"/images/badges/badge-BeerPong.webp", basis:"Tournament", pair:true }
      ],
      players: [
        { name:"Dan Vacek",       points:[0.5, 8.5, 9.5,  6,    8,   5,   9,  9.5, 9.5, 5.5] },
        { name:"Ben Murrill",     points:[4.5, 6,   5.5,  8,    4.5, 8,   10, 7.5, 7.5, 5.5] },
        { name:"Cameron Brown",   points:[4.5, 8.5, 7.5,  1,    10,  4,   6,  9.5, 9.5, 5.5] },
        { name:"Scott Bateman",   points:[10,  6,   3.5,  3,    2.5, 6.5, 5,  7.5, 7.5, 5.5] },
        { name:"Shawn East",      points:[8,   6,   1.5,  7,    9,   2,   3,  3.5, 5.5, 5.5] },
        { name:"Duane Vacek",     points:[8,   3.5, 3.5,  4,    6.5, 10,  4,  1.5, 1.5, 5.5] },
        { name:"Carlos Quinteros",points:[3,   0.5, null, 9,    4.5, 1,   8,  5.5, 3.5, 5.5] },
        { name:"Terry Register",  points:[2,   2,   9.5,  null, 1,   3,   7,  5.5, 3.5, 5.5] },
        { name:"Terry Kloss",     points:[0.5, 3.5, null, 5,    6.5, 6.5, 2,  3.5, 5.5, 5.5] },
        { name:"Jason Wall",      points:[6,   0.5, 7.5,  2,    2.5, 9,   1,  1.5, 1.5, 5.5] },
        { name:"Andy Conacher",   points:[8,   10,  5.5,  10,   null,null,null,null,null,null] },
        { name:"Billy Jarrell",   points:[null,null,1.5,  null, null,null,null,null,null,null] }
      ]
    },

    {
      year: 2022,
      title: "Darwin Decathlon 5",
      subtitle: "",
      dates: "2022",
      location: "Vacek Ranch, TX",
      champion: "Cameron Brown",
      coChampion: "Terry Register",
      championPoints: 65,
      maxPoints: 100,
      sumsCleanly: false,
      note: "The only tie in tournament history - Brown and Register both finished on 65. Settled by a sudden-death washers duel, which Brown won.",
      totals: { "Cameron Brown":65, "Terry Register":65, "Shawn East":61, "Duane Vacek":60,
                "Ben Murrill":58, "Scott Bateman":57, "Dan Vacek":54, "Carlos Quinteros":54,
                "Jason Wall":46, "Terry Kloss":25 },
      events: [
        { n:1,  name:"Skeet Shooting",  short:"Skeet",      day:"Day 1", venue:"Vacek Ranch", icon:"/images/badges/badge-Skeet.webp", basis:"Most targets hit" },
        { n:2,  name:"Home Run Derby",  short:"Derby",      day:"Day 1", venue:"Vacek Ranch", icon:"/images/badges/badge-HomeRunDerby.webp", basis:"Most home runs" },
        { n:3,  name:"Washers",         short:"Washers",    day:"Day 1", venue:"Vacek Ranch", icon:"/images/badges/badge-Washers.webp", basis:"Most points", pair:true },
        { n:4,  name:"Disc Golf",       short:"Disc Golf",  day:"Day 1", venue:"Vacek Ranch", icon:"/images/badges/badge-DiscGolf.webp", basis:"Total strokes" },
        { n:5,  name:"Kan Jam",         short:"Kan Jam",    day:"Day 1", venue:"Vacek Ranch", icon:"/images/badges/badge-KanJam.webp", basis:"Tournament", pair:true },
        { n:6,  name:".22 Shoot",       short:".22 Shoot",  day:"Day 2", venue:"Vacek Ranch", icon:"/images/badges/badge-Shooting.webp", basis:"Most targets hit" },
        { n:7,  name:"Long Drive",      short:"Long Drive", day:"Day 2", venue:"Vacek Ranch", icon:"/images/badges/badge-LongDrive.webp", basis:"Furthest drive" },
        { n:8,  name:"Chinese Stars",   short:"Stars",      day:"Day 2", venue:"Vacek Ranch", icon:"/images/badges/badge-Shuriken.webp", basis:"Highest score",
          rules:"The Shuriken event under its other name." },
        { n:9,  name:"Corn Hole",       short:"Corn Hole",  day:"Day 2", venue:"Vacek Ranch", icon:"/images/badges/badge-CornHole.webp", basis:"Tournament", pair:true },
        { n:10, name:"Beer Pong",       short:"Beer Pong",  day:"Day 2", venue:"Vacek Ranch", icon:"/images/badges/badge-BeerPong.webp", basis:"Tournament", pair:true }
      ],
      players: [
        { name:"Cameron Brown",   points:[7,    2.5, 9.5,  7.5,  9.5, 1,   3,   10, 9.5, 5.5] },
        { name:"Terry Register",  points:[4.5,  7.5, 7.5,  2,    5.5, 9,   4,   8,  7.5, 9.5] },
        { name:"Shawn East",      points:[8,    4,   9.5,  5,    3.5, 2,   10,  4,  5.5, 9.5] },
        { name:"Duane Vacek",     points:[4.5,  7.5, 1.5,  9.5,  1.5, 4,   9,   7,  7.5, 7.5] },
        { name:"Ben Murrill",     points:[9,    2.5, 1.5,  6,    7.5, 3,   9,   6,  9.5, 3.5] },
        { name:"Scott Bateman",   points:[10,   5,   3.5,  3,    9.5, 6,   6,   5,  3.5, 5.5] },
        { name:"Dan Vacek",       points:[2,    9,   3.5,  9.5,  5.5, 9,   1.5, 3,  3.5, 7.5] },
        { name:"Carlos Quinteros",points:[6,    10,  7.5,  4,    7.5, 6,   1.5, 2,  5.5, 3.5] },
        { name:"Jason Wall",      points:[3,    6,   5.5,  7.5,  3.5, 9,   7,   1,  1.5, 1.5] },
        { name:"Terry Kloss",     points:[null, null,null, null, 1.5, 6,   5,   9,  1.5, 1.5] }
      ]
    },

    {
      year: 2023,
      title: "Darwin Decathlon 6",
      subtitle: "",
      dates: "2023",
      location: "Vacek Ranch, TX",
      champion: "Cameron Brown",
      championPoints: 76,
      maxPoints: 100,
      sumsCleanly: false,
      note: "Cameron Brown's second title, and the highest winning score since 2018. Kickball replaced Shuriken this year.",
      totals: { "Cameron Brown":76, "Andy Conacher":72, "Duane Vacek":69, "Ben Murrill":68,
                "Dan Vacek":66, "Scott Bateman":54, "Brad Klaerner":52, "Jason Wall":46,
                "Carlos Quinteros":34 },
      events: [
        { n:1,  name:"Skeet Shooting", short:"Skeet",      day:"Day 1", venue:"Vacek Ranch", icon:"/images/badges/badge-Skeet.webp", basis:"Most targets hit", gameMaster:"Bateman" },
        { n:2,  name:"Home Run Derby", short:"Derby",      day:"Day 1", venue:"Vacek Ranch", icon:"/images/badges/badge-HomeRunDerby.webp", basis:"Most home runs", gameMaster:"Quinteros" },
        { n:3,  name:"Washers",        short:"Washers",    day:"Day 1", venue:"Vacek Ranch", icon:"/images/badges/badge-Washers.webp", basis:"Most points", pair:true, gameMaster:"East" },
        { n:4,  name:"Kan Jam",        short:"Kan Jam",    day:"Day 1", venue:"Vacek Ranch", icon:"/images/badges/badge-KanJam.webp", basis:"Tournament", pair:true, gameMaster:"Duane Vacek" },
        { n:5,  name:"Corn Hole",      short:"Corn Hole",  day:"Day 1", venue:"Vacek Ranch", icon:"/images/badges/badge-CornHole.webp", basis:"Tournament", pair:true, gameMaster:"Brown" },
        { n:6,  name:".22 Shoot",      short:".22 Shoot",  day:"Day 2", venue:"Vacek Ranch", icon:"/images/badges/badge-Shooting.webp", basis:"Most targets hit", gameMaster:"Wall" },
        { n:7,  name:"Long Drive",     short:"Long Drive", day:"Day 2", venue:"Vacek Ranch", icon:"/images/badges/badge-LongDrive.webp", basis:"Furthest drive", gameMaster:"Murrill" },
        { n:8,  name:"Disc Golf",      short:"Disc Golf",  day:"Day 2", venue:"Vacek Ranch", icon:"/images/badges/badge-DiscGolf.webp", basis:"Total strokes", gameMaster:"Wall" },
        { n:9,  name:"Kickball",       short:"Kickball",   day:"Day 2", venue:"Vacek Ranch", icon:"/images/badges/badge-Kickball.webp", basis:"Tournament", gameMaster:"Brown", newThisYear:true },
        { n:10, name:"Beer Pong",      short:"Beer Pong",  day:"Day 2", venue:"Vacek Ranch", icon:"/images/badges/badge-BeerPong.webp", basis:"Tournament", pair:true, gameMaster:"Dan Vacek" }
      ],
      players: [
        { name:"Cameron Brown",   points:[7.5, 4.5, 9.5,  7.5,  9.5,  9,   8,  9,  8,   3.5] },
        { name:"Andy Conacher",   points:[10,  10,  5.5,  5.5,  5.5,  7.5, 8,  6,  8,   5.5] },
        { name:"Duane Vacek",     points:[7.5, 4.5, 3.5,  9.5,  7.5,  2,   7,  10, 8,   9.5] },
        { name:"Ben Murrill",     points:[6,   3,   7.5,  3.5,  9.5,  5.5, 10, 5,  8,   9.5] },
        { name:"Dan Vacek",       points:[5,   7,   3.5,  9.5,  3.5,  10,  4,  8,  8,   7.5] },
        { name:"Scott Bateman",   points:[9,   6,   7.5,  3.5,  5.5,  3.5, 6,  4,  3.5, 5.5] },
        { name:"Brad Klaerner",   points:[4,   8,   5.5,  5.5,  7.5,  5.5, 3,  2,  3.5, 7.5] },
        { name:"Jason Wall",      points:[2.5, 2,   9.5,  7.5,  3.5,  3.5, 3,  7,  3.5, 3.5] },
        { name:"Carlos Quinteros",points:[2.5, 4.5, null, null, null, 7.5, 11, 3,  3.5, 2  ] }
      ]
    }
  ],

  // Every champion below is verified against the original scorecard AND
  // cross-checked against Champs.html. NOTE: Champs.html does not yet list
  // 2023 - the old site is out of date.
  knownChampions: [
    { year:2015, name:"Andy Conacher", points:74, hasScorecard:true, players:10 },
    { year:2018, name:"Ben Murrill",   points:81, hasScorecard:true, players:8  },
    { year:2019, name:"Ryan Whitzel",  points:75, hasScorecard:true, players:12 },
    { year:2021, name:"Dan Vacek",     points:71, hasScorecard:true, players:12 },
    { year:2022, name:"Cameron Brown", points:65, hasScorecard:true, players:10, coChampion:"Terry Register" },
    { year:2023, name:"Cameron Brown", points:76, hasScorecard:true, players:9  }
  ]
};
