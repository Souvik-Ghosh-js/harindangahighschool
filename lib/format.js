const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function parse(iso) {
  if (!iso) return null;
  const d = new Date(String(iso).slice(0, 10) + "T00:00:00");
  return isNaN(d) ? null : d;
}

export function dateParts(iso) {
  const d = parse(iso);
  if (!d) return { d: "—", m: "", y: "" };
  return { d: String(d.getDate()).padStart(2, "0"), m: MON[d.getMonth()], y: String(d.getFullYear()) };
}

export function longDate(iso) {
  const d = parse(iso);
  return d ? `${d.getDate()} ${MONTH[d.getMonth()]} ${d.getFullYear()}` : "";
}

export function dateRange(start, end) {
  if (!end || end === start) return longDate(start);
  const a = parse(start), b = parse(end);
  if (!a || !b) return longDate(start);
  if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()) {
    return `${a.getDate()}–${b.getDate()} ${MONTH[a.getMonth()]} ${a.getFullYear()}`;
  }
  return `${longDate(start)} – ${longDate(end)}`;
}

export function paragraphs(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function initials(name) {
  return String(name || "")
    .replace(/^(mr|mrs|ms|dr|smt|sri)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function fileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function fileKind(mime) {
  if (mime === "application/pdf") return "PDF";
  if (mime?.startsWith("image/")) return "Image";
  return "File";
}

export function truncate(s, n) {
  s = String(s || "").replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s;
}
