// Applies db/schema.sql. Safe to run repeatedly.
import { readFile } from "node:fs/promises";
import { client } from "./_db.mjs";

// Rename teachers.subjects -> teachers.subject on databases created before the rename.
const cols = (await client.execute("PRAGMA table_info(teachers)")).rows.map((r) => r.name);
if (cols.includes("subjects") && !cols.includes("subject")) {
  await client.execute("ALTER TABLE teachers RENAME COLUMN subjects TO subject");
  console.log("Renamed teachers.subjects -> teachers.subject");
}

const sql = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
await client.executeMultiple(sql);
const t = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
console.log("Schema up to date. Tables:", t.rows.map((r) => r.name).join(", "));
