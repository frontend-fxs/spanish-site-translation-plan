# Anexo de instrucciones — 16/09/2026

Complementa el [README.md](../README.md) de revisión de textos. **No modifica ese documento**: si ya habéis empezado a trabajar con él, dejadlo como está y usad este anexo para las indicaciones nuevas.

Los textos nuevos van en [traducciones.md](./traducciones.md) y [07-anexo-traducciones-2026-09-16.csv](./07-anexo-traducciones-2026-09-16.csv).

---

## Path localizado (sustituye el párrafo del README)

El README decía que solo la home del calendario usaba `/calendario-economico` y que el resto de páginas del calendario (p. ej. `/economic-calendar/world-interest-rates`) se quedaban en inglés.

Eso ya no aplica. En español, **toda** la familia del calendario usa `/calendario-economico` (home y subpáginas).

| Qué ve el usuario en español | URL canónica |
|------------------------------|--------------|
| Calendario (home) | `/calendario-economico` |
| País, herramienta o evento | `/calendario-economico/united-states`, `/calendario-economico/fed-sentiment-index`, `/calendario-economico/world-interest-rates`, … |
| El resto del site | Paths ingleses (`/news`, `/analysis`, `/info/advertising-model`, …) |

- Los slugs no se traducen: `/calendario-economico/united-states`, no `/calendario-economico/estados-unidos`.
- `/economic-calendar` y `/economic-calendar/…` siguen respondiendo en español **sin redirect**. El canónico para SEO y enlaces internos es `/calendario-economico`.
- En inglés, los canónicos siguen bajo `/economic-calendar`.

El resto del apartado **Alcance** del README (espejo EN, superficies solo inglés, ocultar menú si falta editorial) no cambia.

---

## Lote 07 (no está en la tabla del README)

Añadid este lote al seguimiento **sin editar** la tabla original:

| Lote | Contenido | Prioridad | Hoja / CSV | Encargo |
|------|-----------|-----------|------------|---------|
| 07 | Nombres de país del calendario | Alta | `07-anexo-traducciones-2026-09-16` | Traducciones |

Misma entrega de una vez que los lotes 01–06: cuando esté revisado, avisad junto con el resto.

---

## Enlaces y pie de página

No cambia el trabajo de las hojas 01–06. Solo el criterio al reintegrar:

- Ignorar filas cuyo valor sea una URL (`.url`, `.href`, `.link`, `.linkPath`). El texto visible del enlace sí se revisa.
- **Publicidad** abre el PDF del media kit. **Modelo de publicidad** es la página `/info/advertising-model` (mismo path en todos los idiomas; el copy sí se traduce, lote 01 / etiquetas del footer en lote 02).
