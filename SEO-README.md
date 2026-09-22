# SEO rebuild — working folder & go-live runbook

**This folder (`Desktop/Reena-seo`) is a staging copy. It is NOT the live site.**
The live site still runs the old version until someone runs the go-live steps below.

- Live site: https://punjabifolkentertainment.com (unchanged so far)
- Preview of this work: https://seo-preview--beamish-baklava-7f1b21.netlify.app
- Original folder: `Desktop/Reena` — left untouched, `git status` clean
- Netlify site: `beamish-baklava-7f1b21` (both folders link to the same site ID)

Work started 17 Sep 2026. Guide followed: `Desktop/buildsbyleo/seo-changes.txt`.

A second content pass on **18 Sep 2026** made weddings the primary topical pillar,
added `punjabi-wedding-entertainment/`, retargeted `concerts.html` at cultural-event
organisers, restructured `areas-we-cover.html`, changed five meta titles and cleared a
schema/technical audit. Structure and the rules that come with it: the "Information
architecture" section of [`CLAUDE.md`](CLAUDE.md).

A **visual redesign** was layered on top from 18 Sep 2026 (`css/redesign.css`) and is
now **sitewide** — every public page, with `admin.html` and `quote.html` deliberately
excluded so the quote PNG keeps rendering against Playfair/Poppins.
Detail: the "Design layer" section of [`CLAUDE.md`](CLAUDE.md).

**Item-by-item status of all 89 guide items: [`SEO-GUIDE-STATUS.md`](SEO-GUIDE-STATUS.md).**
Read that before re-reading the guide, or you will re-suggest work already done.

---

## 1. GO LIVE

Run these from `Desktop/Reena-seo`. Nothing here is live until step 3.

```bash
cd /c/Users/jayde/Desktop/Reena-seo

# 1. make sure dependencies + videos are present
#    (videos are git-ignored and must exist locally or the deploy ships without them)
npm install
ls assets/videos/index/hero-video.mp4     # must exist (lowercase .mp4 — the
                                          #  repo referenced .MP4 until 18 Sep)

# 2. sanity check before pushing anything public
python "<scratchpad>/check_links.py"      # or just re-check manually

# 3. THE ACTUAL GO-LIVE
netlify deploy --prod --dir . --functions netlify/functions
```

Then immediately verify the live site is serving the new build:

```bash
curl -s https://punjabifolkentertainment.com/ | grep -E '<title>|max-image-preview'
curl -s -o /dev/null -w "%{http_code}\n" https://punjabifolkentertainment.com/favicon.ico   # must be 200, was 404
curl -s -o /dev/null -w "%{http_code}\n" https://punjabifolkentertainment.com/ladies-sangeet.html
curl -s -o /dev/null -w "%{http_code}\n" https://punjabifolkentertainment.com/llms.txt
```

### Rollback
Netlify keeps every previous deploy. If anything is wrong:
Netlify dashboard → Deploys → find the last good deploy → **Publish deploy**.
One click, no CLI needed.

### After go-live: reconcile the two folders
Both folders are clones of the same git repo. Work so far is already committed on
branch `seo-rebuild`:

| Commit | What |
|---|---|
| `3c899e1` | SEO rebuild — service page split, blog, FAQ, schema, favicons |
| `5cce877` | Homepage redesign — type, warm band system, hero fixes |
| `2128f00` | Docs brought up to date |
| `f2269f4` | Wedding pillar architecture, concerts retarget, areas restructure, titles, schema + technical audit fixes |

To undo the redesign but keep the SEO work: `git reset --hard 3c899e1`.
Neither command touches the live site — this repo is not Git-connected to Netlify.

```bash
cd /c/Users/jayde/Desktop/Reena-seo
git push

cd /c/Users/jayde/Desktop/Reena
git pull        # brings the live folder up to date
```

Simplest alternative: just start using `Reena-seo` as the working folder from then on
and archive the old one. It contains everything (including videos).

---

## 2. SEARCH CONSOLE — what to do, in what order

Do these **after** the prod deploy, not before.

### Step 1 — record the baseline first
Before submitting anything, screenshot or export Performance (3 months) so there is
something concrete to compare against later. The baseline as of 17 Sep 2026 is in
section 4 below.

