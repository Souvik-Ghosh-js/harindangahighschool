import Link from "next/link";
import { getStaff } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Faculty & Staff",
  description:
    "Teaching and office staff of Harindanga High School (H.S) — qualified teachers across science, mathematics, languages, humanities, commerce and computer science.",
};

function StaffTable({ rows, id }) {
  return (
    <div className="tbl-wrap reveal" id={id}>
      <table className="tbl">
        <thead>
          <tr>
            <th>Sl</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Qualification</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((s, i) => (
              <tr key={`${s.name}-${i}`}>
                <td>{s.sl ?? i + 1}</td>
                <td className="staff-name">{s.name}</td>
                <td>{s.designation}</td>
                <td>{s.qualification}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", color: "var(--text-3)", padding: 40 }}>
                No staff listed yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default async function FacultyPage() {
  const staff = await getStaff();

  return (
    <>
      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> <span>›</span> <span>Faculty &amp; Staff</span>
          </div>
          <h1>Faculty &amp; Staff</h1>
          <p>
            A team of qualified teachers across mathematics, science, languages, humanities,
            commerce, computer science, music and physical education.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Teaching Staff</span>
            <h2>Our teachers</h2>
            <p className="lead">
              Every member of the teaching faculty, with designation and qualification.
            </p>
          </div>
          <StaffTable rows={staff.teaching || []} />
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap" id="office">
          <div className="sec-head reveal">
            <span className="eyebrow">Office &amp; Non-Teaching</span>
            <h2>Office staff</h2>
          </div>
          <StaffTable rows={staff.office || []} />
        </div>
      </section>
    </>
  );
}
