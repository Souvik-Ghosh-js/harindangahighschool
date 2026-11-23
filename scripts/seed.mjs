/* ============================================================
   One-time content migration from the legacy website.

   Uploads the legacy photos (optimised to WebP) and PDFs into Turso,
   then creates departments, teachers, notices, albums, downloads and
   every editable page block.

   Safe by default: refuses to run if content already exists.
   `npm run db:seed -- --force` wipes content tables first (admins and
   the audit log are never touched).
   ============================================================ */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { client } from "./_db.mjs";

const ROOT = new URL("../seed/legacy/", import.meta.url).pathname;
const IMG = path.join(ROOT, "assets/img");
const DOC = path.join(ROOT, "assets/doc");
const force = process.argv.includes("--force");

const exists = await client.execute("SELECT COUNT(*) AS n FROM blocks");
if (Number(exists.rows[0].n) > 0 && !force) {
  console.log("Content already exists. Re-run with `npm run db:seed -- --force` to replace it.");
  process.exit(0);
}
if (force) {
  console.log("Clearing content tables…");
  await client.executeMultiple(`
    DELETE FROM teacher_departments; DELETE FROM event_photos; DELETE FROM album_photos;
    DELETE FROM teachers; DELETE FROM departments; DELETE FROM notices; DELETE FROM events;
    DELETE FROM albums; DELETE FROM downloads; DELETE FROM blocks; DELETE FROM redirects;
    DELETE FROM media_chunks; DELETE FROM media;
  `);
}

const json = async (f) => JSON.parse(await readFile(path.join(ROOT, "data", f), "utf8"));
const slugify = (s) =>
  String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "item";
const usedSlugs = {};
const uniqueSlug = (table, s) => {
  usedSlugs[table] ??= new Set();
  let slug = slugify(s), n = 2;
  while (usedSlugs[table].has(slug)) slug = `${slugify(s)}-${n++}`;
  usedSlugs[table].add(slug);
  return slug;
};

/* ---------- media upload ---------- */
const CHUNK = 512 * 1024;
const mediaCache = new Map();

async function store(buf, { name, mime, width = null, height = null, alt = "", blur = null }) {
  const id = crypto.randomBytes(12).toString("hex");
  await client.execute({
    sql: "INSERT INTO media (id, name, mime, size, width, height, alt, blur) VALUES (?,?,?,?,?,?,?,?)",
    args: [id, name, mime, buf.length, width, height, alt, blur],
  });
  for (let i = 0, idx = 0; i < buf.length; i += CHUNK, idx++) {
    await client.execute({
      sql: "INSERT INTO media_chunks (media_id, idx, data) VALUES (?,?,?)",
      args: [id, idx, new Uint8Array(buf.subarray(i, i + CHUNK))],
    });
  }
  return id;
}

async function image(file, alt = "") {
  if (mediaCache.has(file)) return mediaCache.get(file);
  const src = path.join(IMG, file);
  if (!existsSync(src)) return null;
  const isLogo = file.endsWith(".png");
  const pipeline = sharp(src).rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true });
  const { data, info } = await (isLogo ? pipeline.png({ compressionLevel: 9 }) : pipeline.webp({ quality: 80 }))
    .toBuffer({ resolveWithObject: true });
  const tiny = await sharp(data).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  const id = await store(data, {
    name: file.replace(/\.[^.]+$/, isLogo ? ".png" : ".webp"),
    mime: isLogo ? "image/png" : "image/webp",
    width: info.width, height: info.height, alt,
    blur: `data:image/webp;base64,${tiny.toString("base64")}`,
  });
  mediaCache.set(file, id);
  return id;
}

