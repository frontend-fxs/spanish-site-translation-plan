# Técnico — Checklist de migración de idioma (Site / next-intl)

| | |
|--|--|
| **Para** | Engineering / Tech lead |
| **Producto (PO)** | [README.md](./README.md) — gestiona traducciones UI en **Google Drive / Sheets** (sin GitHub) |
| **Referencia viva** | Primer idioma no-EN: **`es`** (FXStreet.es) · rama Site `chore/modular-messages-i18n` |
| **Fuente CSV (eng)** | [csv/](./csv/) — regenerados 1:1 desde Site (`regenerate-csv-from-site.mjs`); el PO trabaja la copia en Sheets |

**Distribución PO:** carpeta Drive dedicada con el README (Doc) + una Sheet por lote (`01`…`06`). El PO no usa GitHub. Eng exporta Sheet → CSV/TSV y reintegra en Site.

**Modelo de producto:** un locale por deploy/dominio (`NEXT_PUBLIC_LOCALE`). Sin prefijos `/xx/…` en la URL (salvo paths localizados puntuales, p. ej. calendario ES). EN = `fxstreet.com`. UI = JSON next-intl colocated; editorial = gateway/CMS por cultura.

**Convención checklist:** `[ ]` pendiente · `[~]` parcial · `[x]` hecho · `[D]` decisión producto (no abrir sin orden PO).

Este documento es la **plantilla de migración** para cualquier locale `xx`. La columna **ES** marca el estado del primer rollout.

---

## 0. Arquitectura i18n (patrón Ana — colocation)

| Capa | Ubicación | Registro |
|------|-----------|----------|
| Features + chrome | `packages/ui/src/components/{name}/{name}.{locale}.json` | `i18n/colocated-message-modules.ts` → `loadComponentMessages` |
| Primitives | `packages/ui/src/primitives/{name}.{locale}.json` | `loadPrimitiveMessages` |
| Server-only | `packages/lib/server-only/rss/rss-feed.{locale}.json` | `loadServerOnlyMessages` |
| Nav (no JSON) | `navigation-data-{locale}.ts` | `navigation-data.ts` |

**Reglas:**

1. Namespace = nombre de carpeta (kebab). Ej. `useTranslations('header')`, `broker-review`, `seo`.
2. Cada diccionario nuevo → crear JSON EN+`xx` y **añadir** el nombre a `colocatedMessageModules`.
3. Badge premium UI = `premium-badge` (no choca con landing `premium`). CTAs brokers compartidos = `brokers.common`.
4. Conservar markup al traducir: `<link>…</link>`, `{vars}`, etc.
5. Loader hoy carga el registry entero (`Promise.allSettled` omite ficheros ausentes). Colocation habilita lazy por ruta más adelante; no es bloqueante de go-live.
6. Doc corta en Site: `messages/README.md` (carpeta `messages/{module}/` retirada).

**Reintegrar Sheets PO → Site:** exportar cada hoja (Archivo → Descargar → CSV). Mapear `Carpeta` = `componentes/{name}` → `packages/ui/src/components/{name}/{name}.es.json` (clave = path de hoja); `navegacion` → `navigation-data-es.ts` (Text por Clave); `rss` → `rss-feed.es.json`. Usar **Español (revisado)**; si vacío y Estado=Revisado, aceptar borrador. Conservar markup. No exigir al PO que exporte: eng baja la Sheet cuando avisen lote cerrado.

**Regenerar CSV tras cambios de i18n en Site:** desde este repo, `node regenerate-csv-from-site.mjs` (lee `Site/` hermano). Debe terminar con `AUDIT OK — component keys 1:1`. Luego reimportar Sheets en Drive (*Sustituir hoja*).

**Publicar lote a Drive (eng):** CSV de [csv/](./csv/) → Sheet con el mismo nombre de lote (`01-legal` … `06-rss`; lote 02 = `02-chrome-navegacion`).

---

## 1. Checklist plantilla — nuevo idioma `xx`

Completar en orden. Sustituir `xx` / `TLD` (ej. `es` / `fxstreet.es`).

### A. Producto / alcance

