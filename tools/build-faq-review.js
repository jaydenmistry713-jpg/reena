// Builds faq-review.html — a private checklist for Reena to review every FAQ on the site.
//
//   node tools/build-faq-review.js
//
// Reads the visible <details class="faq-item"> accordions straight from the pages, so re-run
// it whenever an FAQ is added, removed or reworded. Questions asked word-for-word on more than
// one page become ONE item showing every page's answer. Differently worded questions that ask
// the same thing are flagged with an "Overlaps with" note (OVERLAPS below — edit by hand).
//
// Progress is keyed by a slug of the question text, so regenerating keeps Reena's ticks and
// notes for any question whose wording has not changed. Notes on a question that has since
// been removed or reworded are not lost: the page lists them under "Notes on questions no
// longer on the site".
//
// The storage key went to v2 after round 1, because the round-1 items were dropped from the
// page and their old notes would otherwise have shown as "no longer on the site". Bump it
// again (v3, …) whenever REVIEWED grows. Items still pending never have saved state lost that
// way, as long as every change they carried has been exported and applied first.
//
// Not for the live site: faq-review.html is noindex, disallowed in robots.txt and sent with
// X-Robots-Tag: noindex (netlify.toml). /tools/* is blocked from being served.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "faq-review.html");

// Page order in the checklist, and the label Reena will see.
const PAGES = [
  { file: "faq.html", label: "FAQs page" },
  { file: "ladies-sangeet.html", label: "Ladies Sangeet" },
  { file: "punjabi-folk-singers.html", label: "Punjabi Folk Singers" },
  { file: "dhol-players.html", label: "Dhol Players" },
  { file: "punjabi-dj.html", label: "Punjabi DJ" },
  { file: "concerts.html", label: "Concerts & Melas" },
  { file: "areas-we-cover.html", label: "Areas We Cover" },
  { file: "contact.html", label: "Contact" },
];

// Questions worded differently but asking the same thing. Each inner list is one topic.
// Matching is on normalised question text; a question not found on the site is reported.
const OVERLAPS = [
  ["Can we choose the songs?", "Can we choose our own songs?", "Can we customise the music selection?", "Can we give you a playlist?"],
  ["Do you bring your own sound equipment?", "Do you provide the sound system?", "Do you provide sound and lighting?"],
  ["What areas do you cover?", "What areas do you serve?", "Do you cover the whole of the UK?"],
  ["Do you travel internationally?", "Do you perform outside the UK?", "Can you perform internationally?", "Do you take international concert bookings?"],
  ["Can we book more than one service?", "Can we book dhol players alongside singers or a DJ?", "Can we book a DJ and live performers together?", "Can you perform alongside a DJ?"],
  ["How many performers will come?", "How many singers will perform at our event?", "How many dhol players do we need?"],
  ["How much does it cost?", "How much does a Ladies Sangeet singer cost?", "How much does it cost to hire Punjabi folk singers?", "How much does it cost to hire a dhol player?", "How much does a Punjabi DJ cost?"],
  ["Do you perform at events other than weddings?", "Do you perform outside weddings?", "Can you provide entertainment for a community or cultural event?"],
  ["How do I get a quote?", "How do we book a performance for our festival?"],
  ["Do you coordinate with our venue and planner?", "Do you work with our sound and production team?"],
];

// Questions Reena has already reviewed. They are left out of the checklist so it only shows
// what is still waiting. Round 1: 22 Sep 2026, from faq-review-results-2026-09-22.txt.
// ("What if our schedule runs late?" and "Do you offer MC services?" were removed from the
// site in that round, so they drop out on their own.)
const REVIEWED = [
  // checked, no changes
  "How far in advance should I book?", "How do I get a quote?", "What do you need to know to quote accurately?",
  "Do you charge extra for travel?", "Do you travel internationally?", "How much does a Ladies Sangeet singer cost?",
  "Can you perform internationally?", "How much does it cost to hire Punjabi folk singers?",
  "How much does it cost to hire a dhol player?", "How much does a Punjabi DJ cost?", "What size events do you perform at?",
  "Who performs in a concert line-up?", "Do you take international concert bookings?",
  "How do we book a performance for our festival?", "Do you perform at melas and South Asian festivals?",
  "Do you cover the whole of the UK?", "Do you perform outside the UK?", "Do you perform in London?",
  "Do you perform in Birmingham and the Midlands?", "What areas do you serve?",
  // checked, with changes applied 22 Sep
  "What is a Ladies Sangeet?", "What areas do you cover?",
];

