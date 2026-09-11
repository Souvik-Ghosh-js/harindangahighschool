"use client";

import { useRef, useState } from "react";

/* Uploads straight to the server and hands the stored filename back.
   `kind` is "doc" (notice PDFs) or "img" (photographs). */
export default function FileUpload({ kind, onUploaded, label = "Upload file" }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const accept =
    kind === "doc"
      ? ".pdf,.jpg,.jpeg,.png,.webp"
      : ".jpg,.jpeg,.png,.webp";

  async function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setBusy(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", kind);

    try {
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Upload failed.");
      } else {
        onUploaded(d.name);
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div>
      <button
        type="button"
        className="mini"
        onClick={() => ref.current?.click()}
        disabled={busy}
      >
        {busy ? "Uploading…" : label}
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        onChange={pick}
        style={{ display: "none" }}
      />
      {error && (
        <p style={{ color: "#A8331A", fontSize: ".82rem", margin: "8px 0 0" }}>{error}</p>
      )}
    </div>
  );
}
