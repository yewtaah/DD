# Disclaimer, Licensing & Participant Notice

## What this project is

The Darwin Decathlon is a **private, non-commercial social gathering among friends.**
This repository and the sites it publishes are a hobby project documenting it.

It is **not** a business, a sanctioned sporting body, an event-management service, or
a commercial venture. Nothing here is sold, and no advertising revenue is collected.

---

## Licensing model

The repository is **deliberately split into two licenses.** This matters: a single
permissive license across the whole repo would let anyone reuse participants'
photographs and names commercially with nothing but an attribution line.

| What | License | Why |
|---|---|---|
| **Code** — HTML, CSS, JavaScript, SQL schema, build/config | [MIT](LICENSE-CODE.txt) | Short, universally understood, and carries both an "AS IS" warranty disclaimer and an explicit limitation of liability. Adequate for a hobby project. *(If you ever want an express patent grant and a formal contributor/NOTICE process — e.g. if outside contributors start filing PRs — switch to Apache-2.0.)* |
| **Content** — photographs, video, scorecards, participant names, written recaps, tournament records | **All Rights Reserved** | Not openly licensed. These depict identifiable private individuals and are not ours to license away on their behalf. |
| **Page template** — the HTML5 UP "Stellar" theme in `assets/` | [CC BY 3.0](LICENSE.txt) | Inherited from the template author. Attribution retained in the site footer as their license requires. |

> **Note on `LICENSE.txt`:** that file is the *template's* CC BY 3.0 license, inherited
> from HTML5 UP. It has never been the license for this project's own code or content,
> and should not be read as one. It stays because the template's license requires it.

### If you want to reuse something here

- **Code** — go ahead, under Apache-2.0.
- **Anything with a person in it** — ask first. The answer is not ours alone to give.

---

## Participant notice

Every person named on this site is a **participant in the tournament.** Each has been
given the site URL and is aware that their name and finishing position are published.

**What is published:** names, event scores, finishing positions, tournament photographs.

**What is never published:** email addresses, phone numbers, and private residential
addresses. Real rosters and scorecards containing contact information are `.gitignore`d
and have never been committed. Where a private home has hosted events, it is recorded
by household name only ("Bateman House") — never by street address or coordinates.

**Removal requests are honored immediately and without argument.** If a participant
asks for their name, score, or photograph to be removed, remove it. Do not ask them to
justify the request and do not wait to be asked a second time.

---

## Third-party names

Brand and venue names appear here **only as nominative references** describing what was
actually played, visited, or consumed at a private gathering — among them TopGolf,
Kan Jam, Golden Tee, K1 Speed, Goldschläger, Jägermeister, Big League Chew, and
Johnsonville.

No affiliation, sponsorship, or endorsement is claimed or implied. All trademarks belong
to their respective owners.

---

## Content warnings and non-endorsement

**Alcohol.** The tournament's "SNAFU" penalties involve drinking, and they are recorded
here because they are part of the event's history and humor. They are **descriptive, not
instructional.** Nothing here encourages anyone to drink, and nothing here should be
treated as a challenge to attempt. The 2019 rules deck's own standing instruction still
applies: *do not plan to drive home from these events if you have been drinking.*

**Firearms.** Several events involve shotguns and rimfire rifles at licensed ranges or
private rural property. Descriptions here are historical records, **not instructions or
safety guidance.** Anyone handling firearms is responsible for doing so lawfully and
safely.

**Thrown weapons.** Shuriken was withdrawn after 2015 over neighbor safety concerns and
only returned on open rural acreage. That sequence is itself the point.

---

## Data accuracy

Historical figures are transcribed from original scorecards and cross-checked against a
second source wherever one exists. Two conventions:

1. **Printed totals win.** Where a scorecard's printed Total disagrees with the sum of
   its own visible cells — which happens in 2018, 2019, 2022 and 2023 — the printed
   total is treated as authoritative, because it is what the tournament actually
   published. Discrepancies are documented, not silently corrected.
2. **Simulated figures are labeled as such.** The win-probability charts in `/live/` are
   **retrospective Monte Carlo simulations, not recorded odds.** Nobody tracked live win
   probability at any tournament. The shape is derived from real scores; the percentages
   are model output and are labeled that way wherever they appear.

Claims that failed verification are recorded in
[`data/UNVERIFIED-claims.md`](data/UNVERIFIED-claims.md) rather than deleted, so the
same bad numbers don't get re-imported later.

---

## AI-generated content

The site includes **Alex**, an AI-generated presenter and tournament historian. Alex is a
**fictional persona** — not based on, named after, or voiced to imitate any real
broadcaster or any real person. She is labeled as AI-generated wherever she appears.

---

## No warranty

This project is provided **as is**, without warranty of any kind, and the authors accept
no liability arising from its use. See [`LICENSE-CODE.txt`](LICENSE-CODE.txt) for the
full disclaimer of warranties and limitation of liability.

*Contact: scott@darwindecathlon.com*
