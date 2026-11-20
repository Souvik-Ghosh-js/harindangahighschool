import Link from "next/link";
import { getBlock, getDownloads, withMedia } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { paragraphs, fileSize, fileKind } from "@/lib/format";
import { mediaUrl } from "@/lib/media-url";
import PageHero from "@/components/site/PageHero";
import { Download, Arrow } from "@/components/Icons";

export const revalidate = 3600;

export async function generateMetadata() {
  const b = await getBlock("academics");
  return pageMeta({ title: b.title, description: b.intro, path: "/academics", image: b.hero_image, seoTitle: b.seo_title, seoDescription: b.seo_description });
}

export default async function AcademicsPage() {
  const [b, downloads] = await Promise.all([getBlock("academics"), getDownloads()]);
  const media = await withMedia(b.hero_image);
  const groups = downloads.reduce((acc, d) => ((acc[d.category] ||= []).push(d), acc), {});
  return (
    <>
      <PageHero title={b.title} intro={b.intro} image={b.hero_image} media={media} crumbs={[{ name: b.title, path: "/academics" }]} />
      {(b.stages || []).length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Structure</span>
              <h2 className="h2" data-reveal="lines">
                Stages of learning
              </h2>
            </div>
            <div className="rows">
              {b.stages.map((s, i) => (
                <div className="row" key={i} data-reveal>
                  <span className="row__n">{s.label}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {b.record_title && (
        <section className="section section--ink">
          <div className="wrap wrap--narrow">
            <span className="eyebrow">Academic record</span>
            <h2 className="h2" data-reveal="lines" style={{ marginBottom: 32 }}>
              {b.record_title}
            </h2>
            {paragraphs(b.record_text).map((p, i) => (
              <p className="lead" key={i} data-reveal>
                {p}
              </p>
            ))}
            <Link href="/notices?category=Result" className="btn btn--light" style={{ marginTop: 24 }}>
              View results <Arrow className="arr" />
            </Link>
          </div>
        </section>
      )}
      <section className="section" id="downloads">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <span className="eyebrow">Downloads</span>
              <h2 className="h2" data-reveal="lines">
                Syllabus, routines & documents
              </h2>
            </div>
            <p className="lead" data-reveal>
              Official documents published by the school. Files open in a new tab.
            </p>
          </div>
          {Object.keys(groups).length === 0 && <p className="empty">No documents have been published yet.</p>}
          {Object.entries(groups).map(([cat, list]) => (
            <div className="dl-group" key={cat} data-reveal>
              <h3 className="h4">{cat}</h3>
              <ul className="dl-list">
                {list.map((d) => (
                  <li key={d.id}>
                    <a href={mediaUrl(d.file_id, d.file_name)} target="_blank" rel="noopener noreferrer">
                      <span>
                        <b>{d.title}</b>
                        <small>
                          {fileKind(d.file_mime)} · {fileSize(d.file_size)}
                        </small>
                      </span>
                      <span className="dl-icon" aria-hidden="true">
                        <Download />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
