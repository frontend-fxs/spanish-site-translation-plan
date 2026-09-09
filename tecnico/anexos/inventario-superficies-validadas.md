# Inventario de superficies ES — validación crawl

| Campo | Valor |
|-------|--------|
| **Fecha crawl** | 2026-09-09 |
| **Herramienta** | `web-scraper-toolkit` → `fxstreet-es` |
| **Origen** | `https://www.fxstreet.es/` |
| **Filtro** | Preset FXStreet ampliado: excluye slugs CMS (news, analysis, education, company, author, brokers/best/*, calendar events, etc.) |
| **Resultado bruto** | 67 URLs · [crawl/fxstreet-es-live.csv](./crawl/fxstreet-es-live.csv) |
| **Patrones** | ~40 superficies (sin ruido `cdn-cgi` / URLs rotas) |

## Veredicto

**El listado de trabajo del plan es correcto a nivel de patrones.**  
No hace falta enumerar cientos de slugs: las familias dinámicas ya están representadas como `/…/[slug]` en el plan.

| Comprobación | Resultado |
|--------------|-----------|
| Hubs principales vivos en `.es` | Cubiertos por el plan (`/`, news, analysis, education, brokers, rates, calendario, crypto, commodities, equities, info, …) |
| Familias slug | Correctamente agrupadas en el plan; el crawl las omite a propósito |
| Solo en plan (no en crawl de superficie) | Rutas Next / hub no enlazados desde home (`/search`, `/profile`, `/author`, feeds, `[slug]`, account extra, …) — **seguir en alcance código/CMS** |
| Solo en live (detalle) | Tools de calendario bajo `/economic-calendar/…` y `country/[id]` — **ya contemplados** en el plan (grupo calendario) |
| Stack detectado hoy en PRO `.es` | Mayoría **Sitefinity** (42) vs pocos **Next** (4: home, brokers, calendario-economico, …) — el go-live Next ES aún no sustituye todo el TLD |

## Listado corto de trabajo (patrones)

### A. Superficies canónicas Next (mantener)

| Patrón | Rol |
|--------|-----|
| `/` | Home |
| `/news`, `/news/feed`, `/news/[slug]` | News |
| `/analysis`, `/analysis/latest`, `/analysis/feed`, `/analysis/[slug]` | Analysis |
| `/education`, `/education/feed`, `/education/[slug]` | Education |
| `/cryptocurrencies`, `/cryptocurrencies/news`, `/cryptocurrencies/news/feed`, `/cryptocurrencies/news/[slug]`, `/cryptocurrencies/[slug]` | Crypto |
| `/brokers`, `/brokers/best`, `/brokers/best/[slug]`, `/brokers/reviews`, `/brokers/reviews/[slug]`, `/brokers/[slug]`, `/brokers/prop/[slug]`, `/brokers/cashback/not-available` | Brokers |
| `/rates-charts`, `/rates-charts/chart`, `/rates-charts/chart-interactive`, `/rates-charts/forecast`, `/rates-charts/indicators`, `/rates-charts/rates`, `/rates-charts/[slug]`, `/rates-charts/[slug]/forecast` | Rates |
| `/commodities`, `/commodities/[slug]` | Commodities |
| `/equities` | Equities |
| `/currencies/[slug]` | Topics FX |
| `/calendario-economico`, `/calendario-economico/event/[slug]`, `/calendario-economico/[slug]`, tools fed/hours/world-rates | Calendario ES |
| `/macroeconomics/central-banks`, `/macroeconomics/central-banks/[slug]`, `/macroeconomics/economic-indicator/[slug]`, `/macroeconomics/trade-war` | Macro |
| `/company`, `/company/[slug]`, `/author`, `/author/[slug]` | Directorios |
| `/info/[page]` | Legal / corporativo |
| `/account/login` (+ signup / password / checkout / additional-data) | Cuenta |
| `/profile`, `/search`, `/subscriptions`, `/rss`, `/transparency-translations` | Utilidades |

### B. Legacy vivo en `.es` (redirect / decisión — no ampliar listado)

| Patrón | Tratamiento plan |
|--------|------------------|
| `/educacion/*` | Redirect → `/education` |
| `/mexico` | Redirect → `/currencies/usdmxn` |
| `/live-video/*` | Decisión producto (no Next) |
| `/education/curso-forex/*` | Decisión producto |
| `/technical-analysis/*` | Redirect → indicators |
| `/markets/commodities/*`, `/markets/equities` | Redirect EN reutilizable |
| `/bonds`, `/events/strategy`, `/info/jobs`, … | Redirects legacy |
| `/press-releases`, `/press-releases/[slug]` | **EN-only** (fuera de menú ES en Next) |
| `/economic-calendar/country/[id]` | Legacy GUID → calendario |
| `/[seo-or-legacy-root]` | Landings SEO → `/brokers/best/[slug]` si aplica |
| `/rates-charts/rates/*` (tabs) | Parcial; hub `/rates-charts/rates` |

### C. Ruido (ignorar)

- `/cdn-cgi/*`
- Paths mal formados tipo `/https:/…`

## Implicación para el informe

No se cambia el alcance: el CSV largo histórico sigue como anexo; **esta página es la fuente corta validada** para trabajar el lanzamiento.

Crawl reproducible:

```bash
pnpm --filter @operezol/scraper-cli start fxstreet-es \
  -o <out.csv> -d 250 --checkpoint-every 30
# (sin --keep-articles → aplica filtros de slug del preset)
```
