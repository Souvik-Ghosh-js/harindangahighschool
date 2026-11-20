import Link from "next/link";
import { getBlock, getSite, withMedia } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { paragraphs } from "@/lib/format";
import { mediaUrl } from "@/lib/media-url";
import PageHero from "@/components/site/PageHero";
import { Download, Arrow } from "@/components/Icons";

export const revalidate = 3600;

export async function generateMetadata() {
  const b = await getBlock("admission");
  return pageMeta({ title: b.title, description: b.intro, path: "/admission", image: b.hero_image, seoTitle: b.seo_title, seoDescription: b.seo_description });
}

export default async function AdmissionPage() {
  const [b, { site }] = await Promise.all([getBlock("admission"), getSite()]);
  const media = await withMedia(b.hero_image);
  const forms = (b.forms || []).filter((f) => f.title);
  return (
    <>
      <PageHero title={b.title} intro={b.intro} image={b.hero_image} media={media} crumbs={[{ name: b.title, path: "/admission" }]} />
      <section className="section--tight section--white">
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
          <span className={`status-pill${b.open ? "" : " status-pill--closed"}`} style={{ background: "var(--ink)", color: "var(--white)" }}>
            <i /> {b.open ? "Admissions open" : "Admissions currently closed"}
          </span>
          {b.status_text && <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.45rem", color: "var(--ink)" }}>{b.status_text}</p>}
        </div>
      </section>
      {forms.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Application forms</span>
              <h2 className="h2" data-reveal="lines">
                Download your form
              </h2>
            </div>
            <div className="cards-2">
              {forms.map((f, i) => (
                <article key={i} className="card" data-reveal data-delay={i * 0.08} style={{ padding: "36px 0", borderTop: "1px solid var(--line-strong)" }}>
                  <div className="card__meta">
                    <b>Admission</b>
                  </div>
                  <h3 className="h2" style={{ marginBottom: 16 }}>
                    {f.title}
                  </h3>
                  {f.text && <p style={{ marginBottom: 28 }}>{f.text}</p>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {f.form_file && (
                      <a className="btn" href={mediaUrl(f.form_file)} target="_blank" rel="noopener noreferrer">
                        Form <Download className="arr" />
                      </a>
                    )}
                    {f.notice_file && (
                      <a className="btn btn--ghost-dark" href={mediaUrl(f.notice_file)} target="_blank" rel="noopener noreferrer">
                        Notice
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section section--paper2">
        <div className="wrap">
          <div className="grid-2" style={{ alignItems: "start" }}>
            <div>
              <span className="eyebrow">How to apply</span>
              <h2 className="h2" data-reveal="lines" style={{ marginBottom: 40 }}>
                The admission process
              </h2>
              <ol className="steps" data-stagger>
                {(b.steps || []).map((s, i) => (
                  <li key={i}>
                    <div>
                      <b>{s.title}</b>
                      <p>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div style={{ display: "grid", gap: 48 }}>
              {b.eligibility && (
                <div data-reveal>
                  <h3 className="h3" style={{ marginBottom: 18 }}>
                    Eligibility
                  </h3>
                  {String(b.eligibility)
                    .split("\n")
                    .filter(Boolean)
                    .map((l, i) => (
                      <p key={i} className="muted">
                        {l}
                      </p>
                    ))}
                </div>
              )}
              <div data-reveal style={{ background: "var(--ink)", color: "rgba(255,253,249,.78)", padding: "clamp(28px,4vw,48px)" }}>
                <h3 className="h3" style={{ color: "var(--white)", marginBottom: 14 }}>
                  Need help?
                </h3>
                {paragraphs(b.help_text).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {site.phone && (
                  <a href={`tel:${site.phone}`} className="btn btn--light" style={{ marginTop: 8 }}>
                    Call {site.phone}
                  </a>
                )}
              </div>
              <Link href="/notices?category=Admission" className="link">
                All admission notices <Arrow width={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
