# Anexo — Routing, SEO y producto (ES)

Complementa el [informe técnico](../INFORME-tecnico.md), el [informe PO](../../producto/INFORME-product-owner.md) y el CSV [fxstreet-es-pages.csv](./fxstreet-es-pages.csv).

## 1. Modelo de URLs

- Mismo path en EN y ES **salvo calendario**.
- Dominio distingue el idioma (`fxstreet.es` vs `fxstreet.com`).
- Language switcher = redirect absoluto a otro TLD.

| Locale | Calendar base |
|--------|---------------|
| en | `/economic-calendar` |
| es | `/calendario-economico` |

**Estado (sept 2026):** existen pages ES bajo `/calendario-economico` (hub, `event/[slug]`, país `[slug]`, fed / market-hours / world-interest-rates). En deploy ES: 301 de `/economic-calendar` y `/economic-calendar/event/*` hacia path ES.

## 2. Gates de producto (código) — no abrir en este lanzamiento

| Superficie | Comportamiento | Estado plan |
|------------|----------------|-------------|
| Press releases | `locale !== 'en'` → `notFound()` | EN-only; fuera del menú ES |
| Crypto industry-news | EN only | EN-only |
| More news / In-deep / Best brokers yearly | EN only | EN-only |
| Newsletter signup / trending chip | EN only | EN-only |
| Calendar speech tracker / notif | EN only | EN-only |
| `/calendario-economico` | ES only | OK |

Fuente: `packages/lib/server-only/services/show-component-service.ts` y pages con `notFound` por locale.

## 3. Legacy / sin parity Next — decisiones del informe (D5–D7)

| Tema | Tratamiento propuesto en informe |
|------|----------------------------------|
| `/mexico` | Redirect → `/currencies/usdmxn` (implementado) |
| `/education/curso-forex/*` | Aplazar; no prometer en nav |
| `/live-video/*` | No migrar / redirect a definir |
| `/technical-analysis/*` | Redirect EN a indicators; nav ES apunta a `/rates-charts/indicators` |
| `/educacion/*` | Redirect → `/education` (implementado) |
| `/bonds`, jobs, organismos, etc. | Redirects legacy ES (implementados) |

Pendiente según CSV: landings SEO brokers en raíz, posts legacy en raíz con timestamp.

## 4. Navegación ES

Archivo: `navigation-data-es.ts`.

Hecho: sin press-releases; gold/oil/commodities; usdmxn; calendario tools en `/calendario-economico/...`.

Pendiente: revisión humana de labels; alinear educación/curso con D6.

## 5. SEO

- Canonical/OG dominio `.es` en deploy ES.
- `Seo.*` en `messages/seo/` — revisión humana pendiente.
- Hreflang: selectivo hoy; decisión D8 del informe.

## 6. QA mínimo

Ver el informe de producto (decisiones de páginas) y la sección F de [../CHECKLIST.md](../CHECKLIST.md).
