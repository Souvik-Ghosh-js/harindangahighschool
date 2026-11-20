"use client";

import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { useUI, Loading } from "@/components/admin/ui";

export default function ActivityPage() {
  const { toast } = useUI();
  const [items, setItems] = useState(null);
  useEffect(() => {
    api("/api/admin/activity").then((d) => setItems(d.items), (e) => toast(e.message, "error"));
  }, [toast]);
  return (
    <div className="adm-page">
      <div className="adm-head">
        <div>
          <h1>Activity log</h1>
          <p>Every sign-in and change made in the admin panel (latest 300).</p>
        </div>
      </div>
      {!items ? (
        <Loading />
      ) : (
        <div className="a-card" style={{ overflowX: "auto" }}>
          <table className="a-table">
            <thead>
              <tr>
                <th>When (UTC)</th>
                <th>Who</th>
                <th>What</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{r.at}</td>
                  <td>{r.admin}</td>
                  <td>
                    <b>{r.action}</b> {r.entity} {r.summary && `— ${r.summary}`}
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
