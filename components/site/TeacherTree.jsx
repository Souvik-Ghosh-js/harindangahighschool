"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TeacherFace from "./TeacherFace";
import Img from "../Img";
import { Plus, Close, Arrow } from "../Icons";
import { initials } from "@/lib/format";

/* Department → teacher cards → profile dialog. Departments expand with a
   pure-CSS height transition (grid-template-rows), so there is no layout jump. */
function Department({ d, media, onOpen, initiallyOpen }) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <div className="dept" data-open={open}>
      <button className="dept__head" aria-expanded={open} aria-controls={`dept-${d.slug}`} onClick={() => setOpen((o) => !o)}>
        <span className="dept__name">
          {d.name} <span className="dept__count">{d.teachers.length}</span>
        </span>
        <span className="dept__right">
          <span className="dept__faces" aria-hidden="true">
            {d.teachers.slice(0, 4).map((t) => (
              <span key={t.id}>{t.photo_id ? <Img id={t.photo_id} media={media} sizes="40px" alt="" /> : initials(t.name)}</span>
            ))}
          </span>
          <span className="dept__toggle" aria-hidden="true">
            <Plus />
          </span>
        </span>
      </button>
      <div className="dept__body" id={`dept-${d.slug}`} role="region" aria-label={d.name} inert={!open ? true : undefined}>
        <div className="dept__clip">
          <div className="dept__inner">
            {d.description && <p className="dept__desc">{d.description}</p>}
            <div className="faculty">
              {d.teachers.map((t) => (
                <button key={t.id} className="tcard" onClick={(e) => onOpen(t, d, e.currentTarget)}>
                  <TeacherFace t={t} media={media} />
                  <div className="tcard__name">{t.name}</div>
                  <div className="tcard__role">{t.designation}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeacherTree({ groups, media }) {
  const [sel, setSel] = useState(null);
  const opener = useRef(null);
  const closeRef = useRef(null);

  const open = (t, d, el) => {
    opener.current = el;
    setSel({ t, d });
  };
  const close = () => {
    setSel(null);
    opener.current?.focus();
  };

  useEffect(() => {
    if (!sel) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const k = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", k);
    };
  }, [sel]);

  return (
    <>
      <div className="tree">
        {groups.map((d, i) => (
          <Department key={d.id} d={d} media={media} onOpen={open} initiallyOpen={i === 0} />
        ))}
      </div>
      {sel && (
        <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="t-name">
          <div className="dialog__scrim" onClick={close} />
          <div className="dialog__panel">
            <button ref={closeRef} className="dialog__close" onClick={close} aria-label="Close profile">
              <Close />
            </button>
            <TeacherFace t={sel.t} media={media} sizes="(min-width:900px) 40vw, 100vw" />
            <div className="dialog__body">
              <span className="eyebrow">{sel.d.name}</span>
              <h2 className="h2" id="t-name" style={{ marginBottom: 10 }}>
                {sel.t.name}
              </h2>
              <p className="muted">{sel.t.designation}</p>
              <ul className="facts" style={{ margin: "24px 0" }}>
                {sel.t.qualification && (
                  <li>
                    <span>Qualifications</span>
                    <b>{sel.t.qualification}</b>
                  </li>
                )}
                {sel.t.subject && (
                  <li>
                    <span>Subject</span>
                    <b>{sel.t.subject}</b>
                  </li>
                )}
                {sel.t.experience && (
                  <li>
                    <span>Experience</span>
                    <b>{sel.t.experience}</b>
                  </li>
                )}
              </ul>
              {sel.t.bio && <p className="muted">{sel.t.bio}</p>}
              <Link href={`/teachers/${sel.t.slug}`} className="link">
                Full profile <Arrow width={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
