#!/usr/bin/env python3
"""
GreenSky Dashboard Data Parser — v1.0
Finds the latest Dentrix CSVs in ~/Downloads, parses them, outputs JSON.

Usage:
  python3 scripts/parse_dashboard_csvs.py
  python3 scripts/parse_dashboard_csvs.py --month Apr --year 2026

Output: JSON blob to stdout with parsed Ascend data (OSB added manually via skill).
"""

import csv
import json
import os
import re
import sys
from pathlib import Path

DOWNLOADS = Path.home() / "Downloads"

# ── Location mapping ──────────────────────────────────────────────────────────
LOCATION_MAP = {
    "Harvey and Nichols Family Dentistry": "LKW",
    "Harvey and Nichols Lincoln Trail":    "LT",
    "Harvey and Nichols Radcliff PLLC":   "HNR",
    "Harvey and Nichols Shepherdsville PLLC": "HNS",
    "Proctor Family Dental Bardstown":    "PB",
    "Proctor Family Dental Radcliff":     "PR",
}

# ── Doctor config ─────────────────────────────────────────────────────────────
# (canonical display name, location code)
DOCTORS = {
    "Nichols, Christopher": ("Nichols, Christopher", "LKW"),
    "Proctor, Sarah":       ("Proctor, Sarah",       "PB"),
    "Weathers, L'Cris":    ("Weathers, L'Cris",     "PR"),
    "Ballard, Erin":        ("Ballard, Erin",         "PB"),
    "Connolly, Noah":       ("Connolly, Noah",        "HNS"),
    "Nichols, Patrick":     ("Nichols, Patrick",      "LT"),
    "Walters, Carrie":      ("Walters, Carrie",       "LKW"),
    "Skaggs, Ernest":       ("Skaggs, Ernest",        "HNR"),
    "Decker Haycraft, Kara":("Decker Haycraft, Kara","LT"),
    "Chadwick, Evan":       ("Chadwick, Evan",        "PR"),
    "Gleason, Robert":      ("Gleason, Robert",       "LKW"),
}

DOCTOR_ALIASES = {
    # Nichols Christopher
    "Nichols, Christopher - CND1": "Nichols, Christopher",
    "Nichols, Christopher - 1602": "Nichols, Christopher",
    "Nichols, Christopher - CN36": "Nichols, Christopher",
    "Nichols, Christopher - DRCN": "Nichols, Christopher",
    "Nichols, Christopher - OldNic": "Nichols, Christopher",
    "Nichols, Christopher - CNICHM": "Nichols, Christopher",
    "Dental  PLLC, Chris Nichols - 8720": "Nichols, Christopher",
    # Proctor Sarah
    "Proctor, Sarah - SAP1": "Proctor, Sarah",
    "Proctor, Sarah - DRPROC": "Proctor, Sarah",
    "Proctor, Sarah - SPMM": "Proctor, Sarah",
    "PROCTOR, SARAH - PROCME": "Proctor, Sarah",
    # Weathers
    "Weathers, L'Cris - LAW1": "Weathers, L'Cris",
    "Weathers, L'Cris - DRWEAT": "Weathers, L'Cris",
    "Weathers, L'Cris - WEATHM": "Weathers, L'Cris",
    # Ballard
    "Ballard, Erin - Erin B": "Ballard, Erin",
    "Ballard, Erin Victoria - BALLME": "Ballard, Erin",
    "Ballard, Erin Victoria - DRBALL": "Ballard, Erin",
    # Connolly
    "Connolly, Noah - Noah": "Connolly, Noah",
    "Connolly, Noah - CONNME": "Connolly, Noah",
    "Connolly, Noah - DRCONN": "Connolly, Noah",
    # Nichols Patrick
    "Nichols, Patrick - DMD5": "Nichols, Patrick",
    "Nichols, Patrick - DRPN": "Nichols, Patrick",
    "Nichols, Patrick - PNICHM": "Nichols, Patrick",
    "Nichols, Patrick - PTN1": "Nichols, Patrick",
    # Walters
    "Walters, Carrie - CRW1": "Walters, Carrie",
    # Skaggs
    "Skaggs, Ernest - EOS1": "Skaggs, Ernest",
    "Skaggs, Ernest - EOS":  "Skaggs, Ernest",
    "Skaggs, Ernie - EOS":   "Skaggs, Ernest",
    # Decker Haycraft
    "Decker Haycraft, Kara - DMD6": "Decker Haycraft, Kara",
    # Chadwick
    "Chadwick, Evan - ERC1":  "Chadwick, Evan",
    "Chadwick, Evan - ERC1A": "Chadwick, Evan",
    # Gleason
    "Gleason, Robert - RCG1":  "Gleason, Robert",
    "Gleason, Robert - RCG1A": "Gleason, Robert",
}

