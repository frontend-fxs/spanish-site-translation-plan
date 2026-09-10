#!/usr/bin/env node
/**
 * Regenerate spanish-site-translation-plan/csv from current Site colocated i18n.
 * Source of truth: Site branch dictionaries + navigation-data-{en,es}.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLAN = HERE;
const SITE = path.resolve(HERE, '../Site');
const CSV_DIR = path.join(PLAN, 'csv');

/** Namespaces registered in Site/i18n/request.ts (+ rss). Must stay in sync. */
const COMPONENT_NAMESPACES = [
  'home-page',
  'root-layout',
  'news',
  'crypto-news',
  'education',
  'search',
  'contact-us',
  'editorial-guidelines',
  'become-contributor',
  'transparency-translations',
  'ethical-code',
  'share',
  'language-selector',
  'posts',
  'disclaimer-section',
  'sidebar',
  'author-section',
  'editorial-highlight-section',
  'live-coverage-section',
  'editorial-highlight-calendar-section',
  'post-metadata',
  'post-verified-translation',
  'post-list-multifeed',
  'not-found',
  'error-500',
  'service-not-available',
  'calendar-disclaimer',
  'in-deep-analysis-section',
  'cryptocurrencies-section',
  'stocks-section',
  'weekly-forecast-section',
  'education-section',
  'industry-news-section',
  'more-news-section',
  'one-signal',
  'advertisement-dialog',
  'newsletter',
  'paywall',
  'press-release',
  'crypto-industry-news',
  'algolia',
  'editorial-highlight-card',
  'cashback-widget',
  'sponsored',
  'analysis-page',
  'cryptocurrencies-page',
  'forecast',
  'assets-forecast',
  'forecast-chart',
  'greyboxes',
  'macro-showcases',
  'macro-showcases-sub-home',
  'premium',
  'propinder',
  'premium-terms-and-conditions',
  'terms-conditions',
  'privacy-policy',
  'cookie-policy',
  'prevention',
  'advertising-model',
  'how-we-score-reviews',
  'how-fxstreet-uses-ai',
  'header',
  'footer',
  'youtube-videos-section',
  'youtube',
  'about-us',
  'corporate-identity',
  'showcases-variants',
  'showcase',
  'calendar-guide',
  'commodities',
  'rates-charts',
  'equities',
  'forex-market-hours',
  'fed-sentiment-index',
  'world-interest-rates',
  'central-banks',
  'central-bank-detail',
  'economic-indicator-detail',
  'checklist-section',
  'trade-war',
  'key-technicals-table',
  'contributors-table',
  'company',
  'author',
  'brokers',
  'broker-detail',
  'broker-review',
  'broker-review-sub-home',
  'broker-listing',
  'best-brokers-section',
  'best-brokers-yearly-section',
  'economic-calendar',
  'calendar-event',
  'topic-page',
  'profile',
  'subscriptions',
  'account',
];

