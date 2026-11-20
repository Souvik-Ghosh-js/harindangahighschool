import { NextResponse } from "next/server";
import { requireAdmin, handler } from "@/lib/auth";

export const GET = handler(async (request) => {
  const a = await requireAdmin(request);
  return NextResponse.json({ id: a.id, email: a.email, name: a.name, role: a.role });
});
