import Link from "next/link";
import { dateParts, fileKind } from "@/lib/format";
import { Arrow } from "../Icons";

export default function NoticeRow({ n, today }) {
  const d = dateParts(n.date);
  const isNew = n.expires_on ? n.expires_on >= today : false;
  return (
    <li className="notice">
      <div className="notice__date">
        <b>{d.d}</b>
        <span>
          {d.m} {d.y}
        </span>
      </div>
      <div>
        <h3 className="notice__title">
          <Link href={`/notices/${n.slug}`}>{n.title}</Link>
        </h3>
        <div className="notice__meta">
          {n.pinned ? <span className="tag tag--pin">Important</span> : null}
          {isNew ? <span className="tag">New</span> : null}
          <span>{n.category}</span>
          {n.file_id && <span>{fileKind(n.file_mime)}</span>}
        </div>
      </div>
      <span className="notice__go" aria-hidden="true">
        <Arrow />
      </span>
    </li>
  );
}
