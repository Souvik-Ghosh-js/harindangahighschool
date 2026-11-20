import { getBlock, getTeacherTree, withMedia } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { paragraphs } from "@/lib/format";
import PageHero from "@/components/site/PageHero";
import TeacherFace from "@/components/site/TeacherFace";

export const revalidate = 3600;

export async function generateMetadata() {
  const b = await getBlock("administration");
  return pageMeta({ title: b.title, description: b.intro, path: "/administration", image: b.hero_image, seoTitle: b.seo_title, seoDescription: b.seo_description });
}

export default async function AdministrationPage() {
  const [b, tree] = await Promise.all([getBlock("administration"), getTeacherTree()]);
  const media = await withMedia(b.hero_image, tree.office.map((t) => t.photo_id));
  const committee = (b.committee || []).filter((m) => m.name);
  return (
    <>
      <PageHero title={b.title} intro={b.intro} image={b.hero_image} media={media} crumbs={[{ name: b.title, path: "/administration" }]} />
      <section className="section">
        <div className="wrap">
          <div className="grid-2" style={{ alignItems: "start" }}>
            <div>
              <span className="eyebrow">Managing committee</span>
              <h2 className="h2" data-reveal="lines" style={{ marginBottom: 32 }}>
                Members of the committee
              </h2>
              <div className="prose prose--plain" data-reveal>
                {paragraphs(b.governance).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <ul className="facts" data-stagger>
              {committee.map((m, i) => (
                <li key={i} style={{ padding: "20px 0" }}>
                  <b style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", textAlign: "left" }}>{m.name}</b>
                  <span style={{ textAlign: "right" }}>{m.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {tree.office.length > 0 && (
        <section className="section section--paper2" id="office">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Office</span>
              <h2 className="h2" data-reveal="lines">
                Non-teaching staff
              </h2>
            </div>
            <div className="faculty" data-stagger>
              {tree.office.map((t) => (
                <div key={t.id} className="tcard">
                  <TeacherFace t={t} media={media} />
                  <div className="tcard__name">{t.name}</div>
                  <div className="tcard__role">{t.designation}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
