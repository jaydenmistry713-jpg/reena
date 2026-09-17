# `seo-changes.txt` — item-by-item status for this site

Reference guide: `C:\Users\jayde\Desktop\buildsbyleo\seo-changes.txt` (89 numbered items).

**Read this before re-reading that guide.** It records what was already applied to
punjabifolkentertainment.com on 17 Sep 2026, so nothing already handled gets suggested
again. Legend:

- **DONE** — applied in `Desktop/Reena-seo`, live once deployed
- **N/A** — the item describes something that does not exist on this site
- **SKIPPED** — considered and deliberately not done (reason given)
- **OPEN** — genuinely still to do

---

## Site structure (1–5)

| # | Item | Status |
|---|------|--------|
| 1 | Split one page covering several services into dedicated pages | **DONE** — `services.html` split into `ladies-sangeet`, `punjabi-folk-singers`, `dhol-players`, `punjabi-dj`, `concerts` |
| 2 | Keep the original page as a routing hub, cut its detail back | **DONE** — 775 words → 253-word hub |
| 3 | Remove duplicated service summaries from other pages | **DONE** — homepage cards trimmed to 3, linking out instead of restating |
| 4 | Keep shared content in one place with short highlights + link | **DONE** — travel/pricing/line-up text is one shared block reused per page |
| 5 | Considered a `/services/` subfolder, decided against | **SKIPPED** — same conclusion; no ranking benefit, hierarchy already in nav, breadcrumbs and schema |

## Content (6–11)

| # | Item | Status |
|---|------|--------|
| 6 | Expand thin pages to 750–950 words | **DONE** — service pages are 791–928 words |
| 7 | Write around pre-booking buyer questions | **PARTIAL / OPEN** — covered what's included, line-up, travel, booking, music. **Still missing: set lengths, space & power requirements, setup time, deposit/cancellation.** Awaiting facts from Reena. |
| 8 | FAQ section on every service page | **DONE** — 6–7 per service page, plus a 19-question `faq.html` |
| 9 | Add a regional/alternative name to capture a higher-volume synonym | **DONE** — "dholki" / "dholki night" added to the Ladies Sangeet page (was ranking 2.4 for `dholki hire` with zero clicks) |
| 10 | Correct inaccurate product claims; never use a term that isn't strictly true | **DONE** — "female-only performers" was wrong and is corrected: singers are female, accompanying musicians incl. dholki players are not always |
| 11 | Remove placeholder TODO text from copy and from structured data | **DONE** — no placeholders; alt text like "Punjabi folk performance moment 9" replaced |

## Titles, descriptions & meta (12–17)

| # | Item | Status |
|---|------|--------|
| 12 | Unique title, under 60 chars | **DONE** — all 17 indexable pages, 42–56 chars |
| 13 | Unique description, under ~165 chars | **DONE** — 117–164 chars |
| 14 | Geographic keyword in service page titles, homepage broad | **DEVIATED ON PURPOSE** — geo was added, then removed at Jayden's request because Reena performs internationally and "UK" in titles worked against that. Geography still signalled via `areaServed: [UK, Worldwide]`, `areas-we-cover.html` and the Google Business Profile. **Do not re-add "UK" to titles.** |
| 15 | Canonical on every page | **DONE** |
| 16 | OG and Twitter tags in sync with title/description | **DONE** — verified programmatically across all 21 pages |
| 17 | `og:site_name` sitewide | **DONE** |

## Structured data (18–24)

| # | Item | Status |
|---|------|--------|
| 18 | `Service` schema on each service page | **DONE** |
| 19 | `BreadcrumbList` on each service page | **DONE** — on every subpage, with visible breadcrumbs too |
| 20 | `FAQPage` on service pages and contact page | **DONE** — service pages, `faq.html`, `areas-we-cover.html`, `contact.html` |
| 21 | `WebSite` schema on homepage linked by `@id` | **DONE** — `@graph` of LocalBusiness+PerformingGroup → WebSite → Person, all `@id`-linked |
| 22 | Explicit `logo` property on the business schema | **DONE** |
| 23 | Offer catalogue on the homepage | **DONE** — `hasOfferCatalog` listing all five services |
| 24 | Did NOT add `VideoObject` to decorative background clips | **SKIPPED** — same reasoning, they are not the page's main content |

## Internal linking (25–31)

| # | Item | Status |
|---|------|--------|
| 25 | Nav dropdown listing every service page, on every page | **DONE** |
| 26 | All service pages in the footer sitewide | **DONE** |
| 27 | Homepage links directly to each service page | **DONE** — 3 cards deep-link; Ladies Sangeet and Concerts reachable via nav + footer (Jayden chose to keep only 3 cards) |
| 28 | Replace vague anchor text ("Learn more") | **DONE** — now "Dhol players for hire", "Punjabi DJ services" etc. |
| 29 | Use the higher-volume phrase as the link label | **DONE** — "Punjabi folk singers" rather than "Singers" |
| 30 | Find and fix dead `#anchor` fragment links | **DONE** — link checker covers fragments; 999 links/assets all resolve |
| 31 | Visible breadcrumb navigation on new pages | **DONE** |

