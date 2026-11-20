"use client";

/* ============================================================
   Form fields for the admin panel. One component renders any field
   definition from lib/blocks.js or lib/entities.js, so every section
   of the site gets the same simple, consistent editing experience.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/media-url";
import { uploadAny } from "./compress";
import { api } from "./api";
import { useUI } from "./ui";
import { Icon } from "./icons";

function Label({ f, htmlFor }) {
  return (
    <label className="a-label" htmlFor={htmlFor}>
      {f.label}
      {f.required && <span className="req"> *</span>}
      {f.bn && <span className="adm-bn"> · {f.bn}</span>}
    </label>
  );
}

function Count({ value, max }) {
  if (!max) return null;
  const n = String(value || "").length;
  if (n < max * 0.7) return null;
  return <div className={`a-count${n > max ? " a-count--over" : ""}`}>{n} / {max}</div>;
}

export function today() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function emptyValue(f) {
  if (f.default === "today") return today();
  if (f.default !== undefined) return f.default;
  if (f.type === "list" || f.type === "photos" || f.type === "departments") return [];
  if (f.type === "toggle") return false;
  if (["image", "file", "date", "number"].includes(f.type)) return null;
  return "";
}

let uid = 0;

export function Field({ f, value, onChange, idPrefix = "" }) {
  const id = useRef(`f-${idPrefix}${f.name}-${++uid}`).current;
  switch (f.type) {
    case "text":
    case "url":
      return (
        <div className="a-field">
          <Label f={f} htmlFor={id} />
          <input
            id={id}
            className="a-input"
            type={f.type === "url" ? "text" : "text"}
            inputMode={f.type === "url" ? "url" : undefined}
            value={value ?? ""}
            maxLength={f.max ? f.max + 20 : undefined}
            onChange={(e) => onChange(e.target.value)}
            placeholder={f.type === "url" ? "/page or https://…" : ""}
          />
          {f.help && <span className="a-help">{f.help}</span>}
          <Count value={value} max={f.max} />
        </div>
      );
    case "textarea":
      return (
        <div className="a-field">
          <Label f={f} htmlFor={id} />
          <textarea id={id} className="a-textarea" rows={f.rows || 4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
          {f.help && <span className="a-help">{f.help}</span>}
          <Count value={value} max={f.max} />
        </div>
      );
    case "number":
      return (
        <div className="a-field">
          <Label f={f} htmlFor={id} />
          <input id={id} className="a-input" type="number" inputMode="numeric" value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} />
          {f.help && <span className="a-help">{f.help}</span>}
        </div>
      );
    case "date":
      return (
        <div className="a-field">
          <Label f={f} htmlFor={id} />
          <div style={{ display: "flex", gap: 8 }}>
            <input id={id} className="a-input" type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} style={{ maxWidth: 260 }} />
            {!f.required && value && (
              <button type="button" className="a-btn a-btn--sm a-btn--ghost" onClick={() => onChange(null)}>
                Clear
              </button>
            )}
          </div>
          {f.help && <span className="a-help">{f.help}</span>}
        </div>
      );
    case "toggle":
      return (
        <label className="a-toggle" htmlFor={id}>
          <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span className="a-switch" aria-hidden="true" />
          <span className="a-toggle__text">
            <b>
              {f.label}
              {f.bn && <span className="adm-bn"> · {f.bn}</span>}
            </b>
            <small>{value ? "Yes" : "No"}</small>
          </span>
        </label>
      );
    case "select":
      return (
        <div className="a-field">
          <Label f={f} htmlFor={id} />
          <select id={id} className="a-select" value={value ?? f.default ?? ""} onChange={(e) => onChange(e.target.value)}>
            {(f.options || []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {f.help && <span className="a-help">{f.help}</span>}
        </div>
      );
    case "image":
      return <ImageField f={f} id={id} value={value} onChange={onChange} />;
    case "file":
      return <FileField f={f} id={id} value={value} onChange={onChange} />;
    case "list":
      return <ListField f={f} value={value} onChange={onChange} />;
    case "photos":
      return <PhotosField f={f} value={value} onChange={onChange} />;
    case "departments":
      return <DepartmentsField f={f} value={value} onChange={onChange} />;
    default:
      return null;
  }
}

/* ---------- Upload helpers ---------- */
function useUpload() {
  const { toast } = useUI();
  const [progress, setProgress] = useState(null);
  const run = async (file, opts) => {
    setProgress(0.02);
    try {
      const r = await uploadAny(file, opts, (p) => setProgress(Math.max(0.05, p)));
      return r;
    } catch (e) {
      toast(e.message, "error");
      return null;
    } finally {
      setProgress(null);
    }
  };
  return { progress, run };
}

