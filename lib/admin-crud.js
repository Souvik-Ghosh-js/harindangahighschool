import "server-only";
import { revalidatePath } from "next/cache";
import { all, one, run, batch } from "./db";
import { ENTITIES } from "./entities";
import { BLOCKS } from "./blocks";
import { cleanFields, slugify } from "./validate";
import { HttpError } from "./auth";

/* Every publish refreshes the whole public site's cache, so changes are
   live within seconds while pages stay statically fast. */
export function refreshSite() {
  revalidatePath("/", "layout");
}

export function entityDef(key) {
  const def = ENTITIES[key];
  if (!def) throw new HttpError(404, "Unknown section.");
  return def;
}

const COLUMN_TYPES = new Set(["text", "textarea", "url", "number", "toggle", "date", "image", "file", "select"]);
const columnFields = (def) => def.fields.filter((f) => COLUMN_TYPES.has(f.type));

async function uniqueSlug(table, base, exceptId = 0) {
  let slug = slugify(base);
  let n = 2;
  while (await one(`SELECT 1 FROM ${table} WHERE slug = ? AND id != ?`, [slug, exceptId])) slug = `${slugify(base)}-${n++}`;
  return slug;
}

function toDb(f, v) {
  if (f.type === "toggle") return v ? 1 : 0;
  if (v === undefined) return null;
  return v;
}

export async function listEntity(key, { q = "", status = "" } = {}) {
  const def = entityDef(key);
  const where = [];
  const args = [];
  if (status) {
    where.push("status = ?");
    args.push(status);
  }
  if (q) {
    where.push(`${def.titleField} LIKE ?`);
    args.push(`%${q}%`);
  }
  const extra = def.photos ? `, (SELECT COUNT(*) FROM ${def.photos} p WHERE p.${def.photos === "event_photos" ? "event_id" : "album_id"} = t.id) AS photo_count` : "";
  const thumb = def.fields.find((f) => f.type === "image")?.name;
  const rows = await all(
    `SELECT t.id, t.slug, t.status, t.updated_at, ${def.columns.filter((c) => c !== "status").map((c) => `t.${c}`).join(", ")}
     ${thumb ? `, t.${thumb} AS thumb` : ""} ${extra}
     FROM ${def.table} t ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY ${def.orderBy} LIMIT 1000`,
    args
  );
  return rows;
}

export async function getEntity(key, id) {
  const def = entityDef(key);
  const row = await one(`SELECT * FROM ${def.table} WHERE id = ?`, [id]);
  if (!row) throw new HttpError(404, "Not found — it may have been deleted.");
  for (const f of def.fields) if (f.type === "toggle") row[f.name] = !!row[f.name];
  if (def.photos) {
    const fk = def.photos === "event_photos" ? "event_id" : "album_id";
    row.photos = await all(`SELECT media_id, caption FROM ${def.photos} WHERE ${fk} = ? ORDER BY sort, id`, [id]);
  }
  if (key === "teachers") {
    row.departments = (await all("SELECT department_id FROM teacher_departments WHERE teacher_id = ?", [id])).map((r) => r.department_id);
  }
  return row;
}

async function saveChildren(key, def, id, data) {
  if (def.photos && Array.isArray(data.photos)) {
    const fk = def.photos === "event_photos" ? "event_id" : "album_id";
    await batch([
      { sql: `DELETE FROM ${def.photos} WHERE ${fk} = ?`, args: [id] },
      ...data.photos.map((p, i) => ({
        sql: `INSERT INTO ${def.photos} (${fk}, media_id, caption, sort) VALUES (?,?,?,?)`,
        args: [id, p.media_id, p.caption, i],
      })),
    ]);
  }
  if (key === "teachers" && Array.isArray(data.departments)) {
    await batch([
      { sql: "DELETE FROM teacher_departments WHERE teacher_id = ?", args: [id] },
      ...data.departments.map((d) => ({ sql: "INSERT OR IGNORE INTO teacher_departments VALUES (?,?)", args: [id, d] })),
    ]);
  }
}

