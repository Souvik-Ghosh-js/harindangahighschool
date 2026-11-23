import "server-only";
import { cache } from "react";
import { all, one } from "./db";
import { mediaMap } from "./media";
import { BLOCKS } from "./blocks";

/* ============================================================
   Read-only queries for the public website.
   Public pages only ever see status = 'published'.
   ============================================================ */

function defaultsFor(fields) {
  const o = {};
  for (const f of fields) {
    if (f.type === "list") o[f.name] = [];
    else if (f.type === "toggle") o[f.name] = f.default ?? false;
    else if (f.type === "image" || f.type === "file" || f.type === "date" || f.type === "number") o[f.name] = null;
    else o[f.name] = "";
  }
  return o;
}

export const getBlock = cache(async (key) => {
  const def = BLOCKS[key];
  const row = await one("SELECT data FROM blocks WHERE key = ?", [key]);
  let data = {};
  try {
    data = row ? JSON.parse(row.data) : {};
  } catch {}
  return { ...(def ? defaultsFor(def.fields) : {}), ...data };
});

/* Collect every image/file id referenced anywhere inside a value. */
function collectIds(v, out = []) {
  if (!v) return out;
  if (typeof v === "string") {
    if (/^[a-f0-9]{24}$/.test(v)) out.push(v);
  } else if (Array.isArray(v)) v.forEach((x) => collectIds(x, out));
  else if (typeof v === "object") Object.values(v).forEach((x) => collectIds(x, out));
  return out;
}

/* Returns { media } — a lookup of id → {width,height,blur,alt,name,mime}
   for every file referenced by the given values. */
export async function withMedia(...values) {
  return mediaMap(collectIds(values));
}

export const getSite = cache(async () => {
  const [site, seo, nav, announcement, popup, links, policies] = await Promise.all([
    getBlock("site"),
    getBlock("seo"),
    getBlock("navigation"),
    getBlock("announcement"),
    getBlock("popup"),
    getBlock("links"),
    getBlock("policies"),
  ]);
  const media = await withMedia(site.logo, seo.share_image, popup.image);
  return { site, seo, nav, announcement, popup, links, policies, media };
});

/* ---------------- Notices ---------------- */
const NOTICE_COLS = `n.id, n.slug, n.title, n.category, n.summary, n.date, n.expires_on, n.pinned, n.file_id,
  m.name AS file_name, m.mime AS file_mime, m.size AS file_size`;

export const getNotices = cache(async (limit = 500) =>
  all(
    `SELECT ${NOTICE_COLS} FROM notices n LEFT JOIN media m ON m.id = n.file_id
     WHERE n.status = 'published' ORDER BY n.pinned DESC, n.date DESC, n.id DESC LIMIT ?`,
    [limit]
  )
);

export const getLatestNotices = cache(async (limit = 6) =>
  all(
    `SELECT ${NOTICE_COLS} FROM notices n LEFT JOIN media m ON m.id = n.file_id
     WHERE n.status = 'published' ORDER BY n.date DESC, n.id DESC LIMIT ?`,
    [limit]
  )
);

export const getNotice = cache(async (slug) =>
  one(
    `SELECT ${NOTICE_COLS}, n.body, n.seo_title, n.seo_description, n.updated_at FROM notices n
     LEFT JOIN media m ON m.id = n.file_id WHERE n.slug = ? AND n.status = 'published'`,
    [slug]
  )
);

/* ---------------- Events ---------------- */
export const getEvents = cache(async () =>
  all(
    `SELECT e.id, e.slug, e.title, e.date, e.end_date, e.time, e.venue, e.summary, e.cover_id,
            (SELECT COUNT(*) FROM event_photos p WHERE p.event_id = e.id) AS photo_count
     FROM events e WHERE e.status = 'published' ORDER BY e.date DESC, e.id DESC`
  )
);

export const getEvent = cache(async (slug) => {
  const e = await one(
    `SELECT id, slug, title, date, end_date, time, venue, summary, body, cover_id, seo_title, seo_description, updated_at
     FROM events WHERE slug = ? AND status = 'published'`,
    [slug]
  );
  if (!e) return null;
  e.photos = await all("SELECT media_id, caption FROM event_photos WHERE event_id = ? ORDER BY sort, id", [e.id]);
  return e;
});

export function splitEvents(events) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => (e.end_date || e.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => (e.end_date || e.date) < today);
  return { upcoming, past };
}

