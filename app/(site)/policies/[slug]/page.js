import { notFound } from "next/navigation";
import { getBlock } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { paragraphs } from "@/lib/format";
import { POLICY_PAGES } from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return POLICY_PAGES.map(([slug]) => ({ slug }));
}

const label = (slug) => POLICY_PAGES.find(([s]) => s === slug)?.[1];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return pageMeta({ title: label(slug), description: `${label(slug)} of the school website.`, path: `/policies/${slug}` });
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  if (!label(slug)) notFound();
  const p = await getBlock("policies");
  return (
    <>
      <PageHero title={label(slug)} plain crumbs={[{ name: label(slug), path: `/policies/${slug}` }]} />
      <section className="section">
        <div className="wrap wrap--narrow prose prose--plain">
          {paragraphs(p[slug]).map((t, i) => (
            <p key={i}>{t}</p>
          ))}
          {!p[slug] && <p>This policy will be published shortly.</p>}
        </div>
      </section>
    </>
  );
}
