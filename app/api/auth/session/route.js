import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession, readAdmin, COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/* Tells the admin UI whether it is signed in, and whether an admin
   account has been created at all (so first-run can be explained). */
export async function GET() {
  const jar = await cookies();
  const session = await readSession(jar.get(COOKIE)?.value);
  const admin = await readAdmin();

  return NextResponse.json({
    signedIn: !!session,
    username: session?.u || null,
    configured: !!admin,
  });
}
