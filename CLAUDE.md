# CLAUDE.md

> ## ⚠️ READ FIRST — this folder IS the live site (since 20 Oct 2026)
>
> **You are in `Downloads/Reena-seo`** (it moved from `Desktop/`; older notes say Desktop). It holds the SEO
> rebuild, which **went live on 20 Oct 2026** (`netlify deploy --prod` from this folder, at Reena's request).
> Older notes below that call this a "staging copy" or say the live site "still serves the old version"
> describe the time before that.
>
> - **Visitor statistics dashboard** (20 Oct): `/dashboard`, password in the `DASHBOARD_PASSWORD`
>   env var. See "5. Visitor statistics" below.
> - Go-live record, rollback, post-launch checks, indexing order and the Search Console baseline:
>   **[`SEO-README.md`](SEO-README.md)**
> - **Before re-reading `buildsbyleo/seo-changes.txt`, read [`SEO-GUIDE-STATUS.md`](SEO-GUIDE-STATUS.md)**
>   — it maps all 89 guide items to done / skipped / open so nothing already handled gets re-suggested.
> - Preview: https://seo-preview--beamish-baklava-7f1b21.netlify.app
> - Untouched original: was `Desktop/Reena`, no longer at that path (3 Oct). `OneDrive/Reena`
>   is an older, non-git copy. Go-live does not need it: it deploys from this folder.
> - **The visual redesign is now sitewide** (18 Sep). Every public page uses
>   `css/redesign.css`; only `admin.html` and `quote.html` are deliberately excluded.
>   See "Design layer" below before touching CSS.
> - **`admin.html` and `quote.html` were deleted on 6 Oct at Jayden's request.** Sections 3–4
>   below and the font rules that cite them describe what they were. `admin-api.js`,
>   `get-quote.js` and the `/quote/*` rewrite and headers in `netlify.toml` were left in place.
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

Every public page loads **Fraunces + Karla**. `admin.html` and `quote.html` stay on
**Playfair Display + Poppins** on purpose — the html2canvas quote PNG renders against
them. See "Design layer".

## Repository layout

```
index.html, services.html, team.html, gallery.html, contact.html   Public pages
                      (gallery.html was videos.html until 21 Sep; netlify.toml 301s the old URL)
reena-kaur.html       Reena's own page (23 Sep): entity page + her story. See "Reena Kaur page"
dashboard.html        Visitor statistics dashboard (20 Oct). Served at /dashboard, noindex, password-gated.
                      See "5. Visitor statistics"
admin.html            Password-protected admin dashboard (inquiries + quotes). DELETED 6 Oct
quote.html            Customer-facing branded quote page
punjabi-wedding-entertainment/index.html
                      Wedding pillar hub, served at /punjabi-wedding-entertainment/
tools/                Internal scripts. Blocked from being served (netlify.toml).
                      check-links.js: run `node tools/check-links.js` before every deploy. It checks
                      every local href/src with exact letter case (Netlify is case-sensitive,
                      Windows is not) and every #anchor. Added 3 Oct.
                      build-faq-review.js made Reena's FAQ checklist (faq-review.html); the
                      review finished and the page was deleted on 2 Oct. See SEO-README §4b
Reena_Kaur_SEO_Suggested_Edits.txt
                      INTERNAL. An outside SEO plan, kept on disk on purpose (Jayden, 22 Sep)
                      but not in git. netlify.toml 404s it, so deploys never publish it.
                      Parts were declined: no location/city pages, case studies, extra blog
                      posts, cost FAQs, or "UK" in titles
assets/new-media/videos/
                      Three optimised testimonial clips + posters, deliberately unused for
                      now (22 Sep). Not in git, not referenced by any page
css/                  Shared stylesheets (variables-crimson.css = design tokens)
    redesign.css      Design layer, Sept 2026. Public pages only, loaded LAST
js/                   Page scripts + html2canvas.min.js (bundled locally)
assets/               images/ and videos/  (videos are git-ignored — see below)
    images/reena-kaur/  Photos Reena sent for her own page (3 Oct)
favicon/, manifest.json, robots.txt, sitemap.xml, BingSiteAuth.xml
netlify.toml          Functions dir, esbuild bundler, /quote/* rewrite
package.json          Function dependencies (nodemailer, @netlify/blobs)
netlify/functions/
    form-submission.js  Contact form: sends email + saves inquiry to Blobs
    admin-api.js        Password-gated CRUD for inquiries + quotes
    get-quote.js        Public read of one quote by id (for quote.html)
    visit.js            Visitor statistics: stores one event from js/visit.js
    stats-api.js        Visitor statistics: password-gated read API for dashboard.html
    stats-compact.js    Visitor statistics: nightly scheduled summary (netlify.toml)
netlify/lib/
    stats-core.js       Shared by the three stats functions. Outside functions/ so it is not
                        deployed as a function itself; esbuild bundles it into each one
js/visit.js           The statistics beacon, loaded by every public page (not dashboard.html)
```

## Environment variables (set in Netlify, never in the repo)

| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Resend (send-only key) for enquiry emails from `website@punjabifolkentertainment.com`. Added 3 Oct |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail account used by nodemailer; now only the fallback if Resend fails or the key is unset |
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

> ⚠️ **Do not change the email template, recipient, or subject in
> `form-submission.js`.** The formatting is intentional.
>
> **Transport changed 3 Oct (Jayden's request):** with `RESEND_API_KEY` set it sends
> through Resend SMTP from `website@punjabifolkentertainment.com` (domain verified in
> Jayden's buildsbyleo Resend account, EU region; DNS records `resend._domainkey`, `send`,
> `rsend`, `_dmarc` on her domain). If Resend throws, it falls back to the Gmail transport.
> **Requests from a host containing `--` (preview/branch deploys such as
> `seo-preview--beamish-baklava-7f1b21.netlify.app`) go to `jayden@buildsbyleo.com`, not
> info@.** The live domain has no `--`, so it always reaches Reena. Preview test enquiries
> are still saved to the `inquiries` Blobs store; delete them in the admin dashboard.
> If her auto-forward filters on the sender, it must accept the new address.

Form fields: `name, email, phone, event-type, event-date, event-time, venue,
event-location, number-of-guests, message`.

**Confirmation (3 Oct):** a successful send opens `#enquiry-modal`, a native `<dialog>`
shown with `showModal()` (styles: section 19 of `redesign.css`). It greets the visitor by
first name (set with `textContent`). Browsers without `<dialog>` get the old inline
message. Errors stay inline above the form and scroll into view. The dialog sets
`margin: auto; inset: 0` itself because the global `* { margin: 0 }` reset in `main.css`
otherwise pins it to the top-left corner.

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

### 5. Visitor statistics (20 Oct 2026) — `dashboard.html`

Self-hosted, cookieless analytics, built at Jayden's request so he can see visitors,
conversion and which pages people read. No third-party analytics script is involved.

- **Beacon:** `js/visit.js`, one `defer` tag after `navigation.js` on all 22 public pages
  (`404.html` uses `/js/visit.js` with `data-404`, so missing URLs show as "Page not found").
  It sends a page view, visible time on page (on hide/pagehide), taps on tel/mailto/WhatsApp/
  social links, and, from `contact.html` after a successful send, `pfeStats.enquiry(eventType)`.
  **New pages need the tag too**, or they are invisible on the dashboard.
- **Collector:** `netlify/functions/visit.js`. Drops bots by user agent and events posted from
  another origin. The visitor id is `sha256(salt | London date | host | IP | UA)`, 16 hex chars:
  nothing is stored on the device and the IP is never saved, so **visitors are counted per
  day** (one person on three days = three visitors). Geo comes from Netlify's `x-nf-geo`.
- **Storage:** Blobs store `analytics`. Raw events at `e/<YYYY-MM-DD>/<ms>-<hex>`; per-day
  summaries (one record per visitor) at `d/<date>`, written the first time a finished day is
  read and nightly by `stats-compact.js` (`20 0 * * *` UTC in `netlify.toml`). Bump
  `SUMMARY_VERSION` in `netlify/lib/stats-core.js` when the summary shape changes; old
  summaries are then rebuilt from the raw events, which are kept.
- **Preview deploys write to `analytics-preview`**, chosen by host (`--` in it), the same
  rule as the enquiry email. The dashboard on a preview URL reads the preview store.
- **Dashboard:** `/dashboard` (`dashboard.html`), standalone styles, `noindex` in markup and
  via `X-Robots-Tag`, not in the sitemaps. The password is checked server-side by
  `stats-api.js` against the `DASHBOARD_PASSWORD` env var and held in `sessionStorage`.
  Periods (today … 12 months, custom), grouping by hour/day/week/month, comparison with the
  previous period, click-to-filter by page/source/type/device/town/country.
  **Everything from a visitor (paths, referrers, UTM values) is escaped before `innerHTML`.**
- "Don't count my visits on this browser" sets `localStorage pfe-stats-ignore=1`, which
  `js/visit.js` checks. It is per browser, so it has to be ticked on each device.
- `privacy-policy.html` has a "Visitor statistics" section describing this. Change it if
  what is collected changes.
- Statistics start on 20 Oct 2026. Earlier traffic is only in Search Console.

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

- **13 new pages.** Five service pages split out of `services.html`
  (`ladies-sangeet`, `punjabi-folk-singers`, `dhol-players`, `punjabi-dj`, `concerts`),
  plus `faq`, `areas-we-cover`, `privacy-policy`, `terms`, `blog/` with four articles,
  and `reena-kaur.html` (23 Sep).
- `services.html` cut from 775 words to a routing hub so it stops competing with the
  pages it links to (253 words on 17 Sep; 407 after the 18 Sep pillar restructure; ~320 after its intro paragraph was removed on 22 Sep).
- Sitewide: full robots directive incl. `max-image-preview:large`, complete OG/Twitter
  blocks, linked JSON-LD `@graph` (LocalBusiness+PerformingGroup → WebSite → Person),
  `Service`/`FAQPage`/`BreadcrumbList`/`BlogPosting` schema, services nav dropdown,
  service links in every footer, `llms.txt`, AI crawlers explicitly allowed.
- **Wedding pillar architecture** (18 Sep) — `punjabi-wedding-entertainment/` added as a
  topical hub above the four performer pages. See "Information architecture" below.
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
- `netlify/functions/form-submission.js`: template, recipient and subject must not change.
  Only the transport was changed (3 Oct, Resend). See "Contact form" above.
- Never publish a price — pricing is bespoke, quoted per event. Package **names** are fine
  (30 Sep: Silver includes a dhol player, Gold includes a DJ); see `SEO-README.md` §5.
- The Ladies Sangeet **singers** are female; accompanying musicians including dholki
  players are not always. Do not over-claim this.
- No review/star schema — self-serving reviews are ineligible. See `SEO-README.md` §5.
- Do not repoint `--font-heading` / `--font-body` — `admin.html` and `quote.html` render
  the quote PNG against them. See "Design layer".
- Video `src` attributes are **case-sensitive on Netlify**. The files on disk mix
  `.mp4` and `.MP4`; Windows hides a mismatch that 404s in production. All references
  were audited and corrected on 18 Sep (5 in `index.html`, then the last 5 in
  `contact.html` and `videos.html`) — **re-check casing against disk whenever a video
  `src` is added or renamed**, because nothing local will warn you.

## Information architecture (18 Sep 2026)

The site is organised around **weddings as the primary topical pillar**, not around a
flat list of services. The Services dropdown, the footer service column, the visible
breadcrumbs and the JSON-LD all express the same tree:

```
services.html  (Punjabi Entertainment Services — routing hub, ~320 words)
│
├── punjabi-wedding-entertainment/        PILLAR — the whole wedding week
│   ├── ladies-sangeet.html
│   ├── punjabi-folk-singers.html         (nav label: "Punjabi Singers")
│   ├── dhol-players.html
│   └── punjabi-dj.html                   (nav label: "Punjabi DJ")
│
├── concerts.html                         PILLAR — deliberately NOT wedding-targeted
│
└── areas-we-cover.html                   PILLAR — UK/worldwide overview
```

**What this means in practice:**

- The four performer pages carry a **four-level breadcrumb** — Home / Services /
  Punjabi Wedding Entertainment / *page* — both visibly and in `BreadcrumbList`.
- The Services dropdown nests them under the hub using `.nav-dropdown-pillar` and
  `.nav-dropdown-child` (styles at the bottom of `css/components/header.css`). The
  classes sit on the `<a>`, not the `<li>`, so the CSS uses **no sibling or
  `:last-of-type` selectors** — the final child carries `.nav-dropdown-child--last`
  explicitly. If you add or reorder items, move that modifier.
- The footer service column mirrors it with `.footer-link--child`.
- `services.html` declares an `ItemList` whose first item is the hub, with the four
  performer services inside its `hasOfferCatalog`.

### `concerts.html` is a separate audience — keep it that way

Concerts and melas target **event organisers**, not couples. The page is written around
Punjabi cultural events, melas, South Asian festivals, community events and festival
singers, and its `Service` schema declares an organiser audience rather than a wedding
one. It contains exactly **one** mention of weddings, a deliberate contrast line.

> ⚠️ **Do not let the service pages drift into variations of "Punjabi wedding
> entertainment".** The four performer pages sit under the wedding pillar structurally,
> but three of them also serve non-wedding work, and `concerts.html` must not be
> rewritten toward weddings at all. Structure says where a page sits; it is not a claim
> that the page is wedding-only.

### `areas-we-cover.html` is an overview, not a location-keyword page

Restructured on 18 Sep because it read as location keyword coverage. Rules:

- Region sections are **UK-wide → London & South East → Midlands → North of England →
  Scotland → Wales → Northern Ireland → International Bookings**.
- Each region gets a short paragraph about **how booking there actually works** —
  venue constraints, travel, lead time — and **no place names in the prose**.
- Place names live in a single set-apart `Regular areas include:` line per region.
- Dedicated city pages (London, Birmingham, …) are only worth creating where there is
  **substantial unique information** to put on them. Do not spin up thin city pages.

---

## Reena Kaur page (23 Sep 2026) — `reena-kaur.html`

Reena's entity page, written from a biography she supplied. It uses the article layout
below (sticky rail, 704px measure), with the breadcrumb **Home / Meet the Team / Reena
Kaur**. The nav keeps "Meet the Team" active.

- **Two voices, in this order.** First a third-person `.standfirst-note` (the entity
  definition, echoing the homepage's "Meet Reena Kaur" band) and an "At a glance"
  `.fact-list`. Then `.story-intro` hands over to **her own first-person story**.
  Keep the story in her voice and the standfirst in the third person.
- **The standfirst is mirrored word for word in the `Person` schema `description`.**
  Change both together.
- **It is now the `Person` entity's `url`** (`#reena-kaur`) on this page, `index.html`
  and `team.html`. The page declares a `ProfilePage` with that `Person` as `mainEntity`.
- **Years: "more than 25"**, like the rest of the site, although her own text says 26.
  That is an open question for Reena (`SEO-README.md` §5). Change it sitewide or not at all.
- **Only facts she gave.** Her grandad's dholki, the mandir and bhajans, Mary Kay and
  bridal make-up, a first concert of 10,000+, a largest audience of 50,000+, releases on
  streaming platforms, TV appearances (unnamed), single motherhood, a letter from the
  Queen. Added 30 Sep from her feedback: **she plays the dholki as well as sings**, and her
  dholki videos on YouTube have attracted a lot of views (no figure given, so none is
  stated). Do not add named venues, channels or press she has not supplied.
- **Her own wording, 30 Sep.** H1 is her name with "Punjabi Folk Singer" under it (she did
  not want "Sangeet Performer"; the title tag follows). Audience range is "From intimate
  gatherings of 50 guests to stages in front of 50,000 people". The first concert (10,000+)
  lives in her story only, not "At a glance". Where she is named as founder, the company is
  **Punjabi Folk Entertainment Ltd**.
- **The name treatment** is `.profile-name` / `.profile-name-title`: Cormorant Garamond 600
  capitals, loaded on this page only via its Google Fonts link. The subtitle is a `<span>`
  inside the `<h1>`, so the heading still says what she does.
- **Western photos only on this page (Reena, 6 Oct).** She asked for "only western pictures
  on this page, just so it's different from the other pages and who I am". Performance
  shots in Asian dress belong on the service pages and the gallery, not here. Current set:
  page head = faded greyscale crop of her **afternoon tea** photo (she asked for it there);
  opening pair = at the **beach** and singing in her **home studio** (a tumbi photo was
  tried first and rejected as not western enough); the childhood
  school photo floated beside "Music was woven into my childhood"; a solo iced-coffee holiday photo
  (cropped from IMG_6943; Jayden wants her alone here) floated beside "From intimate gatherings…" (same `.article-figure--aside`); a
  family photo; and an
  evening-out / waterfall ("Travelling.") pair under "Away from the stage". The Wolverhampton
  Mela photo was removed from this page (still on concerts.html). **The family photo shows
  her in a lehenga** and is the one image left that may break her rule; she did not flag it.
  The page head uses `.page-head--photo` / `.page-head-photo` (`mix-blend-mode: multiply`,
  so it can only darken the crimson and never lowers text contrast).
- **`.profile p { text-wrap: wrap }` (6 Oct).** Safari's `text-wrap: pretty` (on every `p`
  sitewide) evens out whole paragraphs, so on an iPhone this page's long story paragraphs
  stopped well short of the right edge. Chrome only adjusts the last lines, so nothing
  local shows it. Scoped to this page only; check an iPhone before changing it sitewide.
- **Removed on Jayden's request (3 Oct):** the floated *Desaan Da Raja* video (the
  childhood photo took its slot), the "Singing for film director Gurinder Chadha" graphic,
  and the Taj Mahal photo (replaced by the evening-out shot). The video is still in the gallery;
  the Gurinder Chadha graphic left the gallery too on 6 Oct. Do not put them back on this page.
  Files are in `assets/images/reena-kaur/`. Captions avoid naming anyone, because she has
  not said who is in them: confirm before adding names or relationships.
- Styles are **section 18 of `redesign.css`**: `.fact-list` (a `<dl>`, one column with a
  gold label per row since 30 Sep), `.pull-quote`,
  `.article-figure--aside` and `.profile-links`. `.article-figure--aside` floats a small
  figure (17rem) beside the prose from 640px and is capped and centred below that;
  `.profile .h-section` clears the float. It replaced `.article-video`, which was removed
  with the video on 3 Oct. The `.page-head-photo` rules sit at the end of the section.
- Linked from the homepage band ("Read Reena's story"), her card on `team.html`, and an
  **"About Reena Kaur"** link under "Meet the Team" in every footer's Quick Links.

---

## Article layout (18 Sep 2026) — service pages, wedding hub, blog

The six service pages and the four blog articles previously centred an **820px
column inside a 1200px container**, leaving ~160px dead either side on desktop and
far more on a wide monitor. Widening the prose was not the fix — 820px is already
at the top of a comfortable measure. Instead the side space now carries a **sticky
rail**, and the prose sits at a 704px measure.

```html
<section class="article-section" style="padding: 3rem 0 4rem;">
  <div class="container">                 <!-- full 1200px, no 820px clamp -->
    <div class="article-layout">          <!-- grid: 1fr + 286px above 1024px -->
      <div class="article-main"> … </div> <!-- max-width: 44rem -->
      <aside class="article-rail">        <!-- sticky, top: 105px -->
        <nav class="rail-card">…on this page…</nav>
        <div class="rail-card">…related services (blog only)…</div>
        <div class="rail-card rail-cta">…get a quote…</div>
      </aside>
    </div>
  </div>
</section>
```

Classes live in an **ARTICLE LAYOUT** block at the bottom of `css/main.css`.
Single column below 1024px, where the TOC card is hidden — an index that sits
*after* the thing it indexes is no use. **The `.rail-cta` card is hidden there too**
(22 Sep, Jayden): stacked under the article, it put a second "Get a quote" button
~250px below the article's own on every service page. The closing section still ends
every page with one. The **wedding hub** has no FAQ band, so its article-end button sat
~390px above the closing CTA; that button carries `.cta-hide-mobile` (main.css) and is
hidden below 1024px. The selector is `.btn.cta-hide-mobile` because `redesign.css` loads
later and sets `.btn` to `inline-flex`. A plain class loses and the button stays.

**Service pages open with what we provide, not a definition** (22 Sep, Jayden). Ladies
Sangeet, Punjabi Folk Singers and Dhol Players used to start with "A Ladies Sangeet is…",
"A Punjabi folk singer performs…" and "The dhol is…". Those are gone. Definitions live
in the FAQs and the blog, where informational searches land. Each standfirst is mirrored
word for word in the page's `Service` schema `description`: change both together.

**Card images:** `services.html` cards are a fixed 200px window with `object-fit:
cover`, which centres the crop. For a tall portrait that lands on the torso, so the
Ladies Sangeet card sets `object-position: center 15%` inline to keep Reena's face in
frame. Do the same for any tall shot added to a card.

> ### ⚠️ `overflow-x`, `position: sticky` and scrolling
>
> This has bitten three times. Read before touching any `overflow-x` rule.
>
> **1. `hidden` makes an element a scroll container.** A scroll-container
> ancestor silently disables `position: sticky` for every descendant — no error,
> the element just scrolls away. This is what stopped the article rail sticking.
>
> **2. `clip` does not create a scroll container** — so it fixes sticky. But on
> `html` or `body` it creates a worse problem.
>
> **3. The viewport takes its overflow from `html`, or from `body` when html is
> `visible`.** So *any* non-visible `overflow-x` on either one propagates to the
> viewport and the document stops being a scroll container. Wheel scrolling still
> works, which is why it is easy to miss, but programmatic scrolling becomes a
> silent no-op.
>
> **The arrangement that satisfies all three, and must stay:**
>
> | Selector | Rule | Why |
> |---|---|---|
> | `html`, `body` | **no `overflow-x` at all** | anything here propagates to the viewport |
> | `main`, `.site-footer` | `overflow-x: clip` | not the root, so nothing propagates; `clip` never creates a scroll container, so sticky is safe |
> | `.site-header` | `overflow-x: clip` **at ≤1024px only** | on the desktop layout Safari (iPad) clips the Services dropdown at the header edge when the header has `overflow-x: clip`, even with overflow-y visible. Chrome does not, so nothing local shows it (23 Sep) |
> | `section` (main.css + responsive.css) | `overflow-x: clip` | was `hidden`, which made every section a scroll container |
> | the article `<section>` | `class="article-section"` → `overflow: visible` | opts out entirely so the rail can stick. A class rather than `:has()`, so it does not depend on selector support |
>
> **Verify overflow with element rects, not `scrollWidth`.** `main` clips, so
> `document.documentElement.scrollWidth` cannot see overflow inside it and will
> report clean no matter what. Walk elements and compare `getBoundingClientRect().right`
> against the viewport width instead.

### Figures

`.article-figure` wraps in-article images; `.article-figure--portrait` caps a tall
portrait at `30rem` with `object-fit: cover`, because an unconstrained 1333×1999
shot ran to **1056px** in a 704px column. `.article-figure-pair` puts two portraits
side by side. The pre-existing hero figure on each service page was folded into the
same classes.

That cap shows only about half a portrait's height in the 704px column, so **check which
half**. `.article-figure--focus-low` anchors the crop at 88%. It was made for the beach baraat;
nothing uses it since that photo left the service pages (19 Oct). A one-off position goes
inline on the `<img>`, as with the services cards.

**Dhol Players baraat photo (7 Oct, Reena):** the beach baraat was replaced on
`dhol-players.html` (then on the wedding hub and the blog dhol guide too, 19 Oct; the
beach photo is now only a gallery tile) by her IMG_8121 (`assets/images/services/dhol-players-baraat-white-horse.jpg`,
inline `object-position: center 70%` so the white horse stays in frame). She said the
colours and lighting looked wrong. The original was over-processed, with a yellow-green
midtone cast, neon blues, orange skin and crushed shadows. It was corrected with sharp:
cast neutralised, saturation ×0.85, shadows lifted and highlights eased. The original
(`Downloads/IMG_8121 REENA KAUR.jpeg`) is not in the repo.

Every `<h2>` in `.article-main` carries a slug `id`, which the rail links to and
which gives the pages jump anchors. If you add an h2, add it to the rail list.

---

## Design layer (Sept 2026) — sitewide

A visual redesign sits on top of the SEO rebuild in **`css/redesign.css`**. As of
18 Sep it covers **every public page**. The only exclusions are `admin.html` and
`quote.html`, which must keep Playfair/Poppins because the Save-image quote PNG is
rendered by html2canvas against `--font-heading` / `--font-body`.

### Inner pages: `.page-head`

**Changed 22 Sep at Jayden's request: inner-page headers are crimson again**, using
`--gradient-primary` (the same gradient as the buttons and the closing CTA), not ink.
Jayden wanted a lighter red that matches the rest of the site. The homepage hero is
unaffected. Text on it is picked for crimson and measured at the light end of the
gradient: H1 white 5.8:1, lead `#FDF1E6` 5.3:1, eyebrow `#FFE9A8` 4.9:1. **Do not put
`--gold-leaf` or `--on-ink-muted` back on it**; they fail at 2.6:1 and 3.0:1. The
`::after` crimson fade is switched off because it is invisible on crimson.

(Previous rationale, kept for context: inner pages opened on ink to match the homepage
video, because a crimson header competed with the crimson closing CTA.)

**Padding is equal above and below** (`clamp(3rem, 2.2rem + 3vw, 5rem) 0`, 76px each
at 1358px). It used to be 120px above and 64px below on the theory that it had to clear
the fixed header, but `body` already reserves those 88px, so the text sat visibly low.
When measuring, note that `.page-head .container` is `.scroll-animate`: it starts
`translateY(30px)` and only settles once the animation runs. A background or hidden
tab pauses that, so a test there reads 106/46 instead of 76/76. Add `.active` to the
container before measuring.

### Homepage hero is centred (22 Sep)

Changed from left-aligned at Jayden's request. `.hero-inner` is centred, with its
children given auto side margins through `.hero-section .hero-inner > *`. The prefix
matters: section 14's `.hero-support`/`.hero-title` rules come later and would otherwise
pin those lines to the left. The scrim went from left-dark/right-clear to a
**centre-weighted radial**, so the text column stays darkest. Measured afterwards:
every line has 0px centre offset, and the hero is still **exactly 600px** at 1358 and
1876px wide.

`.page-head h1` is deliberately **a step below `--step-h1`** (~50px against the hero's
88px at 1440px). The hero is the thesis; an inner header is a signpost and must not
out-shout it. Measured page-head heights are 311–433px, all under the 600px hero.

### What the rollout changed on each page

| | |
|---|---|
| Google Fonts link | Playfair/Poppins → Fraunces + Karla |
| `redesign.css` | added **last**, after `responsive.css` |
| Logo | inline `height: 75px` removed — this is what fixed the 20px header overlap on all 20 pages |
| Nav CTA | "Book Now" → "Check your date" |
| Hero | crimson-gradient `<section style=...>` → `.page-head` with eyebrow + beat rule |
| Closing CTA | crimson-gradient section → `.closing` |
| Section grounds | inline backgrounds → `.band band--cream` / `--blush` / `--white` |
| Headings | 107 inline `font-size: 2rem; color: …` → `.h-section` / `.h-panel` |
| Standfirst | inline bordered callout → `.standfirst-note` |
| Tick glyphs | `--color-secondary` (1.4:1) → `.tick` (`--gold-deco`), `aria-hidden` |
| Back-to-top | `↑` glyph → inline SVG, 48px target |

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

`hero-video1.mp4` carries `preload="none"` so it does not compete for bandwidth with the
clip on screen; it is `.load()`ed by the rotation script when clip 1 ends. Until 22 Sep it
also had its `moov` atom at the end of a 142MB file. It is now 29MB, fast-start, with no
audio track.

### Video files (22 Sep)

Every video was re-encoded where it saved ≥20% (site total 638MB → 370MB), and **all are
fast-start**. Recipe, per-file sizes and the colour verification are in `SEO-README.md`
§5 → "Video optimisation". Originals are backed up at `Downloads/Reena-seo-video-originals/`.

- **Never let ffmpeg touch colour.** No `-vf` on a re-encode; read each file's
  `colorspace`/`color_trc`/`color_primaries`/`color_range` and write them back. Two
  special cases: `hero-video1.mp4` is untagged (leave it untagged), and
  `testimonial-5.mp4` is tagged HLG/BT.2020 (keep those tags).
- **Posters** are `<clip>-poster.jpg` beside each clip, taken from frame 0 of that clip.
  They are in git-ignored `assets/videos/`, so, like the videos, only the CLI deploy ships them.
- **ARIA**: content videos carry an `aria-label`; the two hero clips are
  `aria-hidden="true"` because they are decoration. Name a person in a label only if the
  clip itself names them on screen.

### Header height

The bar is `60 + 24 + 1 = 85px` and `body` reserves `88px`. It previously carried an
inline `height: 75px` on the logo, making the bar 100px against 80px of reserved space,
so the top 20px of every page sat behind it. **Fixed sitewide on 18 Sep** — measured
86px against 88px reserved on all 20 converted pages. `admin.html` and `quote.html`
never had the inline height.

### Homepage SEO copy classes (18 Sep)

Section 14 of `redesign.css` adds four classes used by the homepage rewrite:

| Class | Use |
|---|---|
| `.hero-support` | The old H1 ("Bringing Punjab's Soul to Your Celebration") kept as a gold italic supporting line under the new descriptive H1 |
| `.standfirst` | The third-person Reena Kaur entity paragraph opening the "Meet Reena Kaur" band |
| `.prose--centred` | Centred prose block used by the "Punjabi Entertainment for Weddings, Events & Celebrations" band |
| `.btn-ghost-ink` | Ghost button for **light** grounds — `.btn-ghost` is built for the ink ground and its translucent white hairline vanishes on blush/white/amber |

The H1 change made the hero 15px taller than its 600px pin, which re-crops the video.
`.hero-title` was given `max-width: 30ch` and the supporting line was kept small to pull
it back. **Measured: hero exactly 600px with 49px of slack at 1876px wide.** If you edit
hero copy again, re-measure rather than assuming.

### Accessibility floor (18 Sep)

Now enforced sitewide by `redesign.css`, not per page:

- **Contrast**: measured across all 20 converted pages with a gradient-aware checker —
  **zero failures** against WCAG AA. The legacy `--color-secondary` `#FFD700` was
  carrying text in three places it should never have: `team.html` role labels at
  **1.40:1 on white** (now `.team-role`, `--gold-ink`), and two eyebrows at 4.17:1 on
  crimson (now `#FFE9A8`, 7.1:1). **Never let `#FFD700` carry text.**
- **Focus**: `:focus-visible` only, so a mouse click no longer fires a ring. Gold ring
  on light grounds, `#FFE9A8` on ink/crimson/footer.
- **Touch targets**: footer links, breadcrumbs, dropdown items and social icons get
  padding to ≥44px under `@media (pointer: coarse)` only — desktop rhythm untouched,
  and inline prose links are excluded because padding them wrecks line spacing.
- **Reduced motion**: a global `prefers-reduced-motion` block pins scroll-reveal
  elements to their final state. Without it they would never appear, since the reveal
  is what sets opacity.
- **Mobile nav**: the slide-in panel had inherited the desktop dropdown wholesale.
  A floating menu's `white-space: nowrap` clipped "Punjabi Wedding Entertainment" off
  the panel edge, and the pillar/child hairline tree read as fussy at phone size where
  there is no hover to explain it. Section 16 of `redesign.css` gives the panel one
  indent level, no connector rules, and no "All services" row — tapping **Services**
  goes there, so it was saying the same thing twice.
  **30 Sep: the Services list is collapsed on mobile** behind a chevron button that
  `js/navigation.js` (`initMobileSubmenus`) inserts after the link. Open, it pushed
  Gallery, Meet the Team, Blog and Contact below the fold on a phone, and Reena reported
  seeing only "Home" and "Services". Without JS the list stays open. Desktop hides the button.
- **No emoji as icons** on any public page.

### Signature: the beat rule

`.beat-rule` is eight marks — the cycle Punjabi folk is played over — with the first
(*sam*) and fifth (*khali*) weighted. It replaces the 80px gold bar that used to sit
under every section title, and animates once on hero load. Reduced motion pins it open.

### Gallery mosaic (`gallery.html`, 21 Sep)

The page was **renamed from Videos to Gallery** on 21 Sep: file, nav and footer labels,
title, H1, canonical, breadcrumb, both sitemaps and `llms.txt`. `/videos.html` and `/videos`
301 to `/gallery.html` in `netlify.toml` because the old URL was indexed. Keep those redirects.

Photos and videos share **one grid** (`.mosaic-grid` in `css/components/gallery.css`)
instead of a video row above a photo grid. Tiles are `.g-tall` (1 col), `.g-wide`
(2 cols) or `.g-feature` (2×2); every row is the same height, derived from column
width with `cqw` units so a tall tile stays 2:3. **The source order is hand-arranged
to fill 4 columns with no holes** — adding, removing or reshaping a tile means
re-checking the rows (walk tile rects, as for overflow). `grid-auto-flow: dense`
handles the 2-column reflow under 640px. Videos are `preload="none"` with a
`-poster.jpg` and are played by the IntersectionObserver in `js/gallery.js`
(threshold 0.3, because a feature tile can be taller than the viewport); no
autoplay under reduced motion. **Load more:** tiles with `data-batch="2"`/`"3"` are
hidden until the button is pressed; each batch must end on a complete 4-column row
(currently tiles 1-12, 13-20, 21-25). Without JS all tiles show. `.g-contain` letterboxes
a tile instead of cropping it; nothing uses it since the Gurinder Chadha graphic was removed
(6 Oct, with one of the two near-identical Gurinder Chadha selfies and the signage photo, which was
also taken out of the Sangeet/Mehndi/Jago blog post; its file is now unused). To keep the rows full, the Mehndi group photo became
a `.g-wide` tile with `object-position: center 28%` to keep the faces in frame.

### Removed on purpose — do not reinstate

- The `.hero-overlay` rules and their six `!important` media-query repeats in
  `main.css` / `responsive.css`. They only fought each other. The hero scrim is now
  `.hero-scrim` in `redesign.css`.
- `.hero-section p { display: none !important }` below 480px, which was deleting the
  hero subheading on small phones.