function Drop({ id, accept, onFiles, multiple, title, hint }) {
  const [over, setOver] = useState(false);
  return (
    <div
      className={`a-drop${over ? " a-drop--over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (e.dataTransfer.files?.length) onFiles([...e.dataTransfer.files]);
      }}
    >
      <Icon name="upload" />
      <b>{title}</b>
      <span>{hint}</span>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files?.length) onFiles([...e.target.files]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Progress({ value }) {
  if (value == null) return null;
  return (
    <div>
      <div className="a-progress" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
      <span className="a-help">Uploading… {Math.round(value * 100)}%</span>
    </div>
  );
}

function ImageField({ f, id, value, onChange }) {
  const { progress, run } = useUpload();
  const pick = async (files) => {
    const r = await run(files[0], { keepTransparent: f.keepTransparent });
    if (r?.id) onChange(r.id);
  };
  return (
    <div className="a-field">
      <Label f={f} htmlFor={id} />
      <div className="a-upload">
        {value ? (
          <>
            <div className="a-preview" style={{ aspectRatio: f.ratio || "4/3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(value)} alt="" style={f.keepTransparent ? { objectFit: "contain" } : undefined} />
            </div>
            <div className="a-preview__bar">
              <label className="a-btn a-btn--sm" style={{ position: "relative", overflow: "hidden" }}>
                <Icon name="refresh" /> Change photo
                <input type="file" accept="image/*" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} onChange={(e) => e.target.files?.[0] && pick([e.target.files[0]])} />
              </label>
              <button type="button" className="a-btn a-btn--sm a-btn--danger" onClick={() => onChange(null)}>
                <Icon name="trash" /> Remove
              </button>
            </div>
          </>
        ) : (
          progress == null && <Drop id={id} accept="image/*" onFiles={pick} title="Tap to choose a photo" hint="or drag it here · from camera or gallery" />
        )}
        <Progress value={progress} />
      </div>
      {f.help && <span className="a-help">{f.help}</span>}
    </div>
  );
}

function FileField({ f, id, value, onChange }) {
  const { progress, run } = useUpload();
  const [meta, setMeta] = useState(null);
  const pick = async (files) => {
    const r = await run(files[0]);
    if (r?.id) {
      setMeta(r);
      onChange(r.id);
    }
  };
  return (
    <div className="a-field">
      <Label f={f} htmlFor={id} />
      {value ? (
        <div className="a-file">
          <Icon name="file" />
          <div>
            <b>{meta?.name || "Attached file"}</b>
            <a className="a-help" href={mediaUrl(value)} target="_blank" rel="noopener noreferrer">
              Open to check ↗
            </a>
          </div>
          <button type="button" className="a-btn a-btn--sm a-btn--danger" onClick={() => onChange(null)}>
            Remove
          </button>
        </div>
      ) : (
        progress == null && <Drop id={id} accept="application/pdf,image/*" onFiles={pick} title="Tap to choose a PDF or photo" hint="Maximum 5 MB" />
      )}
      <Progress value={progress} />
      {f.help && <span className="a-help">{f.help}</span>}
    </div>
  );
}

/* Repeating groups (milestones, committee members, menu links…). */
function ListField({ f, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState(-1);
  const { confirm } = useUI();
  const set = (i, item) => onChange(items.map((x, j) => (j === i ? item : x)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(open === i ? j : open);
  };
  const add = () => {
    const blank = Object.fromEntries(f.fields.map((sf) => [sf.name, emptyValue(sf)]));
    onChange([...items, blank]);
    setOpen(items.length);
  };
  const remove = async (i) => {
    if (await confirm({ title: "Remove this item?", message: "It will be removed when you press Save.", ok: "Remove", danger: true })) {
      onChange(items.filter((_, j) => j !== i));
      setOpen(-1);
    }
  };
  const title = (it, i) => {
    const t = it?.[f.itemLabel] ?? it?.title ?? it?.label ?? it?.name;
    return t ? String(t) : `Item ${i + 1}`;
  };
  return (
    <div className="a-field">
      <span className="a-label">
        {f.label}
        {f.bn && <span className="adm-bn"> · {f.bn}</span>}
      </span>
      <div className="a-items">
        {items.map((it, i) => (
          <div className="a-item" key={i}>
            <div className="a-item__head">
              <button type="button" className="a-item__title" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                {open === i ? "▾" : "▸"} {title(it, i)}
              </button>
              <button type="button" className="a-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                <Icon name="up" />
              </button>
              <button type="button" className="a-icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                <Icon name="down" />
              </button>
              <button type="button" className="a-icon-btn" onClick={() => remove(i)} aria-label="Remove">
                <Icon name="trash" />
              </button>
            </div>
            {open === i && (
              <div className="a-item__body">
                {f.fields.map((sf) => (
                  <Field key={sf.name} f={sf} idPrefix={`${f.name}${i}`} value={it?.[sf.name]} onChange={(v) => set(i, { ...it, [sf.name]: v })} />
                ))}
              </div>
            )}
          </div>
        ))}
        {(!f.max || items.length < f.max) && (
          <button type="button" className="a-btn" onClick={add} style={{ justifySelf: "start" }}>
            <Icon name="plus" /> Add {f.label.toLowerCase().replace(/s$/, "")}
          </button>
        )}
      </div>
    </div>
  );
}

/* Many photos at once, with captions and ordering. */
function PhotosField({ f, value, onChange }) {
  const photos = Array.isArray(value) ? value : [];
  const latest = useRef(photos);
  latest.current = photos;
  const { toast } = useUI();
  const [busy, setBusy] = useState(null);

  const add = async (files) => {
    const room = (f.max || 60) - latest.current.length;
    const list = files.filter((x) => x.type.startsWith("image/")).slice(0, room);
    if (files.length > room) toast(`Only ${f.max} photos are allowed here. Extra photos were skipped.`, "error");
    for (let i = 0; i < list.length; i++) {
      setBusy({ done: i, total: list.length });
      try {
        const r = await uploadAny(list[i]);
        latest.current = [...latest.current, { media_id: r.id, caption: "" }];
        onChange(latest.current);
      } catch (e) {
        toast(`${list[i].name}: ${e.message}`, "error");
      }
    }
    setBusy(null);
    if (list.length) toast(`${list.length} photo${list.length > 1 ? "s" : ""} added. Press Save to publish.`);
  };
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= photos.length) return;
    const n = photos.slice();
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div className="a-field">
      <span className="a-label">
        {f.label} ({photos.length}
        {f.max ? ` of ${f.max}` : ""}){f.bn && <span className="adm-bn"> · {f.bn}</span>}
      </span>
      {photos.length > 0 && (
        <div className="a-photos">
          {photos.map((p, i) => (
            <div className="a-photo" key={p.media_id + i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(p.media_id)} alt="" loading="lazy" />
              <input value={p.caption} placeholder="Caption (optional)" maxLength={160} onChange={(e) => onChange(photos.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))} aria-label={`Caption for photo ${i + 1}`} />
              <div className="a-photo__bar">
                <span style={{ display: "flex", gap: 4 }}>
                  <button type="button" className="a-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">
                    <Icon name="left" />
                  </button>
                  <button type="button" className="a-icon-btn" onClick={() => move(i, 1)} disabled={i === photos.length - 1} aria-label="Move later">
                    <Icon name="right" />
                  </button>
                </span>
                <button type="button" className="a-icon-btn" onClick={() => onChange(photos.filter((_, j) => j !== i))} aria-label="Remove photo">
                  <Icon name="trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {busy ? (
        <div className="a-alert a-alert--info">
          Uploading photo {busy.done + 1} of {busy.total}… please keep this page open.
        </div>
      ) : (
        (!f.max || photos.length < f.max) && <Drop accept="image/*" multiple onFiles={add} title="Tap to add photos" hint="You can choose many photos at once" />
      )}
    </div>
  );
}

function DepartmentsField({ f, value, onChange }) {
  const [depts, setDepts] = useState(null);
  const sel = Array.isArray(value) ? value : [];
  useEffect(() => {
    api("/api/admin/e/departments").then((d) => setDepts(d.items.filter((x) => x.status !== "archived")), () => setDepts([]));
  }, []);
  return (
    <fieldset className="a-field" style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="a-label" style={{ marginBottom: 6 }}>
        {f.label}
        {f.bn && <span className="adm-bn"> · {f.bn}</span>}
      </legend>
      {!depts ? (
        <span className="a-help">Loading departments…</span>
      ) : (
        <div className="a-checks">
          {depts.map((d) => (
            <label className="a-check" key={d.id}>
              <input type="checkbox" checked={sel.includes(d.id)} onChange={(e) => onChange(e.target.checked ? [...sel, d.id] : sel.filter((x) => x !== d.id))} />
              {d.name}
            </label>
          ))}
        </div>
      )}
      <span className="a-help">Choose one or more. Add new departments under Teachers → Departments.</span>
    </fieldset>
  );
}
