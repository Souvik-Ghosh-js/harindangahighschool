// Adds the Government-website-guideline blocks (important links, policies,
// service tiles). Never overwrites a block that already exists unless --force.
import { client } from "./_db.mjs";
const force = process.argv.includes("--force");

async function put(key, data, merge) {
  const r = await client.execute({ sql: "SELECT data FROM blocks WHERE key = ?", args: [key] });
  if (r.rows.length && !force && !merge) return console.log("kept", key);
  const prev = r.rows.length ? JSON.parse(r.rows[0].data) : {};
  const next = merge ? { ...prev, ...merge(prev) } : data;
  await client.execute({ sql: "INSERT OR REPLACE INTO blocks (key, data) VALUES (?, ?)", args: [key, JSON.stringify(next)] });
  console.log("wrote", key);
}

await put("links", {
  items: [
    { label: "WBBSE", text: "West Bengal Board of Secondary Education", href: "https://wbbse.wb.gov.in" },
    { label: "WBCHSE", text: "West Bengal Council of Higher Secondary Education", href: "https://wbchse.wb.gov.in" },
    { label: "Banglar Shiksha", text: "School Education Department portal", href: "https://banglarshiksha.wb.gov.in" },
    { label: "School profile", text: "Our page on Banglar Shiksha", href: "https://school.banglarshiksha.gov.in/ws/website/index/19181311902" },
    { label: "Kanyashree Prakalpa", text: "Scholarship scheme for girl students", href: "https://wbkanyashree.gov.in" },
    { label: "OASIS", text: "Post-matric scholarships, West Bengal", href: "https://oasis.gov.in" },
    { label: "National Scholarship Portal", text: "Central government scholarships", href: "https://scholarships.gov.in" },
    { label: "Student Credit Card", text: "West Bengal Student Credit Card scheme", href: "https://wbscc.wb.gov.in" },
    { label: "DigiLocker", text: "Digital marksheets and certificates", href: "https://www.digilocker.gov.in" },
    { label: "National Portal of India", text: "india.gov.in", href: "https://www.india.gov.in" },
  ],
});

const owner = "Harindanga High School (H.S.), South 24 Parganas";
await put("policies", {
  content_owner: owner,
  developer: "Group Of Blooming Technicians (GOBT)",
  copyright: `Material on this website may be reproduced free of charge after taking proper permission by sending an email to the school. The material must be reproduced accurately and not used in a derogatory manner or in a misleading context. Wherever the material is published or issued to others, the source must be prominently acknowledged. This permission does not extend to any material identified as the copyright of a third party.`,
  privacy: `This website does not automatically capture any specific personal information from you (such as name, phone number or email address) that allows us to identify you individually. If the website requests personal information, you will be informed of the purpose, and adequate security measures will be taken to protect it. We do not sell or share any personally identifiable information volunteered on this site with any third party. Student records are never published without the authorisation of the school and appropriate consent.`,
  hyperlinking: `Links to other websites are provided for the convenience of visitors. The school is not responsible for the contents or reliability of linked websites and does not necessarily endorse the views expressed in them. We do not object to you linking directly to information hosted on this site, but we would like you to inform us of any such links. We do not permit our pages to be loaded into frames on your site.`,
  terms: `This website is designed, developed and maintained for ${owner}. Though all efforts have been made to ensure the accuracy of the content, it should not be construed as a statement of law or used for any legal purposes. In case of any ambiguity or doubt, users are advised to verify with the school office. Under no circumstances will the school be liable for any expense, loss or damage arising from the use of this website.`,
  disclaimer: `Information on this website is provided for general reference. Notices, results and schedules are published as received; in case of any discrepancy, the original notice displayed at the school notice board or issued by the competent authority shall prevail.`,
  accessibility: `We are committed to ensuring that this website is accessible to all users irrespective of device, technology or ability. It follows the Guidelines for Indian Government Websites (GIGW) and WCAG 2.1 level AA where possible. You can change text size with the A− / A / A+ buttons and switch to high contrast from the bar at the top of every page. The site works with screen readers such as NVDA, JAWS, TalkBack and VoiceOver. If you face any difficulty in accessing information, please contact the school office.`,
});

const tiles = [
  { label: "Notices", text: "Circulars & announcements", href: "/notices", icon: "notice" },
  { label: "Results", text: "Examination results", href: "/notices?category=Result", icon: "result" },
  { label: "Admission", text: "Forms & process", href: "/admission", icon: "admission" },
  { label: "Syllabus & downloads", text: "Syllabus, book lists, routines", href: "/academics", icon: "download" },
  { label: "Events", text: "Programmes & activities", href: "/events", icon: "calendar" },
  { label: "Our teachers", text: "Faculty by department", href: "/teachers", icon: "people" },
  { label: "Gallery", text: "Photographs", href: "/gallery", icon: "photo" },
  { label: "Contact office", text: "Phone, email & map", href: "/contact", icon: "phone" },
];
await put("home.sections", null, (prev) => ({ links: prev.links ?? true, quick_links: tiles }));
