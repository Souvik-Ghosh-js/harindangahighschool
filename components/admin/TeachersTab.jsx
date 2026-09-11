"use client";

import { useState } from "react";

const blank = { name: "", designation: "", qualification: "", dept: "" };

export default function TeachersTab({ data, save }) {
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const teaching = data.teaching || [];

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function reset() {
    setForm(blank);
    setEditing(null);
  }

  // Keep Sl numbers contiguous after any add, remove or reorder.
  const renumber = (list) => list.map((t, i) => ({ ...t, sl: i + 1 }));

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.designation.trim()) return;

    const rec = {
      name: form.name.trim(),
      designation: form.designation.trim(),
      qualification: form.qualification.trim(),
      dept: form.dept.trim(),
    };

    const next =
      editing === null
        ? [...teaching, rec]
        : teaching.map((t, i) => (i === editing ? { ...t, ...rec } : t));

    setBusy(true);
    const ok = await save("staff", { ...data, teaching: renumber(next) });
    setBusy(false);
    if (ok) reset();
  }

  async function remove(index) {
    if (!confirm(`Remove this teacher?\n\n${teaching[index].name}`)) return;
    const next = teaching.filter((_, i) => i !== index);
    await save("staff", { ...data, teaching: renumber(next) });
    if (editing === index) reset();
  }

  async function move(index, dir) {
    const j = index + dir;
    if (j < 0 || j >= teaching.length) return;
    const next = [...teaching];
    [next[index], next[j]] = [next[j], next[index]];
    await save("staff", { ...data, teaching: renumber(next) });
  }

  function edit(index) {
    const t = teaching[index];
    setForm({
      name: t.name || "",
      designation: t.designation || "",
      qualification: t.qualification || "",
      dept: t.dept || "",
    });
    setEditing(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="admin-card">
        <h2>{editing === null ? "Add a teacher" : "Edit teacher"}</h2>
        <p className="hint">
          Appears on the Faculty page. Serial numbers are managed automatically.
        </p>

        <form onSubmit={submit}>
          <div className="form-2">
            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Ranjan Das"
              />
            </label>
            <label className="field">
              <span>Designation</span>
              <input
                type="text"
                required
                value={form.designation}
                onChange={set("designation")}
                placeholder="e.g. Assistant Teacher"
              />
            </label>
          </div>
          <div className="form-2">
            <label className="field">
              <span>Qualification</span>
              <input
                type="text"
                value={form.qualification}
                onChange={set("qualification")}
                placeholder="e.g. M.Sc. (Physics), B.Ed."
              />
            </label>
            <label className="field">
              <span>Department</span>
              <input
                type="text"
                value={form.dept}
                onChange={set("dept")}
                placeholder="e.g. Science"
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn--primary" type="submit" disabled={busy}>
              {busy ? "Saving…" : editing === null ? "Add teacher" : "Update teacher"}
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
        <h2>Teaching staff ({teaching.length})</h2>
        <p className="hint">Use the arrows to change the order shown on the Faculty page.</p>

        {teaching.length ? (
          teaching.map((s, i) => (
            <div className="row-item" key={`${s.name}-${i}`}>
              <div className="meta">
                <b>
                  {s.sl ? `${s.sl}. ` : ""}
                  {s.name}
                </b>
                <small>
                  {s.designation}
                  {s.qualification ? ` · ${s.qualification}` : ""}
                  {s.dept ? ` · ${s.dept}` : ""}
                </small>
              </div>
              <div className="row-acts">
                <button className="mini" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  &uarr;
                </button>
                <button
                  className="mini"
                  onClick={() => move(i, 1)}
                  disabled={i === teaching.length - 1}
                  aria-label="Move down"
                >
                  &darr;
                </button>
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
          <p className="hint" style={{ margin: 0 }}>No teachers listed yet.</p>
        )}
      </div>
    </>
  );
}
