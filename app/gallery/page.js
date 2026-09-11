import Link from "next/link";
import { getGallery } from "@/lib/data";
import GalleryGrid from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Photo Gallery",
  description:
    "Photographs of campus life, cultural programmes and events at Harindanga High School (H.S).",
};

export default async function GalleryPage() {
  const albums = (await getGallery()).filter((a) => a.photos?.length);

  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>Photo Gallery</span>
          </div>
          <h1>Photo Gallery</h1>
          <p>
            Moments from campus life, assemblies, cultural programmes and school events. Click
            any photograph to enlarge.
          </p>
        </div>
      </section>

      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          {albums.length ? (
            <GalleryGrid albums={albums} />
          ) : (
            <div className="empty">No photographs have been added yet.</div>
          )}
          <p style={{ margin: "8px 0 0", fontSize: ".88rem", color: "var(--text-3)" }}>
            More photographs are added as events take place. To contribute photographs, please
            contact the school office.
          </p>
        </div>
      </div>

      <div style={{ height: 64 }} />
    </>
  );
}
