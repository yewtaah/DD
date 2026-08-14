#!/usr/bin/env python3
"""
test_scorekeeper_api.py - integration tests for the live scorekeeping API
(aws/lambda/scorekeeper/index.py), run against a real deployed endpoint.

These are integration tests, not unit tests with mocks: they hit the actual
API Gateway -> Lambda -> Aurora Data API path, the same one a scorekeeper's
phone hits, because the interesting bugs in this system (the two Bedrock-style
IAM gotchas the chat Lambda hit, an RDS Data API multi-statement limitation,
a password-hash mismatch) only show up against the real services - see
DEPLOYMENT.md's "why two clouds" section for the same reasoning applied
elsewhere in this repo. Every test cleans up the rows it creates via a direct
RDS Data API connection, so the shared training database (tournament_type=
'training', see data/schema.sql) is left exactly as it was found.

Usage:
    pip install boto3          # only needed for teardown; stdlib covers the rest
    python tests/test_scorekeeper_api.py [--base-url URL] [--password PASSWORD]

    --base-url defaults to the production path (https://www.darwindecathlon.com
    /api/scorekeeper). Point it at an Amplify preview branch while a PR is open,
    e.g. https://<branch>.d229tg7lo920rr.amplifyapp.com/api/scorekeeper
    --password defaults to the shared scorekeeper password seeded for the
    Golden Tee / Corn Hole training event. Override if it's ever rotated.

Requires AWS credentials for the RDS Data API cleanup calls (same account/role
used to provision the cluster - see DEPLOYMENT.md). Read-only assertions still
run without them; only teardown needs credentials.
"""
import argparse
import json
import sys
import unittest
import urllib.error
import urllib.request

CLUSTER_ARN = "arn:aws:rds:us-east-1:654700647887:cluster:dd-live-scoring"
SECRET_ARN = (
    "arn:aws:secretsmanager:us-east-1:654700647887:"
    "secret:rds!cluster-fa08f829-599f-421d-a358-c173da062646-HVosre"
)
DATABASE_NAME = "ddlive"

BASE_URL = "https://www.darwindecathlon.com/api/scorekeeper"
PASSWORD = "Ron"


def http(method, path, body=None):
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())


def _rds_data():
    import boto3
    # Must be explicit: this cluster lives in us-east-1, but a caller's local
    # AWS CLI default region can easily be something else (it was us-east-2
    # during development), and boto3 silently uses that default instead of
    # erroring - the Data API call then fails with a mismatched-region error
    # that boto3.client() gives no hint about until you actually call it.
    return boto3.client("rds-data", region_name="us-east-1")


def db_execute(sql, params=None):
    client = _rds_data()
    kwargs = dict(resourceArn=CLUSTER_ARN, secretArn=SECRET_ARN, database=DATABASE_NAME,
                  sql=sql, includeResultMetadata=True)
    if params:
        kwargs["parameters"] = params
    return client.execute_statement(**kwargs)


def db_rows(resp):
    cols = [c["label"] for c in resp.get("columnMetadata", [])]
    out = []
    for rec in resp.get("records", []):
        out.append({c: (list(f.values())[0] if f and not f.get("isNull") else None)
                    for c, f in zip(cols, rec)})
    return out


def delete_player(full_name):
    """Test-only cleanup: removes a player (and cascading results/details/audit
    rows via ON DELETE CASCADE where the schema defines it) by exact name
    match. Never call this outside a test's own teardown."""
    rows = db_rows(db_execute(
        "SELECT player_id FROM players WHERE lower(first_name || ' ' || last_name) = lower(:n)",
        [{"name": "n", "value": {"stringValue": full_name}}],
    ))
    for r in rows:
        pid = r["player_id"]
        # A teammate's results row can still point at this player via
        # partner_player_id even after this player's own results row is gone
        # (pairs cross-reference each other - see _upsert_result in
        # aws/lambda/scorekeeper/index.py) - clear that first or the FK on
        # players blocks the delete.
        db_execute("UPDATE results SET partner_player_id = NULL WHERE partner_player_id = :p",
                   [{"name": "p", "value": {"longValue": pid}}])
        db_execute("DELETE FROM results_audit WHERE result_id IN (SELECT result_id FROM results WHERE player_id = :p)",
                   [{"name": "p", "value": {"longValue": pid}}])
        db_execute("DELETE FROM result_details WHERE result_id IN (SELECT result_id FROM results WHERE player_id = :p)",
                   [{"name": "p", "value": {"longValue": pid}}])
        db_execute("DELETE FROM results WHERE player_id = :p", [{"name": "p", "value": {"longValue": pid}}])
        db_execute("DELETE FROM players WHERE player_id = :p", [{"name": "p", "value": {"longValue": pid}}])


