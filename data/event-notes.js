/*
 * Darwin Decathlon - event briefings.
 *
 * The prose that used to live on the v1 per-event pages (Skeet.html,
 * Shuriken.html, BeerPong.html and friends), carried forward into the v2 field
 * guide so every event page has something to actually READ - not just a table
 * of who beat whom.
 *
 * PROVENANCE
 *   Every rule below traces to one of two primary sources, recorded in `source`:
 *     "v1 page"    - the 2023 per-event rules pages in this repo. Rules are
 *                    reproduced faithfully; the surrounding prose is punched up.
 *     "2015 deck"  - DD-2015-Rules.pdf. Terse by nature (they were slides), so
 *                    these entries are shorter and honest about it.
 *     "unrecorded" - no rules sheet survives. Blurb only, and the page says so.
 *                    Do NOT invent rules for these; ask someone who was there.
 *
 * SHAPE
 *   blurb   - the hook. One or two sentences, shown under the banner.
 *   rules   - array of bullets. How the event is actually scored.
 *   snafu   - the lurking penalty for the bottom of the field. Optional.
 *   savior  - the bonus/wildcard that can rescue a round. Optional.
 *
 * Keys MUST be the CANONICAL event name used in tournaments.js - renames are
 * folded, so "Shuriken" (not "Chinese Stars"), "Shooting Gallery" (not
 * ".22 Shoot"), "Long Drive" (not "Long Golf Ball").
 *
 * GENERATED FILE - DO NOT HAND-EDIT THE DATA BELOW.
 * The database (dd-live-scoring) is the system of record. Fix an error
 * there, then regenerate: python tools/db_export_to_files.py
 * Last generated: 2026-08-17 10:48
 */

