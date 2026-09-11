"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/site";
import FileUpload from "./FileUpload";

const blank = { title: "", category: "General", date: "", file: "" };

export default function NoticesTab({ data, save }) {
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null); // index into data.notices
  const [busy, setBusy] = useState(false);

  const notices = data.notices || [];

  // Display newest first while remembering each row's real array index,
  // so editing or deleting always targets the right record.
  const rows = notices
    .map((n, i) => ({ n, i }))
    .sort((a, b) => String(b.n.date).localeCompare(String(a.n.date)));

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function reset() {
    setForm(blank);
    setEditing(null);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.file.trim()) return;

    const next = [...notices];
    const rec = {
      title: form.title.trim(),
      category: form.category,
      date: form.date,
      file: form.file.trim(),
    };

    if (editing === null) next.unshift(rec);
    else next[editing] = rec;

    setBusy(true);
    const ok = await save("notices", { ...data, notices: next });
    setBusy(false);
    if (ok) reset();
  }

  async function remove(index) {
    const n = notices[index];
    if (!confirm(`Delete this notice?\n\n${n.title}`)) return;
    const next = notices.filter((_, i) => i !== index);
    await save("notices", { ...data, notices: next });
    if (editing === index) reset();
  }

  function edit(index) {
    const n = notices[index];
    setForm({
      title: n.title || "",
      category: n.category || "General",
      date: n.date || "",
      file: n.file || "",
    });
    setEditing(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="admin-card">
        <h2>{editing === null ? "Add a notice" : "Edit notice"}</h2>
        <p className="hint">
          Upload the PDF or image and it is stored on the server automatically — you do not need
          to touch any folders.
        </p>

        <form onSubmit={submit}>
          <label className="field">
            <span>Notice title</span>
            <input
              type="text"
              required
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Summer Vacation Notice"
            />
          </label>

          <div className="form-2">
            <label className="field">
              <span>Category</span>
              <select value={form.category} onChange={set("category")}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Date</span>
              <input type="date" required value={form.date} onChange={set("date")} />
            </label>
          </div>

          <label className="field">
            <span>Document</span>
            <input
              type="text"
              required
              value={form.file}
              onChange={set("file")}
              placeholder="Upload a file, or type an existing file name"
            />
          </label>
          <div style={{ marginBottom: 20 }}>
            <FileUpload
              kind="doc"
              label="Upload PDF or image"
              onUploaded={(name) => setForm((f) => ({ ...f, file: name }))}
            />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn--primary" type="submit" disabled={busy}>
              {busy ? "Saving…" : editing === null ? "Add notice" : "Update notice"}
            </button>
            {editing !== null && (
              <button className="btn btn--outline" type="button" onClick={reset}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>All notices ({notices.length})</h2>
        <p className="hint">Newest first. These appear on the home page and the Notices page.</p>

        {rows.length ? (
          rows.map(({ n, i }) => (
            <div className="row-item" key={`${n.file}-${i}`}>
              <div className="meta">
                <b>{n.title}</b>
                <small>
                  {n.date} &middot; {n.category} &middot; {n.file}
                </small>
              </div>
              <div className="row-acts">
                <button className="mini" onClick={() => edit(i)}>
                  Edit
                </button>
                <button className="mini danger" onClick={() => remove(i)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="hint" style={{ margin: 0 }}>No notices yet.</p>
        )}
      </div>
    </>
  );
}
