"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/media-url";
import { Phone, Mail, Close, Arrow } from "../Icons";

const FS = [["sm", "A-", "A-, smaller text"], ["md", "A", "A, normal text"], ["lg", "A+", "A+, larger text"]];

function TopBar({ site }) {
  const [fs, setFs] = useState("md");
  useEffect(() => setFs(document.documentElement.dataset.fs || "md"), []);
  const apply = (v) => {
    setFs(v);
    document.documentElement.dataset.fs = v;
    try {
      localStorage.setItem("hhs-fs", v);
    } catch {}
  };
  const contrast = () => {
    const d = document.documentElement;
    const on = d.dataset.contrast !== "high";
    if (on) d.dataset.contrast = "high";
    else delete d.dataset.contrast;
    try {
      localStorage.setItem("hhs-contrast", on ? "high" : "");
    } catch {}
  };
  return (
    <div className="topbar">
      <div className="wrap topbar__in">
        <div className="topbar__contact">
          {site.phone && (
            <a href={`tel:${site.phone}`}>
              <Phone />
              {site.phone}
            </a>
          )}
          {site.email && (
            <a href={`mailto:${site.email}`} className="topbar__email">
              <Mail />
              {site.email}
            </a>
          )}
        </div>
        <div className="topbar__tools">
          <div className="fs" role="group" aria-label="Text size">
            {FS.map(([v, l, label]) => (
              <button key={v} onClick={() => apply(v)} aria-pressed={fs === v} aria-label={label}>
                {l}
              </button>
            ))}
          </div>
          <button className="contrast-btn" onClick={contrast} aria-label="Toggle high contrast">
            <i />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Header({ site, nav, logo }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const btn = useRef(null);
  const items = (nav?.items || []).filter((i) => i.visible !== false && i.label && i.href);
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // Home is the logo; Admission has its own button on the right.
  const main = items.filter((i) => i.href !== "/" && i.href !== "/admission");

  useEffect(() => {
    const on = () => setStuck(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const k = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <>
      <TopBar site={site} />
      <header className={`header${stuck ? " header--stuck" : ""}`}>
        <div className="wrap header__in">
          <Link href="/" className="brand">
            {logo && (
              <span className="brand__logo">
                <Image src={mediaUrl(logo)} alt="" width={112} height={112} priority quality={82} />
              </span>
            )}
            <span className="brand__text">
              <span className="brand__name">{site.name.replace(/\s*\(.*?\)\s*/g, " ").trim()}</span>
              {site.name_bn && <span className="brand__bn bn">{site.name_bn}</span>}
            </span>
          </Link>
          <nav className="nav" aria-label="Main">
            {main.map((i) => (
              <Link key={i.href} href={i.href} aria-current={isActive(i.href) ? "page" : undefined}>
                {i.label}
              </Link>
            ))}
          </nav>
          <Link href="/admission" className="btn btn--gold header__cta">
            Admission <Arrow className="arr" />
          </Link>
          <button ref={btn} className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
            Menu
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      <div id="mobile-menu" className="mobile-menu" data-open={open} aria-hidden={!open} inert={!open ? true : undefined}>
        <div className="wrap mobile-menu__top">
          <span className="brand__name" style={{ color: "#fff" }}>
            {site.name}
          </span>
          <button className="mobile-menu__close" onClick={() => setOpen(false)} aria-label="Close menu">
            <Close />
          </button>
        </div>
        <div className="wrap" style={{ flex: 1 }}>
          <ul>
            {items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} aria-current={isActive(i.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                  {i.label}
                  <Arrow width={20} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__foot">
            {site.phone && (
              <a href={`tel:${site.phone}`}>
                Call the office: {site.phone}
              </a>
            )}
            {site.address && <span style={{ whiteSpace: "pre-line" }}>{site.address}</span>}
          </div>
        </div>
      </div>
    </>
  );
}