const ENTITIES = { "&rsquo;": "’", "&lsquo;": "‘", "&ldquo;": "“", "&rdquo;": "”", "&mdash;": "—", "&ndash;": "–", "&amp;": "&", "&nbsp;": " ", "&pound;": "£" };
const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, (e) => ENTITIES[e] || e).replace(/\s+/g, " ").trim();
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
const slug = (s) => "q-" + norm(s).replace(/ /g, "-").slice(0, 70);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---- read every FAQ, remembering the section heading it sits under ----
const found = [];
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page.file), "utf8");
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>|<details class="faq-item">[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g;
  let section = "";
  for (const m of main.matchAll(re)) {
    if (m[1] !== undefined) { section = strip(m[1]); continue; }
    found.push({ page, section, q: strip(m[2]), a: strip(m[3]) });
  }
}

// ---- merge exact repeats (same question text) into one item ----
const items = [];
const byKey = new Map();
for (const f of found) {
  const key = norm(f.q);
  if (!byKey.has(key)) {
    const item = { id: slug(f.q), q: f.q, home: f.page, section: f.page.file === "faq.html" ? f.section : "", answers: [] };
    byKey.set(key, item);
    items.push(item);
  }
  byKey.get(key).answers.push({ label: f.page.label, file: f.page.file, text: f.a });
}

// ---- overlap flags ----
const problems = [];
for (const group of OVERLAPS) {
  const members = group.map((q) => byKey.get(norm(q)));
  group.forEach((q, i) => { if (!members[i]) problems.push(`OVERLAPS lists a question not on the site: "${q}"`); });
  for (const m of members.filter(Boolean)) {
    m.overlaps = members.filter((o) => o && o !== m).map((o) => o.id);
  }
}

// ---- self-checks: every FAQ accounted for, no duplicate items or ids ----
const ids = new Set(items.map((i) => i.id));
if (ids.size !== items.length) problems.push("Two questions produced the same id");
if (new Set(items.map((i) => norm(i.q))).size !== items.length) problems.push("A question appears as two items");
const answerCount = items.reduce((n, i) => n + i.answers.length, 0);
if (answerCount !== found.length) problems.push(`Answers lost: ${found.length} found, ${answerCount} placed`);
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }

// ---- drop what has already been reviewed ----
const reviewedKeys = new Set(REVIEWED.map(norm));
for (const q of REVIEWED) if (!byKey.has(norm(q))) console.warn(`note: REVIEWED question no longer on the site: "${q}"`);
const pending = items.filter((i) => !reviewedKeys.has(norm(i.q)));
const reviewedCount = items.length - pending.length;

// Number the remaining items in page order, and keep a lookup for overlap labels.
pending.forEach((it, n) => { it.num = n + 1; });
const byId = Object.fromEntries(items.map((i) => [i.id, i]));
const isPending = (id) => !reviewedKeys.has(norm(byId[id].q));

// ---- render ----
const groups = PAGES.map((p) => ({ page: p, items: pending.filter((i) => i.home === p) })).filter((g) => g.items.length);

