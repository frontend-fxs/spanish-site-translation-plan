# FXStreet.es — Revisión de textos en español

Te agradecemos que nos ayudes a **revisar las hojas de cálculo de esta carpeta**. Contienen los textos de la web en español (menús, botones, avisos, páginas legales, etc.).

El español que encontrarás es un **borrador automático**. La idea es **releerlo con calma, ajustar lo que haga falta y marcarlo como revisado**. Cuando nos paséis el conjunto completo, lo aplicaremos en la web de una sola vez.

---

## Alcance (ya definido)

`fxstreet.es` será un **espejo del site en inglés**, con el mismo alcance de páginas y secciones, **excepto** las que el código deja solo en inglés. Esas **no se publican en español** y **no hace falta traducirlas**.

| Incluido en español | Fuera de alcance (solo inglés / no traducir) |
|---------------------|-----------------------------------------------|
| Inicio, noticias, análisis, educación, cripto | Press releases |
| Brókers, tipos y gráficos, calendario | Crypto industry news |
| Temas (materias primas, acciones, divisas…) | Newsletter en la web |
| Cuenta, premium, perfil | Bloques del inicio: More news, In-deep, Best brokers yearly |
| Legal e información | Voz / alertas avanzadas del calendario |
| Búsqueda y RSS | |

Si falta contenido editorial en una sección incluida, **se oculta del menú** hasta que Contenidos la tenga lista.

Al contrastar el scrap de la web española actual (Sitefinity) con el Site Next, aparecen **páginas o familias de URL que no forman parte de ese espejo**. Os pedimos decisión en la sección final de este documento.

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
- [ ] Habéis decidido qué hacer con las páginas Sitefinity fuera del espejo (sección final)

| Aprobación | Nombre | Resultado | Fecha |
|------------|--------|-----------|-------|
| | | ☐ Aprobado · ☐ Con cambios · ☐ Rechazado | |

---

## Páginas de la web española actual fuera del espejo Next

Al revisar el **scrap de fxstreet.es (Sitefinity)** frente a las rutas del **Site Next** (espejo del inglés), estas familias **existen hoy en español** pero **no tienen equivalente** en el alcance definido arriba (o solo existen como legado / SEO antiguo).

Os pedimos indicar, para cada una, qué hacer al sustituir Sitefinity por Next:

- **Redirigir** a una URL concreta del nuevo site  
- **No migrar** (la URL dejará de existir o responderá 404)  
- **Más adelante** (fuera de este lanzamiento)

| # | Qué hay hoy en Sitefinity ES | Ejemplos / patrón | ¿Qué decidís? |
|---|------------------------------|-------------------|---------------|
| 1 | **Live video** (vertical completa) | `/live-video`, `/live-video/…` (~10 URLs únicas en el scrap) | ☐ Redirigir a: ________ · ☐ No migrar · ☐ Más adelante |
| 2 | **Curso Forex** estructurado (multi-unidad) | `/education/curso-forex/…` y legado `/educacion/…` | ☐ Redirigir a educación · ☐ No migrar · ☐ Más adelante |
| 3 | **Hub México** | `/mexico` | ☐ Redirigir a `/currencies/usdmxn` · ☐ Otra: ________ · ☐ No migrar · ☐ Más adelante |
| 4 | **Landings SEO de brókers en la raíz** | p. ej. `/beginners-brokers-australia`, `/hedging-brokers-…`, `/mt5-brokers-…` (~26 URLs) | ☐ Redirigir a `/brokers/best/…` si existe · ☐ No migrar · ☐ Más adelante |
| 5 | **Análisis técnico legado** | `/technical-analysis/…` (elliott, soporte/resistencia, etc.) | ☐ Redirigir a `/rates-charts/indicators` · ☐ No migrar · ☐ Más adelante |
| 6 | **Bonds** | `/bonds` | ☐ Redirigir a: ________ · ☐ No migrar · ☐ Más adelante |
| 7 | **Empleo** | `/info/jobs` | ☐ Redirigir a about-us / externo · ☐ No migrar · ☐ Más adelante |
| 8 | **Organismos reguladores** | `/brokers/organismos-reguladores` | ☐ Redirigir a `/brokers` · ☐ No migrar · ☐ Más adelante |
| 9 | **Events / strategy** | `/events/strategy` | ☐ Redirigir a: ________ · ☐ No migrar · ☐ Más adelante |
| 10 | **Tabla tipos de interés (legado)** | `/fundamental/tabla-tipos-interes` | ☐ Redirigir a `/economic-calendar/world-interest-rates` · ☐ No migrar · ☐ Más adelante |
| 11 | **Publicidad (URL antigua)** | `/info/advertising-and-sponsorship` | ☐ Redirigir a `/info/advertising-model` · ☐ No migrar · ☐ Más adelante |
| 12 | **Listado forex legado** | `/brokers/brokers-forex` | ☐ Redirigir a `/brokers` · ☐ No migrar · ☐ Más adelante |
| 13 | **Posts en la raíz** (sin vertical news/analysis) | p. ej. `/pronostico-del-precio-del-…-2026…` | ☐ Redirigir al vertical correcto · ☐ No migrar · ☐ Más adelante |
| 14 | **Eventos de calendario por GUID** | `/calendario-economico/event/{guid}` (en Next van por slug) | ☐ Mapear/redirigir a `/calendario-economico/event/{slug}` · ☐ No migrar · ☐ Más adelante |

**Nota:** Press releases e industry-news aparecen también en el scrap ES, pero ya quedan **fuera de alcance** (solo inglés). No hace falta decidirlas de nuevo aquí.

| Decisión PO (esta sección) | Nombre | Fecha |
|-----------------------------|--------|-------|
| | | |
