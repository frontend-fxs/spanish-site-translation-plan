# Lanzamiento Site español (FXStreet.es)

| | |
|--|--|
| **Para** | Product Owner |
| **Estado** | Pendiente de decisiones + revisión de CSV |
| **Ingeniería** | [tecnico/](./tecnico/INFORME-tecnico.md) (detalle técnico; no hace falta para gestionar traducciones) |

**En una frase:** se puede lanzar `fxstreet.es` cuando cierres el alcance (qué va en ES), un humano revise los CSV de UI, y CMS tenga contenido en las verticales “Sí ES”. El español de interfaz es **borrador IA** → hay que revisarlo.

**Cómo usar los CSV:** abre el enlace → GitHub **Download raw file** → rellena columna **Español (revisado)** y **Estado = Revisado** → sube el mismo archivo al repo. Columnas: Carpeta · Bloque · Clave · Inglés · Español borrador · Español revisado · Estado · Comentarios. No borres **Clave**.

**Etiquetas / markup:** no borres ni alteres etiquetas del tipo `<link>…</link>`, `<b>…</b>`, `{nombre}` u otras marcas entre `<…>` o `{…}`. Traduce solo el texto visible. Ejemplo: `<link>Código Ético</link>` → `<link>Código Ético</link>` (o el equivalente traducido **dentro** de las mismas etiquetas: `<link>Ethical Code</link>` → `<link>Código Ético</link>`).

Los CSV son **solo UI** (menús, botones, SEO de plantilla, legales estáticos…). **No** incluyen artículos CMS, fichas de brókers/autores ni eventos del calendario.

---

## 1. Decisiones (marca Sí ES / Solo EN / Más adelante)

### Páginas

| ID | Sección | Propuesta | Nota |
|----|---------|-----------|------|
| P1 | Home | **Sí ES** | Sin bloques solo-EN (P13) |
| P2 | Noticias | **Sí ES** | Cuerpo = CMS |
| P3 | Análisis | **Sí ES** | CMS |
| P4 | Educación | **Sí ES** | Curso multi-unidad = P16 |
| P5 | Cripto | **Sí ES** | |
| P6 | Brókers | **Sí ES** | |
| P7 | Tipos y gráficos | **Sí ES** | |
| P8 | Calendario económico | **Sí ES** | URL ES: `/calendario-economico` |
| P9 | Topics (commodities / equities / FX) | **Sí ES** | |
| P10 | Press releases | **Solo EN** | Fuera del menú ES |
| P11 | Crypto industry news | **Solo EN** | |
| P12 | Newsletter web | **Solo EN / más adelante** | |
| P13 | Home: More news / In-deep / Best brokers yearly | **Solo EN** | |
| P14 | Calendario: voz / alertas avanzadas | **Solo EN** | |
| P15 | Hub México | **Redirect USD/MXN** o hub propio | Propuesta: redirect |
| P16 | Curso Forex estructurado | **Más adelante** o artículos educación | |
| P17 | Live video | **Más adelante** | |
| P18 | Cuenta / premium / perfil | **Sí ES** | |
| P19 | Legal e info | **Sí ES** | Prioridad 1 revisión |
| P20 | Búsqueda y RSS | **Sí ES** | Búsqueda ≈ índice ES |

### Otras

| ID | Pregunta | Propuesta |
|----|----------|-----------|
| D-A | ¿Publicar si falta CMS en una vertical? | Ocultar del menú |
| D-B | ¿Quién firma legal? | Traductor + legal (lote 01) |
| D-C | ¿Quién revisa SEO titles? | Traducción + SEO (lote 02) |
| D-D | ¿Hreflang al lanzar? | Mínimo (home + brókers) |
| D-E | ¿Landings SEO brókers antiguas? | Redirect cuando haya destino |
| D-F | ¿Variante de español? | Definir antes del lote 01 (ES / LatAm / neutro) |

| Tus decisiones | Fecha |
|----------------|-------|
| P1–P20 → | |
| D-A…D-F → | |

---

## 2. Lotes de revisión (CSV)

Tipo: **REVISAR** borrador IA. Mínimo go-live producto: lotes **01–04**.

| Lote | Qué | Prioridad | CSV | Depende de |
|------|-----|-----------|-----|------------|
| 01 | Legal y políticas | Alta | [csv/01-legal.csv](./csv/01-legal.csv) | P19, D-B, D-F |
| 02 | SEO, navegación, errores, menú | Alta | [csv/02-seo-navegacion.csv](./csv/02-seo-navegacion.csv) | P10–P17, D-C, D-F |
| 03 | Cuenta y premium | Alta | [csv/03-cuenta-premium.csv](./csv/03-cuenta-premium.csv) | P18, D-F |
| 04 | Calendario, rates, brókers | Alta | [csv/04-calendario-rates-brokers.csv](./csv/04-calendario-rates-brokers.csv) | P6–P8, D-F |
| 05 | Resto verticales + home | Media | [csv/05-resto-verticales.csv](./csv/05-resto-verticales.csv) | P1–P5, P9, P13, D-F |
| 06 | RSS | Media | [csv/06-rss.csv](./csv/06-rss.csv) | P20, D-F |

Flujo por lote: cerrar decisiones → descargar CSV → encargar revisión → subir CSV revisado → avisar ingeniería.

| Seguimiento | 01 | 02 | 03 | 04 | 05 | 06 |
|-------------|----|----|----|----|----|----|
| Encargado | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| CSV revisado en repo | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Validado PO/legal | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Reintegrado (eng) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## 3. Listo para lanzar (producto)

- [ ] Decisiones P/D cerradas o aparcadas  
- [ ] Lotes 01–04 revisados y reintegrados  
- [ ] Menú ES sin enlaces a solo-EN  
- [ ] CMS OK en verticales “Sí ES”  
- [ ] QA humo ES con ingeniería  

| Aprobación PO | Nombre | ☐ Aprobado / ☐ Con cambios / ☐ Rechazado | Fecha |
|---------------|--------|------------------------------------------|-------|
| | | | |

---

*Detalle técnico (rama Site, gates EN-only, checklist deploy): [tecnico/INFORME-tecnico.md](./tecnico/INFORME-tecnico.md).*
