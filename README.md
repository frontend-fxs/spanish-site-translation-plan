# FXStreet.es — Revisión de textos en español

Te agradecemos que nos ayudes a **revisar las hojas de cálculo de esta carpeta**. Contienen los textos de la web en español (menús, botones, avisos, páginas legales, etc.).

El español que encontrarás es un **borrador automático**. La idea es **releerlo con calma, ajustar lo que haga falta y marcarlo como revisado**. Cuando nos paséis el conjunto completo, lo aplicaremos en la web de una sola vez.

---

## Alcance (ya definido)

`fxstreet.es` será un **espejo del site en inglés**, con el mismo alcance de páginas y secciones, **excepto** las que el código deja solo en inglés. Esas **no se publican en español** y **no hace falta traducirlas**.

**Path localizado (única excepción de URL):** la herramienta del calendario usa `/calendario-economico`. El resto de páginas del calendario (p. ej. `/economic-calendar/world-interest-rates`) mantienen el path en inglés, como el resto del site.

| Incluido en español | Fuera de alcance (solo inglés / no traducir) |
|---------------------|-----------------------------------------------|
| Inicio, noticias, análisis, educación, cripto | Press releases |
| Brókers, tipos y gráficos, calendario | Crypto industry news |
| Temas (materias primas, acciones, divisas…) | Newsletter en la web |
| Cuenta, premium, perfil | Bloques del inicio: More news, In-deep, Best brokers yearly |
| Legal e información | Voz / alertas avanzadas del calendario |
| Búsqueda y RSS | |

Si falta contenido editorial en una sección incluida, **se oculta del menú** hasta que Contenidos la tenga lista.

