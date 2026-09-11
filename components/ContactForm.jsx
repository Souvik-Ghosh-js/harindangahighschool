"use client";

import { SITE } from "@/lib/site";

/* Opens the visitor's own email client. Nothing is stored on the
   server, which keeps the school out of handling personal data. */
export default function ContactForm() {
  function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `Name: ${f.get("name")}\nEmail: ${f.get("email")}\n\n${f.get("message")}`;
    window.location.href =
      `mailto:${SITE.email}` +
      `?subject=${encodeURIComponent(String(f.get("subject")))}` +
      `&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="card" style={{ padding: 34 }}>
      <h3 style={{ fontSize: "1.2rem" }}>Send us a message</h3>
      <p style={{ fontSize: ".93rem" }}>
        Fill in the form and it will open in your email application, addressed to the school
        office.
      </p>

      <form onSubmit={submit} style={{ marginTop: 24 }}>
        <label className="field">
          <span>Your name</span>
          <input name="name" type="text" required />
        </label>
        <label className="field">
          <span>Your email</span>
          <input name="email" type="email" required />
        </label>
        <label className="field">
          <span>Subject</span>
          <input name="subject" type="text" required />
        </label>
        <label className="field">
          <span>Message</span>
          <textarea name="message" rows={5} required />
        </label>

        <button className="btn btn--primary" type="submit" style={{ width: "100%" }}>
          Send message
        </button>
        <p style={{ fontSize: ".82rem", color: "var(--text-3)", margin: "14px 0 0", textAlign: "center" }}>
          This opens your email app. No message is stored on this website.
        </p>
      </form>
    </div>
  );
}