window.DD_EVENT_NOTES = {
  "Skeet Shooting": {
    "source": "v1 page",
    "blurb": "The tournament has opened with shotguns every single year since 2015, and there is a reason for that: it is far better to get the guns put away before the beers come out. Twenty-five clays into the Texas sky, twenty-five shells, and absolutely nobody wants to hear about the wind.",
    "rules": [
      "Twenty-five clay pigeons, launched from a manual pull thrower now that we shoot on private property.",
      "Each player gets 25 shots. Count the hits - partial or fully dusted, a hit is a hit.",
      "Most targets hit takes the event."
    ],
    "snafu": "Fewer than 10 targets and you shotgun a beer. In front of everyone. Before you have even put the gun down.",
    "savior": "Roll a single die before you shoot. That number is your lucky pull - smash target #3 if you rolled a 3 and you bank a bonus point on your final score."
  },
  "Home Run Derby": {
    "source": "v1 page",
    "blurb": "This is the event that spawned the entire idea. Non-professional adults have vanishingly few chances left to hit a baseball over a fence, and it is emphatically not the same with a softball. Ten swings. Everything you have left.",
    "rules": [
      "A pitching machine feeds identical pitches to every batter - no excuses about the delivery.",
      "Ten swings. Home run = 5 points, off the fence = 2 points, outfield on the fly = 1 point.",
      "The 'outfield on the fly' rule only applies where the field gives a clean boundary to argue about.",
      "Ties go to a sudden-death swing-off. First player to miss takes the lower place."
    ],
    "snafu": "Under 10 points total and an entire bag of Big League Chew goes in your mouth. All of it. At once.",
    "savior": "A dice roll picks your lucky swing before you step in. Points on that swing count double."
  },
  "Washers": {
    "source": "v1 page",
    "blurb": "The icehouse classic, and do not let the beer cooler energy fool you - this event has decided an actual championship. In 2022 Cameron Brown and Terry Register finished level on 65 and the title went to a sudden-death washers duel. The wind, by all accounts, decided it.",
    "rules": [
      "Play to exactly 21. Net scoring - score 4 while the other team scores 1 and you bank 3.",
      "Bust past 21 and you drop all the way back to 11. Ask anyone who has done it.",
      "Stand beside the box. Step in front of it and your throw does not count."
    ],
    "snafu": "Miss the board completely with every washer, two rounds running, and it costs you 10 push-ups.",
    "savior": "Each team holds one veto. Any time, no warning - reject a throw before it leaves their hand and they simply surrender that washer."
  },
  "Disc Golf": {
    "source": "v1 page",
    "blurb": "We build our own eighteen out of the baskets we can carry and whatever the property is willing to tolerate. Regular disc golf, country rules, and a scorecard that gets very honest very quickly.",
    "rules": [
      "Eighteen holes assembled from portable baskets. Some baskets pull double duty between holes.",
      "Standard disc golf rules, including holding your balance behind the front edge of your disc after the throw.",
      "Lowest total strokes wins."
    ],
    "snafu": "Ace a hole and everyone except the thrower takes a liquor shot. It is the one penalty on the property that punishes the field for someone else being good.",
    "savior": "Hole 9 doubles as a closest-to-the-pin challenge. Win it and take two strokes straight off your total."
  },
  "Kan Jam": {
    "source": "v1 page",
    "blurb": "Pair play at thirty feet, one of you throwing and the other frantically redirecting. Looks gentle. Is not. Bragging rights here last a full calendar year.",
    "rules": [
      "Cans thirty feet apart. One player throws, their partner tries to deflect it home.",
      "1 point for a deflection that touches the kan. 2 points for a direct hit with no help. 3 points for a deflection that goes in.",
      "Straight through the coin slot, or in off the top unassisted, is an instant win. Game over, go get a drink.",
      "Teams alternate directions for as many rounds as it takes. Play to 21, no penalty for going over.",
      "Single elimination bracket."
    ],
    "snafu": "Score nothing at all in a round and both of you finish your drinks.",
    "savior": "The moment the two teams have 13 points between them, the next throw is preceded by a football toss at the kan. Make that and it is a walk-off win."
  },
  "Shooting Gallery": {
    "source": "v1 page",
    "blurb": "Who doesn't love a county fair shooting gallery? We rebuilt one out of clay targets wedged in the tree line and a .22, which is either nostalgic or deeply irresponsible depending on which neighbour you ask.",
    "rules": [
      "Clay targets set in the trees. Ten shots per player with the .22.",
      "Any piece broken off the target counts as one point.",
      "Ties are settled with a sudden-death shootout."
    ],
    "savior": "One bonus disc hides in every set of ten. Find it, break it, take an extra point."
  },
  "Long Drive": {
    "source": "v1 page",
    "blurb": "There is no TopGolf in the Texas hill country, so we do the next best thing and just launch golf balls into a field until someone wins. Furthest ball takes it, and roll absolutely counts.",
    "rules": [
      "Fairway indicators mark the corridor. Land outside them and the ball does not count at all.",
      "Five swings each. Your best single ball is your score - the other four never happened.",
      "Furthest distance including roll takes first, next furthest second, and so on."
    ],
    "savior": "Call one of your five as the money ball before you swing. If that turns out to be your scoring ball, you bank an extra point."
  },
  "Shuriken": {
    "source": "v1 page",
    "blurb": "The ancient samurai knew that silent weapons worked best. We will be nowhere close to silent, but throwing spiky metal things through the air is just plain fun. Banned in late 2015 over entirely reasonable neighbour concerns, then pardoned in 2021 once the Vacek Ranch gave us a horizon instead of a fence line.",
    "rules": [
      "An assortment of Chinese stars and throwing knives, propelled at a target marked into scoring regions.",
      "Ten throws. Most points wins.",
      "Ties are decided with a sudden-death shootout."
    ],
    "savior": "Nominate one shuriken before you throw it - that one counts double. Ben Murrill called his 'double shot' on a high-scoring star in 2021 and took the 10 points for top ninja. He was wearing sneakers."
  },
  "Corn Hole": {
    "source": "v1 page",
    "blurb": "America's favourite tailgating pastime turns up late on day two, right when hand-eye coordination is at its most theoretical. Sponsorship from Johnsonville has not yet materialised, but hope costs nothing.",
    "rules": [
      "Pair event. The first-place decathlete picks their partner first, then second place, and on down.",
      "Partners stay on the same side of the boards, so every team has one left-side and one right-side thrower.",
      "Play to 21, no penalty for going over.",
      "Single elimination bracket."
    ],
    "snafu": "Miss the board with all four bags and it costs you 10 push-ups.",
    "savior": "All four bags in the hole by a single player in one turn is an immediate walk-off win for the team. You got Belize'd."
  },
  "Beer Pong": {
    "source": "v1 page",
    "blurb": "All good things must end, and the Darwin Decathlon ends in style. Double elimination beer pong must always close a sanctioned tournament, partly for tradition and partly because nothing after it would be legible on a scorecard.",
    "rules": [
      "Beirut rules, double elimination. Ten cups a side in a pyramid pointing at the opposition.",
      "Three beers fill the ten cups - 3.3 ounces each, measured, no negotiation.",
      "Each team gets one restack to consolidate what is left into a tight formation.",
      "Both players make it in a row and you get both balls back.",
      "Three consecutive makes by one player earns a free return ball.",
      "The instant the ball touches anything - table, cup, player, ceiling - it is loose. Loose balls are fair game for anybody, by any means necessary."
    ],
    "snafu": "Get shut out and every losing player takes a shot of liquor.",
    "savior": "One 'blue ball' per player per round, called before the shot. Make it and you pick another cup for the opposition to drink and clear off the table."
  },
  "Kickball": {
    "source": "unrecorded",
    "blurb": "Put me in, coach. Kickball arrived in 2023 as the champion's replacement pick, delivering the specific joy of watching grown men discover that a playground ball moves very differently than it did in fourth grade. No formal rules sheet was written down.",
    "rules": []
  },
  "Shuffle Board": {
    "source": "2015 deck",
    "blurb": "Eight throws down a sand-dusted board in a sports bar, decided almost entirely by how hard you are willing to commit on the last one.",
    "rules": [
      "Total score across eight throws. Most points wins.",
      "The puck must be completely over the line to count. Completely."
    ],
    "snafu": "Score zero and you are drinking a GoldschlÃƒÂ¤ger shot."
  },
  "Darts": {
    "source": "2015 deck",
    "blurb": "Fifteen darts in a sports bar, somewhere north of the fourth beer. Everyone believes they are good at darts. The scorecard has been unkind about this.",
    "rules": [
      "Fifteen darts. Highest total score wins."
    ],
    "snafu": "Total under 20 and you are drinking a cosmopolitan martini, garnish and all."
  },
  "Golden Tee": {
    "source": "2015 deck",
    "blurb": "Nine holes on the barroom machine at Stars Sports Bar, where the trackball has ended more promising campaigns than any real fairway ever has.",
    "rules": [
      "Fewest strokes over nine holes.",
      "Upgraded clubs, balls and tees are all fair game - spend the currency."
    ],
    "snafu": "Drink every time you land in the rough or a bunker. Find the water and it is a Grape Ape shot."
  },
  "TopGolf": {
    "source": "2015 deck",
    "blurb": "One round of TopDrive out on the I-10 bay, climate controlled and civilised, which in hindsight is exactly why it eventually got voted off.",
    "rules": [
      "One round of TopDrive. Highest score wins."
    ],
    "snafu": "Hit the red target and you have earned yourself a Jaeger shot."
  },
  "Field Goal Kicking": {
    "source": "2015 deck",
    "blurb": "Start close, and keep backing up until the field runs out of kickers. Nobody has ever discovered their true range in a way they enjoyed.",
    "rules": [
      "Everyone starts at 15 yards and the spot moves back 5 yards each round.",
      "Furthest successful kick wins.",
      "Ties go to a kick-off that continues until one player misses."
    ]
  },
  "Go Karts": {
    "source": "unrecorded",
    "blurb": "Contested exactly once, in 2018, and never seen again - the only indoor, wheeled, and arguably genuinely dangerous event in Darwin Decathlon history. Scored on fastest lap. No rules sheet survives, which given the format is probably for the best.",
    "rules": []
  }
};
