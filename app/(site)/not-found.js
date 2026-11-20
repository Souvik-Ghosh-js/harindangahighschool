import Link from "next/link";

export default function NotFound() {
  return (
    <section className="phero phero--plain">
      <div className="wrap phero__in">
        <span className="eyebrow">Page not found</span>
        <h1 className="h1">This page has moved or no longer exists.</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 36 }}>
          <Link href="/" className="btn btn--light">Go to home page</Link>
          <Link href="/notices" className="btn btn--ghost">See notices</Link>
        </div>
      </div>
    </section>
  );
}
