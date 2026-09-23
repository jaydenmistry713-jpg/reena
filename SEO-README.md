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

# 2b. internal pages: faq-review.html is Reena's checklist (noindex, not linked).
#     If the review is finished, remove it so it is not public on the live domain:
#     git rm faq-review.html   (tools/ is blocked by netlify.toml, so it can stay)

# 3. THE ACTUAL GO-LIVE
netlify deploy --prod --dir . --functions netlify/functions
```

Then immediately verify the live site is serving the new build:

```bash
curl -s https://punjabifolkentertainment.com/ | grep -E '<title>|max-image-preview'
curl -s -o /dev/null -w "%{http_code}\n" https://punjabifolkentertainment.com/favicon.ico   # must be 200, was 404
curl -s -o /dev/null -w "%{http_code}\n" https://punjabifolkentertainment.com/ladies-sangeet.html
curl -s -o /dev/null -w "%{http_code}\n" https://punjabifolkentertainment.com/llms.txt
# www must reach the apex in ONE hop now (was two before 22 Sep):
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://www.punjabifolkentertainment.com/
#   expect: 301 -> https://punjabifolkentertainment.com/
curl -sI https://punjabifolkentertainment.com/admin.html | grep -i x-robots-tag   # expect noindex, nofollow
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
| 2 | `/reena-kaur.html` | **New 23 Sep.** Reena's own page, now the `url` of the `Person` entity sitewide. Same reason as `/`: her name is the #1 query. |
| 3 | `/punjabi-wedding-entertainment/` | **New 18 Sep.** The wedding pillar, and the parent of the four performer pages. Submit it before its children so the hierarchy is discovered in order. |
| 4 | `/ladies-sangeet.html` | Biggest cluster: `ladies sangeet` 108 imp, `ladies sangeet singers near me` 82 imp, plus the dholki queries. |
| 5 | `/punjabi-folk-singers.html` | `punjabi folk singers` 105 imp at pos 10.02, 0.95% CTR. **Title changed 18 Sep.** |
| 6 | `/dhol-players.html` | `dholki hire birmingham` and `dholki hire near me` both rank **2.4** with zero clicks. **Title and H1 changed 18 Sep.** |
| 7 | `/services.html` | Now a ~320-word pillar hub (intro paragraph removed 22 Sep). Needs a re-crawl so it stops competing with the pages above, and so the new three-pillar structure is picked up. **Title changed 18 Sep.** |
| 8 | `/punjabi-dj.html` | New page. |
| 9 | `/concerts.html` | New page, **rewritten 18 Sep** for melas, South Asian festivals and cultural/community events. Different audience from everything above it. |
| 10 | `/areas-we-cover.html` | **Restructured 18 Sep** into eight regional sections. |

**Day 2**
| # | URL |
|---|-----|
| 11 | `/faq.html` — new page, 17 Q&As (19 until the 22 Sep FAQ review) |
| 12 | `/blog/` — blog index, gives Google a route to the four articles |
| 13 | `/blog/what-is-a-ladies-sangeet.html` |
| 14 | `/blog/dhol-player-wedding-guide.html` |
| 15 | `/blog/punjabi-wedding-entertainment-guide.html` |
| 16 | `/blog/sangeet-mehndi-jago-explained.html` |
| 17 | `/contact.html` — new title; currently **zero impressions**, worth checking index status |
| 18 | `/team.html` — new title + Person schema; also currently **zero impressions** |
| 19 | `/gallery.html` — renamed from `/videos.html` on 21 Sep (301 in `netlify.toml`); request indexing on the new URL |

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
**Decided 22 Sep (Jayden): not being fixed for now.** Leave it; do not re-raise it as a
to-do.

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

## 4b. FAQ review checklist for Reena (22 Sep)

**URL:** https://seo-preview--beamish-baklava-7f1b21.netlify.app/faq-review.html

One page listing every FAQ on the site, each with a **Checked** box and a **Notes** box.
When built, the site had 59 FAQ entries across 8 pages but only **52 distinct questions** (56 and 50 after round 1 of the review):

- **7 questions are asked word for word on two pages**, each time with a slightly
  different answer (e.g. "What is a dhol?" on the FAQs page *and* Dhol Players). The
  checklist shows each one **once**, with both answers and a red "Asked on 2 pages" flag.
- **10 groups of differently worded questions ask the same thing** (songs, sound
  equipment, areas, international, combining services, number of performers, cost,
  non-wedding events, quotes, coordination). The groups are hand-maintained in
  `OVERLAPS` in the generator. **Since 22 Sep they are not shown to Reena**: each item
  carries them as an `<!-- OVERLAPS WITH: … -->` comment in the page source instead.
  **Read those comments when applying her answers.** A change to one answer may need
  the same change on the questions it overlaps with.

**How it works**
- Progress autosaves to the browser's `localStorage` (key `reena-faq-review-v1`) on
  every tick and keystroke, so closing the page loses nothing. That storage belongs to
  **one browser on one device**: use the same one to come back, or use *Download backup*
  and *Restore backup* to move between devices. Private windows cannot save, and the
  page warns when that happens.
- **Copy results** puts a plain-text report on the clipboard: changes requested (with
  notes), not checked yet, and checked with no changes. Each item has a stable id like
  `[q-what-is-a-dhol]`. **Paste that report to Claude to apply the changes to the site.**
  *Download results (.txt)* saves the same text as a file.
- Layout (simplified 22 Sep at Jayden's request): the header is the title only (no
  instructions), and there are no filters. The progress bar and the export/backup buttons
  stay, and so does the red "Asked on 2 pages" note, which explains why an item shows
  two answers.

