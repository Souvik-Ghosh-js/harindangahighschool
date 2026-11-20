import Link from "next/link";
import { getBlock, withMedia } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { paragraphs } from "@/lib/format";
import { mediaUrl } from "@/lib/media-url";
import PageHero from "@/components/site/PageHero";
import Img from "@/components/Img";
import { Download } from "@/components/Icons";
import { facilityIcon, theme } from "@/components/site/facility";

export const revalidate = 3600;

export async function generateMetadata() {
  const b = await getBlock("about");
  return pageMeta({ title: b.title, description: b.intro, path: "/about", image: b.hero_image, seoTitle: b.seo_title, seoDescription: b.seo_description });
}

export default async function AboutPage() {
  const b = await getBlock("about");
  const media = await withMedia(b);
  const facilities = (b.facilities || []).filter((f) => f.title);
  const achievements = (b.achievements || []).filter((a) => a.title);
  return (
    <>
      <PageHero title={b.title} intro={b.intro} image={b.hero_image} media={media} crumbs={[{ name: b.title, path: "/about" }]} />

      <section className="section">
        <div className="wrap">
          <div className="grid-2 grid-2--wide" style={{ alignItems: "start" }}>
            <div>
              <span className="eyebrow">Our story</span>
              <h2 className="h2" data-reveal="lines" style={{ marginBottom: 40 }}>
                {b.story_title}
              </h2>
              <div className="prose" data-reveal>
                {paragraphs(b.story).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <aside style={{ display: "grid", gap: 40 }}>
              {b.story_image && (
                <div className="media ratio-45" data-clip data-parallax="6">
                  <Img id={b.story_image} media={media} sizes="(min-width:900px) 38vw, 100vw" />
                </div>
              )}
              {(b.glance || []).length > 0 && (
                <div data-reveal>
                  <h3 className="h4" style={{ marginBottom: 18 }}>
                    At a glance
                  </h3>
                  <ul className="facts">
                    {b.glance.map((g, i) => (
                      <li key={i}>
                        <span>{g.label}</span>
                        <b>{g.value}</b>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {(b.vision || b.mission) && (
        <section className="section section--ink">
          <div className="wrap">
            <div className="grid-2" style={{ alignItems: "start" }}>
              {b.vision && (
                <div>
                  <span className="eyebrow">Vision</span>
                  <p className="quote" data-reveal style={{ fontSize: "clamp(1.6rem,2.8vw,2.5rem)" }}>
                    {b.vision}
                  </p>
                </div>
              )}
              {b.mission && (
                <div>
                  <span className="eyebrow">Mission</span>
                  <p className="quote" data-reveal data-delay="0.1" style={{ fontSize: "clamp(1.6rem,2.8vw,2.5rem)" }}>
                    {b.mission}
                  </p>
                </div>
              )}
            </div>
            {(b.values || []).length > 0 && (
              <div className="rows" style={{ marginTop: 96 }} data-stagger>
                {b.values.map((v, i) => (
                  <div className="row" key={i}>
                    <span className="row__n">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{v.title}</h3>
                    <p style={{ color: "rgba(255,253,249,.7)" }}>{v.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {facilities.length > 0 && (
        <section className="section" id="facilities">
          <div className="wrap">
            <div className="sec-head sec-head--split">
              <div>
                <span className="eyebrow">Campus</span>
                <h2 className="h2" data-reveal="lines">
                  Campus & facilities
                </h2>
              </div>
              <p className="lead" data-reveal>
                What the school provides to support learning, culture, sport and student welfare.
              </p>
            </div>
            <div className="bento" data-stagger>
              {facilities.map((f, i) => {
                const Icon = facilityIcon(f.title);
                return (
                  <article className={`feature ${theme(i)}`} key={i}>
                    <span className="feature__icon">
                      <Icon />
                    </span>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="section section--paper2" id="achievements">
          <div className="wrap">
            <div className="sec-head sec-head--split">
              <div>
                <span className="eyebrow">Recognition</span>
                <h2 className="h2" data-reveal="lines">
                  Achievements
                </h2>
              </div>
              {b.achievements_file && (
                <div>
                  <a className="link" href={mediaUrl(b.achievements_file)} target="_blank" rel="noopener noreferrer">
                    Full record (PDF) <Download width={16} />
                  </a>
                </div>
              )}
            </div>
            <div className="rows">
              {achievements.map((a, i) => (
                <div className="row" key={i} data-reveal>
                  <span className="row__n">{a.year}</span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section--tight">
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <Link href="/leadership" className="btn">
            Head of Institution
          </Link>
          <Link href="/administration" className="btn btn--ghost-dark">
            Administrative body
          </Link>
        </div>
      </section>
    </>
  );
}
