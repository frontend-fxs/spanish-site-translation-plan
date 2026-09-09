# Checklist operativo — Site español

Documento de **ejecución**. Alcance producto: [../README.md](../README.md). Alcance técnico: [INFORME-tecnico.md](./INFORME-tecnico.md).

**Convención de estado**

| Marca | Significado |
|-------|-------------|
| `[ ]` | Pendiente |
| `[~]` | Parcial / borrador IA — requiere cierre |
| `[x]` | Hecho (ingeniería o validado) |
| `[D]` | Decisión de producto (ver informe §6) |

> Copy ES del repo = `[~]` hasta revisión humana.

---

## A. Diccionarios UI (next-intl)

Detalle: [anexos/inventario-diccionarios.md](./anexos/inventario-diccionarios.md)

### A1. Paridad de ficheros

- [x] Migración modular: `messages/{module}/{Namespace}.{locale}.json` (rama Site `chore/modular-messages-i18n`)
- [x] Paridad de keys EN↔ES en diccionarios base/componentes/RSS (borrador IA; extras ES OK)
- [~] Revisión humana de todo el copy ES (sigue pendiente)
- [x] `messages/home/CashbackWidget.es.json`
- [x] `messages/home/EditorialHighlightCard.es.json`
- [x] `messages/home/SubHomeShowcases.es.json`
- [x] Keys `BrokerShowcase`, `Header.propinder`, `PostListMultifeed`, `Seo.SubHomeShowcases`
- [x] `commodities.es.json` / `equities.es.json` / `macro-showcases.es.json` / `showcases-variants.es.json`
- [x] `macro-showcases-sub-home` registrado + next-intl (sin hard-import `.en.json`)
- [x] Eliminado dead entry `rates-charts-sub-home` de `request.ts`
- [x] Alineado `rates-charts.es.json` → top-level `Forecasts.*`
- [x] `calendar-guide` linkPaths país → `/calendario-economico/...`
- [x] `rss-feed.es.json` keys `*_education`
- [ ] Script/CI de diff EN vs locale en pipeline
- [~] Literales hardcodeados: placeholders rates/cashback hechos; quedan aria-labels genéricos (pagination, breadcrumb, RSS, turnstile, about-us timeline)

### A2. Revisión humana por prioridad

Orden sugerido:

1. [ ] Legal: terms, privacy, cookies, prevention, premium-terms
2. [ ] SEO (`messages/seo/Seo.*`) + home modules + header/footer/nav labels
3. [ ] Account / premium / paywall / errors (404/500)
4. [ ] Calendario + rates + brokers
5. [ ] Resto de verticales y widgets
6. [ ] RSS + metadatos secundarios

### A3. Navegación

- [~] `navigation-data-es.ts` — revisión humana labels
- [x] URLs menú ES: sin press-releases; commodities/oil/gold; usdmxn; indicators; calendario tools bajo `/calendario-economico/...`
- [ ] Registrar patrón en `navigation-data.ts` al añadir idiomas

---

## B. Configuración e infraestructura

Detalle: [anexos/configuracion-infra.md](./anexos/configuracion-infra.md)

- [x] `SiteLocale` / helpers incluyen `es`
- [x] Language switcher → `fxstreet.es`
- [x] Matriz deploy ES QA/PRO en `site-deploy.yaml`
- [ ] Verificar env locales documentados (`.env.example`) para ES
- [ ] Gateway ES: `Languages.es` → languageId CMS correcto
- [ ] CDN `site/es` (+ qa) operativo
- [ ] Smoke deploy QA ES con `NEXT_PUBLIC_LOCALE=es`
- [ ] Smoke deploy PRO ES
- [ ] Formatos fecha/número/moneda QA en ES
- [ ] Política números en charts (¿forzar en-US?)
- [ ] Emails soporte / OneSignal / consent por locale

---

## C. CMS / contenido / búsqueda

Detalle: [anexos/cms-y-contenido.md](./anexos/cms-y-contenido.md)

