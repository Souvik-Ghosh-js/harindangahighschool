import Link from "next/link";
import { PATHS } from "@/lib/site";
import { getStaff } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administrative Body",
  description:
    "Managing committee and administrative body of Harindanga High School (H.S), South 24 Parganas, West Bengal.",
};

export default async function AdministrationPage() {
  const staff = await getStaff();
  const committee = staff.committee || [];

  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>Administrative Body</span>
          </div>
          <h1>Administrative Body</h1>
          <p>
            The managing committee that governs the school — including teacher, non-teaching and
            ex-officio representatives.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Managing Committee</span>
            <h2>Members of the committee</h2>
          </div>
          <div className="grid g-3">
            {committee.length ? (
              committee.map((m, i) => (
                <div className="card reveal" key={`${m.name}-${i}`}>
                  <h3 style={{ fontSize: "1.08rem", marginBottom: 6 }}>{m.name}</h3>
                  <p style={{ color: "var(--marigold-6)", fontWeight: 600, fontSize: ".86rem", margin: 0 }}>
                    {m.role}
                  </p>
                </div>
              ))
            ) : (
              <div className="empty" style={{ gridColumn: "1/-1" }}>
                No committee members listed yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="grid g-split even center">
            <div className="reveal">
              <span className="eyebrow">Governance</span>
              <h2>How the school is run</h2>
              <p>
                The managing committee brings together the President, the Head Master as
                Secretary, elected guardian members, representatives of the teaching and
                non-teaching staff, and ex-officio members from the local administration.
              </p>
              <p>
                This structure keeps academic leadership, staff voice and public accountability in
                the same room — which is how decisions on infrastructure, admissions and academic
                planning are taken.
              </p>
            </div>
            <div className="reveal">
              <img
                src={`${PATHS.img}IMG-20211109-WA0002.jpg`}
                alt="The school building"
                style={{ borderRadius: "var(--r-lg)", aspectRatio: "4/3", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
