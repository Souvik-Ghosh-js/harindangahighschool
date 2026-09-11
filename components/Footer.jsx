import Link from "next/link";
import { SITE, PATHS } from "@/lib/site";

const QUICK = [
  ["/about", "About the School"],
  ["/hm-desk", "Head Master's Desk"],
  ["/administration", "Administrative Body"],
  ["/faculty", "Faculty"],
  ["/awards", "Awards"],
];

const RESOURCES = [
  ["/notices", "All Notices"],
  ["/notices?cat=Syllabus", "Syllabus"],
  ["/notices?cat=Result", "Results"],
  ["/admission", "Admission Forms"],
  ["/gallery", "Photo Gallery"],
];

const Ic = {
  pin: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  phone: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5c0-.6.4-1 1-1h2.6c.5 0 .9.3 1 .8l.8 3c.1.4 0 .8-.4 1L7.4 10a13 13 0 0 0 6.6 6.6l1.2-1.6c.3-.3.7-.5 1.1-.4l3 .8c.5.1.8.5.8 1V19c0 .6-.4 1-1 1A16 16 0 0 1 4 5z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  ),
  mail: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="m3.6 7 8.4 6 8.4-6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <div id="site-footer">
      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-brand">
                <img src={`${PATHS.img}logo2.png`} alt="" />
                <span>
                  <strong>Harindanga High School</strong>
                  <span>{SITE.sub}</span>
                </span>
              </div>
              <p>
                A leading institution of South 24 Parganas since 1948 — building academic
                excellence, cultural distinction and sporting spirit in rural Bengal.
              </p>
            </div>

            <div>
              <h4>Explore</h4>
              <ul>
                {QUICK.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Resources</h4>
              <ul>
                {RESOURCES.map(([href, label]) => (
                  <li key={href + label}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Reach Us</h4>
              <ul className="foot-contact">
                <li>
                  <span className="ic">{Ic.pin}</span>
                  <span>
                    {SITE.address.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < SITE.address.length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                </li>
                <li>
                  <span className="ic">{Ic.phone}</span>
                  <span>
                    <a href={`tel:${SITE.phone}`}>{SITE.phone}</a>
                    <br />
                    <small>{SITE.phoneNote}</small>
                  </span>
                </li>
                <li>
                  <span className="ic">{Ic.mail}</span>
                  <span>
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="foot-bot">
            <span>
              © {new Date().getFullYear()} Harindanga High School (H.S). All rights reserved.
            </span>
            <span>Government of West Bengal recognised · WBBSE &amp; WBCHSE affiliated</span>
            <Link className="admin-link" href="/admin">
              Staff Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
