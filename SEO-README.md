# SEO rebuild — working folder & go-live runbook

**Went live 20 Oct 2026.** This folder (`Downloads/Reena-seo`) was deployed over the old site
with `netlify deploy --prod` at Reena's request, together with the visitor statistics dashboard
(`/dashboard`, see `CLAUDE.md` → "5. Visitor statistics"). Section 1 below is kept as the record
of how, plus the rollback and the checks to repeat. A live test enquiry the same day reached Reena
at info@; the test record was then deleted from the `inquiries` store, and its visit from the
`analytics` store. Search Console progress: section 2 → "Progress log".

- Live site: https://punjabifolkentertainment.com (the SEO rebuild, since 20 Oct 2026)
- Preview of this work: https://seo-preview--beamish-baklava-7f1b21.netlify.app
- Original folder: was `Desktop/Reena`; not found at that path on 3 Oct. `OneDrive/Reena` is an
  older non-git copy. Neither is needed to go live.
- Netlify site: `beamish-baklava-7f1b21` (both folders link to the same site ID)

**Deploys since go-live**
- **22 Oct 2026**, deploy `6ad9d39c5f9aee92c9c04215`, commit `33ac629`: "Check your date"
  buttons → "Get a quote"; "Enquire about …" article-end buttons on the service pages; on
  mobile, tapping Services opens its list, a quote button in the service-page headers and
  fuller article lines; the wedding pillar box on `services.html` moved to the bottom.
  No function changes. Post-deploy checks in "Straight after" all passed (the beacon check
  adds one test view of `/` to the live statistics). Detail in `CLAUDE.md`.

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

Updated 3 Oct 2026. Go-live is one command: `netlify deploy --prod` from this folder
publishes it over the old site in place. Same Netlify site, same domain, so there are no
DNS, hosting or domain changes. Everything before "THE ACTUAL GO-LIVE" changes nothing public.

### Before the day

1. **Reena signs off the preview**: https://seo-preview--beamish-baklava-7f1b21.netlify.app
2. **Enquiry email works on the preview.** Submit the contact form there. It must arrive at
   jayden@buildsbyleo.com from `website@punjabifolkentertainment.com`. If it arrives from the
   old Gmail address, Resend failed and the Gmail fallback sent it: check the domain shows
   *Verified* in Resend and read the function log in Netlify.
3. **Her auto-forward.** Find out whether the rule on info@ (Microsoft 365) filters on the
   sender. If it does, add `website@punjabifolkentertainment.com` to it, or live enquiries will
   arrive at info@ but stop being forwarded.
4. **Pick a quiet time** and tell Reena, so she can watch for the first real enquiry.

### On the day

```bash
cd /c/Users/Jayden/Downloads/Reena-seo

# 1. commit everything, so the deploy matches a known commit
git status                     # Reena_Kaur_SEO_Suggested_Edits.txt and assets/new-media/
                               # are deliberately untracked; anything else, commit it

# 2. dependencies + videos (videos are git-ignored; without them the deploy ships none)
npm install
ls assets/videos/index/hero-video.mp4

# 3. checks: must print "0 problem(s)"
node tools/check-links.js
netlify env:list --plain | cut -d= -f1
#   expect RESEND_API_KEY, EMAIL_USER, EMAIL_PASS, ADMIN_PASSWORD, BLOBS_SITE_ID, BLOBS_TOKEN,
#   DASHBOARD_PASSWORD (statistics dashboard, added 20 Oct)

# 4. THE ACTUAL GO-LIVE
netlify deploy --prod --dir . --functions netlify/functions
```

The preview's "send enquiries to Jayden" behaviour does **not** need switching off. It is
keyed on the address the form is submitted from (preview addresses contain `--`), so on
punjabifolkentertainment.com enquiries go to info@ automatically.

### Straight after

