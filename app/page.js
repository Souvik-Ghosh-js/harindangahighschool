import Link from "next/link";
import { getNotices } from "@/lib/data";
import { PATHS } from "@/lib/site";
import { NoticeRow } from "@/components/NoticeList";
import Ticker from "@/components/Ticker";
import CountUp from "@/components/CountUp";

export const dynamic = "force-dynamic";

export default async function Home() {
  const notices = await getNotices();
  const latest = notices.slice(0, 12);

  return (
    <>
      <header className="hero">
        <div className="hero-bg">
          <img
            src={`${PATHS.img}IMG-20211109-WA0002.jpg`}
            alt="The main building of Harindanga High School"
          />
        </div>
        <div className="wrap">
          <div className="hero-inner">
            <span className="hero-badge">Established 1948 · West Bengal</span>
            <h1>
              Where rural Bengal
              <br />
              learns to <em>lead</em>.
            </h1>
            <p>
              For over seventy-five years, Harindanga High School (H.S) has carried students
              from the villages of Falta to merit lists, national stages and university halls —
              through academics, culture and sport.
            </p>
            <div className="hero-actions">
              <Link className="btn btn--primary" href="/admission">
                Apply for Admission
              </Link>
              <Link className="btn btn--ghost" href="/notices">
                View Notice Board
              </Link>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <b><CountUp to={77} suffix="+" /></b>
              <span>Years of service</span>
            </div>
            <div className="hero-stat">
              <b><CountUp to={38} /></b>
              <span>Teaching faculty</span>
            </div>
            <div className="hero-stat">
              <b>V–XII</b>
              <span>Classes offered</span>
            </div>
            <div className="hero-stat">
              <b><CountUp to={30} suffix="+" /></b>
              <span>Years of results</span>
            </div>
          </div>
        </div>
      </header>

      <Ticker notices={notices.slice(0, 8)} />

      <section className="section">
        <div className="wrap">
          <div className="grid g-split">
            <div className="reveal">
              <div className="sec-head" style={{ marginBottom: 26 }}>
                <span className="eyebrow">About the School</span>
                <h2>A well-known name in the Diamond Harbour subdivision.</h2>
              </div>
              <p>
                Harindanga High School (H.S.) is a leading educational institution in the
                district of South 24 Parganas for her all round performance for quite a long
                time. Few schools in this region can boast of a student strength as enjoyed by
                Harindanga High School.
              </p>
              <p>
                For the last three decades we have maintained a bright track record at both
                Secondary and Higher Secondary level. Our students often register their names in
                the merit lists of different state and national level talent tests. Almost all of
                them come from middle and lower-middle class rural families — and in spite of
                many inconveniences, they try to touch the highest benchmark.
              </p>
              <Link className="btn btn--outline" href="/about">
                Read our full story
              </Link>

              <div className="grid g-2" style={{ marginTop: 44, gap: 18 }}>
                <div className="card" style={{ padding: 24 }}>
                  <div className="card-ico alt" style={{ width: 44, height: 44, fontSize: "1.1rem", marginBottom: 14 }}>★</div>
                  <h3 style={{ fontSize: "1.05rem" }}>State &amp; National Culture</h3>
                  <p style={{ fontSize: ".9rem" }}>
                    Several state-level cultural awards and repeated participation in national
                    competitions.
                  </p>
                </div>
                <div className="card" style={{ padding: 24 }}>
                  <div className="card-ico sage" style={{ width: 44, height: 44, fontSize: "1.1rem", marginBottom: 14 }}>✦</div>
                  <h3 style={{ fontSize: "1.05rem" }}>Sports Excellence</h3>
                  <p style={{ fontSize: ".9rem" }}>
                    Students have represented the school at state and national level sports meets.
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal">
              <div className="notice-panel">
                <div className="notice-head">
                  <h3>Notice Board</h3>
                  <span className="notice-live">
                    <span className="blink"></span> Live
                  </span>
                </div>
                <div className="notice-scroll">
                  {latest.length ? (
                    latest.map((n, i) => <NoticeRow key={`${n.file}-${i}`} n={n} />)
                  ) : (
                    <div className="empty">No notices yet.</div>
                  )}
                </div>
                <div style={{ padding: "18px 26px", borderTop: "1px solid var(--line)" }}>
                  <Link className="btn btn--dark" href="/notices" style={{ width: "100%" }}>
                    View all notices
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="hm reveal">
            <div className="hm-photo">
              <img
                src={`${PATHS.img}IMG_2720.jpg`}
                alt="Dr. Asim Kumar Mandal, Head Master, with the Shikshak Ratna Samman 2019"
              />
            </div>
            <div>
              <span className="eyebrow">From the Head Master&apos;s Desk</span>
              <blockquote className="hm-quote">
                Education is a mutual partnership between parents and teachers.
              </blockquote>
              <p>
                I consistently maintain excellent relations with students, parents, teachers and
                management. We at school help students maintain discipline and quality of
                learning. We have confidence that our students will learn from the best, and will
                become the best.
              </p>
              <p>
                Children learn best with practice — so we make students practise more, reinforcing
                concepts through varied methods of teaching. We believe that with the constant
                support of the parents we will continue to make learning a joyful and meaningful
                experience.
              </p>
              <div className="hm-sign">
                <span className="hm-sign-line"></span>
                <span>
                  <b>Dr. Asim Kumar Mandal</b>
                  <span>Head Master · M.Sc. (Math), B.Ed., Ph.D.</span>
                </span>
              </div>
              <Link className="btn btn--outline" href="/hm-desk" style={{ marginTop: 26 }}>
                Read full message
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">What We Offer</span>
            <h2>Four pillars of a Harindanga education</h2>
            <p className="lead">
              Academics anchored in discipline, widened by culture, sport and modern skills.
            </p>
          </div>
          <div className="grid g-4">
            <div className="card reveal">
              <div className="card-ico">◈</div>
              <h3>Academics</h3>
              <p>
                Secondary and Higher Secondary streams under WBBSE &amp; WBCHSE, with a
                thirty-year record of strong results.
              </p>
            </div>
            <div className="card reveal">
              <div className="card-ico alt">♪</div>
              <h3>Culture Unit</h3>
              <p>
                A long tradition of music and dance — alumni have studied at Viswa Bharati and
                Rabindra Bharati.
              </p>
            </div>
            <div className="card reveal">
              <div className="card-ico sage">⚑</div>
              <h3>Sports Unit</h3>
              <p>
                Athletics and games taken seriously, with students competing at state and national
                meets.
              </p>
            </div>
            <div className="card reveal">
              <div className="card-ico terra">⌘</div>
              <h3>Computer &amp; Science</h3>
              <p>
                Computer application and laboratory-based science learning for practical,
                hands-on understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="wrap">
          <div className="grid g-split even center">
            <div className="reveal">
              <span className="eyebrow">On the State Stage</span>
              <h2>From a Falta village to Netaji Indoor Stadium.</h2>
              <p>
                Harindanga High School (H.S.) is a leading institution in the field of cultural
                activities not only in the district of South 24 Parganas, but on the cultural map
                of West Bengal — and it has left its mark at the national level too.
              </p>
              <p>
                At the inaugural function of Teachers&apos; Day 2019, organised by the Government
                of West Bengal at the Netaji Indoor Stadium, our students performed the folk song{" "}
                <em>‘Champabatir Panchali’</em> to create awareness against female foeticide.
              </p>
              <Link className="btn btn--primary" href="/awards" style={{ marginTop: 10 }}>
                See our awards
              </Link>
            </div>
            <div className="reveal">
              <div className="grid g-2" style={{ gap: 14 }}>
                <img
                  src={`${PATHS.img}IMG_2714.jpg`}
                  alt="Students in folk costume at the Teachers’ Day 2019 programme"
                  style={{ borderRadius: "var(--r-md)", aspectRatio: "3/4", objectFit: "cover" }}
                />
                <img
                  src={`${PATHS.img}IMG_2259.jpg`}
                  alt="Award being presented at the Teachers’ Day 2019 state ceremony"
                  style={{ borderRadius: "var(--r-md)", aspectRatio: "3/4", objectFit: "cover", marginTop: 26 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Quick Access</span>
            <h2>Forms, syllabus &amp; results</h2>
          </div>
          <div className="grid g-4">
            <Link className="card reveal" href="/admission" style={{ textAlign: "center" }}>
              <div className="card-ico" style={{ margin: "0 auto 18px" }}>✎</div>
              <h3 style={{ fontSize: "1.05rem" }}>Admission Forms</h3>
              <p style={{ fontSize: ".9rem" }}>Class V and Class XI application forms.</p>
            </Link>
            <Link className="card reveal" href="/notices?cat=Syllabus" style={{ textAlign: "center" }}>
              <div className="card-ico alt" style={{ margin: "0 auto 18px" }}>▤</div>
              <h3 style={{ fontSize: "1.05rem" }}>Syllabus 2026</h3>
              <p style={{ fontSize: ".9rem" }}>Class V to X syllabus downloads.</p>
            </Link>
            <Link className="card reveal" href="/notices?cat=Result" style={{ textAlign: "center" }}>
              <div className="card-ico sage" style={{ margin: "0 auto 18px" }}>✓</div>
              <h3 style={{ fontSize: "1.05rem" }}>Results</h3>
              <p style={{ fontSize: ".9rem" }}>Madhyamik, HS and annual results.</p>
            </Link>
            <a
              className="card reveal"
              href={`${PATHS.doc}Roll%20Strength-2021.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textAlign: "center" }}
            >
              <div className="card-ico terra" style={{ margin: "0 auto 18px" }}>◫</div>
              <h3 style={{ fontSize: "1.05rem" }}>Roll Strength</h3>
              <p style={{ fontSize: ".9rem" }}>Class-wise student strength report.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div
            className="reveal"
            style={{
              background: "linear-gradient(135deg,var(--marigold) 0%,#F0B93C 100%)",
              borderRadius: "var(--r-xl)",
              padding: "clamp(40px,6vw,72px)",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#26190A", maxWidth: 660, margin: "0 auto .5em" }}>
              Admissions are open for Class V and Class XI.
            </h2>
            <p style={{ color: "#4A3410", maxWidth: 560, margin: "0 auto 30px", fontSize: "1.05rem" }}>
              Download the application form, or call the school office between 10:00 a.m. and
              5:00 p.m. on any working day.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn--dark" href="/admission">
                Admission details
              </Link>
              <a className="btn btn--outline" href="tel:9002706498">
                Call 9002706498
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
