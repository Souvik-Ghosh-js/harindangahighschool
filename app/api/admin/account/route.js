import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin, handler, audit, HttpError, cookieOptions } from "@/lib/auth";
import { one, run } from "@/lib/db";
import { signToken, COOKIE } from "@/lib/jwt";

/* Change your own password. Signs out every other device. */
export const PUT = handler(async (request) => {
  const admin = await requireAdmin(request);
  const b = await request.json().catch(() => ({}));
  const row = await one("SELECT password_hash FROM admins WHERE id = ?", [admin.id]);
  if (!(await bcrypt.compare(String(b.current || ""), row.password_hash))) throw new HttpError(400, "Your current password is not correct.");
  const next = String(b.password || "");
  if (next.length < 8) throw new HttpError(400, "New password must be at least 8 characters.");
  await run("UPDATE admins SET password_hash = ?, token_version = token_version + 1 WHERE id = ?", [await bcrypt.hash(next, 12), admin.id]);
  await audit(admin, "password", "Account", admin.id, "Changed own password");
  const fresh = await one("SELECT id, email, role, token_version FROM admins WHERE id = ?", [admin.id]);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await signToken(fresh), cookieOptions);
  return res;
});
