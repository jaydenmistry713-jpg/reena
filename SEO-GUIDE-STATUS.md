# `seo-changes.txt` — item-by-item status for this site

Reference guide: `C:\Users\Jayden\Downloads\buildsbyleo\seo-changes.txt` (89 numbered items).

**Read this before re-reading that guide.** It records what was already applied to
punjabifolkentertainment.com on 17 Sep 2026, plus corrections from the 18 Sep redesign
pass and the 18 Sep architecture/audit pass, so nothing already handled gets suggested
again. Legend:

- **DONE** — applied in `Downloads/Reena-seo` (formerly `Desktop/`), live once deployed
- **N/A** — the item describes something that does not exist on this site
- **SKIPPED** — considered and deliberately not done (reason given)
- **OPEN** — genuinely still to do

---

## Site structure (1–5)

| # | Item | Status |
|---|------|--------|
| 1 | Split one page covering several services into dedicated pages | **DONE** — `services.html` split into `ladies-sangeet`, `punjabi-folk-singers`, `dhol-players`, `punjabi-dj`, `concerts` |
| 2 | Keep the original page as a routing hub, cut its detail back | **DONE** — 775 words → 253-word hub, rebuilt 18 Sep as a 407-word **three-pillar** hub (wedding / concerts+melas / locations). 22 Sep: the opening "two kinds of booking" paragraph was removed at Jayden's request; the page now opens straight onto the service cards (~320 words) |
| 3 | Remove duplicated service summaries from other pages | **DONE** — homepage cards trimmed to 3, linking out instead of restating |
| 4 | Keep shared content in one place with short highlights + link | **DONE** — travel/pricing/line-up text is one shared block reused per page. **22 Sep, at Jayden's request — it had not actually been done:** every service page still carried near-identical *Travel*, *Your line-up* and *Pricing and booking* sections. Travel and line-up are removed from all five service pages (and Travel from the wedding hub). Pricing is now one line — “Every booking is quoted individually, with travel included…” — plus a link to `faq.html`, which is the single home for lead times, travel and quoting. Page-specific detail kept: dhol's portability, concerts' festival lead time. Generic FAQs duplicated from `faq.html` removed from service pages (Ladies Sangeet: booking lead time, travel, sound equipment; Dhol: travel) and the cost answers no longer open with the pricing sentence. The “dholki players are not always female” point now appears once, in the Ladies Sangeet FAQ. **Rule: service pages carry only what is specific to that service; shared booking facts live in `faq.html`** |
| 5 | Considered a `/services/` subfolder, decided against | **SKIPPED** — same conclusion; no ranking benefit, hierarchy already in nav, breadcrumbs and schema |
| — | *(not in the guide)* Make weddings a topical pillar rather than a flat service list | **DONE 18 Sep** — `punjabi-wedding-entertainment/` added as a hub above Ladies Sangeet / Punjabi Singers / Dhol Players / Punjabi DJ, with Concerts & Melas and Areas We Cover as sibling pillars. Expressed in the nav dropdown, footer, 4-level breadcrumbs and `ItemList`+`hasOfferCatalog`. Tree in `CLAUDE.md` → "Information architecture" |
| — | *(not in the guide)* Keep `concerts.html` semantically separate from weddings | **DONE 18 Sep** — rewritten 849 → 1,429 words around Punjabi cultural events, melas, South Asian festivals, community events and festival singers. `Service` `audienceType` was wrongly "Weddings and private events"; now organiser-facing. Body now contains **one** wedding mention, a deliberate contrast line. **Do not drift this page toward weddings.** |

## Content (6–11)

