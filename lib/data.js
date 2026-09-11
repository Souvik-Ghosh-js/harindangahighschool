/* ============================================================
   Data store — reads and writes the JSON files in /public/data.

   Why files and not a database: the school's content is small
   (tens of notices, dozens of staff), it must survive a host
   migration by copying a folder, and the office staff need to be
   able to back it up themselves. A database would add credentials
   and a migration step for no practical gain at this size.

   Writes are atomic (write to a temp file, then rename) so a crash
   or a simultaneous save can never leave a half-written file that
   would take the whole site down.
   ============================================================ */

import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "public", "data");

export const FILES = {
  notices: "notices.json",
  staff: "staff.json",
  gallery: "gallery.json",
  popup: "popup.json",
};

/* Shape guards — a malformed or missing file must degrade to an
   empty-but-valid structure rather than crashing a page render. */
const DEFAULTS = {
  "notices.json": { notices: [] },
  "staff.json": { teaching: [], office: [], committee: [] },
  "gallery.json": { albums: [] },
  "popup.json": {
    enabled: false,
    title: "",
    message: "",
    image: "",
    linkText: "",
    linkUrl: "",
    updated: "",
    version: 0,
  },
};

function validName(file) {
  return Object.values(FILES).includes(file);
}

export async function readData(file) {
  if (!validName(file)) throw new Error(`Unknown data file: ${file}`);
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    const parsed = JSON.parse(raw);
    return { ...structuredClone(DEFAULTS[file]), ...parsed };
  } catch (err) {
    if (err.code === "ENOENT") return structuredClone(DEFAULTS[file]);
    console.error(`Could not read ${file}:`, err);
    return structuredClone(DEFAULTS[file]);
  }
}

/* Serialise writes per file so two rapid saves cannot interleave. */
const queues = new Map();

export async function writeData(file, data) {
  if (!validName(file)) throw new Error(`Unknown data file: ${file}`);

  const prev = queues.get(file) || Promise.resolve();
  const next = prev.then(() => atomicWrite(file, data)).catch((e) => {
    console.error(`Write failed for ${file}:`, e);
    throw e;
  });
  // Keep the chain alive even if this write rejects.
  queues.set(file, next.catch(() => {}));
  return next;
}

async function atomicWrite(file, data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
  const body = JSON.stringify(data, null, 2) + "\n";

  await fs.writeFile(tmp, body, "utf8");
  await fs.rename(tmp, target);
  return data;
}

/* Convenience readers used by the public pages. */
export async function getNotices() {
  const d = await readData(FILES.notices);
  return (Array.isArray(d.notices) ? d.notices : [])
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export async function getStaff() {
  return readData(FILES.staff);
}

export async function getGallery() {
  const d = await readData(FILES.gallery);
  return Array.isArray(d.albums) ? d.albums : [];
}

export async function getPopup() {
  return readData(FILES.popup);
}
