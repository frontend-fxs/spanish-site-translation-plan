# Adjuntos para encargar traducciones

Archivos **CSV** (UTF-8). En GitHub: abre el enlace → **Download raw file**.

Cada lote es una subcarpeta. Dentro:

- `_TODAS_LAS_CARPETAS.csv` → todo el lote (fácil de adjuntar al traductor).
- Un CSV por carpeta (`seo.csv`, `layout.csv`, …).
- `LEEME.txt` → instrucciones del lote.

| Lote | Carpeta | Prioridad | CSV completo |
|------|---------|-----------|--------------|
| 01 | [01-legal/](./01-legal/) | Alta | [01-legal/_TODAS_LAS_CARPETAS.csv](./01-legal/_TODAS_LAS_CARPETAS.csv) |
| 02 | [02-seo-navegacion/](./02-seo-navegacion/) | Alta | [02-seo-navegacion/_TODAS_LAS_CARPETAS.csv](./02-seo-navegacion/_TODAS_LAS_CARPETAS.csv) |
| 03 | [03-cuenta-premium/](./03-cuenta-premium/) | Alta | [03-cuenta-premium/_TODAS_LAS_CARPETAS.csv](./03-cuenta-premium/_TODAS_LAS_CARPETAS.csv) |
| 04 | [04-calendario-rates-brokers/](./04-calendario-rates-brokers/) | Alta | [04-calendario-rates-brokers/_TODAS_LAS_CARPETAS.csv](./04-calendario-rates-brokers/_TODAS_LAS_CARPETAS.csv) |
| 05 | [05-resto-verticales/](./05-resto-verticales/) | Media | [05-resto-verticales/_TODAS_LAS_CARPETAS.csv](./05-resto-verticales/_TODAS_LAS_CARPETAS.csv) |
| 06 | [06-rss/](./06-rss/) | Media | [06-rss/_TODAS_LAS_CARPETAS.csv](./06-rss/_TODAS_LAS_CARPETAS.csv) |

También: [indice_lotes.csv](./indice_lotes.csv) · [ordenes/](../ordenes/) · [INFORME-product-owner.md](../INFORME-product-owner.md) · [00-EMPIEZA-AQUI.md](../00-EMPIEZA-AQUI.md)

## Columnas

| Columna | Uso |
|---------|-----|
| Carpeta | Área (p. ej. `seo`, `componentes/account`) |
| Bloque | Pantalla o módulo |
| Clave | Identificador (no borrar) |
| Inglés (original) | Referencia — no modificar |
| Español (borrador IA) | Propuesta automática |
| Español (revisado) | **Texto final** |
| Estado | Pendiente / Revisado / Duda |
| Comentarios | Dudas |

## Cómo encargar

1. Descarga el CSV del lote (o por carpeta) desde GitHub.  
2. Indica variante de español (España / LatAm / neutro).  
3. Pide devolver el CSV con «Español (revisado)» y Estado = Revisado.  
4. Sube el archivo revisado a la **misma ruta** en el repo (commit/PR).  
5. Avisa a ingeniería para reintegrar.
