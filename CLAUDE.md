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
> - **The visual redesign is now sitewide** (18 Sep). Every public page uses
>   `css/redesign.css`; only `admin.html` and `quote.html` are deliberately excluded.
>   See "Design layer" below before touching CSS.
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
admin.html            Password-protected admin dashboard (inquiries + quotes)
quote.html            Customer-facing branded quote page
punjabi-wedding-entertainment/index.html
                      Wedding pillar hub, served at /punjabi-wedding-entertainment/
faq-review.html       INTERNAL. Reena's FAQ review checklist (noindex, unlinked). Generated,
                      never edit by hand: node tools/build-faq-review.js. See SEO-README §4b
tools/                Generators for internal pages. Blocked from being served (netlify.toml)
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

- **12 new pages.** Five service pages split out of `services.html`
  (`ladies-sangeet`, `punjabi-folk-singers`, `dhol-players`, `punjabi-dj`, `concerts`),
  plus `faq`, `areas-we-cover`, `privacy-policy`, `terms`, and `blog/` with four articles.
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
- `netlify/functions/form-submission.js` is untouched and must stay that way.
- Never publish a price — pricing is bespoke, quoted per event.
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
(currently tiles 1-10, 11-20, 21-26). Without JS all tiles show. The Gurinder Chadha graphic uses `.g-contain` so
its text is letterboxed rather than cropped.

### Removed on purpose — do not reinstate

- The `.hero-overlay` rules and their six `!important` media-query repeats in
  `main.css` / `responsive.css`. They only fought each other. The hero scrim is now
  `.hero-scrim` in `redesign.css`.
- `.hero-section p { display: none !important }` below 480px, which was deleting the
  hero subheading on small phones.
