# Técnico — Lanzamiento Site español (FXStreet.es)

| | |
|--|--|
| **Para** | Engineering / Tech lead |
| **Producto (1 página)** | [README.md](./README.md) |
| **Rama Site** | `chore/modular-messages-i18n` |
| **CSV PO** | [csv/](./csv/) |
| **Crawl** | Validado 2026-09-09 (`web-scraper-toolkit` / `fxstreet-es`, 67 URLs) — artefactos no guardados en este repo |

**Modelo:** un locale por deploy/dominio (`NEXT_PUBLIC_LOCALE`), no prefijos `/es/…`. EN = `fxstreet.com`, ES = `fxstreet.es`. UI = next-intl JSON; editorial = gateway/CMS por cultura. Copy ES del repo = **borrador IA** hasta revisión humana ([README](./README.md) + CSV).

**Convención checklist:** `[ ]` pendiente · `[~]` parcial/IA · `[x]` hecho · `[D]` decisión producto (no abrir sin orden PO).

---

## 1. Estado

| Área | Estado |
|------|--------|
| i18n modular `messages/{module}/{Namespace}.{locale}.json` | `[x]` |
| Paridad keys EN↔ES (UI) | `[x]` keys · `[~]` copy humano · CI `pnpm i18n:parity` |
| Calendario ES `/calendario-economico/…` + redirects | `[x]` |
| Nav ES sin press-releases; legacy URLs saneadas | `[x]` |
| Hardcodes UI → next-intl (a11y, newsletter Zod, schema app name, 404 mailto) | `[x]` |
| `.env.example` con ejemplos EN/ES | `[x]` |
| Charts number format política `en-US` documentada en código | `[x]` |
| Inventario URLs por patrones (crawl) | `[x]` validado 2026-09-09 |
| Abrir gates EN-only | **No** salvo orden PO |
| CMS / Algolia / sitemaps cultura `es` | Fuera repo · bloqueante ops |
| PRO `.es` hoy | Mayoría Sitefinity; Next ES aún no sustituye todo el TLD |

**Go-live técnico:** lotes PO 01–04 reintegrados · smoke QA/PRO ES · gateway `Languages.es` + CMS/Algolia · regresión EN OK · menú sin gated EN.

| Aprobación eng | Nombre | ☐ Aprobado / ☐ Con cambios / ☐ Rechazado | Fecha |
|----------------|--------|------------------------------------------|-------|
| | | | |

---

## 2. Gates EN-only ↔ decisiones PO

Fuente producto: [README §1](./README.md). **No abrir sin cambio explícito del PO.**

| PO | Superficie | Código / comportamiento |
|----|------------|-------------------------|
| P10 | Press releases | `locale !== 'en'` → `notFound`; fuera menú ES |
| P11 | Crypto industry-news | EN only |
| P12 | Newsletter signup / chip | Condicionales EN |
| P13 | Home More news / In-deep / Best brokers yearly | `show-component-service` EN only |
| P14 | Calendar speech / notif | EN only |
| P15 | Hub `/mexico` | Redirect → `/currencies/usdmxn` |
| P16 | `/education/curso-forex/*` | Sin parity multi-unidad |
| P17 | `/live-video/*` | Sin vertical Next |
| — | `/calendario-economico` | ES only (OK) |

Fuente gates: `packages/lib/server-only/services/show-component-service.ts` + pages con `notFound` por locale.

---

## 3. Arquitectura i18n

| Capa | Ubicación | Registro |
|------|-----------|----------|
| Base / chrome | `Site/messages/{module}/{Namespace}.{locale}.json` | `i18n/message-modules.ts` |
| Features | `packages/ui/src/components/{name}/{name}.{locale}.json` | `loadComponentMessages` en `i18n/request.ts` |
| Server-only | `packages/lib/server-only/rss/rss-feed.{locale}.json` | `loadServerOnlyMessages` |
| Nav (no JSON) | `navigation-data-{en,es}.ts` | `navigation-data.ts` |

Doc Site: `messages/README.md`. Loader: ficheros ausentes se omiten (`Promise.allSettled`).

### Módulos base (`messages/`)

