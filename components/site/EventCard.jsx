import Link from "next/link";
import Img from "../Img";
import { Arrow } from "../Icons";
import { dateParts, dateRange } from "@/lib/format";

export default function EventCard({ e, media, sizes = "(min-width:1080px) 33vw, (min-width:700px) 50vw, 100vw" }) {
  const d = dateParts(e.date);
  return (
    <article className="card">
      <div className="media ratio-43 zoom">
        {e.cover_id ? <Img id={e.cover_id} media={media} sizes={sizes} alt={e.title} /> : <div className="photo-placeholder">{d.d}</div>}
        <div className="date-badge" aria-hidden="true">
          <b>{d.d}</b>
          <span>
            {d.m} {d.y}
          </span>
        </div>
      </div>
      <div className="card__meta">
        <b>{dateRange(e.date, e.end_date)}</b>
        {e.venue && <span>{e.venue}</span>}
      </div>
      <h3>
        <Link href={`/events/${e.slug}`} className="cover">
          {e.title}
        </Link>
      </h3>
      {e.summary && <p>{e.summary}</p>}
      <span className="card__go" aria-hidden="true">
        Read more <Arrow />
      </span>
    </article>
  );
}
