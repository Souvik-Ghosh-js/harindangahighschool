/* ============================================================
   Collections the admin manages as lists (notices, events, …).
   Like blocks, the admin form and server validation are both
   driven from these definitions.
   ============================================================ */
import { NOTICE_CATEGORIES, DOWNLOAD_CATEGORIES } from "./blocks";

const status = {
  name: "status", type: "select", label: "Visibility", bn: "অবস্থা",
  options: [
    { value: "published", label: "Published — visible on website" },
    { value: "draft", label: "Draft — hidden, still working on it" },
    { value: "archived", label: "Archived — removed from website" },
  ],
  default: "published",
};

const seoFields = [
  { name: "seo_title", type: "text", label: "Google title (optional)", max: 70, advanced: true },
  { name: "seo_description", type: "textarea", label: "Google description (optional)", rows: 2, max: 170, advanced: true },
];

export const ENTITIES = {
  notices: {
    table: "notices",
    label: "Notices",
    singular: "Notice",
    bn: "নোটিস",
    titleField: "title",
    publicPath: (r) => `/notices/${r.slug}`,
    orderBy: "pinned DESC, date DESC, id DESC",
    columns: ["title", "category", "date", "status"],
    fields: [
      { name: "title", type: "text", label: "Notice title", bn: "শিরোনাম", max: 160, required: true },
      { name: "category", type: "select", label: "Category", bn: "বিভাগ", options: NOTICE_CATEGORIES.map((c) => ({ value: c, label: c })), default: "General" },
      { name: "date", type: "date", label: "Notice date", bn: "তারিখ", required: true, default: "today" },
      { name: "file_id", type: "file", label: "Attach PDF or photo", bn: "PDF বা ছবি যোগ করুন" },
      { name: "summary", type: "textarea", label: "Short description (optional)", bn: "ছোট বিবরণ", rows: 3, max: 400 },
      { name: "body", type: "textarea", label: "Full text (optional)", rows: 6, max: 6000 },
      { name: "pinned", type: "toggle", label: "Pin as important (shows on top)", bn: "গুরুত্বপূর্ণ" },
      { name: "expires_on", type: "date", label: "Remove 'new' highlight after (optional)" },
      status,
      ...seoFields,
    ],
  },
  events: {
    table: "events",
    label: "Events",
    singular: "Event",
    bn: "অনুষ্ঠান",
    titleField: "title",
    publicPath: (r) => `/events/${r.slug}`,
    orderBy: "date DESC, id DESC",
    columns: ["title", "date", "venue", "status"],
    photos: "event_photos",
    fields: [
      { name: "title", type: "text", label: "Event name", bn: "অনুষ্ঠানের নাম", max: 140, required: true },
      { name: "date", type: "date", label: "Date", bn: "তারিখ", required: true, default: "today" },
      { name: "time", type: "text", label: "Time (optional)", bn: "সময়", max: 40, help: "e.g. 10:30 a.m." },
      { name: "end_date", type: "date", label: "Last day (if more than one day)" },
      { name: "venue", type: "text", label: "Venue", bn: "স্থান", max: 120 },
      { name: "cover_id", type: "image", label: "Cover photo", bn: "প্রধান ছবি", ratio: "16/10" },
      { name: "summary", type: "textarea", label: "Short description", bn: "ছোট বিবরণ", rows: 3, max: 400 },
      { name: "body", type: "textarea", label: "Full description", rows: 8, max: 8000 },
      { name: "photos", type: "photos", label: "Event photos", bn: "অনুষ্ঠানের ছবি", max: 40 },
      status,
      ...seoFields,
    ],
  },
  teachers: {
    table: "teachers",
    label: "Teachers & Staff",
    singular: "Teacher",
    bn: "শিক্ষক ও কর্মী",
    titleField: "name",
    publicPath: (r) => (r.kind === "teaching" ? `/teachers/${r.slug}` : "/administration"),
    orderBy: "kind ASC, sort ASC, id ASC",
    columns: ["name", "designation", "kind", "status"],
    sortable: true,
    fields: [
      { name: "name", type: "text", label: "Full name", bn: "পুরো নাম", max: 100, required: true },
      { name: "photo_id", type: "image", label: "Photo", bn: "ছবি", ratio: "4/5" },
      {
        name: "kind", type: "select", label: "Staff type", bn: "ধরন",
        options: [
          { value: "teaching", label: "Teaching staff" },
          { value: "office", label: "Office / non-teaching staff" },
        ],
        default: "teaching",
      },
      { name: "designation", type: "text", label: "Designation", bn: "পদ", max: 80, help: "e.g. Assistant Teacher" },
      { name: "departments", type: "departments", label: "Department / subject group", bn: "বিভাগ" },
      { name: "subjects", type: "text", label: "Subjects taught", bn: "বিষয়", max: 160, help: "Separate with commas." },
      { name: "qualification", type: "text", label: "Qualifications", bn: "যোগ্যতা", max: 160 },
      { name: "experience", type: "text", label: "Experience / service (optional)", max: 200 },
      { name: "bio", type: "textarea", label: "Short biography (optional)", rows: 5, max: 2000 },
      status,
    ],
  },
  departments: {
    table: "departments",
    label: "Departments",
    singular: "Department",
    bn: "বিভাগ",
    titleField: "name",
    publicPath: () => "/teachers",
    orderBy: "sort ASC, id ASC",
    columns: ["name", "status"],
    sortable: true,
    fields: [
      { name: "name", type: "text", label: "Department name", bn: "বিভাগের নাম", max: 60, required: true },
      { name: "description", type: "textarea", label: "Short description", rows: 3, max: 300 },
      status,
    ],
  },
  albums: {
    table: "albums",
    label: "Gallery",
    singular: "Album",
    bn: "গ্যালারি",
    titleField: "title",
    publicPath: (r) => `/gallery/${r.slug}`,
    orderBy: "sort ASC, date DESC, id DESC",
    columns: ["title", "date", "status"],
    sortable: true,
    photos: "album_photos",
    fields: [
      { name: "title", type: "text", label: "Album name", bn: "অ্যালবামের নাম", max: 100, required: true },
      { name: "date", type: "date", label: "Date (optional)" },
      { name: "cover_id", type: "image", label: "Cover photo", bn: "প্রধান ছবি", ratio: "4/3" },
      { name: "description", type: "textarea", label: "Description (optional)", rows: 3, max: 600 },
      { name: "photos", type: "photos", label: "Photos", bn: "ছবি", max: 60 },
      status,
    ],
  },
  downloads: {
    table: "downloads",
    label: "Downloads",
    singular: "Download",
    bn: "ডাউনলোড",
    titleField: "title",
    publicPath: () => "/academics",
    orderBy: "category ASC, sort ASC, id DESC",
    columns: ["title", "category", "status"],
    sortable: true,
    fields: [
      { name: "title", type: "text", label: "Title", bn: "শিরোনাম", max: 120, required: true },
      { name: "category", type: "select", label: "Category", bn: "বিভাগ", options: DOWNLOAD_CATEGORIES.map((c) => ({ value: c, label: c })), default: "General" },
      { name: "file_id", type: "file", label: "File (PDF or photo)", bn: "ফাইল", required: true },
      status,
    ],
  },
};

export const ENTITY_KEYS = Object.keys(ENTITIES);
