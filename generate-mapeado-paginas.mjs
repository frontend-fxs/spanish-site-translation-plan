/**
 * Excel simple EN↔ES:
 *   Pagina ES | Pagina EN | Existe
 *
 * Existe = Sí cuando hay par en ambos lados (misma ruta o equivalente).
 * Existe = No cuando solo hay ES o solo EN.
 *
 * Run: node generate-mapeado-paginas.mjs
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repos = path.resolve(__dirname, '..');
const esCsv = path.join(repos, 'web-scraper-toolkit/packages/cli/fxstreet-es-pages.csv');
const enCsv = path.join(repos, 'web-scraper-toolkit/packages/cli/fxstreet-crawl.csv');
const enSimplified = path.join(
  repos,
  'web-scraper-toolkit/packages/cli/fxstreet-crawl-simplified.csv',
);
const siteApp = path.join(repos, 'Site/app');
const outXlsx = path.join(__dirname, 'csv/mapeado-paginas.xlsx');
const outCsv = path.join(__dirname, 'csv/mapeado-paginas.csv');

const STATIC_UNDER = {
  cryptocurrencies: new Set([
    'news',
    'industry-news',
    'rates-charts',
    'resources',
    'bitcoin',
    'ethereum',
    'ripple',
    'cardano',
    'dogecoin',
    'solana',
    'litecoin',
  ]),
  brokers: new Set([
    'best',
    'reviews',
    'prop',
    'cashback',
    'press-releases',
    'all-spreads',
    'brokers-forex',
    'organismos-reguladores',
  ]),
  'rates-charts': new Set([
    'chart',
    'chart-interactive',
    'forecast',
    'indicators',
    'rates',
  ]),
  education: new Set(['feed', 'latest', 'curso-forex']),
  news: new Set(['feed', 'latest', 'archive']),
  analysis: new Set(['feed', 'latest']),
  info: new Set([
    'about-us',
    'advertising-model',
    'advertising-and-sponsorship',
    'contact-us',
    'cookie-policy',
    'corporate-identity',
    'editorial-guidelines',
    'ethical-code',
    'jobs',
    'premium',
    'premium-terms-and-conditions',
    'prevention',
    'privacy-policy',
    'terms-conditions',
    'how-we-score-reviews',
    'how-fxstreet-uses-ai',
  ]),
  account: new Set([
    'login',
    'signup',
    'additional-data',
    'manage-password',
    'premium-checkout',
  ]),
  'economic-calendar': new Set([
    'fed-sentiment-index',
    'forex-market-hours',
    'world-interest-rates',
    'event',
    'country',
    'australia',
    'canada',
    'united-kingdom',
    'united-states',
  ]),
  'calendario-economico': new Set(['event']),
  macroeconomics: new Set(['central-banks', 'economic-indicator', 'trade-war', 'events']),
  'live-video': new Set(['latest', 'shows']),
  'technical-analysis': new Set([
    'elliott-wave',
    'support-resistance',
    'sentiment',
    'cycle-analysis',
  ]),
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const POST_SLUG_RE = /.+-\d{10,14}$/;
const EN_ONLY_GATES = new Set([
  '/press-releases',
  '/press-releases/[slug]',
  '/cryptocurrencies/industry-news',
  '/trade-now',
]);

/** Known localized path pairs: ES → EN */
const ES_TO_EN = new Map([
  ['/calendario-economico', '/economic-calendar'],
  ['/calendario-economico/event/[guid]', '/economic-calendar/event/[slug]'],
  ['/calendario-economico/event/[slug]', '/economic-calendar/event/[slug]'],
]);

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? '';
    });
    return row;
  });
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = false;
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function toCsv(rows, fields) {
  const esc = (v) => {
    const s = String(v ?? '');
    return /["\n\r,]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return (
    [fields.join(','), ...rows.map((r) => fields.map((f) => esc(r[f])).join(','))].join('\n') +
    '\n'
  );
}

function normalizePath(raw) {
  let s = String(raw || '').trim();
  if (!s) return null;
  let pathname = s;
  try {
    if (/^https?:\/\//i.test(s)) pathname = new URL(s).pathname || '/';
  } catch {
    return null;
  }
  if (/^\/https?:/i.test(pathname) || pathname.includes('://')) return null;
  pathname = decodeURIComponent(pathname.split('?')[0].split('#')[0]);
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
  pathname = pathname.toLowerCase();
  if (pathname.includes('login') && /uritoredirect/i.test(s)) return '/account/login';
  if (pathname.startsWith('/cdn-cgi')) return null;
  if (pathname === '/www.ffsignal.com') return null;
  if (pathname.endsWith('.xml')) return null;
  return pathname;
}

function patternize(pathname) {
  if (!pathname || pathname === '/') return '/';
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return '/';

  if (parts.length === 1 && parts[0].includes('broker') && parts[0] !== 'brokers') {
    return '/[seo-broker-landing]';
  }
  if (parts.length === 1 && POST_SLUG_RE.test(parts[0])) {
    return '/[post-sin-vertical]';
  }

  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    const parent = out[out.length - 1] || null;
    const root = out[0] || null;

    if (parent === 'educacion' || seg === 'educacion') return '/educacion/*';

    if (parent === 'education' && seg === 'curso-forex') {
      out.push('curso-forex');
      if (i + 1 < parts.length) return `/${out.join('/')}/*`;
      continue;
    }

    if (root === 'live-video') {
      if (out.length === 0) {
        out.push(seg);
        continue;
      }
      if (STATIC_UNDER['live-video'].has(seg)) {
        out.push(seg);
        continue;
      }
      out.push('[slug]');
      break;
    }

    if (parent === 'event') {
      out.push(UUID_RE.test(seg) ? '[guid]' : '[slug]');
      continue;
    }
    if (parent === 'country') {
      out.push(UUID_RE.test(seg) ? '[id]' : '[slug]');
      continue;
    }
    if (parent === 'jobs' && root === 'info') {
      out.push('[slug]');
      continue;
    }
    if (parent === 'crosses') {
      out.push('[slug]');
      continue;
    }
    if (parent === 'rates-charts') {
      if (STATIC_UNDER['rates-charts'].has(seg)) out.push(seg);
      else {
        out.push('[slug]');
        if (parts[i + 1] === 'forecast' || parts[i + 1] === 'chart') out.push(parts[++i]);
      }
      continue;
    }
    if (parent === 'cryptocurrencies') {
      if (STATIC_UNDER.cryptocurrencies.has(seg)) out.push(seg);
      else out.push('[slug]');
      continue;
    }
    if (out.length >= 2 && out[out.length - 2] === 'cryptocurrencies' && parent === 'news') {
      out.push(seg === 'feed' ? 'feed' : '[slug]');
      continue;
    }
    if (parent === 'brokers') {
      if (STATIC_UNDER.brokers.has(seg)) out.push(seg);
      else out.push('[slug]');
      continue;
    }
    if (parent === 'best' || parent === 'reviews' || parent === 'prop') {
      out.push('[slug]');
      continue;
    }
    if (parent === 'central-banks' || parent === 'economic-indicator') {
      out.push('[slug]');
      continue;
    }
    if (parent === 'resources') {
      out.push('[slug]');
      continue;
    }
    if (
      parent === 'currencies' ||
      parent === 'commodities' ||
      parent === 'company' ||
      parent === 'author'
    ) {
      out.push('[slug]');
      continue;
    }
    if (parent === 'press-releases') {
      out.push('[slug]');
      continue;
    }
    if ((parent === 'news' || parent === 'analysis' || parent === 'education') && root === parent) {
      if (STATIC_UNDER[parent]?.has(seg)) out.push(seg);
      else out.push('[slug]');
      continue;
    }
    if (parent === 'events' && root === 'macroeconomics') {
      out.push(seg === 'trade-war' ? seg : '[slug]');
      continue;
    }
    if (parent === 'events' && root === 'events') {
      out.push('[slug]');
      continue;
    }
    if (root === 'technical-analysis') {
      out.push(seg);
      if (out.length >= 3) break;
      continue;
    }
    if (parent === 'rates' && ['majors', 'indices', 'crosses'].includes(seg)) {
      out.push(seg);
      continue;
    }
    if (parent === 'indicators' && seg === 'technical-levels') {
      out.push(seg);
      continue;
    }
    if (parent === 'chart' && seg === 'station') {
      out.push(seg);
      continue;
    }
    if (parent === 'economic-calendar' && STATIC_UNDER['economic-calendar'].has(seg)) {
      out.push(seg);
      continue;
    }
    if (parent === 'info' && STATIC_UNDER.info.has(seg)) {
      out.push(seg);
      continue;
    }
    if (parent === 'account' && STATIC_UNDER.account.has(seg)) {
      out.push(seg);
      continue;
    }
    out.push(seg);
  }

  let p = `/${out.join('/')}`;
  if (p.startsWith('/rates-charts/rates/') && p.split('/').length > 4) {
    const kind = p.split('/')[3];
    if (kind === 'crosses') p = '/rates-charts/rates/crosses/[slug]';
    else if (kind === 'majors' || kind === 'indices') p = `/rates-charts/rates/${kind}`;
  }
  return p;
}

function walkPages(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkPages(full, acc);
    else if (ent.name === 'page.tsx') acc.push(full);
  }
  return acc;
}

