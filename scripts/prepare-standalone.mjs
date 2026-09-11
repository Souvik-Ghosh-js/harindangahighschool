#!/usr/bin/env node
/* ============================================================
   Completes the standalone build.

   `next build` with output: "standalone" produces a self-contained
   server at .next/standalone, but it does NOT copy:

     .next/static   — the CSS and JS chunks
     public/        — images, PDFs, and the content JSON

   Deploying without them yields a site with no styling, no
   JavaScript and no images. This runs automatically after every
   build (see the "postbuild" script) so the standalone folder is
   always complete and ready to run.
   ============================================================ */

import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(standalone))) {
  console.log("· No .next/standalone folder — skipping (output: 'standalone' not enabled?).");
  process.exit(0);
}

const jobs = [
  { from: path.join(root, ".next", "static"), to: path.join(standalone, ".next", "static"), label: "static chunks (CSS/JS)" },
  { from: path.join(root, "public"), to: path.join(standalone, "public"), label: "public assets" },
];

for (const { from, to, label } of jobs) {
  if (!(await exists(from))) {
    console.log(`· Skipped ${label} — ${path.relative(root, from)} not found.`);
    continue;
  }
  await fs.rm(to, { recursive: true, force: true });
  await fs.cp(from, to, { recursive: true });
  console.log(`✓ Copied ${label} → ${path.relative(root, to)}`);
}

console.log("\n✓ Standalone build is complete and ready to run:");
console.log("    node .next/standalone/server.js");