export async function createEntity(key, input) {
  const def = entityDef(key);
  const { data, errors, ok } = cleanFields(def.fields, input);
  if (!ok) throw new HttpError(400, Object.values(errors)[0]);
  const cols = columnFields(def);
  const slug = await uniqueSlug(def.table, `${data[def.titleField]}${key === "notices" && data.date ? " " + data.date.slice(0, 4) : ""}`);
  let sort = [];
  if (def.sortable) {
    const r = await one(`SELECT COALESCE(MAX(sort), -1) + 1 AS n FROM ${def.table}`);
    sort = [["sort", r.n]];
  }
  const pairs = [["slug", slug], ...cols.map((f) => [f.name, toDb(f, data[f.name])]), ...sort];
  const r = await run(
    `INSERT INTO ${def.table} (${pairs.map((p) => p[0]).join(", ")}) VALUES (${pairs.map(() => "?").join(", ")})`,
    pairs.map((p) => p[1])
  );
  await saveChildren(key, def, r.id, data);
  refreshSite();
  return { id: r.id, slug, title: data[def.titleField] };
}

export async function updateEntity(key, id, input) {
  const def = entityDef(key);
  const prev = await one(`SELECT id FROM ${def.table} WHERE id = ?`, [id]);
  if (!prev) throw new HttpError(404, "Not found — it may have been deleted.");
  const { data, errors, ok } = cleanFields(def.fields, input, { partial: true });
  if (!ok) throw new HttpError(400, Object.values(errors)[0]);
  const cols = columnFields(def).filter((f) => f.name in data);
  if (cols.length) {
    await run(
      `UPDATE ${def.table} SET ${cols.map((f) => `${f.name} = ?`).join(", ")}, updated_at = datetime('now') WHERE id = ?`,
      [...cols.map((f) => toDb(f, data[f.name])), id]
    );
  } else {
    await run(`UPDATE ${def.table} SET updated_at = datetime('now') WHERE id = ?`, [id]);
  }
  await saveChildren(key, def, id, data);
  refreshSite();
  const row = await one(`SELECT slug, ${def.titleField} AS title FROM ${def.table} WHERE id = ?`, [id]);
  return { id, ...row };
}

/* "Delete" for everyone except the Super Admin means archive — nothing is
   ever lost by mistake. Super Admins can permanently delete archived items. */
export async function removeEntity(key, id, { hard = false } = {}) {
  const def = entityDef(key);
  const row = await one(`SELECT id, status, ${def.titleField} AS title FROM ${def.table} WHERE id = ?`, [id]);
  if (!row) throw new HttpError(404, "Not found.");
  if (hard) {
    if (row.status !== "archived") throw new HttpError(400, "Archive it first, then delete permanently.");
    await run(`DELETE FROM ${def.table} WHERE id = ?`, [id]);
  } else {
    await run(`UPDATE ${def.table} SET status = 'archived', updated_at = datetime('now') WHERE id = ?`, [id]);
  }
  refreshSite();
  return row;
}

export async function reorderEntity(key, ids) {
  const def = entityDef(key);
  if (!def.sortable) throw new HttpError(400, "This list cannot be reordered.");
  const list = (Array.isArray(ids) ? ids : []).map(Number).filter(Number.isInteger).slice(0, 1000);
  await batch(list.map((id, i) => ({ sql: `UPDATE ${def.table} SET sort = ? WHERE id = ?`, args: [i, id] })));
  refreshSite();
}

/* ---------- Blocks ---------- */
export async function readBlock(key) {
  if (!BLOCKS[key]) throw new HttpError(404, "Unknown page section.");
  const r = await one("SELECT data, updated_at FROM blocks WHERE key = ?", [key]);
  let data = {};
  try {
    data = r ? JSON.parse(r.data) : {};
  } catch {}
  return { data, updated_at: r?.updated_at || null };
}

export async function writeBlock(key, input, admin) {
  const def = BLOCKS[key];
  if (!def) throw new HttpError(404, "Unknown page section.");
  const { data, errors, ok } = cleanFields(def.fields, input);
  if (!ok) throw new HttpError(400, Object.values(errors)[0]);
  if (key === "popup") {
    const prev = await readBlock("popup");
    data.version = (Number(prev.data.version) || 0) + 1; // show again to everyone
  }
  await run(
    `INSERT INTO blocks (key, data, updated_at, updated_by) VALUES (?, ?, datetime('now'), ?)
     ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
    [key, JSON.stringify(data), admin?.id ?? null]
  );
  refreshSite();
  return data;
}