async function doc(file) {
  if (!file) return null;
  if (mediaCache.has(file)) return mediaCache.get(file);
  const src = path.join(DOC, file);
  if (!existsSync(src)) { console.warn("  missing:", file); return null; }
  const buf = await readFile(src);
  const isPdf = buf.subarray(0, 4).toString() === "%PDF";
  let id;
  if (isPdf) {
    const clean = file.replace(/^\d+A/, "").replace(/[^\w .()-]+/g, " ").trim();
    id = await store(buf, { name: clean, mime: "application/pdf" });
  } else {
    // Image notices: optimise like photos.
    const { data, info } = await sharp(buf).rotate().resize({ width: 2000, height: 2800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
    id = await store(data, { name: file.replace(/^\d+A/, "").replace(/\.[^.]+$/, ".webp"), mime: "image/webp", width: info.width, height: info.height });
  }
  mediaCache.set(file, id);
  return id;
}

const block = (key, data) =>
  client.execute({ sql: "INSERT OR REPLACE INTO blocks (key, data) VALUES (?, ?)", args: [key, JSON.stringify(data)] });

/* ---------- photos ---------- */
console.log("Uploading photographs…");
const P = {
  building: await image("IMG-20211109-WA0002.jpg", "The main building of Harindanga High School"),
  puja: await image("IMG_20190210_145401.jpg", "Teachers and staff at Saraswati Puja on the school grounds"),
  decor: await image("IMG_20190209_102900.jpg", "Saraswati Puja decoration made by students"),
  folk: await image("IMG_2714.jpg", "Students in folk costume with teachers, Teachers' Day 2019"),
  award: await image("IMG_2720.jpg", "Shikshak Ratna Samman 2019"),
  stadium: await image("IMG_2259.jpg", "Award ceremony at Netaji Indoor Stadium, 2019"),
  national: await image("IMG-20151211-WA0014.jpg", "Students at the National Role Play and Folk Dance Competition 2015–16"),
  lab: await image("WP_20160826_002.jpg", "Students at work in the science laboratory"),
  logo: await image("logo2.png", "Harindanga High School emblem"),
};

/* ---------- departments & staff ---------- */
console.log("Creating departments and staff…");
const staff = await json("staff.json");
const DEPTS = [
  ["Languages", "Bengali, English and Sanskrit across all classes."],
  ["Mathematics", "Mathematics from the upper primary stage to Higher Secondary."],
  ["Science", "Physics, Chemistry and the Life Sciences, with laboratory practicals."],
  ["Humanities", "History, Geography, Political Science, Philosophy and Education."],
  ["Commerce", "Accountancy, Business Studies and Economics for Higher Secondary."],
  ["Computer Science", "Computer application and computer science."],
  ["Arts & Culture", "Music and the performing arts — the heart of our cultural tradition."],
  ["Physical Education", "Games, athletics and sport."],
];
const deptId = {};
for (const [i, [name, description]] of DEPTS.entries()) {
  const r = await client.execute({
    sql: "INSERT INTO departments (slug, name, description, sort) VALUES (?,?,?,?)",
    args: [uniqueSlug("departments", name), name, description, i],
  });
  deptId[name] = Number(r.lastInsertRowid);
}

for (const [i, t] of staff.teaching.entries()) {
  let { name, designation } = t;
  let status = "published";
  // Leadership change requested by the school (see proposal §4).
  if (/nirmalya/i.test(name)) { name = "Nirmalya Haldar"; designation = "DHT Teacher-in-Charge"; }
  if (/asim kumar mandal/i.test(name)) status = "draft"; // hidden pending school confirmation
  const r = await client.execute({
    sql: `INSERT INTO teachers (slug, kind, name, designation, qualification, subject, sort, status)
          VALUES (?, 'teaching', ?, ?, ?, ?, ?, ?)`,
    args: [uniqueSlug("teachers", name), name, designation || "", t.qualification || "", "", i, status],
  });
  const d = deptId[t.dept];
  if (d) await client.execute({ sql: "INSERT INTO teacher_departments VALUES (?,?)", args: [Number(r.lastInsertRowid), d] });
}
for (const [i, t] of staff.office.entries()) {
  await client.execute({
    sql: `INSERT INTO teachers (slug, kind, name, designation, qualification, sort) VALUES (?, 'office', ?, ?, ?, ?)`,
    args: [uniqueSlug("teachers", t.name), t.name, t.designation || "", t.qualification || "", i],
  });
}

/* ---------- notices ---------- */
console.log("Uploading notices…");
const { notices } = await json("notices.json");
for (const n of notices) {
  const fileId = await doc(n.file);
  await client.execute({
    sql: "INSERT INTO notices (slug, title, category, date, file_id, status) VALUES (?,?,?,?,?, 'published')",
    args: [uniqueSlug("notices", `${n.title} ${n.date.slice(0, 4)}`), n.title, n.category || "General", n.date, fileId],
  });
}

/* ---------- downloads ---------- */
console.log("Uploading downloads…");
const DOWNLOADS = [
  ["Syllabus", "326868AV syllabus 2026.pdf", "Class V Syllabus 2026"],
  ["Syllabus", "370599AVI syllabus 2026.pdf", "Class VI Syllabus 2026"],
  ["Syllabus", "680367AVII syllabus 2026.pdf", "Class VII Syllabus 2026"],
  ["Syllabus", "896220AVIII syllabus 2026.pdf", "Class VIII Syllabus 2026"],
  ["Syllabus", "357072AIX syllabus 2026.pdf", "Class IX Syllabus 2026"],
  ["Syllabus", "323363AX syllabus 2026.pdf", "Class X Syllabus 2026"],
  ["Book List", "842803ADOC-20260102-WA0007..pdf", "Book List, Classes V–X, Session 2026"],
  ["Routine", "283040A1st unit programme 2026.pdf", "First Summative Evaluation Programme 2026"],
  ["Reports", "Roll Strength-2021.pdf", "Roll Strength Report 2021"],
  ["Reports", "SCHOOL CULTURAL ACHIEVEMENTS ALL.pdf", "Cultural Achievements Record"],
  ["Forms", "V Admission  Form.pdf", "Class V Admission Form"],
  ["Forms", "XI Admission Form.pdf", "Class XI Admission Form"],
];
for (const [i, [category, file, title]] of DOWNLOADS.entries()) {
  const fileId = await doc(file);
  if (!fileId) continue;
  await client.execute({
    sql: "INSERT INTO downloads (slug, title, category, file_id, sort) VALUES (?,?,?,?,?)",
    args: [uniqueSlug("downloads", title), title, category, fileId, i],
  });
}

/* ---------- gallery ---------- */
console.log("Creating gallery albums…");
const { albums } = await json("gallery.json");
for (const [i, a] of albums.entries()) {
  const cover = await image(a.cover);
  const r = await client.execute({
    sql: "INSERT INTO albums (slug, title, cover_id, sort) VALUES (?,?,?,?)",
    args: [uniqueSlug("albums", a.title), a.title, cover, i],
  });
  for (const [j, p] of a.photos.entries()) {
    const mid = await image(p.file, p.caption);
    if (mid) await client.execute({
      sql: "INSERT INTO album_photos (album_id, media_id, caption, sort) VALUES (?,?,?,?)",
      args: [Number(r.lastInsertRowid), mid, p.caption || "", j],
    });
  }
}

/* ---------- page blocks ---------- */
console.log("Writing page content…");
const established = 1948;
const years = new Date().getFullYear() - established;
const teacherCount = staff.teaching.length - 1;

await block("site", {
  name: "Harindanga High School (H.S.)",
  name_bn: "হরিণডাঙা উচ্চ বিদ্যালয় (উ.মা.)",
  tagline: "Established 1948 · Co-educational",
  established,
  logo: P.logo,
  phone: "9002706498",
  phone_note: "10:00 a.m. – 5:00 p.m., except holidays",
  email: "harindangahighschool.hs@gmail.com",
  address: "Vill – Harindanga, P.O. – Chaberia, P.S. – Falta\nSub-division – Diamond Harbour\nDist – South 24 Parganas, West Bengal 743504",
  office_hours: "Monday – Saturday, 10:00 a.m. – 5:00 p.m.",
  map_query: "Harindanga High School, Falta, South 24 Parganas",
  latitude: "", longitude: "",
  facebook: "", youtube: "", instagram: "",
  footer_note: "A co-educational higher secondary school serving Harindanga and the villages of Falta since 1948.",
  udise: "19181311902",
});

await block("seo", {
  title: "Harindanga High School (H.S.) — Falta, South 24 Parganas",
  description: `Harindanga High School (H.S.), established ${established}, is a co-educational higher secondary school in Falta, South 24 Parganas, known for academic results, culture and sport.`,
  share_image: P.building,
  google_verification: "",
});

await block("announcement", { enabled: false, text: "", link_label: "", link_href: "", expires_on: null });
await block("popup", { enabled: false, title: "", message: "", image: null, link_label: "", link_href: "", version: 1 });

await block("navigation", {
  items: [
    ["Home", "/"], ["About", "/about"], ["Leadership", "/leadership"], ["Teachers", "/teachers"],
    ["Academics", "/academics"], ["Admission", "/admission"], ["Notices", "/notices"],
    ["Events", "/events"], ["Gallery", "/gallery"], ["Contact", "/contact"],
  ].map(([label, href]) => ({ label, href, visible: true })),
});

await block("home.hero", {
  eyebrow: `Harindanga · Falta · Since ${established}`,
  title: "Rooted in Harindanga.\nReaching for the world.",
  subtitle: "A co-educational higher secondary school where rural talent has grown into state-level excellence in learning, music and sport.",
  primary_label: "Admissions", primary_href: "/admission",
  secondary_label: "Our story", secondary_href: "/about",
  slides: [
    { image: P.building, caption: "The main building, Harindanga" },
    { image: P.decor, caption: "Saraswati Puja, made by our students" },
    { image: P.folk, caption: "Teachers' Day, 2019" },
    { image: P.national, caption: "National Folk Dance Competition, 2015–16" },
  ],
});

await block("home.intro", {
  eyebrow: "Welcome",
  title: "A village school with a place on the cultural map of Bengal.",
  body:
    "In the field of academic excellence, Harindanga High School (H.S.) is a well-known name in the Diamond Harbour subdivision. For three decades our students have kept a bright record at both Madhyamik and Higher Secondary level, and often appear in the merit lists of state and national talent tests.\n\nAlmost all of our students come from rural middle and lower-middle class families. They reach for the highest benchmark regardless — and many have gone on to make their mark across society.",
  image: P.puja,
  cta_label: "About the school", cta_href: "/about",
  stats: [
    { value: years, suffix: "", label: "Years of learning" },
    { value: teacherCount, suffix: "", label: "Teachers" },
    { value: 8, suffix: "", label: "Classes, V to XII" },
    { value: 3, suffix: "", label: "Streams at H.S. level" },
  ],
});

await block("home.journey", {
  eyebrow: "Our journey",
  title: `From ${established} to today`,
  intro: "Milestones in the life of a school that has grown with its community.",
  milestones: [
    { year: String(established), title: "The school is founded", text: "Harindanga High School opens as a co-educational school for the children of Harindanga and the surrounding villages of Falta.", image: P.building },
    { year: "1990s", title: "A record of results", text: "The school begins three decades of consistently strong results at Secondary and Higher Secondary level.", image: P.lab },
    { year: "2015–16", title: "On the national stage", text: "Our students perform at the National Role Play and Folk Dance Competition — one of several national-level appearances.", image: P.national },
    { year: "2019", title: "Champabatir Panchali", text: "At the state's Teachers' Day ceremony at Netaji Indoor Stadium, our students perform a folk song against female foeticide.", image: P.folk },
    { year: "Today", title: "Classes V to XII", text: "A higher secondary school under WBBSE and WBCHSE, teaching science, humanities, commerce and the arts.", image: P.puja },
  ],
});

await block("home.culture", {
  eyebrow: "Life at Harindanga",
  title: "Learning that lives beyond the classroom",
  chapters: [
    { image: P.decor, kicker: "Festivals", title: "Saraswati Puja", text: "Every year the students design and build the decoration themselves — a celebration of learning, made by the learners." },
    { image: P.folk, kicker: "Music & dance", title: "A cultural tradition", text: "Our alumni have gone on to study music and dance at Visva-Bharati and Rabindra Bharati. Culture is not an extra here; it is part of who we are." },
    { image: P.lab, kicker: "Science", title: "Learning by doing", text: "Physics, Chemistry and Life Science are taught with laboratory practicals, so that understanding comes from experiment, not memory." },
    { image: P.national, kicker: "Recognition", title: "State and national stages", text: "Several state-level cultural awards and repeated participation in national competitions." },
  ],
});

await block("home.sections", {
  notices: true, intro: true, leadership: true, journey: true, culture: true,
  events: true, teachers: true, gallery: true, admission: true, quicklinks: true,
  quick_links: [
    { label: "Academic calendar & syllabus", href: "/academics" },
    { label: "Admission forms", href: "/admission" },
    { label: "Results", href: "/notices?category=Result" },
    { label: "Examination notices", href: "/notices?category=Examination" },
    { label: "Administrative body", href: "/administration" },
    { label: "Contact the office", href: "/contact" },
  ],
});

await block("leadership", {
  name: "Mr. Nirmalya Haldar",
  designation: "DHT Teacher-in-Charge",
  portrait: null,
  quote: "",
  message: "",
  qualifications: "M.Sc. (Chemistry), B.Ed.",
  bio: "",
  seo_title: "", seo_description: "",
});

await block("about", {
  title: "About the school",
  intro: `Since ${established}, a leading institution of the Diamond Harbour subdivision — in the classroom, on the stage and on the field.`,
  hero_image: P.building,
  story_title: "Seventy-five years of rural excellence",
  story:
    "In the field of academic excellence Harindanga High School (H.S.) is a well-known name in the Diamond Harbour subdivision of South 24 Parganas. Few schools in the region can match its student strength.\n\nFor the last three decades we have kept a bright track record at both Secondary and Higher Secondary level, and our students often register their names in the merit lists of state and national talent tests.\n\nAlmost all our students come from middle and lower-middle class families of rural background. In spite of many inconveniences they reach for the highest benchmark — and many have established themselves across society. We are proud of them, and draw our inspiration from their success.",
  story_image: P.puja,
  vision: "To make every child of Harindanga and its neighbouring villages confident, capable and kind — rooted in Bengal's culture and ready for the wider world.",
  mission: "To combine disciplined, high-quality teaching with music, art, sport and social awareness, so that every student grows in mind, character and spirit.",
  glance: [
    { label: "Established", value: String(established) },
    { label: "Type", value: "Co-educational" },
    { label: "Classes", value: "V – XII" },
    { label: "Boards", value: "WBBSE · WBCHSE" },
    { label: "Sub-division", value: "Diamond Harbour" },
    { label: "District", value: "South 24 Parganas" },
  ],
  values: [
    { title: "Discipline & quality", text: "Discipline alongside the quality of learning — the foundation of every result we have earned." },
    { title: "Culture as curriculum", text: "Music, dance and folk tradition carry our students to universities and to the state stage." },
    { title: "Opportunity for all", text: "Our students come from rural families. The school exists to make sure that is never a ceiling." },
  ],
  facilities: [
    { title: "Science laboratories", text: "Laboratories for Physics, Chemistry and Biology, with a practical programme each semester and a dedicated laboratory assistant.", image: P.lab },
    { title: "Computer unit", text: "Computer application and computer science teaching led by an M.Sc. (Computer Science) faculty member.", image: null },
    { title: "Culture unit", text: "Music, dance and folk performance — the heart of the school's state-level reputation.", image: P.folk },
    { title: "Sports unit", text: "Games and athletics under an M.P.Ed. qualified teacher; students have represented the school at state and national meets.", image: null },
    { title: "Scholarships & student credit card", text: "Guidance for state and central scholarships and the West Bengal Student Credit Card scheme for higher studies.", image: null },
  ],
  achievements: [
    { year: "2015 – 2019", title: "State cultural awards", text: "Several state-level cultural awards, and participation in national-level cultural competitions more than once.", image: P.national },
    { year: "2019", title: "Champabatir Panchali", text: "At the Government of West Bengal's Teachers' Day ceremony at Netaji Indoor Stadium, our students performed a folk song to raise awareness against female foeticide.", image: P.folk },
    { year: "2019", title: "Shikshak Ratna Samman", text: "The school's then Head Master received the Shikshak Ratna Samman from the Education Department, Government of West Bengal.", image: P.award },
    { year: "Ongoing", title: "Merit lists", text: "Students regularly appear in the merit lists of state and national talent tests.", image: null },
  ],
  achievements_file: mediaCache.get("SCHOOL CULTURAL ACHIEVEMENTS ALL.pdf") || null,
  seo_title: "", seo_description: "",
});

await block("administration", {
  title: "Administrative body",
  intro: "The managing committee that governs the school, with teacher, non-teaching and ex-officio representatives.",
  hero_image: P.building,
  governance:
    "The managing committee brings together the President, the Head of Institution as Secretary, elected guardian members, representatives of the teaching and non-teaching staff, and ex-officio members from the local administration.\n\nThis keeps academic leadership, staff voice and public accountability in the same room — which is how decisions on infrastructure, admissions and academic planning are taken.",
  committee: staff.committee.map((m) => ({ name: m.name, role: m.role })),
  seo_title: "", seo_description: "",
});

await block("teachers_page", {
  title: "Our teachers",
  intro: "The people behind every result, every performance and every lesson — organised by department.",
  hero_image: P.puja, seo_title: "", seo_description: "",
});

await block("academics", {
  title: "Academics",
  intro: "Classes V to XII under the West Bengal Board of Secondary Education and the West Bengal Council of Higher Secondary Education.",
  hero_image: P.lab,
  stages: [
    { label: "V – VIII", title: "Upper primary", text: "Foundation years in Bengali, English, Mathematics, Science, History, Geography and Physical Education, assessed through summative evaluations." },
    { label: "IX – X", title: "Secondary (Madhyamik)", text: "Preparation for the Madhyamik Pariksha under WBBSE, with unit tests, test examinations and published class results." },
    { label: "XI – XII", title: "Higher Secondary", text: "The semester system under WBCHSE in Science, Humanities and Commerce, with practical programmes and semester examinations." },
  ],
  record_title: "Thirty years of consistent results",
  record_text: "For the last three decades the school has maintained a bright record at both Secondary and Higher Secondary level. Class results, test results and board result summaries are published on the notice board as soon as they are released.",
  seo_title: "", seo_description: "",
});

await block("admission", {
  title: "Admission",
  intro: "Admission to Class V and Class XI. Download the form, complete it, and submit it at the school office.",
  hero_image: P.building,
  open: false,
  status_text: "Admission notices for the coming session will be published here.",
  eligibility: "Class V: students who have completed Class IV.\nClass XI: students who have passed the Madhyamik or an equivalent examination. Stream allotment follows the published admission notice.",
  steps: [
    { title: "Read the admission notice", text: "The current notice lists dates, eligibility and the streams available." },
    { title: "Download and fill the form", text: "Complete every field in block letters and attach a recent photograph." },
    { title: "Attach the documents", text: "Previous marksheet, birth certificate, Aadhaar and transfer certificate where applicable." },
    { title: "Submit at the school office", text: "Between 10:00 a.m. and 5:00 p.m. on any working day, within the notified dates." },
  ],
  forms: [
    { title: "Class V", text: "For students entering the secondary stage.", form_file: mediaCache.get("V Admission  Form.pdf") || null, notice_file: await doc("409159AV Admission Notice.pdf") },
    { title: "Class XI", text: "For students entering Higher Secondary after Madhyamik.", form_file: mediaCache.get("XI Admission Form.pdf") || null, notice_file: await doc("714840AAdobe Scan 08 May 2026 (1).pdf") },
  ],
  help_text: "For any question about eligibility, documents, dates or fees, please call or visit the school office — the staff will guide you.",
  seo_title: "", seo_description: "",
});

for (const [key, title, intro, img] of [
  ["contact", "Contact us", "Visit, call or write to the school office. We are happy to help parents and students.", P.building],
  ["notices_page", "Notice board", "Official notices, examination schedules, results and circulars.", P.building],
  ["events_page", "Events & activities", "Programmes, celebrations, competitions and school days.", P.folk],
  ["gallery_page", "Gallery", "Moments from the life of the school.", P.decor],
]) {
  await block(key, { title, intro, hero_image: img, seo_title: "", seo_description: "" });
}

console.log(`Done. ${notices.length} notices, ${staff.teaching.length + staff.office.length} staff, ${albums.length} albums, ${mediaCache.size} files.`);
await import("./seed-govt.mjs");
