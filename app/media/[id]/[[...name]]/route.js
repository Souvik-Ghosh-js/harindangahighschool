import { readMedia } from "@/lib/media";

/* Streams an uploaded photo or document from the database.
   Content never changes for an id, so browsers and the CDN may cache it
   for a year — after the first visit, files load instantly. */
export async function GET(_req, { params }) {
  const { id } = await params;
  if (!/^[a-z0-9]{10,40}$/.test(id)) return new Response("Not found", { status: 404 });
  const file = await readMedia(id);
  if (!file) return new Response("Not found", { status: 404 });
  const disposition = file.mime === "application/pdf" ? "inline" : "inline";
  return new Response(file.body, {
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.body.length),
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