```bash
curl -s https://punjabifolkentertainment.com/ | grep -E '<title>|max-image-preview'
curl -s -o /dev/null -w "%{http_code}\n" https://punjabifolkentertainment.com/favicon.ico   # must be 200, was 404
curl -s -o /dev/null -w "%{http_code}\n" https://punjabifolkentertainment.com/ladies-sangeet.html
curl -s -o /dev/null -w "%{http_code}\n" https://punjabifolkentertainment.com/reena-kaur.html
curl -s -o /dev/null -w "%{http_code}\n" https://punjabifolkentertainment.com/llms.txt
# old URL must redirect: expect 301 -> /gallery.html
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://punjabifolkentertainment.com/videos.html
# www must reach the apex. Measured 20 Oct: http://www takes TWO 301s (Netlify's own HTTPS
# upgrade runs before netlify.toml, -> https://www, then -> apex). https://www is one hop.
# Both end on the apex with 301s; the toml rule cannot remove the first hop.
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://www.punjabifolkentertainment.com/
curl -sI https://punjabifolkentertainment.com/dashboard | grep -i x-robots-tag   # expect noindex, nofollow
# statistics beacon: expect 204
curl -s -o /dev/null -w "%{http_code}\n" -X POST -A "Mozilla/5.0" --data '{"t":"view","p":"/"}' https://punjabifolkentertainment.com/.netlify/functions/visit
```

Then, by hand:
- **Send one real test enquiry on the live site** ("TEST, please ignore"). It must reach
  **info@** from `website@punjabifolkentertainment.com`, Reply must address the customer, and
  the auto-forward must fire. The centred "Thank you" confirmation should appear.
- `admin.html` was deleted on 6 Oct, so the test enquiry can only be seen in the `inquiries`
  Blobs store (Netlify dashboard → Blobs). Sign in to `/dashboard`: the test visit and the
  enquiry appear under Today, with its journey in "Recent journeys to an enquiry".
- On each of your own browsers and phones, open `/dashboard` and tick "Don't count my visits
  on this browser", so your checks don't inflate Reena's numbers.
- Click through on a phone: menu, Services chevron, a service page, the gallery's Load more.
- Start Search Console, section 2 below.

### Rollback

Netlify keeps every previous deploy: dashboard → Deploys → the last good one →
**Publish deploy**. One click, no CLI needed. Enquiries keep working after a rollback
because the old code sends through Gmail, which is why **`EMAIL_USER` / `EMAIL_PASS` must
stay in Netlify** until the new site has been live for a few weeks.

### After go-live: tidy up

- **Git:** the work is on branch `seo-rebuild`. Merge it into `main` and push
  (`git checkout main && git merge seo-rebuild && git push`), or open a PR on GitHub.
  Pushing does not deploy: this repo is not Git-connected to Netlify.
- **Use this folder from now on.** It contains everything, including the git-ignored videos.
- **After a few weeks of clean enquiries:** delete `EMAIL_USER` / `EMAIL_PASS` in Netlify,
  revoke that Gmail app password, and remove the Gmail fallback from `form-submission.js`.
- **Rotate the Resend API key** (it was pasted into a chat on 3 Oct): create a new
  send-only key, update `RESEND_API_KEY` in Netlify, redeploy, then delete the old key.
- **Change the dashboard password** (it was also pasted into a chat, on 20 Oct): set a new
  `DASHBOARD_PASSWORD` in Netlify (Site configuration → Environment variables), then redeploy.
  This also signs out every device that ticked "Keep me signed in", and any password saved
  in a browser will need updating.

---

## 2. SEARCH CONSOLE — what to do, in what order

Do these **after** the prod deploy, not before.

### Progress log

