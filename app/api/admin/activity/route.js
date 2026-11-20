import { NextResponse } from "next/server";
import { requireAdmin, handler } from "@/lib/auth";
import { all } from "@/lib/db";

export const GET = handler(async (request) => {
  await requireAdmin(request, { role: "super" });
  const items = await all("SELECT id, admin, action, entity, entity_id, summary, at FROM audit_log ORDER BY id DESC LIMIT 300");
  return NextResponse.json({ items });
});
