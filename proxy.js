import { NextResponse } from "next/server";
import { COOKIE, verifyToken } from "./lib/jwt";

/* Gatekeeper for the admin area.
   - /admin pages without a valid token go to the login screen.
   - /api/admin calls without a valid token get 401.
   Handlers re-check the token against the database (deactivated users,
   changed passwords) — this layer just keeps strangers out early. */
export async function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(COOKIE)?.value;
  const valid = token ? await verifyToken(token) : null;

  if (pathname.startsWith("/api/admin")) {
    if (!valid) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    return noindex(NextResponse.next());
  }

  if (pathname === "/admin/login") {
    if (valid) return NextResponse.redirect(new URL("/admin", request.url));
    return noindex(NextResponse.next());
  }

  if (!valid) {
    const url = new URL("/admin/login", request.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  return noindex(NextResponse.next());
}

function noindex(res) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
