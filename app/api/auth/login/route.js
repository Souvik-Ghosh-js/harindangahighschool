import { NextResponse } from "next/server";
import {
  readAdmin,
  verifyPassword,
  createSession,
  cookieOptions,
  COOKIE,
  throttle,
  clearThrottle,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

function clientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : req.headers.get("x-real-ip")) || "unknown";
}

export async function POST(req) {
  const ip = clientIp(req);

  const gate = throttle(ip);
  if (gate.blocked) {
    return NextResponse.json(
      { error: "Too many failed attempts. Please wait 15 minutes and try again." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { username, password } = body || {};
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const admin = await readAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "No admin account exists yet. Run: npm run set-password" },
      { status: 500 }
    );
  }

  const ok =
    String(username) === admin.username && verifyPassword(String(password), admin.hash);

  if (!ok) {
    // Deliberately vague: never reveal which half was wrong.
    return NextResponse.json(
      { error: "Incorrect username or password." },
      { status: 401 }
    );
  }

  clearThrottle(ip);

  const token = await createSession(admin.username);
  const res = NextResponse.json({ ok: true, username: admin.username });
  res.cookies.set(COOKIE, token, cookieOptions);
  return res;
}
