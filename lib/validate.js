/* Server-side validation for block and entity fields.
   Anything not declared in the field list is dropped, every string is
   trimmed and length-capped, and control characters are stripped. The
   public site renders all content as plain text (never as HTML), so
   there is no markup to sanitise — XSS has nowhere to enter. */

const MEDIA_ID = /^[a-z0-9]{10,40}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function str(v, max = 2000) {
  if (v == null) return "";
  return String(v).replace(CTRL, "").replace(/\r\n/g, "\n").trim().slice(0, max);
}

function url(v) {
  const s = str(v, 500);
  if (!s) return "";
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  if (/^(https?:|mailto:|tel:)/i.test(s)) return s;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(s)) return "https://" + s;
  return "";
}

export function cleanFields(fields, input, { partial = false } = {}) {
  const out = {};
  const errors = {};
  const src = input && typeof input === "object" ? input : {};

  for (const f of fields) {
    if (partial && !(f.name in src)) continue;
    const v = src[f.name];
    let val;
    switch (f.type) {
      case "text":
      case "textarea":
        val = str(v, f.max || 4000);
        break;
      case "url":
        val = url(v);
        break;
      case "number": {
        const n = Number(v);
        val = v === "" || v == null || !Number.isFinite(n) ? null : n;
        break;
      }
      case "toggle":
        val = v === true || v === 1 || v === "1" || v === "true";
        break;
      case "date":
        val = DATE.test(str(v, 10)) ? str(v, 10) : null;
        break;
      case "image":
      case "file":
        val = MEDIA_ID.test(str(v, 40)) ? str(v, 40) : null;
        break;
      case "select": {
        const allowed = (f.options || []).map((o) => o.value);
        val = allowed.includes(v) ? v : f.default ?? allowed[0];
        break;
      }
      case "list": {
        const arr = Array.isArray(v) ? v.slice(0, f.max || 50) : [];
        val = arr.map((item) => cleanFields(f.fields, item).data);
        break;
      }
      case "photos":
        val = (Array.isArray(v) ? v : [])
          .slice(0, f.max || 60)
          .filter((p) => p && MEDIA_ID.test(String(p.media_id)))
          .map((p) => ({ media_id: String(p.media_id), caption: str(p.caption, 160) }));
        break;
      case "departments":
        val = (Array.isArray(v) ? v : []).map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 10);
        break;
      default:
        continue;
    }
    if (f.required && (val === "" || val == null)) errors[f.name] = `${f.label} is required`;
    out[f.name] = val;
  }
  return { data: out, errors, ok: Object.keys(errors).length === 0 };
}

export function slugify(s) {
  return (
    String(s || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9ঀ-৿]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "item"
  );
}
