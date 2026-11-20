/* Thin-line icon set (1.25px stroke). Functional only — never decorative. */
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, viewBox: "0 0 24 24" };

export const Arrow = (p) => (<svg {...base} {...p}><path d="M4 12h16M14 6l6 6-6 6" /></svg>);
export const ArrowUpRight = (p) => (<svg {...base} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>);
export const Download = (p) => (<svg {...base} {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>);
export const Plus = (p) => (<svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>);
export const Close = (p) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const Search = (p) => (<svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>);
export const Phone = (p) => (<svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" /></svg>);
export const Bell = (p) => (<svg {...base} {...p}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 20a2 2 0 0 0 4 0" /></svg>);
export const Calendar = (p) => (<svg {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>);
export const Chevron = (p) => (<svg {...base} {...p}><path d="m9 6 6 6-6 6" /></svg>);
export const ChevronLeft = (p) => (<svg {...base} {...p}><path d="m15 6-6 6 6 6" /></svg>);
export const Pin = (p) => (<svg {...base} {...p}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>);
export const Mail = (p) => (<svg {...base} {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="m4 7 8 6 8-6" /></svg>);
export const File = (p) => (<svg {...base} {...p}><path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5L14 3Z" /><path d="M14 3v4.5h4.5" /></svg>);
export const Book = (p) => (<svg {...base} {...p}><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" /></svg>);
export const People = (p) => (<svg {...base} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c.6-3.6 3-5.5 6-5.5s5.4 1.9 6 5.5" /><circle cx="17" cy="9" r="2.6" /><path d="M16 14.6c2.6.1 4.4 1.8 5 4.9" /></svg>);
export const Photo = (p) => (<svg {...base} {...p}><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><circle cx="9" cy="10" r="1.8" /><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" /></svg>);
export const Result = (p) => (<svg {...base} {...p}><path d="M7 3.5h10A1.5 1.5 0 0 1 18.5 5v14A1.5 1.5 0 0 1 17 20.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" /><path d="m9 12 2 2 4-4M9 17h6" /></svg>);
export const Admission = (p) => (<svg {...base} {...p}><path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5L14 3Z" /><path d="M12 10v6M9 13h6" /></svg>);
export const Building = (p) => (<svg {...base} {...p}><path d="M3 20.5h18M5 20.5V9l7-4.5L19 9v11.5M9 20.5v-5h6v5M8.5 11h1M14.5 11h1" /></svg>);
export const Award = (p) => (<svg {...base} {...p}><circle cx="12" cy="9" r="5.5" /><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7" /></svg>);
export const LinkIcon = (p) => (<svg {...base} {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>);

export const Flask = (p) => (<svg {...base} {...p}><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9" /></svg>);
export const Monitor = (p) => (<svg {...base} {...p}><path d="M3.5 5h17v11h-17zM8 20h8M12 16v4" /></svg>);
export const Music = (p) => (<svg {...base} {...p}><path d="M9 18V6l11-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3ZM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3Z" /></svg>);
export const Trophy = (p) => (<svg {...base} {...p}><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H4v1a3 3 0 0 0 3 3M16 6h4v1a3 3 0 0 1-3 3M12 13v4M8 20h8M10 17h4" /></svg>);
export const Star = (p) => (<svg {...base} {...p}><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8L12 3.5Z" /></svg>);

export const ICON_MAP = {
  notice: Bell, calendar: Calendar, download: Download, admission: Admission, result: Result, book: Book,
  people: People, photo: Photo, phone: Phone, building: Building, award: Award, link: LinkIcon,
};
