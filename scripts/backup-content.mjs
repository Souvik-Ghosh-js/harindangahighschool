#!/usr/bin/env node
/* ============================================================
   Back up everything the school owns.

     npm run backup

   Copies the three folders that hold runtime content into a
   timestamped folder under backups/:

     public/data/          notices, staff, gallery, pop-up
     public/assets/doc/    notice PDFs
     public/assets/img/    photographs

   Run this before any redeploy, and periodically as a routine
   backup. Download the resulting folder to keep a copy off the
   server.

   Restore is a plain copy back over the same paths.
   ============================================================ */

import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();

const SOURCES = [
  "public/data",
  "public/assets/doc",
  "public/assets/img",
];

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function countFiles(dir) {
  let n = 0;
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    n += e.isDirectory() ? await countFiles(path.join(dir, e.name)) : 1;
  }
  return n;
}

const target = path.join(root, "backups", stamp());
await fs.mkdir(target, { recursive: true });

let total = 0;
for (const src of SOURCES) {
  const from = path.join(root, src);
  if (!(await exists(from))) {
    console.log(`· Skipped ${src} — not found.`);
    continue;
  }
  const to = path.join(target, src);
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.cp(from, to, { recursive: true });
  const n = await countFiles(from);
  total += n;
  console.log(`✓ ${src.padEnd(20)} ${n} file${n === 1 ? "" : "s"}`);
}

console.log(`\n✓ ${total} files backed up to:`);
console.log(`    ${path.relative(root, target)}`);
console.log("\n  Download that folder to keep a copy off the server.");
console.log("  To restore: copy its public/ folder back over the app's public/ folder.");
