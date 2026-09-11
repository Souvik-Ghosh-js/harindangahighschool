"use client";

import { useState } from "react";
import { PATHS } from "@/lib/site";
import FileUpload from "./FileUpload";

export default function GalleryTab({ data, save }) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const albums = data.albums || [];

  async function addAlbum(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;

    const id =
      t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `album-${Date.now()}`;

    setBusy(true);
    const ok = await save("gallery", {
      ...data,
      albums: [...albums, { id, title: t, cover: "", photos: [] }],
    });
    setBusy(false);
    if (ok) setTitle("");
  }

  async function removeAlbum(ai) {
    if (!confirm(`Delete this whole album?\n\n${albums[ai].title}`)) return;
    await save("gallery", { ...data, albums: albums.filter((_, i) => i !== ai) });
  }

  async function addPhoto(ai, file, caption) {
    const next = albums.map((al, i) =>
      i === ai
        ? {
            ...al,
            cover: al.cover || file,
            photos: [...al.photos, { file, caption: caption.trim() }],
          }
        : al
    );
    await save("gallery", { ...data, albums: next });
  }

  async function removePhoto(ai, pi) {
    const next = albums.map((al, i) =>
      i === ai ? { ...al, photos: al.photos.filter((_, j) => j !== pi) } : al
    );
    await save("gallery", { ...data, albums: next });
  }

  return (
    <>
      <div className="admin-card">
        <h2>Create an album</h2>
        <p className="hint">
          Group photographs by event — for example &ldquo;Sports Day 2026&rdquo; or
          &ldquo;Saraswati Puja&rdquo;.
        </p>
        <form onSubmit={addAlbum} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <label className="field" style={{ flex: 1, minWidth: 220, margin: 0 }}>
            <span>Album title</span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Sports Day 2026"
            />
          </label>
          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? "Creating…" : "Create album"}
          </button>
        </form>
      </div>

      {albums.length ? (
        albums.map((al, ai) => (
          <AlbumCard
            key={al.id || al.title}
            album={al}
            onDeleteAlbum={() => removeAlbum(ai)}
            onAddPhoto={(file, caption) => addPhoto(ai, file, caption)}
            onRemovePhoto={(pi) => removePhoto(ai, pi)}
          />
        ))
      ) : (
        <div className="admin-card">
          <p className="hint" style={{ margin: 0 }}>No albums yet. Create one above.</p>
        </div>
      )}
    </>
  );
}

function AlbumCard({ album, onDeleteAlbum, onAddPhoto, onRemovePhoto }) {
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!file.trim()) return;
    setBusy(true);
    await onAddPhoto(file.trim(), caption);
    setBusy(false);
    setFile("");
    setCaption("");
  }

  return (
    <div className="admin-card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: "1.05rem", marginBottom: 3 }}>{album.title}</h3>
          <small style={{ color: "var(--text-3)" }}>
            {album.photos.length} photo{album.photos.length === 1 ? "" : "s"}
          </small>
        </div>
        <button className="mini danger" onClick={onDeleteAlbum}>
          Delete album
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {album.photos.length ? (
          album.photos.map((p, pi) => (
            <div className="row-item" key={`${p.file}-${pi}`} style={{ padding: "11px 14px" }}>
              <img
                src={`${PATHS.img}${p.file}`}
                alt=""
                style={{ width: 54, height: 40, objectFit: "cover", borderRadius: 7, flexShrink: 0 }}
              />
              <div className="meta">
                <b style={{ fontSize: ".89rem" }}>{p.file}</b>
                <small>{p.caption || "(no caption)"}</small>
              </div>
              <div className="row-acts">
                <button className="mini danger" onClick={() => onRemovePhoto(pi)}>
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="hint" style={{ margin: 0 }}>No photographs in this album.</p>
        )}
      </div>

      <form onSubmit={submit} style={{ marginTop: 14, display: "flex", gap: 9, flexWrap: "wrap", alignItems: "flex-end" }}>
        <label className="field" style={{ flex: 1, minWidth: 180, margin: 0 }}>
          <span>Photograph</span>
          <input
            type="text"
            required
            value={file}
            onChange={(e) => setFile(e.target.value)}
            placeholder="Upload, or type a file name"
          />
        </label>
        <label className="field" style={{ flex: 1.3, minWidth: 180, margin: 0 }}>
          <span>Caption</span>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Short description"
          />
        </label>
        <FileUpload kind="img" label="Upload photo" onUploaded={(name) => setFile(name)} />
        <button className="btn btn--dark" type="submit" disabled={busy} style={{ padding: "12px 20px" }}>
          {busy ? "Adding…" : "Add photo"}
        </button>
      </form>
    </div>
  );
}