Also run **URL Inspection** on these two and note what it says:
- `https://punjabifolkentertainment.com/` 
- `http://www.punjabifolkentertainment.com/`

(See "known issues" — the homepage appears under both URLs in the report.)

### Step 2 — submit both sitemaps
Google Search Console → **Sitemaps** → add:
```
sitemap.xml
sitemap-images.xml
```

### Step 3 — request indexing, in this order
URL Inspection → *Request indexing*. Google allows roughly **10 per day**, so this is
split across two days. Order is by expected value, highest first.

**Day 1**
| # | URL | Why this order |
|---|-----|----------------|
| 1 | `/` | New title leads with "Reena Kaur". `reena kaur` = 376 imp at pos 2.95 with only 4.52% CTR. Fastest, highest-confidence win. |
| 2 | `/punjabi-wedding-entertainment/` | **New 18 Sep.** The wedding pillar, and the parent of the four performer pages. Submit it before its children so the hierarchy is discovered in order. |
| 3 | `/ladies-sangeet.html` | Biggest cluster: `ladies sangeet` 108 imp, `ladies sangeet singers near me` 82 imp, plus the dholki queries. |
| 4 | `/punjabi-folk-singers.html` | `punjabi folk singers` 105 imp at pos 10.02, 0.95% CTR. **Title changed 18 Sep.** |
| 5 | `/dhol-players.html` | `dholki hire birmingham` and `dholki hire near me` both rank **2.4** with zero clicks. **Title and H1 changed 18 Sep.** |
| 6 | `/services.html` | Now a 407-word pillar hub. Needs a re-crawl so it stops competing with the pages above, and so the new three-pillar structure is picked up. **Title changed 18 Sep.** |
| 7 | `/punjabi-dj.html` | New page. |
| 8 | `/concerts.html` | New page, **rewritten 18 Sep** for melas, South Asian festivals and cultural/community events. Different audience from everything above it. |
| 9 | `/areas-we-cover.html` | **Restructured 18 Sep** into eight regional sections. |
| 10 | `/faq.html` | New page, 19 Q&As. |

**Day 2**
| # | URL |
|---|-----|
| 11 | `/blog/` — blog index, gives Google a route to the four articles |
| 12 | `/blog/what-is-a-ladies-sangeet.html` |
| 13 | `/blog/dhol-player-wedding-guide.html` |
| 14 | `/blog/punjabi-wedding-entertainment-guide.html` |
| 15 | `/blog/sangeet-mehndi-jago-explained.html` |
| 16 | `/contact.html` — new title; currently **zero impressions**, worth checking index status |
| 17 | `/team.html` — new title + Person schema; also currently **zero impressions** |
| 18 | `/gallery.html` — renamed from `/videos.html` on 21 Sep (301 in `netlify.toml`); request indexing on the new URL |

**Do NOT request indexing for:** `/admin.html`, `/quote.html`, `/privacy-policy.html`,
`/terms.html`. All four are `noindex` and deliberately out of the sitemap.

### Step 4 — Bing Webmaster Tools
Easy to forget, and it is where the favicon fix has to land.
The site is already verified there (`BingSiteAuth.xml` is in the repo).

1. Submit `sitemap.xml` and `sitemap-images.xml`.
2. Use **URL submission** — Bing's quota is far higher than Google's (thousands/day),
   so all 18 URLs can go in at once.
3. Bing will not show the favicon until it re-crawls the root. Expect weeks.

### Step 5 — follow up
Check again after **2 weeks** and **6 weeks**. Compare against the baseline below.
Markup only makes a page *eligible* for an enhancement; it never forces one, and
nothing changes before a re-crawl.

---

## 3. Known issues to check after go-live

**Homepage indexed under two URLs.** Search Console shows both
`https://punjabifolkentertainment.com/` (81 clicks, pos 12.77) and
`http://www.punjabifolkentertainment.com/` (79 clicks, pos 5.11). The redirects are
correct — every variant 301s to `https://` non-www — so this is historical data Google
has not consolidated. Run URL Inspection on both and compare "user-declared canonical"
against "Google-selected canonical".

**Desktop ranks far worse than mobile.** Mobile pos 5.64 / 7.04% CTR vs desktop
pos 26.29 / 1.8%. A 20-position gap. Not a content fix — needs diagnosis.