## Crawling & indexing (32–36)

| # | Item | Status |
|---|------|--------|
| 32 | Every new page in `sitemap.xml` | **DONE** — 5 URLs → 17 |
| 33 | Refresh `lastmod` | **DONE** — was 2025-11-16, now current |
| 34 | robots.txt allows crawling and declares the sitemap | **DONE** — rewritten; `Crawl-delay: 5` removed (Bing obeyed it and throttled crawl), both sitemaps declared, AI crawlers explicitly allowed |
| 35 | Private/admin pages stay noindex and out of the sitemap | **DONE** — `admin`, `quote`, `privacy-policy`, `terms` |
| 36 | Resubmit sitemap, request indexing for new URLs | **OPEN** — cannot be done until the site is live. Order is in `SEO-README.md` §2 |

## Image SEO (37–42)

| # | Item | Status |
|---|------|--------|
| 37 | Rename generic image files descriptively | **DONE** — `event-1.jpg` → `sangeet-singing-dholki-guests-clapping.jpg`, 27 files |
| 38 | Replace placeholder alt text | **DONE** — all 12 "performance moment N" replaced with real descriptions |
| 39 | Alt text specific and natural, not keyword stuffed | **DONE** — written after viewing each photo |
| 40 | Use `git mv` to preserve history | **DONE** — though later recompression means git records some as add+delete |
| 41 | Verify every image path matches the real filename, case-sensitively | **DONE** — 5 case mismatches found and fixed (`event-3.jpeg` vs `.JPEG` etc). Netlify happened to serve them anyway, but they were wrong |
| 42 | Replace placeholder photography with genuine photos | **N/A** — all photography was already genuine |

## Performance (43–51)

| # | Item | Status |
|---|------|--------|
| 43 | Compress images, preserve colour profile | **DONE** — 23.4MB → 9.3MB, ICC profiles kept |
| 44 | Keep colour profile, strip EXIF | **DONE** |
| 45 | Compress video | **OPEN** — 563MB of video untouched. Biggest remaining performance win |
| 46 | Tag video colour space explicitly, check for HDR | **OPEN** — depends on 45 |
| 47 | Strip audio from muted background video | **OPEN** — depends on 45 |
| 48 | Keep lazy loading on images and videos | **DONE** — `loading="lazy"` on all new content images |
| 49 | Poster frames on lazy-loaded videos | **OPEN** — gallery/testimonial videos have no `poster` |
| 50 | Exclude large source media from repo and deploy | **PARTIAL** — `assets/videos/` is git-ignored, but videos must ship in the deploy (site needs them). No camera originals in the repo |
| 51 | Bump cache-busting version on CSS/JS | **DONE** — `?v=20260917f` |

## Accessibility / UX (52–54)

| # | Item | Status |
|---|------|--------|
| 52 | Fix low-contrast nav text on dark hero images | **N/A** — nav sits on a solid white header here |
| 53 | aria-labels on video elements | **PARTIAL** — sound/play controls have `aria-label` and it now updates on toggle; the `<video>` elements themselves do not. **OPEN** |
| 54 | Card grids centre their last row | **DONE** — `.grid-centred` added |

## Not done, and why (55–57) — all still apply

| # | Item | Status |
|---|------|--------|
| 55 | FAQ schema will NOT produce FAQ rich results | **UNDERSTOOD** — kept for parsing and AI assistants. Do not expect listing changes |
| 56 | No review star ratings without genuine reviews | **CONFIRMED, different reason** — there ARE 32 genuine Google reviews (5.0, Elfsight widget). Still not marked up: Google treats reviews about the entity controlling the page as **self-serving** and made them ineligible for star rich results in Sept 2019. `aggregateRating` would produce no stars and risks a manual action. **Do not add it.** |
| 57 | Sitelinks can't be forced | **UNDERSTOOD** — no action possible |

## Key principles (58–62)

| # | Principle | How it was applied |
|---|-----------|--------------------|
| 58 | One page, one primary search intent | Drove the 5-way split and keeping `services.html` as a hub |
| 59 | Depth beats breadth | 791–928 word pages rather than more thin ones |
| 60 | Fix the landing page before blaming rankings | Drove the title rewrites — `punjabi entertainment` was pos 5.79 with 0% CTR |
| 61 | Sitemaps aid discovery, don't rank | Informed effort allocation |
| 62 | Never publish claims that aren't verifiably true | Drove removing `priceRange`, the female-performer correction, and refusing to invent set lengths or prices |

## Image thumbnails in search (63–68)

