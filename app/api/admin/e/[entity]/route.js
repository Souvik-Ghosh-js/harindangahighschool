import { NextResponse } from "next/server";
import { requireAdmin, handler, audit } from "@/lib/auth";
import { listEntity, createEntity, entityDef } from "@/lib/admin-crud";

export const GET = handler(async (request, { params }) => {
  await requireAdmin(request);
  const { entity } = await params;
  const u = new URL(request.url);
  return NextResponse.json({ items: await listEntity(entity, { q: u.searchParams.get("q") || "", status: u.searchParams.get("status") || "" }) });
});

export const POST = handler(async (request, { params }) => {
  const admin = await requireAdmin(request);
  const { entity } = await params;
  const body = await request.json().catch(() => ({}));
  const r = await createEntity(entity, body);
  await audit(admin, "create", entityDef(entity).singular, r.id, r.title);
  return NextResponse.json({ ok: true, ...r });
});
