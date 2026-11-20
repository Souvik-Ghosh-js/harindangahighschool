import { all } from "@/lib/db";
import { siteUrl } from "@/lib/seo";
import { mediaUrl } from "@/lib/media-url";

export const revalidate = 3600;

/* Lists every public page, plus the photos on each, so Google indexes
   notices, events, teachers and albums as soon as they are published. */
export default async function sitemap() {
  const now = new Date();
  const fixed = ["", "/about", "/leadership", "/teachers", "/academics", "/admission", "/notices", "/events", "/gallery", "/contact", "/administration"].map((p, i) => ({
    url: siteUrl(p || "/"),
    lastModified: now,
    changeFrequency: p === "/notices" || p === "" ? "daily" : "monthly",
    priority: i === 0 ? 1 : 0.8,
  }));
  const [notices, events, teachers, albums] = await Promise.all([
    all("SELECT slug, updated_at FROM notices WHERE status='published' ORDER BY date DESC LIMIT 2000"),
    all("SELECT slug, updated_at, cover_id FROM events WHERE status='published'"),
    all("SELECT slug, updated_at, photo_id FROM teachers WHERE status='published' AND kind='teaching'"),
    all("SELECT a.slug, a.updated_at, (SELECT group_concat(media_id) FROM (SELECT media_id FROM album_photos p WHERE p.album_id=a.id LIMIT 50)) AS photos FROM albums a WHERE status='published'"),
  ]);
  const d = (s) => (s ? new Date(s.replace(" ", "T") + "Z") : now);
  return [
    ...fixed,
    ...notices.map((n) => ({ url: siteUrl(`/notices/${n.slug}`), lastModified: d(n.updated_at), changeFrequency: "yearly", priority: 0.6 })),
    ...events.map((e) => ({ url: siteUrl(`/events/${e.slug}`), lastModified: d(e.updated_at), priority: 0.7, images: e.cover_id ? [siteUrl(mediaUrl(e.cover_id))] : undefined })),
    ...teachers.map((t) => ({ url: siteUrl(`/teachers/${t.slug}`), lastModified: d(t.updated_at), priority: 0.5, images: t.photo_id ? [siteUrl(mediaUrl(t.photo_id))] : undefined })),
    ...albums.map((a) => ({ url: siteUrl(`/gallery/${a.slug}`), lastModified: d(a.updated_at), priority: 0.6, images: a.photos ? a.photos.split(",").map((id) => siteUrl(mediaUrl(id))) : undefined })),
  ];
}
