# Técnico — Migración de idioma (muestra: español)

| | |
|--|--|
| **Para** | Engineering / Tech lead / ops / SEO técnico |
| **Producto (PO)** | [README.md](./README.md) + [csv/](./csv/) `01`–`06` — **no sobrescribir** (Drive / Sheets; el PO ya trabaja ahí) |
| **Este documento** | Guía viva end-to-end. **Se puede pisar cada día.** No vive en el repo Site. |
| **Updates del día** | `anexo-YYYY-MM-DD/` — no tocar README ni lotes PO |
| **Referencia viva ES** | `es` / `fxstreet.es` · rama `oriol/es-routing-and-nav` · QA [qa-es-site-oriol.fxstreet.com](https://qa-es-site-oriol.fxstreet.com/) |

**Distribución PO:** Drive con el README (Doc) + una Sheet por lote (`01`…`06`). Extra para el PO = anexo de esa fecha (p. ej. lote 07 el 16/09). El PO no usa GitHub. Eng exporta Sheet → CSV y reintegra en Site.

### Qué se pisa y qué no

| Sitio | Quién lo usa | Regla |
|-------|--------------|-------|
| `README.md` | PO / Traducciones / SEO / Legal | **No editar** una vez publicado a Drive. Indicaciones nuevas → `anexo-YYYY-MM-DD/` |
| `csv/01`–`06`, `mapeado-paginas.*` | Mismas hojas | **No sobrescribir** su revisión. Keys nuevas = CSV anexo del día, no sustituir la hoja |
| `TECNICO.md` | Eng / ops / SEO técnico | Sobrescribir cada día con el estado actual |
| `anexo-YYYY-MM-DD/` | Diario | Añadir notas, CSV de esa jornada, entregas PO/QA de ese día |

| Día | Carpeta |
|-----|---------|
| 16/09/2026 | [anexo-2026-09-16](./anexo-2026-09-16/) — instrucciones PO (calendario + lote 07) |
| 17/09/2026 | [anexo-2026-09-17/updates.md](./anexo-2026-09-17/updates.md) — reporte del día (QA [qa-es-site-oriol](https://qa-es-site-oriol.fxstreet.com/), 301, compare) |

**Convención:** `[ ]` pendiente · `[~]` parcial · `[x]` hecho · `[D]` decisión de producto (no abrir sin PO).

La columna **ES** es el estado del primer rollout. Al clonar el proceso para `xx`, copiar este fichero (o marcar en una copia) y sustituir `es` / `fxstreet.es`.

---

## Cómo está partido el trabajo (no es solo front)

| Capa | Qué cubre | Quién | ¿Site lo resuelve solo? |
|------|-----------|-------|-------------------------|
| Producto | Alcance, gates EN-only, path localizado, variante de idioma | PO / negocio | No |
| UI / chrome | JSON next-intl, nav, hardcodes, lotes 01–07 | Eng Site + Traducciones / SEO / Legal | Paridad sí; copy humano no |
| Routing | Rewrites, redirects, calendarios, language switcher | Eng Site + SEO | Sí, con dictamen SEO |
| Deploy | `NEXT_PUBLIC_LOCALE`, TLD, CDN `site/xx`, matriz qa/pro | Eng + ops | Código sí; DNS/CDN ops |
| Gateway | Mismo contrato, `Languages.xx`, CultureName | Gateway | **No** |
| Editorial | News, analysis, education, brokers, home, autores, calendar items | Contenidos / CMS | **No** — si falta: menú oculto |
| Búsqueda | Algolia `CultureName: xx` | Search + gateway | Front ya filtra; falta índice |
| SEO TLD | Sitemaps, canonical, hreflang, legado | SEO + gateway + Data | 301 solo con dest 2xx |
| Fuera Site | Emails, newsletter, workflows CMS, Propinder | Equipos dueños | No |
| QA | Plantillas + regresión EN | QA + eng | Lote 08 + smoke |

Pedido ya hecho en ES: si un endpoint de gateway **no tiene `es`**, **lo genera**. Site no inventa artículos.

---

## Principios (aplicar a cualquier `xx`)

1. **Un locale = un deploy = un TLD.** `NEXT_PUBLIC_LOCALE=xx`. Sin prefijo `/xx/…`.
2. **UI ≠ editorial.** JSON = chrome, legal estático, SEO de plantilla, nav. El resto llega del gateway por cultura.
3. **Espejo EN**, excepto superficies EN-only (no traducir ni publicar).
4. **Paths ingleses** por defecto. Path localizado solo con orden de producto.
5. Copy del repo = **borrador IA** hasta Sheets en “Revisado”.
6. **Un href scrapeado no es una página.** 301 solo si origen muerto **y** destino **2xx** (HTTP real).
7. Sin editorial en una vertical incluida: **ocultar del menú**, no mostrar inglés.

---

## Quién hace qué

| Área | Quién | Entrega |
|------|--------|---------|
| Alcance, gates, paths | PO | Este TECNICO §2 + README alcance |
| Variante (ES: ES / LatAm / neutro) | Traducciones | Antes del lote 01 |
| Copy UI (01–07) | Traducciones + SEO (02) + Legal (01) | Sheets → Revisado |
| Diccionarios, nav, routing, gates | Eng Site | Rama + QA |
| `Languages.xx`, APIs, CultureName | Gateway | Mismo contrato que EN |
| Artículos y fichas | Contenidos | Cultura `xx` o menú oculto |
| Algolia | Search + gateway | Filtro `CultureName: xx` |
| Dominio, CDN, tokens | Ops | Filas qa + pro |
| Redirects legado | SEO + eng | Lista explícita, dest vivo |
| Tráfico 12m URLs only-`xx` | Data | Dictamen grupo B |
| Emails / newsletter / Propinder | Dueños | Fuera Site |
| QA + regresión EN | QA + eng | Lote 08 + smoke EN |

---

## Fases (orden para el siguiente idioma)

### Fase 0 — Decisiones (bloquea código de producto)

- Espejo EN + lista EN-only (P10–P14; P15 excepciones de mercado).
- ¿Path localizado? Canonical + ¿el path EN sigue **sin 301**? (ES calendario: sí, rewrite).
- Variante de idioma.
- Legado del TLD: redirigir / no migrar / más adelante.

### Fase 1 — Site i18n (en paralelo a CMS)

1. Registrar `xx` **una vez** en `Language` / `LocaleKeyed`.
2. Paridad keys EN↔`xx` (colocated + primitives + rss).
3. `navigation-data-xx.ts` solo si hay overrides; si no, defaults EN + add/remove/replace/move.
4. Tags de noticias: mapa `content-routes`, no clonar menú.
5. Hardcodes → next-intl.
6. `node regenerate-csv-from-site.mjs` → **AUDIT OK — keys 1:1**.
7. Sheets en Drive. Reintegrar columna revisada. Ignorar filas `.url` / `.href` / `.link` / `.linkPath`. Conservar `<link>`, `{vars}`.

### Fase 2 — Site routing y deploy

1. Filas qa+pro en `Build/site-deploy.yaml`.
2. Switcher → TLD absoluto.
3. Rewrites por vertical. Calendario: `resolveCalendarBasePath`, no `if (es)`.
4. Redirects compartidos (ya en todos los deploys) vs **solo-`xx`** (`NEXT_PUBLIC_LOCALE === 'xx'`).
5. Gates: `notFound` + fuera de menú.

### Fase 3 — Gateway / CMS / search

| Acción | Quién |
|--------|--------|
| Generar CultureName `xx` o vacío a propósito | Gateway + Contenidos |
| Mismo contrato API | Gateway |
| `configuration.Languages.xx` | Gateway (si falta, `i18n/request.ts` tira) |
| Algolia `CultureName: xx` | Search |
| Sitemaps por cultura | Gateway (Site: `/sitemap*` → `/api/v1/sitemap`) |
| RSS ítems por cultura | Gateway |

Site: empty states + no pintar ítems cuyo `CultureName` no sea `xx`.

### Fase 4 — SEO / URLs

1. Crawl **legacy TLD** y **Next QA**. Toolkit: inventario **solo 2xx**; rotos en `*.broken.csv` + `found_on`. Compare: `compare-origins --legacy <TLD> --processed <QA>`.
2. Clasificar: same-path · alias de producto · moved+dest 2xx (301) · both dead (nada) · legacy-only vivo (dictamen).
3. HTTP origen y destino **antes** del 301.
4. Landings raíz: lista de slugs, **nunca** `/:slug` abierto.
5. Hreflang / canonical: SEO.

### Fase 5 — Ops y terceros

DNS, CDN `site/xx`, token, OneSignal, Turnstile, cookies, mails. Charts: números **siempre `en-US`**.

### Fase 6 — QA

Plantillas no gated (lote 08): chrome `xx`, path canónico. Gated EN: 404. Home sin bloques EN-only. Search/RSS/404. **Regresión EN**. Ficha vacía = CMS.

### Fase 7 — Go-live

Mínimo: lotes 01–04 reintegrados · `Languages.xx` · CMS/Algolia en el menú · smoke QA/PRO · menú sin gated EN · regresión EN.

Congelar desviaciones en **este** TECNICO (nueva fila / lección).

---

## 0. Arquitectura i18n Site (colocation)

| Capa | Ubicación | Registro |
|------|-----------|----------|
| Features + chrome | `Site/packages/ui/src/components/{name}/{name}.{locale}.json` | catálogo i18n |
| Primitives | `packages/ui/src/primitives/{name}.{locale}.json` | idem |
| Server-only | `packages/lib/server-only/rss/rss-feed.{locale}.json` | idem |
| Nav | `navigation-data-{locale}.ts` | `navigation-data.ts` |

Reglas: namespace = carpeta kebab; diccionario nuevo = EN+`xx` **y** registro; badge premium UI = `premium-badge`; CTAs brokers = `brokers.common`; markup al traducir.

**Reintegrar Sheets:** `componentes/{name}` → `{name}.es.json`; `navegacion` → `navigation-data-es.ts`; `rss` → `rss-feed.es.json`.

**Regenerar CSV:** `node regenerate-csv-from-site.mjs`. **Word PO:** `node regenerate-docx-from-readme.mjs` (Windows + Word).

**Dónde se toca `xx` en Site** (referencia, no documentar en el repo Site):

| Pieza | Path |
|-------|------|
| Locale | `Language`, `locale-keyed.ts` |
| Mensajes | `{name}.{xx}.json` + catálogo |
| Nav | `navigation-data-{xx}.ts` |
| Calendario | `calendar-base-path.ts`, `rewrites.ts` |
| Gates | `show-component-service.ts`, `notFound` |
| Deploy | `Build/site-deploy.yaml` |
| Redirects | `redirects.ts`, `proxy.ts` |
| Switcher | `languages.ts` |
| Cultura fetch | `CultureName: [locale]` |
| Config | `configuration.Languages[PUBLIC_LOCALE]` |

---

## 1. Checklist `xx` (estado ES)

### A. Producto / alcance

| # | Ítem | ES |
|---|------|-----|
| A1 | Espejo EN; no traducir EN-only | `[x]` (PO) |
| A2 | Gates: no abrir EN-only sin PO | `[x]` §2 |
| A3 | Variante / tono antes de revisión humana | `[ ]` |
| A4 | Lotes UI 01–04 (mín.) revisados y avisados | `[ ]` |
| A5 | CMS/Algolia o menú oculto | `[ ]` |

### B. Diccionarios UI

| # | Ítem | ES |
|---|------|-----|
| B1 | Paridad keys EN↔`xx` | `[x]` |
| B2 | Copy = borrador → humano | `[~]` |
| B3 | Hardcodes → next-intl | `[x]` |
| B4 | Nav `xx` | `[x]` |
| B5 | Paths localizados solo con producto | `[x]` calendario |
| B6 | Reintegrar Sheets | `[ ]` |

### C. Infra / deploy

| # | Ítem | ES |
|---|------|-----|
| C1 | Dominio + DNS + gateway + CDN | `[ ]` ops |
| C2 | Matriz qa+pro `site-deploy.yaml` | `[x]` |
| C3 | Locale, SITE_URL, CDN, gateway, auth | `[x]` código |
| C4 | `SiteLocale` / `Language` incluye `xx` | `[x]` |
| C5 | Switcher TLD absoluto | `[x]` |
| C6 | Gateway `Languages.xx` | `[ ]` |
| C7 | Smoke QA+PRO; regresión EN | `[~]` smoke QA Oriol; PRO/EN `[ ]` |
| C8 | Charts `en-US` | `[x]` |
| C9 | OneSignal, Turnstile, cookies, mails | `[~]` mailto |

### D. CMS / search / SEO contenido

| # | Ítem | ES |
|---|------|-----|
| D1 | APIs `site-gateway-xx*` mismo contrato | `[ ]` |
| D2 | Contenido CultureName `xx` | `[ ]` (pedido generar) |
| D3 | Algolia `CultureName: xx` | `[ ]` |
| D4 | Sitemaps + canonical; hreflang | `[ ]` |
| D5 | RSS keys + ítems | keys `[x]` · ítems `[ ]` |
| D6 | Emails, newsletter, workflows, Propinder | `[ ]` |

### E. Routing / SEO técnico

| # | Ítem | ES |
|---|------|-----|
| E1 | Mismo path que EN salvo producto | `[x]` + calendario |
| E2 | Redirects legado | `[x]` mayor parte |
| E3 | Path EN accesible sin 301 si hay rewrite | `[x]` calendario |
| E4 | Landings / posts legacy | `[x]` HTTP 17/09; resto grupo B |
| E5 | Crawl patrones canónicos | `[x]` compare 17/09 vs QA nuevo |

### F. QA

| # | Ítem | ES |
|---|------|-----|
| F1 | Home / nav / footer / switcher | `[ ]` |
| F2 | Verticales + `/info/*` + account | `[ ]` |
| F3 | Search, RSS, 404/500, viewports | `[ ]` |
| F4 | Regresión EN | `[ ]` |

### G. Cierre (plantilla siguiente `xx`)

| # | Ítem | ES |
|---|------|-----|
| G1 | Congelar decisiones + CSV + gates **aquí** | `[ ]` |
| G2 | 0 gaps keys; hunt literales EN | `[ ]` |
| G3 | Desviaciones documentadas en este fichero | `[~]` |

---

## 2. Gates EN-only (no abrir sin PO)

Código: `show-component-service.ts` + `notFound` por locale.

| PO | Superficie | Comportamiento |
|----|------------|----------------|
| P10 | Press releases | `locale !== 'en'` → 404; fuera menú ES |
| P11 | Crypto industry-news | EN only |
| P12 | Newsletter web | EN only |
| P13 | Home More news / In-deep / Best brokers yearly | EN only |
| P14 | Calendar speech / notif | EN only |
| P15 | Reviews / showcases extra | **Pendiente negocio** |
| P16 | ES-only legado (grupo B README) | **Pendiente** salvo landings raíz (301 17/09) |
| — | `/calendario-economico` | Familia completa. Slugs EN. `/economic-calendar/…` **sin 301**. |

---

## 3. Infra ES

| Variable | Rol | ES |
|----------|-----|-----|
| `NEXT_PUBLIC_LOCALE` | Cultura build | `es` |
| `NEXT_PUBLIC_SITE_URL` | Canonical/OG | `www.fxstreet.es` / `qa.fxstreet.es` |
| `NEXT_PUBLIC_CDN_URL` | Assets | `…/site/es` (+ `-qa`) |
| `NEXT_PUBLIC_SITE_GATEWAY_URL_TEMPLATE` | Gateway | `site-gateway-{locale}{site_env}.fxstreet.com` |
| `NEXT_PUBLIC_USER_AUTH_*` | Auth | Compartidas |
| `NEXT_PUBLIC_SITE_ENV` | qa / vacío pro | Switcher |
| `AUTHORIZATION_APITOKEN` | Gateway | Por entorno |

| culture | env | siteUrl | gateway | CDN | image |
|---------|-----|---------|---------|-----|-------|
| es | qa | qa.fxstreet.es | site-gateway-es-qa | site/es-qa | site-es-qa |
| es | pro | www.fxstreet.es | site-gateway-es | site/es | site-es |
| en | qa/pro | fxstreet.com | site-gateway-en* | site/en* | site-en* |

---

## 4. URLs, scrape y redirects (cómo no romper)

### 4.1 Tipos de redirect

| Tipo | Dónde | Riesgo |
|------|--------|--------|
| Compartidos (markets, TA, cashback, slugs broker) | `redirects.ts` siempre | Afectan **EN y todos** |
| Solo mercado | `NEXT_PUBLIC_LOCALE === 'xx'` | No tocar EN |
| Path localizado | Rewrite **sin** 301 si ambas URLs deben vivir | 301 global rompe EN |
| Landings SEO | Lista de slugs, nunca `/:slug` abierto | Robaría `/news`, etc. |

ES master: `/brokers/best` y `/brokers/best/countries` → `/brokers` **solo `es`**. Showcases `/brokers/best/{slug}` siguen. 404 de showcase → `/brokers`.

### 4.2 Crawl

| Campo | Valor |
|-------|--------|
| 2026-09-09 | 67 URLs / ~40 patrones (`fxstreet-es`, artículos fuera) |
| 2026-09-17 tarde | Compare vs **QA nuevo** [qa-es-site-oriol.fxstreet.com](https://qa-es-site-oriol.fxstreet.com/): 71 keys · 25 same-path · 2 calendar-alias · 15 processed-only · 19 legacy-only. Detalle: [anexo-2026-09-17/compare-origins.md](./anexo-2026-09-17/compare-origins.md) |
| Herramienta | `web-scraper-toolkit`: 2xx en el CSV principal; `*.broken.csv` + `found_on` |
| Compare | `compare-origins --legacy https://www.fxstreet.es/ --processed https://qa-es-site-oriol.fxstreet.com/` |
| HTTP moved | [anexo-2026-09-17/09-http-check-moved-urls.csv](./anexo-2026-09-17/09-http-check-moved-urls.csv) |

```bash
pnpm --filter @operezol/scraper-cli start fxstreet-es -o <out.csv> -d 250 --checkpoint-every 30
```

**Canónicas Next:** `/` · `/news` · `/analysis` · `/education` · `/cryptocurrencies` · `/brokers` · `/rates-charts` · topics · `/calendario-economico` · `/macroeconomics/…` · `/company` `/author` · `/info/*` · `/account/*` · `/profile` `/search` `/subscriptions` `/rss` `/transparency-translations`.

Criterio URLs (15/09): match → migrar · EN only → migrar salvo P15 · ES only → dictamen. Grupo A README = espejo Next (no legado). Grupo B = live-video, mexico, curso-forex, `educacion/*` unidades, rates/TA legado.

### 4.3 301 ES verificados (17/09, Aitor)

Origen 404 live + dest 2xx (al menos legacy).

| Origen | Destino |
|--------|---------|
| 26 landings `/{tipo}-brokers-{país}` | `/brokers/best/{slug}` (muchas 404 en QA = CMS) |
| `/educacion` | `/education` |
| `/company/xtb` | `/brokers/xtb` |
| `/economic-calendar/event/nfp` | `/macroeconomics/economic-indicator/nfp` |
| `/pronostico-del-precio-…-202607130702` | `/news/…` |

No 301: resto de `event/{slug-corto}`, unidades curso. Mapa EN↔ES: `csv/mapeado-paginas.xlsx`. Tráfico 12m: pendiente Data.

### 4.4 Antes de merge / push

- Sin `<<<<<<<` en código.
- Conservar de master: UserToken (injector sin `userId`), highlights estáticos, robots, 301 hub best solo ES.
- Conservar de la rama: path calendario, gates, rewrites.
- Ningún 301 sin dest 2xx.
- EN: `/economic-calendar` sigue; `/brokers/best` **no** redirige a `/brokers`.

---

## 5. Estado vivo ES

| Área | Estado |
|------|--------|
| Keys EN↔ES | `[x]` · copy humano `[~]` |
| Calendario path + rewrite | `[x]` |
| Nav ES | `[x]` URLs · `[~]` labels |
| Hardcodes | `[x]` |
| Deploy matrix / env | `[x]` código |
| Redirects SEO 17/09 | `[x]` en QA (`/educacion`, landings bróker, xtb, nfp) |
| Deploy QA Oriol | `[x]` [qa-es-site-oriol.fxstreet.com](https://qa-es-site-oriol.fxstreet.com/) |
| Gateway / CMS / Algolia | `[ ]` (home QA aún mezcla editorial EN) |
| Lotes 01–07 humanos | `[ ]` |
| QA lote 08 / smoke / regresión EN | `[~]` host lote 08 actualizado; pasada humana `[ ]` |

**Go-live:** 01–04 reintegrados · `Languages.es` · CMS/Algolia · smoke · menú sin gated EN · regresión EN.

### Orden ES ahora

1. Sheets 01–07 en revisión humana.
2. Gateway genera `es` + Algolia/sitemaps.
3. Eng: empty states, no-EN-fallback, QA lote 08.
4. Reintegrar Sheets.
5. Ops smoke qa/pro.
6. Congelar lecciones **en este TECNICO**.

---

## 6. Lecciones para el siguiente idioma

| Lección ES | En `xx` |
|------------|---------|
| Calendario | Preguntar path. ES: `/calendario-economico` + rewrite, slugs EN. |
| Hub best brokers | Puede 301 al listing (ES: hub → `/brokers`). Showcases aparte. |
| Landings raíz `*-brokers-*` | 301 a canónico **tras HTTP**. |
| `/educacion` | 301 hub; no unidades a ciegas. |
| `company` → `brokers` | Solo si el listing existe (xtb). |
| Eventos calendar cortos | Casi todos muertos; solo NFP tenía dest. |
| Scrape | 2xx + `found_on`; no fiarse del CSV viejo. |
| Gateway | Pedir cultura **antes** de pelear empty states. |
| Copy | Drive; JSON no está cerrado. |
| Master | Re-merge. UserToken y highlight lists rompen APIs viejas. |

Diario: [anexo-2026-09-16](./anexo-2026-09-16/) · [anexo-2026-09-17](./anexo-2026-09-17/).
