import { NextResponse } from "next/server";

/* The admin page itself renders its own login form, so this only
   hardens caching and indexing. Real authorisation happens in the
   API routes, which is the only place it can be enforced. */
export function middleware(request) {
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
