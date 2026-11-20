"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { useMe, NAV } from "@/components/admin/Shell";
import { Icon } from "@/components/admin/icons";

const ACTION = { create: "added", update: "updated", archive: "archived", delete: "deleted", upload: "uploaded", reorder: "reordered", password: "changed password" };

function ago(at) {
  const d = new Date(at.replace(" ", "T") + "Z");
  const m = Math.round((Date.now() - d) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function Dashboard() {
  const me = useMe();
  const [s, setS] = useState(null);
  useEffect(() => {
    api("/api/admin/stats").then(setS, () => {});
  }, []);
  const c = s?.counts || {};
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const counts = { "/admin/notices": `${c.notices ?? "…"} on website`, "/admin/events": `${c.upcoming ?? "…"} upcoming`, "/admin/teachers": `${c.teachers ?? "…"} teachers`, "/admin/albums": `${c.albums ?? "…"} albums`, "/admin/downloads": `${c.downloads ?? "…"} files` };

  return (
    <div className="adm-page">
      <div className="adm-head">
        <div>
          <h1>
            {greet}
            {me?.name && me.name !== "Super Admin" ? `, ${me.name.split(" ")[0]}` : ""}
          </h1>
          <p>What would you like to do today? · আজ কী করতে চান?</p>
        </div>
      </div>

      <div className="a-tiles" style={{ marginBottom: 28 }}>
        <Link href="/admin/notices/new" className="a-tile a-tile--primary">
          <span className="a-tile__icon">
            <Icon name="plus" />
          </span>
          <b>Add a notice</b>
          <span className="adm-bn" style={{ color: "rgba(255,255,255,.7)" }}>নতুন নোটিস</span>
        </Link>
        <Link href="/admin/events/new" className="a-tile a-tile--primary">
          <span className="a-tile__icon">
            <Icon name="plus" />
          </span>
          <b>Add an event</b>
          <span className="adm-bn" style={{ color: "rgba(255,255,255,.7)" }}>নতুন অনুষ্ঠান</span>
        </Link>
        <Link href="/admin/albums/new" className="a-tile a-tile--primary">
          <span className="a-tile__icon">
            <Icon name="photo" />
          </span>
          <b>Add photos</b>
          <span className="adm-bn" style={{ color: "rgba(255,255,255,.7)" }}>ছবি যোগ করুন</span>
        </Link>
      </div>

      <h2 style={{ marginBottom: 12 }}>Manage the website</h2>
      <div className="a-tiles">
        {NAV.slice(1).map((n) => (
          <Link key={n.href} href={n.href} className="a-tile">
            <span className="a-tile__icon">
              <Icon name={n.icon} />
            </span>
            <b>{n.label}</b>
            <span className="adm-bn">{n.bn}</span>
            {counts[n.href] && <span className="a-tile__n">{counts[n.href]}</span>}
          </Link>
        ))}
      </div>

      {c.drafts > 0 && (
        <div className="a-alert" style={{ marginTop: 24 }}>
          You have {c.drafts} draft{c.drafts > 1 ? "s" : ""} that {c.drafts > 1 ? "are" : "is"} not on the website yet.
        </div>
      )}

      {s?.recent?.length > 0 && (
        <div className="a-card" style={{ marginTop: 28 }}>
          <h2 style={{ marginBottom: 10 }}>Recent changes</h2>
          <table className="a-table">
            <tbody>
              {s.recent.map((r, i) => (
                <tr key={i}>
                  <td>
                    <b>{r.summary || r.entity}</b>
                    <br />
                    <small className="a-help">
                      {r.entity} {ACTION[r.action] || r.action} by {r.admin}
                    </small>
                  </td>
                  <td style={{ whiteSpace: "nowrap", textAlign: "right" }} className="a-help">
                    {ago(r.at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
