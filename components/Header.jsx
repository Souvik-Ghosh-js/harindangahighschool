"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, NAV, PATHS } from "@/lib/site";

const Icon = {
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

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href) => {
    const base = href.split("?")[0].split("#")[0];
    return base === "/" ? pathname === "/" : pathname === base;
  };

  return (
    <div id="site-header">
      <div className="topbar">
        <div className="wrap">
          <div className="topbar-items">
            <span>{Icon.pin} {SITE.locality}</span>
          </div>
          <div className="topbar-items">
            <span>{Icon.phone} <a href={`tel:${SITE.phone}`}>{SITE.phone}</a></span>
            <span>{Icon.mail} <a href={`mailto:${SITE.email}`}>{SITE.email}</a></span>
          </div>
        </div>
      </div>

      <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
        <div className="wrap">
          <Link className="brand" href="/">
            <img src={`${PATHS.img}logo2.png`} alt={`${SITE.name} crest`} />
            <span className="brand-txt">
              <strong>Harindanga High School</strong>
              <span>{SITE.sub}</span>
            </span>
          </Link>

          <ul className={`menu${open ? " open" : ""}`} id="menu">
            {NAV.map((n) => (
              <li key={n.label} className={isActive(n.href) ? "active" : ""}>
                <Link href={n.href}>
                  {n.label}
                  {n.sub && (
                    <svg className="caret" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  )}
                </Link>
                {n.sub && (
                  <ul className="submenu">
                    {n.sub.map((s) => (
                      <li key={s.href + s.label}>
                        <Link href={s.href}>{s.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="nav-cta">
            <Link className="btn btn--primary" href="/admission">
              Apply for Admission
            </Link>
            <button
              className={`burger${open ? " open" : ""}`}
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
