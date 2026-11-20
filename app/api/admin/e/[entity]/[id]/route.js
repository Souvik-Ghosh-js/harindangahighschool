import { NextResponse } from "next/server";
import { requireAdmin, handler, audit, HttpError } from "@/lib/auth";
import { getEntity, updateEntity, removeEntity, entityDef } from "@/lib/admin-crud";

const idOf = async (params) => {
  const { entity, id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) throw new HttpError(404, "Not found.");
  return { entity, id: n };
};

export const GET = handler(async (request, { params }) => {
  await requireAdmin(request);
  const { entity, id } = await idOf(params);
  return NextResponse.json({ item: await getEntity(entity, id) });
});

export const PUT = handler(async (request, { params }) => {
  const admin = await requireAdmin(request);
  const { entity, id } = await idOf(params);
  const body = await request.json().catch(() => ({}));
  const r = await updateEntity(entity, id, body);
  await audit(admin, "update", entityDef(entity).singular, id, r.title);
  return NextResponse.json({ ok: true, ...r });
});

export const DELETE = handler(async (request, { params }) => {
  const { entity, id } = await idOf(params);
  const hard = new URL(request.url).searchParams.get("permanent") === "1";
  const admin = await requireAdmin(request, { role: hard ? "super" : undefined });
  const r = await removeEntity(entity, id, { hard });
  await audit(admin, hard ? "delete" : "archive", entityDef(entity).singular, id, r.title);
  return NextResponse.json({ ok: true });
});