const renderItem = (it) => {
  const multi = it.answers.length > 1;
  const answers = it.answers.map((a) => `
          <div class="answer">
            ${multi ? `<p class="answer-label">Answer on: <a href="${a.file}#faqs" target="_blank" rel="noopener">${esc(a.label)}</a></p>` : ""}
            <p>${esc(a.text)}</p>
          </div>`).join("");
  const differ = new Set(it.answers.map((a) => norm(a.text))).size > 1;
  const repeat = multi
    ? `<p class="flag flag-repeat"><strong>Asked on ${it.answers.length} pages.</strong> ${differ
        ? "The answers are worded differently. Check both say the same thing, or tell us which page should keep it."
        : "The answer is the same on each page. Tell us if it should only be on one."}</p>`
    : "";
  // Overlapping questions still waiting are links; ones already reviewed are named in plain
  // text, since they are no longer on this page.
  const overlap = it.overlaps && it.overlaps.length
    ? `<p class="flag flag-overlap"><strong>Overlaps with:</strong> ${it.overlaps.map((o) => isPending(o)
        ? `<a href="#${o}">#${byId[o].num} ${esc(byId[o].q)}</a>`
        : `&ldquo;${esc(byId[o].q)}&rdquo; (already reviewed)`).join(", ")}. Make sure the answers agree.</p>`
    : "";
  const where = it.section ? `${esc(it.home.label)} · ${esc(it.section)}` : esc(it.home.label);
  return `
      <article class="item" id="${it.id}" data-id="${it.id}">
        <header class="item-head">
          <span class="num">${it.num}</span>
          <div>
            <p class="where">${where}${multi ? ` + ${it.answers.slice(1).map((a) => esc(a.label)).join(", ")}` : ""}</p>
            <h3>${esc(it.q)}</h3>
          </div>
        </header>
        ${repeat}${answers}
        ${overlap}
        <div class="controls">
          <label class="check">
            <input type="checkbox" data-field="checked">
            <span class="box" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <span>Checked</span>
          </label>
          <label class="notes">
            <span class="notes-label">Notes <span class="hint">(what should change? leave blank if it's right)</span></span>
            <textarea data-field="notes" rows="2"></textarea>
          </label>
        </div>
      </article>`;
};

const nav = groups.map((g) => `<a href="#page-${g.page.file.replace(".html", "")}">${esc(g.page.label)} <span>${g.items.length}</span></a>`).join("");
const sections = groups.map((g) => `
    <section class="page-group" id="page-${g.page.file.replace(".html", "")}">
      <h2>${esc(g.page.label)} <a class="open" href="${g.page.file}" target="_blank" rel="noopener">Open page</a></h2>
      ${g.items.map(renderItem).join("")}
    </section>`).join("");

const data = pending.map((i) => ({ id: i.id, num: i.num, q: i.q, pages: i.answers.map((a) => a.label) }));
const repeats = pending.filter((i) => i.answers.length > 1).length;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>FAQ Review Checklist</title>
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..700&family=Karla:wght@400..700&display=swap" rel="stylesheet">
<!-- Generated by tools/build-faq-review.js from the site's FAQ markup. Do not edit by hand. -->
<style>
  :root {
    --crimson: #C41E3A; --crimson-dark: #8B1426; --ink: #1A0B10; --text: #2B2024; --muted: #6B5A5F;
    --gold-ink: #8A6212; --cream: #FFF8F0; --blush: #FFF3EB; --line: #E9DCD2; --white: #FFFFFF;
    --ok: #1F6B3A; --ok-bg: #EAF5EE;
  }
  * { box-sizing: border-box; }
  html { scroll-padding-top: 150px; }
  body { margin: 0; background: var(--cream); color: var(--text); font: 17px/1.55 Karla, system-ui, sans-serif; }
  h1, h2, h3 { font-family: Fraunces, Georgia, serif; color: var(--ink); line-height: 1.2; }
  a { color: var(--crimson); }
  .wrap { max-width: 860px; margin: 0 auto; padding: 0 16px; }

  .intro { background: linear-gradient(135deg, var(--crimson), var(--crimson-dark)); color: var(--white); padding: 2.5rem 0 2rem; }
  .intro h1 { color: var(--white); margin: 0 0 .6rem; font-size: clamp(1.8rem, 1.3rem + 2vw, 2.6rem); }
  .intro p { margin: 0 0 .6rem; color: #FDF1E6; max-width: 62ch; }
  .intro ol { margin: .4rem 0 0; padding-left: 1.2rem; color: #FDF1E6; }
  .intro li { margin-bottom: .25rem; }

  .bar { position: sticky; top: 0; z-index: 10; background: var(--white); border-bottom: 1px solid var(--line); box-shadow: 0 2px 10px rgba(26,11,16,.06); }
  .bar .wrap { padding-top: .75rem; padding-bottom: .75rem; }
  .progress-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .progress-text { font-weight: 700; color: var(--ink); white-space: nowrap; }
  .meter { flex: 1 1 160px; height: 10px; background: var(--blush); border-radius: 99px; overflow: hidden; min-width: 120px; }
  .meter span { display: block; height: 100%; width: 0; background: var(--crimson); transition: width .3s; }
  .saved { font-size: .85rem; color: var(--muted); white-space: nowrap; }
  .actions { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .65rem; }
  button, .btn { font: inherit; font-size: .95rem; font-weight: 700; border-radius: 8px; padding: .55rem .9rem; min-height: 44px; cursor: pointer; border: 1.5px solid var(--crimson); background: var(--white); color: var(--crimson); }
  button.primary { background: var(--crimson); color: var(--white); }
  button:hover { filter: brightness(.95); }
  button:focus-visible, a:focus-visible, textarea:focus-visible, input:focus-visible + .box { outline: 3px solid var(--gold-ink); outline-offset: 2px; }
  .filters { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .65rem; }
  .filters button { border-color: var(--line); color: var(--text); font-weight: 600; padding: .4rem .8rem; }
  .filters button[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--white); }

  .jump { display: flex; flex-wrap: wrap; gap: .4rem; margin: 1.25rem 0 0; }
  .jump a { text-decoration: none; background: var(--white); border: 1px solid var(--line); border-radius: 99px; padding: .35rem .8rem; font-size: .9rem; color: var(--text); }
  .jump a span { color: var(--muted); }

  .notice { margin: 1rem 0 0; padding: .8rem 1rem; border-radius: 8px; background: #FFF4D6; border: 1px solid #E8C96A; color: #5C4300; }
  .notice[hidden] { display: none; }

  .page-group { margin: 2.25rem 0; }
  .page-group h2 { font-size: 1.5rem; margin: 0 0 1rem; display: flex; align-items: baseline; gap: .75rem; flex-wrap: wrap; }
  .page-group h2 .open { font-family: Karla, sans-serif; font-size: .9rem; font-weight: 700; }

  .item { background: var(--white); border: 1px solid var(--line); border-left: 5px solid var(--line); border-radius: 10px; padding: 1.1rem 1.2rem; margin-bottom: 1rem; }
  .item.is-checked { border-left-color: var(--ok); }
  .item.has-notes { border-left-color: var(--gold-ink); }
  .item[hidden] { display: none; }
  .item-head { display: flex; gap: .85rem; align-items: flex-start; }
  .num { flex: none; min-width: 2rem; height: 2rem; border-radius: 99px; background: var(--blush); color: var(--crimson); font-weight: 700; display: grid; place-items: center; font-size: .9rem; }
  .where { margin: 0; font-size: .8rem; letter-spacing: .04em; text-transform: uppercase; color: var(--gold-ink); font-weight: 700; }
  .item h3 { margin: .15rem 0 .5rem; font-size: 1.2rem; }
  .answer { margin: .4rem 0 0 2.85rem; }
  .answer p { margin: 0 0 .5rem; }
  .answer-label { font-size: .85rem; font-weight: 700; color: var(--muted); margin-bottom: .2rem !important; }
  .answer + .answer { border-top: 1px dashed var(--line); padding-top: .6rem; }
  .flag { margin: .5rem 0 .5rem 2.85rem; padding: .55rem .75rem; border-radius: 8px; font-size: .92rem; }
  .flag-repeat { background: #FDECEF; color: #6E1022; }
  .flag-overlap { background: var(--blush); color: var(--text); }
  .controls { margin: .9rem 0 0 2.85rem; display: grid; gap: .6rem; }
  .check { display: inline-flex; align-items: center; gap: .6rem; font-weight: 700; cursor: pointer; min-height: 44px; width: fit-content; }
  .check input { position: absolute; opacity: 0; width: 1px; height: 1px; }
  .check .box { width: 28px; height: 28px; border: 2px solid var(--muted); border-radius: 6px; display: grid; place-items: center; color: transparent; background: var(--white); }
  .check input:checked + .box { background: var(--ok); border-color: var(--ok); color: var(--white); }
  .notes { display: grid; gap: .3rem; }
  .notes-label { font-weight: 700; font-size: .95rem; }
  .hint { font-weight: 400; color: var(--muted); }
  textarea { font: inherit; font-size: 1rem; width: 100%; padding: .6rem .7rem; border: 1.5px solid var(--line); border-radius: 8px; resize: vertical; min-height: 3.2rem; background: #FFFDFB; }
  textarea:focus { border-color: var(--crimson); outline: none; }

  .orphans { background: var(--white); border: 1px solid #E8C96A; border-radius: 10px; padding: 1rem 1.2rem; }
  .empty { text-align: center; color: var(--muted); padding: 2rem 0; }
  footer.foot { color: var(--muted); font-size: .85rem; padding: 2rem 0 3rem; }

  @media (max-width: 560px) {
    .answer, .flag, .controls { margin-left: 0; }
    .item { padding: 1rem; }
  }
  @media (prefers-reduced-motion: reduce) { .meter span { transition: none; } }
</style>
</head>
<body>
  <div class="intro">
    <div class="wrap">
      <h1>FAQ review checklist</h1>
      <p><strong>${pending.length} questions still to review</strong>, from ${groups.length} pages. The ${reviewedCount} you have already reviewed are done and no longer shown.</p>
      <ol>
        <li>Read each answer. If it's right, tick <strong>Checked</strong>.</li>
        <li>If anything needs changing, write it in <strong>Notes</strong>. Tick Checked as well once you've dealt with it.</li>
        <li>When you're done, press <strong>Copy results</strong> and paste them to Jayden.</li>
      </ol>
      <p style="margin-top:.8rem">Your progress saves automatically in this browser, so you can close the page and come back later. Use the same device and browser, or use <strong>Download backup</strong> to move it.</p>
    </div>
  </div>

  <div class="bar">
    <div class="wrap">
      <div class="progress-row">
        <span class="progress-text" id="progress-text">0 of ${pending.length} checked</span>
        <div class="meter" role="progressbar" aria-labelledby="progress-text" aria-valuemin="0" aria-valuemax="${pending.length}" aria-valuenow="0"><span id="meter"></span></div>
        <span class="saved" id="saved" aria-live="polite"></span>
      </div>
      <div class="actions">
        <button class="primary" id="copy">Copy results</button>
        <button id="download-txt">Download results (.txt)</button>
        <button id="download-json">Download backup</button>
        <button id="restore">Restore backup</button>
        <input type="file" id="restore-file" accept="application/json,.json" hidden>
      </div>
      <div class="filters" role="group" aria-label="Show">
        <button data-filter="all" aria-pressed="true">All</button>
        <button data-filter="todo" aria-pressed="false">Not checked yet</button>
        <button data-filter="notes" aria-pressed="false">With notes</button>
        <button data-filter="flagged" aria-pressed="false">Repeated or overlapping</button>
      </div>
    </div>
  </div>

  <main class="wrap">
    <p class="notice" id="storage-warning" hidden>This browser is blocking saved progress (private browsing, or cookies and site data switched off). Your ticks and notes will be lost if you close the page. Use a normal window, or press <strong>Download backup</strong> before you leave.</p>
    <nav class="jump" aria-label="Jump to page">${nav}</nav>
    <div id="orphans"></div>
    ${sections}
    <p class="empty" id="empty" hidden>Nothing to show for this filter.</p>
    <footer class="foot">${pending.length} questions left of ${items.length} on the site (${repeats} of those left are asked on more than one page, shown once here with every page's answer). Generated ${new Date().toISOString().slice(0, 10)} from the website's FAQ sections.</footer>
  </main>

<script>
(function () {
  "use strict";
  var ITEMS = ${JSON.stringify(data)};
  var KEY = "reena-faq-review-v2";
  var byId = {};
  ITEMS.forEach(function (i) { byId[i.id] = i; });

  // ---- storage: always wrapped, page works without it ----
  var canStore = true;
  function load() {
    try { var raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; }
    catch (e) { canStore = false; return null; }
  }
  function persist(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch (e) { canStore = false; return false; }
  }
  try { localStorage.setItem(KEY + "-probe", "1"); localStorage.removeItem(KEY + "-probe"); } catch (e) { canStore = false; }

  var state = load() || { answers: {}, savedAt: null };
  if (!state.answers) state.answers = {};

  var savedEl = document.getElementById("saved");
  function stamp(t) { return t ? new Date(t).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""; }
  function showSaved() {
    if (!canStore) { savedEl.textContent = "Not saving in this browser"; document.getElementById("storage-warning").hidden = false; return; }
    savedEl.textContent = state.savedAt ? "Saved " + stamp(state.savedAt) : "";
  }

  // ---- wire each item ----
  var articles = Array.prototype.slice.call(document.querySelectorAll(".item"));
  articles.forEach(function (el) {
    var id = el.dataset.id, cb = el.querySelector('[data-field="checked"]'), ta = el.querySelector('[data-field="notes"]');
    var s = state.answers[id] || {};
    cb.checked = !!s.checked; ta.value = s.notes || "";
    var timer;
    function save() {
      state.answers[id] = { checked: cb.checked, notes: ta.value, updatedAt: new Date().toISOString() };
      state.savedAt = new Date().toISOString();
      persist(state); refresh(); showSaved();
    }
    cb.addEventListener("change", save);
    ta.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(save, 400); decorate(el); });
    ta.addEventListener("blur", function () { clearTimeout(timer); save(); });
  });
  window.addEventListener("beforeunload", function () {
    articles.forEach(function (el) {
      var id = el.dataset.id, cb = el.querySelector('[data-field="checked"]'), ta = el.querySelector('[data-field="notes"]');
      var prev = state.answers[id] || {};
      if ((prev.notes || "") !== ta.value || !!prev.checked !== cb.checked) state.answers[id] = { checked: cb.checked, notes: ta.value, updatedAt: new Date().toISOString() };
    });
    persist(state);
  });

  function decorate(el) {
    var cb = el.querySelector('[data-field="checked"]'), ta = el.querySelector('[data-field="notes"]');
    el.classList.toggle("is-checked", cb.checked && !ta.value.trim());
    el.classList.toggle("has-notes", !!ta.value.trim());
  }

  var filter = "all";
  function refresh() {
    var done = 0;
    articles.forEach(function (el) {
      decorate(el);
      var cb = el.querySelector('[data-field="checked"]'), ta = el.querySelector('[data-field="notes"]');
      if (cb.checked) done++;
      var show = filter === "all" ||
        (filter === "todo" && !cb.checked) ||
        (filter === "notes" && ta.value.trim()) ||
        (filter === "flagged" && el.querySelector(".flag"));
      el.hidden = !show;
    });
    document.querySelectorAll(".page-group").forEach(function (g) { g.hidden = !g.querySelector(".item:not([hidden])"); });
    document.getElementById("empty").hidden = !!document.querySelector(".item:not([hidden])");
    document.getElementById("progress-text").textContent = done + " of " + ITEMS.length + " checked";
    document.getElementById("meter").style.width = (100 * done / ITEMS.length) + "%";
    document.querySelector('[role="progressbar"]').setAttribute("aria-valuenow", done);
  }

  document.querySelectorAll("[data-filter]").forEach(function (b) {
    b.addEventListener("click", function () {
      filter = b.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      refresh();
    });
  });

  // ---- notes on questions that are no longer on the site ----
  function orphans() {
    return Object.keys(state.answers).filter(function (id) { return !byId[id] && state.answers[id].notes && state.answers[id].notes.trim(); });
  }
  (function renderOrphans() {
    var list = orphans(); if (!list.length) return;
    var box = document.getElementById("orphans");
    box.innerHTML = '<div class="orphans"><h2 style="font-size:1.2rem;margin:0 0 .5rem">Notes on questions no longer on the site</h2><p style="margin:0 0 .5rem">These questions were removed or reworded after you wrote these notes. They are still included when you copy your results.</p><ul></ul></div>';
    var ul = box.querySelector("ul");
    list.forEach(function (id) { var li = document.createElement("li"); li.textContent = id.replace(/^q-/, "").replace(/-/g, " ") + ": " + state.answers[id].notes; ul.appendChild(li); });
  })();

  // ---- export ----
  function report() {
    var lines = [], checked = 0, noted = 0;
    ITEMS.forEach(function (i) { var s = state.answers[i.id] || {}; if (s.checked) checked++; if (s.notes && s.notes.trim()) noted++; });
    lines.push("FAQ REVIEW RESULTS");
    lines.push("Exported: " + new Date().toLocaleString());
    lines.push("Checked: " + checked + " of " + ITEMS.length + " | With notes: " + noted);
    lines.push("");
    lines.push("=== CHANGES REQUESTED (" + noted + ") ===");
    ITEMS.forEach(function (i) {
      var s = state.answers[i.id] || {}; if (!(s.notes && s.notes.trim())) return;
      lines.push("");
      lines.push("#" + i.num + " [" + i.id + "] " + (s.checked ? "(checked)" : "(NOT checked)"));
      lines.push("Page: " + i.pages.join(" + "));
      lines.push("Q: " + i.q);
      lines.push("NOTES: " + s.notes.trim());
    });
    orphans().forEach(function (id) {
      lines.push(""); lines.push("[" + id + "] (question no longer on the site)"); lines.push("NOTES: " + state.answers[id].notes.trim());
    });
    var todo = ITEMS.filter(function (i) { return !(state.answers[i.id] || {}).checked; });
    lines.push(""); lines.push("=== NOT CHECKED YET (" + todo.length + ") ===");
    todo.forEach(function (i) { lines.push("#" + i.num + " " + i.q + " (" + i.pages.join(" + ") + ")"); });
    var ok = ITEMS.filter(function (i) { var s = state.answers[i.id] || {}; return s.checked && !(s.notes && s.notes.trim()); });
    lines.push(""); lines.push("=== CHECKED, NO CHANGES (" + ok.length + ") ===");
    ok.forEach(function (i) { lines.push("#" + i.num + " " + i.q); });
    return lines.join("\\n");
  }
  function download(name, text, type) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: type }));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  var today = function () { return new Date().toISOString().slice(0, 10); };

  document.getElementById("copy").addEventListener("click", function () {
    var btn = this, text = report();
    function done(ok) { btn.textContent = ok ? "Copied" : "Copy failed: use Download results"; setTimeout(function () { btn.textContent = "Copy results"; }, 2500); }
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(function () { done(true); }, fallback); }
    else fallback();
    function fallback() {
      var t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select(); var ok = false; try { ok = document.execCommand("copy"); } catch (e) {} t.remove(); done(ok);
    }
  });
  document.getElementById("download-txt").addEventListener("click", function () { download("faq-review-results-" + today() + ".txt", report(), "text/plain"); });
  document.getElementById("download-json").addEventListener("click", function () {
    download("faq-review-backup-" + today() + ".json", JSON.stringify({ kind: "reena-faq-review", version: 1, exportedAt: new Date().toISOString(), state: state }, null, 2), "application/json");
  });
  var fileInput = document.getElementById("restore-file");
  document.getElementById("restore").addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () {
    var f = fileInput.files[0]; if (!f) return;
    f.text().then(function (txt) {
      var data = JSON.parse(txt);
      if (!data || data.kind !== "reena-faq-review" || !data.state || !data.state.answers) throw new Error("not a backup");
      state = data.state; persist(state); location.reload();
    }).catch(function () { savedEl.textContent = "That file isn't a FAQ review backup"; });
  });

  refresh(); showSaved();
})();
</script>
</body>
</html>
`;

fs.writeFileSync(OUT, html);
console.log(`faq-review.html: ${pending.length} to review, ${reviewedCount} already reviewed, ${items.length} questions on the site (${found.length} FAQs on the site, ${repeats} asked on more than one page), ${OVERLAPS.length} overlap groups`);
