import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getTeacher, findRedirect, withMedia } from "@/lib/content";
import { pageMeta, siteUrl } from "@/lib/seo";
import { paragraphs } from "@/lib/format";
import { mediaUrl } from "@/lib/media-url";
import PageHero from "@/components/site/PageHero";
import TeacherFace from "@/components/site/TeacherFace";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = await getTeacher(slug);
  if (!t) return {};
  return pageMeta({ title: `${t.name} — ${t.designation || "Teacher"}`, description: `${t.name}, ${t.designation}${t.departments[0] ? `, ${t.departments[0].name}` : ""}. ${t.qualification}`, path: `/teachers/${slug}`, image: t.photo_id, type: "profile" });
}

export default async function TeacherPage({ params }) {
  const { slug } = await params;
  const t = await getTeacher(slug);
  if (!t) {
    const to = await findRedirect(`/teachers/${slug}`);
    if (to) permanentRedirect(to);
    notFound();
  }
  const media = await withMedia(t.photo_id);
  return (
    <>
      <PageHero eyebrow={t.departments.map((d) => d.name).join(" · ") || "Faculty"} title={t.name} intro={t.designation} plain crumbs={[{ name: "Teachers", path: "/teachers" }, { name: t.name, path: `/teachers/${slug}` }]} />
      <section className="section">
        <div className="wrap lead-sec" style={{ alignItems: "start" }}>
          <TeacherFace t={t} media={media} className="ratio-45" sizes="(min-width:960px) 34vw, 100vw" />
          <div>
            <ul className="facts" data-reveal>
              <li>
                <span>Designation</span>
                <b>{t.designation}</b>
              </li>
              {t.departments.length > 0 && (
                <li>
                  <span>Department</span>
                  <b>{t.departments.map((d) => d.name).join(", ")}</b>
                </li>
              )}
              {t.qualification && (
                <li>
                  <span>Qualifications</span>
                  <b>{t.qualification}</b>
                </li>
              )}
              {t.subjects && (
                <li>
                  <span>Subject</span>
                  <b>{t.subjects}</b>
                </li>
              )}
              {t.experience && (
                <li>
                  <span>Experience</span>
                  <b>{t.experience}</b>
                </li>
              )}
            </ul>
            {t.bio && (
              <div className="prose" style={{ marginTop: 40 }} data-reveal>
                {paragraphs(t.bio).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            <Link href="/teachers" className="btn" style={{ marginTop: 48 }}>
              All teachers
            </Link>
          </div>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: t.name,
          jobTitle: t.designation,
          image: t.photo_id ? siteUrl(mediaUrl(t.photo_id)) : undefined,
          worksFor: { "@id": siteUrl("/#school") },
          url: siteUrl(`/teachers/${slug}`),
        }}
      />
    </>
  );
}
