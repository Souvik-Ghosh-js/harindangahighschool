import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin, handler, audit, HttpError } from "@/lib/auth";
import { one, run } from "@/lib/db";

export const PUT = handler(async (request, { params }) => {
  const admin = await requireAdmin(request, { role: "super" });
  const id = Number((await params).id);
  const user = await one("SELECT id, email FROM admins WHERE id = ?", [id]);
  if (!user) throw new HttpError(404, "User not found.");
  const b = await request.json().catch(() => ({}));
  if (id === admin.id && (b.active === false || b.role === "editor")) throw new HttpError(400, "You cannot remove your own Super Admin access.");
  if (b.password) {
    if (String(b.password).length < 8) throw new HttpError(400, "Password must be at least 8 characters.");
    await run("UPDATE admins SET password_hash = ?, token_version = token_version + 1 WHERE id = ?", [await bcrypt.hash(String(b.password), 12), id]);
  }
  if (typeof b.active === "boolean") await run("UPDATE admins SET active = ?, token_version = token_version + 1 WHERE id = ?", [b.active ? 1 : 0, id]);
  if (b.role === "super" || b.role === "editor") await run("UPDATE admins SET role = ?, token_version = token_version + 1 WHERE id = ?", [b.role, id]);
  if (typeof b.name === "string") await run("UPDATE admins SET name = ? WHERE id = ?", [b.name.trim().slice(0, 80), id]);
  await audit(admin, "update", "Admin user", id, user.email);
  return NextResponse.json({ ok: true });
});
