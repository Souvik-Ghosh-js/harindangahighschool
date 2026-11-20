import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getNotice, getLatestNotices, findRedirect, withMedia } from "@/lib/content";
import { pageMeta, siteUrl } from "@/lib/seo";
import { longDate, paragraphs, fileSize, fileKind, truncate } from "@/lib/format";
import { mediaUrl } from "@/lib/media-url";
import PageHero from "@/components/site/PageHero";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import { Download, Arrow } from "@/components/Icons";

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const n = await getNotice(slug);
  if (!n) return {};
  return pageMeta({
    title: n.title,
    description: n.summary || `${n.category} notice dated ${longDate(n.date)} from Harindanga High School (H.S.).`,
    path: `/notices/${slug}`,
    image: n.file_mime?.startsWith("image/") ? n.file_id : undefined,
    seoTitle: n.seo_title,
    seoDescription: n.seo_description,
    type: "article",
  });
}

export default async function NoticePage({ params }) {
  const { slug } = await params;
  const n = await getNotice(slug);
  if (!n) {
    const to = await findRedirect(`/notices/${slug}`);
    if (to) permanentRedirect(to);
    notFound();
  }
  const more = (await getLatestNotices(6)).filter((x) => x.id !== n.id).slice(0, 4);
  const isImage = n.file_mime?.startsWith("image/");
  const media = isImage ? await withMedia(n.file_id) : {};
  const fileHref = n.file_id ? mediaUrl(n.file_id, n.file_name) : null;
  return (
    <>
      <PageHero eyebrow={`${n.category} · ${longDate(n.date)}`} title={n.title} plain crumbs={[{ name: "Notices", path: "/notices" }, { name: truncate(n.title, 40), path: `/notices/${slug}` }]} />
      <section className="section">
        <div className="wrap article">
          <div>
            {n.summary && <p className="lead">{n.summary}</p>}
            {paragraphs(n.body).length > 0 && (
              <div className="prose prose--plain" style={{ marginBottom: 40 }}>
                {paragraphs(n.body).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {fileHref && isImage && (
              <div className="doc-image">
                <Img id={n.file_id} media={media} fill={false} sizes="(min-width:960px) 60vw, 100vw" alt={n.title} quality={82} />
              </div>
            )}
            {fileHref && !isImage && <iframe className="doc-frame" src={`${fileHref}#view=FitH`} title={n.title} loading="lazy" />}
          </div>
          <aside>
            <ul className="facts" style={{ marginBottom: 28 }}>
              <li>
                <span>Date</span>
                <b>{longDate(n.date)}</b>
              </li>
              <li>
                <span>Category</span>
                <b>{n.category}</b>
              </li>
              {n.file_id && (
                <li>
                  <span>Attachment</span>
                  <b>
                    {fileKind(n.file_mime)} · {fileSize(n.file_size)}
                  </b>
                </li>
              )}
            </ul>
            {fileHref && (
              <a className="btn btn--block" href={fileHref} target="_blank" rel="noopener noreferrer" download>
                Download <Download className="arr" />
              </a>
            )}
            {more.length > 0 && (
              <div style={{ marginTop: 56 }}>
                <h2 className="h4" style={{ marginBottom: 12 }}>
                  Recent notices
                </h2>
                <ul className="dl-list">
                  {more.map((m) => (
                    <li key={m.id}>
                      <Link href={`/notices/${m.slug}`}>
                        <span>
                          <b>{m.title}</b>
                          <small>{longDate(m.date)}</small>
                        </span>
                        <Arrow width={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: n.title,
          datePublished: n.date,
          dateModified: n.updated_at?.slice(0, 10) || n.date,
          articleSection: n.category,
          author: { "@id": siteUrl("/#school") },
          publisher: { "@id": siteUrl("/#school") },
          mainEntityOfPage: siteUrl(`/notices/${slug}`),
        }}
      />
    </>
  );
}
