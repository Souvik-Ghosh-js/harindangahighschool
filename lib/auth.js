import "server-only";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { one, run } from "./db";
import { COOKIE, MAX_AGE, verifyToken } from "./jwt";

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};

/* Resolve the signed-in admin. The JWT proves who they are; the DB check
   makes deactivation and password changes take effect immediately. */
export async function currentAdmin() {
  const jar = await cookies();
  const payload = await verifyToken(jar.get(COOKIE)?.value);
  if (!payload?.sub) return null;
  const admin = await one(
    "SELECT id, email, name, role, active, token_version FROM admins WHERE id = ?",
    [Number(payload.sub)]
  );
  if (!admin || !admin.active || admin.token_version !== payload.tv) return null;
  return admin;
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/* Guard for every admin API handler.
   - Same-origin check on writes (CSRF defence on top of SameSite=Lax).
   - Valid, current JWT.
   - Optional role requirement. */
export async function requireAdmin(request, { role } = {}) {
  if (request && request.method !== "GET" && request.method !== "HEAD") {
    const h = await headers();
    const origin = h.get("origin");
    const host = h.get("x-forwarded-host") || h.get("host");
    if (origin && host && new URL(origin).host !== host) {
      throw new HttpError(403, "Request blocked (wrong origin).");
    }
  }
  const admin = await currentAdmin();
  if (!admin) throw new HttpError(401, "Please sign in again.");
  if (role === "super" && admin.role !== "super") {
    throw new HttpError(403, "Only the Super Admin can do this.");
  }
  return admin;
}

/* Wrap a route handler so thrown HttpErrors become clean JSON responses. */
export function handler(fn) {
  return async (request, ctx) => {
    try {
      return await fn(request, ctx);
    } catch (err) {
      if (err instanceof HttpError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      console.error(err);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  };
}

export async function audit(admin, action, entity = "", entityId = "", summary = "") {
  try {
    await run(
      "INSERT INTO audit_log (admin_id, admin, action, entity, entity_id, summary) VALUES (?,?,?,?,?,?)",
      [admin?.id ?? null, admin?.email ?? "", action, entity, String(entityId ?? ""), String(summary).slice(0, 300)]
    );
  } catch (e) {
    console.error("audit failed", e);
  }
}

/* ---------- Login throttling (stored in the DB, so it works across
   serverless instances). 6 failures in 15 min locks for 15 min. ---------- */
const WINDOW = 15 * 60 * 1000;
const LIMIT = 6;

export async function isLocked(keys) {
  const now = Date.now();
  for (const k of keys) {
    const r = await one("SELECT locked_until FROM login_attempts WHERE key = ?", [k]);
    if (r && r.locked_until > now) return Math.ceil((r.locked_until - now) / 60000);
  }
  return 0;
}

export async function recordFailure(keys) {
  const now = Date.now();
  for (const k of keys) {
    const r = await one("SELECT count, first_at FROM login_attempts WHERE key = ?", [k]);
    let count = 1;
    let first = now;
    if (r && now - r.first_at < WINDOW) {
      count = r.count + 1;
      first = r.first_at;
    }
    const locked = count >= LIMIT ? now + WINDOW : 0;
    await run(
      `INSERT INTO login_attempts (key, count, first_at, locked_until) VALUES (?,?,?,?)
       ON CONFLICT(key) DO UPDATE SET count = excluded.count, first_at = excluded.first_at, locked_until = excluded.locked_until`,
      [k, count, first, locked]
    );
  }
}

export async function clearFailures(keys) {
  for (const k of keys) await run("DELETE FROM login_attempts WHERE key = ?", [k]);
}

export async function clientIp() {
  const h = await headers();
  return (
    h.get("x-nf-client-connection-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
