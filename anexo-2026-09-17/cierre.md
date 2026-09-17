# Anexo de cierre de sesión — 17/09/2026

Complementa el [README.md](../README.md) y [TECNICO.md](../TECNICO.md). **No sustituye** las instrucciones de Traducciones ni los lotes 01–07.

La **guía reutilizable** (producto + Site + gateway + SEO + ops) está en [TECNICO.md](../TECNICO.md), no en el repo Site.

---

## Repo Site

- Rama `oriol/es-routing-and-nav`.
- Merge local de `origin/master` (`8670adaa`). **Sin push.** No hay marcadores de conflicto en código.
- De master se conservó: UserToken (injector sin `userId`), highlights estáticos, robots por config, **ES** `/brokers/best` y `/brokers/best/countries` → `/brokers`.
- De la rama se conservó: calendario con path canónico ES + rewrite, gates EN-only, rewrites en `next.config.mjs`.
- WIP sin commitear: guía calendario, about-us, key-technicals null-safe, redirects SEO de esta sesión.

### Redirects ES añadidos (solo slugs verificados)

Criterio SEO (Aitor): 301 si la URL rota tiene **paralela funcional** (HTTP dest 2xx). Comprobación: [09-http-check-moved-urls.csv](./09-http-check-moved-urls.csv).

| Origen (404 live) | Destino | Notas |
|-------------------|---------|--------|
| `/{26 landings-bróker en raíz}` | `/brokers/best/{slug}` | Destino 200 en **legacy**. Muchos **404 en QA** (CMS). |
| `/educacion` | `/education` | QA 200 |
| `/company/xtb` | `/brokers/xtb` | Listing, no review |
| `/economic-calendar/event/nfp` | `/macroeconomics/economic-indicator/nfp` | Único evento corto con dest vivo |
| Artículo en raíz `pronostico-del-precio-…-202607130702` | `/news/…` | Dest 200 live; 404 QA |

**No** redirigidos (origen y destino 404): resto de `/economic-calendar/event/{slug-corto}`, unidades `/educacion/curso-forex/…`.

**No** es conflicto con master: el 301 del **hub** `/brokers/best` → `/brokers` (solo locale `es`) no come los showcases `/brokers/best/{slug}`.

---

## Gateway / contenidos

Pedido ya hecho: endpoints sin cultura `es` **generan** contenido. Site no inventa artículos.

QA Next (`qa-s-oriol.fxstreet.com`): plantillas sí; muchas fichas/showcases 404 = hueco CMS, no i18n.

---

## Scraper

`web-scraper-toolkit` (local, no necesariamente commiteado):

- Inventario = solo HTTP **2xx**. Enlaces muertos → `*.broken.csv` + `found_on` (página que los enlazaba).
- Comando `compare-origins --legacy --processed` para TLD legado vs Next.

El CSV histórico `fxstreet-es-pages.csv` **mezcla enlaces rotos**. No usarlo como lista de páginas existentes.

---

## Qué queda (no es front de copy)

| Dueño | Pendiente |
|-------|-----------|
| Traducciones / SEO / Legal | Lotes 01–07 humanos |
| Gateway + Contenidos | CultureName `es` + Algolia + sitemaps |
| Ops | DNS/CDN smoke qa.fxstreet.es / pro |
| SEO + Data + Mkt + CNT | Grupo B README (live-video, mexico, curso-forex, …) |
| Negocio | P15 excepciones EN-only (reviews/showcases) |
| Eng | Reintegrar Sheets; QA lote 08; empty states; no-EN-fallback; merge WIP; **regresión EN** |

---

## Convención de carpetas (hoy)

- `README.md` + `csv/01`–`06` = trabajo PO. **No pisar.**
- `TECNICO.md` = guía viva (sí se sobrescribe).
- Updates de cada jornada → `anexo-YYYY-MM-DD/` (esta carpeta = 17/09).

---

## Para el siguiente idioma

1. Seguir [TECNICO.md](../TECNICO.md) (fases 0–7 y lecciones).
2. No reutilizar las Sheets de ES.
3. Repetir: crawl 2xx + HTTP antes de 301 + gateway por cultura + menú oculto si no hay editorial.