/** PO lots — every namespace appears in exactly one lot. */
const LOTS = {
  '01-legal': [
    'about-us',
    'advertising-model',
    'become-contributor',
    'contact-us',
    'cookie-policy',
    'corporate-identity',
    'editorial-guidelines',
    'ethical-code',
    'how-fxstreet-uses-ai',
    'how-we-score-reviews',
    'premium-terms-and-conditions',
    'prevention',
    'privacy-policy',
    'terms-conditions',
    'transparency-translations',
  ],
  '02-chrome-navegacion': [
    'advertisement-dialog',
    'analysis-page',
    'calendar-disclaimer',
    'crypto-news',
    'disclaimer-section',
    'education',
    'error-500',
    'footer',
    'greyboxes',
    'header',
    'home-page',
    'language-selector',
    'news',
    'not-found',
    'one-signal',
    'root-layout',
    'search',
    'service-not-available',
    'share',
    'sidebar',
    'sponsored',
  ],
  '03-cuenta-premium': ['account', 'paywall', 'premium', 'profile', 'subscriptions'],
  '04-calendario-rates-brokers': [
    'best-brokers-section',
    'best-brokers-yearly-section',
    'broker-detail',
    'broker-listing',
    'broker-review',
    'broker-review-sub-home',
    'brokers',
    'calendar-event',
    'calendar-guide',
    'cashback-widget',
    'economic-calendar',
    'fed-sentiment-index',
    'forex-market-hours',
    'macro-showcases',
    'macro-showcases-sub-home',
    'propinder',
    'rates-charts',
    'showcase',
    'showcases-variants',
    'world-interest-rates',
  ],
  '05-resto-verticales': [
    'algolia',
    'assets-forecast',
    'author',
    'author-section',
    'central-bank-detail',
    'central-banks',
    'checklist-section',
    'commodities',
    'company',
    'contributors-table',
    'crypto-industry-news',
    'cryptocurrencies-page',
    'cryptocurrencies-section',
    'economic-indicator-detail',
    'editorial-highlight-calendar-section',
    'editorial-highlight-card',
    'editorial-highlight-section',
    'education-section',
    'equities',
    'forecast',
    'forecast-chart',
    'in-deep-analysis-section',
    'industry-news-section',
    'key-technicals-table',
    'live-coverage-section',
    'more-news-section',
    'newsletter',
    'post-list-multifeed',
    'post-metadata',
    'post-verified-translation',
    'posts',
    'press-release',
    'stocks-section',
    'topic-page',
    'trade-war',
    'weekly-forecast-section',
    'youtube',
    'youtube-videos-section',
  ],
  '06-rss': ['rss-feed'],
};

const HEADER = [
  'Carpeta',
  'Bloque',
  'Clave',
  'Inglés (original)',
  'Español (borrador IA)',
  'Español (revisado)',
  'Estado',
  'Comentarios',
];

function flatten(obj, prefix = '', out = []) {
  if (obj === null || obj === undefined) return out;
  if (typeof obj !== 'object') {
    out.push({ clave: prefix, value: obj });
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object') flatten(v, next, out);
    else out.push({ clave: next, value: v });
  }
  return out;
}