**Regenerating:** `node tools/build-faq-review.js`. It reads the FAQ accordions straight
from the pages, so re-run it after any FAQ edit. Ticks and notes are keyed by question
text, so they survive regeneration for every question whose wording has not changed.
Notes on a question that was since reworded or removed show in a "no longer on the site"
box and are still included in the export. The script exits with an error if an answer
goes missing, a question appears twice, or an `OVERLAPS` entry no longer exists.

**Review rounds.** Reviewed questions are listed in `REVIEWED` in the generator and drop
out of the page, so it only ever shows what is still waiting. Bump the storage key each
round (see the generator's header comment).

| Round | Date | Result |
|---|---|---|
| 1 | 22 Sep | 23 of 52 reviewed, 4 with notes. **Applied:** removed "What if our schedule runs late?" (FAQs page) and "Do you offer MC services?" (FAQs page + Punjabi DJ); "What is a Ladies Sangeet?" no longer mentions boliyan or "informal" (both pages); "What areas do you cover?" shortened to "We perform nationwide across the UK, and we also take international bookings." **28 left**, storage key now `v2`. **Follow-up, 22 Sep: MC removed from the whole site** at Jayden's request. Reena does not offer it. Removed from the DJ page meta/OG/Twitter description, Service schema, standfirst, header lead and "What's included" list, from the DJ card on `services.html`, and from `llms.txt`. Do not reintroduce MC services. |

**Kept out of search:** `noindex` meta, `X-Robots-Tag: noindex` header (netlify.toml),
and no links to it from the site. It is deliberately *not* disallowed in robots.txt,
so that Google can see the noindex (see §6). `/tools/*` returns 404.
Remove it before go-live if the review is done (§1, step 2b).

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
- **25 or 26 years?** Reena's own biography (23 Sep) says "more than 26 years". Every
  page, the schema and `llms.txt` say "25+" / "over 25". `reena-kaur.html` keeps "more
  than 25" so the site does not contradict itself (26 is still "more than 25"). If she
  wants 26, change it sitewide in one pass, not page by page.
- **Streaming and TV links.** Reena's biography says her songs are on the mainstream
  streaming platforms and that she has appeared on mainstream TV channels, but names
  neither. With the artist profile URLs (Spotify, Apple Music) they can go in the
  `Person` `sameAs`, and named channels can go on the page. Nothing was invented.

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

**Verified in a real browser by Jayden, 22 Sep:** every video on the homepage, gallery
and contact page plays correctly. (The automated Chrome tab could not load *any* video,
including untouched originals, so that check had to be done by hand.)

**The three new testimonials in `assets/new-media/videos/` are left out for now**
(Jayden, 22 Sep). They are optimised and have posters but are not used on any page and
are not in git. Nothing references them, so they only add upload weight to a deploy.
- Put the 32 Google reviews on the page as plain crawlable HTML. The Elfsight widget
  renders client-side, so **no review text exists in the HTML** — crawlers and AI
  assistants never see it. No schema (see below), just visible text.
- Deepen the four blog articles (currently 568–676 words).
- Decide what to do about the 175-impression `punjabi singer provider <city>` cluster.

**Elfsight widget: known, left as is (Jayden, 22 Sep).** Not being changed. Recorded so
it is not rediscovered as a new problem:
- The Google Reviews widget injects a JSON-LD **`Product`** with `aggregateRating`
  5.0/32 and invented `mpn`/`sku` once it renders. That is what Search Console shows
  under Enhancements → Review snippets. Switch off the widget's rich-snippet / schema
  option. If that is ever revisited, verify by loading the homepage, scrolling to the
  reviews and checking there is only **one** `application/ld+json` block. See
  `SEO-GUIDE-STATUS.md` item 56.

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
- **Private pages are hidden with noindex, never with robots.txt `Disallow`** (22 Sep).
  A Disallow stops Google fetching the page, so it never sees the noindex, and a URL
  shared publicly (a quote link, for example) can still be indexed as a bare URL.
  `admin.html`, `quote.html`, `/quote/*` and `faq-review.html` carry noindex in their
  markup *and* an `X-Robots-Tag` header in netlify.toml. Only `/.netlify/` is disallowed.
- **Link to the homepage as `/`, never `index.html`.** `/index.html` also returns 200,
  so linking it gives the homepage a second URL. All 68 such links were switched on 22 Sep.
- **Bump `<lastmod>` in sitemap.xml** for any page whose content changes.
- **Never mention MC services.** Reena does not offer them; removed sitewide 22 Sep.
- **Don't repeat shared booking information across service pages** (Jayden, 22 Sep).
  Travel, lead times, line-up and how quoting works live in `faq.html`; a service page
  ends with the one-line pricing paragraph and a link there. Add only what is specific
  to that service. Use plain words: "songs" or "song choices", never "repertoire".
- **Never let `--color-secondary` (`#FFD700`) carry text on white or crimson.** It is
  1.4:1 on white and 4.17:1 on crimson. Use `--gold-ink` on light grounds, `--gold-leaf`
  on ink, `#FFE9A8` on crimson. Three violations were found and fixed on 18 Sep.
- Never claim the Ladies Sangeet line-up is entirely female — the **singers** are;
  accompanying musicians including dholki players are not always.
- `admin.html` and `quote.html` stay `noindex` and stay out of the sitemap.
- Bump the `?v=` cache-busting string on CSS/JS whenever either changes — on **every**
  page, not just the one being edited, since `main.css` and `responsive.css` are shared.
  Currently `?v=20260922g`, except `main.css` (`20260923a`, 23 Sep iPad fix) and
  `redesign.css` (`20260923a`, 23 Sep Reena page styles).
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
