"use client";

/* Scroll reveals without any animation library.
   - Native browser scrolling (nothing is hijacked or smoothed).
   - A single IntersectionObserver adds the class "in" once an element
     enters the screen; CSS (globals.css) does the fade-and-rise.
   - After the entrance finishes, the reveal attributes are removed so the
     element is back to normal and hover effects respond instantly.
   - Numbers marked data-count tick up once.
   If anything fails, a safety class shows all content. */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.classList.remove("reveal-all");
    if (reduced() || !("IntersectionObserver" in window)) {
      document.documentElement.classList.add("reveal-all");
      return;
    }
    const root = document.getElementById("main");
    if (!root) return;
    const timers = [];

    const finish = (el, attr, delay) => {
      timers.push(
        setTimeout(() => {
          el.removeAttribute(attr);
          el.style.removeProperty("--i");
          el.style.removeProperty("--d");
        }, delay + 1100)
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target;
          io.unobserve(el);
          el.classList.add("in");
          const delay = Number(el.dataset.delay || 0) * 1000 + (el.hasAttribute("data-stagger") ? el.children.length * 70 : 0);
          if (el.hasAttribute("data-stagger")) finish(el, "data-stagger", delay);
          else if (el.hasAttribute("data-clip")) finish(el, "data-clip", delay);
          else finish(el, "data-reveal", delay);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    root.querySelectorAll("[data-reveal], [data-clip], [data-stagger]").forEach((el) => {
      if (el.hasAttribute("data-stagger")) [...el.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, 12)));
      if (el.dataset.delay) el.style.setProperty("--d", el.dataset.delay);
      io.observe(el);
    });

    const counters = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target;
          counters.unobserve(el);
          const end = Number(el.dataset.count);
          if (!Number.isFinite(end)) continue;
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / 1400);
            el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN");
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    root.querySelectorAll("[data-count]").forEach((el) => {
      el.textContent = "0";
      counters.observe(el);
    });

    window.__motionReady = true;
    return () => {
      io.disconnect();
      counters.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
