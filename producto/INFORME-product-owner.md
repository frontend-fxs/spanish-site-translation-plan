# Informe Product Owner — Lanzamiento español (FXStreet.es)

| Campo | Valor |
|-------|--------|
| **Documento** | Informe de producto / gestión de traducciones |
| **Audiencia** | Product Owner (no técnico) |
| **Versión** | 1.4 |
| **Fecha** | 9 de septiembre de 2026 |
| **Estado** | Pendiente de decisiones y lanzamiento de órdenes |
| **Entrada** | [00-EMPIEZA-AQUI.md](./00-EMPIEZA-AQUI.md) |
| **Ingeniería** (opcional) | [../tecnico/INFORME-tecnico.md](../tecnico/INFORME-tecnico.md) |

---

## 1. Para qué sirve este documento

Te permite:

1. **Decidir qué debe existir en español** y qué se queda solo en inglés.
2. **Encargar y seguir** la revisión del copy de la web.
3. **Descargar / adjuntar CSV** por lote (sin código).

- Adjuntos: [adjuntos/LEEME.md](./adjuntos/LEEME.md)
- Órdenes: [ordenes/](./ordenes/)

En GitHub los enlaces de este documento son clicables. Los CSV se descargan con **Download raw file**.

---

## 2. Resumen en una frase

La web en español (`fxstreet.es`) puede lanzarse cuando: (a) hayas **cerrado las decisiones de páginas**, (b) un traductor humano haya **revisado el texto** de los lotes prioritarios en los CSV, y (c) editorial/CMS tenga **contenido en español** en las secciones que sí quieras publicar.

Hoy el español de interfaz es **borrador hecho por IA**: hay que **revisarlo** en la columna «Español (revisado)» de cada CSV.

---

## 3. Decisiones que debes tomar (no técnicas)

Marca cada fila: **Sí ES** / **No (solo EN)** / **Más adelante**.

### 3.1 Páginas y secciones del producto

| ID | ¿Debe estar en español? | Qué es | Propuesta | Notas para ti |
|----|-------------------------|--------|-----------|---------------|
| **P1** | Home | Portada | **Sí ES** | Sin algunos bloques que hoy solo existen en EN (ver P10–P12) |
| **P2** | Noticias | Listado + artículos | **Sí ES** | Artículos = contenido CMS, no solo UI |
| **P3** | Análisis | Listado + artículos | **Sí ES** | Idem CMS |
| **P4** | Educación | Listado + artículos | **Sí ES** | El “curso forex” multi-unidad es otra decisión (P16) |
| **P5** | Cripto (hub + news) | | **Sí ES** | |
| **P6** | Brókers (listado, best, reviews) | | **Sí ES** | |
| **P7** | Tipos y gráficos | | **Sí ES** | |
| **P8** | Calendario económico | | **Sí ES** | En ES la URL canónica es `/calendario-economico` |
| **P9** | Materias primas / acciones / divisas (topics) | | **Sí ES** | |
| **P10** | Press releases (notas de prensa) | | **No (solo EN)** | Hoy bloqueadas en español; ya fuera del menú ES |
| **P11** | Crypto “industry news” | | **No (solo EN)** | |
| **P12** | Newsletter (captación en web) | | **No / más adelante** | Hoy solo EN |
| **P13** | Bloques home “More news / In-deep / Best brokers yearly” | | **No (solo EN)** | La home ES se publica sin esos módulos |
| **P14** | Herramientas avanzadas del calendario (voz / alertas) | | **No (solo EN)** | |
| **P15** | Hub México (`/mexico`) | | **Redirect a USD/MXN** (no hub propio) o recrear hub | Propuesta: redirect |
| **P16** | Curso Forex estructurado (`/education/curso-forex/...`) | | **Más adelante** o aplanar a artículos de educación | No existe igual en la web nueva |
| **P17** | Live video | | **No migrar / más adelante** | |
| **P18** | Cuenta usuario (login, registro, premium, perfil) | | **Sí ES** | Copy de formularios a revisar |
| **P19** | Legal / info (términos, privacidad, cookies…) | | **Sí ES** | **Prioridad 1** de revisión humana |
| **P20** | Búsqueda y RSS | | **Sí ES** | Búsqueda depende de índice en español |

### 3.2 Otras decisiones de producto