Criterio de **migración de URLs** (provisional, 15/09/2026) y la primera limpieza de URLs ES: ver [§ Migración EN↔ES](#migración-enes-criterio-provisional).

---

## Quién revisa qué

Te pedimos **encargar** cada tipo de texto al equipo adecuado:

| Tipo de texto | Quién lo revisa |
|---------------|-----------------|
| Traducción y tono (casi todas las hojas) | **Traducciones** |
| Títulos y descripciones SEO de plantilla (sobre todo lote 02) | **SEO** |
| Legal y políticas (lote 01) | **Traducciones**, con validación de **Legal** |

---

## Pasos sugeridos

1. En **esta carpeta**, abre la hoja del lote que corresponda (por ejemplo `01-legal`).
2. Compara el **inglés** con el **español (borrador)**.
3. Anota la versión final en **Español (revisado)**.  
   - Si el borrador es correcto, puede copiarse ahí tal cual.
4. Cuando la fila esté bien, cambia **Estado** a **Revisado**.
5. Si hay dudas, déjalas en **Comentarios**.
6. Cuando estén listos **todos** los lotes que vayáis a entregar, **avísanos** y los publicaremos juntos en la web.

---

## Columnas de la hoja

| Columna | Para qué sirve | ¿Conviene editarla? |
|--------|----------------|---------------------|
| Inglés (original) | Texto de referencia | Mejor dejarla igual |
| Español (borrador) | Propuesta automática | Solo para consultar |
| **Español (revisado)** | **Texto final** | **Sí, aquí** |
| **Estado** | Pendiente → **Revisado** | **Sí** |
| Comentarios | Notas o dudas | Sí, si hace falta |
| Otras (Carpeta, Bloque, Clave…) | Orientación interna | Por favor, no las modifiques ni las borres |

Si aparecen marcas como `<link>…</link>`, `<b>…</b>` o `{nombre}`, te pedimos **dejarlas** y traducir solo las palabras.  
Ejemplo: `<link>Ethical Code</link>` → `<link>Código Ético</link>`.

Conviene no insertar ni borrar columnas, ni fusionar celdas. Filtrar u ordenar no hay problema.

Estas hojas cubren textos de **interfaz**. Los artículos y las fichas de brókers los gestiona **Contenidos** por otro canal.

---

## Variante de español

Antes de empezar el lote 01, **Traducciones** define la variante (España, LatAm o neutro) y se aplica de forma coherente en todos los lotes.

---

## Última actualización del borrador (10/09/2026)

Antes de pasaros las hojas hemos hecho una revisión automática del borrador español y hemos corregido lo siguiente. Si ya habíais abierto una versión anterior, **estas filas han cambiado** y conviene releerlas.

| Qué pasaba | Dónde | Lote |
|------------|-------|------|
| Los acentos se habían perdido al guardar el fichero y salían como `?` (`?nete a FXStreet Cashback`, `Tama?o medio de la posici?n`, `Pron?stico`). Los hemos reescrito | Widget de cashback, tarjeta de pronóstico | 04, 05 |
| Los acentos salían con caracteres extraños (`reuniÃ³n`, `Â¿QuÃ©`). Corregidos en 372 textos | Fichas de bancos centrales | 05 |
| El borrador seguía en inglés | Título de la página de gráficos, descripción y palabras clave SEO del Fed Sentiment Index, «Dollar Index» y «Trade Now» del menú | 02, 04 |
| Faltaba un texto de accesibilidad que la web leía en bruto | Botón de información de «Verificado en condiciones reales» en las reseñas de brókers | 04 |

Son correcciones del **borrador**, no decisiones de estilo: si preferís otra redacción, cambiadla con normalidad en **Español (revisado)**.

---

## Hojas de cálculo (lotes)

Están en esta carpeta. Prioridad **alta** primero; para el lanzamiento hacen falta al menos los lotes **01 a 04**.

| Lote | Contenido | Prioridad | Nombre de la hoja | Encargo |
|------|-----------|-----------|-------------------|---------|
| 01 | Legal y políticas | Alta | `01-legal` | Traducciones + Legal |
| 02 | Menú, cabecera, errores y SEO de plantilla | Alta | `02-chrome-navegacion` | Traducciones + SEO (textos SEO) |
| 03 | Cuenta y premium | Alta | `03-cuenta-premium` | Traducciones |
| 04 | Calendario, gráficos y brókers | Alta | `04-calendario-rates-brokers` | Traducciones |
| 05 | Resto de secciones e inicio | Media | `05-resto-verticales` | Traducciones |
| 06 | RSS | Media | `06-rss` | Traducciones |

Además: `mapeado-paginas.xlsx` — mapa **EN URL | ES URL | page type | status** (direct match / EN only / ES only), con comprobación HTTP live (`exists EN/ES`) y resumen arriba. Tráfico 12m pendiente de Data. Regenerar: `python verify-and-rebuild-mapeado.py`.

| Seguimiento | 01 | 02 | 03 | 04 | 05 | 06 |
|-------------|----|----|----|----|----|----|
| Quién lo revisa | | | | | | |
| Hoja terminada | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Validado | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

Cuando **todos** los lotes previstos estén listos y validados, nos lo pasáis **de una vez** y lo publicamos en la web de golpe (no lote a lote).

---

## Checklist de lanzamiento

- [ ] Los lotes previstos están revisados (Traducciones / SEO / Legal según corresponda) y nos los habéis pasado completos  
- [ ] El equipo los ha aplicado en la web de una sola vez  
- [ ] El menú en español no enlaza a secciones solo inglés  
- [ ] Las secciones incluidas tienen contenido, o están ocultas a propósito  
- [ ] Habéis hecho una pasada rápida de la web en español con el equipo  
- [ ] Criterio de migración EN↔ES cerrado (o excepciones EN-only acordadas)  
- [ ] URLs ES-only pendientes: dictamen SEO / Data / Mkt / Contenidos

| Aprobación | Nombre | Resultado | Fecha |
|------------|--------|-----------|-------|
| | | ☐ Aprobado · ☐ Con cambios · ☐ Rechazado | |

---

## Migración EN↔ES (criterio provisional)

Fuente: respuesta de producto **no definitiva** (15/09/2026) + mapa `csv/mapeado-paginas.xlsx`.

| Caso en el mapa | Acción provisional | Quién cierra |
|-----------------|--------------------|--------------|
| **direct match** | **Migrar** (espejo EN → ES) | Ingeniería / lanzamiento |
| **EN only** | **Migrar** salvo excepciones de negocio (p. ej. reviews, showcases, y lo ya gated solo EN: press, industry-news, etc.) | **Negocio / PO** (lista de excepciones) |
| **ES only** | **No migrar a ciegas** — analizar si tienen sentido | **SEO + Data + Mkt + Contenidos** |

Detalle del mapa y check HTTP: `csv/mapeado-paginas.xlsx` (regenerar con `python verify-and-rebuild-mapeado.py`). Tráfico 12 meses en filas EN/ES only: **pendiente de Data**.

### Primera limpieza — URLs ES

Tras el scrap + verificación live, se separaron dos grupos.

#### A. Fuera del backlog ES-only (vienen con el espejo EN / Next)

Rutas que en el mapa apuntaban a `fxstreet.es` pero **hoy no viven en Sitefinity ES** (404 live). No requieren dictamen SEO como “página española actual”: al migrar el match EN (o la página Next) aparecerán en ES si entran en alcance.

| URL ES (limpia / no analizar como legado ES) |
|-----------------------------------------------|
| `https://www.fxstreet.es/account/premium-checkout` |
| `https://www.fxstreet.es/account/signup` |
| `https://www.fxstreet.es/brokers/cashback/not-available` |
| `https://www.fxstreet.es/commodities` |
| `https://www.fxstreet.es/economic-calendar/fed-sentiment-index` |
| `https://www.fxstreet.es/equities` |
| `https://www.fxstreet.es/info/advertising-model` |
| `https://www.fxstreet.es/info/cookie-policy` |
| `https://www.fxstreet.es/info/how-fxstreet-uses-ai` |
| `https://www.fxstreet.es/info/how-we-score-reviews` |
| `https://www.fxstreet.es/info/jobs` |
| `https://www.fxstreet.es/info/premium` |
| `https://www.fxstreet.es/info/premium-terms-and-conditions` |
| `https://www.fxstreet.es/info/privacy-policy` |
| `https://www.fxstreet.es/macroeconomics/trade-war` |

#### B. Pendiente análisis SEO / Data / Mkt / Contenidos (ES only / legado)

Estas **sí** hay que decidir (redirigir / no migrar / más adelante) con tráfico y sentido de negocio.

| URL o patrón ES | Notas |
|-----------------|-------|
| `https://www.fxstreet.es/live-video` | Vertical viva en ES; 404 en EN |
| `https://www.fxstreet.es/live-video/latest` | idem |
| `https://www.fxstreet.es/live-video/shows` | idem |
| `https://www.fxstreet.es/education/curso-forex` | Curso multi-unidad; no en Next |
| `https://www.fxstreet.es/mexico` | Hub ES-only |
| `https://www.fxstreet.es/rates-charts/chart/station` | Legado rates |
| `https://www.fxstreet.es/rates-charts/rates/majors` | Legado rates |
| `https://www.fxstreet.es/technical-analysis/support-resistance/pivot-points` | Legado TA |
| `https://www.fxstreet.es/brokers/brokers-forex` | Legado (404 live en check) |
| `https://www.fxstreet.es/brokers/organismos-reguladores` | Legado (404 live en check) |
| `https://www.fxstreet.es/fundamental/tabla-tipos-interes` | Legado (404 live en check) |
| `https://www.fxstreet.es/educacion/*` | Typo / path histórico |
| `https://www.fxstreet.es/education/curso-forex/*` | Unidades del curso |
| `https://www.fxstreet.es/rates-charts/[slug]/chart` | Patrón legado chart por activo |

| Dictamen (grupo B) | Equipo | Decisión | Fecha |
|--------------------|--------|----------|-------|
| | SEO / Data / Mkt / CNT | ☐ Redirigir · ☐ No migrar · ☐ Más adelante | |

#### C. Cerrado SEO — landings bróker en raíz (17/09/2026)

Dictamen Aitor (SEO): si una URL rota tiene **paralela funcional** en Next, **301**. Las ~26 landings `fxstreet.es/{slug}` (p. ej. `/beginners-brokers-australia`, `/beginners-brokers-bangladesh`) van a `/brokers/best/{slug}`. Código: `Site/redirects.ts` (`seoBrokerRootLandingRedirects`). Si el showcase no existe en CMS, `getBrokerBest` sigue a `/brokers` (404) o `/brokers/best` (410).

| Excepciones EN-only (no migrar a ES) | Negocio / PO | Fecha |
|-------------------------------------|--------------|-------|
| (reviews, showcases, … — por definir) | | |
