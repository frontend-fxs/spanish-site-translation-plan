"""
Verify EN/ES mapped pages with live HTTP checks and rebuild mapeado-paginas.xlsx.

Columns (data sheet):
  EN URL | ES URL | page type | status | exists EN | exists ES | HTTP EN | HTTP ES | traffic 12m EN | traffic 12m ES | notes

Summary sheet at top of workbook + summary block on data sheet.
Traffic left blank until Data provides last-12-months export.

Run: python verify-and-rebuild-mapeado.py
"""
from __future__ import annotations

import csv
import ssl
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

ROOT = Path(__file__).resolve().parent
CSV_IN = ROOT / "csv" / "mapeado-paginas.csv"
CSV_OUT = ROOT / "csv" / "mapeado-paginas.csv"
XLSX_OUT = ROOT / "csv" / "mapeado-paginas.xlsx"

EN_ORIGIN = "https://www.fxstreet.com"
ES_ORIGIN = "https://www.fxstreet.es"

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
TIMEOUT = 15
WORKERS = 4
RETRIES = 2

CTX = ssl.create_default_context()

DYNAMIC_MARKERS = ("[slug]", "[guid]", "[id]", "*", "[seo-broker-landing]", "[post-sin-vertical]")


def is_dynamic(path_or_url: str) -> bool:
    return any(m in path_or_url for m in DYNAMIC_MARKERS)


def page_type_of(en_url: str, es_url: str) -> str:
    return "dynamic" if is_dynamic(en_url or es_url) else "static"


def status_of(en_url: str, es_url: str, existing: str = "") -> str:
    if existing in ("direct match", "EN only", "ES only"):
        return existing
    if en_url and es_url:
        return "direct match"
    if en_url and not es_url:
        return "EN only"
    if es_url and not en_url:
        return "ES only"
    return "unknown"


def path_from_url(url: str) -> str:
    if not url:
        return ""
    if url.startswith("http"):
        try:
            from urllib.parse import urlparse

            return urlparse(url).path or "/"
        except Exception:  # noqa: BLE001
            return url
    return url


def to_url(origin: str, path_or_url: str) -> str:
    if not path_or_url:
        return ""
    if path_or_url.startswith("http"):
        return path_or_url
    return f"{origin}{path_or_url}"


def http_check(url: str) -> tuple[str, int | None, str]:
    """Return (exists_yes_no, status_code, note). Prefer GET (CDN-friendly)."""
    if not url or "[" in url or "*" in url:
        return ("", None, "pattern — no live check")

    last_err = ""
    for attempt in range(RETRIES + 1):
        try:
            req = urllib.request.Request(
                url,
                method="GET",
                headers={
                    "User-Agent": UA,
                    "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
                },
            )
            with urllib.request.urlopen(req, timeout=TIMEOUT, context=CTX) as resp:
                code = int(getattr(resp, "status", None) or resp.getcode())
                final = resp.geturl()
                resp.read(256)
                ok = 200 <= code < 400
                note = ""
                if final.rstrip("/") != url.rstrip("/"):
                    note = f"redirect→{final}"
                return ("Sí" if ok else "No", code, note)
        except urllib.error.HTTPError as e:
            if e.code >= 500 and attempt < RETRIES:
                time.sleep(0.6 * (attempt + 1))
                last_err = str(e.reason)
                continue
            return ("No", e.code, str(e.reason))
        except Exception as e:  # noqa: BLE001
            last_err = str(e)
            time.sleep(0.5 * (attempt + 1))
    return ("No", None, f"unreachable: {last_err[:100]}")


