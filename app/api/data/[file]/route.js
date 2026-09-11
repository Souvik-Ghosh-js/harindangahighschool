import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession, COOKIE } from "@/lib/auth";
import { readData, writeData, FILES } from "@/lib/data";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(Object.keys(FILES)); // notices | staff | gallery | popup

async function requireAuth() {
  const jar = await cookies();
  return await readSession(jar.get(COOKIE)?.value);
}

export async function GET(_req, { params }) {
  const { file } = await params;
  if (!ALLOWED.has(file)) {
    return NextResponse.json({ error: "Unknown data file." }, { status: 404 });
  }
  return NextResponse.json(await readData(FILES[file]));
}

export async function PUT(req, { params }) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { file } = await params;
  if (!ALLOWED.has(file)) {
    return NextResponse.json({ error: "Unknown data file." }, { status: 404 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const invalid = validate(file, body);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  // Bump the popup version so dismissed pop-ups reappear after an edit.
  if (file === "popup") {
    const current = await readData(FILES.popup);
    body.version = Number(current.version || 0) + 1;
    body.updated = new Date().toISOString().slice(0, 10);
  }

  await writeData(FILES[file], body);
  return NextResponse.json({ ok: true, saved: FILES[file] });
}

/* Reject structurally wrong payloads so a bad save can never take
   down a public page. Returns an error string, or null when valid. */
function validate(file, d) {
  if (!d || typeof d !== "object") return "Payload must be an object.";

  if (file === "notices") {
    if (!Array.isArray(d.notices)) return "notices must be an array.";
    for (const n of d.notices) {
      if (!n?.title || !n?.file || !n?.date) {
        return "Every notice needs a title, date and file.";
      }
    }
  }

  if (file === "staff") {
    for (const k of ["teaching", "office", "committee"]) {
      if (d[k] !== undefined && !Array.isArray(d[k])) return `${k} must be an array.`;
    }
    for (const t of d.teaching || []) {
      if (!t?.name) return "Every teacher needs a name.";
    }
  }

  if (file === "gallery") {
    if (!Array.isArray(d.albums)) return "albums must be an array.";
    for (const a of d.albums) {
      if (!a?.title) return "Every album needs a title.";
      if (!Array.isArray(a.photos)) return "Every album needs a photos array.";
    }
  }

  if (file === "popup") {
    if (typeof d.enabled !== "boolean") return "enabled must be true or false.";
  }

  return null;
}
