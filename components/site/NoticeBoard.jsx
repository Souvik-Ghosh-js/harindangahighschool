"use client";

import { useMemo, useState, useEffect } from "react";
import NoticeRow from "./NoticeRow";
import { Search } from "../Icons";

const PAGE = 20;

/* Instant search + category filter, entirely in the browser so the page
   itself stays static and fast. */
export default function NoticeBoard({ notices, categories }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [limit, setLimit] = useState(PAGE);
  const today = new Date().toISOString().slice(0, 10);

  // A link like /notices?category=Result pre-selects that filter after load.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("category");
    if (c) setCat(c);
  }, []);
  useEffect(() => setLimit(PAGE), [q, cat]);

  const list = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return notices.filter((n) => {
      if (cat !== "All" && n.category !== cat) return false;
      const hay = `${n.title} ${n.category} ${n.summary || ""} ${n.date}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [notices, q, cat]);

  return (
    <>
      <div className="search">
        <Search />
        <label htmlFor="notice-q" className="sr-only">
          Search notices
        </label>
        <input id="notice-q" type="search" placeholder="Search notices…" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      </div>
      <div className="filters" role="group" aria-label="Filter by category">
        {["All", ...categories].map((c) => (
          <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="muted" aria-live="polite" style={{ fontSize: ".85rem" }}>
        {list.length} notice{list.length === 1 ? "" : "s"}
      </p>
      {list.length ? (
        <ul className="notice-list">
          {list.slice(0, limit).map((n) => (
            <NoticeRow key={n.id} n={n} today={today} />
          ))}
        </ul>
      ) : (
        <p className="empty">No notices match your search.</p>
      )}
      {list.length > limit && (
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button className="btn btn--ghost-dark" onClick={() => setLimit((l) => l + PAGE)}>
            Show more notices
          </button>
        </div>
      )}
    </>
  );
}