| # | Item | Status |
|---|------|--------|
| 6 | Expand thin pages to 750–950 words | **DONE** — service pages were 791–928 words; after the 18 Sep pass they are 962–1,477, plus the 1,225-word wedding hub and a 928-word `areas-we-cover.html`. After the 22 Sep de-duplication: Ladies Sangeet 1,128, Punjabi Folk Singers 915, Dhol 840, DJ 832, Concerts 1,303, wedding hub 959 — still inside the target, with the boilerplate gone |
| 7 | Write around pre-booking buyer questions | **PARTIAL / OPEN** — covered what's included, line-up, travel, booking, music. **Still missing: set lengths, space & power requirements, setup time, deposit/cancellation.** Awaiting facts from Reena. |
| 8 | FAQ section on every service page | **DONE** — 6–7 per service page, plus a 17-question `faq.html` (19 until Reena's FAQ review on 22 Sep removed "What if our schedule runs late?" and "Do you offer MC services?") |
| 9 | Add a regional/alternative name to capture a higher-volume synonym | **DONE** — "dholki" / "dholki night" added to the Ladies Sangeet page (was ranking 2.4 for `dholki hire` with zero clicks) |
| 10 | Correct inaccurate product claims; never use a term that isn't strictly true | **DONE** — "female-only performers" was wrong and is corrected: singers are female, accompanying musicians incl. dholki players are not always |
| 11 | Remove placeholder TODO text from copy and from structured data | **DONE** — no placeholders; alt text like "Punjabi folk performance moment 9" replaced |

## Titles, descriptions & meta (12–17)

| # | Item | Status |
|---|------|--------|
| 12 | Unique title, under 60 chars | **DONE** — all 18 indexable pages, 35–59 chars. Five rewritten 18 Sep at Jayden's direction: `services` → "Punjabi Entertainment Services \| Reena Kaur", `ladies-sangeet` → "Ladies Sangeet Singers \| Reena Kaur", `punjabi-folk-singers` → "Punjabi Folk Singers \| Weddings & Events", `dhol-players` → "Dhol Players \| Punjabi Wedding Dhol", `concerts` → "Punjabi Singers & Entertainment for Melas". `<title>`, `og:title` and `twitter:title` were changed together — they must always match |
| 13 | Unique description, under ~165 chars | **DONE** — 117–168 chars, no duplicates across the site (verified programmatically 18 Sep) |
| 14 | Geographic keyword in service page titles, homepage broad | **DEVIATED ON PURPOSE** — geo was added, then removed at Jayden's request because Reena performs internationally and "UK" in titles worked against that. Geography still signalled via `areaServed: [UK, Worldwide]`, `areas-we-cover.html` and the Google Business Profile. **Do not re-add "UK" to titles.** Reconfirmed 18 Sep: a suggested "Dhol Players UK \| …" title had the "UK" struck out before it was applied. |
| 15 | Canonical on every page | **DONE** |
| 16 | OG and Twitter tags in sync with title/description | **DONE** — verified programmatically across all 21 pages |
| 17 | `og:site_name` sitewide | **DONE** |

## Structured data (18–24)

| # | Item | Status |
|---|------|--------|
| 18 | `Service` schema on each service page | **DONE**. The `description` is the page's standfirst verbatim. **22 Sep:** the definition sentences were dropped from Ladies Sangeet, Punjabi Folk Singers and Dhol Players (standfirst and schema together). Each now opens on what we provide, with "Punjabi folk singers" kept in the folk page's sentence for its target query |
| 19 | `BreadcrumbList` on each service page | **DONE** — on every subpage, with visible breadcrumbs too. The four wedding-pillar pages went to **four levels** on 18 Sep (Home / Services / Punjabi Wedding Entertainment / page). **No `BreadcrumbList` on the homepage** — it is the root, so the trail is one item and Google will not render it. **Audited 22 Sep, all 17 indexable pages now match visible ↔ schema exactly.** Three fixes: (1) three blog articles used the full title as the last schema crumb but a short name visibly — schema now uses the visible name; (2) `contact`, `gallery` and `team` had schema but no visible trail — visible `Home › …` trail added under the page head; (3) `areas-we-cover` skipped "Services" although the nav and IA tree put it there — now Home › Services › Areas We Cover, matching `concerts`. **`contact.html` lays `main` out as a grid** (desktop) / reordered flex column (mobile), so its breadcrumb wrapper carries `data-breadcrumb-row` and has its own grid row; anything else added directly inside that `main` needs a placement rule too |
| 20 | `FAQPage` on service pages and contact page | **DONE** — service pages, `faq.html`, `areas-we-cover.html`, `contact.html`. **Bug found and fixed 18 Sep:** `contact.html`'s schema questions were keyword-padded variants of the visible ones ("How far in advance should I book **Punjabi entertainment**?" vs the on-page "How far in advance should I book?"), with US/UK spelling drift in two answers — a direct breach of the "must match visible content" rule. Rebuilt from the accordion. All 8 `FAQPage` blocks now match question-and-answer exactly; **generate them from the markup, never by hand** |
| 21 | `WebSite` schema on homepage linked by `@id` | **DONE** — `@graph` of LocalBusiness+PerformingGroup → WebSite → Person, all `@id`-linked |
| 22 | Explicit `logo` property on the business schema | **DONE** |
| 23 | Offer catalogue on the homepage | **DONE** — `hasOfferCatalog` listing all five services. **Corrected 22 Sep:** until then every offer pointed at `services.html` and three names had drifted from the service pages ("Sangeet Singers", "DJ Services", "Concert Performances"). Each offer now carries the service page's own `@id` (`…/ladies-sangeet.html#service` etc.), its URL and its exact name. The organisation's own `areaServed` was also still UK-only, contradicting item 14 — now `[United Kingdom, Worldwide]`, matching every service page. `services.html` gained its own `ItemList` on 18 Sep with the wedding hub first and the four performer services nested in its `hasOfferCatalog` |
| 24 | Did NOT add `VideoObject` to decorative background clips | **SKIPPED** — same reasoning, they are not the page's main content. Also **not** added to `videos.html`, where the clips *are* the content: it needs a real `thumbnailUrl`, `uploadDate` and `duration` per video and those are not available. Supply them and it can be added |

## Internal linking (25–31)

| # | Item | Status |
|---|------|--------|
| 25 | Nav dropdown listing every service page, on every page | **DONE** — restructured 18 Sep so it nests: the wedding hub is a `.nav-dropdown-pillar` with four `.nav-dropdown-child` entries beneath it, then Concerts & Melas and Areas We Cover as sibling pillars. Classes are on the `<a>`, so the CSS uses no sibling/`:last-of-type` selectors and the last child carries `.nav-dropdown-child--last` — **move that modifier if you reorder** |
| 26 | All service pages in the footer sitewide | **DONE** — footer service column mirrors the nav nesting via `.footer-link--child` (18 Sep) |
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
| 34 | robots.txt allows crawling and declares the sitemap | **DONE** — rewritten; `Crawl-delay: 5` removed (Bing obeyed it and throttled crawl), both sitemaps declared, AI crawlers explicitly allowed. **22 Sep audit:** the `Disallow` lines for `admin`, `quote` and `faq-review` were removed. They hid those pages' noindex from Google; noindex is now sent as a header too. Only `/.netlify/` stays disallowed |
| 35 | Private/admin pages stay noindex and out of the sitemap | **DONE** — `admin`, `quote`, `privacy-policy`, `terms`, `faq-review`, `404`. `admin`/`quote`/`quote/*`/`faq-review` also send `X-Robots-Tag: noindex, nofollow` |
| 36 | Resubmit sitemap, request indexing for new URLs | **OPEN** — cannot be done until the site is live. Order is in `SEO-README.md` §2 |

## Image SEO (37–42)

| # | Item | Status |
|---|------|--------|
| 37 | Rename generic image files descriptively | **DONE** — `event-1.jpg` → `sangeet-singing-dholki-guests-clapping.jpg`, 27 files. Two stragglers were missed and renamed 18 Sep: `event-2.jpg` → `sangeet-singer-dholki-guests-seated.jpg`, `event-prev.jpg` → `mehndi-singer-dholki-henna-guest.jpg`. Both were unused on any page; they are now in the service and blog pages |
| 38 | Replace placeholder alt text | **DONE** — all 12 "performance moment N" replaced with real descriptions |
| 39 | Alt text specific and natural, not keyword stuffed | **DONE** — written after viewing each photo |
| 40 | Use `git mv` to preserve history | **DONE** — though later recompression means git records some as add+delete |
| 41 | Verify every image path matches the real filename, case-sensitively | **DONE** — 5 image mismatches fixed 17 Sep; videos were never checked until 18 Sep, when 5 were fixed in `index.html` and the last 5 in `contact.html` and `videos.html`. Nothing remains. See "Things done here" item 10 |
| 42 | Replace placeholder photography with genuine photos | **N/A** — all photography was already genuine |

## Performance (43–51)

| # | Item | Status |
|---|------|--------|
| 43 | Compress images, preserve colour profile | **DONE** — 23.4MB → 9.3MB, ICC profiles kept |
| 44 | Keep colour profile, strip EXIF | **DONE** |
| 45 | Compress video | **DONE 22 Sep** — site videos **638MB → 370MB**. Every clip was re-encoded (H.264, CRF 22 / 21 for the two hero clips, `-preset slow`, original resolution, frame rate and audio) and a re-encode was **kept only if it saved ≥20%**: 15 swapped, 9 left as they were (the new file came out the same size or larger). `hero-video1.mp4` went 142MB → 29MB and is now **fast-start** — every video on the site now has its `moov` atom first. Originals backed up outside the repo at `Downloads/Reena-seo-video-originals/`. Method and the colour check in `SEO-README.md` §5 |
| 46 | Tag video colour space explicitly, check for HDR | **DONE 22 Sep** — no colour conversion at all: no scale/colour filters, and each file's own `colorspace`/`color_trc`/`color_primaries`/`color_range` tags written back explicitly. Every swapped file probes with identical tags to its original, and the mean Y/U/V over 30 frames from the middle of the clip differs by **≤0.17 on a 0–255 scale** (invisible; ~1 would start to show). HDR check: all files are 8-bit 4:2:0. `testimonial-5.mp4` is **tagged HLG / BT.2020** (phone footage) and kept those tags. `hero-video1.mp4` has **no colour tags** and was deliberately left untagged — tagging it would change how browsers interpret it |
| 47 | Strip audio from muted background video | **DONE 22 Sep** — `hero-video1.mp4` only. It is the one clip that is always muted *and* had an audio track (`hero-video.mp4` never had one). Carousel, gallery and testimonial videos all have unmute buttons, so their audio stays |
| 48 | Keep lazy loading on images and videos | **DONE** — all in-article figures added 18 Sep are lazy. — `loading="lazy"` on all new content images; `team.html`'s ten member portraits were still eager-loading and were fixed 18 Sep. The only images without the attribute are the header logos, correctly |
| 49 | Poster frames on lazy-loaded videos | **DONE 22 Sep** — gallery videos got posters on 21 Sep; the 12 remaining (hero clip 1, the five homepage carousel clips, the six `contact.html` testimonials) got them on 22 Sep as `<name>-poster.jpg` beside each clip. Each is **frame 0 of its own clip**, so there is no jump when playback starts, converted with the clip's own matrix (BT.709, or BT.2020 for `testimonial-5`) rather than ffmpeg's BT.601 default. `hero-video1.mp4` has none — it is never the first thing on screen. Posters live under `assets/videos/`, which is **git-ignored**, so like the videos they only ship via the CLI deploy. History: a poster was once added to the hero and removed because it was an unrelated OG photo that replaced the opening frame. A poster must be a still **from that clip** |
| 50 | Exclude large source media from repo and deploy | **PARTIAL** — `assets/videos/` is git-ignored, but videos must ship in the deploy (site needs them). No camera originals in the repo |
| 51 | Bump cache-busting version on CSS/JS | **DONE** — now `?v=20260918g` on all 22 pages (`index.html` had been left on `20260918c` and was brought into line on 22 Sep). Bump **every** page when `main.css`/`responsive.css` change, not just the edited one |

## Accessibility / UX (52–54)

| # | Item | Status |
|---|------|--------|
| — | *(not in the guide)* Roll the design layer onto every page | **DONE 18 Sep** — all 20 remaining public pages. `admin.html`/`quote.html` excluded on purpose (quote PNG fonts). See `CLAUDE.md` → "Design layer" |
| 52 | Fix low-contrast nav text on dark hero images | **N/A** — nav sits on its own solid header, never over the hero. The logo is grey type on transparency, so the header cannot go transparent without a reversed logo asset |
| 53 | aria-labels on video elements | **DONE 22 Sep** — all 21 `<video>` elements now carry one or the other. The five homepage carousel clips and six `contact.html` testimonials got descriptive `aria-label`s written after viewing frames from each clip. The two hero clips got `aria-hidden="true"` instead: they are decoration behind the H1 and a screen reader should skip them, not announce "video" twice before the headline. Gallery labels already existed. **People are named only where the clip names them on screen** (the "Reena Kaur" watermark on `video-4`, the "Sahib – The Groom" and "Reena and Monica" captions) — never from a face. `video-5` is Reena speaking to camera — confirmed by Jayden 22 Sep, and named in its label. Previous state: **PARTIAL** — sound/play controls have `aria-label` and it now updates on toggle; the `<video>` elements themselves do not. **OPEN** |
| 54 | Card grids centre their last row | **DONE** — `.grid-centred` added |
| — | *(not in the guide)* Keyboard focus rings | **DONE SITEWIDE 18 Sep** — `main.css` fired an outline on every mouse click; `redesign.css` scopes it to `:focus-visible`, and every public page now loads it |
| — | *(not in the guide)* Touch targets ≥44px | **DONE SITEWIDE 18 Sep** — footer links, breadcrumbs, dropdown items and social icons padded to ≥44px under `@media (pointer: coarse)` only, so the desktop rhythm is unchanged. Inline prose links excluded (WCAG exempts them; padding wrecks line spacing) |
| — | *(not in the guide)* `prefers-reduced-motion` | **DONE SITEWIDE 18 Sep** — global block pinning scroll-reveal elements to their final state. Without it they would never appear at all, since the reveal is what sets opacity |
| — | *(not in the guide)* Contrast audit | **DONE 18 Sep** — gradient-aware checker across all 20 converted pages, **zero WCAG AA failures**. Three real violations fixed: `team.html` role labels at **1.40:1** and two eyebrows at 4.17:1 |
| — | *(not in the guide)* `width`/`height` on images to stop layout shift | **DONE SITEWIDE 18 Sep** — 61 images were missing them; real intrinsic dimensions were read from the files and written in. Measured CLS afterwards: **0.0005** homepage, **0.015** services (target < 0.1) |
| — | *(not in the guide)* Heading hierarchy without skipped levels | **DONE 18 Sep** — `contact.html` skipped h2→h4 and had a stray h3; `team.html` had ten h3 member names directly under the h1 with no h2. All headings carry inline styles, so the tag changes are visually identical. `404.html` still skips h1→h3 into the footer's h3s — cosmetic, and the page is `noindex` |

## Not done, and why (55–57) — all still apply

| # | Item | Status |
|---|------|--------|
| 55 | FAQ schema will NOT produce FAQ rich results | **UNDERSTOOD** — kept for parsing and AI assistants. Do not expect listing changes |
| 56 | No review star ratings without genuine reviews | **CONFIRMED, different reason** — there ARE 32 genuine Google reviews (5.0, Elfsight widget). Still not marked up: Google treats reviews about the entity controlling the page as **self-serving** and made them ineligible for star rich results in Sept 2019. `aggregateRating` would produce no stars and risks a manual action. **Do not add it.** **⚠ Found 22 Sep: the Elfsight widget injects review markup anyway.** Once it loads it adds a JSON-LD `Product` with `aggregateRating` 5.0/32, a `review` array and invented `mpn`/`sku` values. Google renders JavaScript, so this is what populates Search Console → Enhancements → *Review snippets*. It is not in any HTML file here, which is why earlier audits missed it; it only exists after the widget renders. The fix would be in the Elfsight dashboard (its rich-snippet / schema option), not in this repo. **Jayden decided on 22 Sep to leave the widget as it is**, so the Review snippets report will keep showing |
| 57 | Sitelinks can't be forced | **UNDERSTOOD** — no switch for them. Google shows them for navigational queries (brand/name searches) when it can see a clear structure. What helps is already in place: distinct titles per page, a consistent nav and footer on every page, matching breadcrumbs, a sitemap, and descriptive internal anchors. Nothing further to do except go live and let brand searches accumulate |

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
| 70 | Point OG/Twitter at a real photograph, add `og:image:alt` | **DONE** — nine 1200×630 images generated in `assets/images/og/`. **22 Sep:** every page's share card (`og:image` + `twitter:image`, all 21 pages that carry them) is now `og-reena-kaur.jpg`, at Jayden's request. On the homepage — a 1200×630 crop of Reena's studio portrait (face + signature), so `og:image`, `twitter:image` and the schema `primaryImageOfPage` all point at the same portrait rather than sending Google mixed signals. The per-page cards (`og-home`, `og-dhol`, `og-ladies-sangeet` …) are no longer share images but stay on disk: several are still the `image` in that page's `Service`/`BlogPosting` schema, where a photo of the actual service is the right choice. `admin.html` and `quote.html` have no share tags and were left alone |
| 71 | Audit for pages declaring the wrong photo | **DONE** — checked every page |
| 72 | Structured data `image` as an array of 2–4 photos | **DONE** — three photos, differing ratios. **22 Sep:** Reena's studio portrait (`assets/images/index/reena-kaur-portrait.jpg`) now leads the organisation's `image` array, is the `Person` image, and is declared as the homepage's `primaryImageOfPage` on a new `WebPage` node — Google's documented hint for which image to use as the search-result thumbnail. It is only a hint; Google chooses |
| 73 | Keep `logo` as the logo, `image` as photography only | **DONE** — they previously held the same file |

## Image sitemap (74–77)

| # | Item | Status |
|---|------|--------|
| 74 | Image sitemap namespace, image entry per page | **DONE** — regenerated 18 Sep from the markup: **14 pages, 66 images** (was 9/41). Growth is the gallery photography added to the service and blog pages. Regenerate it from the HTML rather than hand-editing. **3 Oct:** regenerated after Reena's new photos: **15 pages, 82 images**. **6 Oct:** regenerated after the western-photo swap on `reena-kaur.html`: still **15 pages, 82 images**. Decorative images (`alt=""`, e.g. the faded page-head photo on `reena-kaur.html`) are excluded |
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
   event signage. **Not being fixed for now** (Jayden, 22 Sep). The fix would be in the
   20i/StackCP panel.
4. **The services dropdown was clipped on desktop** by `overflow-x: hidden` on
   `.site-header` (which makes the browser compute `overflow-y` as `auto`). Fixed.
5. **`llms.txt` and explicit AI-crawler rules** — not in the guide, added for AI search.
6. **FAQ accordions** via native `<details>`/`<summary>`.
7. **Emoji replaced with inline SVG icons.** **Now genuinely sitewide on public pages
   as of 18 Sep** — the `↑` back-to-top became an inline SVG on the five remaining
   pages, and `contact.html`'s `✓`/`✗` went too (the tick list became `.tick`; the form
   status messages now say success or failure in words rather than by glyph, which was
   conveying state by symbol alone). **`admin.html` still carries `▸ ▾ ✅ ✉ ⬇ ＋ 📞`** —
   left alone deliberately: it is a password-protected `noindex` dashboard and those
   glyphs sit in JS-driven toggle controls tied to the quote flow, so the risk
   outweighs the benefit. Original note follows.

   Claimed "sitewide" on 17 Sep; it was not.
   Three ⭐ remained in the "Why Choose Us" blocks on `index.html` (fixed 18 Sep).
   Audited 18 Sep, still **OPEN** on:
   | Page | Characters | What they are |
   |---|---|---|
   | `contact.html` | `↑` `✓` `✗` | back-to-top glyph, form validation states |
   | `services.html`, `team.html`, `videos.html` | `↑` | back-to-top glyph |
   | `admin.html` | `▸` `▾` `✅` `✉` `⬇` `＋` `📞` | dashboard controls (internal, `noindex`) |
   `index.html` shows the replacement: an inline SVG arrow in `.back-to-top`.
