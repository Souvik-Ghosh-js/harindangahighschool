import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/jwt";
import { cookieOptions } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
