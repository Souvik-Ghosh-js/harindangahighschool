"use client";

import { useEffect, useState, useCallback } from "react";
import { PATHS } from "@/lib/site";

/* Shown once per visitor. The admin panel bumps `version` on every
   save, so editing or re-enabling the notice makes it appear again
   for everyone who had already dismissed the previous one. */
const KEY = "hhs.popup.seen";

export default function Popup({ data, preview = false, onClose }) {
  const [open, setOpen] = useState(false);

  const version = String(data?.version ?? data?.updated ?? "");

  useEffect(() => {
    if (preview) {
      setOpen(true);
      return;
    }
    if (!data?.enabled) return;
    if (!data.title && !data.message) return;

    let seen = null;
    try {
      seen = localStorage.getItem(KEY);
    } catch {
      // Private mode or blocked storage — show it rather than fail.
    }
    if (seen === version) return;

    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, [data, version, preview]);

  const close = useCallback(() => {
    setOpen(false);
    if (preview) {
      onClose?.();
      return;
    }
    try {
      localStorage.setItem(KEY, version);
    } catch {
      /* ignore */
    }
  }, [version, preview, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!data) return null;
  if (!preview && !data.enabled) return null;

  return (
    <div
      className={`popup-mask${open ? " on" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={data.title || "Notice"}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      style={open ? undefined : { pointerEvents: "none" }}
    >
      <div className="popup">
        <button className="popup-x" aria-label="Close" onClick={close}>
          &times;
        </button>

        {data.image ? (
          <img className="popup-img" src={`${PATHS.img}${data.image}`} alt="" />
        ) : null}

        <div className="popup-body">
          <span className="popup-tag">{preview ? "Preview" : "Notice"}</span>
          <h3>{data.title}</h3>
          {data.message ? (
            <p>
              {String(data.message)
                .split("\n")
                .map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
            </p>
          ) : null}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {data.linkText && data.linkUrl ? (
              <a className="btn btn--primary" href={data.linkUrl} onClick={close}>
                {data.linkText}
              </a>
            ) : null}
            <button className="btn btn--outline" onClick={close}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
