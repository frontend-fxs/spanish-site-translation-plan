# Anexo — CMS, gateway y contenido

Complementa el [informe técnico](../INFORME-tecnico.md). Sin este bloque el Site ES puede verse traducido en menús pero vacío o en inglés en el cuerpo.

## 1. Puente cultura ↔ CMS

| Concepto | Dónde | Requisito go-live |
|----------|-------|-------------------|
| `Languages[locale] → languageId` | Config gateway | `Languages.es` presente y GUID correcto |
| APIs por locale | `site-gateway-es*` | Mismo contrato que EN |
| Filtro `CultureName` | Posts, feeds, eventos | Contenido indexado `es` |
| Preferencias usuario | languageId config | Profile/alerts en ES |

## 2. Contenido a asegurar en cultura ES

Volúmenes orientativos (scrap): ver [fxstreet-es-pages.csv](./fxstreet-es-pages.csv).

| Familia | Prioridad | Notas |
|---------|-----------|-------|
| Home, news, analysis, education | Alta | Bloqueante editorial |
| Brokers / best / reviews | Alta | |
| Rates / calendar | Alta | |
| Companies (~279), authors (~69) | Alta volumen | |
| Crypto, commodities, equities, macro | Media | |
| Legal `/info/*` | Alta | Parte en JSON UI (revisión humana) |
| Press releases / live-video / curso-forex / mexico hub | Fuera o D* | Ver informe §4–6 |

## 3. Algolia

- Filtro / índice por `CultureName: es`.
- QA `/search` en deploy ES: solo resultados ES.

## 4. Sitemaps y SEO de contenido

- Gateway ES sirve sitemaps; middleware reescribe a API locale.
- Canonical dominio `.es`.
- Política hreflang: decisión D8 del informe.

## 5. RSS

- Copy UI: keys education ya en `rss-feed.es.json` (revisión humana pendiente).
- Ítems del feed filtrados por cultura ES.

## 6. Fuera del repo Site

Emails transaccionales, newsletter templates, workflows CMS, partners (Propinder).
