/* ============================================================
   Editable content model.

   Every fixed section of the public website is a "block". Each block
   declares its fields here ONCE; the admin panel builds its form from
   this definition and the server validates against it. Adding a field
   here makes it editable everywhere — nothing on the site is
   hard-coded.

   Field types: text, textarea, image, file, url, toggle, number,
   date, select, list (repeating group of sub-fields).
   `bn` is a short Bengali hint shown under the label for office staff.
   ============================================================ */

const seo = [
  { name: "seo_title", type: "text", label: "Google title", bn: "গুগলে দেখানো শিরোনাম", max: 70, help: "Leave empty to use the page title." },
  { name: "seo_description", type: "textarea", label: "Google description", bn: "গুগলে দেখানো বিবরণ", max: 170, rows: 2, help: "One or two sentences shown under the link in Google." },
];

const pageHead = [
  { name: "title", type: "text", label: "Page title", bn: "পাতার শিরোনাম", max: 80 },
  { name: "intro", type: "textarea", label: "Short introduction", bn: "ছোট পরিচিতি", max: 260, rows: 3 },
  { name: "hero_image", type: "image", label: "Top photo", bn: "উপরের ছবি", ratio: "21/9" },
];

const link = (name, label) => [
  { name: `${name}_label`, type: "text", label: `${label} — button text`, max: 32 },
  { name: `${name}_href`, type: "url", label: `${label} — link`, help: "A page like /admission or a full web address." },
];

export const ICONS = ["notice", "calendar", "download", "admission", "result", "book", "people", "photo", "phone", "building", "award", "link"];

export const BLOCK_GROUPS = [
  { id: "site", label: "School information", bn: "বিদ্যালয়ের তথ্য" },
  { id: "home", label: "Home page", bn: "হোম পেজ" },
  { id: "pages", label: "Other pages", bn: "অন্যান্য পাতা" },
];

