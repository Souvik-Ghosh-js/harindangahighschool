"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PATHS, fmtDate } from "@/lib/site";

export function NoticeRow({ n }) {
  const d = fmtDate(n.date);
  return (
    <div className="notice-item" data-cat={n.category}>
      <div className="notice-date">
        <b>{d.d}</b>
        <span>
          {d.m} {String(d.y).slice(2)}
        </span>
      </div>
      <div className="notice-body">
        <a href={`${PATHS.doc}${encodeURIComponent(n.file)}`} target="_blank" rel="noopener noreferrer">
          {n.title}
        </a>
        <span className={`tag ${n.category}`}>{n.category}</span>
      </div>
    </div>
  );
}

export default function NoticeList({ notices }) {
  const params = useSearchParams();
  const initial = params.get("cat") || "All";

  const cats = useMemo(
    () => ["All", ...Array.from(new Set(notices.map((n) => n.category))).sort()],
    [notices]
  );

  const [active, setActive] = useState(cats.includes(initial) ? initial : "All");

  useEffect(() => {
    const c = params.get("cat") || "All";
    setActive(cats.includes(c) ? c : "All");
  }, [params, cats]);

  const rows = active === "All" ? notices : notices.filter((n) => n.category === active);

  return (
    <>
      <div className="sec-head reveal" style={{ marginBottom: 26 }}>
        <span className="eyebrow">Archive</span>
        <h2>
          All notices{" "}
          <span style={{ color: "var(--text-3)", fontSize: ".6em" }}>({rows.length})</span>
        </h2>
        <p className="lead">
          Filter by category to find syllabus, results, examination or admission notices.
        </p>
      </div>

      <div className="filters">
        {cats.map((c) => (
          <button
            key={c}
            className={`chip${c === active ? " on" : ""}`}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="notice-panel reveal">
        {rows.length ? (
          rows.map((n, i) => <NoticeRow key={`${n.file}-${i}`} n={n} />)
        ) : (
          <div className="empty">No notices in this category yet.</div>
        )}
      </div>
    </>
  );
}
