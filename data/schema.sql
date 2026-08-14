-- Darwin Decathlon relational schema (PostgreSQL / Aurora Serverless v2)
--
-- Supersedes the earlier Azure SQL (T-SQL) draft of this file, and
-- CreateDDTables.sql before that (which never parsed, had no results table,
-- and had a real person's contact info hardcoded in plaintext). Nothing was
-- ever provisioned against the T-SQL version - this is the first schema that
-- actually runs against a live database. See DEPLOYMENT.md for how that
-- database is hosted (AWS, Aurora Serverless v2, RDS Data API - no VPC
-- networking needed by either the migration or the application Lambda).
--
-- Design notes:
--   - Standings/points are derived (view), not stored, so there is a single
--     source of truth for who's winning: the results table.
--   - Live scorekeeping additions (result_details, scorekeeper_credentials,
--     results_audit) exist so a scorekeeper's phone can write directly to
--     this database during a live event, safely, from multiple devices at
--     once, with a full history of who-changed-what. See CLAUDE.md /
--     DEPLOYMENT.md for the API that fronts these tables - nothing writes to
--     this database directly from a browser.
--   - media/media_tags/commentary exist now so the dashboard's photo feed
--     and "commentator banter" features have somewhere to land later; they
--     stay empty until that phase.
--   - No personal contact info (phone/email) belongs in a file that gets
--     committed to a public repo - players.email/phone should only ever be
--     populated via a real data-load step against the live database, never
--     via a seed script checked into source control.

CREATE TABLE players (
    player_id     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    nickname      VARCHAR(100) NULL,
    email         VARCHAR(200) NULL,
    phone         VARCHAR(20)  NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE events (
    event_id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                VARCHAR(100) NOT NULL UNIQUE,
    slug                VARCHAR(100) NOT NULL UNIQUE,   -- matches the site's ?event= slug, e.g. 'skeet-shooting'
    description         TEXT NULL,
    icon_asset          VARCHAR(200) NULL,   -- e.g. 'images/badges/badge-Skeet.webp'
    scoring_direction   VARCHAR(10) NOT NULL DEFAULT 'high'  -- 'high' = highest raw_score wins, 'low' = lowest wins
        CHECK (scoring_direction IN ('high','low')),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);
-- NOTE: whether an event is played in pairs is deliberately NOT stored here.
-- It changes year to year - Shuffleboard was an individual event in 2015 but a
-- pair event in 2018. It lives on tournament_events instead.
--
-- NOTE: Shuriken (throwing stars/knives, exiled 2015, pardoned 2021) and
-- Kickball (new in 2023, replaced Shuriken in the rotation) are DISTINCT
-- events that happen to share a page/history in places. An earlier draft of
-- this schema conflated them into one row (Kickball data slugged 'Shuriken')
-- - that was wrong and is fixed here. Keep them as two rows or per-event
-- history merges two unrelated activities.

-- Physical places events are played. Kept separate from tournaments because
-- different events within the same tournament weekend can happen at
-- completely different physical locations (a shooting range, someone's
-- backyard, an actual TopGolf venue, etc), and the same venue can recur
-- across many years - needed for "who last won at this venue" style queries
-- and the geospatial story map already live in Chronicles.
CREATE TABLE venues (
    venue_id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                 VARCHAR(200) NOT NULL,   -- e.g. 'Vacek Ranch', 'American Shooting Center', 'Stars Sports Bar'
    address              VARCHAR(300) NULL,
    city                 VARCHAR(100) NULL,
    state                CHAR(2) NULL,
    -- WGS84 / EPSG:4326 decimal degrees. NUMERIC(9,6) gives ~0.11 m
    -- resolution, far finer than any of this data actually warrants - see
    -- geo_precision.
    latitude             NUMERIC(9,6) NULL,
    longitude            NUMERIC(9,6) NULL,
    -- Honest precision metadata. NEVER treat a coordinate here as surveyed.
    --   'rooftop'  : specific building/parcel, desk-geocoded from a street address
    --   'parcel'   : large site (park, ranch); point is somewhere inside it
    --   'locality' : town/neighborhood centroid only - deliberately coarse
    --   'unknown'  : no coordinate assigned
    geo_precision        VARCHAR(20) NOT NULL DEFAULT 'unknown'
        CHECK (geo_precision IN ('rooftop','parcel','locality','unknown')),
    geo_source            VARCHAR(200) NULL,   -- where the coordinate came from
    -- Privacy gate for the public story map. Private residences must be
    -- rendered at locality precision only, never pinned to the actual property.
    is_private_residence  BOOLEAN NOT NULL DEFAULT FALSE,
    publish_precise_location BOOLEAN NOT NULL DEFAULT TRUE,
    notes                 TEXT NULL
);
-- Spatial index note: if this moves to PostGIS later,
--   ALTER TABLE venues ADD COLUMN geog geography(Point,4326)
--     GENERATED ALWAYS AS (ST_MakePoint(longitude, latitude)::geography) STORED;
--   CREATE INDEX ix_venues_geog ON venues USING GIST (geog);
-- Kept as plain lat/lon columns for now so the static site can consume it as JSON.

-- A "tournament" row is one scored gathering - almost always a full Darwin
-- Decathlon weekend, but tournament_type also allows a standalone
-- single-event session (e.g. testing live scorekeeping on just Golden Tee
-- ahead of the next real decathlon). Training sessions get their own
-- tournament row so scores have somewhere real to attach to, but are
-- excluded from the standings/win-count views below by default so a test
-- session never inflates anyone's career record. There is deliberately no
-- UNIQUE(year) constraint - a training session and the real decathlon can
-- both land in the same calendar year.
CREATE TABLE tournaments (
    tournament_id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                 INT NOT NULL,
    name                 VARCHAR(100) NOT NULL,   -- e.g. 'Darwin Decathlon 6', 'Golden Tee Scorekeeping Trial'
    tournament_type       VARCHAR(20) NOT NULL DEFAULT 'decathlon'
        CHECK (tournament_type IN ('decathlon','training')),
    start_date            DATE NULL,
    end_date              DATE NULL,
    location              VARCHAR(200) NULL,
    champion_player_id     INT NULL REFERENCES players(player_id),
    notes                 TEXT NULL
);

-- One row per event actually played at a given tournament (order, date, and
-- any year-specific SNAFU/SAVIOR twist can differ from the event's defaults).
CREATE TABLE tournament_events (
    tournament_event_id  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tournament_id         INT NOT NULL REFERENCES tournaments(tournament_id),
    event_id              INT NOT NULL REFERENCES events(event_id),
    venue_id              INT NULL REFERENCES venues(venue_id),
    event_order            INT NULL,
    played_at              TIMESTAMPTZ NULL,
    is_pair_event          BOOLEAN NOT NULL DEFAULT FALSE,   -- varies by year; see note on events
    scoring_basis          VARCHAR(200) NULL,        -- e.g. 'Fewest strokes over nine holes'
    rules_text             TEXT NULL,
    snafu_text             TEXT NULL,
    savior_text             TEXT NULL,
    notes                  TEXT NULL,
    CONSTRAINT uq_tournament_event UNIQUE (tournament_id, event_id)
);

-- One row per player (or pair) per event played. This is the single source
-- of truth results/standings get computed from. entered_by/updated_by are
-- free-text scorekeeper names (see scorekeeper_credentials below) - not a
-- foreign key to players, since the person keeping score is often not a
-- competitor and typed their own name in at login.
CREATE TABLE results (
    result_id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tournament_event_id   INT NOT NULL REFERENCES tournament_events(tournament_event_id),
    player_id             INT NOT NULL REFERENCES players(player_id),
    partner_player_id      INT NULL REFERENCES players(player_id),  -- set only for pair events
    raw_score              NUMERIC(10,2) NULL,
    placement              INT NULL,          -- 1 = 1st place, etc.
    points_awarded          NUMERIC(5,2) NULL,
    is_dq                  BOOLEAN NOT NULL DEFAULT FALSE,
    notes                  TEXT NULL,
    entered_by              VARCHAR(200) NULL,
    entered_at              TIMESTAMPTZ NULL,
    updated_by              VARCHAR(200) NULL,
    updated_at              TIMESTAMPTZ NULL,
    CONSTRAINT uq_result_player UNIQUE (tournament_event_id, player_id)
);

-- Generic per-result detail line, for whatever an event needs to track below
-- the single final score - skeet's 25 individual shots, Home Run Derby's 10
-- swings, Golden Tee's great-shot count, a SNAFU trigger count, etc. Every
-- event type's "detail" shape is wildly different and the event lineup
-- itself changes every year, so this stays generic rather than one table per
-- event type. detail_type is free-text by convention, not a CHECK-enforced
-- enum, e.g. for Golden Tee: 'great_shot_points', 'rough_or_bunker_count',
-- 'water_count'; for Skeet: 'shot' with sequence_no 1-25 and value 0/1.
CREATE TABLE result_details (
    result_detail_id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    result_id              INT NOT NULL REFERENCES results(result_id) ON DELETE CASCADE,
    detail_type             VARCHAR(50) NOT NULL,
    sequence_no              INT NULL,          -- e.g. shot/swing number, when the detail is one of a sequence
    label                    VARCHAR(100) NULL,  -- optional human-readable label, e.g. 'Bonus clay'
    value                    NUMERIC(10,2) NULL,
    points                   NUMERIC(5,2) NULL,
    meta                     JSONB NULL,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_result_details_result ON result_details(result_id);

-- Every write to results, for the "CRUD-safe" audit trail multi-device live
-- entry needs - who changed what, from what value, to what, and when.
-- Written by the application (Lambda) on every insert/update, not by a
-- database trigger, so the API can log a clean before/after in one place.
CREATE TABLE results_audit (
    results_audit_id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    result_id               INT NOT NULL REFERENCES results(result_id) ON DELETE CASCADE,
    action                   VARCHAR(10) NOT NULL CHECK (action IN ('insert','update','delete')),
    changed_by               VARCHAR(200) NULL,
    changed_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    old_values                JSONB NULL,
    new_values                JSONB NULL
);
CREATE INDEX ix_results_audit_result ON results_audit(result_id);

-- One shared password per tournament_event, for the on-site scorekeeper(s)
-- for that specific event - matches "a Game Master per event" from the 2023
-- scorecard. password_hash is PBKDF2-HMAC-SHA256, salted, stdlib-only
-- (Python's hashlib) so the Lambda needs no extra dependency to check it.
-- Free-text scorekeeper name is captured per write (results.entered_by), not
-- here - this table only gates who can write, not who specifically did.
CREATE TABLE scorekeeper_credentials (
    tournament_event_id    INT PRIMARY KEY REFERENCES tournament_events(tournament_event_id),
    password_hash            VARCHAR(200) NOT NULL,
    password_salt             VARCHAR(64) NOT NULL,
    created_at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Photos/video for the dashboard's live feed. Populated later (QR upload +
-- AI tagging phase, issue #11); table exists now so the schema doesn't need
-- to change when that phase starts.
CREATE TABLE media (
    media_id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tournament_id           INT NULL REFERENCES tournaments(tournament_id),
    tournament_event_id     INT NULL REFERENCES tournament_events(tournament_event_id),
    blob_url                 VARCHAR(500) NOT NULL,
    taken_at                 TIMESTAMPTZ NULL,
    uploaded_by               VARCHAR(200) NULL,
    upload_source              VARCHAR(20) NOT NULL DEFAULT 'admin'
        CHECK (upload_source IN ('admin','qr_feed')),
    caption                   VARCHAR(500) NULL,
    created_at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI- or manually-assigned tags per photo (activity, participant, etc.).
CREATE TABLE media_tags (
    media_tag_id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    media_id                 INT NOT NULL REFERENCES media(media_id),
    tag_type                  VARCHAR(20) NOT NULL CHECK (tag_type IN ('activity','participant','other')),
    tag_value                  VARCHAR(200) NOT NULL,
    player_id                  INT NULL REFERENCES players(player_id),  -- resolved identity, when tag_type = 'participant'
    confidence                  NUMERIC(4,3) NULL,                        -- 0.000-1.000, null for manual tags
    source                      VARCHAR(10) NOT NULL DEFAULT 'manual' CHECK (source IN ('ai','manual'))
);

-- Commentator banter / notable quotes for the dashboard highlight feed.
CREATE TABLE commentary (
    commentary_id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tournament_event_id       INT NULL REFERENCES tournament_events(tournament_event_id),
    result_id                  INT NULL REFERENCES results(result_id),
    author                      VARCHAR(200) NULL,
    text                        TEXT NOT NULL,
    is_featured                  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at                    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Per-tournament standings, derived from results (no stored point totals to
-- drift out of sync). Restricted to real decathlons - a standalone training
-- session (tournament_type='training') never contributes to a standings view.
CREATE VIEW v_tournament_standings AS
SELECT
    te.tournament_id,
    r.player_id,
    SUM(r.points_awarded) AS total_points,
    COUNT(*) AS events_played
FROM results r
JOIN tournament_events te ON te.tournament_event_id = r.tournament_event_id
JOIN tournaments t ON t.tournament_id = te.tournament_id
WHERE r.is_dq = FALSE AND t.tournament_type = 'decathlon'
GROUP BY te.tournament_id, r.player_id;

-- All-time standings across every real decathlon loaded.
CREATE VIEW v_alltime_standings AS
SELECT
    r.player_id,
    SUM(r.points_awarded) AS total_points,
    COUNT(DISTINCT te.tournament_id) AS tournaments_played,
    COUNT(*) AS events_played
FROM results r
JOIN tournament_events te ON te.tournament_event_id = r.tournament_event_id
JOIN tournaments t ON t.tournament_id = te.tournament_id
WHERE r.is_dq = FALSE AND t.tournament_type = 'decathlon'
GROUP BY r.player_id;

-- Per-event win counts across all years - directly answers questions like
-- "who has won skeet shooting the most times".
CREATE VIEW v_event_win_counts AS
SELECT
    e.event_id,
    e.name AS event_name,
    r.player_id,
    COUNT(*) AS wins
FROM results r
JOIN tournament_events te ON te.tournament_event_id = r.tournament_event_id
JOIN events e ON e.event_id = te.event_id
JOIN tournaments t ON t.tournament_id = te.tournament_id
WHERE r.placement = 1 AND r.is_dq = FALSE AND t.tournament_type = 'decathlon'
GROUP BY e.event_id, e.name, r.player_id;

-- Reference data: all 17 events the site has ever run, canonical names and
-- slugs matching data/event-notes.js and index.html's ALIAS map exactly.
-- icon_asset points at the current badge-*.webp set (issue #6), not the
-- retired D2-*.png pictograms.
INSERT INTO events (name, slug, icon_asset, scoring_direction, is_active) VALUES
    ('Skeet Shooting',     'skeet-shooting',     'images/badges/badge-Skeet.webp',       'high', TRUE),
    ('Home Run Derby',     'home-run-derby',     'images/badges/badge-HomeRunDerby.webp','high', TRUE),
    ('Washers',            'washers',            'images/badges/badge-Washers.webp',     'high', TRUE),
    ('Disc Golf',          'disc-golf',          'images/badges/badge-DiscGolf.webp',    'low',  TRUE),
    ('Kan Jam',            'kan-jam',            'images/badges/badge-KanJam.webp',      'high', TRUE),
    ('Shooting Gallery',   'shooting-gallery',   'images/badges/badge-Shooting.webp',    'high', TRUE),
    ('Long Drive',         'long-drive',         'images/badges/badge-LongDrive.webp',   'high', TRUE),
    ('Shuriken',           'shuriken',           'images/badges/badge-Shuriken.webp',    'high', TRUE),
    ('Corn Hole',          'corn-hole',          'images/badges/badge-CornHole.webp',    'high', TRUE),
    ('Beer Pong',          'beer-pong',          'images/badges/badge-BeerPong.webp',    'high', TRUE),
    ('Kickball',           'kickball',           'images/badges/badge-Kickball.webp',    'high', TRUE),
    ('Shuffle Board',      'shuffle-board',      'images/badges/badge-ShuffleBoard.webp','high', FALSE),
    ('Darts',              'darts',              'images/badges/badge-Darts.webp',       'high', FALSE),
    -- Golden Tee is formally retired (voted off in favor of newer events),
    -- but is_active is set TRUE here since it's being revived for a live
    -- scorekeeping trial - see the 'training' tournament seeded below.
    ('Golden Tee',         'golden-tee',         'images/badges/badge-GoldenTee.webp',   'low',  TRUE),
    ('TopGolf',            'topgolf',            'images/badges/badge-TopGolf.webp',     'high', FALSE),
    ('Field Goal Kicking', 'field-goal-kicking', 'images/badges/badge-FieldGoal.webp',   'high', FALSE),
    ('Go Karts',           'go-karts',           'images/badges/badge-GoKarts.webp',     'high', FALSE);

-- The Golden Tee scorekeeping trial - a standalone, non-decathlon tournament
-- row so live-entered scores have somewhere real to attach to. Excluded from
-- standings/win-count views by tournament_type, so it never inflates a
-- career record. Edit year/dates/location/notes once actually scheduled.
INSERT INTO tournaments (year, name, tournament_type, notes) VALUES
    (2026, 'Golden Tee Scorekeeping Trial', 'training',
     'Standalone single-event test of the live scorekeeping system ahead of the next full Darwin Decathlon. Golden Tee only, not a scored decathlon.');

INSERT INTO tournament_events (tournament_id, event_id, is_pair_event, scoring_basis, rules_text, snafu_text)
SELECT
    t.tournament_id,
    e.event_id,
    FALSE,
    'Fewest strokes over nine holes',
    'Nine holes on the barroom machine. Upgraded clubs, balls and tees are all fair game - spend the currency.',
    'Drink every time you land in the rough or a bunker. Find the water and it is a Grape Ape shot.'
FROM tournaments t, events e
WHERE t.name = 'Golden Tee Scorekeeping Trial' AND e.slug = 'golden-tee';