| # | Ítem | ES |
|---|------|-----|
| A1 | Alcance: espejo EN sin superficies EN-only; sin traducir “por si acaso” | `[x]` (PO) |
| A2 | Feature gates: no abrir superficies EN-only sin orden PO | `[x]` gates actuales; ver §2 |
| A3 | Variante de idioma / tono (D-F) cerrada antes de revisión humana | `[ ]` |
| A4 | Lotes UI revisados en Drive/Sheets (mín. go-live: 01–04) y avisados a eng | `[ ]` |
| A5 | CMS/Algolia listos en verticales “Sí locale” (o menú oculto — D-A) | `[ ]` |

### B. Diccionarios UI

| # | Ítem | ES |
|---|------|-----|
| B1 | Paridad de **keys** EN↔`xx` en todos los `*.{en,xx}.json` colocated + primitives + rss | `[x]` |
| B2 | Copy `xx` = borrador IA → revisión humana vía CSV | `[~]` |
| B3 | Hardcodes UI → next-intl (a11y, Zod, schema app name, mailto, etc.) | `[x]` |
| B4 | `navigation-data-xx.ts` + registro en `navigation-data.ts` | `[x]` |
| B5 | Paths localizados solo si producto + App Router (calendario ES) | `[x]` |
| B6 | Reintegrar Sheets revisadas → JSON / nav | `[ ]` |

### C. Infra / deploy

| # | Ítem | ES |
|---|------|-----|
| C1 | Dominio + DNS + `site-gateway-xx` (+ `-qa`) + CDN `site/xx` | `[ ]` ops |
| C2 | Fila(s) deploy matrix qa+pro (`Build/site-deploy.yaml`) | `[x]` matriz |
| C3 | `NEXT_PUBLIC_LOCALE=xx`, `SITE_URL`, `CDN_URL`, gateway template, auth | `[x]` código / `.env.example` |
| C4 | `SiteLocale` incluye `xx` (`locale-keyed.ts`) | `[x]` |
| C5 | Language switcher → TLD absoluto | `[x]` |
| C6 | Gateway `Languages.xx` → languageId correcto | `[ ]` |
| C7 | Smoke QA + PRO; regresión EN | `[ ]` |
| C8 | Política números charts: **siempre `en-US`** (`convertToDecimalPlaces`) | `[x]` |
| C9 | Terceros por locale: OneSignal, Turnstile/aria, cookies, emails soporte | `[~]` mailto; resto `[ ]` |

### D. CMS / búsqueda / SEO contenido

| # | Ítem | ES |
|---|------|-----|
| D1 | APIs `site-gateway-xx*` mismo contrato | `[ ]` |
| D2 | Contenido CultureName `xx` (home, news, analysis, education, brokers, rates, calendar, directors…) | `[ ]` |
| D3 | Algolia índice/filtro `CultureName: xx` | `[ ]` |
| D4 | Sitemaps + canonical TLD; hreflang según D-D | `[ ]` |
| D5 | RSS: keys UI + ítems por cultura | keys `[x]` · ítems `[ ]` |
| D6 | Fuera Site: emails, newsletter templates, workflows CMS, Propinder | `[ ]` |

### E. Routing / redirects / SEO técnico

| # | Ítem | ES |
|---|------|-----|
| E1 | Mismo path que EN salvo excepciones producto | `[x]` (+ calendario) |
| E2 | Redirects legacy del TLD anterior / Sitefinity | `[x]` mayor parte |
| E3 | 301 paths EN → localizados (si aplica) en deploy `xx` | `[x]` economic-calendar → calendario |
| E4 | Landings SEO raíz / posts legacy | `[ ]` si aún aplican |
| E5 | Crawl TLD: patrones canónicos OK (no hace falta listar todos los slugs CMS) | `[x]` 2026-09-09 |

### F. QA aceptación

| # | Ítem | ES |
|---|------|-----|
| F1 | Home / nav / footer / switcher | `[ ]` |
| F2 | Verticales “Sí locale” + legal `/info/*` + account/premium | `[ ]` |
| F3 | Search, RSS, 404/500, mobile+desktop | `[ ]` |
| F4 | **Regresión EN** | `[ ]` |

### G. Cierre / plantilla siguiente idioma

| # | Ítem | ES |
|---|------|-----|
| G1 | Congelar decisiones + CSV + gates como baseline | `[ ]` |
| G2 | Diff EN↔`xx` = 0 gaps de keys; hunt literales EN en UI | `[ ]` tras revisión |
| G3 | Documentar desviaciones (paths localizados, gates) en este TECNICO | `[~]` |

---

## 2. Gates EN-only (referencia ES / no abrir sin PO)