class EventLookup(unittest.TestCase):
    def test_golden_tee_event_resolves(self):
        status, body = http("GET", "/event?slug=golden-tee")
        self.assertEqual(status, 200)
        self.assertEqual(body["event_name"], "Golden Tee")
        self.assertEqual(body["tournament_type"], "training")

    def test_corn_hole_event_resolves(self):
        status, body = http("GET", "/event?slug=corn-hole")
        self.assertEqual(status, 200)
        self.assertEqual(body["event_name"], "Corn Hole")
        self.assertEqual(body["tournament_type"], "training")

    def test_unknown_slug_404s(self):
        status, body = http("GET", "/event?slug=nonexistent-event-xyz")
        self.assertEqual(status, 404)


class Login(unittest.TestCase):
    def setUp(self):
        self.teid = http("GET", "/event?slug=golden-tee")[1]["tournament_event_id"]

    def test_correct_password_succeeds(self):
        status, body = http("POST", "/login", {
            "tournament_event_id": self.teid, "password": PASSWORD, "name": "Test Runner",
        })
        self.assertEqual(status, 200)
        self.assertTrue(body["ok"])

    def test_wrong_password_rejected(self):
        status, body = http("POST", "/login", {
            "tournament_event_id": self.teid, "password": "definitely-wrong", "name": "Test Runner",
        })
        self.assertEqual(status, 401)

    def test_missing_name_rejected(self):
        status, body = http("POST", "/login", {
            "tournament_event_id": self.teid, "password": PASSWORD, "name": "",
        })
        self.assertEqual(status, 400)


class GoldenTeeScoring(unittest.TestCase):
    PLAYER = "Test Runner Golden"

    def setUp(self):
        self.teid = http("GET", "/event?slug=golden-tee")[1]["tournament_event_id"]

    def tearDown(self):
        delete_player(self.PLAYER)

    def test_submit_then_read_back(self):
        status, body = http("POST", "/scores/golden-tee", {
            "tournament_event_id": self.teid, "password": PASSWORD, "name": "Test Runner",
            "player_name": self.PLAYER, "strokes": 35,
            "great_shot_points": 3, "rough_bunker_count": 2, "water_count": 0,
        })
        self.assertEqual(status, 200, body)
        self.assertTrue(body["ok"])

        _, scores = http("GET", f"/scores?tournament_event_id={self.teid}")
        row = next(r for r in scores["results"] if r["player_name"] == self.PLAYER)
        self.assertEqual(row["raw_score"], "35.00")
        self.assertEqual(row["details"]["great_shot_points"], "3.00")
        self.assertEqual(row["details"]["rough_bunker_count"], "2.00")
        self.assertEqual(row["details"]["water_count"], "0")
        self.assertIsNone(row["updated_at"])

    def test_resubmit_updates_in_place(self):
        http("POST", "/scores/golden-tee", {
            "tournament_event_id": self.teid, "password": PASSWORD, "name": "Test Runner",
            "player_name": self.PLAYER, "strokes": 40, "great_shot_points": 0,
            "rough_bunker_count": 5, "water_count": 2,
        })
        status, body = http("POST", "/scores/golden-tee", {
            "tournament_event_id": self.teid, "password": PASSWORD, "name": "Test Runner Two",
            "player_name": self.PLAYER, "strokes": 33, "great_shot_points": 4,
            "rough_bunker_count": 1, "water_count": 0,
        })
        self.assertEqual(status, 200)

        _, scores = http("GET", f"/scores?tournament_event_id={self.teid}")
        matches = [r for r in scores["results"] if r["player_name"] == self.PLAYER]
        self.assertEqual(len(matches), 1, "resubmitting the same player must update, not duplicate")
        self.assertEqual(matches[0]["raw_score"], "33.00")
        self.assertEqual(matches[0]["updated_by"], "Test Runner Two")

    def test_wrong_password_rejected(self):
        status, _ = http("POST", "/scores/golden-tee", {
            "tournament_event_id": self.teid, "password": "wrong", "name": "Test Runner",
            "player_name": self.PLAYER, "strokes": 35,
        })
        self.assertEqual(status, 401)

    def test_missing_strokes_rejected(self):
        status, _ = http("POST", "/scores/golden-tee", {
            "tournament_event_id": self.teid, "password": PASSWORD, "name": "Test Runner",
            "player_name": self.PLAYER,
        })
        self.assertEqual(status, 400)