| # | Item | Status |
|---|------|--------|
| 63 | Diagnose missing photo thumbnails | **DONE** — cause was the missing directive, as the guide predicted |
| 64 | Add `max-image-preview:large` to every indexable page | **DONE** — all 17. Four pages previously had **no robots meta at all** |
| 65 | Note that CMS plugins emit this for free | **UNDERSTOOD** — hand-coded site, hence the omission |
| 66 | Use the full directive set | **DONE** — `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |
| 67 | Document the rule for new pages | **DONE** — `SEO-README.md` §6 and `CLAUDE.md` |
| 68 | Leave noindex pages without it | **DONE** |

## Image signals feeding the preview (69–73)

| # | Item | Status |
|---|------|--------|
| 69 | Find `og:image` set to the logo | **DONE, and worse** — homepage `og:image` pointed at `/assets/images/hero/home-hero.jpg`, which **404s**. Four other pages had no OG tags at all |
| 70 | Point OG/Twitter at a real photograph, add `og:image:alt` | **DONE** — nine 1200×630 images generated in `assets/images/og/` |
| 71 | Audit for pages declaring the wrong photo | **DONE** — checked every page |
| 72 | Structured data `image` as an array of 2–4 photos | **DONE** — three photos, differing ratios |
| 73 | Keep `logo` as the logo, `image` as photography only | **DONE** — they previously held the same file |

## Image sitemap (74–77)

| # | Item | Status |
|---|------|--------|
| 74 | Image sitemap namespace, image entry per page | **DONE** — `sitemap-images.xml`, 9 pages, 41 images |
| 75 | Emit only the image location tag | **DONE** — no deprecated caption/title/geo tags |
| 76 | Generate from live markup, not by hand | **DONE** — generated from the HTML; logos, OG images and icons excluded |
| 77 | Re-verify filenames case-sensitively, re-parse JSON-LD | **DONE** — both automated |

## Diagnosing why a page isn't ranking (78–82)

| # | Item | Status |
|---|------|--------|
| 78 | Distinguish unknown / crawled-not-indexed / indexed | **OPEN** — do at go-live. `contact.html` and `team.html` have **zero impressions**, so check those first |
| 79 | Don't tune rankings for a page that isn't indexed | **UNDERSTOOD** |
| 80 | Read the Discovery rows | **OPEN** — at go-live |
| 81 | Check Last crawl date to learn crawl frequency | **OPEN** — at go-live |
| 82 | Record exact pre-submission state | **DONE** — baseline captured in `SEO-README.md` §4 (179 clicks, 3,453 impressions, 5.18% CTR, per-device and per-page, plus 9 target queries with starting positions). Search Appearance report was **empty** — no rich results firing |

## URL format (83–85)

| # | Item | Status |
|---|------|--------|
| 83 | `.html` extension has no ranking effect | **UNDERSTOOD** — extensions kept |
| 84 | Both extension and extensionless forms return 200 | **CONFIRMED HERE TOO** — `/services` and `/services.html` both 200; canonical resolves it. No action needed |
| 85 | Changing URL format is cheapest before indexing | **UNDERSTOOD** — new pages keep `.html` for consistency |

## Further principles (86–89)

| # | Principle | Note |
|---|-----------|------|
| 86 | Markup makes a result eligible, never forces it | Set expectations: weeks, and only after a re-crawl |
| 87 | Verify directives on the deployed site, not just in source | **DONE throughout** — every claim in this project was checked with `curl` against the live or preview URL, not just the files |
| 88 | A competitor's better result usually has one identifiable mechanism | Applied to the thumbnail and favicon diagnoses |
| 89 | Distinguish the page result from the business profile result | Directly relevant to item 56 — the 5.0/32 belongs to the Google Business Profile, not the page |

---

## Things done here that the guide does not cover

Found by inspecting this site specifically; not in `seo-changes.txt`:

1. **`/favicon.ico` returned 404 at the root** and the icon was 16×16 (Google needs a
   multiple of 48px). This is why the icon never appeared in Bing. Full icon set
   generated from the logo's chevron mark; `manifest.json` also pointed at two PNGs that
   never existed.
2. **An orphaned Cloudflare `email-decode.min.js` script** in `index.html`, 404ing on
   every homepage load. Removed.
3. **`ladiessangeetbyreenakaur.co.uk` serves a `*.stackcp.com` SSL cert** that doesn't
   cover it, so `https://` shows a browser warning before redirecting. That URL is on
   event signage. **OPEN** — fix in the 20i/StackCP panel.
4. **The services dropdown was clipped on desktop** by `overflow-x: hidden` on
   `.site-header` (which makes the browser compute `overflow-y` as `auto`). Fixed.
5. **`llms.txt` and explicit AI-crawler rules** — not in the guide, added for AI search.
6. **FAQ accordions** via native `<details>`/`<summary>`.
7. **Emoji replaced with inline SVG icons** sitewide.
8. **Internal markdown was publicly served** — `CLAUDE.md` was readable on the live site,
   exposing the Netlify site ID, env var names and the quote-page access-control note.
   Blocked in `netlify.toml`.
9. **The homepage title did not contain "Reena Kaur"** — her name is the #1 query
   (376 impressions, position 2.95) at only 4.52% CTR. Now leads the title.
