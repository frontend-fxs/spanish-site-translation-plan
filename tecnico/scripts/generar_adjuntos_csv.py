"""
Genera CSV no técnicos (un archivo por lote) en csv/ para el README del plan.
"""
from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from pathlib import Path

SITE = Path(r"c:\Users\oriol\source\repos\Site")
OUT = Path(__file__).resolve().parents[2] / "csv"

HEADERS = [
    "Carpeta",
    "Bloque",
    "Clave",
    "Inglés (original)",
    "Español (borrador IA)",
    "Español (revisado)",
    "Estado",
    "Comentarios",
]

LOTE_META = {
    "01-legal": ("01-legal.csv", "Legal y políticas", "Alta"),
    "02-seo-navegacion": ("02-seo-navegacion.csv", "SEO, navegación y errores", "Alta"),
    "03-cuenta-premium": ("03-cuenta-premium.csv", "Cuenta y premium", "Alta"),
    "04-calendario-rates-brokers": (
        "04-calendario-rates-brokers.csv",
        "Calendario, rates y brókers",
        "Alta",
    ),
    "05-resto-verticales": ("05-resto-verticales.csv", "Resto de verticales y home", "Media"),
    "06-rss": ("06-rss.csv", "RSS", "Media"),
}


def flatten(obj, prefix=""):
    rows = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            key = f"{prefix}.{k}" if prefix else str(k)
            rows.extend(flatten(v, key))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            key = f"{prefix}[{i}]"
            rows.extend(flatten(v, key))
    else:
        if obj is None or isinstance(obj, (int, float, bool)):
            return rows
        text = str(obj)
        if text.strip() == "":
            return rows
        rows.append((prefix, text))
    return rows


def load_json(path: Path):
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def en_path_for(es_path: Path) -> Path:
    name = es_path.name
    if name.endswith(".es.json"):
        return es_path.with_name(name.replace(".es.json", ".en.json"))
    return es_path


def classify_lote(rel: str) -> str:
    r = rel.replace("\\", "/")
    if re.search(
        r"terms-conditions|privacy-policy|cookie-policy|prevention|"
        r"premium-terms-and-conditions|EthicalCode|EditorialGuidelines|"
        r"TransparencyTranslations|advertising-model|how-fxstreet-uses-ai|"
        r"how-we-score-reviews|about-us|corporate-identity",
        r,
    ):
        return "01-legal"
    if (
        r.startswith("messages/seo/")
        or r.startswith("messages/layout/")
        or r.startswith("messages/errors/")
        or r.startswith("messages/shared/")
    ):
        return "02-seo-navegacion"
    if re.search(
        r"/account\.es\.json$|/profile\.es\.json$|/premium\.es\.json$|"
        r"messages/editorial/Premium\.es\.json$|messages/posts/Paywall\.es\.json$|"
        r"/subscriptions\.es\.json$",
        r,
    ):
        return "03-cuenta-premium"
    if re.search(
        r"economic-calendar|calendar-event|calendar-guide|fed-sentiment|"
        r"forex-market-hours|world-interest|rates-charts|broker|CashbackWidget|"
        r"propinder|showcases|macro-showcases|SubHomeShowcases|messages/brokers/",
        r,
    ):
        return "04-calendario-rates-brokers"
    if "rss-feed" in r:
        return "06-rss"
    return "05-resto-verticales"


def friendly_paths(rel: str) -> tuple[str, str]:
    r = rel.replace("\\", "/")
    if r.startswith("messages/"):
        parts = r.split("/")
        carpeta = parts[1] if len(parts) > 1 else "messages"
        bloque = Path(parts[-1]).name.replace(".es.json", "").replace(".en.json", "")
        return carpeta, bloque
    if "/components/" in r:
        m = re.search(r"/components/([^/]+)/", r)
        carpeta = f"componentes/{m.group(1)}" if m else "componentes"
        bloque = Path(r).name.replace(".es.json", "")
        return carpeta, bloque
    if "rss" in r:
        return "rss", "rss-feed"
    return "otros", Path(r).stem