class CornHoleScoring(unittest.TestCase):
    A1, A2 = "Test Runner CornA1", "Test Runner CornA2"
    B1, B2 = "Test Runner CornB1", "Test Runner CornB2"

    def setUp(self):
        self.teid = http("GET", "/event?slug=corn-hole")[1]["tournament_event_id"]

    def tearDown(self):
        for name in (self.A1, self.A2, self.B1, self.B2):
            delete_player(name)

    def _submit(self, score_a=21, score_b=14, belized_team=""):
        return http("POST", "/scores/corn-hole", {
            "tournament_event_id": self.teid, "password": PASSWORD, "name": "Test Runner",
            "team_a_player1": self.A1, "team_a_player2": self.A2, "team_a_score": score_a,
            "team_b_player1": self.B1, "team_b_player2": self.B2, "team_b_score": score_b,
            "belized_team": belized_team,
        })

    def test_submit_creates_four_cross_referenced_rows(self):
        status, body = self._submit(score_a=21, score_b=14)
        self.assertEqual(status, 200, body)
        self.assertEqual(len(body["result_ids"]), 4)

        _, scores = http("GET", f"/scores?tournament_event_id={self.teid}")
        by_name = {r["player_name"]: r for r in scores["results"]
                   if r["player_name"] in (self.A1, self.A2, self.B1, self.B2)}
        self.assertEqual(len(by_name), 4)

        # Partners cross-reference each other, both get the team's score, winner gets placement 1.
        self.assertEqual(by_name[self.A1]["partner_name"], self.A2)
        self.assertEqual(by_name[self.A2]["partner_name"], self.A1)
        self.assertEqual(by_name[self.A1]["raw_score"], "21.00")
        self.assertEqual(by_name[self.A2]["raw_score"], "21.00")
        self.assertEqual(by_name[self.A1]["placement"], 1)
        self.assertEqual(by_name[self.B1]["raw_score"], "14.00")
        self.assertEqual(by_name[self.B1]["placement"], 2)

    def test_belized_walkoff_overrides_score_based_winner(self):
        # Team B has fewer points but wins outright via the walk-off rule.
        status, body = self._submit(score_a=18, score_b=9, belized_team="b")
        self.assertEqual(status, 200, body)

        _, scores = http("GET", f"/scores?tournament_event_id={self.teid}")
        by_name = {r["player_name"]: r for r in scores["results"]
                   if r["player_name"] in (self.A1, self.A2, self.B1, self.B2)}
        self.assertEqual(by_name[self.B1]["placement"], 1)
        self.assertEqual(by_name[self.B1]["details"]["belized_win"], "1.00")
        self.assertEqual(by_name[self.A1]["placement"], 2)
        self.assertNotIn("belized_win", by_name[self.A1]["details"])

    def test_missing_player_rejected(self):
        status, _ = http("POST", "/scores/corn-hole", {
            "tournament_event_id": self.teid, "password": PASSWORD, "name": "Test Runner",
            "team_a_player1": self.A1, "team_a_player2": "", "team_a_score": 21,
            "team_b_player1": self.B1, "team_b_player2": self.B2, "team_b_score": 10,
        })
        self.assertEqual(status, 400)

    def test_invalid_belized_team_rejected(self):
        status, _ = self._submit(belized_team="c")
        self.assertEqual(status, 400)


def main():
    global BASE_URL, PASSWORD
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--base-url", default=BASE_URL, help="scorekeeper API base URL")
    parser.add_argument("--password", default=PASSWORD, help="shared scorekeeper password to test with")
    args, remaining = parser.parse_known_args()

    BASE_URL = args.base_url.rstrip("/")
    PASSWORD = args.password

    unittest.main(argv=[sys.argv[0]] + remaining)


if __name__ == "__main__":
    main()
