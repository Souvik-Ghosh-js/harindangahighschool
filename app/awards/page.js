import Link from "next/link";
import { PATHS } from "@/lib/site";

export const metadata = {
  title: "Awards & Recognition",
  description:
    "Cultural achievements 2015–2019, state-level awards and the Shikshak Ratna Samman 2019 at Harindanga High School (H.S).",
};

export default function AwardsPage() {
  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>Awards &amp; Recognition</span>
          </div>
          <h1>Awards &amp; Recognition</h1>
          <p>
            Several state-level cultural awards, repeated national competition participation, and
            a place on the cultural map of West Bengal.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid g-split wide-left">
            <div className="reveal">
              <span className="eyebrow">Cultural Achievements</span>
              <h2>2015 – 2019</h2>
              <p>
                Harindanga High School (H.S.) is a leading institution in the field of cultural
                activities not only in the district of South 24 Parganas but on the cultural map
                of the state of West Bengal — and the school has left its mark at the national
                level too.
              </p>
              <p>
                We have bagged several state level cultural awards and participated in national
                level cultural competitions more than once. Many students of this school have
                already completed, or are currently pursuing, courses of music and dance at
                universities such as Viswa Bharati and Rabindra Bharati.
              </p>
              <p>
                The complete record of the school&apos;s cultural achievements is available as a
                downloadable document.
              </p>
              <a
                className="btn btn--primary"
                href={`${PATHS.doc}${encodeURIComponent("SCHOOL CULTURAL ACHIEVEMENTS ALL.pdf")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: 12 }}
              >
                Download full record (PDF)
              </a>
            </div>

            <div className="reveal">
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <img
                  src={`${PATHS.img}IMG_2259.jpg`}
                  alt="Award presented at the Teachers’ Day 2019 ceremony, Netaji Indoor Stadium"
                  style={{ aspectRatio: "4/3", objectFit: "cover" }}
                />
                <div style={{ padding: 26 }}>
                  <h3 style={{ fontSize: "1.08rem", marginBottom: 8 }}>Teachers&apos; Day 2019</h3>
                  <p style={{ fontSize: ".93rem", margin: 0 }}>
                    Our students performed the folk song <em>‘Champabatir Panchali’</em> at the
                    Netaji Indoor Stadium, at the inaugural function organised by the Government
                    of West Bengal — a campaign against female foeticide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Areas of Distinction</span>
            <h2>Where our students have excelled</h2>
          </div>
          <div className="grid g-3">
            {[
              ["alt", "♪", "State Cultural Awards", "Several state-level awards in cultural competition, sustained across years rather than won once."],
              ["", "◈", "Academic Merit Lists", "Students regularly register their names in the merit lists of state and national level talent tests."],
              ["sage", "⚑", "State & National Sports", "Representation at both state and national level sports meets, a standing priority for the school."],
            ].map(([mod, ico, title, body]) => (
              <div className="card reveal" key={title}>
                <div className={`card-ico${mod ? " " + mod : ""}`}>{ico}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>

          <div className="grid g-split even center reveal" style={{ marginTop: 56 }}>
            <div>
              <span className="eyebrow">Shikshak Ratna 2019</span>
              <h2 style={{ fontSize: "clamp(1.5rem,2.6vw,2.1rem)" }}>
                Our Head Master, honoured by the State.
              </h2>
              <p>
                Dr. Asim Kumar Mandal, Head Master of Harindanga High School, received the{" "}
                <strong>Shikshak Ratna Samman 2019</strong> from the Education Department,
                Government of West Bengal — presented at the Netaji Indoor Stadium, Kolkata, on 5
                September 2019.
              </p>
              <p>
                The honour recognises outstanding contribution to education, and it was conferred
                at the same Teachers&apos; Day ceremony at which our students performed{" "}
                <em>‘Champabatir Panchali’</em>.
              </p>
            </div>
            <div>
              <img
                src={`${PATHS.img}IMG_2720.jpg`}
                alt="Dr. Asim Kumar Mandal holding the Shikshak Ratna Samman 2019 award"
                style={{
                  borderRadius: "var(--r-lg)",
                  aspectRatio: "4/3",
                  objectFit: "cover",
                  boxShadow: "var(--shadow-md)",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
