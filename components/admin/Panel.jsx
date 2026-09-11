"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PATHS } from "@/lib/site";
import NoticesTab from "./NoticesTab";
import TeachersTab from "./TeachersTab";
import GalleryTab from "./GalleryTab";
import PopupTab from "./PopupTab";

const TABS = [
  ["notices", "Notices"],
  ["teachers", "Teachers"],
  ["gallery", "Event Gallery"],
  ["popup", "Pop-up Notice"],
];

export default function Panel({ username, onSignedOut }) {
  const [tab, setTab] = useState("notices");
  const [data, setData] = useState({ notices: null, staff: null, gallery: null, popup: null });
  const [toast, setToast] = useState(null);

  const say = useCallback((message, kind = "ok") => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 4500);
  }, []);

  const load = useCallback(async () => {
    const keys = ["notices", "staff", "gallery", "popup"];
    const out = {};
    for (const k of keys) {
      try {
        const r = await fetch(`/api/data/${k}`, { cache: "no-store" });
        out[k] = await r.json();
      } catch {
        out[k] = null;
      }
    }
    setData(out);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* Saves go straight to the server — there is no publish step. */
  const save = useCallback(
    async (key, payload) => {
      try {
        const r = await fetch(`/api/data/${key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const d = await r.json();
        if (!r.ok) {
          say(d.error || "Could not save.", "err");
          return false;
        }
        setData((prev) => ({ ...prev, [key]: payload }));
        say("Saved. The change is live on the website now.");
        // Re-read popup so the bumped version is reflected locally.
        if (key === "popup") load();
        return true;
      } catch {
        say("Could not reach the server.", "err");
        return false;
      }
    },
    [say, load]
  );

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    onSignedOut();
  }

  const ready = data.notices && data.staff && data.gallery && data.popup;

  return (
    <div className="admin-shell">
      <div className="admin-bar">
        <div className="wrap">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={`${PATHS.img}logo2.png`} alt="" style={{ width: 34, height: 34, objectFit: "contain" }} />
            <div>
              <strong>Admin Panel</strong>
              <div className="who">Signed in as {username}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
            <Link className="mini" href="/" target="_blank" rel="noopener noreferrer">
              View site
            </Link>
            <button className="mini" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 26, paddingBottom: 60 }}>
        {toast && <div className={`alert alert-${toast.kind}`}>{toast.message}</div>}

        <div className="pub-note">
          <h3>Changes go live immediately</h3>
          <p style={{ marginBottom: 0 }}>
            Anything you save here updates the website straight away — there is no upload or
            publish step. Uploaded PDFs and photographs are stored on the server automatically.
          </p>
        </div>

        <div className="tabs">
          {TABS.map(([id, label]) => (
            <button key={id} className={`tab${tab === id ? " on" : ""}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {!ready ? (
          <div className="admin-card">
            <p className="hint" style={{ margin: 0 }}>Loading content…</p>
          </div>
        ) : (
          <>
            {tab === "notices" && <NoticesTab data={data.notices} save={save} say={say} />}
            {tab === "teachers" && <TeachersTab data={data.staff} save={save} say={say} />}
            {tab === "gallery" && <GalleryTab data={data.gallery} save={save} say={say} />}
            {tab === "popup" && <PopupTab data={data.popup} save={save} say={say} />}
          </>
        )}
      </div>
    </div>
  );
}
