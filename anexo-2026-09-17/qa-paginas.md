# Anexo QA — páginas en español — 17/09/2026

Este anexo complementa el [README.md](../README.md) y los anexos del [16/09](../anexo-2026-09-16/instrucciones.md). **No sustituye ni modifica** esos documentos ni las hojas `01`–`07`.

Entrega para QA / PO: listado de **plantillas Next** del Site que **ya responden en español** (no están gated a inglés). El CSV está en [08-anexo-qa-paginas-es-2026-09-17.csv](./08-anexo-qa-paginas-es-2026-09-17.csv).

---

## Cómo usarlo

1. Abrir cada **URL QA** del CSV (`https://qa-es-site-oriol.fxstreet.com/…`).
2. Comprobar que la plantilla carga, el chrome (menú / pie) está en español y el path canónico es el de la columna `Path canónico ES`.
3. En filas **dinámicas**, usar un slug vivo del CMS ES; la fila es la plantilla, no un artículo concreto.
4. El copy de interfaz sigue siendo **borrador IA** (lotes 01–07). Este CSV no pide re-revisar traducciones; pide QA de **página / routing / locale**.

Entorno de referencia: **QA** `https://qa-es-site-oriol.fxstreet.com/` (`NEXT_PUBLIC_LOCALE=es`). El host anterior `qa-s-oriol.fxstreet.com` ya no aplica. Producción `https://www.fxstreet.es` usa las mismas rutas cuando ese deploy esté en el Site Next.

---

## Calendario (única familia con path localizado)

Canónico ES: `/calendario-economico` y subpaths (slugs **sin** traducir).

`/economic-calendar` y `/economic-calendar/…` **también responden en español, sin redirect**. El CSV lista el canónico; la columna `Alias EN (mismo template)` recuerda el path inglés equivalente para una segunda pasada.

---

## Fuera de este listado (no QA en ES)

Estas rutas **existen en código** pero en español deben dar **404** (`notFound` por locale). No las incluimos en el CSV.

| Path | Motivo |
|------|--------|
| `/press-releases` y `/press-releases/[slug]` | Solo inglés |
| `/cryptocurrencies/industry-news` | Solo inglés |
| `/t/500` | Página de prueba de error, no producto |

Bloques de home que no se renderizan en ES (More news, In-deep, Best brokers yearly, newsletter, voz/alertas avanzadas del calendario): no son páginas; en QA de **Inicio** comprobar que **no** aparecen.

No hay plantilla Next para `/bonds`, `/info/jobs` ni `/technical-analysis/…`. No las listamos como QA-ready.

---

## Notas de menú

Algunas plantillas **sí cargan** en ES pero **no están en el megamenú ES** (`best_brokers`, `prop-firms`, `press_releases`, Trade now). Van en el CSV con nota; hay que entrar por URL.

---

## Contenido editorial

Las plantillas de listado / ficha (`/news`, `/analysis/[slug]`, brókers, etc.) dependen del gateway ES. Si una ficha concreta no tiene contenido, no es un fallo de i18n: anotar slug y seguir con otra.
