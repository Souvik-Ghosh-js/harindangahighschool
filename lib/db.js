import "server-only";
import { createClient } from "@libsql/client";

/* One libSQL client per server instance. Turso speaks HTTP, so this is
   safe to reuse across serverless invocations. */
const g = globalThis;

export function db() {
  if (!g.__hhsDb) {
    const url = process.env.TURSO_DATABASE_URL;
    if (!url) throw new Error("TURSO_DATABASE_URL is not set");
    g.__hhsDb = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  }
  return g.__hhsDb;
}

export async function all(sql, args = []) {
  const r = await db().execute({ sql, args });
  return r.rows.map((row) => ({ ...row }));
}

export async function one(sql, args = []) {
  const rows = await all(sql, args);
  return rows[0] || null;
}

export async function run(sql, args = []) {
  const r = await db().execute({ sql, args });
  return { changes: r.rowsAffected, id: r.lastInsertRowid != null ? Number(r.lastInsertRowid) : null };
}

export async function batch(statements) {
  return db().batch(statements, "write");
}
