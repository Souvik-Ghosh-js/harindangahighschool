import Link from "next/link";
import { PATHS } from "@/lib/site";

export const metadata = {
  title: "Facilities",
  description:
    "Facilities at Harindanga High School (H.S) — science and computer laboratories, culture unit, sports unit, student credit card and scholarship support.",
};

const FACILITIES = [
  ["terra", "⌘", "Computer Application & Science", "A computer unit supporting computer application and computer science teaching, led by an M.Sc. (Computer Science) faculty member."],
  ["sage", "⚗", "Science Laboratories", "Laboratory facilities for Physics, Chemistry and Biology practicals, with practical programmes published each semester and a dedicated laboratory assistant."],
  ["alt", "♪", "Culture Unit", "The heart of the school's state-level reputation — music, dance and folk performance, with alumni going on to Viswa Bharati and Rabindra Bharati."],
  ["", "⚑", "Sports Unit", "Games and athletics under an M.P.Ed. qualified teacher. Students have represented the school at state and national level sports meets."],
  ["alt", "◫", "Student Credit Card", "Guidance and documentation support for students applying under the West Bengal Student Credit Card scheme for higher studies."],
  ["sage", "◈", "Scholarships", "Assistance with state and central scholarship applications — important support for students from rural and lower-middle class families."],
];

export default function FacilitiesPage() {
  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>Facilities</span>
          </div>
          <h1>Facilities</h1>
          <p>What the school provides to support learning, culture, sport and student welfare.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid g-3">
            {FACILITIES.map(([mod, ico, title, body]) => (
              <div className="card reveal" key={title}>
                <div className={`card-ico${mod ? " " + mod : ""}`}>{ico}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="wrap">
          <div className="grid g-split even center">
            <div className="reveal">
              <span className="eyebrow">Campus</span>
              <h2>A rural campus with state-level ambition.</h2>
              <p>
                Although situated in a rural background, the school has built a long tradition of
                academic, cultural and sporting activity — and continues to develop its
                infrastructure alongside its academic and extracurricular programmes.
              </p>
              <p>
                Room allotment, class scheduling and session arrangements are notified to students
                and guardians through the notice board.
              </p>
              <Link className="btn btn--primary" href="/gallery" style={{ marginTop: 10 }}>
                See the campus
              </Link>
            </div>
            <div className="reveal">
              <img
                src={`${PATHS.img}WP_20160826_002.jpg`}
                alt="Students at work in the science laboratory"
                style={{ borderRadius: "var(--r-lg)", aspectRatio: "4/3", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
