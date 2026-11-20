"use client";

import { useEffect, useMemo, useState } from "react";
import { Field, emptyValue } from "./Fields";

/* Groups basic fields first and tucks "advanced" (Google/SEO) fields
   into a collapsible section so the form stays simple. */
export function FormFields({ fields, data, setData }) {
  const basic = fields.filter((f) => !f.advanced && !f.name.startsWith("seo_"));
  const adv = fields.filter((f) => f.advanced || f.name.startsWith("seo_"));
  const set = (name) => (v) => setData((d) => ({ ...d, [name]: v }));
  return (
    <div className="a-form">
      <div className="a-card a-section">
        {basic.map((f) => (
          <Field key={f.name} f={f} value={data[f.name]} onChange={set(f.name)} />
        ))}
      </div>
      {adv.length > 0 && (
        <details className="a-card a-details">
          <summary>Google search settings (optional)</summary>
          <div className="a-section" style={{ marginTop: 14 }}>
            <p className="a-help">The website fills these in automatically. Only change them if you want a different title or description in Google.</p>
            {adv.map((f) => (
              <Field key={f.name} f={f} value={data[f.name]} onChange={set(f.name)} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

export function initialData(fields, src = {}) {
  const o = {};
  for (const f of fields) o[f.name] = src[f.name] !== undefined && src[f.name] !== null ? src[f.name] : emptyValue(f);
  return o;
}

/* Tracks unsaved changes and warns before leaving the page. */
export function useDirty(data, saved) {
  const dirty = useMemo(() => saved != null && JSON.stringify(data) !== JSON.stringify(saved), [data, saved]);
  useEffect(() => {
    if (!dirty) return;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
  return dirty;
}

export function SaveBar({ dirty, saving, onSave, children, label = "Save" }) {
  return (
    <div className="a-savebar">
      <span className={`a-savebar__status${dirty ? " a-savebar__status--dirty" : ""}`}>{saving ? "Saving…" : dirty ? "You have unsaved changes" : "All changes saved"}</span>
      <div className="a-savebar__actions">
        {children}
        {onSave && (
          <button className="a-btn a-btn--go a-btn--big" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : label}
          </button>
        )}
      </div>
    </div>
  );
}

export function okToLeave(dirty) {
  return !dirty || window.confirm("You have unsaved changes. Leave without saving?");
}
