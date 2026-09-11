/* ============================================================
   Site-wide constants — contact details and navigation.
   Change these once and every page updates.
   ============================================================ */

export const SITE = {
  name: "Harindanga High School",
  sub: "Estd. 1948 · H.S.",
  phone: "9002706498",
  phoneNote: "10:00 a.m. – 5:00 p.m. (except holidays)",
  email: "harindangahighschool.hs@gmail.com",
  address: [
    "Vill – Harindanga, PO – Chaberia, PS – Falta",
    "Sub Division – Diamond Harbour",
    "Dist – South 24 Parganas, PIN – 743504",
  ],
  locality: "Harindanga, Falta, South 24 Parganas",
};

export const NAV = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    sub: [
      { label: "About the School", href: "/about" },
      { label: "Head Master's Desk", href: "/hm-desk" },
      { label: "Administrative Body", href: "/administration" },
      { label: "Awards & Recognition", href: "/awards" },
    ],
  },
  {
    label: "Faculty",
    href: "/faculty",
    sub: [
      { label: "Teaching Staff", href: "/faculty" },
      { label: "Office Staff", href: "/faculty#office" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    sub: [
      { label: "Academic Overview", href: "/academics" },
      { label: "Syllabus & Downloads", href: "/notices?cat=Syllabus" },
      { label: "Results", href: "/notices?cat=Result" },
    ],
  },
  { label: "Admission", href: "/admission" },
  { label: "Facilities", href: "/facilities" },
  { label: "Notices", href: "/notices" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const PATHS = {
  img: "/assets/img/",
  doc: "/assets/doc/",
};

export const CATEGORIES = [
  "Academics",
  "Admission",
  "Examination",
  "Event",
  "General",
  "Result",
  "Syllabus",
];

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(iso) {
  const d = new Date(String(iso) + "T00:00:00");
  if (isNaN(d)) return { d: "--", m: "", y: "" };
  return {
    d: String(d.getDate()).padStart(2, "0"),
    m: MON[d.getMonth()],
    y: d.getFullYear(),
  };
}
