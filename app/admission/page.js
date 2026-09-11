import Link from "next/link";
import { PATHS, SITE } from "@/lib/site";

export const metadata = {
  title: "Admission",
  description:
    "Admission to Class V and Class XI at Harindanga High School (H.S). Download application forms and admission notices.",
};

const STEPS = [
  ["Check the admission notice", "The current notice lists dates, eligibility and stream availability."],
  ["Download and fill the form", "Complete all fields in block letters and attach a recent photograph."],
  ["Attach required documents", "Previous marksheet, birth certificate, Aadhaar and transfer certificate where applicable."],
  ["Submit at the school office", "Between 10:00 a.m. and 5:00 p.m. on any working day, within the notified dates."],
];

export default function AdmissionPage() {
  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>Admission</span>
          </div>
          <h1>Admission</h1>
          <p>
            Applications are invited for Class V and Class XI. Download the form, complete it, and
            submit it at the school office.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Application Forms</span>
            <h2>Download your form</h2>
          </div>
          <div className="grid g-2">
            <div className="card reveal">
              <div className="card-ico">V</div>
              <h3>Class V Admission Form</h3>
              <p style={{ marginBottom: 22 }}>
                For students seeking entry at the beginning of the secondary stage. Submit the
                completed form with the required documents at the school office.
              </p>
              <div style={{ display: "flex", gap: 11, flexWrap: "wrap" }}>
                <a
                  className="btn btn--primary"
                  href={`${PATHS.doc}${encodeURIComponent("V Admission  Form.pdf")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download form
                </a>
                <a
                  className="btn btn--outline"
                  href={`${PATHS.doc}${encodeURIComponent("409159AV Admission Notice.pdf")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Admission notice
                </a>
              </div>
            </div>

            <div className="card reveal">
              <div className="card-ico alt">XI</div>
              <h3>Class XI Admission Form</h3>
              <p style={{ marginBottom: 22 }}>
                For students entering the Higher Secondary stage after Madhyamik. Stream allotment
                follows the published admission notice.
              </p>
              <div style={{ display: "flex", gap: 11, flexWrap: "wrap" }}>
                <a
                  className="btn btn--primary"
                  href={`${PATHS.doc}${encodeURIComponent("XI Admission Form.pdf")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download form
                </a>
                <a
                  className="btn btn--outline"
                  href={`${PATHS.doc}${encodeURIComponent("714840AAdobe Scan 08 May 2026 (1).pdf")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Admission notice
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="grid g-split even">
            <div className="reveal">
              <span className="eyebrow">How to Apply</span>
              <h2>The admission process</h2>
              <ol style={{ padding: 0, listStyle: "none", margin: "26px 0 0" }}>
                {STEPS.map(([title, body], i) => (
                  <li
                    key={title}
                    style={{ display: "flex", gap: 17, marginBottom: i < STEPS.length - 1 ? 24 : 0 }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: i === STEPS.length - 1 ? "var(--marigold)" : "var(--ink)",
                        color: i === STEPS.length - 1 ? "#26190A" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: ".88rem",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span>
                      <b style={{ display: "block", color: "var(--ink)", marginBottom: 3 }}>{title}</b>
                      <span style={{ color: "var(--text-2)", fontSize: ".94rem" }}>{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="reveal">
              <div className="card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: "1.15rem" }}>Need help?</h3>
                <p>
                  For any question about eligibility, documents, dates or fees, please contact the
                  school office directly — the staff will guide you through the process.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 0", fontSize: ".95rem" }}>
                  <li style={{ padding: "13px 0", borderTop: "1px solid var(--paper-3)" }}>
                    <b style={{ color: "var(--ink)" }}>Phone</b>
                    <br />
                    <a href={`tel:${SITE.phone}`}>{SITE.phone}</a>
                    <br />
                    <small style={{ color: "var(--text-3)" }}>{SITE.phoneNote}</small>
                  </li>
                  <li style={{ padding: "13px 0", borderTop: "1px solid var(--paper-3)" }}>
                    <b style={{ color: "var(--ink)" }}>Email</b>
                    <br />
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  </li>
                  <li style={{ padding: "13px 0", borderTop: "1px solid var(--paper-3)" }}>
                    <b style={{ color: "var(--ink)" }}>Office</b>
                    <br />
                    Vill – Harindanga, PO – Chaberia,
                    <br />
                    PS – Falta, Dist – South 24 Parganas, 743504
                  </li>
                </ul>
                <Link className="btn btn--dark" href="/notices?cat=Admission" style={{ width: "100%", marginTop: 22 }}>
                  All admission notices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
