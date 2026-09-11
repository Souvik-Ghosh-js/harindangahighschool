import Link from "next/link";
import { Suspense } from "react";
import { getNotices } from "@/lib/data";
import NoticeList from "@/components/NoticeList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notice Board",
  description:
    "All notices, syllabus, results, examination programmes and circulars from Harindanga High School (H.S).",
};

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>Notice Board</span>
          </div>
          <h1>Notice Board</h1>
          <p>
            Every circular, syllabus, examination programme and result published by the school.
            Click any notice to open the document.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Suspense fallback={<div className="empty">Loading notices…</div>}>
            <NoticeList notices={notices} />
          </Suspense>
          <p style={{ marginTop: 22, fontSize: ".88rem", color: "var(--text-3)" }}>
            Documents open as PDF or image files in a new tab. If a notice does not open, please
            contact the school office at <a href="tel:9002706498">9002706498</a>.
          </p>
        </div>
      </section>
    </>
  );
}
