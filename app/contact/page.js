import Link from "next/link";
import { SITE } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Harindanga High School (H.S), Vill Harindanga, PO Chaberia, PS Falta, South 24 Parganas, PIN 743504. Phone 9002706498.",
};

export default function ContactPage() {
  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>Contact Us</span>
          </div>
          <h1>Contact Us</h1>
          <p>
            The school office is open from 10:00 a.m. to 5:00 p.m. on all working days, except
            holidays.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid g-split wide-right">
            <div className="reveal">
              <span className="eyebrow">Reach Us</span>
              <h2>Get in touch</h2>
              <p>
                For admissions, certificates, results or any other enquiry, the office staff will
                be glad to assist you.
              </p>

              <div className="grid" style={{ gap: 16, marginTop: 32 }}>
                <div className="card" style={{ padding: 26 }}>
                  <h3 style={{ fontSize: "1.02rem", marginBottom: 8 }}>School Address</h3>
                  <p style={{ margin: 0, fontSize: ".95rem" }}>
                    Harindanga High School (H.S)
                    <br />
                    {SITE.address.map((l, i) => (
                      <span key={i}>
                        {l}
                        <br />
                      </span>
                    ))}
                    West Bengal, India
                  </p>
                </div>
                <div className="card" style={{ padding: 26 }}>
                  <h3 style={{ fontSize: "1.02rem", marginBottom: 8 }}>Phone</h3>
                  <p style={{ margin: 0, fontSize: ".95rem" }}>
                    <a href={`tel:${SITE.phone}`} style={{ fontSize: "1.15rem", fontWeight: 650 }}>
                      {SITE.phone}
                    </a>
                    <br />
                    <span style={{ color: "var(--text-3)" }}>{SITE.phoneNote}</span>
                  </p>
                </div>
                <div className="card" style={{ padding: 26 }}>
                  <h3 style={{ fontSize: "1.02rem", marginBottom: 8 }}>Email</h3>
                  <p style={{ margin: 0, fontSize: ".95rem" }}>
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Location</span>
            <h2>Find the school</h2>
          </div>
          <div
            className="reveal"
            style={{ borderRadius: "var(--r-lg)", overflow: "hidden", border: "1px solid var(--line)" }}
          >
            <iframe
              title="Map to Harindanga High School"
              src="https://www.google.com/maps?q=Harindanga%20High%20School%2C%20Chaberia%2C%20Falta%2C%20South%2024%20Parganas%2C%20743504&output=embed"
              width="100%"
              height="420"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
