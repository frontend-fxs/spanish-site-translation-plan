import fs from "node:fs";
import path from "node:path";

const root = path.resolve("c:/Users/oriol/source/repos/spanish-site-translation-plan");

function toPattern(raw) {
  const p = String(raw).split("?")[0];
  const parts = p.split("/").filter(Boolean);
  if (!parts.length) return "/";
  if (/^\/company\/[^/]+$/.test(p)) return "/company/[slug]";
  if (/^\/author\/[^/]+$/.test(p)) return "/author/[slug]";
  if (/^\/press-releases\/[^/]+$/.test(p)) return "/press-releases/[slug]";
  if (/^\/currencies\/[^/]+$/.test(p)) return "/currencies/[slug]";
  if (/^\/commodities\/[^/]+$/.test(p)) return "/commodities/[slug]";
  if (/^\/education\/curso-forex(\/.*)?$/.test(p)) return "/education/curso-forex/*";
  if (
    /^\/education\/[^/]+$/.test(p) &&
    !["feed", "latest", "curso-forex"].includes(parts[1])
  ) {
    return "/education/[slug]";
  }
  if (/^\/news\/[^/]+$/.test(p) && !["feed", "latest"].includes(parts[1])) {
    return "/news/[slug]";
  }
  if (/^\/analysis\/[^/]+$/.test(p) && !["feed", "latest"].includes(parts[1])) {
    return "/analysis/[slug]";
  }
  if (/^\/cryptocurrencies\/news\/[^/]+$/.test(p) && parts[2] !== "feed") {
    return "/cryptocurrencies/news/[slug]";
  }
  if (
    /^\/cryptocurrencies\/[^/]+$/.test(p) &&
    !["news", "rates-charts", "industry-news"].includes(parts[1])
  ) {
    return "/cryptocurrencies/[slug]";
  }
  if (/^\/brokers\/best\/[^/]+$/.test(p)) return "/brokers/best/[slug]";
  if (/^\/brokers\/reviews\/[^/]+$/.test(p)) return "/brokers/reviews/[slug]";
  if (/^\/brokers\/prop\/[^/]+$/.test(p)) return "/brokers/prop/[slug]";
  if (
    /^\/brokers\/[^/]+$/.test(p) &&
    !["best", "reviews", "cashback", "prop"].includes(parts[1])
  ) {
    return "/brokers/[slug]";
  }
  if (/^\/rates-charts\/[^/]+\/forecast$/.test(p)) {
    return "/rates-charts/[slug]/forecast";
  }
  if (
    /^\/rates-charts\/[^/]+$/.test(p) &&
    !["chart", "chart-interactive", "forecast", "indicators", "rates"].includes(
      parts[1],
    )
  ) {
    return "/rates-charts/[slug]";
  }
  if (/^\/rates-charts\/rates\//.test(p)) return "/rates-charts/rates/*";
  if (/^\/macroeconomics\/central-banks\/[^/]+$/.test(p)) {
    return "/macroeconomics/central-banks/[slug]";
  }
  if (/^\/macroeconomics\/economic-indicator\/[^/]+$/.test(p)) {
    return "/macroeconomics/economic-indicator/[slug]";
  }
  if (/^\/(economic-calendar|calendario-economico)\/event\/[^/]+$/.test(p)) {
    return `/${parts[0]}/event/[slug]`;
  }
  if (/^\/economic-calendar\/country\//.test(p)) {
    return "/economic-calendar/country/[id]";
  }
  if (
    /^\/economic-calendar\/[^/]+$/.test(p) &&
    !["fed-sentiment-index", "forex-market-hours", "world-interest-rates", "event"].includes(
      parts[1],
    )
  ) {
    return "/economic-calendar/[slug]";
  }
  if (
    /^\/calendario-economico\/[^/]+$/.test(p) &&
    !["event", "fed-sentiment-index", "forex-market-hours", "world-interest-rates"].includes(
      parts[1],
    )
  ) {
    return "/calendario-economico/[slug]";
  }
  if (/^\/live-video(\/.*)?$/.test(p)) return "/live-video/*";
  if (/^\/technical-analysis(\/.*)?$/.test(p)) return "/technical-analysis/*";
  if (/^\/educacion(\/.*)?$/.test(p)) return "/educacion/*";
  if (/^\/info\/[^/]+$/.test(p)) return "/info/[page]";
  if (/^\/markets\/commodities(\/.*)?$/.test(p)) return "/markets/commodities/*";
  if (/^\/markets\/equities(\/.*)?$/.test(p)) return "/markets/equities";
  if (/^\/[^/]+-20\d{10}$/.test(p)) return "/[root-dated-post]";
  if (p.startsWith("/cdn-cgi") || p.startsWith("/https:")) return "/_noise";
  const tops = new Set([
    "account",
    "analysis",
    "author",
    "bonds",
    "brokers",
    "calendario-economico",
    "commodities",
    "company",
    "cryptocurrencies",
    "currencies",
    "economic-calendar",
    "education",
    "equities",
    "events",
    "fundamental",
    "info",
    "live-video",
    "macroeconomics",
    "markets",
    "mexico",
    "news",
    "press-releases",
    "profile",
    "rates-charts",
    "rss",
    "search",
    "subscriptions",
    "technical-analysis",
    "transparency-translations",
    "educacion",
  ]);
  if (parts.length === 1 && !tops.has(parts[0])) return "/[seo-or-legacy-root]";
  return p;
}

function parseCsvLine(line) {
  const cols = [];
  let cur = "";
  let q = false;
  for (const ch of line) {
    if (ch === '"') {
      q = !q;
      continue;
    }
    if (ch === "," && !q) {
      cols.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  cols.push(cur);
  return cols;
}

const liveRows = fs
  .readFileSync(path.join(root, "crawl/fxstreet-es-live.csv"), "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((l) => {
    const cols = parseCsvLine(l);
    return { path: cols[0], env: cols[1], url: cols[2] };
  });

const byPat = new Map();
for (const r of liveRows) {
  const pat = toPattern(r.path);
  if (pat === "/_noise") continue;
  if (!byPat.has(pat)) byPat.set(pat, { n: 0, envs: new Set(), example: r.path });
  const o = byPat.get(pat);
  o.n += 1;
  o.envs.add(r.env);
}

const planPaths = fs
  .readFileSync(path.join(root, "fxstreet-es-pages.csv"), "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((l) => parseCsvLine(l)[6])
  .filter(Boolean);

const planSet = new Set(planPaths.map(toPattern));
const liveSet = new Set(byPat.keys());
const both = [...liveSet].filter((p) => planSet.has(p)).sort();
const onlyLive = [...liveSet].filter((p) => !planSet.has(p)).sort();
const onlyPlan = [...planSet].filter((p) => !liveSet.has(p)).sort();

const report = {
  livePages: liveRows.length,
  livePatterns: liveSet.size,
  planRows: planPaths.length,
  planPatterns: planSet.size,
  both,
  onlyLive: onlyLive.map((p) => ({ pattern: p, hits: byPat.get(p).n, example: byPat.get(p).example })),
  onlyPlan,
  livePatternsDetail: [...byPat.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([pattern, o]) => ({
      pattern,
      hits: o.n,
      envs: [...o.envs].join("|"),
      example: o.example,
    })),
};

fs.writeFileSync(
  path.join(root, "crawl/validation-summary.json"),
  JSON.stringify(report, null, 2) + "\n",
);

console.log(JSON.stringify({
  livePages: report.livePages,
  livePatterns: report.livePatterns,
  planPatterns: report.planPatterns,
  bothCount: both.length,
  onlyLive,
  onlyPlan,
}, null, 2));
