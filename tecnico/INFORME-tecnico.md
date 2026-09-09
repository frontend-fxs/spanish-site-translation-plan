# Informe técnico — Lanzamiento Site español (FXStreet.es)

| Campo | Valor |
|-------|--------|
| **Documento** | Informe técnico de ingeniería |
| **Audiencia** | Engineering / Tech lead |
| **Versión** | 1.1 |
| **Fecha** | 9 de septiembre de 2026 |
| **Rama Site** | `chore/modular-messages-i18n` |
| **Informe producto** | [../producto/INFORME-product-owner.md](../producto/INFORME-product-owner.md) |

---

## 1. Resumen

Preparación del Site (Next.js, un locale por deploy) para go-live en `fxstreet.es` cuando el PO cierre alcance de páginas y la revisión humana del copy esté hecha.

### Estado ingeniería

| Área | Estado |
|------|--------|
| i18n modular `messages/{module}/{Namespace}.{locale}.json` | Hecho |
| Paridad keys EN↔ES (UI) | Hecho (copy = borrador IA) |
| Calendario ES `/calendario-economico/...` + redirects | Hecho |
| Nav ES sin press-releases; legacy URLs saneadas | Hecho |
| Inventario URLs por patrones (crawl) | Validado 2026-09-09 |
| Abrir gates EN-only | **No** (salvo orden PO) |
| CMS / Algolia / sitemaps cultura `es` | Fuera de este repo; bloqueante ops |

---

## 2. Decisiones de producto (referencia)

Las decide el PO en el [informe de producto §3](../producto/INFORME-product-owner.md). Mapeo técnico:

| PO | Código / comportamiento actual |
|----|--------------------------------|
| P10 Press releases | `locale !== 'en'` → `notFound` |
| P11 Industry-news | Idem |
| P12 Newsletter | Condicionales locale EN |
| P13 Home modules | `show-component-service` EN only |
| P14 Calendar speech/notif | EN only |
| P15 México | Redirect → `/currencies/usdmxn` |
| P16 Curso forex | Sin parity multi-unidad |
| P17 Live video | Sin vertical Next |

**Ingeniería no abre estas superficies sin cambio explícito del PO.**

---

## 3. Arquitectura relevante

- Deploy: `NEXT_PUBLIC_LOCALE=es`, gateway `site-gateway-es*`, CDN `site/es`.
- Mensajes: base modular + `packages/ui/.../*.es.json` + `rss-feed.es.json`.
- Paths localizados: `CALENDAR_BASE_PATH.es = /calendario-economico`.

Detalle: [anexos/](./anexos/), [CHECKLIST.md](./CHECKLIST.md).

---

## 4. Inventario de superficies

Fuente corta validada: [anexos/inventario-superficies-validadas.md](./anexos/inventario-superficies-validadas.md).  
Crawl: [crawl/fxstreet-es-live.csv](./crawl/fxstreet-es-live.csv) (67 URLs, slugs filtrados).

---

## 5. Checklist, anexos y reintegración de CSV PO

Los lotes de producto son CSV en `../producto/adjuntos/<lote>/` (sin paths JSON para el PO).  
Por lote: `_TODAS_LAS_CARPETAS.csv` + un CSV por carpeta.  
Para regenerarlos: `python tecnico/scripts/generar_adjuntos_csv.py` (desde la raíz del plan).

Reintegración: mapear filas por `Carpeta` + `Bloque` + `Clave` → diccionarios `.es.json` / menú ES; usar columna **Español (revisado)** (si vacía y Estado=Revisado, aceptar borrador).

| Doc | Uso |
|-----|-----|
| [CHECKLIST.md](./CHECKLIST.md) | Ejecución / estado vivo |
| [anexos/inventario-diccionarios.md](./anexos/inventario-diccionarios.md) | Ficheros i18n |
| [anexos/configuracion-infra.md](./anexos/configuracion-infra.md) | Env / deploy |
| [anexos/cms-y-contenido.md](./anexos/cms-y-contenido.md) | CMS / Algolia |
| [anexos/routing-seo-producto.md](./anexos/routing-seo-producto.md) | Routing / SEO |
| [anexos/fxstreet-es-pages.csv](./anexos/fxstreet-es-pages.csv) | Histórico scrape |

---

## 6. Criterios go-live técnicos

1. Lotes PO 01–04 integrados en rama.  
2. Smoke QA `qa.fxstreet.es` (o equivalente).  
3. Gateway `Languages.es` + contenido/Algolia según verticales “Sí ES”.  
4. Regresión EN OK.  
5. Sin enlaces a superficies gated EN.

---

## 7. Aprobación técnica

| Rol | Nombre | Decisión | Fecha |
|-----|--------|----------|-------|
| Engineering | | ☐ Aprobado ☐ Con cambios ☐ Rechazado | |
