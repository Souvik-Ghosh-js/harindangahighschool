import "server-only";
import crypto from "node:crypto";
import { all, batch, one } from "./db";

const CHUNK = 512 * 1024;
export const MAX_UPLOAD = 5 * 1024 * 1024; // 5 MB — fits Netlify's request limit

/* Detect the real file type from its first bytes; never trust the
   browser-supplied type or the file extension. */
export function sniff(buf) {
  const b = buf.subarray(0, 12);
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (b.toString("ascii", 0, 4) === "%PDF") return "application/pdf";
  if (b.toString("ascii", 4, 12).startsWith("ftypavif")) return "image/avif";
  return null;
}

export function safeName(name, mime) {
  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "application/pdf": "pdf" }[mime];
  const base = String(name || "file")
    .replace(/\.[^.]+$/, "")
    .replace(/[^\wঀ-৿ -]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "file";
  return `${base}.${ext}`;
}

export function newId() {
  return crypto.randomBytes(12).toString("hex");
}

export async function saveMedia(buf, { name, mime, width = null, height = null, alt = "", blur = null }) {
  const id = newId();
  const stmts = [
    {
      sql: "INSERT INTO media (id, name, mime, size, width, height, alt, blur) VALUES (?,?,?,?,?,?,?,?)",
      args: [id, safeName(name, mime), mime, buf.length, width, height, alt, blur],
    },
  ];
  for (let i = 0, idx = 0; i < buf.length; i += CHUNK, idx++) {
    stmts.push({
      sql: "INSERT INTO media_chunks (media_id, idx, data) VALUES (?,?,?)",
      args: [id, idx, new Uint8Array(buf.subarray(i, i + CHUNK))],
    });
  }
  // Insert in groups so one huge PDF never becomes one huge request.
  await batch(stmts.slice(0, 2));
  for (let i = 2; i < stmts.length; i += 2) await batch(stmts.slice(i, i + 2));
  return { id, name: safeName(name, mime), mime, size: buf.length, width, height };
}

export async function readMedia(id) {
  const meta = await one("SELECT id, name, mime, size FROM media WHERE id = ?", [id]);
  if (!meta) return null;
  const chunks = await all("SELECT data FROM media_chunks WHERE media_id = ? ORDER BY idx", [id]);
  const body = Buffer.concat(chunks.map((c) => Buffer.from(c.data)));
  return { ...meta, body };
}

/* Media rows for a list of ids, keyed by id — used to attach width,
   height and blur placeholders to images when rendering pages. */
export async function mediaMap(ids) {
  const list = [...new Set(ids.filter(Boolean))];
  if (!list.length) return {};
  const rows = await all(
    `SELECT id, name, mime, size, width, height, alt, blur FROM media WHERE id IN (${list.map(() => "?").join(",")})`,
    list
  );
  return Object.fromEntries(rows.map((r) => [r.id, r]));
}
