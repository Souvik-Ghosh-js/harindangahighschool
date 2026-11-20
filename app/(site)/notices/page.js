import { getBlock, getNotices, withMedia } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/site/PageHero";
import NoticeBoard from "@/components/site/NoticeBoard";

export const revalidate = 3600;

export async function generateMetadata() {
  const b = await getBlock("notices_page");
  return pageMeta({ title: b.title, description: b.intro, path: "/notices", image: b.hero_image, seoTitle: b.seo_title, seoDescription: b.seo_description });
}

export default async function NoticesPage() {
  const [b, notices] = await Promise.all([getBlock("notices_page"), getNotices()]);
  const media = await withMedia(b.hero_image);
  const categories = [...new Set(notices.map((n) => n.category))].sort();
  return (
    <>
      <PageHero title={b.title} intro={b.intro} plain crumbs={[{ name: b.title, path: "/notices" }]} />
      <section className="section">
        <div className="wrap">
          <NoticeBoard notices={notices} categories={categories} />
        </div>
      </section>
    </>
  );
}
