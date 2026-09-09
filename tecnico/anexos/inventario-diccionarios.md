# Anexo — Inventario de diccionarios UI (Site)

Documento de detalle técnico. Informes: [../INFORME-tecnico.md](../INFORME-tecnico.md) · [../../README.md](../../README.md).

Fuente de verdad EN: clonar/traducir desde EN. Los `*.es.json` existentes = **revisión humana pendiente** (no marcar como cerrados).

Carga en runtime: `Site/i18n/request.ts` → base modular + componentes + server-only. Ficheros ausentes se omiten con `Promise.allSettled`.

## Arquitectura de mensajes (post-migración)

| Capa | Ubicación | Registro |
|------|-----------|----------|
| **Base / chrome** | `Site/messages/{module}/{Namespace}.{locale}.json` | `Site/i18n/message-modules.ts` |
| **Páginas / features** | `Site/packages/ui/src/components/{name}/{name}.{locale}.json` | lista en `loadComponentMessages` (`request.ts`) |
| **Server-only** | `Site/packages/lib/server-only/rss/rss-feed.{locale}.json` | `loadServerOnlyMessages` |
| **Nav (no i18n JSON)** | `navigation-data-{en,es}.ts` | `navigation-data.ts` |

Doc interna: `Site/messages/README.md`. Script histórico de split: `Site/scripts/split-messages-modules.mjs`.

### Módulos base (`messages/`)

| Módulo | Namespaces (keys de `useTranslations`) |
|--------|----------------------------------------|
| `layout` | Header, Footer, FooterDisclaimer, Navigation, LanguageSelector, Sidebar |
| `shared` | Common, Shared, Share, Sponsored, AdvertisementDialog, Greybox, DisclaimerSection, CalendarDisclaimer, OneSignal |
| `errors` | NotFound, Error500, ServiceNotAvailable |
| `seo` | Seo |
| `home` | HomePage, MoreNewsSection, InDeepAnalysisSection, LiveCoverageSection, WeeklyForecastSection, EditorialHighlightCard, EditorialHighlightSection, EditorialHighlightCalendarSection, EducationSection, CryptocurrenciesSection, StocksSection, IndustryNewsSection, BestBrokersSection, BestBrokersYearlySection, AuthorSection, CashbackWidget, SubHomeShowcases, Newsletter |
| `posts` | PostMetadata, PostAuthorInfo, PostListMultifeed, PostVerifiedTranslation, Paywall |
| `brokers` | Brokers, BrokerListing, BrokerReview, BrokerReviewsSubHome, BrokerShowcase |
| `directory` | Author, Company, BecomeContributor, ContactUs |
| `search` | Search, Algolia |
| `editorial` | EditorialGuidelines, EthicalCode, TransparencyTranslations, PressReleases, CryptoIndustryNews, Premium |

Ejemplo de path: `messages/layout/Header.es.json`, `messages/seo/Seo.en.json`.

## 1. Diccionario base (modular)

| Locale | Ficheros | Acción |
|--------|----------|--------|
| EN | 59 × `{Namespace}.en.json` | Fuente |
| ES | 59 × `{Namespace}.es.json` | **Paridad keys hecha** (rama Site); revisión humana pendiente |

### Gaps técnicos cerrados (código)

- Ficheros `CashbackWidget` / `EditorialHighlightCard` / `SubHomeShowcases` ES creados
- Keys `BrokerShowcase`, `PostListMultifeed`, `Header…propinder`, `Seo.SubHomeShowcases`
- Componentes: commodities, equities, macro-showcases, showcases-variants, macro-showcases-sub-home
- `rates-charts` alineado a `Forecasts.*`
- RSS education keys
- Calendario: rutas bajo `/calendario-economico/...` + redirects ES

### Pendiente humano

Todo el copy ES (incl. editorial largo de commodities; equities `editorialText` aún mezcla EN hasta revisión).

## 2. Diccionarios por componente (`packages/ui/src/components/{name}/{name}.{locale}.json`)

Registrados en `i18n/request.ts` (lista canónica):