8. **Internal markdown was publicly served** — `CLAUDE.md` was readable on the live site,
   exposing the Netlify site ID, env var names and the quote-page access-control note.
   Blocked in `netlify.toml`.
9. **The homepage title did not contain "Reena Kaur"** — her name is the #1 query
   (376 impressions, position 2.95) at only 4.52% CTR. Now leads the title.
10. **Ten video `src` attributes had the wrong filename case** (`video-1.mp4`
    referenced, `video-1.MP4` on disk, and `hero-video.MP4` vs `hero-video.mp4`).
    Windows is case-insensitive so it looked fine locally; **Netlify is not**, so those
    clips were 404ing in production. Item 41 covered images only — videos were never
    checked. Fixed in `index.html`; a full audit on 18 Sep found **five more still
    broken**, all **OPEN**:
    | Page | Referenced | Actually on disk |
    |---|---|---|
    | `contact.html` | `testimonial-1.mp4` | `testimonial-1.MP4` |
    | `contact.html` | `testimonial-3.mp4` | `testimonial-3.MP4` |
    | `videos.html` | `performance-1.mp4` | `performance-1.MP4` |
    | `videos.html` | `performance-2.MP4` | `performance-2.mp4` |
    | `videos.html` | `performance-3.mp4` | `performance-3.MP4` |
    **All five were fixed on 18 Sep** — `contact.html` now points at `testimonial-1.MP4`
    and `testimonial-3.MP4`; `videos.html` at `performance-1.MP4`, `performance-2.mp4`
    and `performance-3.MP4`. Verified against `os.listdir`, not against Windows path
    resolution, which is what hid them in the first place.
