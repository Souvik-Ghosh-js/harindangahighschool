import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "node:fs";
import path from "node:path";
import { readSession, COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/* Statically-scoped upload roots. These are module-level constants so
   the bundler can analyse them; building the paths inline inside the
   handler makes Next trace the whole project into the standalone
   output, which would bundle every file under public/. */
const DOC_DIR = path.join(process.cwd(), "public/assets/doc");
const IMG_DIR = path.join(process.cwd(), "public/assets/img");

/* Only these land on the server. Extension and MIME must agree, so a
   .php renamed to .jpg is rejected before it is ever written. */
const KINDS = {
  doc: {
    dir: DOC_DIR,
    max: 25 * 1024 * 1024,
    types: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
  },
  img: {
    dir: IMG_DIR,
    max: 10 * 1024 * 1024,
    types: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
  },
};

/* Strip directory parts and anything that is not a safe character, so
   a crafted name cannot escape the target folder. */
function safeName(original) {
  const base = path.basename(String(original)).toLowerCase();
  const ext = path.extname(base);
  const stem = base
    .slice(0, base.length - ext.length)
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80) || "file";
  return { stem, ext };
}

export async function POST(req) {
  const jar = await cookies();
  if (!(await readSession(jar.get(COOKIE)?.value))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  const kind = String(form.get("kind") || "");
  const cfg = KINDS[kind];

  if (!cfg) return NextResponse.json({ error: "Unknown upload type." }, { status: 400 });
  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > cfg.max) {
    return NextResponse.json(
      { error: `File is too large. Maximum is ${Math.round(cfg.max / 1024 / 1024)} MB.` },
      { status: 413 }
    );
  }

  const allowedExts = cfg.types[file.type];
  const { stem, ext } = safeName(file.name);

  if (!allowedExts || !allowedExts.includes(ext)) {
    return NextResponse.json(
      { error: `That file type is not allowed here. Accepted: ${Object.values(cfg.types).flat().join(", ")}` },
      { status: 415 }
    );
  }

  await fs.mkdir(cfg.dir, { recursive: true });

  // The bundler cannot statically resolve cfg.dir because it is chosen
  // at runtime, so it would otherwise trace the entire project into the
  // standalone output. Suppressing that is safe here: cfg.dir is one of
  // two module-level constants, and `name` has had every directory part
  // and unsafe character stripped by safeName(), so neither value can
  // point outside the two upload folders.
  const inDir = (fileName) =>
    path.join(/*turbopackIgnore: true*/ cfg.dir, fileName);

  // Never silently overwrite an existing file: suffix instead.
  let name = `${stem}${ext}`;
  let i = 1;
  while (true) {
    try {
      await fs.access(inDir(name));
      name = `${stem}-${i++}${ext}`;
    } catch {
      break;
    }
  }

  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(inDir(name), buf);

  return NextResponse.json({
    ok: true,
    name,
    url: `/assets/${kind}/${name}`,
    size: file.size,
  });
}
