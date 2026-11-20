import { NextResponse } from "next/server";
import { requireAdmin, handler, audit, HttpError } from "@/lib/auth";
import { saveMedia, sniff, MAX_UPLOAD } from "@/lib/media";

/* Upload one photo or document. Photos arrive already resized and
   compressed by the browser; the server still checks the real file type
   from its bytes and enforces the size limit. */
export const POST = handler(async (request) => {
  const admin = await requireAdmin(request);
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") throw new HttpError(400, "No file received.");
  if (file.size > MAX_UPLOAD) throw new HttpError(413, "This file is larger than 5 MB. Please compress it and try again.");
  const buf = Buffer.from(await file.arrayBuffer());
  const mime = sniff(buf);
  if (!mime) throw new HttpError(415, "Only photos (JPG, PNG, WebP) and PDF files can be uploaded.");
  const int = (v, max) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) && n > 0 && n <= max ? n : null;
  };
  const blur = String(form.get("blur") || "");
  const saved = await saveMedia(buf, {
    name: file.name,
    mime,
    width: mime.startsWith("image/") ? int(form.get("width"), 10000) : null,
    height: mime.startsWith("image/") ? int(form.get("height"), 10000) : null,
    alt: String(form.get("alt") || "").slice(0, 200),
    blur: /^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]{10,3000}$/.test(blur) ? blur : null,
  });
  await audit(admin, "upload", "File", saved.id, saved.name);
  return NextResponse.json({ ok: true, ...saved });
});
