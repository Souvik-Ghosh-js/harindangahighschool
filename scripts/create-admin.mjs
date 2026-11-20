// Creates (or resets) a Super Admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
import bcrypt from "bcryptjs";
import { client } from "./_db.mjs";

const email = (process.env.SEED_ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.SEED_ADMIN_PASSWORD || "";
if (!email || password.length < 8) {
  console.error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (8+ chars) in .env first.");
  process.exit(1);
}
const hash = await bcrypt.hash(password, 12);
await client.execute({
  sql: `INSERT INTO admins (email, name, password_hash, role) VALUES (?, 'Super Admin', ?, 'super')
        ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = 'super',
        active = 1, token_version = token_version + 1`,
  args: [email, hash],
});
console.log(`Super Admin ready: ${email}`);