| Módulo | Namespaces |
|--------|------------|
| `layout` | Header, Footer, FooterDisclaimer, Navigation, LanguageSelector, Sidebar |
| `shared` | Common, Shared, Share, Sponsored, AdvertisementDialog, Greybox, DisclaimerSection, CalendarDisclaimer, OneSignal |
| `errors` | NotFound, Error500, ServiceNotAvailable |
| `seo` | Seo |
| `home` | HomePage, MoreNewsSection, InDeepAnalysisSection, LiveCoverageSection, WeeklyForecastSection, EditorialHighlight*, EducationSection, CryptocurrenciesSection, StocksSection, IndustryNewsSection, BestBrokers*, AuthorSection, CashbackWidget, SubHomeShowcases, Newsletter |
| `posts` | PostMetadata, PostAuthorInfo, PostListMultifeed, PostVerifiedTranslation, Paywall |
| `brokers` | Brokers, BrokerListing, BrokerReview, BrokerReviewsSubHome, BrokerShowcase |
| `directory` | Author, Company, BecomeContributor, ContactUs |
| `search` | Search, Algolia |
| `editorial` | EditorialGuidelines, EthicalCode, TransparencyTranslations, PressReleases, CryptoIndustryNews, Premium |

**Paridad:** 59× `.en.json` / 59× `.es.json` base · componentes listados en `request.ts` con pareja ES · RSS education keys OK.  
**Eliminado:** dead entry `rates-charts-sub-home` de `request.ts`.  
**Alineado:** `rates-charts` → `Forecasts.*` · `calendar-guide` linkPaths país → `/calendario-economico/…`.

### Componentes UI (`*.{locale}.json`) — todos con ES; revisión humana pendiente

analysis-page, cryptocurrencies-page, forecast, assets-forecast, forecast-chart, macro-showcases, macro-showcases-sub-home (registrado + next-intl), premium, propinder, premium-terms-and-conditions, terms-conditions, privacy-policy, cookie-policy, prevention, advertising-model, how-we-score-reviews, how-fxstreet-uses-ai, youtube-videos-section, youtube, about-us, corporate-identity, showcases-variants, calendar-guide, commodities (editorial largo), rates-charts, equities (`editorialText` aún mezcla EN), forex-market-hours, fed-sentiment-index, world-interest-rates, central-banks, central-bank-detail, economic-indicator-detail, checklist-section, trade-war, key-technicals-table, contributors-table, company, author, brokers, broker-detail, economic-calendar, calendar-event, topic-page, profile, subscriptions, account.

### Hardcodes UI

Pasados a next-intl / props i18n en rama Site (Shared.A11y, about-us story aria, Newsletter.invalidEmail, Shared.softwareApplicationName, NotFound mailto por locale). Rates assets-search y cashback search ya estaban en i18n.

### Reintegrar CSV PO

Mapear `Carpeta` + `Bloque` + `Clave` → `.es.json` / menú ES. Usar **Español (revisado)**; si vacío y Estado=Revisado, aceptar borrador. **Conservar markup** (`<link>…</link>`, `{vars}`, etc.).

Prioridad humana (= lotes README): 1 legal · 2 SEO/nav · 3 account/premium · 4 calendario/rates/brokers · 5 resto · 6 RSS.

---

## 4. Infra / env / deploy

Un deploy por cultura. Fuente matriz: `Site/Build/site-deploy.yaml`.

| Variable | Rol | ES |
|----------|-----|-----|
| `NEXT_PUBLIC_LOCALE` | Cultura build | `es` |
| `NEXT_PUBLIC_SITE_URL` | Canonical/OG | `https://www.fxstreet.es` / QA `https://qa.fxstreet.es` |
| `NEXT_PUBLIC_CDN_URL` | Assets | `…/site/es` (+ `-qa`) |
| `NEXT_PUBLIC_SITE_GATEWAY_URL_TEMPLATE` | Gateway | `site-gateway-{locale}{site_env}.fxstreet.com` |
| `NEXT_PUBLIC_USER_AUTH_*` | Auth | Compartidas |
| `NEXT_PUBLIC_SITE_ENV` | qa / vacío pro | Language switcher |
| `AUTHORIZATION_APITOKEN` | Gateway | Por entorno |

