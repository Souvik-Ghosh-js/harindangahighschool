import { Bricolage_Grotesque, Instrument_Sans, Hind_Siliguri } from "next/font/google";
import { getSite } from "@/lib/content";
import { siteUrl } from "@/lib/seo";
import { mediaUrl } from "@/lib/media-url";
import "./globals.css";

const head = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-head", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--f-body", display: "swap" });
const bengali = Hind_Siliguri({ subsets: ["bengali"], weight: ["400", "600"], variable: "--f-bn", display: "swap", preload: false });

export async function generateMetadata() {
  const { site, seo } = await getSite();
  return {
    metadataBase: new URL(siteUrl("/")),
    title: { default: seo.title || site.name, template: `%s · ${site.name}` },
    description: seo.description,
    applicationName: site.name,
    formatDetection: { telephone: true, email: true, address: true },
    // Small optimised copy of the emblem — the original PNG is 215 KB.
    icons: site.logo ? { icon: `/_next/image?url=${encodeURIComponent(mediaUrl(site.logo))}&w=64&q=70`, apple: `/_next/image?url=${encodeURIComponent(mediaUrl(site.logo))}&w=256&q=70` } : undefined,
    verification: seo.google_verification ? { google: seo.google_verification } : undefined,
  };
}

export const viewport = {
  themeColor: "#1e40af",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${head.variable} ${body.variable} ${bengali.variable}`} suppressHydrationWarning>
      <head>
        {/* Enable reveal states only when JS + motion are available, before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement;if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js');setTimeout(function(){if(!window.__motionReady)d.classList.add('reveal-all')},4000)}var f=localStorage.getItem('hhs-fs');if(f)d.dataset.fs=f;if(localStorage.getItem('hhs-contrast')==='high')d.dataset.contrast='high'}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