- [ ] Contendido editorial ES publicado (news, analysis, education, crypto)
- [ ] Brokers + showcases + best lists ES
- [ ] Companies (~279) y authors (~69) ES
- [ ] Topics / currencies / commodities / equities / macro ES
- [ ] Eventos y guías de calendario ES
- [ ] Algolia filtrado por cultura `es`
- [ ] Sitemaps gateway ES + rewrite middleware
- [ ] Canonical / OG en dominio `.es`
- [ ] Política hreflang EN↔ES
- [ ] RSS con ítems ES
- [ ] Enlaces internos en cuerpo CMS con paths ES correctos
- [ ] Emails / newsletter / auth templates fuera de Site (si aplica)

---

## D. Routing, redirects, SEO técnico

Detalle: [anexos/routing-seo-producto.md](./anexos/routing-seo-producto.md) · datos: [anexos/fxstreet-es-pages.csv](./anexos/fxstreet-es-pages.csv)

- [x] Path calendario ES `/calendario-economico`
- [x] Pages ES: `event/[slug]`, `[slug]` país, fed/hours/world-interest (reexport)
- [x] 301 `/economic-calendar` (+ `/event/*`) → `/calendario-economico` en deploy ES
- [x] Redirects legacy ES: educacion, mexico→usdmxn, bonds, jobs, advertising, organismos, brokers-forex, events/strategy, tabla-tipos-interes
- [x] Macro/fed redirects locale-aware hacia hub calendario
- [ ] Redirects landings SEO brokers en raíz (CSV `4_*` restantes) si aún aplican
- [ ] Posts legacy en raíz → vertical correcta
- [ ] Sitemap ES verificado
- [~] CSV: cerradas filas técnicas `1_*` calendario event; `2_*` EN-only siguen `[D]`

---

## E. Decisiones de producto `[D]` (NO abrir en ES — se mantienen EN-only)

- [D] Press releases — **sigue `notFound` si no EN**; quitado del nav ES
- [D] Crypto industry-news — EN only
- [D] Home modules EN-only (More news, In-deep analysis, Best brokers yearly)
- [D] Newsletter en ES
- [D] Herramientas calendario speech tracker / notif (EN only)
- [D] Hub `/mexico` — redirect temporal a `/currencies/usdmxn` (no recrear hub)
- [D] Curso `/education/curso-forex/*` (recrear vs aplanar)
- [D] `/live-video/*`
- [D] Hreflang: ¿todas las páginas clave o solo brokers/best?

---

## F. QA de aceptación ES

- [ ] Home + nav + footer + language switcher
- [ ] Calendario + evento + market hours / fed / world rates
- [ ] News / analysis / education / crypto flows
- [ ] Brokers / best / reviews / cashback
- [ ] Rates charts / forecast / indicators
- [ ] Search
- [ ] Account + profile + premium
- [ ] Legal `/info/*`
- [ ] 404 / 500
- [ ] RSS
- [ ] Mobile + desktop
- [ ] Regresión: no romper EN deploy

---

## G. Plantilla rápida — nuevo idioma `xx`

Copiar y rellenar:

1. [ ] Dominio + DNS + gateway `site-gateway-xx` + CDN `site/xx`
2. [ ] Fila deploy matrix (qa + pro)
3. [ ] `NEXT_PUBLIC_LOCALE=xx` + `Languages.xx` en gateway
4. [ ] Extender `SiteLocale`, language selector, nav `navigation-data-xx.ts`
5. [ ] `messages/**/*.{xx}.json` (hermano de cada `.en.json`) + componentes `*.xx.json` + `rss-feed.xx.json`
6. [ ] Paths localizados (solo si producto) + App Router pages
7. [ ] Feature gates: qué hereda de EN-only
8. [ ] CMS/Algolia/sitemaps cultura `xx`
9. [ ] Redirects + crawl CSV del TLD
10. [ ] Revisión traductor nativo + QA F

---

## Orden de trabajo recomendado (ES)

1. Cerrar **decisiones `[D]`** que afecten nav y scope.
2. Completar **paridad de keys/ficheros** (A1) para no mostrar EN mezclado.
3. **Revisión humana** por prioridad (A2), empezando por legal/SEO.
4. **CMS + Algolia + sitemaps** (C) en paralelo con ingeniería de redirects (D).
5. **QA F** en QA → PRO.
6. Congelar este checklist como plantilla para el siguiente idioma.