| Componente | EN | ES fichero | Notas |
|------------|----|------------|-------|
| analysis-page | sí | sí → revisar | |
| cryptocurrencies-page | sí | sí → revisar | |
| forecast | sí | sí → revisar | |
| assets-forecast | sí | sí → revisar | |
| forecast-chart | sí | sí → revisar | |
| macro-showcases | sí | sí → revisar | |
| macro-showcases-sub-home | sí | sí → revisar | registrado en `request.ts` + next-intl |
| premium | sí | sí → revisar | |
| propinder | sí | sí → revisar | |
| premium-terms-and-conditions | sí | sí → revisar | Legal: prioridad alta |
| terms-conditions | sí | sí → revisar | Legal |
| privacy-policy | sí | sí → revisar | Legal |
| cookie-policy | sí | sí → revisar | Legal |
| prevention | sí | sí → revisar | Legal |
| advertising-model | sí | sí → revisar | |
| how-we-score-reviews | sí | sí → revisar | |
| how-fxstreet-uses-ai | sí | sí → revisar | |
| youtube-videos-section | sí | sí → revisar | |
| youtube | sí | sí → revisar | |
| about-us | sí | sí → revisar | |
| corporate-identity | sí | sí → revisar | |
| showcases-variants | sí | sí → revisar | |
| calendar-guide | sí | sí → revisar | linkPaths país ES hechos |
| commodities | sí | sí → revisar | editorial largo; revisión humana |
| rates-charts | sí | sí → revisar | `Forecasts.*` alineado |
| equities | sí | sí → revisar | `editorialText` aún EN hasta revisión |
| forex-market-hours | sí | sí → revisar | |
| fed-sentiment-index | sí | sí → revisar | |
| world-interest-rates | sí | sí → revisar | |
| central-banks | sí | sí → revisar | |
| central-bank-detail | sí | sí → revisar | |
| economic-indicator-detail | sí | sí → revisar | |
| checklist-section | sí | sí → revisar | |
| trade-war | sí | sí → revisar | |
| key-technicals-table | sí | sí → revisar | |
| contributors-table | sí | sí → revisar | |
| company | sí | sí → revisar | |
| author | sí | sí → revisar | |
| brokers | sí | sí → revisar | |
| broker-detail | sí | sí → revisar | |
| economic-calendar | sí | sí → revisar | |
| calendar-event | sí | sí → revisar | |
| topic-page | sí | sí → revisar | |
| profile | sí | sí → revisar | |
| subscriptions | sí | sí → revisar | |
| account | sí | sí → revisar | |

### Entradas eliminadas / obsoletas

- `rates-charts-sub-home` — quitado de `request.ts` (no había ficheros).

## 3. Server-only

| Fichero | Acción ES |
|---------|-----------|
| `packages/lib/server-only/rss/rss-feed.en.json` | Fuente |
| `packages/lib/server-only/rss/rss-feed.es.json` | Paridad keys hecha; revisión humana pendiente |

## 4. Navegación (no es JSON i18n)

| Fichero | Acción |
|---------|--------|
| `packages/ui/.../navigation-data-en.ts` | Fuente labels + URLs |
| `packages/ui/.../navigation-data-es.ts` | Revisar labels humanos; validar URLs vs producto ES |
| `packages/ui/.../navigation-data.ts` | Registrar locale al añadir idiomas |

## 5. Strings hardcodeados detectados (sacar a i18n o traducir)

| Ubicación | Texto / issue |
|-----------|----------------|
| `rates-charts/header/assets-search.tsx` | `Search assets...` |
| `widgets/cashback/index.tsx` | `Search broker...` |
| `posts/expand-image.tsx` | aria ES fijo (`Expandir imagen`, `Cerrar visor`) |
| `posts/post-image-viewer.tsx` | `Ver imagen` |
| `sections/about-us/timeline.tsx` | `Previous years` / `Next years` |
| `primitives/pagination.tsx` | `pagination`, `Go to previous/next page` |
| `primitives/breadcrumb.tsx` | `Breadcrumb` |
| `sections/rss-section-*.tsx` | `RSS Feed` |
| `providers/turnstile-provider.tsx` | `Security verification` |
| Newsletter Zod (signup) | mensaje de validación en inglés |
| `app/not-found.tsx` | `mailto:soporte@fxstreet.com` (OK ES; revisar otros locales) |
| `app/layout.tsx` | Schema.org app name en inglés |

## 6. Checklist mínimo de paridad EN↔locale

Para cualquier idioma `xx`:

- [ ] Cada `messages/**/*.en.json` tiene `*.xx.json` hermano (mismas leaf keys)
- [ ] Un `{name}.xx.json` por cada entrada de `loadComponentMessages` que tenga EN
- [ ] `rss-feed.xx.json` con mismas keys
- [ ] `i18n/message-modules.ts` no requiere cambio salvo namespaces nuevos
- [ ] Diff automatizable EN vs xx = 0 gaps
- [ ] Revisión humana de todo el copy (legal primero)
- [ ] Búsqueda de literales EN en UI (`aria-label`, `placeholder`, Zod, schema)
