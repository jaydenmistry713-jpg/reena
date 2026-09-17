# CLAUDE.md

> ## ⚠️ READ FIRST — this folder is an SEO staging copy, not the live site
>
> **You are in `Desktop/Reena-seo`.** It holds a completed SEO rebuild that has
> **not been published**. The live site still serves the old version.
>
> - Go-live steps, indexing order and the Search Console baseline: **[`SEO-README.md`](SEO-README.md)**
> - **Before re-reading `buildsbyleo/seo-changes.txt`, read [`SEO-GUIDE-STATUS.md`](SEO-GUIDE-STATUS.md)**
>   — it maps all 89 guide items to done / skipped / open so nothing already handled gets re-suggested.
> - Preview: https://seo-preview--beamish-baklava-7f1b21.netlify.app
> - Untouched original: `Desktop/Reena`
>
> **Do not run `netlify deploy --prod` unless the user explicitly asks to go live.**
> Use `netlify deploy --alias seo-preview` for previews — it never touches the live site.
>
> If the user says anything like "push it live", "replace the live site", "make it live"
> or "deploy it properly", follow section 1 of `SEO-README.md`.


Guidance for working in this repository.

## Project overview

Marketing website for **Punjabi Folk Entertainment Ltd** (by Reena Kaur) — a UK
Punjabi wedding/event entertainment business (Sangeet singers, dhol players,
DJs). It is a **static HTML/CSS/JS site** hosted on **Netlify** with a few
**Netlify serverless functions** providing a contact-form email flow, inquiry
storage, an admin dashboard, and customer quote pages.

- **Live site:** https://punjabifolkentertainment.com
- **Netlify site:** `beamish-baklava-7f1b21` (team Mistuzzo, site ID
  `fc078879-d713-4aa0-b83e-33f5ef847663`)
- **Git remote:** https://github.com/jaydenmistry713-jpg/reena.git (branch `main`)

There is **no build step** and **no framework**. Pages are hand-written HTML
that share the stylesheets in `css/` and load Google Fonts (Playfair Display +
Poppins). The brand palette (crimson `#C41E3A` + gold) lives in
`css/variables-crimson.css`.

## Repository layout

```
index.html, services.html, team.html, videos.html, contact.html   Public pages
admin.html            Password-protected admin dashboard (inquiries + quotes)
quote.html            Customer-facing branded quote page
css/                  Shared stylesheets (variables-crimson.css = design tokens)
js/                   Page scripts + html2canvas.min.js (bundled locally)
assets/               images/ and videos/  (videos are git-ignored — see below)
favicon/, manifest.json, robots.txt, sitemap.xml, BingSiteAuth.xml
netlify.toml          Functions dir, esbuild bundler, /quote/* rewrite
package.json          Function dependencies (nodemailer, @netlify/blobs)
netlify/functions/
    form-submission.js  Contact form: sends email + saves inquiry to Blobs
    admin-api.js        Password-gated CRUD for inquiries + quotes
    get-quote.js        Public read of one quote by id (for quote.html)
```

## Environment variables (set in Netlify, never in the repo)

| Var | Purpose |
|-----|---------|
| `EMAIL_USER` / `EMAIL_PASS` | Gmail account used by nodemailer to send inquiry emails |
| `ADMIN_PASSWORD` | Password for the admin dashboard (checked server-side) |
| `BLOBS_SITE_ID` | Netlify site ID, for explicit Netlify Blobs config |
| `BLOBS_TOKEN` | Netlify personal access token, for explicit Netlify Blobs config |

`BLOBS_SITE_ID` / `BLOBS_TOKEN` are required because this site does **not**
auto-provision Netlify Blobs at runtime (functions throw
`MissingBlobsEnvironmentError` without them). The functions fall back to
automatic config if those vars are absent, but on this site they must be set.

## Core features

### 1. Contact form → email (pre-existing, do not alter the email formatting)

`contact.html` POSTs the enquiry as JSON to
`/.netlify/functions/form-submission`. The function builds a **specifically
formatted HTML email** and sends it via Gmail (nodemailer) to
`info@punjabifolkentertainment.com`. That inbox **auto-forwards** to the end
account — the exact formatting is relied upon downstream.

> ⚠️ **Do not change the email template, transport, recipient, or subject in
> `form-submission.js`.** The formatting is intentional. Only additive changes
> are acceptable here.

Form fields: `name, email, phone, event-type, event-date, event-time, venue,
event-location, number-of-guests, message`.

### 2. Inquiry storage (added)

`form-submission.js` **additionally** writes each inquiry to the Netlify Blobs
store `inquiries`. This is wrapped so a storage failure cannot break the email,
and it runs before the email so an email failure cannot stop the save. Records:

```
{ id, createdAt, status: "new"|"handled", name, email, phone,
  event-type, event-date, event-time, venue, event-location,
  number-of-guests, message }
```

### 3. Admin dashboard (added) — `admin.html`

Password screen → dashboard. The entered password is held only in
`sessionStorage` and sent with every request to `admin-api.js`, which validates
it server-side against `ADMIN_PASSWORD` (timing-safe compare) before returning
any data. `admin-api.js` actions:

- `list-inquiries`, `set-inquiry-status` (new/handled), `delete-inquiry`
- `create-quote`, `list-quotes`, `delete-quote`

Dashboard behaviour:
- Enquiries render as compact cards (summary line + expandable full details),
  with a **New/Handled** badge and a **Quoted** badge when a quote exists.
- **Quotes are nested under the enquiry they came from** (linked via
  `inquiryId`). Quotes not tied to an enquiry appear under **Other quotes**.
