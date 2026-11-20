import { NextResponse } from "next/server";
import { requireAdmin, handler, audit } from "@/lib/auth";
import { readBlock, writeBlock } from "@/lib/admin-crud";
import { BLOCKS } from "@/lib/blocks";

const SUPER_ONLY = new Set(["navigation", "seo", "policies"]);

export const GET = handler(async (request, { params }) => {
  await requireAdmin(request);
  const { key } = await params;
  return NextResponse.json(await readBlock(key));
});

export const PUT = handler(async (request, { params }) => {
  const { key } = await params;
  const admin = await requireAdmin(request, { role: SUPER_ONLY.has(key) ? "super" : undefined });
  const body = await request.json().catch(() => ({}));
  const data = await writeBlock(key, body.data, admin);
  await audit(admin, "update", "page", key, BLOCKS[key]?.label);
  return NextResponse.json({ ok: true, data });
});