**`ladiessangeetbyreenakaur.co.uk` has a broken SSL certificate.** It already redirects
to the main site (good), but serves a `*.stackcp.com` cert that does not cover the
domain, so `https://` throws a browser warning first. That URL is printed on event
signage. Fix in the 20i / StackCP control panel — free cert, few minutes.

**The preview URL stays publicly reachable** after go-live. Canonicals point at the live
domain so it should not get indexed, but there is no reason to share the link once live.

---

## 4. BASELINE — Search Console, Web, last 3 months, exported 17 Sep 2026

```
Total clicks        179
Total impressions   3,453
Overall CTR         5.18%

Mobile      155 clicks   2,203 imp   7.04%   pos 5.64
Desktop      22 clicks   1,225 imp   1.80%   pos 26.29
Tablet        2 clicks      25 imp   8.00%   pos 6.28

Countries   UK 149/2242 · India 17/459 · US 4/239 · Canada 4/124

Pages with any data: 6 (of which only 4 meaningful)
  https://punjabifolkentertainment.com/              81 clicks  2166 imp  pos 12.77
  http://www.punjabifolkentertainment.com/           79 clicks  1310 imp  pos 5.11
  .../services.html                                  19 clicks   570 imp  pos 26.40
  .../videos.html                                     1 click     70 imp  pos 4.54

Queries: 115 total, only 6 with any clicks at all
Rich results (Search Appearance report): EMPTY — nothing firing
```

**Queries to watch** — these are the ones the rebuild specifically targets:

| Query | Baseline imp | Baseline pos | Baseline clicks |
|---|---|---|---|
| `reena kaur` | 376 | 2.95 | 17 (4.52% CTR) |
| `ladies sangeet` | 108 | 11.27 | 0 |
| `punjabi folk singers` | 105 | 10.02 | 1 |
| `punjabi folk singers for wedding` | 85 | 5.98 | 1 |
| `ladies sangeet singers near me` | 82 | 7.29 | 6 |
| `punjabi entertainment` | 43 | 5.79 | 0 |
| `dholki hire birmingham` | 10 | **2.40** | 0 |
| `dholki hire near me` | 5 | **2.40** | 0 |
| `dholki singers near me` | 10 | 6.50 | 0 |

---

## 5. Still outstanding

**Resolved:**
- ~~The back-to-top button does nothing.~~ **Jayden confirmed 22 Sep that it works** in
  a real browser. Smooth scrolling only failed inside the automated test browser, so it
  was a limit of the test, not a site bug. Do not "fix" it.

**Needs Reena / Jayden:**
- Booking facts: set lengths, space & power requirements, setup time, deposit and
  cancellation terms, named venues, signature songs. Service pages are honest without
  these but describe process where they could state specifics.
- Privacy policy: data retention period, and whether the business is ICO-registered.
- SSL certificate on `ladiessangeetbyreenakaur.co.uk`.

**Ready to do on request:**
- ~~Roll the redesign out to the remaining pages.~~ **Done 18 Sep** — all 20 remaining
  public pages converted. See `CLAUDE.md` → "Design layer".
- ~~`ffmpeg -movflags +faststart` on `hero-video1.mp4`.~~ **Done 22 Sep**, along with a
  full video pass — see "Video optimisation (22 Sep)" below.

