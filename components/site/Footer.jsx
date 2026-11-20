import Link from "next/link";
import Image from "next/image";
import { shortName } from "@/lib/seo";
import { longDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media-url";

export const POLICY_PAGES = [
  ["copyright", "Copyright policy"],
  ["privacy", "Privacy policy"],
  ["hyperlinking", "Hyperlinking policy"],
  ["terms", "Terms & conditions"],
  ["disclaimer", "Disclaimer"],
];

export default function Footer({ site, nav, links, policies, lastUpdated }) {
  const items = (nav?.items || []).filter((i) => i.visible !== false && i.label && i.href);
  const ext = (links?.items || []).filter((l) => l.label && l.href).slice(0, 6);
  const year = new Date().getFullYear();
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.map_query || site.name)}`;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <div className="brand" style={{ marginBottom: 18 }}>
              {site.logo && (
                <span className="brand__logo" style={{ background: "#fff", borderRadius: "50%", padding: 4 }}>
                  <Image src={mediaUrl(site.logo)} alt="" width={96} height={96} />
                </span>
              )}
              <span className="brand__text">
                <span className="brand__name" style={{ color: "#fff" }}>
                  {shortName(site.name)}
                </span>
                {site.name_bn && (
                  <span className="brand__bn bn" style={{ color: "rgba(255,255,255,.65)" }}>
                    {site.name_bn}
                  </span>
                )}
              </span>
            </div>
            {site.footer_note && <p style={{ maxWidth: "30em" }}>{site.footer_note}</p>}
          </div>
          <div>
            <h3 className="footer__h">Explore</h3>
            <ul>
              {items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="footer__h">Important links</h3>
            <ul>
              {ext.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} ↗
                  </a>
                </li>
              ))}
              <li>
                <Link href="/administration">Administrative body</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="footer__h">Visit & contact</h3>
            <address>{site.address}</address>
            <ul style={{ marginTop: 16 }}>
              {site.phone && (
                <li>
                  <a href={`tel:${site.phone}`}>{site.phone}</a>
                </li>
              )}
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
              )}
              <li>
                <a href={mapHref} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
        <nav className="footer__policies" aria-label="Website policies">
          {POLICY_PAGES.map(([slug, label]) => (
            <Link key={slug} href={`/policies/${slug}`}>
              {label}
            </Link>
          ))}
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/site-map">Sitemap</Link>
          <Link href="/admin" rel="nofollow">
            Staff login
          </Link>
        </nav>
        <div className="footer__bottom">
          <div className="footer__meta">
            <span>
              © {year} {shortName(site.name)}. All rights reserved.
            </span>
            {policies?.content_owner && <span>Content owned and maintained by {policies.content_owner}.</span>}
          </div>
          <div className="footer__meta" style={{ textAlign: "right" }}>
            {lastUpdated && <span>Last updated: {longDate(lastUpdated)}</span>}
            {policies?.developer && <span>Designed & developed by {policies.developer}</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}
