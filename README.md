# Plan Site español (FXStreet.es)

Documentación y CSV para el lanzamiento del Site en español.  
Pensado para **GitHub**: enlaces del markdown clicables y CSV descargables.

## Empieza por aquí

| Audiencia | Entrada |
|-----------|---------|
| **Product Owner** | [producto/00-EMPIEZA-AQUI.md](./producto/00-EMPIEZA-AQUI.md) |
| **Ingeniería** | [tecnico/INFORME-tecnico.md](./tecnico/INFORME-tecnico.md) |

## Compartir con el PO

1. Crea el repo en [frontend-fxs](https://github.com/frontend-fxs) (recomendado: privado).
2. Invita al PO como collaborator (lectura o escritura).
3. Envíale el enlace directo a:  
   `…/blob/main/producto/00-EMPIEZA-AQUI.md`
4. Para cada CSV: abrir el archivo en GitHub → **Download raw file** (Excel / Sheets).

## Carpetas

```
├── README.md
├── producto/          ← PO: informes, órdenes, CSV
│   ├── 00-EMPIEZA-AQUI.md
│   ├── INFORME-product-owner.md
│   ├── ordenes/
│   └── adjuntos/
└── tecnico/           ← ingeniería
    ├── INFORME-tecnico.md
    ├── CHECKLIST.md
    ├── scripts/
    ├── anexos/
    └── crawl/
```

## Flujo

1. PO: decisiones en [producto/INFORME-product-owner.md](./producto/INFORME-product-owner.md).  
2. PO: descarga CSV desde [producto/adjuntos/](./producto/adjuntos/), encarga revisión.  
3. CSV revisados vuelven al mismo path del repo.  
4. Ingeniería reintegra y sigue [tecnico/CHECKLIST.md](./tecnico/CHECKLIST.md).
