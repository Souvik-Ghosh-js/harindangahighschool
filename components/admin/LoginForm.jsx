"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not sign in.");
      const next = params.get("next");
      window.location.href = next && next.startsWith("/admin") ? next : "/admin";
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "No internet connection." : err.message);
      setBusy(false);
    }
  };

  return (
    <main className="a-login">
      <form className="a-login__box a-form" onSubmit={submit} noValidate>
        <div>
          <span className="adm-bn">হরিণডাঙা উচ্চ বিদ্যালয়</span>
          <h1>Staff sign in</h1>
          <p className="a-help">Website admin panel · Harindanga High School (H.S.)</p>
        </div>
        {error && (
          <div className="a-alert a-alert--err" role="alert">
            {error}
          </div>
        )}
        <div className="a-field">
          <label className="a-label" htmlFor="email">
            Email <span className="adm-bn">· ইমেল</span>
          </label>
          <input id="email" className="a-input" type="email" autoComplete="username" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </div>
        <div className="a-field">
          <label className="a-label" htmlFor="password">
            Password <span className="adm-bn">· পাসওয়ার্ড</span>
          </label>
          <div className="a-pass">
            <input id="password" className="a-input" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingRight: 80 }} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show}>
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button className="a-btn a-btn--primary a-btn--big" type="submit" disabled={busy || !email || !password}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" className="a-help" style={{ textAlign: "center" }}>
          ← Back to the website
        </a>
      </form>
    </main>
  );
}
