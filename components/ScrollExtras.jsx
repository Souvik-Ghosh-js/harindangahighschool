"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/* Scroll progress bar, back-to-top button, and the reveal-on-scroll
   observer. Re-runs on navigation so newly rendered sections animate. */
export default function ScrollExtras() {
  const pathname = usePathname();
  const [pct, setPct] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sel = ".reveal:not([data-rv]), .reveal-l:not([data-rv]), .reveal-r:not([data-rv]), .reveal-s:not([data-rv])";
    const els = Array.from(document.querySelectorAll(sel));
    if (!els.length) return;
    els.forEach((e) => e.setAttribute("data-rv", "1"));

    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, i) => {
          if (en.isIntersecting) {
            setTimeout(() => en.target.classList.add("in"), (i % 5) * 80);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px" }
    );
    els.forEach((e) => io.observe(e));

    // Safety net: a stalled observer must never leave content invisible.
    const t = setTimeout(() => {
      els.forEach((e) => e.classList.add("in"));
    }, 2500);

    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);

  return (
    <>
      <div id="scroll-progress" style={{ width: `${pct}%` }} />
      <button
        id="to-top"
        className={showTop ? "on" : ""}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        &uarr;
      </button>
    </>
  );
}
