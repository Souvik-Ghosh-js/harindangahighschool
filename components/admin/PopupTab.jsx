"use client";

import { useState } from "react";
import Popup from "@/components/Popup";
import FileUpload from "./FileUpload";

export default function PopupTab({ data, save }) {
  const [form, setForm] = useState({
    enabled: !!data.enabled,
    title: data.title || "",
    message: data.message || "",
    image: data.image || "",
    linkText: data.linkText || "",
    linkUrl: data.linkUrl || "",
  });
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    await save("popup", { ...data, ...form });
    setBusy(false);
  }

  return (
    <>
      <div className="admin-card">
        <h2>Pop-up notice</h2>
        <p className="hint">
          Shown once to each visitor. Whenever you save a change here it counts as a new
          announcement, so it appears again for everyone — including people who already dismissed
          the previous one.
        </p>

        <form onSubmit={submit}>
          <div className="switch">
            <input type="checkbox" id="pp-on" checked={form.enabled} onChange={set("enabled")} />
            <label htmlFor="pp-on">Show this pop-up on the website</label>
          </div>

          <label className="field">
            <span>Title</span>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Admission Open for Class V"
            />
          </label>

          <label className="field">
            <span>Message</span>
            <textarea
              value={form.message}
              onChange={set("message")}
              placeholder="The main text of the announcement."
            />
          </label>

          <label className="field">
            <span>Image (optional)</span>
            <input
              type="text"
              value={form.image}
              onChange={set("image")}
              placeholder="Upload, or type a file name"
            />
          </label>
          <div style={{ marginBottom: 20 }}>
            <FileUpload
              kind="img"
              label="Upload image"
              onUploaded={(name) => setForm((f) => ({ ...f, image: name }))}
            />
          </div>

          <div className="form-2">
            <label className="field">
              <span>Button text (optional)</span>
              <input
                type="text"
                value={form.linkText}
                onChange={set("linkText")}
                placeholder="e.g. View details"
              />
            </label>
            <label className="field">
              <span>Button link (optional)</span>
              <input
                type="text"
                value={form.linkUrl}
                onChange={set("linkUrl")}
                placeholder="e.g. /admission"
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn--primary" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save pop-up"}
            </button>
            <button className="btn btn--outline" type="button" onClick={() => setPreview(true)}>
              Preview
            </button>
          </div>
        </form>
      </div>

      {preview && (
        <Popup
          data={{ ...form, enabled: true, version: "preview" }}
          preview
          onClose={() => setPreview(false)}
        />
      )}
    </>
  );
}
