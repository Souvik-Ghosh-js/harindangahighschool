import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { one, run } from "@/lib/db";
import { signToken, COOKIE } from "@/lib/jwt";
import { cookieOptions, isLocked, recordFailure, clearFailures, clientIp, audit, handler } from "@/lib/auth";

// A real hash to compare against when the email is unknown, so response
// time never reveals whether an account exists.
const DUMMY = "$2b$12$1CiYzSUQZkYN.9qIj.ijcu5Nh2PuefT5z.0zR5shuxrB.ndJriSFq";

export const POST = handler(async (request) => {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== (request.headers.get("x-forwarded-host") || request.headers.get("host"))) {
    return NextResponse.json({ error: "Request blocked." }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase().slice(0, 120);
  const password = String(body.password || "").slice(0, 200);
  if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });

  const ip = await clientIp();
  const keys = [`ip:${ip}`, `email:${email}`];
  const wait = await isLocked(keys);
  if (wait) {
    return NextResponse.json({ error: `Too many wrong attempts. Please try again in ${wait} minute${wait > 1 ? "s" : ""}.` }, { status: 429 });
  }

  const admin = await one("SELECT id, email, name, role, active, password_hash, token_version FROM admins WHERE email = ?", [email]);
  const ok = await bcrypt.compare(password, admin?.password_hash || DUMMY);
  if (!admin || !ok || !admin.active) {
    await recordFailure(keys);
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }

  await clearFailures(keys);
  await run("UPDATE admins SET last_login_at = datetime('now') WHERE id = ?", [admin.id]);
  await audit(admin, "login");
  const token = await signToken(admin);
  const res = NextResponse.json({ ok: true, admin: { name: admin.name, email: admin.email, role: admin.role } });
  res.cookies.set(COOKIE, token, cookieOptions);
  return res;
});
