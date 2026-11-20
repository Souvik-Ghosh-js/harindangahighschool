import Link from "next/link";
import { getBlock, withMedia } from "@/lib/content";
import { pageMeta, siteUrl } from "@/lib/seo";
import { paragraphs, initials } from "@/lib/format";
import { mediaUrl } from "@/lib/media-url";
import PageHero from "@/components/site/PageHero";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateMetadata() {
  const b = await getBlock("leadership");
  return pageMeta({
    title: `${b.name} — Head of Institution`,
    description: b.quote || `${b.name}, ${b.designation}, Harindanga High School (H.S.).`,
    path: "/leadership",
    image: b.portrait,
    seoTitle: b.seo_title,
    seoDescription: b.seo_description,
    type: "profile",
  });
}

export default async function LeadershipPage() {
  const b = await getBlock("leadership");
  const media = await withMedia(b.portrait);
  const message = paragraphs(b.message);
  return (
    <>
      <PageHero eyebrow="Head of Institution" title={b.name} intro={b.designation} plain crumbs={[{ name: "Leadership", path: "/leadership" }]} />
      <section className="section">
        <div className="wrap">
          <div className="lead-sec" style={{ alignItems: "start" }}>
            <figure className="lead-portrait" style={{ margin: 0, position: "sticky", top: 100 }}>
              <div className="media" data-clip>
                {b.portrait ? <Img id={b.portrait} media={media} priority sizes="(min-width:960px) 34vw, 100vw" alt={b.name} /> : <div className="photo-placeholder">{initials(b.name)}</div>}
              </div>
              <figcaption>
                <span>{b.name}</span>
                <span>{b.designation}</span>
              </figcaption>
            </figure>
            <div>
              {b.quote && (
                <blockquote className="quote" data-words>
                  <span className="quote__mark" aria-hidden="true">
                    “
                  </span>
                  {b.quote}
                </blockquote>
              )}
              {message.length > 0 ? (
                <div className="prose" data-reveal>
                  {message.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="lead" data-reveal>
                  A message from the Head of Institution will be published here shortly.
                </p>
              )}
              <div className="signature" style={{ marginTop: 48 }} data-reveal>
                <div>
                  <b>{b.name}</b>
                  <span>{b.designation}</span>
                </div>
              </div>
              {(b.qualifications || b.bio) && (
                <div style={{ marginTop: 72 }} data-reveal>
                  <h2 className="h4" style={{ marginBottom: 18 }}>
                    Profile
                  </h2>
                  <ul className="facts">
                    {b.qualifications && (
                      <li>
                        <span>Qualifications</span>
                        <b>{b.qualifications}</b>
                      </li>
                    )}
                    <li>
                      <span>Designation</span>
                      <b>{b.designation}</b>
                    </li>
                  </ul>
                  {b.bio && (
                    <div className="prose prose--plain" style={{ marginTop: 28 }}>
                      {paragraphs(b.bio).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <Link href="/teachers" className="btn" style={{ marginTop: 56 }}>
                Meet our teachers
              </Link>
            </div>
          </div>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: b.name,
          jobTitle: b.designation,
          image: b.portrait ? siteUrl(mediaUrl(b.portrait)) : undefined,
          worksFor: { "@id": siteUrl("/#school") },
          url: siteUrl("/leadership"),
        }}
      />
    </>
  );
}
