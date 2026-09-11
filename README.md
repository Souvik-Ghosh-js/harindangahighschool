# Harindanga High School — Website & Admin Panel

A Next.js application: the public website plus a password-protected admin panel.
Changes made in the panel go live on the website immediately — no uploading, no publish step.

---

## Quick start (local)

```bash
npm install
npm run set-password        # create the admin login (first time only)
npm run dev                 # http://localhost:3000
```

The admin panel is at **/admin**, reachable from the "Staff Login" link in the footer.

---

## Deploying to Hostinger

These steps assume a Hostinger plan with **Node.js application** support (VPS or Cloud).

### 1. Put the code on the server

Either push this folder to a Git repository and connect it in hPanel, or upload the
project folder directly. **Do not upload `node_modules` or `.next`** — they are rebuilt
on the server.

### 2. Configure the Node app in hPanel

| Setting | Value |
|---|---|
| Application root | the project folder |
| Startup file | `npm start` (runs `next start`) |
| Node version | 20 or newer |
| Build command | `npm install && npm run build` |

### 3. Set an environment variable

In hPanel's Node app settings, add:

```
SESSION_SECRET=<a long random string>
NODE_ENV=production
```

`npm run set-password` prints a suitable random value for `SESSION_SECRET`. Setting it
means admin sessions survive a password change and a server restart. If you skip it the
app still works, but everyone is signed out whenever the password changes.

### 4. Create the admin login on the server

Open Hostinger's terminal for the app and run:

```bash
npm run set-password
```

It asks for a username and password and writes `data/admin.json`. That file is
gitignored and never served to browsers — it exists only on the server.

### 5. Build and start

```bash
npm install
npm run build
npm start
```

Hostinger normally runs these for you from the panel settings above.

---

## ⚠️ Important: file persistence

Notices, staff, gallery data and uploaded PDFs/photos are stored **as files on the server**
(`public/data/` and `public/assets/`). This is deliberate — it is simple, needs no database,
and the school can back it up by copying a folder.

It does mean:

- **Never delete the app folder** on redeploy, or uploaded content is lost.
- If you deploy by **replacing** the whole folder (rather than `git pull`), back up
  `public/data/` and `public/assets/` first and restore them afterwards.
- On a platform that resets the filesystem between deploys, this content would not survive.
  Hostinger's Node hosting uses a persistent disk, so it does.

**Recommended backup:** download `public/data/` and `public/assets/` periodically.
That is the entire content of the site.

---

## The admin panel

Sign in at `/admin`.

| Tab | What it does |
|---|---|
| **Notices** | Add, edit, delete notices. Upload the PDF directly — it is stored automatically. |
| **Teachers** | Add, edit, remove and reorder teaching staff. Serial numbers are automatic. |
| **Event Gallery** | Create albums per event; upload photographs with captions. |
| **Pop-up Notice** | Compose the site-wide announcement, with a live preview. |

### How the pop-up behaves

It is shown **once per visitor**. Every time you save the pop-up it counts as a new
announcement, so it appears again for everyone — including people who dismissed the
previous one. Untick "Show this pop-up" to turn it off.

### Changing the password

On the server:

```bash
npm run set-password
```

Passwords are hashed with scrypt and never sent to the browser. The login is verified on
the server, sessions are signed httpOnly cookies, and repeated failed attempts from one
address are rate-limited.

---

## Project structure

```
app/
  layout.js               Shared shell: header, footer, pop-up
  page.js                 Home
  about|academics|admission|administration|awards|
  contact|facilities|faculty|gallery|hm-desk|notices/
                          Public pages
  admin/                  Admin panel route
  api/
    auth/login|logout|session/   Sign in, sign out, session check
    data/[file]/          Read (public) and write (authenticated) content
    upload/               Authenticated file upload

components/               Header, Footer, Popup, gallery, notices, admin UI
lib/
  data.js                 Reads/writes public/data/*.json (atomic writes)
  auth.js                 scrypt hashing, signed sessions, rate limiting
  site.js                 Contact details, navigation, categories

public/
  data/                   notices | staff | gallery | popup  (the site's content)
  assets/doc/             Notice PDFs (uploaded via the panel)
  assets/img/             Photographs (uploaded via the panel)

data/admin.json           Admin credentials — created on the server, never committed
scripts/set-password.mjs  Creates or changes the admin login
```

---

## Editing site-wide details

Phone number, email, address and the navigation menu live in **`lib/site.js`**.
Change them once and every page updates.

---

## Design system

Brand tokens are CSS custom properties at the top of `app/globals.css` — deep indigo
(`--ink` / `--indigo`) with a marigold accent (`--marigold`), Fraunces over Plus Jakarta
Sans. Rebrand from there.

Responsive at 1080px / 880px / 620px, and honours `prefers-reduced-motion`.

---

## Notes

- Pages that were "Under Construction" on the original site (Academics, Facilities) were
  built out from the school's real documents. Alumni and Published were dropped rather than
  shipped empty — add them when there is content.
- The contact form opens the visitor's email client and stores nothing on the server.
- Content and photographs came from the original harindangahighschool.org.in.
