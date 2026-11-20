import { getBlock, getEvents, splitEvents, withMedia } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/site/PageHero";
import EventCard from "@/components/site/EventCard";

export const revalidate = 3600;

export async function generateMetadata() {
  const b = await getBlock("events_page");
  return pageMeta({ title: b.title, description: b.intro, path: "/events", image: b.hero_image, seoTitle: b.seo_title, seoDescription: b.seo_description });
}

export default async function EventsPage() {
  const [b, events] = await Promise.all([getBlock("events_page"), getEvents()]);
  const { upcoming, past } = splitEvents(events);
  const media = await withMedia(b.hero_image, events.map((e) => e.cover_id));
  return (
    <>
      <PageHero title={b.title} intro={b.intro} plain crumbs={[{ name: b.title, path: "/events" }]} />
      <section className="section">
        <div className="wrap">
          {upcoming.length > 0 && (
            <>
              <div className="sec-head">
                <span className="eyebrow">Upcoming</span>
                <h2 className="h2" data-reveal="lines">
                  Coming up
                </h2>
              </div>
              <div className="cards-3" style={{ marginBottom: 120 }}>
                {upcoming.map((e) => (
                  <EventCard key={e.id} e={e} media={media} />
                ))}
              </div>
            </>
          )}
          <div className="sec-head">
            <span className="eyebrow">Archive</span>
            <h2 className="h2" data-reveal="lines">
              Past events
            </h2>
          </div>
          {past.length ? (
            <div className="cards-3">
              {past.map((e) => (
                <EventCard key={e.id} e={e} media={media} />
              ))}
            </div>
          ) : (
            <p className="empty">Events will appear here as they are published.</p>
          )}
        </div>
      </section>
    </>
  );
}
