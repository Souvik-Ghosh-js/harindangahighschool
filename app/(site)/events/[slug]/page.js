import { notFound, permanentRedirect } from "next/navigation";
import { getEvent, findRedirect, withMedia, getSite } from "@/lib/content";
import { pageMeta, siteUrl } from "@/lib/seo";
import { dateRange, paragraphs, truncate } from "@/lib/format";
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
  const e = await getEvent(slug);
  if (!e) return {};
  return pageMeta({ title: e.title, description: e.summary || `${e.title} — ${dateRange(e.date, e.end_date)}${e.venue ? `, ${e.venue}` : ""}.`, path: `/events/${slug}`, image: e.cover_id, seoTitle: e.seo_title, seoDescription: e.seo_description, type: "article" });
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) {
    const to = await findRedirect(`/events/${slug}`);
    if (to) permanentRedirect(to);
    notFound();
  }
  const [{ site }, media] = await Promise.all([getSite(), withMedia(e.cover_id, e.photos.map((p) => p.media_id))]);
  return (
    <>
      <PageHero eyebrow={dateRange(e.date, e.end_date) + (e.venue ? ` · ${e.venue}` : "")} title={e.title} intro={e.summary} image={e.cover_id} media={media} crumbs={[{ name: "Events", path: "/events" }, { name: truncate(e.title, 40), path: `/events/${slug}` }]} />
      {(paragraphs(e.body).length > 0 || e.time) && (
        <section className="section">
          <div className="wrap article">
            <div className="prose">
              {paragraphs(e.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <aside>
              <ul className="facts">
                <li>
                  <span>Date</span>
                  <b>{dateRange(e.date, e.end_date)}</b>
                </li>
                {e.time && (
                  <li>
                    <span>Time</span>
                    <b>{e.time}</b>
                  </li>
                )}
                {e.venue && (
                  <li>
                    <span>Venue</span>
                    <b>{e.venue}</b>
                  </li>
                )}
              </ul>
            </aside>
          </div>
        </section>
      )}
      {e.photos.length > 0 && (
        <section className="section section--paper2">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Photographs</span>
              <h2 className="h2" data-reveal="lines">
                Moments from the day
              </h2>
            </div>
            <PhotoGrid photos={e.photos} media={media} title={e.title} />
          </div>
        </section>
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: e.title,
          startDate: e.date,
          endDate: e.end_date || e.date,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          description: e.summary || undefined,
          image: e.cover_id ? [siteUrl(mediaUrl(e.cover_id))] : undefined,
          location: { "@type": "Place", name: e.venue || site.name, address: String(site.address || "").replace(/\n/g, ", ") },
          organizer: { "@type": "Organization", name: site.name, url: siteUrl("/") },
        }}
      />
    </>
  );
}