| culture | env | siteUrl | gateway | CDN | image |
|---------|-----|---------|---------|-----|-------|
| es | qa | qa.fxstreet.es | site-gateway-es-qa | site/es-qa | site-es-qa |
| es | pro | www.fxstreet.es | site-gateway-es | site/es | site-es |
| en | qa/pro | fxstreet.com | site-gateway-en* | site/en* | site-en* |

| Pieza | Path | ES |
|-------|------|-----|
| `SiteLocale` | `locale-keyed.ts` | Incluye `es` |
| `CALENDAR_BASE_PATH` | `calendar-base-path.ts` | `/calendario-economico` |
| Language switcher | `languages.ts` | Español → fxstreet.es |
| Redirects | `Site/redirects.ts` | Locale-aware |

**Formatos:** fechas UI con `Intl` · premium `NumberFormat` QA en ES · rates charts: **siempre `en-US`** (comentario en `convertToDecimalPlaces`).  
**Terceros por locale:** emails soporte, OneSignal, Turnstile/aria, cookies.

Checklist infra: `[x]` SiteLocale/helpers/es · `[x]` switcher · `[x]` matriz deploy · `[x]` `.env.example` EN/ES · `[ ]` gateway `Languages.es` GUID · `[ ]` CDN · `[ ]` smoke QA/PRO · `[x]` política números charts · `[~]` 404 mailto locale-aware · `[ ]` OneSignal/consent por locale.

---

## 5. CMS / Algolia / SEO contenido

Sin esto: menús ES pero cuerpo vacío o EN.

| Concepto | Dónde | Go-live |
|----------|-------|---------|
| `Languages[locale] → languageId` | Gateway | `Languages.es` correcto |
| APIs | `site-gateway-es*` | Mismo contrato EN |
| Filtro `CultureName` | Posts/feeds/eventos | Índice `es` |
| Preferencias usuario | languageId | Profile/alerts ES |

| Familia contenido | Prioridad |
|-------------------|-----------|
| Home, news, analysis, education | Alta |
| Brokers / best / reviews | Alta |
| Rates / calendar | Alta |
| Companies (~279), authors (~69) | Alta volumen |
| Crypto, commodities, equities, macro | Media |
| Legal `/info/*` | Alta (parte JSON UI) |
| Press / live-video / curso-forex / mexico hub | Fuera o `[D]` |

- Algolia: filtro/índice `CultureName: es`; QA `/search` solo ES.  
- Sitemaps: gateway ES + rewrite middleware; canonical `.es`; hreflang = decisión producto D-D.  
- RSS: UI keys OK; ítems por cultura ES.  
- Fuera Site: emails, newsletter templates, workflows CMS, Propinder.

Checklist C: todo `[ ]` hasta ops/editorial (contenido, brokers, directors, topics, eventos, Algolia, sitemaps, canonical/OG, hreflang, RSS items, enlaces internos CMS, templates fuera Site).

---

## 6. Routing / redirects / SEO técnico

- Mismo path EN/ES **salvo calendario**. Idioma = dominio. Switcher = TLD absoluto.
- EN calendar `/economic-calendar` · ES `/calendario-economico` (hub, `event/[slug]`, país `[slug]`, fed/hours/world-interest).
- Deploy ES: 301 `/economic-calendar` (+ `/event/*`) → path ES.

| Tema legacy | Tratamiento |
|-------------|-------------|
| `/educacion/*` | → `/education` `[x]` |
| `/mexico` | → `/currencies/usdmxn` `[x]` |
| `/technical-analysis/*` | → indicators; nav ES a `/rates-charts/indicators` |
| `/bonds`, jobs, advertising, organismos, brokers-forex, events/strategy, tabla-tipos-interes | Redirects legacy ES `[x]` |
| Macro/fed | Locale-aware → hub calendario `[x]` |
| Landings SEO brokers raíz | `[ ]` si aún aplican (CSV histórico) |
| Posts legacy raíz | `[ ]` → vertical correcta |
| `/live-video/*`, curso-forex | `[D]` producto |