function nextPatterns() {
  const pats = new Set();
  for (const page of walkPages(siteApp)) {
    const rel = path.relative(siteApp, path.dirname(page)).split(path.sep);
    const parts = [];
    for (const seg of rel) {
      if (!seg || seg === '.') continue;
      if (seg.startsWith('(') && seg.endsWith(')')) continue;
      if (seg.startsWith('@')) continue;
      parts.push(seg);
    }
    pats.add(parts.length ? `/${parts.join('/')}` : '/');
  }
  return pats;
}

function loadPathsFromEs() {
  const rows = parseCsv(fs.readFileSync(esCsv, 'utf8'));
  const set = new Set();
  for (const row of rows) {
    const p = normalizePath(row.normalized_path || row.url || '');
    if (p) set.add(p);
  }
  return set;
}

function loadPathsFromEn() {
  const set = new Set();
  const rows = parseCsv(fs.readFileSync(enCsv, 'utf8'));
  for (const row of rows) {
    const url = row.URL || row.url || Object.values(row)[0];
    const p = normalizePath(url);
    if (p) set.add(p);
  }
  const simp = parseCsv(fs.readFileSync(enSimplified, 'utf8'));
  for (const row of simp) {
    const pat = String(row['URL Pattern'] || '')
      .trim()
      .toLowerCase();
    if (!pat || pat.endsWith('.xml')) continue;
    set.add(pat);
  }
  return set;
}

