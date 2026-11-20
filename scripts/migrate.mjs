// Applies db/schema.sql. Safe to run repeatedly.
import { readFile } from "node:fs/promises";
import { client } from "./_db.mjs";

const sql = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
await client.executeMultiple(sql);
const t = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
console.log("Schema up to date. Tables:", t.rows.map((r) => r.name).join(", "));