**20 Oct 2026 (go-live day)** — done in the `sc-domain:punjabifolkentertainment.com` property:
- **Sitemaps:** `sitemap.xml` re-submitted and `sitemap-images.xml` added. Both read
  *Success* the same day: 19 and 15 discovered pages. (The image sitemap showed "Couldn't
  fetch" for the first minute; that is Google's status before the first read, not an error.)
- **Indexing requested (9):** `/`, `/reena-kaur.html`, `/punjabi-wedding-entertainment/`,
  `/ladies-sangeet.html`, `/punjabi-folk-singers.html`, `/dhol-players.html`,
  `/services.html`, `/punjabi-dj.html`, `/concerts.html`. The daily quota ran out on the 10th.
- **Status before the request:** only `/` and `/services.html` were indexed.
  *Discovered – currently not indexed*: `/reena-kaur.html`, `/punjabi-folk-singers.html`,
  `/dhol-players.html`, `/punjabi-dj.html`. *URL is unknown to Google*:
  `/punjabi-wedding-entertainment/`, `/ladies-sangeet.html`, `/concerts.html`,
  `/areas-we-cover.html`.
- Step 1 (baseline export and inspecting `http://www`) was not redone; the 17 Sep baseline
  in section 4 stands.

**20 Oct, evening (21:15 UK)** — two more requests before the quota ran out again:
- **Indexing requested:** `/areas-we-cover.html` (now *Discovered – currently not indexed*;
  it was unknown to Google that morning) and `/faq.html` (already indexed; requested for a recrawl).
- The 11th request of the day was refused. **The quota is a rolling 24 hours, not a midnight
  reset**: the morning's nine counted against it until about 06:00 UK on 21 Oct.
- **Status of the rest (inspected, not requested):** *Discovered – currently not indexed*:
  `/blog/`, `/contact.html`, `/team.html`, `/gallery.html`. *Indexed* (recrawl only):
  all four blog posts.

**22 Oct** — the last eight, all accepted ("Indexing requested"):
- `/blog/` and `/contact.html`: *URL is unknown to Google* (no referring sitemap or page
  detected, although both are in `sitemap.xml`; `/contact.html` read *Discovered* on 20 Oct).
- `/team.html` and `/gallery.html`: *Discovered – currently not indexed*.
- All four blog posts: *Indexed*; requested for a recrawl.
- These were requested before the "Get a quote" / "Enquire about …" button change of the same
  day was deployed, so Google will crawl the old labels. Labels do not affect indexing.

**Every URL in the Step 3 list has now been requested.** Next: Step 4 (Bing) and the
follow-ups in Step 5 (2 weeks: ~3 Nov; 6 weeks: ~1 Dec).

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

**Do NOT request indexing for:** `/dashboard`, `/admin.html`, `/quote.html`, `/privacy-policy.html`,
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

## 4b. FAQ review checklist for Reena (22 Sep – 2 Oct)

> **Finished 2 Oct 2026. `faq-review.html` has been deleted.** The generator is kept in
> `tools/` (never served) in case a future round is needed; re-running it recreates the
> page, and the noindex header in `netlify.toml` is still there for that case. The rest
> of this section describes how the page worked.

**URL (while it existed):** https://seo-preview--beamish-baklava-7f1b21.netlify.app/faq-review.html

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
| 2 | 2 Oct | Final round, from `faq-review-results-2026-10-02.txt`. 11 of 28 ticked with no changes, 11 notes. Reena left the rest unticked because they repeat the ones she answered, so **each note was applied to every question in its overlap group, worded for that page**. **Packages** (Silver includes a dhol player, Gold includes a DJ): "Can we book more than one service?", "Can you perform alongside a DJ?", "Can we book dhol players alongside singers or a DJ?", "Can we book a DJ and live performers together?". **Sound is specialist vocalist equipment**; DJ sound and lighting come as part of the packages: "Do you bring your own sound equipment?", "Do you provide the sound system?", "Do you provide sound and lighting?". **Line-ups are bespoke**: "How many performers will come?" (no longer says "not a fixed package"), "How many dhol players do we need?". **Venue/planner coordination only for large bookings such as an international Sangeet**: "Do you coordinate with our venue and planner?". **Baraat: not played directly, organised through a third party**: "Do you play for baraat processions?" (FAQs + Dhol Players; the dhol-number answer no longer mentions a baraat). **No performing while Mehndi is being applied**: "Can you perform at a Mehndi or dholki night?". Left as they were, because their overlap partners were ticked with no changes: playlist, DJ music, sound/production team (matches the ticked mela answer), multiple dates, community events. **Page deleted after this round.** |

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
- **Who is in her photos?** Captions on `reena-kaur.html` name nobody beyond "Reena with
  her family". Confirm before adding names or relationships (husband, sons, grandad).
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
- **Packages vs "no fixed package" (30 Sep).** Reena's feedback names a **Silver package
  (includes a dhol player)** and a **Gold package (includes a DJ)**, now stated on
  `dhol-players.html` and `punjabi-dj.html` (names only, never a price). **2 Oct:** the
  FAQs now say "we offer packages" and name the same two, and the `faq.html` "How many
  performers…" answer says "bespoke" instead of "not a fixed package". `concerts.html`
  still says the line-up is "not a fixed package" (concerts are a separate audience, so
  that may be right). Ask what the packages contain (and whether there are others, e.g.
  Bronze) before adding a packages section anywhere.
- **Image changes from Reena's 30 Sep feedback: done 3 Oct** from the photos she sent.
  The Punjabi Singers card on `services.html` now shows her with her Ladies Sangeet team.
  The "looks a bit scary" photo (`reena-kaur-singing-sangeet-dholki.jpg`) is gone from
  `ladies-sangeet.html`, the Ladies Sangeet card and the `reena-kaur.html` pair. It is still
  a gallery feature tile and in the homepage `LocalBusiness` image list; ask whether she
  wants it removed everywhere. `reena-kaur.html` has the faded page-head photo and four story
  photos (childhood, family, an evening out, afternoon tea). Later on 3 Oct, at Jayden's
  request, its *Desaan Da Raja* video, the Gurinder Chadha graphic and the Taj Mahal photo
  were removed. Two new Sangeet shots were added to the gallery. **Not used, pending her answers:**
  the black-and-white portrait of a man with a dholki and harmonium, and the colour portrait
  of an older couple (who are they? if it is her grandad, it belongs beside that paragraph),
  and an old flyer that calls her an "author" of *Opening Doors to Tradition* (a fact we
  have never been given). The client-testimonial .mov was not processed; it would join the
  three held-back clips in `assets/new-media/videos/`.
- **Reena's page is western photos only: done 6 Oct** (her WhatsApp request, "only western
  pictures on this page… so it's different from the other pages and who I am"). Header is
  now her afternoon tea photo; the opening pair is the beach and her home studio; a solo
  iced-coffee shot sits in "From intimate gatherings…"; the waterfall replaced afternoon tea
  in "Away from the stage". The portrait, pink Sangeet and Wolverhampton Mela photos left
  this page only. **Still to ask:** the family photo shows her in a lehenga (she did not
  flag it; she mentioned she may send a baking photo); and her 3 Oct uploads include stacks
  of the book *Opening Doors to Tradition*, a newspaper page and a book-launch interview,
  so confirm whether the page should say she is an author.
- **Dhol Players baraat photo replaced: done 7 Oct.** At Reena's request, her IMG_8121 (the
  dhol line-up with the groom on a white horse at a palm-lined hotel) replaced the beach
  baraat on `dhol-players.html`, with the colours and lighting corrected (see `CLAUDE.md` →
  "Figures"). **Still to ask:** is "A baraat at a destination wedding." right for this
  photo? Also, should the beach baraat be replaced on the blog dhol guide, the wedding hub
  and the gallery too? It was swapped on the Dhol Players page only.

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

- **`netlify/functions/form-submission.js`: keep the email template, recipient and subject
  as they are.** They are relied on downstream. The transport alone was changed on 3 Oct
  (Resend from `website@punjabifolkentertainment.com`, Gmail fallback; preview hosts send
  to jayden@buildsbyleo.com). See `CLAUDE.md` → "Contact form".
- **Run `node tools/check-links.js` before every deploy.** It must report 0 problems.
- **New photos follow the recipe in `assets/new-media/MEDIA-MANIFEST.md`**: mozjpeg q84,
  4:4:4 chroma, progressive, sRGB profile embedded, EXIF/GPS stripped, long edge 2000px max.
  Phone photos carry the location they were taken at; stripping it is not optional.
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
  `admin.html`, `quote.html` and `/quote/*` carry noindex in their
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
