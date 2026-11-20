import Link from "next/link";
import { getBlock, getAlbums, withMedia } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { longDate } from "@/lib/format";
import PageHero from "@/components/site/PageHero";
import Img from "@/components/Img";

export const revalidate = 3600;

export async function generateMetadata() {
  const b = await getBlock("gallery_page");
  return pageMeta({ title: b.title, description: b.intro, path: "/gallery", image: b.hero_image, seoTitle: b.seo_title, seoDescription: b.seo_description });
}

export default async function GalleryPage() {
  const [b, albums] = await Promise.all([getBlock("gallery_page"), getAlbums()]);
  const media = await withMedia(b.hero_image, albums.map((a) => a.cover_id));
  return (
    <>
      <PageHero title={b.title} intro={b.intro} plain crumbs={[{ name: b.title, path: "/gallery" }]} />
      <section className="section">
        <div className="wrap">
          {albums.length ? (
            <div className="cards-3">
              {albums.map((a, i) => (
                <article className="card" key={a.id}>
                  <div className="media ratio-43 zoom" data-clip>
                    {a.cover_id && <Img id={a.cover_id} media={media} sizes="(min-width:1080px) 33vw, (min-width:700px) 50vw, 100vw" alt={a.title} />}
                  </div>
                  <div className="card__meta">
                    <b>{a.photo_count} photos</b>
                    {a.date && <span>{longDate(a.date)}</span>}
                  </div>
                  <h3>
                    <Link href={`/gallery/${a.slug}`} className="cover">
                      {a.title}
                    </Link>
                  </h3>
                  {a.description && <p>{a.description}</p>}
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">Albums will appear here as they are published.</p>
          )}
        </div>
      </section>
    </>
  );
}
