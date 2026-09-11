"use client";

import { useEffect, useState, useCallback } from "react";
import Login from "./Login";
import Panel from "./Panel";

export default function AdminApp() {
  const [state, setState] = useState({ loading: true, signedIn: false, configured: true, username: null });

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/session", { cache: "no-store" });
      const d = await r.json();
      setState({ loading: false, signedIn: d.signedIn, configured: d.configured, username: d.username });
    } catch {
      setState({ loading: false, signedIn: false, configured: true, username: null });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (state.loading) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <p className="sub" style={{ margin: 0 }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!state.signedIn) {
    return <Login configured={state.configured} onSignedIn={refresh} />;
  }

  return <Panel username={state.username} onSignedOut={refresh} />;
}
