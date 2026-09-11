"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({ to, suffix = "", duration = 1100 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion: show the final number immediately.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    if (!("IntersectionObserver" in window)) {
      setN(to);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting || done.current) return;
          done.current = true;
          io.unobserve(en.target);

          const start = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - start) / duration);
            // Ease-out so the count decelerates into place.
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}
