import Link from "next/link";
import { PATHS } from "@/lib/site";

export const metadata = {
  title: "Head Master's Desk",
  description:
    "Message from Dr. Asim Kumar Mandal, Head Master of Harindanga High School (H.S), South 24 Parganas.",
};

export default function HmDeskPage() {
  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>Head Master&apos;s Desk</span>
          </div>
          <h1>From the Head Master&apos;s Desk</h1>
          <p>Dr. Asim Kumar Mandal — M.Sc. (Mathematics), B.Ed., Ph.D.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="hm reveal">
            <div className="hm-photo">
              <img
                src={`${PATHS.img}IMG_2720.jpg`}
                alt="Dr. Asim Kumar Mandal, Head Master, with the Shikshak Ratna Samman 2019"
              />
            </div>
            <div>
              <span className="eyebrow">A Message to Parents &amp; Students</span>
              <blockquote className="hm-quote">
                Education is a mutual partnership between parents and teachers.
              </blockquote>
              <p>
                I consistently maintain excellent relations with students, parents, teachers and
                management. We at school help students maintain discipline and quality of
                learning. We have confidence that our students will learn from the best, will
                become the best.
              </p>
              <p>
                Children learn best with practice, thus as a beacon we make students practise
                more — reinforcing concepts through repetition and a diversity of teaching
                methods, so that learning is understood rather than memorised.
              </p>
              <p>
                My vision for this institution joins infrastructure development with close
                attention to both academic and extracurricular programmes, so that every student
                grows comprehensively — in the classroom, on the stage, and on the field.
              </p>
              <p>
                We believe that with the constant support of the parents we will continue to make
                learning a joyful and meaningful experience. It is a matter of pride for me to
                serve at this respected institution.
              </p>
              <div className="hm-sign">
                <span className="hm-sign-line"></span>
                <span>
                  <b>Dr. Asim Kumar Mandal</b>
                  <span>Head Master · Harindanga High School (H.S)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="grid g-3">
            {[
              ["", "Partnership", "Parents and teachers working as one, with open and consistent communication in both directions."],
              ["alt", "Learning by Practice", "Concepts reinforced through repetition and varied methods, so understanding takes root and lasts."],
              ["sage", "Whole-Child Growth", "Infrastructure, academics and extracurricular life developed together for comprehensive student growth."],
            ].map(([mod, title, body], i) => (
              <div className="card reveal" key={title}>
                <div className={`card-ico${mod ? " " + mod : ""}`}>{["◈", "↻", "◎"][i]}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Link className="btn btn--dark" href="/administration">
              Meet the administrative body
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
