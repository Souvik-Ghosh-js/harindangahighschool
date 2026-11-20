import { notFound, permanentRedirect } from "next/navigation";
import { getAlbum, findRedirect, withMedia } from "@/lib/content";
import { pageMeta, siteUrl } from "@/lib/seo";
import { longDate, truncate } from "@/lib/format";
import { mediaUrl } from "@/lib/media-url";
import PageHero from "@/components/site/PageHero";
import PhotoGrid from "@/components/site/PhotoGrid";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await getAlbum(slug);
  if (!a) return {};
  return pageMeta({ title: `${a.title} — Gallery`, description: a.description || `${a.photos.length} photographs: ${a.title}, Harindanga High School (H.S.).`, path: `/gallery/${slug}`, image: a.cover_id || a.photos[0]?.media_id });
}

export default async function AlbumPage({ params }) {
  const { slug } = await params;
  const a = await getAlbum(slug);
  if (!a) {
    const to = await findRedirect(`/gallery/${slug}`);
    if (to) permanentRedirect(to);
    notFound();
  }
  const media = await withMedia(a.photos.map((p) => p.media_id));
  return (
    <>
      <PageHero eyebrow={[`${a.photos.length} photos`, a.date && longDate(a.date)].filter(Boolean).join(" · ")} title={a.title} intro={a.description} plain crumbs={[{ name: "Gallery", path: "/gallery" }, { name: truncate(a.title, 40), path: `/gallery/${slug}` }]} />
      <section className="section">
        <div className="wrap">
          <PhotoGrid photos={a.photos} media={media} title={a.title} />
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: a.title,
          url: siteUrl(`/gallery/${slug}`),
          image: a.photos.slice(0, 30).map((p) => ({ "@type": "ImageObject", contentUrl: siteUrl(mediaUrl(p.media_id)), caption: p.caption || undefined })),
        }}
      />
    </>
  );
}