- `hero-video1.mp4` opens on a "The Picture Patch presents" title card (a wedding
  videographer's film). **Jayden confirmed 22 Sep that there is permission to use it.**
- Carousel clip `video-5` is Reena speaking to camera (confirmed by Jayden 22 Sep); its
  `aria-label` names her.

### Video optimisation (22 Sep)

Site videos **638MB → 370MB**; the three new testimonials in `assets/new-media/videos/`
30MB → 28MB. Originals are backed up at `Downloads/Reena-seo-video-originals/` (outside
the repo, not deployed) — restore by copying back over `assets/videos/`.

| File | Before | After | |
|---|---|---|---|
| `index/hero-video1.mp4` | 141MB | 29MB | now fast-start; audio dropped (never unmuted) |
| `index/video-1.MP4` | 89MB | 41MB | |
| `index/hero-video.mp4` | 71MB | 56MB | |
| `index/video-2.MP4` | 50MB | 25MB | |
| `index/video-5.MP4` | 39MB | 15MB | |
| `index/video-4.mp4` | 32MB | 20MB | |
| `testimonial/testimonial-2…6` | 60MB | 41MB | five files |
| `gallery/performance-2, 4, 6` | 40MB | 28MB | three files |

Nine files were left untouched because re-encoding did not save ≥20% — mostly already
well-compressed phone clips, several of which came out *larger*.

**How it was done, so it can be repeated:**
- `libx264 -preset slow -crf 22` (21 for the two hero clips), `-pix_fmt yuv420p`,
  `-c:a copy`, `-movflags +faststart`. Same resolution and frame rate.
- **No `-vf` at all** — no scaling, no colour conversion. Each file's own
  `colorspace` / `color_trc` / `color_primaries` / `color_range` is read with ffprobe
  and written back explicitly. A file with no tags stays untagged.
- Pitfalls hit on the way, worth knowing: ffprobe on Windows ends lines with `\r`
  (strip it or ffmpeg rejects the tag), ffprobe reads stdin and will swallow a
  `while read` file list (use `</dev/null`), and ffprobe prints fields in its own order,
  not the order requested.
- **Verified per file** before swapping: identical tags, fast-start, audio presence,
  and mean Y/U/V over 30 frames at the midpoint within 1.0 of the original (actual:
  ≤0.17). All 15 swapped files decode end-to-end with zero errors.
- ffmpeg is not installed on this machine; the pass used the `ffmpeg-static` /
  `ffprobe-static` npm packages in a scratch folder.

**Posters** — 12 added (hero clip 1, carousel ×5, contact testimonials ×6), each frame 0
of its own clip, converted with the clip's own colour matrix. They sit beside the clips
in the **git-ignored** `assets/videos/`, so they ship only via the CLI deploy, like the
videos.

**ARIA** — every `<video>` now has a descriptive `aria-label`, or `aria-hidden="true"`
for the two decorative hero clips.

**Not verified in a browser.** The automated Chrome tab would not load *any* video —
including untouched originals and the existing Netlify preview — so playback could not
be checked that way. Open the homepage, gallery and contact page by hand (local server or
a fresh `--alias seo-preview` deploy) before go-live.
- Put the 32 Google reviews on the page as plain crawlable HTML. The Elfsight widget
  renders client-side, so **no review text exists in the HTML** — crawlers and AI
  assistants never see it. No schema (see below), just visible text.
- Deepen the four blog articles (currently 568–676 words).
- Decide what to do about the 175-impression `punjabi singer provider <city>` cluster.

**Needs doing in the Elfsight dashboard (not this repo):**
- The Google Reviews widget injects a JSON-LD **`Product`** with `aggregateRating`
  5.0/32 and invented `mpn`/`sku` once it renders. That is what Search Console shows
  under Enhancements → Review snippets. Switch off the widget's rich-snippet / schema
  option. Verify afterwards by loading the homepage, scrolling to the reviews and
  checking there is only **one** `application/ld+json` block. See `SEO-GUIDE-STATUS.md`
  item 56.

**Deliberately not done, do not "fix" these later:**
- **Review / star schema.** Google classifies reviews about the entity that controls the
  page as *self-serving*, and made them ineligible for star rich results in Sept 2019.
  Adding `aggregateRating` produces no stars and risks a manual action. The 5.0/32 shows
  via the Google Business Profile instead, which is the correct channel.
- FAQ rich results. Google restricted these to government and health sites. The FAQPage
  schema is kept because it still helps parsing, including by AI assistants.
- `VideoObject` on decorative background video. Also **not** added to `videos.html`:
  it needs a real `thumbnailUrl`, `uploadDate` and `duration` per clip, and inventing
  those would be worse than omitting the markup. Supply the metadata and it can go in.
- A homepage `BreadcrumbList` — single-item, unrenderable, asserts nothing.
- A `/services/` subfolder — no ranking benefit, costs redirects.
- City landing pages — a single `areas-we-cover.html` was chosen instead. Reconfirmed
  18 Sep: dedicated London/Birmingham pages are worth making **only** where there is
  substantial unique information for them. Thin city pages are worse than none.
- Artist management / record label content — confirmed Reena does not offer this,
  despite ~88 impressions of such queries.

---

## 6. Rules for anyone editing this site

- **Never touch `netlify/functions/form-submission.js`.** The email template, transport,
  recipient and subject are relied on downstream. Verified byte-identical throughout
  this rebuild. Additive changes only.
- **Every new indexable page must carry the full robots directive**, or it silently opts
  out of image thumbnails in search and nothing warns you:
  ```html
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  ```
- Every new page also needs: unique `<title>` under 60 chars, unique description under
  165, canonical, OG + Twitter tags pointing at a **real photograph** (not the logo),
  `og:image:alt`, and an entry in `sitemap.xml`.
- **Every page's share image is `assets/images/og/og-reena-kaur.jpg`** (Reena's portrait,
  1200×630), with the alt text "Studio portrait of Reena Kaur, founder of Punjabi Folk
  Entertainment, with her signature". Jayden's decision, 22 Sep. New pages use the same
  `og:image`, `twitter:image` and both alt tags. The other files in `assets/images/og/`
  are only referenced from schema now.
