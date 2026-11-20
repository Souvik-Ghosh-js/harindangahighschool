import { getBlock } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { paragraphs } from "@/lib/format";
import PageHero from "@/components/site/PageHero";

export const revalidate = 3600;

export async function generateMetadata() {
  return pageMeta({ title: "Accessibility & screen reader access", description: "Accessibility statement and screen reader support for the school website.", path: "/accessibility" });
}

const READERS = [
  ["NVDA", "Windows", "Free", "https://www.nvaccess.org"],
  ["JAWS", "Windows", "Commercial", "https://www.freedomscientific.com"],
  ["TalkBack", "Android", "Built-in", "https://support.google.com/accessibility/android"],
  ["VoiceOver", "iPhone, iPad, Mac", "Built-in", "https://www.apple.com/accessibility/"],
];

export default async function AccessibilityPage() {
  const p = await getBlock("policies");
  return (
    <>
      <PageHero title="Accessibility statement" intro="Screen reader access and accessibility features of this website." plain crumbs={[{ name: "Accessibility", path: "/accessibility" }]} />
      <section className="section">
        <div className="wrap wrap--narrow">
          <div className="prose prose--plain">
            {paragraphs(p.accessibility).map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          <h2 className="h3" style={{ margin: "56px 0 20px" }}>
            Screen readers
          </h2>
          <ul className="facts">
            {READERS.map(([n, os, cost, href]) => (
              <li key={n}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <b>{n}</b>
                </a>
                <span>
                  {os} · {cost}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
