import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Popup from "@/components/Popup";
import ScrollExtras from "@/components/ScrollExtras";
import { getPopup } from "@/lib/data";

export const metadata = {
  metadataBase: new URL("https://www.harindangahighschool.org.in"),
  title: {
    default: "Harindanga High School (H.S) — Estd. 1948 | South 24 Parganas",
    template: "%s — Harindanga High School (H.S)",
  },
  description:
    "Harindanga High School (H.S), established 1948 — a leading co-educational institution of Diamond Harbour, South 24 Parganas, West Bengal.",
  icons: { icon: "/assets/img/logo2.png" },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E1B2E",
};

// Content is file-backed and changes when an admin saves, so never
// cache the layout's popup read at build time.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const popup = await getPopup();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <Popup data={popup} />
        <ScrollExtras />
      </body>
    </html>
  );
}