export const BLOCKS = {
  /* ---------------- School-wide ---------------- */
  site: {
    group: "site",
    label: "School details & contact",
    bn: "বিদ্যালয়ের নাম, ঠিকানা, ফোন",
    description: "Name, logo, phone, email, address and social links used across the whole website.",
    fields: [
      { name: "name", type: "text", label: "School name", bn: "বিদ্যালয়ের নাম", max: 80, required: true },
      { name: "name_bn", type: "text", label: "School name in Bengali", bn: "বাংলায় নাম", max: 80 },
      { name: "tagline", type: "text", label: "Small line under the name", bn: "নামের নিচের লাইন", max: 60 },
      { name: "established", type: "number", label: "Year established", bn: "প্রতিষ্ঠার বছর" },
      { name: "logo", type: "image", label: "School logo", bn: "লোগো", ratio: "1/1", keepTransparent: true },
      { name: "phone", type: "text", label: "Phone number", bn: "ফোন নম্বর", max: 20 },
      { name: "phone_note", type: "text", label: "Phone timing note", bn: "ফোনের সময়", max: 80 },
      { name: "email", type: "text", label: "Email address", bn: "ইমেল", max: 80 },
      { name: "address", type: "textarea", label: "Postal address", bn: "ঠিকানা", rows: 3, max: 240 },
      { name: "office_hours", type: "text", label: "Office hours", bn: "অফিসের সময়", max: 80 },
      { name: "map_query", type: "text", label: "Map search text", bn: "ম্যাপে খোঁজার লেখা", max: 120, help: "What Google Maps should search for, e.g. 'Harindanga High School, Falta'." },
      { name: "latitude", type: "text", label: "Latitude (optional)", max: 20 },
      { name: "longitude", type: "text", label: "Longitude (optional)", max: 20 },
      { name: "facebook", type: "url", label: "Facebook page link" },
      { name: "youtube", type: "url", label: "YouTube channel link" },
      { name: "instagram", type: "url", label: "Instagram link" },
      { name: "footer_note", type: "textarea", label: "Footer sentence", bn: "নিচের অংশের লেখা", rows: 2, max: 220 },
      { name: "udise", type: "text", label: "UDISE code (optional)", max: 20 },
    ],
  },
  seo: {
    group: "site",
    label: "Google & sharing",
    bn: "গুগল ও শেয়ার",
    description: "How the school appears in Google search and when links are shared on WhatsApp or Facebook.",
    fields: [
      { name: "title", type: "text", label: "Website title in Google", max: 70 },
      { name: "description", type: "textarea", label: "Website description in Google", rows: 3, max: 170 },
      { name: "share_image", type: "image", label: "Image shown when the site is shared", ratio: "1200/630" },
      { name: "google_verification", type: "text", label: "Google Search Console code", max: 120, help: "Only the code from the meta tag, not the full tag." },
    ],
  },
  announcement: {
    group: "site",
    label: "Top announcement bar",
    bn: "উপরের ঘোষণা",
    description: "A thin strip at the very top of every page for urgent news.",
    fields: [
      { name: "enabled", type: "toggle", label: "Show the announcement bar", bn: "দেখাবে?" },
      { name: "text", type: "text", label: "Message", bn: "বার্তা", max: 140 },
      ...link("link", "Optional link"),
      { name: "expires_on", type: "date", label: "Hide automatically after", bn: "এই তারিখের পর লুকাবে" },
    ],
  },
  popup: {
    group: "site",
    label: "Pop-up notice",
    bn: "পপ-আপ নোটিস",
    description: "A message that opens once for each visitor. Saving it shows it again to everyone.",
    fields: [
      { name: "enabled", type: "toggle", label: "Show the pop-up", bn: "দেখাবে?" },
      { name: "title", type: "text", label: "Heading", max: 90 },
      { name: "message", type: "textarea", label: "Message", rows: 4, max: 500 },
      { name: "image", type: "image", label: "Photo (optional)", ratio: "16/9" },
      ...link("link", "Button"),
    ],
  },
  navigation: {
    group: "site",
    label: "Menu",
    bn: "মেনু",
    description: "The links in the website menu. Use the arrows to change the order.",
    fields: [
      {
        name: "items", type: "list", label: "Menu links", itemLabel: "label", max: 12,
        fields: [
          { name: "label", type: "text", label: "Text", max: 28 },
          { name: "href", type: "url", label: "Link" },
          { name: "visible", type: "toggle", label: "Show in menu", default: true },
        ],
      },
    ],
  },

  links: {
    group: "site",
    label: "Important links",
    bn: "গুরুত্বপূর্ণ লিঙ্ক",
    description: "Official portals for students and parents (Board, Council, scholarships). Shown on the home page and in the footer.",
    fields: [
      {
        name: "items", type: "list", label: "Links", itemLabel: "label", max: 16,
        fields: [
          { name: "label", type: "text", label: "Name", max: 60 },
          { name: "text", type: "text", label: "Short description", max: 90 },
          { name: "href", type: "url", label: "Web address" },
        ],
      },
    ],
  },
  policies: {
    group: "site",
    label: "Website policies",
    bn: "ওয়েবসাইট নীতি",
    description: "Copyright, privacy, hyperlinking, terms and disclaimer pages (as per Government website guidelines).",
    fields: [
      { name: "content_owner", type: "text", label: "Content owned & maintained by", max: 120 },
      { name: "developer", type: "text", label: "Designed & developed by", max: 120 },
      { name: "copyright", type: "textarea", label: "Copyright policy", rows: 5, max: 3000 },
      { name: "privacy", type: "textarea", label: "Privacy policy", rows: 5, max: 3000 },
      { name: "hyperlinking", type: "textarea", label: "Hyperlinking policy", rows: 5, max: 3000 },
      { name: "terms", type: "textarea", label: "Terms & conditions", rows: 5, max: 3000 },
      { name: "disclaimer", type: "textarea", label: "Disclaimer", rows: 5, max: 3000 },
      { name: "accessibility", type: "textarea", label: "Accessibility statement", rows: 5, max: 3000 },
    ],
  },

  /* ---------------- Home page ---------------- */
  "home.hero": {
    group: "home",
    label: "Opening photos & headline",
    bn: "প্রথম ছবি ও শিরোনাম",
    description: "The full-screen photographs and words visitors see first.",
    fields: [
      { name: "eyebrow", type: "text", label: "Small line above the headline", max: 60 },
      { name: "title", type: "textarea", label: "Headline", bn: "শিরোনাম", rows: 2, max: 90, help: "Press Enter to start a new line." },
      { name: "subtitle", type: "textarea", label: "Sentence under the headline", rows: 2, max: 200 },
      ...link("primary", "Main button"),
      ...link("secondary", "Second button"),
      {
        name: "slides", type: "list", label: "Photos (they change slowly)", bn: "ছবিগুলি", itemLabel: "caption", max: 6,
        fields: [
          { name: "image", type: "image", label: "Photo", ratio: "16/9" },
          { name: "caption", type: "text", label: "Caption", max: 90 },
        ],
      },
    ],
  },
  "home.intro": {
    group: "home",
    label: "Welcome & numbers",
    bn: "স্বাগত ও সংখ্যা",
    description: "Short welcome text with the key numbers that count up as you scroll.",
    fields: [
      { name: "eyebrow", type: "text", label: "Small line", max: 50 },
      { name: "title", type: "textarea", label: "Heading", rows: 2, max: 120 },
      { name: "body", type: "textarea", label: "Text", rows: 5, max: 900 },
      { name: "image", type: "image", label: "Photo", ratio: "4/5" },
      ...link("cta", "Button"),
      {
        name: "stats", type: "list", label: "Numbers", itemLabel: "label", max: 4,
        fields: [
          { name: "value", type: "number", label: "Number" },
          { name: "suffix", type: "text", label: "After the number (e.g. +)", max: 4 },
          { name: "label", type: "text", label: "Label", max: 40 },
        ],
      },
    ],
  },
  "home.journey": {
    group: "home",
    label: "Our journey (timeline)",
    bn: "আমাদের যাত্রা",
    description: "Milestones from 1948 to today, shown as a sliding timeline.",
    fields: [
      { name: "eyebrow", type: "text", label: "Small line", max: 50 },
      { name: "title", type: "text", label: "Heading", max: 90 },
      { name: "intro", type: "textarea", label: "Introduction", rows: 2, max: 260 },
      {
        name: "milestones", type: "list", label: "Milestones", itemLabel: "year", max: 14,
        fields: [
          { name: "year", type: "text", label: "Year", max: 12 },
          { name: "title", type: "text", label: "Title", max: 80 },
          { name: "text", type: "textarea", label: "Text", rows: 3, max: 320 },
          { name: "image", type: "image", label: "Photo", ratio: "4/3" },
        ],
      },
    ],
  },
  "home.culture": {
    group: "home",
    label: "Life & culture story",
    bn: "জীবন ও সংস্কৃতি",
    description: "Photo chapters that change as visitors scroll — festivals, sport, learning.",
    fields: [
      { name: "eyebrow", type: "text", label: "Small line", max: 50 },
      { name: "title", type: "text", label: "Heading", max: 90 },
      {
        name: "chapters", type: "list", label: "Chapters", itemLabel: "title", max: 6,
        fields: [
          { name: "image", type: "image", label: "Photo", ratio: "4/5" },
          { name: "kicker", type: "text", label: "Small line", max: 40 },
          { name: "title", type: "text", label: "Title", max: 70 },
          { name: "text", type: "textarea", label: "Text", rows: 3, max: 360 },
        ],
      },
    ],
  },
  "home.sections": {
    group: "home",
    label: "Show / hide home sections",
    bn: "অংশ দেখাও / লুকাও",
    description: "Turn each part of the home page on or off.",
    fields: [
      { name: "notices", type: "toggle", label: "Latest notices", default: true },
      { name: "intro", type: "toggle", label: "Welcome & numbers", default: true },
      { name: "leadership", type: "toggle", label: "Head of Institution message", default: true },
      { name: "journey", type: "toggle", label: "Our journey timeline", default: true },
      { name: "culture", type: "toggle", label: "Life & culture story", default: true },
      { name: "events", type: "toggle", label: "Events", default: true },
      { name: "teachers", type: "toggle", label: "Teachers preview", default: true },
      { name: "gallery", type: "toggle", label: "Gallery preview", default: true },
      { name: "admission", type: "toggle", label: "Admission banner", default: true },
      { name: "quicklinks", type: "toggle", label: "Service tiles", default: true },
      { name: "links", type: "toggle", label: "Important links", default: true },
      {
        name: "quick_links", type: "list", label: "Service tiles (quick links)", itemLabel: "label", max: 8,
        fields: [
          { name: "label", type: "text", label: "Text", max: 36 },
          { name: "text", type: "text", label: "Small line under it (optional)", max: 60 },
          { name: "href", type: "url", label: "Link" },
          { name: "icon", type: "select", label: "Icon", options: ICONS.map((i) => ({ value: i, label: i })), default: "notice" },
        ],
      },
    ],
  },

  /* ---------------- Other pages ---------------- */
  leadership: {
    group: "pages",
    label: "Head of Institution",
    bn: "প্রধান শিক্ষক / টিচার-ইন-চার্জ",
    description: "Name, portrait, quote and full message of the Head of Institution.",
    fields: [
      { name: "name", type: "text", label: "Name", bn: "নাম", max: 80, required: true },
      { name: "designation", type: "text", label: "Designation", bn: "পদ", max: 80 },
      { name: "portrait", type: "image", label: "Portrait photo", bn: "ছবি", ratio: "4/5" },
      { name: "quote", type: "textarea", label: "Quote (short)", bn: "উক্তি", rows: 3, max: 280 },
      { name: "message", type: "textarea", label: "Full message", bn: "সম্পূর্ণ বার্তা", rows: 10, max: 5000, help: "Leave an empty line between paragraphs." },
      { name: "qualifications", type: "text", label: "Qualifications (optional)", max: 160 },
      { name: "bio", type: "textarea", label: "Short biography (optional)", rows: 4, max: 1500 },
      ...seo,
    ],
  },
  about: {
    group: "pages",
    label: "About the school",
    bn: "আমাদের সম্পর্কে",
    description: "History, vision, values, facilities, achievements and facts.",
    fields: [
      ...pageHead,
      { name: "story_title", type: "text", label: "Story heading", max: 90 },
      { name: "story", type: "textarea", label: "Our story", rows: 10, max: 5000, help: "Leave an empty line between paragraphs." },
      { name: "story_image", type: "image", label: "Story photo", ratio: "4/5" },
      { name: "vision", type: "textarea", label: "Vision", rows: 3, max: 600 },
      { name: "mission", type: "textarea", label: "Mission", rows: 3, max: 600 },
      {
        name: "glance", type: "list", label: "At a glance (facts)", itemLabel: "label", max: 8,
        fields: [
          { name: "label", type: "text", label: "Label", max: 30 },
          { name: "value", type: "text", label: "Value", max: 40 },
        ],
      },
      {
        name: "values", type: "list", label: "What we stand for", itemLabel: "title", max: 6,
        fields: [
          { name: "title", type: "text", label: "Title", max: 50 },
          { name: "text", type: "textarea", label: "Text", rows: 3, max: 320 },
        ],
      },
      {
        name: "facilities", type: "list", label: "Campus & facilities", itemLabel: "title", max: 10,
        fields: [
          { name: "title", type: "text", label: "Title", max: 60 },
          { name: "text", type: "textarea", label: "Text", rows: 3, max: 400 },
          { name: "image", type: "image", label: "Photo", ratio: "4/3" },
        ],
      },
      {
        name: "achievements", type: "list", label: "Achievements", itemLabel: "title", max: 12,
        fields: [
          { name: "year", type: "text", label: "Year", max: 12 },
          { name: "title", type: "text", label: "Title", max: 90 },
          { name: "text", type: "textarea", label: "Text", rows: 3, max: 500 },
          { name: "image", type: "image", label: "Photo (optional)", ratio: "4/3" },
        ],
      },
      { name: "achievements_file", type: "file", label: "Full achievements record (PDF)" },
      ...seo,
    ],
  },
  administration: {
    group: "pages",
    label: "Administrative body",
    bn: "পরিচালন সমিতি",
    description: "Managing committee members and how the school is governed.",
    fields: [
      ...pageHead,
      { name: "governance", type: "textarea", label: "How the school is run", rows: 5, max: 1500 },
      {
        name: "committee", type: "list", label: "Committee members", itemLabel: "name", max: 30,
        fields: [
          { name: "name", type: "text", label: "Name", max: 80 },
          { name: "role", type: "text", label: "Role", max: 80 },
        ],
      },
      ...seo,
    ],
  },
  teachers_page: {
    group: "pages",
    label: "Teachers page text",
    bn: "শিক্ষক পাতার লেখা",
    description: "Heading and introduction on the Teachers page. Teachers themselves are managed under Teachers.",
    fields: [...pageHead, ...seo],
  },
  academics: {
    group: "pages",
    label: "Academics",
    bn: "পঠনপাঠন",
    description: "Stages of learning and the academic record. Files are managed under Downloads.",
    fields: [
      ...pageHead,
      {
        name: "stages", type: "list", label: "Stages of learning", itemLabel: "title", max: 5,
        fields: [
          { name: "label", type: "text", label: "Classes (e.g. V–VIII)", max: 16 },
          { name: "title", type: "text", label: "Title", max: 60 },
          { name: "text", type: "textarea", label: "Text", rows: 3, max: 400 },
        ],
      },
      { name: "record_title", type: "text", label: "Academic record heading", max: 90 },
      { name: "record_text", type: "textarea", label: "Academic record text", rows: 5, max: 1500 },
      ...seo,
    ],
  },
  admission: {
    group: "pages",
    label: "Admission",
    bn: "ভর্তি",
    description: "Admission status, steps, eligibility and forms.",
    fields: [
      ...pageHead,
      { name: "open", type: "toggle", label: "Admissions are open now", bn: "ভর্তি চলছে?" },
      { name: "status_text", type: "text", label: "Status line", max: 120, help: "e.g. 'Admission open for Class V & XI — 2027 session'." },
      { name: "eligibility", type: "textarea", label: "Eligibility", rows: 4, max: 1200 },
      {
        name: "steps", type: "list", label: "How to apply (steps)", itemLabel: "title", max: 8,
        fields: [
          { name: "title", type: "text", label: "Step", max: 70 },
          { name: "text", type: "textarea", label: "Details", rows: 2, max: 300 },
        ],
      },
      {
        name: "forms", type: "list", label: "Application forms", itemLabel: "title", max: 6,
        fields: [
          { name: "title", type: "text", label: "Title", max: 60 },
          { name: "text", type: "textarea", label: "Description", rows: 2, max: 300 },
          { name: "form_file", type: "file", label: "Form (PDF)" },
          { name: "notice_file", type: "file", label: "Admission notice (PDF)" },
        ],
      },
      { name: "help_text", type: "textarea", label: "Need help text", rows: 3, max: 500 },
      ...seo,
    ],
  },
  contact: {
    group: "pages",
    label: "Contact page",
    bn: "যোগাযোগ",
    description: "Heading and text on the Contact page. Phone, email and address are under School details.",
    fields: [...pageHead, ...seo],
  },
  notices_page: {
    group: "pages",
    label: "Notices page text",
    bn: "নোটিস পাতার লেখা",
    description: "Heading and introduction on the Notices page.",
    fields: [...pageHead, ...seo],
  },
  events_page: {
    group: "pages",
    label: "Events page text",
    bn: "অনুষ্ঠান পাতার লেখা",
    description: "Heading and introduction on the Events page.",
    fields: [...pageHead, ...seo],
  },
  gallery_page: {
    group: "pages",
    label: "Gallery page text",
    bn: "গ্যালারি পাতার লেখা",
    description: "Heading and introduction on the Gallery page.",
    fields: [...pageHead, ...seo],
  },
};

export const BLOCK_KEYS = Object.keys(BLOCKS);

/* Content categories shared by notices and downloads. */
export const NOTICE_CATEGORIES = ["General", "Admission", "Examination", "Result", "Academics", "Syllabus", "Event", "Holiday"];
export const DOWNLOAD_CATEGORIES = ["Syllabus", "Book List", "Routine", "Academic Calendar", "Holiday List", "Fee Structure", "Rules & Regulations", "Reports", "Forms", "General"];