11. **`hero-video1.mp4` is not fast-start.** Its `moov` atom sits at 148MB, the end of
    the file, so the browser had to download the whole clip just to read its metadata —
    starving the clip actually on screen and leaving the hero black. Worked around with
    `preload="none"`; the real fix is `ffmpeg -movflags +faststart`. **Fixed 22 Sep** —
    re-encoded to 29MB with `+faststart` and its audio track dropped (see item 45).
    `preload="none"` stays, now simply because clip 2 is not needed until clip 1 ends.
    It opens on a "The Picture Patch presents" title card (a videographer's film);
    Jayden confirmed on 22 Sep that there is permission to use it.
12. **A dead phone number in the homepage CTA** — "Call Us Now" pointed at
    `tel:+44XXXXXXXXXX`, an unreplaced placeholder. Now the real number.
13. **`.hero-section p { display: none !important }`** below 480px was deleting the hero
    subheading entirely on small phones. Rule removed.
14. **The header was taller than the space reserved for it** — an inline `height: 75px`
    on the logo made the bar 100px against `body { padding-top: 80px }`, so the top 20px
    of every page sat behind it. Fixed on `index.html`; **still present on 20 pages** —
    every `.html` except `index.html`, `admin.html` and `quote.html`, including the new
    `punjabi-wedding-entertainment/index.html`, which inherited the header from
    `ladies-sangeet.html`.
15. **The gold `#FFD700` is 1.4:1 on white**, so it could only ever decorate, never carry
    text. The redesign adds three contrast-checked golds for different grounds. See the
    "Design layer" section of `CLAUDE.md`.
16. **The Services menu was a flat list of five.** It gave no signal that this is
    primarily a wedding business. Restructured 18 Sep into a pillar tree — see
    `CLAUDE.md` → "Information architecture". The four performer pages are now
    structurally children of `punjabi-wedding-entertainment/` in the nav, the footer,
    the visible breadcrumbs and the JSON-LD.

    Note the tension this creates and do not resolve it the wrong way: three of the four
    also serve non-wedding work. The breadcrumb states where a page **sits**, not that
    it is wedding-only, and their non-wedding coverage was deliberately left intact.

17. **`areas-we-cover.html` read as location keyword coverage.** Nine boroughs in one
    sentence, then a second list of the same boroughs in the FAQ below. Restructured
    18 Sep: eight regional sections (Scotland, Wales and Northern Ireland split out of
    what was one shared paragraph), **no place names in the prose at all**, and one
    set-apart `Regular areas include:` line per region. The duplicate borough list was
    cut from the London FAQ.

    Dedicated city pages are the right next step **only** where there is substantial
    unique information for them. Thin city pages are worse than none.

18. **`contact.html`'s FAQ schema did not match its visible FAQ.** Keyword-padded
    question names and US/UK spelling drift in the answers — see item 20 above. This is
    the kind of thing that only shows up if you diff the JSON-LD against the rendered
    accordion, so it went unnoticed through the whole 17 Sep pass.

19. **The homepage H1 did not describe the service.** It was the brand line
    "Bringing Punjab's Soul to Your Celebration". Changed 18 Sep to
    "Punjabi Singers & Entertainment for Weddings and Events", with the old line kept
    underneath as a supporting headline (`.hero-support`). A third-person entity
    paragraph defining Reena Kaur now opens the "Meet Reena Kaur" band.

    **This is hero-geometry-sensitive.** The longer H1 pushed the hero to 615px against
    its 600px pin, which silently re-crops the video. Corrected by widening the H1
    measure to `30ch`; measured back at exactly 600px with 49px of slack at 1876px wide.
    Re-measure if hero copy changes again.

20. **Core Web Vitals were measured, not assumed.** An automated audit flagged ten pages
    for "lazy-loading the LCP image" — measurement showed that was a **false positive**:
    the LCP element is text (`H1.hero-title` on the homepage, a `<p>` on services), not
    an image. Worth remembering before acting on a static-analysis CWV warning.

    Still unmeasurable locally, and needing the deployed URL: real PageSpeed/Lighthouse
    scores, field CWV, CDN TTFB, HTTPS/HSTS headers, and the www→apex and http→https
    redirects.

21. **Service and blog pages wasted their desktop width.** An 820px column centred in a
    1200px container left roughly 160px dead either side, and much more on a wide
    monitor. Fixed 18 Sep by giving the space a job rather than by widening the prose
    (820px was already at the top of a comfortable measure): a **sticky rail** carrying
    an on-this-page index, the related-services links on blog pages, and a quote CTA.
    Prose sits at 704px. Ten pages converted. See `CLAUDE.md` → "Article layout".

    **The trap this exposed, and the one to remember:** `overflow-x: hidden` makes an
    element a scroll container, and a scroll-container *ancestor* silently disables
    `position: sticky` for every descendant — no error, the element simply scrolls away.
    Two ancestors were doing it: the global `section { overflow-x: hidden }` and
    `html, body { overflow-x: hidden }`. The section opts out with a class; html/body
    now use **`overflow-x: clip`**, which stops sideways scrolling without creating a
    scroll container. Verified afterwards across 7 pages × 4 widths, zero horizontal
    overflow. **Do not revert either.**

22. **Blog articles had no images at all** — only the header logo. Twelve gallery
    photographs were distributed across the four articles and the six service pages
    18 Sep, chosen per section rather than decoratively (a Mehndi shot at the Mehndi
    heading, the Wolverhampton Mela shot at the melas heading, and so on).

    Tall portraits needed a crop window: unconstrained, a 1333×1999 shot rendered
    **1056px tall** in a 704px column. `.article-figure--portrait` caps them at 30rem,
    and `.article-figure-pair` sets two portraits side by side.

23. **Rajan was removed from the team** (18 Sep, at Jayden's request). His card, his
    photo `assets/images/team/rajan.png` and his `sitemap-images.xml` entry all went.
    Nine members remain. Note there is a separate, still-current member called **Raj** —
    they are different people, and `Raj` was left alone.

24. **The design layer was rolled onto all 20 remaining public pages** (18 Sep). Until
    then only `index.html` had it, so the site read as two different websites depending
    on which page you landed on.

    The single highest-value line of the whole rollout was deleting
    `style="height: 75px; width: auto"` from the logo: that inline height made the
    header 100px against 80px of reserved space, so **the top 20px of all 20 pages sat
    behind the header**. Measured afterwards: 86px bar against 88px reserved, everywhere.

    Inner pages got `.page-head` — the ink ground plus the beat rule — rather than the
    crimson gradient they had, which was competing with the crimson closing CTA at the
    foot of the same page. `.page-head h1` is set a step below `--step-h1` on purpose:
    the homepage hero is the thesis and an inner header is a signpost. Left at full
    display size the concerts header ran to 639px, taller than the 600px homepage hero,
    which inverts the hierarchy. It is now 433px.

25. **`#FFD700` was carrying body text in three places.** CLAUDE.md has warned since the
    redesign that `--color-secondary` is 1.4:1 on white and can only ever decorate. The
    contrast sweep found it doing real work anyway: all nine `team.html` role labels
    ("Founder & Director", "Lead Singer") at **1.40:1 on white**, and two uppercase
    eyebrows at 4.17:1 on crimson — under AA at that size.

    Fixed to `--gold-ink` and `#FFE9A8`. Full sweep afterwards: **zero AA failures
    across all 20 pages.** Worth noting the checker had to be made gradient-aware first
    — `getComputedStyle().backgroundColor` returns transparent for a gradient-only
    background, so the first pass walked past every crimson CTA to the white behind it
    and reported a pile of false failures.

26. **The three design skills were applied with one deliberate exception.** `/ui-styling`
    is built around shadcn/ui and Tailwind, which require React and a build step. This
    site is vanilla HTML deployed as a raw folder via the Netlify CLI, and adding a
    build step would break the deployment model described in `CLAUDE.md`. Its
    accessibility, design-token and mobile-first guidance was applied to the existing
    vanilla CSS instead; its component and utility layers were not installed.

27. **The mobile layout was wrong, and the check that should have caught it was
    wrong too.** Reported from a phone on 18 Sep: content on `services.html` pushed
    off to the right, and the hamburger menu clipping "Punjabi Wedding Entertainment".

    - **Content overflow**: the services rebuild had nested `<section>` inside
      `.container`, which no other page does. The global `section { width: 100% }`
      plus the mobile `max-width: 100vw` rules assume sections are top-level, so a
      nested one took the full viewport width and pushed out of the padded container.
      They are content groups, not page sections — now `<div class="services-group">`.
    - **Menu clipping**: the slide-in panel inherited the desktop dropdown's
      `white-space: nowrap`, correct for a floating panel and wrong for a full-width
      mobile one. Plus the pillar/child hairline tree was fussy at phone size, and
      "Services" and "All services" were the same destination twice.

    **The verification failure is the part worth remembering.** Earlier passes claimed
    "zero horizontal overflow at 360/390/768/1024/1440" measured with
    `document.documentElement.scrollWidth > innerWidth`. That check cannot work here:
    `overflow-x: clip`/`hidden` on an ancestor clips `scrollWidth`, so it reports clean
    while content visibly hangs off the side. **Measure element rects instead.**

28. **`overflow-x` on html/body breaks scrolling, and that is why the back-to-top
    button has never worked.** Chasing the sticky rail led to `html, body {
    overflow-x: clip }`, which fixed sticky and then turned out to stop the document
    scrolling programmatically. The viewport inherits its overflow from `html` (or
    from `body` when html is `visible`), so anything non-visible there stops the
    document being a scroll container. Wheel scrolling still works, which hides it.

    The guard now lives on `.site-header`, `main` and `.site-footer` as `clip`:
    not the root, so nothing propagates, and `clip` never creates a scroll container.
    Sticky verified working, no horizontal scrollbar at any width.

    Smooth scrolling looked broken separately, but only in the automated test
    browser. **Jayden confirmed on 22 Sep that the back-to-top button works in a real
    browser**, so there is nothing to fix.

29. **Technical audit, 22 Sep: robots, sitemap, canonicals, noindex, duplicates,
    404s, redirects and orphans.** Passed: every indexable page has a self-canonical and
    the full robots directive, the sitemap matches the indexable set exactly, 0 broken
    internal links or assets, custom 404 served with a real 404 status, `/videos*` 301s
    and internal files 404, every URL in the live sitemap still resolves. Fixed:
    - `lastmod` was 17/18 Sep on pages changed on 22 Sep; 17 URLs now say 2026-09-22.
    - 68 internal links (nav Home, logo, breadcrumbs) pointed at `index.html`, which
      also returns 200, giving the homepage a second URL. Now `/`.
      `js/navigation.js` updated to treat `/` as home.
    - Two blog articles were linked only from the blog index. Ladies Sangeet now links
      "What Is a Ladies Sangeet?" and Dhol Players links "What a Dhol Player Does at a
      Wedding".
    - `http://www` reached the apex in two hops (via `https://www`). netlify.toml now
      301s both www variants straight to the https apex. **Only testable once live.**
    - robots.txt `Disallow` on the private pages hid their noindex from Google; removed,
      and `X-Robots-Tag` headers added.
    Left as is: `/services` and `/services.html` both 200 (Netlify pretty URLs); the
    canonical resolves it and internal links consistently use `.html`.

30. **A dedicated page for Reena, 23 Sep: `reena-kaur.html`.** Item 13 of the outside
    plan (`Reena_Kaur_SEO_Suggested_Edits.txt`) asked for a Reena Kaur entity page.
    Built from a ~1,500-word biography Reena wrote herself, tightened and kept in her
    own voice (~1,400 words on the page including the fact list). Decisions:
    - **URL is `/reena-kaur.html`, not the plan's `/artists/reena-kaur/`.** Every other
      page is a flat `.html`, and there are no other artist pages to justify a folder.
    - Title and H1 are the plan's: "Reena Kaur | Punjabi Singer & Sangeet Performer" /
      "Reena Kaur — Punjabi Singer & Sangeet Performer".
    - It opens with a **third-person entity standfirst** matching the homepage's
      "Meet Reena Kaur" band ("Twenty-five years of keeping Punjabi folk alive"), then
      an "At a glance" fact list, then switches to **her first-person story**. The
      through-line is the homepage's theme: she is still singing the songs her family
      gave her.
    - Schema: one `@graph` with `ProfilePage` → `Person` (`#reena-kaur`) →
      `BreadcrumbList` (Home / Meet the Team / Reena Kaur). The `Person` node adds
      `description` (the standfirst, word for word: change both together),
      `birthPlace`, `knowsAbout` and `knowsLanguage`.
    - **The `Person` `url` now points here** on `index.html` and `team.html`, not at
      `team.html`.
    - Linked from the homepage band ("Read Reena's story"), her card on `team.html`, a
      new **"About Reena Kaur"** footer link on every public page, `llms.txt`, and both
      sitemaps.
    - Left out on purpose: no press list, named venues or TV channels beyond what she
      supplied. Open questions (25 vs 26 years, streaming links) are in
      `SEO-README.md` §5.
