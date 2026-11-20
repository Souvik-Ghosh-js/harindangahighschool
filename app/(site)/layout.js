import { getSite, getLastUpdated } from "@/lib/content";
import { schoolLd } from "@/lib/seo";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Motion from "@/components/site/Motion";
import Popup from "@/components/site/Popup";
import JsonLd from "@/components/JsonLd";

export default async function SiteLayout({ children }) {
  const [{ site, seo, nav, announcement, popup, links, policies, media }, lastUpdated] = await Promise.all([getSite(), getLastUpdated()]);
  const today = new Date().toISOString().slice(0, 10);
  const showAnnounce = announcement.enabled && announcement.text && (!announcement.expires_on || announcement.expires_on >= today);

  return (
    <>
      {showAnnounce && (
        <div className="announce" role="status">
          {announcement.text}
          {announcement.link_href && <a href={announcement.link_href}>{announcement.link_label || "Read more"}</a>}
        </div>
      )}
      <Header site={site} nav={nav} logo={site.logo} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer site={site} nav={nav} links={links} policies={policies} lastUpdated={lastUpdated} />
      <Motion />
      <Popup popup={popup} media={media} />
      <JsonLd data={schoolLd(site, seo, media)} />
    </>
  );
}
