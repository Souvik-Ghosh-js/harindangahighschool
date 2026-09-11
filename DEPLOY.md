# Deploying to Hostinger — step by step

Everything you need, in order. Budget about 20 minutes.

You need a Hostinger plan with **Node.js application** support (VPS or Cloud).
Shared hosting cannot run this app.

---

## Before you start

Have ready:

- The file **`harindanga-deploy.zip`** (sitting next to the project folder, in `C:\FRL\`)
- Your Hostinger login
- A password you want to use for the admin panel

---

## Step 1 — Upload the ZIP

1. Log in to Hostinger and open **hPanel**.
2. Go to **Files → File Manager**.
3. Navigate to the folder for your site — usually `public_html`, or the
   application root shown in your Node.js app settings.
4. Click **Upload** and choose `harindanga-deploy.zip`.
5. When it finishes, right-click the ZIP → **Extract** → extract it into that folder.
6. Delete the ZIP afterwards to save space.

You should now see `package.json`, and folders named `app`, `components`, `lib`,
`public` and `scripts` in that directory.

> If extraction created an extra nested folder (e.g. `harindanga-deploy/package.json`),
> move the contents up one level so `package.json` sits directly in the app root.

---

## Step 2 — Create the Node.js application

1. In hPanel, go to **Advanced → Node.js** (may be called "Node.js App").
2. Click **Create Application** and set:

   | Setting | Value |
   |---|---|
   | Node version | **20** or newer |
   | Application root | the folder you extracted into |
   | Application startup command | `npm start` |
   | Application URL | your temporary Hostinger address for now |

3. Save.

> **Do not** set the startup command to `next start`. This app uses Next.js standalone
> output, which `next start` cannot serve. `npm start` runs the correct server.

---

## Step 3 — Set environment variables

Still in the Node.js app settings, add these two variables:

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | a long random string — see below |

To generate a `SESSION_SECRET`, run this in the terminal (Step 4) and copy the output:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Without `SESSION_SECRET` the site still works, but everyone gets signed out of the
admin panel whenever the password changes.

**If your temporary address is `http://` and not `https://`, also add:**

| Name | Value |
|---|---|
| `ALLOW_INSECURE_COOKIES` | `true` |

This lets the admin login work over plain http while you are testing.
**Remove this variable once your real domain has SSL** — see Step 7.

---

## Step 4 — Install and build

Open the **terminal** for your application (hPanel provides one — often a "Terminal"
button in the Node.js app screen, or under Advanced).

Make sure you are in the application root, then run:

```bash
npm install
npm run build
```

`npm install` takes a few minutes. `npm run build` should end with:

```
✓ Copied static chunks (CSS/JS) → .next/standalone/.next/static
✓ Copied public assets → .next/standalone/public
✓ Standalone build is complete and ready to run
```

If you do not see those three lines, stop and check the error before continuing.

---

## Step 5 — Create the admin login

In the same terminal:

```bash
npm run set-password
```

It asks for a username and a password (minimum 10 characters). This writes
`data/admin.json` on the server — it is never committed to git and never sent
to a browser.

Write the password down somewhere safe. There is no recovery — but you can always
re-run this command to set a new one.

---

## Step 6 — Start the app

Back in the hPanel Node.js screen, click **Restart** (or **Start**).

Now open your site:

- **Website** → your Hostinger address
- **Admin panel** → your address + `/admin`, or the "Staff Login" link in the footer

Sign in with the credentials from Step 5.

---

## Step 7 — When your real domain is ready

1. Point `harindangahighschool.org.in` at the Hostinger plan.
2. Enable **SSL** for it in hPanel (Hostinger provides free SSL).
3. Update the **Application URL** in the Node.js app settings.
4. **Delete the `ALLOW_INSECURE_COOKIES` variable** if you added it in Step 3.
5. Restart the app.

Step 4 matters: with SSL active, session cookies should be HTTPS-only again.

---

## Checking it worked

| Check | Expected |
|---|---|
| Home page loads with styling and photos | Yes — if it looks unstyled, the build did not finish |
| Notice board shows 57 notices | Yes |
| Faculty page lists 38 teachers | Yes |
| `/admin` shows a login form | Yes |
| Signing in opens the panel | Yes — if it reloads back to login, see Troubleshooting |
| Adding a notice appears on the site immediately | Yes |

---

## Troubleshooting

**The site loads but has no styling or images.**
The build did not complete. Re-run `npm run build` and confirm you see the three
"Copied…" lines. Then restart the app.

**Signing in just returns to the login screen.**
Almost always the HTTPS cookie issue. If your address is `http://`, add
`ALLOW_INSECURE_COOKIES=true` (Step 3) and restart. If you are on `https://`,
check that `SESSION_SECRET` is set.

**"No admin account exists yet."**
You have not run `npm run set-password` on the server (Step 5). Running it locally
does not count — the credentials file does not travel in the ZIP, by design.

**The app will not start.**
Check the Node version is 20 or newer, and that the startup command is exactly
`npm start`.

**Uploads fail.**
The web server user needs write access to `public/assets/doc`, `public/assets/img`
and `public/data`. In File Manager, set those folders to permissions `755`.

---

## Updating the site later

To deploy new code, upload and extract a fresh ZIP, then:

```bash
npm install
npm run build
```

and restart the app.

### ⚠️ Protect your content first

Notices, photographs and staff lists are stored **as files on the server**:

- `public/data/` — notices, staff, gallery, pop-up
- `public/assets/doc/` — notice PDFs
- `public/assets/img/` — photographs

**Before replacing files on a redeploy, download those three folders.** Extracting a
new ZIP over the top will overwrite everything the school has added since launch.

Safest routine: download those folders → upload the new ZIP → copy the folders back →
rebuild → restart.

This is also your backup routine. Do it periodically regardless of deploys — those
three folders are the entire content of the website.