/* ---------------- Teachers ---------------- */
export const getTeacherTree = cache(async () => {
  const [departments, teachers, links] = await Promise.all([
    all("SELECT id, slug, name, description FROM departments WHERE status = 'published' ORDER BY sort, id"),
    all(
      `SELECT id, slug, name, designation, qualification, subject, experience, bio, photo_id, kind
       FROM teachers WHERE status = 'published' ORDER BY sort, id`
    ),
    all("SELECT teacher_id, department_id FROM teacher_departments"),
  ]);
  const teaching = teachers.filter((t) => t.kind === "teaching");
  const office = teachers.filter((t) => t.kind === "office");
  const byDept = new Map(departments.map((d) => [d.id, []]));
  const placed = new Set();
  for (const l of links) {
    const t = teaching.find((x) => x.id === l.teacher_id);
    if (t && byDept.has(l.department_id)) {
      byDept.get(l.department_id).push(t);
      placed.add(t.id);
    }
  }
  const groups = departments
    .map((d) => ({ ...d, teachers: byDept.get(d.id) }))
    .filter((d) => d.teachers.length);
  const unplaced = teaching.filter((t) => !placed.has(t.id));
  if (unplaced.length) groups.push({ id: 0, slug: "other", name: "Other faculty", description: "", teachers: unplaced });
  return { groups, teaching, office };
});

export const getTeacher = cache(async (slug) => {
  const t = await one(
    `SELECT id, slug, name, designation, qualification, subject, experience, bio, photo_id, kind, updated_at
     FROM teachers WHERE slug = ? AND status = 'published' AND kind = 'teaching'`,
    [slug]
  );
  if (!t) return null;
  t.departments = await all(
    `SELECT d.name, d.slug FROM teacher_departments td JOIN departments d ON d.id = td.department_id
     WHERE td.teacher_id = ? AND d.status = 'published'`,
    [t.id]
  );
  return t;
});

/* ---------------- Gallery ---------------- */
export const getAlbums = cache(async () =>
  all(
    `SELECT a.id, a.slug, a.title, a.date, a.description,
            COALESCE(a.cover_id, (SELECT media_id FROM album_photos p WHERE p.album_id = a.id ORDER BY sort, id LIMIT 1)) AS cover_id,
            (SELECT COUNT(*) FROM album_photos p WHERE p.album_id = a.id) AS photo_count
     FROM albums a WHERE a.status = 'published' ORDER BY a.sort, a.date DESC, a.id DESC`
  )
);

export const getAlbum = cache(async (slug) => {
  const a = await one(
    "SELECT id, slug, title, date, description, cover_id, updated_at FROM albums WHERE slug = ? AND status = 'published'",
    [slug]
  );
  if (!a) return null;
  a.photos = await all("SELECT media_id, caption FROM album_photos WHERE album_id = ? ORDER BY sort, id", [a.id]);
  return a;
});

export const getRecentPhotos = cache(async (limit = 8) =>
  all(
    `SELECT p.media_id, p.caption, a.slug AS album_slug FROM album_photos p JOIN albums a ON a.id = p.album_id
     WHERE a.status = 'published' ORDER BY a.sort, p.sort, p.id LIMIT ?`,
    [limit]
  )
);

/* ---------------- Downloads ---------------- */
export const getDownloads = cache(async () =>
  all(
    `SELECT d.id, d.title, d.category, d.file_id, m.name AS file_name, m.mime AS file_mime, m.size AS file_size
     FROM downloads d JOIN media m ON m.id = d.file_id WHERE d.status = 'published'
     ORDER BY d.category, d.sort, d.id`
  )
);

export const getLastUpdated = cache(async () => {
  const r = await one(
    `SELECT MAX(t) AS t FROM (
       SELECT MAX(updated_at) AS t FROM blocks UNION ALL SELECT MAX(updated_at) FROM notices
       UNION ALL SELECT MAX(updated_at) FROM events UNION ALL SELECT MAX(updated_at) FROM teachers
       UNION ALL SELECT MAX(updated_at) FROM albums UNION ALL SELECT MAX(updated_at) FROM downloads)`
  );
  return r?.t ? String(r.t).slice(0, 10) : null;
});

export async function findRedirect(path) {
  const r = await one("SELECT to_path FROM redirects WHERE from_path = ?", [path]);
  return r?.to_path || null;
}
