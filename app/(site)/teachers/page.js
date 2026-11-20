import { getBlock, getTeacherTree, withMedia } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/site/PageHero";
import TeacherTree from "@/components/site/TeacherTree";

export const revalidate = 3600;

export async function generateMetadata() {
  const b = await getBlock("teachers_page");
  return pageMeta({ title: b.title, description: b.intro, path: "/teachers", image: b.hero_image, seoTitle: b.seo_title, seoDescription: b.seo_description });
}

export default async function TeachersPage() {
  const [b, tree] = await Promise.all([getBlock("teachers_page"), getTeacherTree()]);
  const media = await withMedia(b.hero_image, tree.teaching.map((t) => t.photo_id));
  return (
    <>
      <PageHero title={b.title} intro={b.intro} plain crumbs={[{ name: b.title, path: "/teachers" }]} />
      <section className="section">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div>
              <span className="eyebrow">Faculty</span>
              <h2 className="h2" data-reveal="lines">
                {tree.teaching.length} teachers across {tree.groups.length} departments
              </h2>
            </div>
            <p className="lead" data-reveal>
              Open a department to meet its teachers. Select a teacher to read their profile.
            </p>
          </div>
          <TeacherTree groups={tree.groups} media={media} />
        </div>
      </section>
    </>
  );
}
