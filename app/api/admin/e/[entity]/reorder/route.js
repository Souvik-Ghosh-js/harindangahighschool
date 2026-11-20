import { NextResponse } from "next/server";
import { requireAdmin, handler, audit } from "@/lib/auth";
import { reorderEntity, entityDef } from "@/lib/admin-crud";

export const POST = handler(async (request, { params }) => {
  const admin = await requireAdmin(request);
  const { entity } = await params;
  const body = await request.json().catch(() => ({}));
  await reorderEntity(entity, body.ids);
  await audit(admin, "reorder", entityDef(entity).label);
  return NextResponse.json({ ok: true });
});
