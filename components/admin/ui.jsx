"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const Ctx = createContext(null);

/* Toasts + confirmation dialogs, available anywhere in the admin. */
export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirm] = useState(null);

  const toast = useCallback((message, type = "ok") => {
    const id = Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), type === "error" ? 6000 : 3200);
  }, []);

  const confirm = useCallback(
    (opts) => new Promise((resolve) => setConfirm({ ...opts, resolve })),
    []
  );

  return (
    <Ctx.Provider value={{ toast, confirm }}>
      {children}
      <div className="a-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`a-toast a-toast--${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
      {confirmState && <ConfirmDialog {...confirmState} onClose={(v) => { confirmState.resolve(v); setConfirm(null); }} />}
    </Ctx.Provider>
  );
}

function ConfirmDialog({ title, message, ok = "Yes", cancel = "Cancel", danger, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    const k = (e) => e.key === "Escape" && onClose(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="a-modal" role="alertdialog" aria-modal="true" aria-labelledby="cf-t" onClick={(e) => e.target === e.currentTarget && onClose(false)}>
      <div className="a-modal__box">
        <h2 id="cf-t">{title}</h2>
        {message && <p>{message}</p>}
        <div className="a-modal__actions">
          <button className="a-btn" onClick={() => onClose(false)}>
            {cancel}
          </button>
          <button ref={ref} className={`a-btn ${danger ? "a-btn--danger" : "a-btn--primary"}`} onClick={() => onClose(true)}>
            {ok}
          </button>
        </div>
      </div>
    </div>
  );
}

export const useUI = () => useContext(Ctx);

export function Loading({ label = "Loading…" }) {
  return (
    <div className="a-loading">
      <div className="a-spin" />
      <p style={{ marginTop: 12 }}>{label}</p>
    </div>
  );
}

export function StatusBadge({ status }) {
  const label = { published: "On website", draft: "Draft", archived: "Archived" }[status] || status;
  return <span className={`a-badge a-badge--${status}`}>{label}</span>;
}
