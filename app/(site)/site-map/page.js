import Link from "next/link";
import { getSite } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { POLICY_PAGES } from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";

export const revalidate = 3600;

export async function generateMetadata() {
  return pageMeta({ title: "Sitemap", description: "All pages of the school website.", path: "/site-map" });
}

export default async function SiteMapPage() {
  const { nav } = await getSite();
  const items = (nav.items || []).filter((i) => i.visible !== false && i.href);
  const extra = [["Administrative body", "/administration"], ["Accessibility statement", "/accessibility"], ...POLICY_PAGES.map(([s, l]) => [l, `/policies/${s}`])];
  return (
    <>
      <PageHero title="Sitemap" plain crumbs={[{ name: "Sitemap", path: "/site-map" }]} />
      <section className="section">
        <div className="wrap">
          <div className="qlinks">
            {[...items.map((i) => [i.label, i.href]), ...extra].map(([l, h]) => (
              <Link key={h} href={h}>
                {l} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
