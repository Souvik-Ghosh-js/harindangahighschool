import Link from "next/link";
import { PATHS } from "@/lib/site";

export const metadata = {
  title: "Academics",
  description:
    "Academic structure, syllabus, examination pattern and results at Harindanga High School (H.S) — Classes V to XII under WBBSE and WBCHSE.",
};

const DOWNLOADS = [
  ["326868AV syllabus 2026.pdf", "Class V Syllabus 2026"],
  ["370599AVI syllabus 2026.pdf", "Class VI Syllabus 2026"],
  ["680367AVII syllabus 2026.pdf", "Class VII Syllabus 2026"],
  ["896220AVIII syllabus 2026.pdf", "Class VIII Syllabus 2026"],
  ["357072AIX syllabus 2026.pdf", "Class IX Syllabus 2026"],
  ["323363AX syllabus 2026.pdf", "Class X Syllabus 2026"],
  ["842803ADOC-20260102-WA0007..pdf", "Book List, Class V–X, Session 2026"],
  ["283040A1st unit programme 2026.pdf", "First Summative Evaluation 2026 Programme"],
];

const DEPARTMENTS = [
  ["", "∑", "Mathematics", "Taught by five faculty members holding M.Sc. degrees in Mathematics."],
  ["sage", "⚗", "Science", "Physics, Chemistry, Botany and Biology with laboratory-based practical work."],
  ["alt", "ᴀ", "Languages", "Bengali, English and Sanskrit across all classes."],
  ["terra", "◷", "Humanities", "History, Geography, Political Science, Philosophy and Education."],
  ["", "₹", "Commerce", "Commerce subjects taught by M.Com. qualified faculty."],
  ["terra", "⌘", "Computer Science", "Computer application and computer science instruction."],
  ["alt", "♪", "Music", "A dedicated M.A. (Music) faculty member anchoring the culture unit."],
  ["sage", "⚑", "Physical Education", "Games, athletics and sport under an M.P.Ed. qualified teacher."],
];

export default function AcademicsPage() {
  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>Academics</span>
          </div>
          <h1>Academics</h1>
          <p>
            Classes V to XII under the West Bengal Board of Secondary Education and the West
            Bengal Council of Higher Secondary Education.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Academic Structure</span>
            <h2>Three stages of learning</h2>
            <p className="lead">
              From upper primary through to the Higher Secondary examination, with a thirty-year
              record of strong results.
            </p>
          </div>
          <div className="grid g-3">
            <div className="card reveal">
              <div className="card-ico">V–VIII</div>
              <h3>Upper Primary</h3>
              <p>
                Foundation years covering Bengali, English, Mathematics, Science, History,
                Geography and Physical Education, assessed through summative evaluations across
                the session.
              </p>
              <Link className="btn btn--outline" href="/notices?cat=Syllabus" style={{ marginTop: 20 }}>
                Syllabus V–VIII
              </Link>
            </div>
            <div className="card reveal">
              <div className="card-ico alt">IX–X</div>
              <h3>Secondary (Madhyamik)</h3>
              <p>
                Preparation for the Madhyamik Pariksha under WBBSE, with internal test
                examinations, unit tests and published class results at every stage.
              </p>
              <Link className="btn btn--outline" href="/notices?cat=Syllabus" style={{ marginTop: 20 }}>
                Syllabus IX–X
              </Link>
            </div>
            <div className="card reveal">
              <div className="card-ico sage">XI–XII</div>
              <h3>Higher Secondary</h3>
              <p>
                The semester system under WBCHSE, with registration, enrolment, practical
                programmes and semester examinations notified through the notice board.
              </p>
              <Link className="btn btn--outline" href="/notices?cat=Examination" style={{ marginTop: 20 }}>
                Exam programmes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="grid g-split even">
            <div className="reveal">
              <span className="eyebrow">Academic Record</span>
              <h2>Thirty years of consistent results.</h2>
              <p>
                In the field of academic excellence Harindanga High School (H.S.) is a well known
                name in the Diamond Harbour subdivision. For the last three decades we have been
                maintaining a bright track record both in Secondary and Higher Secondary Level.
              </p>
              <p>
                Our students often register their name in the merit list of different state and
                national level talent tests. Class results, test results and board result
                summaries are published on the notice board as soon as they are released.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
                <Link className="btn btn--dark" href="/notices?cat=Result">
                  View all results
                </Link>
                <a
                  className="btn btn--outline"
                  href={`${PATHS.doc}${encodeURIComponent("678363AHS Result Summery.pdf")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HS 2025 summary
                </a>
              </div>
            </div>

            <div className="reveal">
              <div className="card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: "1.12rem", marginBottom: 20 }}>Downloads</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: ".94rem" }}>
                  {DOWNLOADS.map(([file, label], i) => (
                    <li
                      key={file}
                      style={{
                        padding: "13px 0",
                        borderBottom: i < DOWNLOADS.length - 1 ? "1px solid var(--paper-3)" : "none",
                      }}
                    >
                      <a
                        href={`${PATHS.doc}${encodeURIComponent(file)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Subjects</span>
            <h2>Departments</h2>
          </div>
          <div className="grid g-4">
            {DEPARTMENTS.map(([mod, ico, title, body]) => (
              <div className="card reveal" key={title}>
                <div className={`card-ico${mod ? " " + mod : ""}`}>{ico}</div>
                <h3 style={{ fontSize: "1.05rem" }}>{title}</h3>
                <p style={{ fontSize: ".9rem" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