# ── Hygienist config ──────────────────────────────────────────────────────────
HYGIENISTS = {
    # LKW
    "Howell, Dana":     ("Howell, Dana",     "LKW"),
    "Kimble, Cheryl":   ("Kimble, Cheryl",   "LKW"),
    "Woosley, Emily":   ("Woosley, Emily",   "LKW"),
    "Payne, McKay":     ("Payne, McKay",     "LKW"),
    "Wright, Chelsea":  ("Wright, Chelsea",  "LKW"),
    "Smith, Berlyn":    ("Smith, Berlyn",    "LKW"),
    "Berry, Tasha":     ("Berry, Tasha",     "LKW"),
    "Youart, Britney":  ("Youart, Britney",  "LKW"),
    "Vowels, Susan":    ("Vowels, Susan",    "LKW"),
    "Bewley, Emma":     ("Bewley, Emma",     "LKW"),
    "Blandford, Cassi": ("Blandford, Cassi", "LKW"),
    # LT
    "Morris, Amber":    ("Morris, Amber",    "LT"),
    "Logsdon, Megan":   ("Logsdon, Megan",   "LT"),
    "Harned, Stacy":    ("Harned, Stacy",    "LT"),
    "Buzick, Rebecca":  ("Buzick, Rebecca",  "LT"),
    # PR
    "Jones, Chad":      ("Jones, Chad",      "PR"),
    "Lynch, Cassie":    ("Lynch, Cassie",    "PR"),
    "Wires, Tanya":     ("Wires, Tanya",     "PR"),
    # PB
    "Kittle, Jolena":   ("Kittle, Jolena",   "PB"),
    "Keehan, Joshua":   ("Keehan, Joshua",   "PB"),
}

