-- Darwin Decathlon relational schema (Azure SQL / T-SQL)
-- Supersedes CreateDDTables.sql, which never parsed, had no results table,
-- and had a real person's contact info hardcoded in plaintext.
--
-- Design notes:
--   - Standings/points are derived (view), not stored, so there is a single
--     source of truth for who's winning: the results table.
--   - media/media_tags/commentary exist now so the dashboard's photo feed
--     and "commentator banter" features have somewhere to land later;
--     they stay empty until that phase.
--   - No personal contact info (phone/email) belongs in a file that gets
--     committed to a public repo - players.email/phone should only ever be
--     populated via a real data-load step against the live database, never
--     via a seed script checked into source control.

CREATE TABLE players (
    player_id     INT IDENTITY(1,1) PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    nickname      VARCHAR(100) NULL,
    email         VARCHAR(200) NULL,
    phone         VARCHAR(20)  NULL,
    is_active     BIT NOT NULL DEFAULT 1,
    created_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE events (
    event_id            INT IDENTITY(1,1) PRIMARY KEY,
    name                VARCHAR(100) NOT NULL UNIQUE,
    slug                VARCHAR(100) NOT NULL UNIQUE,   -- matches the site's page name, e.g. 'Skeet', 'DiscGolf'
    description          VARCHAR(MAX) NULL,
    icon_asset           VARCHAR(200) NULL,   -- e.g. 'images/D2-Skeet.png'
    is_pair_event        BIT NOT NULL DEFAULT 0,
    scoring_direction     VARCHAR(10) NOT NULL DEFAULT 'high'  -- 'high' = highest raw_score wins, 'low' = lowest wins
        CHECK (scoring_direction IN ('high','low')),
    is_active            BIT NOT NULL DEFAULT 1
);

-- Physical places events are played. Kept separate from tournaments because
-- different events within the same tournament weekend can happen at
-- completely different physical locations (a shooting range, someone's
-- backyard, an actual TopGolf venue, etc), and the same venue can recur
-- across many years - needed for "who last won at this venue" style queries
-- and the future geospatial story map.
CREATE TABLE venues (
    venue_id             INT IDENTITY(1,1) PRIMARY KEY,
    name                 VARCHAR(200) NOT NULL,   -- e.g. 'Vacek Ranch', 'American Shooting Center', 'TopGolf Katy'
    address              VARCHAR(300) NULL,
    latitude             DECIMAL(9,6) NULL,
    longitude            DECIMAL(9,6) NULL,
    notes                VARCHAR(MAX) NULL
);

CREATE TABLE tournaments (
    tournament_id    INT IDENTITY(1,1) PRIMARY KEY,
    year             INT NOT NULL UNIQUE,
    name             VARCHAR(100) NOT NULL,   -- e.g. 'Darwin Decathlon VI'
    start_date       DATE NULL,
    end_date         DATE NULL,
    location         VARCHAR(200) NULL,
    champion_player_id INT NULL REFERENCES players(player_id),
    notes            VARCHAR(MAX) NULL
);

-- One row per event actually played at a given tournament (order, date, and
-- any year-specific SNAFU/SAVIOR twist can differ from the event's defaults).
CREATE TABLE tournament_events (
    tournament_event_id INT IDENTITY(1,1) PRIMARY KEY,
    tournament_id        INT NOT NULL REFERENCES tournaments(tournament_id),
    event_id             INT NOT NULL REFERENCES events(event_id),
    venue_id             INT NULL REFERENCES venues(venue_id),
    event_order          INT NULL,
    played_at            DATETIME2 NULL,
    snafu_text           VARCHAR(MAX) NULL,
    savior_text          VARCHAR(MAX) NULL,
    notes                VARCHAR(MAX) NULL,
    CONSTRAINT uq_tournament_event UNIQUE (tournament_id, event_id)
);

-- One row per player (or pair) per event played. This is the single source
-- of truth results/standings get computed from.
CREATE TABLE results (
    result_id            INT IDENTITY(1,1) PRIMARY KEY,
    tournament_event_id  INT NOT NULL REFERENCES tournament_events(tournament_event_id),
    player_id            INT NOT NULL REFERENCES players(player_id),
    partner_player_id     INT NULL REFERENCES players(player_id),  -- set only for pair events
    raw_score            DECIMAL(10,2) NULL,
    placement            INT NULL,          -- 1 = 1st place, etc.
    points_awarded        DECIMAL(5,2) NULL,
    is_dq                BIT NOT NULL DEFAULT 0,
    notes                VARCHAR(MAX) NULL,
    CONSTRAINT uq_result_player UNIQUE (tournament_event_id, player_id)
);

-- Photos/video for the dashboard's live feed. Populated later (QR upload +
-- AI tagging phase); table exists now so the schema doesn't need to change
-- when that phase starts.
CREATE TABLE media (
    media_id             INT IDENTITY(1,1) PRIMARY KEY,
    tournament_id         INT NULL REFERENCES tournaments(tournament_id),
    tournament_event_id   INT NULL REFERENCES tournament_events(tournament_event_id),
    blob_url             VARCHAR(500) NOT NULL,
    taken_at             DATETIME2 NULL,
    uploaded_by          VARCHAR(200) NULL,
    upload_source        VARCHAR(20) NOT NULL DEFAULT 'admin'
        CHECK (upload_source IN ('admin','qr_feed')),
    caption              VARCHAR(500) NULL,
    created_at           DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- AI- or manually-assigned tags per photo (activity, participant, etc.).
CREATE TABLE media_tags (
    media_tag_id         INT IDENTITY(1,1) PRIMARY KEY,
    media_id             INT NOT NULL REFERENCES media(media_id),
    tag_type             VARCHAR(20) NOT NULL CHECK (tag_type IN ('activity','participant','other')),
    tag_value            VARCHAR(200) NOT NULL,
    player_id            INT NULL REFERENCES players(player_id),  -- resolved identity, when tag_type = 'participant'
    confidence           DECIMAL(4,3) NULL,                        -- 0.000-1.000, null for manual tags
    source                VARCHAR(10) NOT NULL DEFAULT 'manual' CHECK (source IN ('ai','manual'))
);

-- Commentator banter / notable quotes for the dashboard highlight feed.
CREATE TABLE commentary (
    commentary_id        INT IDENTITY(1,1) PRIMARY KEY,
    tournament_event_id   INT NULL REFERENCES tournament_events(tournament_event_id),
    result_id            INT NULL REFERENCES results(result_id),
    author                VARCHAR(200) NULL,
    text                 VARCHAR(MAX) NOT NULL,
    is_featured           BIT NOT NULL DEFAULT 0,
    created_at            DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

GO

-- Per-tournament standings, derived from results (no stored point totals to drift out of sync).
CREATE VIEW v_tournament_standings AS
SELECT
    te.tournament_id,
    r.player_id,
    SUM(r.points_awarded) AS total_points,
    COUNT(*) AS events_played
FROM results r
JOIN tournament_events te ON te.tournament_event_id = r.tournament_event_id
WHERE r.is_dq = 0
GROUP BY te.tournament_id, r.player_id;
GO

-- All-time standings across every tournament loaded.
CREATE VIEW v_alltime_standings AS
SELECT
    r.player_id,
    SUM(r.points_awarded) AS total_points,
    COUNT(DISTINCT te.tournament_id) AS tournaments_played,
    COUNT(*) AS events_played
FROM results r
JOIN tournament_events te ON te.tournament_event_id = r.tournament_event_id
WHERE r.is_dq = 0
GROUP BY r.player_id;
GO

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
WHERE r.placement = 1 AND r.is_dq = 0
GROUP BY e.event_id, e.name, r.player_id;
GO

-- Reference data: the 10 canonical event types, taken from the site's own
-- schedule/rules pages. NOTE: index.html's schedule links "Kickball" to
-- Shuriken.html - the page itself still calls the event "Shuriken" (likely a
-- past rename that never got cleaned up site-wide). Confirm which name is
-- canonical before this ships; slug kept as 'Shuriken' to match the existing
-- page filename either way.
INSERT INTO events (name, slug, icon_asset, is_pair_event, scoring_direction) VALUES
    ('Skeet Shooting',        'Skeet',        'images/D2-Skeet.png',        0, 'high'),
    ('Home Run Derby',        'HomeRunDerby', 'images/D2-HomeRunDerby.png', 0, 'high'),
    ('Washers',               'Washers',      'images/D2-Washers.png',     1, 'high'),
    ('Disc Golf',             'DiscGolf',     'images/D2-DiscGolf.png',    0, 'low'),
    ('Kan Jam',               'KanJam',       'images/D2-KanJam.png',      1, 'high'),
    ('Shooting Gallery',      'Shooting',     'images/D2-Shooting.png',    0, 'high'),
    ('Golf Longest Drive',    'LongDrive',    'images/D2-TopGolf.png',     0, 'high'),
    ('Kickball',              'Shuriken',     'images/D2-Shuriken.png',    0, 'high'),
    ('Corn Hole',             'CornHole',     'images/D2-Cornhole.png',    1, 'high'),
    ('Beer Pong',             'BeerPong',     'images/D2-BeerPong.png',    1, 'high');

-- 2015 (DD1) ran a different lineup - Shuffleboard, Darts, Golden Tee, TopGolf,
-- Field Goal Kicking - confirmed via the real DD1 scorecard (see data/results.csv,
-- gitignored). Icon assets for these already exist (images/D2-Shuffleboard.png,
-- D2-Darts.png, D2-GoldenTee.png, D2-TopGolf.png, D2-FieldGoalKicking.png) but
-- these rows aren't inserted yet - waiting on the full year-by-year walkthrough
-- (icons/locations/rules) before locking in venue assignments and descriptions.