def collect_json_rows():
    roots = [
        SITE / "messages",
        SITE / "packages" / "ui" / "src" / "components",
        SITE / "packages" / "lib" / "server-only" / "rss",
    ]
    by_lote: dict[str, list[dict]] = defaultdict(list)
    for root in roots:
        if not root.exists():
            continue
        for es_path in sorted(root.rglob("*.es.json")):
            rel = es_path.relative_to(SITE).as_posix()
            lote = classify_lote(rel)
            en_file = en_path_for(es_path)
            es_data = load_json(es_path)
            en_data = load_json(en_file) if en_file.exists() else {}
            en_map = dict(flatten(en_data))
            es_map = dict(flatten(es_data))
            keys = sorted(set(en_map) | set(es_map))
            carpeta, bloque = friendly_paths(rel)
            for key in keys:
                by_lote[lote].append(
                    {
                        "carpeta": carpeta,
                        "bloque": bloque,
                        "clave": key,
                        "en": en_map.get(key, ""),
                        "es": es_map.get(key, ""),
                    }
                )
    return by_lote


def extract_nav_texts(ts_path: Path) -> list[tuple[str, str]]:
    text = ts_path.read_text(encoding="utf-8")
    entries = []
    for m in re.finditer(r"Text:\s*'((?:\\'|[^'])*)'", text):
        val = m.group(1).replace("\\'", "'")
        start = max(0, m.start() - 200)
        window = text[start : m.start()]
        id_m = list(re.finditer(r"Id:\s*'([^']+)'", window))
        url_m = list(re.finditer(r"Url:\s*'([^']+)'", window))
        ctx = []
        if id_m:
            ctx.append(id_m[-1].group(1))
        if url_m:
            ctx.append(url_m[-1].group(1))
        clave = " / ".join(ctx) if ctx else f"item@{m.start()}"
        entries.append((clave, val))
    return entries


def collect_nav_rows():
    es = SITE / "packages/ui/src/components/header/navigation-data/navigation-data-es.ts"
    en = SITE / "packages/ui/src/components/header/navigation-data/navigation-data-en.ts"
    if not es.exists() or not en.exists():
        return []
    es_list = extract_nav_texts(es)
    en_list = extract_nav_texts(en)
    rows = []
    n = max(len(es_list), len(en_list))
    for i in range(n):
        es_key, es_val = es_list[i] if i < len(es_list) else ("", "")
        en_key, en_val = en_list[i] if i < len(en_list) else ("", "")
        clave = en_key or es_key or f"menu[{i}]"
        rows.append(
            {
                "carpeta": "navegacion",
                "bloque": "menu-principal",
                "clave": clave,
                "en": en_val,
                "es": es_val,
            }
        )
    return rows


def write_csv(path: Path, rows: list[dict]):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(HEADERS)
        for row in rows:
            w.writerow(
                [
                    row["carpeta"],
                    row["bloque"],
                    row["clave"],
                    row["en"],
                    row["es"],
                    "",
                    "Pendiente",
                    "",
                ]
            )


def write_lote(lote_id: str, rows: list[dict]):
    filename, titulo, prioridad = LOTE_META[lote_id]
    OUT.mkdir(parents=True, exist_ok=True)
    write_csv(OUT / filename, rows)
    print(f"Wrote {filename} ({len(rows)} rows) — {titulo} [{prioridad}]")


def main():
    by_lote = collect_json_rows()
    nav = collect_nav_rows()
    if nav:
        by_lote["02-seo-navegacion"].extend(nav)

    OUT.mkdir(parents=True, exist_ok=True)
    for lote_id in LOTE_META:
        write_lote(lote_id, by_lote.get(lote_id, []))

    index_path = OUT / "indice_lotes.csv"
    with index_path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["lote", "archivo", "titulo", "prioridad", "filas"])
        for lote_id, (filename, titulo, prio) in LOTE_META.items():
            w.writerow([lote_id, filename, titulo, prio, len(by_lote.get(lote_id, []))])
    print("Index:", index_path)


if __name__ == "__main__":
    main()