| ID | Pregunta | Opciones | Propuesta |
|----|----------|----------|-----------|
| **D-A** | ¿Publicamos ES aunque falte contenido CMS en alguna vertical? | Esperar contenido / publicar UI y aceptar listados vacíos / ocultar sección del menú | Ocultar del menú lo que no tenga contenido |
| **D-B** | ¿Quién firma el copy legal? | Traductor + legal interno | Legal revisa lote 01 |
| **D-C** | ¿SEO titles/descriptions los revisa SEO o solo traducción? | Traducción / SEO / ambos | Ambos en lote 02 |
| **D-D** | ¿Enlaces entre idiomas (hreflang) en todas las páginas clave? | Mínimo (home + brókers) / amplio | Mínimo al lanzar |
| **D-E** | Landings antiguas SEO de brókers en la raíz del dominio | Redirect a “mejores brókers” / no tocar aún | Redirect cuando exista destino |
| **D-F** | Variante de español para todos los lotes | España / LatAm / neutro internacional | Definir antes del lote 01 |

Espacio para tu decisión:

| ID | Tu decisión | Fecha |
|----|-------------|-------|
| P1–P20 | | |
| D-A | | |
| D-B | | |
| D-C | | |
| D-D | | |
| D-E | | |
| D-F | | |

---

## 4. Qué NO va en estos CSV

Los CSV cubren **textos de interfaz** (menús, botones, SEO de plantilla, legales estáticos, vacíos de listado, etc.).

No incluyen (van por CMS / editorial):

- Artículos de news / analysis / education / crypto  
- Fichas de brókers, companies, autores  
- Eventos del calendario (datos)

---

## 5. Órdenes de traducción / revisión

Tipo actual: **REVISAR** (ya hay borrador en la columna «Español (borrador IA)»).

| Lote | Nombre | Prioridad | Adjunto CSV | Orden |
|------|--------|-----------|-------------|-------|
| 01 | Legal y políticas | Alta | [adjuntos/01-legal/_TODAS_LAS_CARPETAS.csv](./adjuntos/01-legal/_TODAS_LAS_CARPETAS.csv) | [ordenes/01-legal.md](./ordenes/01-legal.md) |
| 02 | SEO + navegación + errores | Alta | [adjuntos/02-seo-navegacion/_TODAS_LAS_CARPETAS.csv](./adjuntos/02-seo-navegacion/_TODAS_LAS_CARPETAS.csv) | [ordenes/02-seo-navegacion.md](./ordenes/02-seo-navegacion.md) |
| 03 | Cuenta y premium | Alta | [adjuntos/03-cuenta-premium/_TODAS_LAS_CARPETAS.csv](./adjuntos/03-cuenta-premium/_TODAS_LAS_CARPETAS.csv) | [ordenes/03-cuenta-premium.md](./ordenes/03-cuenta-premium.md) |
| 04 | Calendario, rates, brókers | Alta | [adjuntos/04-calendario-rates-brokers/_TODAS_LAS_CARPETAS.csv](./adjuntos/04-calendario-rates-brokers/_TODAS_LAS_CARPETAS.csv) | [ordenes/04-calendario-rates-brokers.md](./ordenes/04-calendario-rates-brokers.md) |
| 05 | Resto de verticales / home | Media | [adjuntos/05-resto-verticales/_TODAS_LAS_CARPETAS.csv](./adjuntos/05-resto-verticales/_TODAS_LAS_CARPETAS.csv) | [ordenes/05-resto-verticales.md](./ordenes/05-resto-verticales.md) |
| 06 | RSS | Media | [adjuntos/06-rss/_TODAS_LAS_CARPETAS.csv](./adjuntos/06-rss/_TODAS_LAS_CARPETAS.csv) | [ordenes/06-rss.md](./ordenes/06-rss.md) |

Guía: [adjuntos/LEEME.md](./adjuntos/LEEME.md).  
También por carpeta, p. ej. [adjuntos/02-seo-navegacion/seo.csv](./adjuntos/02-seo-navegacion/seo.csv).

### Cómo lanzar una orden

1. Cierra (o aparca) las decisiones P/D que afecten al lote, incluida la variante de español (**D-F**).  
2. Descarga el CSV del lote desde el enlace de la tabla (GitHub → **Download raw file**).  
3. Indica: revisar borrador IA → rellenar «Español (revisado)» y Estado = Revisado.  
4. Sube el CSV revisado a la misma ruta del repo y avisa a ingeniería.  
5. Marca la orden como validada en la ficha de [ordenes/](./ordenes/).

---

## 6. Criterio de “listo para lanzar” (vista producto)

- [ ] Decisiones P1–P20 y D-A…D-F cerradas o aparcadas por escrito  
- [ ] Lotes 01–04 con CSV revisados y reintegrados  
- [ ] Menú ES no enlaza secciones “solo EN”  
- [ ] Editorial confirma contenido CMS en las verticales “Sí ES”  
- [ ] QA de humo en entorno de pruebas español (con ingeniería)

---

## 7. Aprobación Product Owner

| Rol | Nombre | Decisión | Fecha |
|-----|--------|----------|-------|
| Product Owner | | ☐ Aprobado ☐ Aprobado con cambios ☐ Rechazado | |

Comentarios / cambios:

-
-
