// tools/check-links.js — pre-deploy link check. Run from the repo root:
//   node tools/check-links.js
//
// Walks every .html file (except node_modules) and checks that each local href/src
// points at a file that exists on disk, with the exact letter case. Netlify is
// case-sensitive and Windows is not, so a wrong-case video or image src works locally
// and 404s in production. Also checks #fragment links within the same page.
// External URLs, mailto:, tel:, javascript: and data: are skipped. Paths handled by
// redirects or rewrites in netlify.toml (e.g. /quote/*) are listed in ALLOWED.
// Exits 1 if anything is broken.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ALLOWED = [/^\/quote\//, /^\/\.netlify\/functions\//, /^\/videos(\.html)?$/];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// existsSync is case-insensitive on Windows, so compare each segment's real name.
function existsExactCase(abs) {
  const rel = path.relative(ROOT, abs);
  if (rel.startsWith('..')) return false;
  let cur = ROOT;
  for (const seg of rel.split(path.sep).filter(Boolean)) {
    let names;
    try { names = fs.readdirSync(cur); } catch { return false; }
    if (!names.includes(seg)) return false;
    cur = path.join(cur, seg);
  }
  return true;
}

function resolveTarget(file, url) {
  const clean = url.split('#')[0].split('?')[0];
  let abs = clean.startsWith('/')
    ? path.join(ROOT, decodeURI(clean))
    : path.join(path.dirname(file), decodeURI(clean));
  if (clean === '' ) return file;
  if (clean.endsWith('/') || (fs.existsSync(abs) && fs.statSync(abs).isDirectory())) abs = path.join(abs, 'index.html');
  return abs;
}

const problems = [];
let checked = 0;
const ids = new Map();
const files = walk(ROOT);
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  ids.set(f, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));
}

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, m => (/\bsrc=/.test(m.slice(0, m.indexOf('>'))) ? m.slice(0, m.indexOf('>') + 1) : ''));
  const refs = [...html.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)].map(m => m[1]);
  for (const ref of refs) {
    if (/^(https?:|\/\/|mailto:|tel:|javascript:|data:|sms:|whatsapp:)/i.test(ref)) continue;
    const pathPart = ref.split('#')[0].split('?')[0];
    if (ALLOWED.some(re => re.test(pathPart))) continue;
    checked++;
    const target = resolveTarget(f, ref);
    const where = path.relative(ROOT, f);
    if (!existsExactCase(target)) { problems.push(`${where}: missing ${ref}`); continue; }
    const frag = ref.includes('#') ? ref.split('#')[1] : '';
    if (frag && target.endsWith('.html') && ids.has(target) && !ids.get(target).has(frag)) {
      problems.push(`${where}: no id="${frag}" in ${path.relative(ROOT, target)}`);
    }
  }
}

console.log(`${files.length} pages, ${checked} local links checked, ${problems.length} problem(s).`);
problems.forEach(p => console.log('  ' + p));
process.exit(problems.length ? 1 : 0);
