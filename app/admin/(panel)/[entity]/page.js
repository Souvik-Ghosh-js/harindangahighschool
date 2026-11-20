"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { ENTITIES } from "@/lib/entities";
import { mediaUrl } from "@/lib/media-url";
import { api } from "@/components/admin/api";
import { useUI, Loading, StatusBadge } from "@/components/admin/ui";
import { Icon } from "@/components/admin/icons";

const FILTERS = [
  ["active", "Active"],
  ["published", "On website"],
  ["draft", "Drafts"],
  ["archived", "Archived"],
];

function fmt(d) {
  if (!d) return "";
  const x = new Date(d + "T00:00:00");
  return isNaN(x) ? d : x.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function EntityList({ params }) {
  const { entity } = use(params);
  const def = ENTITIES[entity];
  if (!def) notFound();
  const { toast } = useUI();
  const [items, setItems] = useState(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("active");
  const [kind, setKind] = useState("teaching");

  const load = useCallback(() => {
    api(`/api/admin/e/${entity}`).then((d) => setItems(d.items), (e) => toast(e.message, "error"));
  }, [entity, toast]);
  useEffect(load, [load]);

  const shown = useMemo(() => {
    if (!items) return [];
    const t = q.trim().toLowerCase();
    return items.filter((it) => {
      if (filter === "active" ? it.status === "archived" : it.status !== filter) return false;
      if (entity === "teachers" && it.kind !== kind) return false;
      return !t || String(it[def.titleField] || "").toLowerCase().includes(t);
    });
  }, [items, q, filter, kind, entity, def.titleField]);

  const canSort = def.sortable && !q && filter === "active";
  const move = async (i, d) => {
    const j = i + d;
    if (j < 0 || j >= shown.length) return;
    const ordered = shown.slice();
    [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
    // Visible rows first in their new order, then everything else unchanged.
    const next = [...ordered, ...items.filter((x) => !ordered.includes(x))];
    setItems(next);
    try {
      await api(`/api/admin/e/${entity}/reorder`, { method: "POST", body: { ids: next.map((x) => x.id) } });
      toast("Order saved");
    } catch (e) {
      toast(e.message, "error");
      load();
    }
  };

  const sub = (it) => {
    if (entity === "notices") return `${fmt(it.date)} · ${it.category}`;
    if (entity === "events") return `${fmt(it.date)}${it.venue ? ` · ${it.venue}` : ""} · ${it.photo_count || 0} photos`;
    if (entity === "teachers") return it.designation;
    if (entity === "albums") return `${it.photo_count || 0} photos${it.date ? ` · ${fmt(it.date)}` : ""}`;
    if (entity === "downloads") return it.category;
    return "";
  };

  return (
    <div className="adm-page">
      <div className="adm-head">
        <div>
          <h1>
            {def.label} <span className="adm-bn">· {def.bn}</span>
          </h1>
          <p>{items ? `${items.filter((x) => x.status === "published").length} on the website` : "Loading…"}</p>
        </div>
        <Link href={`/admin/${entity}/new`} className="a-btn a-btn--primary a-btn--big">
          <Icon name="plus" /> Add {def.singular.toLowerCase()}
        </Link>
      </div>

      <div className="a-toolbar">
        <input className="a-search" type="search" placeholder={`Search ${def.label.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <div className="a-seg" role="group" aria-label="Filter">
          {FILTERS.map(([v, l]) => (
            <button key={v} aria-pressed={filter === v} onClick={() => setFilter(v)}>
              {l}
            </button>
          ))}
        </div>
        {entity === "teachers" && (
          <div className="a-seg" role="group" aria-label="Staff type">
            <button aria-pressed={kind === "teaching"} onClick={() => setKind("teaching")}>
              Teaching
            </button>
            <button aria-pressed={kind === "office"} onClick={() => setKind("office")}>
              Office staff
            </button>
          </div>
        )}
      </div>
      {canSort && shown.length > 1 && <p className="a-help" style={{ marginBottom: 10 }}>Use the arrows to change the order shown on the website.</p>}

      {!items ? (
        <Loading />
      ) : shown.length === 0 ? (
        <div className="a-card a-empty">
          <p>Nothing here yet.</p>
          <Link href={`/admin/${entity}/new`} className="a-btn a-btn--primary">
            <Icon name="plus" /> Add the first one
          </Link>
        </div>
      ) : (
        <ul className="a-list">
          {shown.map((it, i) => (
            <li className="a-row" key={it.id}>
              <Link href={`/admin/${entity}/${it.id}`} className="a-row__main">
                <span className="a-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {it.thumb ? <img src={mediaUrl(it.thumb)} alt="" loading="lazy" /> : <Icon name={entity === "notices" || entity === "downloads" ? "file" : "photo"} width={22} />}
                </span>
                <span style={{ minWidth: 0 }}>
                  <b>{it[def.titleField]}</b>
                  <small>{sub(it)}</small>
                </span>
              </Link>
              <StatusBadge status={it.status} />
              {canSort && (
                <span className="a-row__order">
                  <button className="a-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    <Icon name="up" />
                  </button>
                  <button className="a-icon-btn" onClick={() => move(i, 1)} disabled={i === shown.length - 1} aria-label="Move down">
                    <Icon name="down" />
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
