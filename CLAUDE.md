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
> - **A visual redesign is part-way through** — `index.html` only so far.
>   See "Design layer" below before touching CSS or any other page.
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
that share the stylesheets in `css/` and load Google Fonts. The brand palette
(crimson `#C41E3A` + gold) lives in `css/variables-crimson.css`.

Fonts differ by page while the redesign rolls out: redesigned pages load
**Fraunces + Karla**, the rest still load **Playfair Display + Poppins**. See
"Design layer".

## Repository layout

```
index.html, services.html, team.html, videos.html, contact.html   Public pages
admin.html            Password-protected admin dashboard (inquiries + quotes)
quote.html            Customer-facing branded quote page
css/                  Shared stylesheets (variables-crimson.css = design tokens)
    redesign.css      Design layer, Sept 2026. Public pages only, loaded LAST
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
  `css/variables-crimson.css`. On pages that load `css/redesign.css`, use its classes
  (`.band`, `.eyebrow`, `.beat-rule`) instead of inline `style="..."` — see
  "Design layer".
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
- Emoji replaced with inline SVG icons; FAQs are `<details>` accordions. **This was not
  actually sitewide** — see `SEO-GUIDE-STATUS.md` for the five pages that still carry
  emoji glyphs (mostly the `↑` back-to-top button).

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
- Do not repoint `--font-heading` / `--font-body` — `admin.html` and `quote.html` render
  the quote PNG against them. See "Design layer".
- Video `src` attributes are **case-sensitive on Netlify**. The files on disk mix
  `.mp4` and `.MP4`; Windows hides a mismatch that 404s in production. Five such
  references are **still broken** in `contact.html` and `videos.html` — table in
  `SEO-GUIDE-STATUS.md`.

## Design layer (Sept 2026) — in progress, `index.html` only

A visual redesign sits on top of the SEO rebuild in **`css/redesign.css`**. It is
rolling out page by page; **only `index.html` uses it so far.** Every other page still
renders the pre-redesign look and is unchanged apart from a `?v=` bump.

### How it is wired

`redesign.css` is loaded **last**, after `responsive.css`, so it wins on source order
and needs no `!important`:

```html
<link rel="stylesheet" href="css/variables-crimson.css?v=...">
<link rel="stylesheet" href="css/main.css?v=...">
<link rel="stylesheet" href="css/animations.css?v=...">
<link rel="stylesheet" href="css/components/header.css?v=...">
<link rel="stylesheet" href="css/components/footer.css?v=...">
<link rel="stylesheet" href="css/responsive.css?v=...">
<link rel="stylesheet" href="css/redesign.css?v=...">   <!-- last -->
```

Its tokens live in a **REDESIGN TOKENS** block appended to the bottom of
`variables-crimson.css`. That block is **purely additive** — nothing above it changed.

### To convert another page

1. Add the `redesign.css` link last, and swap the Google Fonts link to
   `Fraunces:opsz,wght,SOFT,WONK@9..144,400..900,0..100,0..1` + `Karla:wght@300..800`.
2. Replace inline `style="..."` section backgrounds with `.band` + a ground class.
3. Remove the inline `height: 75px` from the logo `<img>` (see header note below).
4. Change the nav CTA from "Book Now" to **"Check your date"** — index already says this,
   so the two differ until every page is converted.
5. Bump `?v=` on every page (`main.css`/`responsive.css` are shared).

### Grounds and colour

Bands declare a ground rather than carrying an inline gradient. Index runs
blush → white → amber → white → blush → cream → crimson CTA → crimson-dark footer.

| Token | Use | Contrast |
|---|---|---|
| `--wash-blush` / `--wash-cream` / `--wash-amber` | the three warm section grounds | — |
| `--ink` `#1A0B10` | hero ground behind the video | — |
| `--gold-leaf` `#D4A537` | gold on dark grounds only | 8.4:1 on ink |
| `--gold-ink` `#8A6212` | gold **text** on light grounds | 4.7–5.5:1 |
| `--gold-deco` `#A8780A` | rules, hairlines, frames — never words | 3.4:1 |

**The legacy `--color-secondary` `#FFD700` is 1.4:1 on white.** It is fine on the
crimson-dark footer (6.7:1) and as pure decoration, but it can never carry text on a
light ground. That is what the three golds above are for.

Crimson `#C41E3A` is unchanged and clears 5:1 on all three washes.

### Type

`--font-display` (Fraunces, variable, `SOFT`/`WONK` axes) and `--font-ui` (Karla).
Sizes are fluid `clamp()` steps (`--step-h1` … `--step-sm`).

> ⚠️ **Do not repoint `--font-heading` or `--font-body`.** `admin.html` and `quote.html`
> read them, do **not** load `redesign.css`, and load Playfair/Poppins themselves. The
> Save-image quote PNG is rendered by html2canvas against those fonts — changing the
> tokens silently changes the customer-facing PNG.

### The hero is geometry-sensitive

`object-fit: cover` derives the visible crop from the box, so **the hero height decides
which part of the footage is on screen.** `.hero-section` is pinned to `min-height:
600px` (400px under 768px) to match the framing the site has always had — at 1900px wide
that shows the middle ~56% of the 1918×1078 frame. Making the hero taller silently
re-crops the video. Hero content is sized to fit inside 600px for that reason.

`hero-video1.mp4` carries `preload="none"` deliberately: its `moov` atom is at the
**end** of the file (148MB in), so letting the browser fetch its metadata downloads the
whole clip and starves the video actually playing. It is `.load()`ed by the rotation
script when clip 1 ends. See `SEO-README.md` §5 for the `+faststart` fix.

### Header height

The bar is `60 + 24 + 1 = 85px` and `body` reserves `88px`. It previously carried an
inline `height: 75px` on the logo, making the bar 100px against 80px of reserved space,
so the top 20px of every page sat behind it. **Unconverted pages still have this bug.**

### Signature: the beat rule

`.beat-rule` is eight marks — the cycle Punjabi folk is played over — with the first
(*sam*) and fifth (*khali*) weighted. It replaces the 80px gold bar that used to sit
under every section title, and animates once on hero load. Reduced motion pins it open.

### Removed on purpose — do not reinstate

- The `.hero-overlay` rules and their six `!important` media-query repeats in
  `main.css` / `responsive.css`. They only fought each other. The hero scrim is now
  `.hero-scrim` in `redesign.css`.
- `.hero-section p { display: none !important }` below 480px, which was deleting the
  hero subheading on small phones.
