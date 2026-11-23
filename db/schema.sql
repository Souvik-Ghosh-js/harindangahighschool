-- Harindanga High School — database schema (Turso / libSQL)
-- Every statement is idempotent so `npm run db:migrate` is always safe to re-run.

CREATE TABLE IF NOT EXISTS admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name          TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super','editor')),
  active        INTEGER NOT NULL DEFAULT 1,
  token_version INTEGER NOT NULL DEFAULT 1,   -- bump to sign a user out everywhere
  last_login_at TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Brute-force protection. Keyed by "ip:<addr>" and "email:<addr>".
CREATE TABLE IF NOT EXISTS login_attempts (
  key          TEXT PRIMARY KEY,
  count        INTEGER NOT NULL DEFAULT 0,
  first_at     INTEGER NOT NULL,
  locked_until INTEGER NOT NULL DEFAULT 0
);

-- Uploaded photos and documents. Bytes live in media_chunks so large PDFs
-- never exceed a single request/row limit.
CREATE TABLE IF NOT EXISTS media (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  mime       TEXT NOT NULL,
  size       INTEGER NOT NULL,
  width      INTEGER,
  height     INTEGER,
  alt        TEXT NOT NULL DEFAULT '',
  blur       TEXT,                 -- tiny base64 placeholder for smooth image loading
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS media_chunks (
  media_id TEXT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  idx      INTEGER NOT NULL,
  data     BLOB NOT NULL,
  PRIMARY KEY (media_id, idx)
);

-- Free-form editable content: site settings and every fixed page section.
-- `key` examples: site, seo, home.hero, home.journey, leadership, about, admission…
CREATE TABLE IF NOT EXISTS blocks (
  key        TEXT PRIMARY KEY,
  data       TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by INTEGER
);

CREATE TABLE IF NOT EXISTS notices (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'General',
  summary    TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL DEFAULT '',
  date       TEXT NOT NULL,
  expires_on TEXT,
  file_id    TEXT REFERENCES media(id),
  pinned     INTEGER NOT NULL DEFAULT 0,
  status     TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  seo_title  TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS notices_pub ON notices(status, date DESC);

CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  date       TEXT NOT NULL,
  time       TEXT NOT NULL DEFAULT '',
  end_date   TEXT,
  venue      TEXT NOT NULL DEFAULT '',
  summary    TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL DEFAULT '',
  cover_id   TEXT REFERENCES media(id),
  status     TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  seo_title  TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS events_pub ON events(status, date DESC);

CREATE TABLE IF NOT EXISTS event_photos (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL REFERENCES media(id),
  caption  TEXT NOT NULL DEFAULT '',
  sort     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS departments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort        INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS teachers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT NOT NULL UNIQUE,
  kind          TEXT NOT NULL DEFAULT 'teaching' CHECK (kind IN ('teaching','office')),
  name          TEXT NOT NULL,
  designation   TEXT NOT NULL DEFAULT '',
  qualification TEXT NOT NULL DEFAULT '',
  subject       TEXT NOT NULL DEFAULT '',
  bio           TEXT NOT NULL DEFAULT '',
  experience    TEXT NOT NULL DEFAULT '',
  photo_id      TEXT REFERENCES media(id),
  sort          INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS teacher_departments (
  teacher_id    INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  PRIMARY KEY (teacher_id, department_id)
);

CREATE TABLE IF NOT EXISTS albums (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  date        TEXT,
  description TEXT NOT NULL DEFAULT '',
  cover_id    TEXT REFERENCES media(id),
  sort        INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS album_photos (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL REFERENCES media(id),
  caption  TEXT NOT NULL DEFAULT '',
  sort     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS downloads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'General',
  file_id    TEXT REFERENCES media(id),
  sort       INTEGER NOT NULL DEFAULT 0,
  status     TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Old URL -> new URL. Filled automatically when a slug changes,
-- and seeded with the legacy website's addresses.
CREATE TABLE IF NOT EXISTS redirects (
  from_path TEXT PRIMARY KEY,
  to_path   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id  INTEGER,
  admin     TEXT NOT NULL DEFAULT '',
  action    TEXT NOT NULL,
  entity    TEXT NOT NULL DEFAULT '',
  entity_id TEXT NOT NULL DEFAULT '',
  summary   TEXT NOT NULL DEFAULT '',
  at        TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS audit_at ON audit_log(at DESC);
