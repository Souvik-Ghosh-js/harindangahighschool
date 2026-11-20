"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Img from "../Img";
import { Close } from "../Icons";

/* Shown once per visitor per version. Saving the pop-up in the admin
   bumps the version, so it re-appears for everyone. */
export default function Popup({ popup, media }) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const key = `hhs-popup-${popup.version || 0}`;

  useEffect(() => {
    if (!popup.enabled || !popup.title) return;
    let seen = false;
    try {
      seen = localStorage.getItem(key) === "1";
    } catch {}
    if (!seen) {
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, [popup.enabled, popup.title, key]);

  const close = () => {
    try {
      localStorage.setItem(key, "1");
    } catch {}
    setShow(false);
  };

  useEffect(() => {
    if (!show) return;
    ref.current?.querySelector("button")?.focus();
    const k = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;
  return (
    <div className="popup" ref={ref} role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div className="dialog__scrim" onClick={close} />
      <div className="popup__card">
        <button className="dialog__close" onClick={close} aria-label="Close">
          <Close />
        </button>
        {popup.image && (
          <div className="media ratio-169" style={{ borderRadius: 0 }}>
            <Img id={popup.image} media={media} sizes="520px" />
          </div>
        )}
        <div className="popup__body">
          <h2 id="popup-title">{popup.title}</h2>
          {popup.message && <p>{popup.message}</p>}
          {popup.link_label && popup.link_href && (
            <Link href={popup.link_href} className="btn" onClick={close}>
              {popup.link_label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
