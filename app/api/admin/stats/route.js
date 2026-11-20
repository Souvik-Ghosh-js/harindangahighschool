import { NextResponse } from "next/server";
import { requireAdmin, handler } from "@/lib/auth";
import { all, one } from "@/lib/db";

export const GET = handler(async (request) => {
  await requireAdmin(request);
  const c = await one(`SELECT
    (SELECT COUNT(*) FROM notices WHERE status='published') AS notices,
    (SELECT COUNT(*) FROM events WHERE status='published' AND COALESCE(end_date, date) >= date('now')) AS upcoming,
    (SELECT COUNT(*) FROM events WHERE status='published') AS events,
    (SELECT COUNT(*) FROM teachers WHERE status='published' AND kind='teaching') AS teachers,
    (SELECT COUNT(*) FROM albums WHERE status='published') AS albums,
    (SELECT COUNT(*) FROM downloads WHERE status='published') AS downloads,
    (SELECT COUNT(*) FROM notices WHERE status='draft') + (SELECT COUNT(*) FROM events WHERE status='draft') AS drafts`);
  const recent = await all("SELECT admin, action, entity, summary, at FROM audit_log WHERE action != 'login' ORDER BY id DESC LIMIT 8");
  return NextResponse.json({ counts: c, recent });
});
