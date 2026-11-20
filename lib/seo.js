import "server-only";
import { getSite } from "./content";
import { mediaUrl } from "./media-url";
import { truncate } from "./format";

export function siteUrl(path = "") {
  const base = (process.env.SITE_URL || process.env.URL || "http://localhost:3000").replace(/\/$/, "");
  return base + path;
}

/* Builds Next.js metadata for a page. Admin-entered SEO fields win;
   otherwise sensible values are derived from the content itself. */
export async function pageMeta({ title, description, path = "/", image, seoTitle, seoDescription, type = "website", noindex = false }) {
  const { site, seo, media } = await getSite();
  const finalTitle = seoTitle || title;
  let text = String(seoDescription || description || seo.description || "").trim();
  // Google prefers 70+ characters; pad very short intros with the school's name and place.
  if (text.length < 80) text = `${text.replace(/[.\s]+$/, "")}. ${shortName(site.name)}, Falta, South 24 Parganas.`;
  const desc = truncate(text, 165);
  const imgId = image || seo.share_image;
  const img = imgId ? media[imgId] || { id: imgId } : null;
  const images = img
    ? [{ url: siteUrl(mediaUrl(imgId)), width: img.width || 1200, height: img.height || 630, alt: img.alt || site.name }]
    : undefined;
  return {
    title: finalTitle ? { absolute: `${finalTitle} · ${shortName(site.name)}` } : { absolute: seo.title || site.name },
    description: desc,
    alternates: { canonical: siteUrl(path) },
    openGraph: {
      type,
      url: siteUrl(path),
      siteName: site.name,
      title: finalTitle || seo.title || site.name,
      description: desc,
      locale: "en_IN",
      images,
    },
    twitter: { card: "summary_large_image", title: finalTitle || seo.title || site.name, description: desc, images: images?.map((i) => i.url) },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export function shortName(name) {
  return String(name || "").replace(/\s*\(.*?\)\s*/g, " ").trim();
}

/* ---------- Structured data (JSON-LD) ---------- */
export function schoolLd(site, seo, media) {
  const address = String(site.address || "").split("\n");
  const ld = {
    "@context": "https://schema.org",
    "@type": ["School", "EducationalOrganization"],
    "@id": siteUrl("/#school"),
    name: site.name,
    alternateName: [site.name_bn, shortName(site.name)].filter(Boolean),
    url: siteUrl("/"),
    description: seo.description,
    foundingDate: site.established ? String(site.established) : undefined,
    telephone: site.phone ? `+91${String(site.phone).replace(/\D/g, "").slice(-10)}` : undefined,
    email: site.email || undefined,
    logo: site.logo ? siteUrl(mediaUrl(site.logo)) : undefined,
    image: seo.share_image ? siteUrl(mediaUrl(seo.share_image)) : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.slice(0, 2).join(", "),
      addressLocality: "Falta",
      addressRegion: "West Bengal",
      postalCode: (String(site.address).match(/\b7\d{5}\b/) || [])[0],
      addressCountry: "IN",
    },
    sameAs: [site.facebook, site.youtube, site.instagram].filter(Boolean),
  };
  if (site.latitude && site.longitude) {
    ld.geo = { "@type": "GeoCoordinates", latitude: Number(site.latitude), longitude: Number(site.longitude) };
  }
  return ld;
}

export function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: siteUrl(it.path),
    })),
  };
}