function esc(v) {
  const s = v == null ? '' : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function loadJson(ns, locale) {
  if (ns === 'rss-feed') {
    return JSON.parse(
      fs.readFileSync(
        path.join(SITE, `packages/lib/server-only/rss/rss-feed.${locale}.json`),
        'utf8',
      ),
    );
  }
  const p = path.join(
    SITE,
    `packages/ui/src/components/${ns}/${ns}.${locale}.json`,
  );
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadNavigation(locale) {
  const file =
    locale === 'en'
      ? path.join(
          SITE,
          'packages/ui/src/components/header/navigation-data/navigation-data-en.ts',
        )
      : path.join(
          SITE,
          'packages/ui/src/components/header/navigation-data/navigation-data-es.ts',
        );
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/^import[\s\S]*?;\r?\n/, '');
  code = code.replace(/const year\s*=\s*new Date\(\)\.getFullYear\(\);\s*/g, '');
  code = code.replace(/export const \w+\s*:\s*\w+\s*=\s*/, 'return ');
  const year = new Date().getFullYear();
  // eslint-disable-next-line no-new-func
  return new Function('year', code)(year);
}

function flattenNav(data) {
  /** @type {Map<string, string>} */
  const map = new Map();
  for (const section of data.SectionEntries || []) {
    const sid = section.Id || 'SECTION';
    const surl = section.Url || '';
    if (section.Text) {
      map.set(`${sid} / ${surl}`, section.Text);
    }
    (section.SubSectionEntries || []).forEach((sub, si) => {
      if (sub.Text) {
        const slug = sub.Text.replace(/\s+/g, '_').slice(0, 40) || String(si);
        map.set(`${sid} / sub:${slug}`, sub.Text);
      }
      for (const item of sub.ItemEntries || []) {
        if (!item.Text) continue;
        const feature = item.Tracking?.Feature || 'item';
        const url = item.Url || '';
        map.set(`${sid} / ${feature} / ${url}`, item.Text);
      }
    });
  }
  return map;
}

function validateLots() {
  const assigned = new Set();
  for (const [lot, nss] of Object.entries(LOTS)) {
    for (const ns of nss) {
      if (assigned.has(ns)) throw new Error(`Duplicate lot assignment: ${ns} in ${lot}`);
      assigned.add(ns);
    }
  }
  for (const ns of COMPONENT_NAMESPACES) {
    if (!assigned.has(ns)) throw new Error(`Namespace not in any lot: ${ns}`);
  }
  for (const ns of assigned) {
    if (ns !== 'rss-feed' && !COMPONENT_NAMESPACES.includes(ns)) {
      throw new Error(`Lot has unknown namespace: ${ns}`);
    }
  }
  if (!assigned.has('rss-feed')) throw new Error('rss-feed missing from lots');
}

function loadPreviousReviewed() {
  /** clave identity: carpeta|bloque|clave -> { reviewed, estado, comments } */
  const map = new Map();
  if (!fs.existsSync(CSV_DIR)) return map;
  for (const file of fs.readdirSync(CSV_DIR).filter((f) => f.endsWith('.csv'))) {
    const text = fs.readFileSync(path.join(CSV_DIR, file), 'utf8');
    // light parse for reviewed only
    const rows = parseCsv(text);
    for (let i = 1; i < rows.length; i++) {
      const [carpeta, bloque, clave, , , reviewed, estado, comments] = rows[i];
      if (reviewed && String(estado).toLowerCase() === 'revisado') {
        map.set(`${carpeta}|${bloque}|${clave}`, {
          reviewed,
          estado,
          comments: comments || '',
        });
      }
    }
  }
  return map;
}

function parseCsv(text) {
  const rows = [];
  let i = 0;
  let field = '';
  let row = [];
  let inQ = false;
  const src = text.replace(/^\uFEFF/, '');
  while (i < src.length) {
    const ch = src[i];
    if (inQ) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQ = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQ = true;
      i++;
      continue;
    }
    if (ch === ',') {
      row.push(field);
      field = '';
      i++;
      continue;
    }
    if (ch === '\n' || (ch === '\r' && src[i + 1] === '\n')) {
      row.push(field);
      rows.push(row);
      field = '';
      row = [];
      if (ch === '\r') i++;
      i++;
      continue;
    }
    if (ch === '\r') {
      row.push(field);
      rows.push(row);
      field = '';
      row = [];
      i++;
      continue;
    }
    field += ch;
    i++;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function carpetaFor(ns) {
  if (ns === 'rss-feed') return 'rss';
  return `componentes/${ns}`;
}

function bloqueFor(ns) {
  if (ns === 'rss-feed') return 'rss-feed';
  return ns;
}

// --- main ---
validateLots();

const previous = loadPreviousReviewed();
console.log('Previous Revisado rows preserved (if matching):', previous.size);

/** @type {Map<string, {carpeta:string,bloque:string,clave:string,en:string,es:string,comments?:string}[]>} */
const lotRows = new Map(Object.keys(LOTS).map((k) => [k, []]));

for (const [lot, namespaces] of Object.entries(LOTS)) {
  for (const ns of namespaces) {
    if (ns === 'rss-feed') {
      // handled below as component-like
    }
    const enObj = loadJson(ns, 'en');
    let esObj = {};
    try {
      esObj = loadJson(ns, 'es');
    } catch {
      console.warn('Missing ES file for', ns);
    }
    const enFlat = flatten(enObj);
    const esFlat = new Map(flatten(esObj).map((x) => [x.clave, x.value]));
    const carpeta = carpetaFor(ns);
    const bloque = bloqueFor(ns);
    for (const { clave, value } of enFlat) {
      const id = `${carpeta}|${bloque}|${clave}`;
      const prev = previous.get(id);
      lotRows.get(lot).push({
        carpeta,
        bloque,
        clave,
        en: value == null ? '' : String(value),
        es: esFlat.has(clave) ? String(esFlat.get(clave) ?? '') : '',
        reviewed: prev?.reviewed || '',
        estado: prev?.estado || 'Pendiente',
        comments: prev?.comments || '',
      });
    }
  }
}

// Navigation → lote 02
const navEn = flattenNav(loadNavigation('en'));
const navEs = flattenNav(loadNavigation('es'));
const navKeys = new Set([...navEn.keys(), ...navEs.keys()]);
const navSorted = [...navKeys].sort((a, b) => a.localeCompare(b));
for (const clave of navSorted) {
  const carpeta = 'navegacion';
  const bloque = 'menu-principal';
  const id = `${carpeta}|${bloque}|${clave}`;
  const prev = previous.get(id);
  const en = navEn.get(clave) || '';
  const es = navEs.get(clave) || '';
  let comments = prev?.comments || '';
  if (!en && es) comments = comments || 'es-only';
  if (en && !es) comments = comments || 'en-only';
  lotRows.get('02-chrome-navegacion').push({
    carpeta,
    bloque,
    clave,
    en,
    es,
    reviewed: prev?.reviewed || '',
    estado: prev?.estado || 'Pendiente',
    comments,
  });
}

// Write CSVs (replace all)
for (const file of fs.readdirSync(CSV_DIR).filter((f) => f.endsWith('.csv'))) {
  fs.unlinkSync(path.join(CSV_DIR, file));
}

let total = 0;
for (const [lot, rows] of lotRows) {
  rows.sort((a, b) => {
    const c = a.carpeta.localeCompare(b.carpeta) || a.bloque.localeCompare(b.bloque);
    return c || a.clave.localeCompare(b.clave);
  });
  const lines = [
    HEADER.join(','),
    ...rows.map((r) =>
      [r.carpeta, r.bloque, r.clave, r.en, r.es, r.reviewed, r.estado, r.comments]
        .map(esc)
        .join(','),
    ),
  ];
  const out = path.join(CSV_DIR, `${lot}.csv`);
  fs.writeFileSync(out, `${lines.join('\n')}\n`, 'utf8');
  total += rows.length;
  console.log(`wrote ${lot}.csv rows=${rows.length}`);
}

// Audit
const siteIds = new Set();
for (const ns of [...COMPONENT_NAMESPACES, 'rss-feed']) {
  const enObj = loadJson(ns === 'rss-feed' ? 'rss-feed' : ns, 'en');
  for (const { clave } of flatten(enObj)) {
    siteIds.add(`${bloqueFor(ns)}|${clave}`);
  }
}
const csvIds = new Set();
let csvNav = 0;
for (const [lot, rows] of lotRows) {
  for (const r of rows) {
    if (r.carpeta === 'navegacion') {
      csvNav++;
      continue;
    }
    csvIds.add(`${r.bloque}|${r.clave}`);
  }
}
const miss = [...siteIds].filter((id) => !csvIds.has(id));
const orphan = [...csvIds].filter((id) => !siteIds.has(id));
console.log('TOTAL csv rows (incl nav):', total);
console.log('Site leaf keys:', siteIds.size);
console.log('CSV component keys:', csvIds.size);
console.log('Nav rows:', csvNav);
console.log('IN SITE NOT CSV:', miss.length);
console.log('IN CSV NOT SITE:', orphan.length);
if (miss.length) console.log('miss sample', miss.slice(0, 10));
if (orphan.length) console.log('orphan sample', orphan.slice(0, 10));
if (miss.length || orphan.length) process.exitCode = 1;
else console.log('AUDIT OK — component keys 1:1 with Site');
