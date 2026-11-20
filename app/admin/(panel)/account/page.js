"use client";

import { useState } from "react";
import { api } from "@/components/admin/api";
import { useUI } from "@/components/admin/ui";
import { useMe } from "@/components/admin/Shell";

export default function AccountPage() {
  const me = useMe();
  const { toast } = useUI();
  const [f, setF] = useState({ current: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (f.password !== f.confirm) return toast("The two new passwords do not match.", "error");
    setBusy(true);
    try {
      await api("/api/admin/account", { method: "PUT", body: { current: f.current, password: f.password } });
      toast("Password changed. Other devices have been signed out.");
      setF({ current: "", password: "", confirm: "" });
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="adm-page">
      <div className="adm-head">
        <div>
          <h1>My account</h1>
          <p>
            {me?.email} · {me?.role === "super" ? "Super Admin" : "Editor"}
          </p>
        </div>
      </div>
      <form className="a-card a-form" onSubmit={submit} style={{ maxWidth: 520 }}>
        <h2>
          Change password <span className="adm-bn">· পাসওয়ার্ড বদলান</span>
        </h2>
        {[
          ["current", "Current password", "current-password"],
          ["password", "New password (at least 8 characters)", "new-password"],
          ["confirm", "Type the new password again", "new-password"],
        ].map(([k, l, ac]) => (
          <div className="a-field" key={k}>
            <label className="a-label" htmlFor={`p-${k}`}>{l}</label>
            <input id={`p-${k}`} className="a-input" type="password" autoComplete={ac} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} required minLength={k === "current" ? 1 : 8} />
          </div>
        ))}
        <button className="a-btn a-btn--primary a-btn--big" disabled={busy} style={{ justifySelf: "start" }}>
          {busy ? "Saving…" : "Change password"}
        </button>
      </form>
    </div>
  );
}
