"use client";

import { useEffect, useState, useCallback } from "react";
import { PATHS } from "@/lib/site";

// Repeating rhythm so albums of any size stay visually varied.
const shape = (i) => (i % 6 === 0 ? " wide" : i % 6 === 3 ? " tall" : "");

export default function GalleryGrid({ albums }) {
  const [lightbox, setLightbox] = useState(null);

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, close]);

  return (
    <>
      {albums.map((al) => (
        <section className="section" style={{ paddingTop: 0 }} key={al.id || al.title}>
          <div className="album-head reveal">
            <h2>{al.title}</h2>
            <span>
              {al.photos.length} photograph{al.photos.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="gal">
            {al.photos.map((ph, i) => (
              <figure
                className={`gal-item reveal-s${shape(i)}`}
                key={`${ph.file}-${i}`}
                onClick={() => setLightbox({ src: `${PATHS.img}${ph.file}`, alt: ph.caption || al.title })}
              >
                <img
                  src={`${PATHS.img}${ph.file}`}
                  alt={ph.caption || al.title}
                  loading="lazy"
                />
                {ph.caption ? <figcaption>{ph.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ))}

      <div
        className={`lbox${lightbox ? " on" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget || e.target.closest(".lbox-x")) close();
        }}
      >
        <button className="lbox-x" aria-label="Close">
          &times;
        </button>
        {/* Rendered only when a photo is chosen — a src-less <img>
            counts as a broken image to browsers and crawlers. */}
        {lightbox ? <img src={lightbox.src} alt={lightbox.alt} /> : null}
      </div>
    </>
  );
}
