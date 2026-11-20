import { getBlock, getSite, withMedia } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/site/PageHero";

export const revalidate = 3600;

export async function generateMetadata() {
  const b = await getBlock("contact");
  return pageMeta({ title: b.title, description: b.intro, path: "/contact", image: b.hero_image, seoTitle: b.seo_title, seoDescription: b.seo_description });
}

export default async function ContactPage() {
  const [b, { site }] = await Promise.all([getBlock("contact"), getSite()]);
  const media = await withMedia(b.hero_image);
  const q = encodeURIComponent(site.latitude && site.longitude ? `${site.latitude},${site.longitude}` : site.map_query || site.name);
  return (
    <>
      <PageHero title={b.title} intro={b.intro} plain crumbs={[{ name: b.title, path: "/contact" }]} />
      <section className="section">
        <div className="wrap contact-grid">
          <div data-stagger>
            {site.phone && (
              <div className="contact-item">
                <small>Phone</small>
                <a href={`tel:${site.phone}`}>{site.phone}</a>
                {site.phone_note && <div className="muted" style={{ marginTop: 8 }}>{site.phone_note}</div>}
              </div>
            )}
            {site.email && (
              <div className="contact-item">
                <small>Email</small>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            )}
            {site.address && (
              <div className="contact-item">
                <small>Address</small>
                <p>{site.address}</p>
              </div>
            )}
            {site.office_hours && (
              <div className="contact-item">
                <small>Office hours</small>
                <p>{site.office_hours}</p>
              </div>
            )}
          </div>
          <div data-reveal>
            <iframe className="map" title={`Map showing ${site.name}`} src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <a className="link" style={{ marginTop: 20 }} href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer">
              Get directions ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
