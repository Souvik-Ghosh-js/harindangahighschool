"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { useUI, Loading } from "@/components/admin/ui";
import { useMe } from "@/components/admin/Shell";
import { Icon } from "@/components/admin/icons";

export default function UsersPage() {
  const me = useMe();
  const { toast, confirm } = useUI();
  const [users, setUsers] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "editor" });
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => api("/api/admin/users").then((d) => setUsers(d.users), (e) => toast(e.message, "error")), [toast]);
  useEffect(() => {
    load();
  }, [load]);

  if (me && me.role !== "super") return <div className="adm-page"><div className="a-alert">Only the Super Admin can manage admin users.</div></div>;

  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/admin/users", { method: "POST", body: form });
      toast(`Account created for ${form.email}. Share the password with them privately.`);
      setForm({ name: "", email: "", password: "", role: "editor" });
      load();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };
  const update = async (u, body, msg) => {
    try {
      await api(`/api/admin/users/${u.id}`, { method: "PUT", body });
      toast(msg);
      load();
    } catch (e) {
      toast(e.message, "error");
    }
  };
  const reset = async (u) => {
    const p = window.prompt(`New password for ${u.email} (at least 8 characters):`);
    if (p) update(u, { password: p }, "Password changed. They have been signed out everywhere.");
  };
  const toggle = async (u) => {
    if (u.active && !(await confirm({ title: `Turn off ${u.email}?`, message: "They will not be able to sign in until you turn the account back on.", ok: "Turn off", danger: true }))) return;
    update(u, { active: !u.active }, u.active ? "Account turned off." : "Account turned on.");
  };

  return (
    <div className="adm-page">
      <div className="adm-head">
        <div>
          <h1>Admin users</h1>
          <p>People who can sign in and edit the website.</p>
        </div>
      </div>
      {!users ? (
        <Loading />
      ) : (
        <ul className="a-list" style={{ marginBottom: 28 }}>
          {users.map((u) => (
            <li className="a-row" key={u.id} style={{ flexWrap: "wrap" }}>
              <span className="a-row__main" style={{ flex: "1 1 220px" }}>
                <span className="a-thumb">{(u.name || u.email)[0].toUpperCase()}</span>
                <span style={{ minWidth: 0 }}>
                  <b>{u.name || u.email}</b>
                  <small>
                    {u.email} · {u.role === "super" ? "Super Admin" : "Editor"}
                    {u.last_login_at ? ` · last sign-in ${u.last_login_at.slice(0, 10)}` : " · never signed in"}
                  </small>
                </span>
              </span>
              <span className={`a-badge a-badge--${u.active ? "published" : "archived"}`}>{u.active ? "Active" : "Off"}</span>
              {u.id !== me?.id && (
                <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button className="a-btn a-btn--sm" onClick={() => reset(u)}>
                    <Icon name="key" /> Password
                  </button>
                  <button className="a-btn a-btn--sm" onClick={() => update(u, { role: u.role === "super" ? "editor" : "super" }, "Role changed.")}>
                    Make {u.role === "super" ? "Editor" : "Super Admin"}
                  </button>
                  <button className={`a-btn a-btn--sm${u.active ? " a-btn--danger" : ""}`} onClick={() => toggle(u)}>
                    {u.active ? "Turn off" : "Turn on"}
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      <form className="a-card a-form" onSubmit={add}>
        <h2>Add a person</h2>
        <div className="a-grid-2">
          <div className="a-field">
            <label className="a-label" htmlFor="u-name">Name</label>
            <input id="u-name" className="a-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="a-field">
            <label className="a-label" htmlFor="u-email">Email (used to sign in) <span className="req">*</span></label>
            <input id="u-email" className="a-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="a-field">
            <label className="a-label" htmlFor="u-pass">Password <span className="req">*</span></label>
            <input id="u-pass" className="a-input" type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required />
            <span className="a-help">At least 8 characters. Share it privately.</span>
          </div>
          <div className="a-field">
            <label className="a-label" htmlFor="u-role">Permission</label>
            <select id="u-role" className="a-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="editor">Editor — can edit notices, events, teachers, photos and pages</option>
              <option value="super">Super Admin — can also manage users, menu and Google settings</option>
            </select>
          </div>
        </div>
        <button className="a-btn a-btn--primary a-btn--big" disabled={busy} style={{ justifySelf: "start" }}>
          <Icon name="plus" /> {busy ? "Creating…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
