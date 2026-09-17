# Compare legacy vs QA — 17/09/2026 (tarde)

Host QA **nuevo:** [https://qa-es-site-oriol.fxstreet.com/](https://qa-es-site-oriol.fxstreet.com/)  
Legacy: `https://www.fxstreet.es/`  
CSV: [10-origin-compare-qa-es-site-oriol.csv](./10-origin-compare-qa-es-site-oriol.csv)

```bash
pnpm --filter @operezol/scraper-cli start compare-origins \
  --legacy https://www.fxstreet.es/ \
  --processed https://qa-es-site-oriol.fxstreet.com/ \
  -o anexo-2026-09-17/10-origin-compare-qa-es-site-oriol.csv -d 250
```

**71 path keys** · legacy 47 ok / 18 broken · processed 45 ok / 5 broken.

| match_type | n | Lectura |
|------------|---|---------|
| same-path | 25 | Espejo vivo en ambos (home, news, analysis, education, rates, legal común…) |
| calendar-alias | 2 | `/economic-calendar/{forex-market-hours,world-interest-rates}` ↔ `/calendario-economico/…` |
| processed-only | 15 | Next tiene página; live ES 404 o no enlazada (commodities, equities, legal nuevo, países calendario, Fed Sentiment) |
| legacy-only | 19 | Vivo en Sitefinity; no sale como 2xx en el crawl Next (grupo B + TA legado + press) |
| neither-accessible | 10 | Ruido (cdn-cgi, href rotos, GUIDs de país, jobs 404) |

## 301 de esta rama (HEAD en el QA nuevo)

| Path QA | Resultado |
|---------|-----------|
| `/educacion` | 301 → `/education` |
| `/beginners-brokers-australia` | 301 → `/brokers/best/beginners-brokers-australia` |
| `/company/xtb` | 301 → `/brokers/xtb` |
| `/economic-calendar/event/nfp` | 301 → `/macroeconomics/economic-indicator/nfp` |
| `/brokers/best` y `/brokers/best/countries` | 301 → `/brokers` (solo ES, de master) |
| `/economic-calendar` y subpaths | **200, sin 301** (rewrite) |
| `/press-releases` | 404 (gate EN) |
| `/education/latest` | 301 → `/education` (ya existía) |
| `/markets/commodities` | 301 → `/commodities` (ya existía) |
| `/brokers` | 200 (el CSV lo mal-agrupa; ver nota) |

## Legacy-only que siguen pidiendo dictamen (grupo B / SEO)

Vivos en `fxstreet.es`, no hay plantilla Next equivalente:

- `/live-video`
- `/mexico`
- `/education/curso-forex`
- `/bonds` (404 en QA; menú analysis aún apunta)
- `/rates-charts/chart/station`, `/rates-charts/indicators/technical-levels`, `/rates-charts/rates/crosses/gbp`
- `/technical-analysis/elliott-wave`, `support-resistance` (+ fibonacci, pivot-points), `sentiment/risk-appetite`
- `/cryptocurrencies/rates-charts`
- `/press-releases` (fuera de alcance ES; 200 en legado)
- `/sitemap-all.xml` (ops / gateway)

`/markets/commodities` y `/markets/equities` son paths viejos; en QA commodities ya 301. Equities: paralelo Next es `/equities`.

## Processed-only (bien)

QA sirve lo que live ES aún no tiene o tiene 404: `/commodities`, `/equities`, `/info/advertising-model`, cookies, privacy, how-we-score, how-fxstreet-uses-ai, premium, países del calendario, Fed Sentiment en path ES.

## Artefacto del merge

`processedPathKey` trata un segmento con “broker” como landing SEO. `/brokers` (200 en ambos) aparece como `legacy-only` en `/brokers/best/brokers`. **Ignorar esa fila.**

## Home QA (smoke)

Chrome en español. Sigue habiendo fichas editoriales en inglés en bloques de home (CMS / CultureName, no i18n).
