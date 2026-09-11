#!/usr/bin/env node
/* ============================================================
   Create or change the admin login.

   Usage:
     npm run set-password                       (prompts)
     npm run set-password -- <user> <password>  (non-interactive)

   Writes data/admin.json, which is gitignored and lives outside
   /public so it is never served to a browser.
   ============================================================ */

import readline from "node:readline";
import crypto from "node:crypto";
import { hashPassword, writeAdmin, readAdmin } from "../lib/auth.js";

function ask(question, { hidden = false } = {}) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    if (!hidden) {
      rl.question(question, (a) => { rl.close(); resolve(a); });
      return;
    }
    // Mask typed characters for the password prompt.
    const onData = (char) => {
      const s = String(char);
      if (s === "\n" || s === "\r" || s === "") {
        process.stdin.removeListener("data", onData);
        return;
      }
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(question + "*".repeat(rl.line.length));
    };
    process.stdin.on("data", onData);
    rl.question(question, (a) => { rl.close(); process.stdout.write("\n"); resolve(a); });
  });
}

const [argUser, argPass] = process.argv.slice(2);

const user = argUser || (await ask("Admin username: ")).trim();
if (!user) {
  console.error("\n✗ Username cannot be empty.");
  process.exit(1);
}

const pass = argPass || (await ask("Admin password: ", { hidden: true }));
if (!pass || pass.length < 10) {
  console.error("\n✗ Password must be at least 10 characters.");
  process.exit(1);
}

const existing = await readAdmin();

await writeAdmin({
  username: user,
  hash: hashPassword(pass),
  updated: new Date().toISOString(),
});

console.log(`\n✓ ${existing ? "Password updated" : "Admin account created"} for "${user}".`);
console.log("  Saved to data/admin.json (not committed to git).");

if (!process.env.SESSION_SECRET) {
  console.log("\n  Tip: set a SESSION_SECRET so sessions survive password changes:");
  console.log(`  SESSION_SECRET=${crypto.randomBytes(32).toString("hex")}`);
}

process.exit(0);