function canonicalEventPat(pat) {
  return pat
    .replace('/economic-calendar/event/[id]', '/economic-calendar/event/[slug]')
    .replace('/economic-calendar/event/[guid]', '/economic-calendar/event/[slug]');
}

function bagFrom(paths) {
  const bag = new Map();
  for (const p of paths) {
    let pat = p.includes('[') || p.includes('*') ? p : patternize(p);
    pat = canonicalEventPat(pat);
    if (!bag.has(pat)) bag.set(pat, { count: 0, examples: [] });
    const e = bag.get(pat);
    e.count += 1;
    if (e.examples.length < 2 && !p.includes('[')) e.examples.push(p);
  }
  return bag;
}

function hasNext(pat, nextPats) {
  if (nextPats.has(pat)) return true;
  const alt = pat.replace('[guid]', '[slug]').replace('[id]', '[slug]');
  if (nextPats.has(alt)) return true;
  if (pat.endsWith('/*')) {
    const base = pat.slice(0, -2);
    return nextPats.has(base) || nextPats.has(`${base}/[slug]`);
  }
  return false;
}

const ES_ONLY_PATH_PREFIXES = [
  '/calendario-economico',
  '/mexico',
  '/education/curso-forex',
  '/educacion',
  '/brokers/organismos-reguladores',
  '/brokers/brokers-forex',
  '/fundamental/tabla-tipos-interes',
  '/[seo-broker-landing]',
];

function isEsOnlyPath(pat) {
  return ES_ONLY_PATH_PREFIXES.some((p) => {
    if (pat === p) return true;
    if (pat.startsWith(`${p}/`)) return true;
    if (pat === `${p}/*` || pat.startsWith(`${p}/*`)) return true;
    return false;
  });
}

const esBag = bagFrom(loadPathsFromEs());
const enBag = bagFrom(loadPathsFromEn());
const nextPats = new Set([...nextPatterns()].map(canonicalEventPat));
const all = new Set([...esBag.keys(), ...enBag.keys(), ...nextPats]);

/** Build simplified pair rows */
const pairKey = (es, en) => `${es || ''}↔${en || ''}`;
const pairs = new Map();