def load_rows() -> list[dict]:
    rows = []
    with CSV_IN.open(encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            # Support both legacy (Pagina ES/EN) and current (EN URL/ES URL) headers
            en_url = (r.get("EN URL") or "").strip()
            es_url = (r.get("ES URL") or "").strip()
            path_es = (r.get("Pagina ES") or "").strip()
            path_en = (r.get("Pagina EN") or "").strip()
            if path_en or path_es:
                en_url = to_url(EN_ORIGIN, path_en)
                es_url = to_url(ES_ORIGIN, path_es)
            if not en_url and not es_url:
                continue
            rows.append(
                {
                    "en_url": en_url,
                    "es_url": es_url,
                    "page_type": (r.get("page type") or "").strip()
                    or page_type_of(en_url, es_url),
                    "status": status_of(en_url, es_url, (r.get("status") or "").strip()),
                }
            )
    return rows


def main() -> None:
    rows = load_rows()
    print(f"Loaded {len(rows)} mapped rows from {CSV_IN.name}")

    # Unique concrete URLs to check
    checks: dict[str, tuple[str, int | None, str]] = {}
    to_check: list[str] = []
    for r in rows:
        for url in (r["en_url"], r["es_url"]):
            if url and url not in checks and "[" not in url and "*" not in url:
                to_check.append(url)
                checks[url] = ("pending", None, "")

    print(f"HTTP-checking {len(to_check)} concrete URLs (workers={WORKERS})…")
    done = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futs = {pool.submit(http_check, u): u for u in to_check}
        for fut in as_completed(futs):
            u = futs[fut]
            checks[u] = fut.result()
            done += 1
            if done % 20 == 0 or done == len(to_check):
                print(f"  {done}/{len(to_check)}")

    # Enrich rows
    out_rows = []
    for r in rows:
        en_ex, en_code, en_note = (
            checks.get(r["en_url"], ("", None, "pattern — no live check"))
            if r["en_url"]
            else ("", None, "")
        )
        es_ex, es_code, es_note = (
            checks.get(r["es_url"], ("", None, "pattern — no live check"))
            if r["es_url"]
            else ("", None, "")
        )
        # If pattern, keep blank exists (N/A)
        if r["en_url"] and ("[" in r["en_url"] or "*" in r["en_url"]):
            en_ex, en_note = "", "pattern — no live check"
        if r["es_url"] and ("[" in r["es_url"] or "*" in r["es_url"]):
            es_ex, es_note = "", "pattern — no live check"

        notes = "; ".join(
            x
            for x in (
                f"EN: {en_note}" if en_note else "",
                f"ES: {es_note}" if es_note else "",
            )
            if x
        )

        # Live status refinement from HTTP reality
        live_status = r["status"]
        if r["status"] == "direct match":
            if en_ex == "No" and es_ex == "Sí":
                live_status = "ES only"
                notes = (notes + "; " if notes else "") + "mapped as match but EN dead live → ES only"
            elif es_ex == "No" and en_ex == "Sí":
                live_status = "EN only"
                notes = (notes + "; " if notes else "") + "mapped as match but ES dead live → EN only"
            elif en_ex == "No" and es_ex == "No":
                notes = (notes + "; " if notes else "") + "both URLs dead / unreachable"
        elif r["status"] == "EN only" and en_ex == "No":
            notes = (notes + "; " if notes else "") + "EN scrap/legacy URL no longer live"
        elif r["status"] == "ES only" and es_ex == "No":
            notes = (notes + "; " if notes else "") + "ES scrap/legacy URL no longer live"

        out_rows.append(
            {
                "EN URL": r["en_url"],
                "ES URL": r["es_url"],
                "page type": r["page_type"],
                "status": live_status,
                "exists EN": en_ex,
                "exists ES": es_ex,
                "HTTP EN": en_code if en_code is not None else "",
                "HTTP ES": es_code if es_code is not None else "",
                "traffic 12m EN": "",
                "traffic 12m ES": "",
                "notes": notes,
            }
        )

    # Sort: EN only, ES only, then direct match; within by URL
    order = {"EN only": 0, "ES only": 1, "direct match": 2, "unknown": 3}
    out_rows.sort(
        key=lambda x: (
            order.get(x["status"], 9),
            x["EN URL"] or x["ES URL"],
        )
    )

    n_match = sum(1 for x in out_rows if x["status"] == "direct match")
    n_en = sum(1 for x in out_rows if x["status"] == "EN only")
    n_es = sum(1 for x in out_rows if x["status"] == "ES only")
    n_en_alive = sum(1 for x in out_rows if x["exists EN"] == "Sí")
    n_en_dead = sum(1 for x in out_rows if x["exists EN"] == "No")
    n_es_alive = sum(1 for x in out_rows if x["exists ES"] == "Sí")
    n_es_dead = sum(1 for x in out_rows if x["exists ES"] == "No")

    fields = [
        "EN URL",
        "ES URL",
        "page type",
        "status",
        "exists EN",
        "exists ES",
        "HTTP EN",
        "HTTP ES",
        "traffic 12m EN",
        "traffic 12m ES",
        "notes",
    ]

    # CSV
    with CSV_OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(out_rows)

    # XLSX
    wb = Workbook()

    # --- Summary sheet ---
    ws = wb.active
    ws.title = "Summary"
    ws["A1"] = "Map EN and ES URLs — verification summary"
    ws["A1"].font = Font(bold=True, size=14)
    ws["A3"] = "Match status counts"
    ws["A3"].font = Font(bold=True)
    summary_rows = [
        ("direct match", n_match),
        ("EN only", n_en),
        ("ES only", n_es),
        ("TOTAL rows", len(out_rows)),
    ]
    ws.append([])
    ws["A4"] = "status"
    ws["B4"] = "count"
    ws["A4"].font = Font(bold=True)
    ws["B4"].font = Font(bold=True)
    for i, (label, count) in enumerate(summary_rows, start=5):
        ws[f"A{i}"] = label
        ws[f"B{i}"] = count

    ws["A10"] = "Live HTTP check (concrete URLs only; patterns skipped)"
    ws["A10"].font = Font(bold=True)
    ws["A11"] = "exists EN = Sí"
    ws["B11"] = n_en_alive
    ws["A12"] = "exists EN = No"
    ws["B12"] = n_en_dead
    ws["A13"] = "exists ES = Sí"
    ws["B13"] = n_es_alive
    ws["A14"] = "exists ES = No"
    ws["B14"] = n_es_dead

    ws["A16"] = "Traffic (last 12 months)"
    ws["A16"].font = Font(bold=True)
    ws["A17"] = (
        "Pending — no Data/GA export in this folder yet. "
        "Fill traffic 12m EN / traffic 12m ES for EN only and ES only rows when available."
    )
    ws.merge_cells("A17:F17")
    ws["A17"].alignment = Alignment(wrap_text=True)
    ws.column_dimensions["A"].width = 36
    ws.column_dimensions["B"].width = 14

    # --- Pages sheet ---
    wp = wb.create_sheet("Pages", 0)
    # Summary block at top of Pages
    wp["A1"] = "SUMMARY"
    wp["A1"].font = Font(bold=True)
    wp["A2"] = "direct match"
    wp["B2"] = n_match
    wp["A3"] = "EN only"
    wp["B3"] = n_en
    wp["A4"] = "ES only"
    wp["B4"] = n_es
    wp["A5"] = "Checked EN alive/dead"
    wp["B5"] = f"{n_en_alive}/{n_en_dead}"
    wp["A6"] = "Checked ES alive/dead"
    wp["B6"] = f"{n_es_alive}/{n_es_dead}"
    wp["A7"] = "Traffic 12m"
    wp["B7"] = "pending Data"

    header_row = 9
    for col, name in enumerate(fields, start=1):
        cell = wp.cell(header_row, col, name)
        cell.font = Font(bold=True)
        cell.fill = PatternFill("solid", fgColor="E8EEF4")

    fill_match = PatternFill("solid", fgColor="E6F4EA")
    fill_en = PatternFill("solid", fgColor="E8F0FE")
    fill_es = PatternFill("solid", fgColor="FEF7E0")
    fill_dead = PatternFill("solid", fgColor="FCE8E6")

    for r_i, row in enumerate(out_rows, start=header_row + 1):
        for c_i, name in enumerate(fields, start=1):
            wp.cell(r_i, c_i, row[name])
        st = row["status"]
        fill = fill_match if st == "direct match" else fill_en if st == "EN only" else fill_es
        wp.cell(r_i, 4).fill = fill
        if row["exists EN"] == "No":
            wp.cell(r_i, 5).fill = fill_dead
        if row["exists ES"] == "No":
            wp.cell(r_i, 6).fill = fill_dead

    widths = {
        "A": 55,
        "B": 55,
        "C": 12,
        "D": 14,
        "E": 12,
        "F": 12,
        "G": 10,
        "H": 10,
        "I": 14,
        "J": 14,
        "K": 40,
    }
    for col, w in widths.items():
        wp.column_dimensions[col].width = w
    wp.auto_filter.ref = f"A{header_row}:K{header_row + len(out_rows)}"
    wp.freeze_panes = f"A{header_row + 1}"

    wb.save(XLSX_OUT)
    print(f"Wrote {XLSX_OUT}")
    print(f"Summary: direct match={n_match} EN only={n_en} ES only={n_es}")
    print(f"Live: EN {n_en_alive} ok / {n_en_dead} dead · ES {n_es_alive} ok / {n_es_dead} dead")

    # Print dead URLs for quick review
    dead = [
        (x["EN URL"], x["HTTP EN"], "EN")
        for x in out_rows
        if x["exists EN"] == "No"
    ] + [
        (x["ES URL"], x["HTTP ES"], "ES")
        for x in out_rows
        if x["exists ES"] == "No"
    ]
    if dead:
        print("Dead / unreachable:")
        for url, code, side in dead[:40]:
            print(f"  [{side}] {code} {url}")
        if len(dead) > 40:
            print(f"  … +{len(dead) - 40} more")


if __name__ == "__main__":
    main()
