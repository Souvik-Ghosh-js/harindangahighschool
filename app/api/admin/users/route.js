import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin, handler, audit, HttpError } from "@/lib/auth";
import { all, one, run } from "@/lib/db";

export const GET = handler(async (request) => {
  await requireAdmin(request, { role: "super" });
  const users = await all("SELECT id, email, name, role, active, last_login_at, created_at FROM admins ORDER BY id");
  return NextResponse.json({ users });
});

export const POST = handler(async (request) => {
  const admin = await requireAdmin(request, { role: "super" });
  const b = await request.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  const name = String(b.name || "").trim().slice(0, 80);
  const password = String(b.password || "");
  const role = b.role === "super" ? "super" : "editor";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Enter a valid email address.");
  if (password.length < 8) throw new HttpError(400, "Password must be at least 8 characters.");
  if (await one("SELECT 1 FROM admins WHERE email = ?", [email])) throw new HttpError(409, "An account with this email already exists.");
  const r = await run("INSERT INTO admins (email, name, password_hash, role) VALUES (?,?,?,?)", [email, name, await bcrypt.hash(password, 12), role]);
  await audit(admin, "create", "Admin user", r.id, email);
  return NextResponse.json({ ok: true, id: r.id });
});
