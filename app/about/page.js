import Link from "next/link";
import { PATHS } from "@/lib/site";
import { getStaff } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About the School",
  description:
    "History, academic record, cultural tradition and sporting achievements of Harindanga High School (H.S), established 1948 in South 24 Parganas, West Bengal.",
};

export default async function AboutPage() {
  const staff = await getStaff();
  const teacherCount = (staff.teaching || []).length;

  const facts = [
    ["Established", "1948"],
    ["Type", "Co-educational"],
    ["Classes", "V – XII"],
    ["Faculty", String(teacherCount)],
    ["Boards", "WBBSE / WBCHSE"],
    ["District", "South 24 Pgs"],
  ];

  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>About the School</span>
          </div>
          <h1>About the School</h1>
          <p>
            A leading educational institution in the district of South 24 Parganas for her all
            round performance for quite a long time.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid g-split wide-left">
            <div className="reveal">
              <span className="eyebrow">Our Story</span>
              <h2>Seventy-five years of rural excellence.</h2>
              <p>
                In the field of academic excellence Harindanga High School (H.S.) is a well known
                name in the Diamond Harbour subdivision of the district of South 24 Parganas. Few
                schools in this region can boast of a student strength as enjoyed by Harindanga
                High School.
              </p>
              <p>
                For the last three decades we have been maintaining a bright track record both in
                Secondary and Higher Secondary Level. Moreover, our students often register their
                name in the merit list of different state and national level talent tests.
              </p>
              <p>
                Almost all our students come from the middle and lower middle class families of
                rural background. In spite of many inconveniences and lack of facilities they try
                to touch the highest benchmark. Many of our students have established themselves
                in different fields of society. We feel proud for them and draw our inspiration
                from their success.
              </p>

              <h3 style={{ marginTop: 44 }}>Cultural tradition</h3>
              <p>
                Harindanga High School (H.S.) is a leading institution in the field of cultural
                activities not only in the district of South 24 Parganas but in the cultural map
                of the state of West Bengal also. The school has left its mark in the cultural
                activities in the national level too.
              </p>
              <p>
                Although situated in a rural background, the school has a long tradition of
                cultural activities. Many students of this school have already completed or are
                currently pursuing courses of music and dance in universities like Viswa Bharati
                and Rabindra Bharati. We have bagged several state level cultural awards and
                participated in national level cultural competitions more than once.
              </p>

              <h3 style={{ marginTop: 44 }}>Games and sports</h3>
              <p>
                The excellence in games and sports is one of our priorities. Our students have
                performed both in state and national level sports meets.
              </p>

              <h3 style={{ marginTop: 44 }}>Social awareness</h3>
              <p>
                Our students also take part in social awareness campaigns. In the inaugural
                function of Teachers&apos; Day, 2019 organized by the Govt of West Bengal in the
                Netaji Indoor Stadium our students performed a folk song{" "}
                <em>‘Champabatir Panchali’</em> to create awareness against female foeticide.
              </p>
            </div>

            <aside className="reveal">
              <img
                src={`${PATHS.img}IMG-20211109-WA0002.jpg`}
                alt="The main building of Harindanga High School"
                style={{
                  borderRadius: "var(--r-lg)",
                  aspectRatio: "4/3",
                  objectFit: "cover",
                  marginBottom: 26,
                }}
              />
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 20 }}>At a glance</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: ".93rem" }}>
                  {facts.map(([k, v], i) => (
                    <li
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "11px 0",
                        borderBottom: i < facts.length - 1 ? "1px solid var(--paper-3)" : "none",
                      }}
                    >
                      <span style={{ color: "var(--text-3)" }}>{k}</span>
                      <b>{v}</b>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card" style={{ padding: 28, marginTop: 20 }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>Roll strength</h3>
                <p style={{ fontSize: ".92rem" }}>
                  Class-wise student strength report for the session.
                </p>
                <a
                  className="btn btn--outline"
                  href={`${PATHS.doc}Roll%20Strength-2021.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: "100%", marginTop: 8 }}
                >
                  Download PDF
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Our Values</span>
            <h2>What we stand for</h2>
          </div>
          <div className="grid g-3">
            {[
              ["◈", "Discipline & Quality", "We help students maintain discipline alongside the quality of their learning — the foundation of every result we have earned."],
              ["♪", "Culture as Curriculum", "Music, dance and folk tradition are not extras here. They have carried our students to universities and to the state stage."],
              ["◎", "Opportunity for All", "Our students come from rural, middle and lower-middle class families. The school exists to make sure that is never a ceiling."],
            ].map(([ico, title, body]) => (
              <div
                className="card reveal"
                key={title}
                style={{ background: "rgba(255,255,255,.05)", borderColor: "rgba(255,255,255,.13)" }}
              >
                <div className="card-ico alt">{ico}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