Fuente producto: [README §1](./README.md). Código: `show-component-service.ts` + pages con `notFound` por locale.

| PO | Superficie | Comportamiento |
|----|------------|----------------|
| P10 | Press releases | `locale !== 'en'` → `notFound`; fuera menú ES |
| P11 | Crypto industry-news | EN only |
| P12 | Newsletter signup / chip | Condicionales EN |
| P13 | Home More news / In-deep / Best brokers yearly | EN only |
| P14 | Calendar speech / notif | EN only |
| P15–P17+ | México, curso-forex, live-video, landings SEO raíz, technical-analysis, bonds, jobs, organismos, events/strategy, tabla-tipos, advertising legado, brokers-forex, posts raíz, eventos calendario GUID | **Pendiente PO** — ver [README § Páginas fuera del espejo](./README.md) |
| — | `/calendario-economico` | Solo ES (excepción de path) |

Al migrar `xx`: copiar o ajustar esta tabla según decisiones del PO de ese mercado.

---

## 3. Infra ES (detalle deploy)

Fuente: `Site/Build/site-deploy.yaml`.

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

| Pieza | Path |
|-------|------|
| `SiteLocale` | `locale-keyed.ts` |
| `CALENDAR_BASE_PATH` | `calendar-base-path.ts` → `/calendario-economico` |
| Language switcher | `languages.ts` |
| Redirects | `Site/redirects.ts` |

---

## 4. Inventario superficies (crawl ES validado)

| Campo | Valor |
|-------|--------|
| Fecha | 2026-09-09 |
| Tool | `web-scraper-toolkit` preset `fxstreet-es` (artefactos no versionados aquí) |
| Origen | `https://www.fxstreet.es/` |
| Resultado | 67 URLs · ~40 patrones (sin ruido `cdn-cgi`) |

**Veredicto:** alcance por **patrones** correcto; familias dinámicas = `/…/[slug]`. Reproducir en el toolkit:

```bash
pnpm --filter @operezol/scraper-cli start fxstreet-es \
  -o <out.csv> -d 250 --checkpoint-every 30
```

**Canónicas Next (mantener):** `/` · `/news` · `/analysis` · `/education` · `/cryptocurrencies` · `/brokers` (+ best/reviews/…) · `/rates-charts` · topics · `/calendario-economico` · `/macroeconomics/…` · `/company` `/author` · `/info/*` · `/account/*` · `/profile` `/search` `/subscriptions` `/rss` `/transparency-translations`.

**Legacy / pendiente PO (README § final):** educacion · mexico · live-video · curso-forex · technical-analysis · landings SEO raíz · bonds · jobs · organismos · events/strategy · tabla-tipos · advertising-and-sponsorship · brokers-forex · posts raíz · calendario event GUID. Press = EN-only (cerrado).

---

## 5. Estado vivo ES + go-live

| Área | Estado |
|------|--------|
| Colocation Ana + keys EN↔ES | `[x]` keys · `[~]` copy humano |
| Calendario path ES + redirects | `[x]` |
| Nav ES sin press; legacy saneado | `[x]` URLs · `[~]` labels humanos |
| Hardcodes → i18n | `[x]` |
| `.env.example` EN/ES | `[x]` |
| Charts `en-US` documentado | `[x]` |
| Crawl patrones | `[x]` |
| Gates EN-only | Cerrados salvo orden PO |
| Gateway / CDN / CMS / Algolia / smoke | `[ ]` ops + editorial |

**Go-live técnico ES:** lotes PO 01–04 reintegrados · smoke QA/PRO · `Languages.es` + CMS/Algolia · regresión EN · menú sin gated EN.

| Aprobación eng | Nombre | ☐ Aprobado / ☐ Con cambios / ☐ Rechazado | Fecha |
|----------------|--------|------------------------------------------|-------|
| | | | |

### Orden de trabajo ES (ahora)

1. Publicar en Drive: README (Doc) + Sheets 01–06 (import desde [csv/](./csv/)).  
2. Alcance PO cerrado (espejo EN; sin solo-EN). Encargos: Traducciones / SEO / Legal — [README](./README.md).  
3. Revisión humana en Sheets (prioridad 01→04).  
4. Eng exporta Sheets → reintegra JSON/nav.  
5. Ops: gateway + CDN + CMS/Algolia/sitemaps ∥ redirects landings pendientes.  
6. QA F → PRO.  
7. Congelar como baseline del §1 para el siguiente `xx`.
