# SEO rebuild — working folder & go-live runbook

**This folder (`Desktop/Reena-seo`) is a staging copy. It is NOT the live site.**
The live site still runs the old version until someone runs the go-live steps below.

- Live site: https://punjabifolkentertainment.com (unchanged so far)
- Preview of this work: https://seo-preview--beamish-baklava-7f1b21.netlify.app
- Original folder: `Desktop/Reena` — left untouched, `git status` clean
- Netlify site: `beamish-baklava-7f1b21` (both folders link to the same site ID)

Work started 17 Sep 2026. Guide followed: `Desktop/buildsbyleo/seo-changes.txt`.

A **visual redesign** was layered on top from 18 Sep 2026 (`css/redesign.css`).
It covers **`index.html` only** so far; the other pages are visually unchanged.
Detail and rollout steps: the "Design layer" section of [`CLAUDE.md`](CLAUDE.md).

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
| 2 | `/ladies-sangeet.html` | Biggest cluster: `ladies sangeet` 108 imp, `ladies sangeet singers near me` 82 imp, plus the dholki queries. |
| 3 | `/punjabi-folk-singers.html` | `punjabi folk singers` 105 imp at pos 10.02, 0.95% CTR. |
| 4 | `/dhol-players.html` | `dholki hire birmingham` and `dholki hire near me` both rank **2.4** with zero clicks. |
| 5 | `/services.html` | Changed from a 775-word page to a 253-word hub. Needs a re-crawl so it stops competing with the five pages above. |
| 6 | `/punjabi-dj.html` | New page. |
| 7 | `/concerts.html` | New page. |
| 8 | `/faq.html` | New page, 19 Q&As. |
| 9 | `/areas-we-cover.html` | New page, carries the London/Wembley/Southall/Ilford/Birmingham terms. |
| 10 | `/blog/` | Blog index — gives Google a route to the four articles. |

**Day 2**
| # | URL |
|---|-----|
| 11 | `/blog/what-is-a-ladies-sangeet.html` |
| 12 | `/blog/dhol-player-wedding-guide.html` |
| 13 | `/blog/punjabi-wedding-entertainment-guide.html` |
| 14 | `/blog/sangeet-mehndi-jago-explained.html` |
| 15 | `/contact.html` — new title; currently **zero impressions**, worth checking index status |
| 16 | `/team.html` — new title + Person schema; also currently **zero impressions** |
| 17 | `/videos.html` — new title |

**Do NOT request indexing for:** `/admin.html`, `/quote.html`, `/privacy-policy.html`,
`/terms.html`. All four are `noindex` and deliberately out of the sitemap.

### Step 4 — Bing Webmaster Tools
Easy to forget, and it is where the favicon fix has to land.
The site is already verified there (`BingSiteAuth.xml` is in the repo).

1. Submit `sitemap.xml` and `sitemap-images.xml`.
2. Use **URL submission** — Bing's quota is far higher than Google's (thousands/day),
   so all 17 URLs can go in at once.
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

**Needs Reena / Jayden:**
- Booking facts: set lengths, space & power requirements, setup time, deposit and
  cancellation terms, named venues, signature songs. Service pages are honest without
  these but describe process where they could state specifics.
- Privacy policy: data retention period, and whether the business is ICO-registered.
- SSL certificate on `ladiessangeetbyreenakaur.co.uk`.

**Ready to do on request:**
- **Roll the redesign out to the remaining pages.** `index.html` is done; the other 10
  public pages plus `blog/` still show the old look. Steps in `CLAUDE.md`.
- **`ffmpeg -movflags +faststart` on `hero-video1.mp4`.** Its `moov` atom sits at 148MB,
  the very end of the file, so nothing can play until the whole clip is fetched. A
  container rewrite, no re-encode, no quality loss. Worth checking every video for this.
- Put the 32 Google reviews on the page as plain crawlable HTML. The Elfsight widget
  renders client-side, so **no review text exists in the HTML** — crawlers and AI
  assistants never see it. No schema (see below), just visible text.
- Deepen the four blog articles (currently 568–676 words).
- Decide what to do about the 175-impression `punjabi singer provider <city>` cluster.

**Deliberately not done, do not "fix" these later:**
- **Review / star schema.** Google classifies reviews about the entity that controls the
  page as *self-serving*, and made them ineligible for star rich results in Sept 2019.
  Adding `aggregateRating` produces no stars and risks a manual action. The 5.0/32 shows
  via the Google Business Profile instead, which is the correct channel.
- FAQ rich results. Google restricted these to government and health sites. The FAQPage
  schema is kept because it still helps parsing, including by AI assistants.
- `VideoObject` on decorative background video.
- A `/services/` subfolder — no ranking benefit, costs redirects.
- City landing pages — a single `areas-we-cover.html` was chosen instead.
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
- OG images live in `assets/images/og/` at 1200×630. Generate new ones from real
  photography rather than reusing the logo.
- Never state a price. Pricing is bespoke, quoted per event.
- Never claim the Ladies Sangeet line-up is entirely female — the **singers** are;
  accompanying musicians including dholki players are not always.
- `admin.html` and `quote.html` stay `noindex` and stay out of the sitemap.
- Bump the `?v=` cache-busting string on CSS/JS whenever either changes — on **every**
  page, not just the one being edited, since `main.css` and `responsive.css` are shared.
  Currently `?v=20260918a`.
- **Check video `src` casing against disk.** Netlify is case-sensitive; Windows is not,
  so a wrong `.MP4`/`.mp4` looks fine locally and 404s in production. Five such
  mismatches shipped in the SEO rebuild and were caught on 18 Sep.
- **Do not change the hero's height.** `object-fit: cover` takes the crop from the box,
  so the height decides which part of the footage is visible. See `CLAUDE.md`.
- **Do not repoint `--font-heading` / `--font-body`** — the html2canvas quote PNG renders
  against them. Add new font tokens instead.
