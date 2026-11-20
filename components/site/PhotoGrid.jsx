"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Img from "../Img";
import { mediaUrl } from "@/lib/media-url";
import { Close, Chevron, ChevronLeft } from "../Icons";

/* Masonry photo grid with a keyboard- and swipe-friendly viewer. */
export default function PhotoGrid({ photos, media, title }) {
  const [open, setOpen] = useState(-1);
  const touch = useRef(0);
  const opener = useRef(null);
  const closeRef = useRef(null);

  const close = useCallback(() => {
    setOpen(-1);
    opener.current?.focus();
  }, []);
  const go = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (open < 0) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const k = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", k);
    };
  }, [open >= 0, go, close]); // eslint-disable-line react-hooks/exhaustive-deps

  const p = photos[open];
  const m = p ? media[p.media_id] || {} : {};
  return (
    <>
      <div className="masonry" data-stagger>
        {photos.map((ph, i) => (
          <figure key={ph.media_id + i} style={{ margin: 0 }}>
            <button
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`Open photo ${i + 1}${ph.caption ? `: ${ph.caption}` : ""}`}
            >
              <div className="media zoom">
                <Img id={ph.media_id} media={media} fill={false} sizes="(min-width:900px) 33vw, 50vw" alt={ph.caption || `${title} photo ${i + 1}`} />
              </div>
            </button>
            {ph.caption && <figcaption>{ph.caption}</figcaption>}
          </figure>
        ))}
      </div>
      {p && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} — photo viewer`}>
          <div className="lightbox__top">
            <span>
              {open + 1} / {photos.length}
            </span>
            <button ref={closeRef} className="lb-btn" onClick={close} aria-label="Close">
              <Close />
            </button>
          </div>
          <div
            className="lightbox__stage"
            onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touch.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
          >
            <button className="lb-btn lb-nav lb-prev" onClick={() => go(-1)} aria-label="Previous photo">
              <ChevronLeft />
            </button>
            <Image key={p.media_id} src={mediaUrl(p.media_id)} alt={p.caption || ""} width={m.width || 1600} height={m.height || 1200} sizes="100vw" quality={82} style={{ maxHeight: "calc(100svh - 170px)", width: "auto" }} />
            <button className="lb-btn lb-nav lb-next" onClick={() => go(1)} aria-label="Next photo">
              <Chevron />
            </button>
          </div>
          <div className="lightbox__cap">{p.caption}</div>
        </div>
      )}
    </>
  );
}