- **Deleting an enquiry cascades** to delete its linked quotes.
- **Create quote** pre-fills customer/event details from the enquiry (editable);
  only a message + price are required.
- **Save image** renders the quote as a branded PNG via `html2canvas`
  (`js/html2canvas.min.js`) from an off-screen capture card (`#qcap-frame`)
  that mirrors `quote.html`. html2canvas-safe substitutions are used: solid
  price colour (no gradient-clipped text), nested-wrapper gradient border (no
  CSS mask), margins instead of flex `gap`.

### 4. Quotes + customer quote page (added) — `quote.html`

`create-quote` stores a quote in the Blobs store `quotes`:

```
{ id, createdAt, status: "active", inquiryId, customer:{name,email,phone},
  event:{event-type,event-date,event-time,venue,event-location,number-of-guests},
  message, price }
```

- **Quote id / URL:** the id is a readable slug `"<name-slug>-<10-hex>"` (e.g.
  `harpreet-kaur-a1b2c3d4e5`). The random suffix is the quote's **only access
  control**, so it must stay. Non-Latin/empty names fall back to a random id.
- **Clean URL:** quotes are shared at `/quote/<id>` via a `netlify.toml` rewrite
  (`/quote/*` → `/quote.html`, status 200). `quote.html` reads the id from the
  path (falling back to the legacy `?id=` query for old links). Because the page
  is served under a deep path, its asset references are **root-absolute**
  (`/css/...`, `/assets/...`).
- `quote.html` fetches the quote via the public `get-quote.js`
  (`/.netlify/functions/get-quote?id=<id>`) and renders it branded.
- The customer quote page has **no contact buttons** by design — customers are
  directed to **reply to the email** that contained the link, not to contact via
  the quote page. (The Save-image PNG does still carry contact details.)

## Deployment

The site is deployed with the **Netlify CLI**, not Git-connected. A push to
GitHub does **not** deploy.

```bash
netlify deploy --prod --dir . --functions netlify/functions
```

Why the CLI (not drag-and-drop or Git build):
- It deploys the **local folder**, so the large videos in `assets/videos/`
  (git-ignored, see below) are included on the live site.
- It runs through Netlify's pipeline so functions bundle correctly (esbuild) and
  npm dependencies are installed.

Run `npm install` locally before deploying if `node_modules` is missing (the
functions need `nodemailer` and `@netlify/blobs`).

### Two-track workflow

- `netlify deploy --prod ...` publishes to the live site.
- `git commit` + `git push` saves to GitHub.
- These are **independent** — do both when you want the change live *and* in the
  repo.

## Git / assets notes

- **Videos are git-ignored** (`assets/videos/` in `.gitignore`). One hero video
  exceeds GitHub's 100 MB per-file limit, so videos live only on the local disk
  and the live site (delivered via the CLI deploy above). A fresh `git clone`
  will not contain videos, and a Git-based Netlify build would be missing them.
- `node_modules/` and `.netlify/` are git-ignored.
- No secrets are committed; all credentials are Netlify environment variables.

## Conventions

- Vanilla JS only, no framework, no bundler for the front end.
- Match the existing page's structure, shared CSS, and design tokens in
  `css/variables-crimson.css`.
- `admin.html` and `quote.html` are `noindex`.
- When editing function JS, keep the CommonJS style (`exports.handler`) and load
  `@netlify/blobs` via dynamic `import()` (it is ESM-only).

## SEO rebuild (Sept 2026) — added in this folder

Full detail in **`SEO-README.md`**. Summary of what changed versus the live site:

- **11 new pages.** Five service pages split out of `services.html`
  (`ladies-sangeet`, `punjabi-folk-singers`, `dhol-players`, `punjabi-dj`, `concerts`),
  plus `faq`, `areas-we-cover`, `privacy-policy`, `terms`, and `blog/` with four articles.
- `services.html` cut from 775 words to a 253-word routing hub so it stops competing
  with the pages it links to.
- Sitewide: full robots directive incl. `max-image-preview:large`, complete OG/Twitter
  blocks, linked JSON-LD `@graph` (LocalBusiness+PerformingGroup → WebSite → Person),
  `Service`/`FAQPage`/`BreadcrumbList`/`BlogPosting` schema, services nav dropdown,
  service links in every footer, `llms.txt`, AI crawlers explicitly allowed.
- **Favicon fixed** — `/favicon.ico` used to 404 at the root and the icon was 16×16
  (Google needs a multiple of 48px). This is why the icon never showed in Bing.
  `manifest.json` also pointed at two PNGs that never existed.
- Images: renamed descriptively, real alt text, 23.4MB → 9.3MB, image sitemap added.
- Emoji replaced with inline SVG icons sitewide; FAQs are `<details>` accordions.

### Build scripts
The pages were generated by Python scripts in the session scratchpad
(`content.py`, `build_nav.py`, `build_services.py`, `build_extra.py`, `build_blog.py`,
`apply_updates.py`, `build_images.py`, `video_icons.py`, `check_links.py`).
They are **not** in this repo. Editing the generated HTML directly is fine — just keep
the rules in `SEO-README.md` section 6.

### Hard rules
- `netlify/functions/form-submission.js` is untouched and must stay that way.
- Never publish a price — pricing is bespoke, quoted per event.
- The Ladies Sangeet **singers** are female; accompanying musicians including dholki
  players are not always. Do not over-claim this.
- No review/star schema — self-serving reviews are ineligible. See `SEO-README.md` §5.