- Never state a price. Pricing is bespoke, quoted per event.
- **Never let `--color-secondary` (`#FFD700`) carry text on white or crimson.** It is
  1.4:1 on white and 4.17:1 on crimson. Use `--gold-ink` on light grounds, `--gold-leaf`
  on ink, `#FFE9A8` on crimson. Three violations were found and fixed on 18 Sep.
- Never claim the Ladies Sangeet line-up is entirely female — the **singers** are;
  accompanying musicians including dholki players are not always.
- `admin.html` and `quote.html` stay `noindex` and stay out of the sitemap.
- Bump the `?v=` cache-busting string on CSS/JS whenever either changes — on **every**
  page, not just the one being edited, since `main.css` and `responsive.css` are shared.
  Currently `?v=20260918g`.
- **Any new video: fast-start, a poster from its own frame, and an `aria-label`** (or
  `aria-hidden="true"` if purely decorative). Re-encode with no `-vf` and its own colour
  tags carried through — never let ffmpeg convert colour. Recipe in §5.
- **Check video `src` casing against disk.** Netlify is case-sensitive; Windows is not,
  so a wrong `.MP4`/`.mp4` looks fine locally and 404s in production. Ten such mismatches
  existed; all were fixed on 18 Sep. Nothing local will warn you, so re-check whenever a
  video `src` is added or renamed.
- **`FAQPage` schema must repeat the visible Q&A verbatim.** `contact.html` shipped with
  schema questions that were keyword-padded variants of the on-page text
  ("How far in advance should I book **Punjabi entertainment**?" vs the visible
  "How far in advance should I book?"), plus US/UK spelling drift in two answers. That
  breaches Google's guidelines. Generate the JSON-LD from the accordion, never by hand.
- **Every `<img>` needs `width` and `height`.** Without them the browser cannot reserve
  space and CLS suffers. All 61 that were missing them were fixed on 18 Sep using the
  files' real intrinsic dimensions. Measured CLS afterwards: 0.0005 homepage, 0.015
  services.
- **Do not add a `BreadcrumbList` to the homepage.** It is the root, so the trail is one
  item long; Google will not render it and it asserts nothing.
- **Never put `overflow-x` on `html` or `body`.** It propagates to the viewport and
  stops the document scrolling programmatically. The horizontal guard belongs on
  `.site-header`, `main` and `.site-footer` as `clip`. Full reasoning, including why
  `hidden` also breaks `position: sticky`, in `CLAUDE.md` → "Article layout".
- **Do not measure horizontal overflow with `scrollWidth`.** `main` clips, so it will
  report clean regardless. Compare element `getBoundingClientRect().right` against the
  viewport width.
- **Regenerate `sitemap-images.xml` from the markup** after adding or removing page
  images, rather than editing it by hand. It excludes logos, OG cards and favicons.
- **Do not change the hero's height.** `object-fit: cover` takes the crop from the box,
  so the height decides which part of the footage is visible. See `CLAUDE.md`.
- **Do not repoint `--font-heading` / `--font-body`** — the html2canvas quote PNG renders
  against them. Add new font tokens instead.
