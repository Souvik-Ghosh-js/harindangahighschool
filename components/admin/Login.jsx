"use client";

import { useState } from "react";
import Link from "next/link";
import { PATHS } from "@/lib/site";

export default function Login({ configured, onSignedIn }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Sign in failed.");
        setBusy(false);
        return;
      }
      onSignedIn();
    } catch {
      setError("Could not reach the server. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <img src={`${PATHS.img}logo2.png`} alt="School crest" />
        <h1>Admin Login</h1>
        <p className="sub">Harindanga High School</p>

        {!configured && (
          <div className="alert alert-warn">
            No admin account exists yet. On the server, run{" "}
            <code>npm run set-password</code> to create one.
          </div>
        )}

        {error && <div className="alert alert-err">{error}</div>}

        <form onSubmit={submit}>
          <label className="field">
            <span>Username</span>
            <input name="username" type="text" autoComplete="username" required />
          </label>
          <label className="field">
            <span>Password</span>
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="btn btn--primary" type="submit" disabled={busy} style={{ width: "100%" }}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ fontSize: ".78rem", color: "var(--text-3)", textAlign: "center", margin: "20px 0 0" }}>
          <Link href="/">&larr; Back to the website</Link>
        </p>
      </div>
    </div>
  );
}
