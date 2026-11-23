# Harindanga High School (H.S.) — Website & Admin Panel

Next.js 16 · Turso (libSQL) · GSAP + Lenis · JWT admin auth. Built by GOBT.

Everything on the public website — text, photos, menu, notices, events, teachers,
gallery, downloads, policies, SEO — is edited from the admin panel at **/admin**.
Nothing is hard-coded.

## Run locally

```bash
npm install
cp .env.example .env        # fill in Turso URL/token, JWT_SECRET, SITE_URL
npm run db:migrate          # create tables (safe to re-run)
npm run admin:create        # create the Super Admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
npm run db:seed             # one-time import of the legacy website content (refuses if content exists)
npm run dev
```

## Deploy (Netlify)

1. Connect the repository in Netlify. Build settings come from `netlify.toml`.
2. Site settings → Environment variables: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`,
   `JWT_SECRET` (48+ random characters), `SITE_URL` (the final public address, e.g.
   `https://www.harindangahighschool.org.in`).
3. Deploy. Content lives in Turso, so redeploys never touch school data.

## How it fits together

| Path | Purpose |
|---|---|
| `db/schema.sql` | All tables. Photos/PDFs are stored in Turso (`media` + `media_chunks`). |
| `lib/blocks.js` | Every editable page section. Add a field here → it appears in the admin form and is validated on the server. |
| `lib/entities.js` | Collections: notices, events, teachers, departments, albums, downloads. |
| `lib/content.js` | Read-only queries for the public site (published content only). |
| `lib/admin-crud.js` | Create/update/archive/reorder + cache refresh after every save. |
| `proxy.js` + `lib/auth.js` | JWT (httpOnly cookie) checks for `/admin` and `/api/admin`. |
| `components/site/Motion.jsx` | Lenis smooth scroll + all GSAP scroll animations. |
| `app/(site)` | Public pages. `app/admin` + `app/api` — admin panel and API. |

## Security

- Passwords hashed with bcrypt (cost 12). Login is id + password; JWT (HS256, 10 h) in an
  httpOnly, Secure, SameSite=Lax cookie.
- Changing a password or turning an account off signs that user out everywhere (token version).
- 6 failed logins in 15 minutes locks that email/IP for 15 minutes (stored in the database).
- Writes require same-origin requests (CSRF), all input is validated server-side, all content
  is rendered as text (no HTML), uploads are type-checked from their bytes and limited to 5 MB.
- Editors cannot change the menu, Google settings, policies or users — Super Admin only.
- "Remove" archives (restorable). Only a Super Admin can permanently delete an archived item.
- Every change is recorded in the Activity log.

## Before launch — content the school must confirm

- Mr. Nirmalya Haldar's portrait, approved quote and message (left empty on purpose — never
  invent words for a real person), and the exact expansion of "DHT".
- Dr. Asim Kumar Mandal's teacher profile is saved as a **draft** (hidden) pending confirmation;
  the committee list still shows him as Secretary.
- Teacher photos, subjects and bios; professional campus/event photographs.
- Map coordinates (Website pages → School details) and social links.
- Change the Super Admin password (My account) before handover.

## Deploying to Netlify (manual, via CLI)

The live site is `harindangahighschool.netlify.app` (project linked in `.netlify/`, not committed).

```bash
npm run deploy      # builds locally with your .env, then uploads to production
```

Why a *local* build: variables pasted into Netlify as protected secrets are masked for CLI builds, so the
build reads the real values from your local `.env` (`--offline`). At runtime Netlify supplies the real
secrets (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET`, `SITE_URL`).
The database driver is `@libsql/client/web` (pure JavaScript) so the build works on any OS.