HYGIENIST_ALIASES = {
    "Howell, Dana - HYG6":     "Howell, Dana",
    "Kimble, Cheryl - CAK1":   "Kimble, Cheryl",
    "Woosley, Emily - ESW1":   "Woosley, Emily",
    "Payne, McKay - MJM1":     "Payne, McKay",
    "Wright, Chelsea - CTPH":  "Wright, Chelsea",
    "Smith, Berlyn - BFD1":    "Smith, Berlyn",
    "Berry, Tasha - TNB1":     "Berry, Tasha",
    "Youart, Britney - HYG3":  "Youart, Britney",
    "Vowels, Susan - SBV1":    "Vowels, Susan",
    "Bewley, Emma - ENB1":     "Bewley, Emma",
    "Blandford, Cassi - HYG7": "Blandford, Cassi",
    "Morris, Amber - AM825":   "Morris, Amber",
    "Morris, Amber - TEM1":    "Morris, Amber",
    "Logsdon, Megan - Megan":  "Logsdon, Megan",
    "Harned, Stacy - HYG1":    "Harned, Stacy",
    "Buzick, Rebecca - HYG2":  "Buzick, Rebecca",
    "Jones, Chad - CAJ1":      "Jones, Chad",
    "Lynch, Cassie - CML1":    "Lynch, Cassie",
    "Lynch, Cassie - CML1A":   "Lynch, Cassie",
    "Wires, Tanya - Tanya":    "Wires, Tanya",
    "Wires, Tanya - TanyaA":   "Wires, Tanya",
    "Kittle, Jolena - HYG4":   "Kittle, Jolena",
    "Keehan, Joshua - Joshua":  "Keehan, Joshua",
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def find_latest(pattern: str):
    """Return highest-numbered file matching pattern in Downloads."""
    files = list(DOWNLOADS.glob(pattern))
    if not files:
        return None
    def sort_key(p):
        m = re.search(r'\((\d+)\)', p.name)
        return (int(m.group(1)) if m else 0, p.stat().st_mtime)
    files.sort(key=sort_key, reverse=True)
    return files[0]

def parse_currency(s: str) -> float:
    """Parse '$1,234.56' / '-$1,234.56' / '-' → float."""
    if not s or s.strip() in ('-', '', '​'):  # includes zero-width space
        return 0.0
    s = re.sub(r'[,$"\s]', '', s.strip())
    try:
        return float(s)
    except ValueError:
        return 0.0

def resolve_provider(raw: str, alias_map: dict):
    """Resolve a raw provider name to canonical via alias map."""
    if raw in alias_map:
        return alias_map[raw]
    # Try prefix (e.g. "Nichols, Christopher - NEWCODE" not yet in map)
    for alias, canonical in alias_map.items():
        base = alias.rsplit(' - ', 1)[0]
        if raw.startswith(base + ' - ') or raw == base:
            return canonical
    return None

# ── Parsers ───────────────────────────────────────────────────────────────────

def parse_provider_totals(path: Path) -> dict:
    """Parse ProviderTotals CSV → {doctors, hygienists} dicts of grossProd/collections."""
    with open(path, encoding='utf-8-sig') as f:
        lines = f.readlines()

    # Find header row containing "Beginning Balance"
    header_idx = next((i for i, l in enumerate(lines) if 'Beginning Balance' in l), None)
    if header_idx is None:
        raise ValueError("Cannot find data header in ProviderTotals CSV")

    reader = csv.reader(lines[header_idx:])
    hdrs = next(reader)

    col = {h: i for i, h in enumerate(hdrs)}
    ci_provider  = col.get('Provider', 0)
    ci_gross     = col.get('Procedure Charges', 2)
    ci_coll      = col.get('Collection Total', 9)

    doctors    = {}
    hygienists = {}

    for row in reader:
        if not row or not row[ci_provider].strip():
            continue
        raw = row[ci_provider].strip()
        if raw in ('Provider Totals', 'Harvey and Nichols Family Dentistry',
                   'Harvey and Nichols Lincoln Trail', 'Harvey and Nichols Radcliff PLLC',
                   'Harvey and Nichols Shepherdsville PLLC', 'Proctor Family Dental Bardstown',
                   'Proctor Family Dental Radcliff'):
            continue

        try:
            gross = abs(parse_currency(row[ci_gross]))
            coll  = abs(parse_currency(row[ci_coll]))
        except IndexError:
            continue

        if gross == 0 and coll == 0:
            continue

        # Doctor?
        canonical = resolve_provider(raw, DOCTOR_ALIASES)
        if canonical and canonical in DOCTORS:
            if canonical not in doctors:
                doctors[canonical] = {'grossProd': 0, 'collections': 0}
            doctors[canonical]['grossProd']    += gross
            doctors[canonical]['collections']  += coll
            continue

        # Hygienist?
        canonical = resolve_provider(raw, HYGIENIST_ALIASES)
        if canonical and canonical in HYGIENISTS:
            if canonical not in hygienists:
                hygienists[canonical] = {'grossProd': 0, 'collections': 0}
            hygienists[canonical]['grossProd']   += gross
            hygienists[canonical]['collections'] += coll

    return {'doctors': doctors, 'hygienists': hygienists}


def parse_prod_coll_summary(path: Path, year: str, month: str) -> dict:
    """Parse Prod/Coll Summary → {loc_code: {production, collections}}."""
    with open(path, encoding='utf-8-sig') as f:
        content = f.read()

    reader = csv.reader(content.splitlines())
    hdrs = next(reader)

    # Grand Total columns are always last two
    grand_prod_idx = len(hdrs) - 2
    grand_coll_idx = len(hdrs) - 1

    results = {}
    for row in csv.reader(content.splitlines()):
        if not row or len(row) < 4:
            continue
        if row[0] != year or row[1] != month:
            continue
        loc_name = row[2].strip()
        code = LOCATION_MAP.get(loc_name)
        if not code:
            continue
        prod = parse_currency(row[grand_prod_idx])
        coll = abs(parse_currency(row[grand_coll_idx]))
        results[code] = {'production': round(prod), 'collections': round(coll)}

    return results


def parse_new_patients(path: Path, month: str) -> dict:
    """Parse New Patients CSV → {loc_code: count}."""
    results = {}
    with open(path, encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get('Month (Trans)', '').strip() != month:
                continue
            loc_name = row.get('Location', '').strip()
            code = LOCATION_MAP.get(loc_name)
            if not code:
                continue
            try:
                results[code] = int(row['Patient Count'])
            except (ValueError, KeyError):
                pass
    return results


def parse_time_clock(path: Path) -> dict:
    """Parse Time Clock CSV → {'Last, First': hours}."""
    results = {}
    with open(path, encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            last  = row.get('Last name', '').strip()
            first = row.get('First name', '').strip()
            try:
                hours = float(row.get('Total hours', 0) or 0)
            except ValueError:
                hours = 0.0
            if last and first and hours > 0:
                key = f"{last}, {first}"
                results[key] = round(results.get(key, 0.0) + hours, 2)
    return results


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--month', default='Apr', help='3-letter month abbreviation, e.g. Apr')
    parser.add_argument('--year',  default='2026', help='4-digit year, e.g. 2026')
    args = parser.parse_args()

    month, year = args.month, args.year

    # Locate files
    pt_path = find_latest("ProviderTotals*.csv")
    pc_path = find_latest("Production , Collection Summary*.csv")
    np_path = find_latest("New Patients all offices*.csv")
    # Time clock: find latest for current month period
    tc_paths = sorted(DOWNLOADS.glob("Time clock summary*.csv"),
                      key=lambda p: p.stat().st_mtime, reverse=True)
    tc_path = tc_paths[0] if tc_paths else None

    out = {
        'files_used': {
            'ProviderTotals':   str(pt_path) if pt_path else None,
            'ProdCollSummary':  str(pc_path) if pc_path else None,
            'NewPatients':      str(np_path) if np_path else None,
            'TimeClock':        str(tc_path) if tc_path else None,
        },
        'errors': [],
        'month': month,
        'year':  year,
    }

    # ── ProviderTotals ──
    provider_data = {'doctors': {}, 'hygienists': {}}
    if pt_path:
        try:
            provider_data = parse_provider_totals(pt_path)
        except Exception as e:
            out['errors'].append(f"ProviderTotals: {e}")
    else:
        out['errors'].append("ProviderTotals file not found in Downloads")

    # ── Prod/Coll Summary ──
    loc_data = {}
    if pc_path:
        try:
            loc_data = parse_prod_coll_summary(pc_path, year, month)
        except Exception as e:
            out['errors'].append(f"ProdCollSummary: {e}")
    else:
        out['errors'].append("Prod/Coll Summary file not found in Downloads")

    # ── New Patients ──
    np_data = {}
    if np_path:
        try:
            np_data = parse_new_patients(np_path, month)
        except Exception as e:
            out['errors'].append(f"NewPatients: {e}")
    else:
        out['errors'].append("New Patients file not found in Downloads")

    # ── Time Clock ──
    tc_data = {}
    if tc_path:
        try:
            tc_data = parse_time_clock(tc_path)
        except Exception as e:
            out['errors'].append(f"TimeClock: {e}")
    else:
        out['errors'].append("Time Clock file not found in Downloads")

    # ── Build doctor rows ──
    doctors_out = []
    for canonical, (display_name, loc_code) in DOCTORS.items():
        d = provider_data['doctors'].get(canonical, {})
        gross = d.get('grossProd', 0)
        coll  = d.get('collections', 0)
        doctors_out.append({
            'name':         display_name,
            'locationCode': loc_code,
            'grossProd':    round(gross),
            'collections':  round(coll),
            'collRate':     round(coll / gross * 100, 1) if gross > 0 else 0,
        })
    doctors_out.sort(key=lambda x: -x['grossProd'])

    # ── Build hygienist rows ──
    hygienists_out = []
    for canonical, (display_name, loc_code) in HYGIENISTS.items():
        h = provider_data['hygienists'].get(canonical, {})
        gross = h.get('grossProd', 0)
        coll  = h.get('collections', 0)
        hours = tc_data.get(display_name, 0.0)
        hygienists_out.append({
            'name':         display_name,
            'locationCode': loc_code,
            'grossProd':    round(gross),
            'collections':  round(coll),
            'collRate':     round(coll / gross * 100, 1) if gross > 0 else 0,
            'hoursWorked':  hours,
            'prodPerHr':    round(gross / hours) if hours > 0 else 0,
        })
    # Sort: by location order, then by grossProd desc
    loc_order = ['LKW', 'LT', 'PR', 'PB', 'HNS', 'HNR']
    hygienists_out.sort(key=lambda x: (loc_order.index(x['locationCode']) if x['locationCode'] in loc_order else 99, -x['grossProd']))

    # ── Build location rows ──
    locations_out = {}
    for code in ['LKW', 'LT', 'HNR', 'HNS', 'PB', 'PR']:
        prod = loc_data.get(code, {}).get('production', 0)
        coll = loc_data.get(code, {}).get('collections', 0)
        locations_out[code] = {
            'production':     prod,
            'collections':    coll,
            'collectionRate': round(coll / prod * 100, 1) if prod > 0 else 0,
            'newPatients':    np_data.get(code, 0),
        }

    # ── Ascend org totals ──
    ascend_net_prod  = sum(v['production']  for v in locations_out.values())
    ascend_coll      = sum(v['collections'] for v in locations_out.values())
    ascend_gross_prod = sum(d['grossProd']  for d in doctors_out) + sum(h['grossProd'] for h in hygienists_out)
    ascend_np        = sum(v['newPatients'] for v in locations_out.values())

    out['ascend_summary'] = {
        'grossProd_from_providers': round(ascend_gross_prod),
        'netProd_from_locations':   round(ascend_net_prod),
        'collections':              round(ascend_coll),
        'newPatients':              ascend_np,
        'note': 'Add OSB separately from Dental Intel. Org gross = ascend_gross_prod + OSB grossProd.'
    }
    out['doctors']    = doctors_out
    out['hygienists'] = hygienists_out
    out['locations']  = locations_out

    print(json.dumps(out, indent=2))


if __name__ == '__main__':
    main()