function addPair(paginaEs, paginaEn, existe) {
  const key = pairKey(paginaEs, paginaEn);
  if (pairs.has(key)) return;
  pairs.set(key, {
    'Pagina ES': paginaEs || '',
    'Pagina EN': paginaEn || '',
    Existe: existe,
  });
}

for (const pat of all) {
  const inEsScrap = esBag.has(pat);
  const inEnScrap = enBag.has(pat);
  const inNext = hasNext(pat, nextPats);

  // Skip EN side of localized calendar when we already emit the ES↔EN pair
  if (pat === '/economic-calendar' || pat.startsWith('/economic-calendar/event/')) {
    // handled via ES_TO_EN from calendario-* or as solo_en country pages
  }

  if (EN_ONLY_GATES.has(pat)) {
    addPair('', pat, 'No');
    continue;
  }

  if (ES_TO_EN.has(pat)) {
    addPair(pat, ES_TO_EN.get(pat), 'Sí');
    continue;
  }

  if (isEsOnlyPath(pat)) {
    addPair(pat, '', 'No');
    continue;
  }

  if (inNext) {
    // Shared Next route (same path both locales), except pure EN calendar listing already paired
    if (pat === '/economic-calendar') {
      // Prefer ES localized pair; if calendario already added, skip duplicate
      if (!pairs.has(pairKey('/calendario-economico', '/economic-calendar'))) {
        addPair('/calendario-economico', '/economic-calendar', 'Sí');
      }
      continue;
    }
    if (pat.startsWith('/calendario-economico')) {
      addPair(pat, ES_TO_EN.get(pat) || '', ES_TO_EN.has(pat) ? 'Sí' : 'No');
      continue;
    }
    addPair(pat, pat, 'Sí');
    continue;
  }

  if (inEsScrap && inEnScrap) {
    addPair(pat, pat, 'Sí');
    continue;
  }
  if (inEsScrap) {
    addPair(pat, '', 'No');
    continue;
  }
  if (inEnScrap) {
    addPair('', pat, 'No');
  }
}

const rows = [...pairs.values()].sort((a, b) => {
  const order = { Sí: 1, No: 0 };
  return (
    order[a.Existe] - order[b.Existe] ||
    (a['Pagina ES'] || a['Pagina EN']).localeCompare(b['Pagina ES'] || b['Pagina EN'])
  );
});

// Put asymmetries (No) first, then Sí — user cares about gaps
rows.sort((a, b) => {
  if (a.Existe !== b.Existe) return a.Existe === 'No' ? -1 : 1;
  return (a['Pagina ES'] || a['Pagina EN']).localeCompare(b['Pagina ES'] || b['Pagina EN']);
});

const fields = ['Pagina ES', 'Pagina EN', 'Existe'];
fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.writeFileSync(outCsv, toCsv(rows, fields), 'utf8');

// Write xlsx via Python openpyxl
const py = `
import csv
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
ws = wb.active
ws.title = "Mapeado EN-ES"
headers = ["Pagina ES", "Pagina EN", "Existe"]
ws.append(headers)
for c in ws[1]:
    c.font = Font(bold=True)
    c.fill = PatternFill("solid", fgColor="E8EEF4")

with open(r"${outCsv.replace(/\\/g, '/')}", encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        ws.append([row["Pagina ES"], row["Pagina EN"], row["Existe"]])
        if row["Existe"] == "No":
            ws.cell(ws.max_row, 3).fill = PatternFill("solid", fgColor="FCE8E6")
        else:
            ws.cell(ws.max_row, 3).fill = PatternFill("solid", fgColor="E6F4EA")

ws.column_dimensions["A"].width = 56
ws.column_dimensions["B"].width = 56
ws.column_dimensions["C"].width = 10
ws.auto_filter.ref = ws.dimensions
ws.freeze_panes = "A2"
wb.save(r"${outXlsx.replace(/\\/g, '/')}")
print("Wrote", r"${outXlsx.replace(/\\/g, '/')}", "rows", ws.max_row - 1)
`;

const r = spawnSync('python', ['-c', py], { encoding: 'utf8' });
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(r.status || 1);
}
console.log(r.stdout.trim());
const no = rows.filter((x) => x.Existe === 'No').length;
const si = rows.filter((x) => x.Existe === 'Sí').length;
console.log(`CSV ${outCsv} · No=${no} Sí=${si} total=${rows.length}`);
