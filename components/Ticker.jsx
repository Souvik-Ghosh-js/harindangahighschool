import { PATHS } from "@/lib/site";

export default function Ticker({ notices }) {
  if (!notices?.length) return null;
  // Duplicated so the CSS marquee loops seamlessly.
  const run = [...notices, ...notices];

  return (
    <div className="ticker">
      <div className="ticker-inner">
        {run.map((n, i) => (
          <a
            key={`${n.file}-${i}`}
            href={`${PATHS.doc}${encodeURIComponent(n.file)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ◆ {n.title}
          </a>
        ))}
      </div>
    </div>
  );
}