Nav ES (`navigation-data-es.ts`): `[x]` URLs · `[~]` labels humanos · `[x]` comentario de registro de locale en `navigation-data.ts`.

SEO UI: `messages/seo/Seo.*` → revisión humana (lote 02).

---

## 7. Inventario superficies (crawl validado)

| Campo | Valor |
|-------|--------|
| Fecha | 2026-09-09 |
| Tool | `web-scraper-toolkit` preset `fxstreet-es` (artefactos CSV no versionados aquí) |
| Origen | `https://www.fxstreet.es/` |
| Resultado | 67 URLs · ~40 patrones (sin ruido `cdn-cgi`) |

**Veredicto:** el alcance por **patrones** es correcto; no hace falta enumerar slugs CMS. Familias dinámicas = `/…/[slug]`.

### A. Canónicas Next (mantener)

`/` · `/news` (+ feed, `[slug]`) · `/analysis` (+ latest, feed, `[slug]`) · `/education` (+ feed, `[slug]`) · `/cryptocurrencies` (+ news/feed/`[slug]`) · `/brokers` (+ best/reviews/prop/cashback/`[slug]`) · `/rates-charts` (+ chart, interactive, forecast, indicators, rates, `[slug]`, forecast) · `/commodities`/`[slug]` · `/equities` · `/currencies/[slug]` · `/calendario-economico` (+ event, país, tools) · `/macroeconomics/…` · `/company`/`author` · `/info/[page]` · `/account/*` · `/profile` `/search` `/subscriptions` `/rss` `/transparency-translations`.

### B. Legacy / decisión (no ampliar)

educacion→education · mexico→usdmxn · live-video `[D]` · curso-forex `[D]` · technical-analysis→indicators · markets/* redirects · bonds/jobs/… · press-releases **EN-only** · economic-calendar/country GUID · SEO root → brokers/best · rates tabs parcial.

### C. Ruido

`/cdn-cgi/*` · paths mal formados `/https:/…`.

Reproducir (en el toolkit, no en este repo):

```bash
pnpm --filter @operezol/scraper-cli start fxstreet-es \
  -o <out.csv> -d 250 --checkpoint-every 30
```
---

## 8. Checklist ejecución (vivo)

### A. Diccionarios

- `[x]` Modular + paridad keys · `[~]` revisión humana · `[x]` componentes/keys listados arriba · `[x]` CI `pnpm i18n:parity` · `[x]` hardcodes a11y/newsletter/schema/mailto

### B–D. Infra / CMS / routing

Ver §§4–6 (ítems `[ ]` allí).

### E. `[D]` no abrir

Press · industry-news · home modules EN · newsletter · calendar speech/notif · mexico hub · curso-forex · live-video · alcance hreflang.

### F. QA aceptación ES

`[ ]` Home/nav/footer/switcher · calendario+tools · news/analysis/education/crypto · brokers/best/reviews/cashback · rates/forecast/indicators · search · account/profile/premium · legal `/info/*` · 404/500 · RSS · mobile+desktop · **regresión EN**.

### G. Plantilla nuevo idioma `xx`

1. Dominio + DNS + `site-gateway-xx` + CDN `site/xx`  
2. Fila deploy matrix qa+pro  
3. `NEXT_PUBLIC_LOCALE=xx` + `Languages.xx`  
4. `SiteLocale` + switcher + `navigation-data-xx.ts`  
5. `messages/**/*.{xx}.json` + componentes + `rss-feed.xx.json` (mismas leaf keys)  
6. Paths localizados solo si producto + App Router  
7. Feature gates vs EN-only  
8. CMS/Algolia/sitemaps cultura `xx`  
9. Redirects + crawl TLD  
10. Traductor nativo + QA F · diff EN↔xx = 0 gaps · hunt literales EN  

### Orden de trabajo ES

1. Cerrar `[D]` que afecten nav/scope (PO).  
2. Paridad keys + hardcodes Site (`[x]`).  
3. Reintegrar CSV humanos (legal→…).  
4. CMS+Algolia+sitemaps ∥ redirects pendientes (landings SEO raíz).  
5. QA F QA→PRO.  
6. Congelar como plantilla idioma siguiente.
