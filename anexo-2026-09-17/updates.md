# Anexo — 17/09/2026

Reporte de la jornada. El estado vivo se pisa en [TECNICO.md](../TECNICO.md). **No toca** [README.md](../README.md) ni `csv/01`–`06` (trabajo PO).

| | |
|--|--|
| **QA ES (host actual)** | [https://qa-es-site-oriol.fxstreet.com/](https://qa-es-site-oriol.fxstreet.com/) |
| **Host anterior** | `qa-s-oriol.fxstreet.com` — no usar |
| **Legacy** | `https://www.fxstreet.es/` |
| **Site** | `oriol/es-routing-and-nav` · Azure `e6eece58` |
| **Este repo** | `main` · GitHub `5590ab5` (+ cambios de esta tarde sin commit) |

---

## Qué se cerró hoy

1. **SEO (Aitor):** 301 si la URL rota tiene paralela funcional (HTTP dest 2xx). Código en `Site/redirects.ts`. Comprobado en el QA nuevo (tarde).
2. **Scraper:** inventario solo 2xx + `found_on`. Comando `compare-origins`.
3. **Master** metido en la rama ES. Conservado: UserToken, highlights estáticos, 301 hub `/brokers/best` → `/brokers` solo ES. Conservado de la rama: calendario ES + rewrite, gates.
4. **Docs:** proceso en `TECNICO.md`. Diario en `anexo-YYYY-MM-DD/`. PO no se pisa.
5. **Deploy QA** con el host nuevo. Compare legado vs ese QA.

---

## 301 verificados (live 404 → dest 2xx)

Fuente HTTP: [09-http-check-moved-urls.csv](./09-http-check-moved-urls.csv). En QA nuevo (HEAD):

| Origen | Destino | QA `qa-es-site-oriol` |
|--------|---------|------------------------|
| 26 landings `/{tipo}-brokers-{país}` | `/brokers/best/{slug}` | 301 (ej. `/beginners-brokers-australia`). Showcase puede 404 si no hay CMS |
| `/educacion` | `/education` | 301 |
| `/company/xtb` | `/brokers/xtb` | 301 |
| `/economic-calendar/event/nfp` | `/macroeconomics/economic-indicator/nfp` | 301 |
| Artículo raíz `pronostico-del-precio-…-202607130702` | `/news/…` | 301 en código; dest 200 live, 404 QA (CMS) |
| Hub `/brokers/best` y `/brokers/best/countries` | `/brokers` | 301 (master, solo locale `es`) |

**Sin 301 (a propósito):** resto de `event/{slug-corto}`, unidades `/educacion/curso-forex/…`, path EN del calendario (`/economic-calendar` = **200**, rewrite).

**Ya existían (no de hoy):** `/education/latest` → `/education`, `/markets/commodities` → `/commodities`.

---

## Compare tarde — legado vs QA nuevo

Detalle: [compare-origins.md](./compare-origins.md) · CSV: [10-origin-compare-qa-es-site-oriol.csv](./10-origin-compare-qa-es-site-oriol.csv).

71 path keys · legacy 47 ok / 18 broken · processed 45 ok / 5 broken.

| Tipo | n | Qué implica |
|------|---|-------------|
| same-path | 25 | Espejo vivo (home, news, analysis, education, rates, legal común) |
| calendar-alias | 2 | Horarios mercado + tipos de interés: path EN legado ↔ `/calendario-economico/…` QA |
| processed-only | 15 | Next ya sirve lo que live ES no tiene o tiene 404 (commodities, equities, legal nuevo, países calendario, Fed Sentiment) |
| legacy-only | 19 | Sigue en Sitefinity; dictamen o fuera de alcance |
| neither | 10 | Ruido (cdn-cgi, GUIDs, jobs 404) |

**Ignorar** la fila `/brokers/best/brokers`: bug del merge (`/brokers` es 200 en ambos).

**Legacy-only que siguen abiertos (SEO + Data + Mkt + CNT):**  
`/live-video` · `/mexico` · `/education/curso-forex` · `/bonds` · rates legado (`chart/station`, `technical-levels`, `crosses/gbp`) · `/technical-analysis/…` · `/cryptocurrencies/rates-charts` · `/sitemap-all.xml` (ops).  
`/press-releases` 200 en legado / **404 en QA** (gate EN, correcto).

Home QA: chrome en español; bloques editoriales aún mezclan EN (CMS, no i18n).

---

## QA de plantillas

[qa-paginas.md](./qa-paginas.md) + [08-anexo-qa-paginas-es-2026-09-17.csv](./08-anexo-qa-paginas-es-2026-09-17.csv) — URLs pasadas al host **nuevo**. No es lote de copy. Pasada humana pendiente.

---

## Repos / push

| Repo | Qué | Remoto |
|------|-----|--------|
| Site | Redirects SEO + calendar guide + key-technicals null-safe + about-us | Azure `oriol/es-routing-and-nav` **pusheado** (`e6eece58`) |
| spanish-site-translation-plan | TECNICO, anexos 16/17, mapeado | GitHub `main` **pusheado** (`5590ab5`). Esta tarde (compare + host QA) **aún local** |
| web-scraper-toolkit | Crawl 2xx + `compare-origins` | Commit local `8350858`. **Push 403** (`operezol` vs cuenta `frontend-fxs`) |

---

## Pendiente (no es copy de UI)

| Dueño | Qué |
|-------|-----|
| Traducciones / SEO / Legal | Lotes 01–07 en Sheets (Drive) |
| Gateway + Contenidos | CultureName `es`; home QA sin bloques EN; showcases/fichas |
| Algolia / sitemaps | Filtro cultura; `/sitemap-all.xml` 404 en QA |
| SEO + Data + Mkt + CNT | Grupo B (live-video, mexico, curso-forex, bonds, TA legado) |
| Negocio | P15 excepciones EN-only (reviews / showcases) |
| Ops | DNS/CDN `qa.fxstreet.es` / pro |
| Eng | Reintegrar Sheets; empty states; no-EN-fallback; **regresión EN**; commitear esta tarde; push scraper con cuenta `operezol` |

---

## Ficheros de esta carpeta

| Fichero | Para qué |
|---------|----------|
| [updates.md](./updates.md) | **Este reporte** |
| [compare-origins.md](./compare-origins.md) | Lectura del compare tarde |
| [10-origin-compare-qa-es-site-oriol.csv](./10-origin-compare-qa-es-site-oriol.csv) | Compare raw |
| [09-http-check-moved-urls.csv](./09-http-check-moved-urls.csv) | HTTP antes de los 301 |
| [qa-paginas.md](./qa-paginas.md) + [08-…](./08-anexo-qa-paginas-es-2026-09-17.csv) | Plantillas Next en ES |
| [cierre.md](./cierre.md) | Puntero a este reporte (histórico de la mañana) |
