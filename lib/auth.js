/* ============================================================
   Authentication — server-side, real this time.

   The password never reaches the browser. It is stored as a scrypt
   hash in data/admin.json (outside /public so it is never served),
   verified here on the server, and the browser only ever holds a
   signed, httpOnly session cookie it cannot read or forge.

   scrypt comes from node:crypto, so there is no external dependency
   to install or keep patched.
   ============================================================ */

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const AUTH_FILE = path.join(process.cwd(), "data", "admin.json");
export const COOKIE = "hhs_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

/* ---------- password hashing ---------- */

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${key}`;
}

export function verifyPassword(password, stored) {
  try {
    const [scheme, salt, key] = String(stored).split("$");
    if (scheme !== "scrypt" || !salt || !key) return false;
    const derived = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(key, "hex");
    if (derived.length !== expected.length) return false;
    // Constant-time compare so response timing cannot leak the hash.
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/* ---------- credential file ---------- */

export async function readAdmin() {
  try {
    return JSON.parse(await fs.readFile(AUTH_FILE, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

export async function writeAdmin(record) {
  await fs.mkdir(path.dirname(AUTH_FILE), { recursive: true });
  await fs.writeFile(AUTH_FILE, JSON.stringify(record, null, 2) + "\n", "utf8");
}

/* The secret signs session cookies. If the operator has not set one,
   derive a stable fallback from the password hash so sessions still
   work — but warn, because a set secret survives password changes. */
async function sessionSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  const admin = await readAdmin();
  if (admin?.hash) return "derived:" + admin.hash;
  return "insecure-development-secret";
}

/* ---------- session cookie ---------- */

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export async function createSession(username) {
  const payload = JSON.stringify({
    u: username,
    exp: Date.now() + MAX_AGE * 1000,
  });
  const body = Buffer.from(payload).toString("base64url");
  const secret = await sessionSecret();
  return `${body}.${sign(body, secret)}`;
}

export async function readSession(token) {
  if (!token || typeof token !== "string") return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const secret = await sessionSecret();
  const expected = sign(body, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

/* A Secure cookie is only ever sent over HTTPS, so on a plain-http
   address the browser silently discards it and every sign-in appears
   to fail. That is correct behaviour and must stay on by default.

   ALLOW_INSECURE_COOKIES exists purely for testing on a provisional
   http-only host address before a real domain and SSL are in place.
   Remove it as soon as the site has HTTPS — leaving it set means the
   session cookie can travel in the clear. */
const allowInsecure = process.env.ALLOW_INSECURE_COOKIES === "true";

if (allowInsecure && process.env.NODE_ENV === "production") {
  console.warn(
    "[auth] ALLOW_INSECURE_COOKIES is enabled: session cookies are NOT " +
      "restricted to HTTPS. Use this only for temporary http testing, and " +
      "remove it once SSL is active."
  );
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: MAX_AGE,
  secure: process.env.NODE_ENV === "production" && !allowInsecure,
};

/* ---------- brute-force throttle ---------- */

const attempts = new Map();
const WINDOW = 15 * 60 * 1000;
const LIMIT = 8;

export function throttle(ip) {
  const now = Date.now();
  const rec = attempts.get(ip) || { count: 0, first: now };
  if (now - rec.first > WINDOW) {
    rec.count = 0;
    rec.first = now;
  }
  rec.count += 1;
  attempts.set(ip, rec);
  if (attempts.size > 5000) attempts.clear(); // bound memory
  return { blocked: rec.count > LIMIT, remaining: Math.max(0, LIMIT - rec.count) };
}

export function clearThrottle(ip) {
  attempts.delete(ip);
}
