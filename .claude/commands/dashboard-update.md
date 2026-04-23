# /dashboard-update

Update GreenSky Dashboard with the latest Dentrix CSV exports.

## What this does
Runs the CSV parser script, reads AR aging data, prompts for OSB figures,
then updates `lib/data.ts`, commits, and deploys to Vercel.

---

## STEP 1 — Run the parser script

Run this from the project root:

```bash
python3 scripts/parse_dashboard_csvs.py --month $MONTH --year $YEAR
```

Replace `$MONTH` with the 3-letter abbreviation (e.g. `Apr`) and `$YEAR` with `2026`.
If no arguments are provided, defaults to `Apr 2026`.

Capture the full JSON output. Note the `files_used` block — confirm the filenames match
what Kyle exported. If there are any `errors`, stop and report them before proceeding.

---

## STEP 2 — Determine PERIOD_INFO

From the ProviderTotals CSV header (row 1), extract the "data as of" date/time
(e.g. `04/21/2026 10:50 PM`).

Compute:
- `dataAsOf` = human-readable date (e.g. `April 22`)
- `daysComplete` = count of weekdays from April 1 through the data-as-of date inclusive
  - April 2026 weekdays: 1,2,3,6,7,8,9,10,13,14,15,16,17,20,21,22,23,24,27,28,29,30 = 22 total
  - Good Friday (Apr 3) counts as a working day for GreenSky dental practices
- `totalBizDays` = 22 (April 2026 — hardcoded, recalculate for new months)
- `daysRemaining` = totalBizDays − daysComplete

---

## STEP 3 — Read AR aging from AgedReceivables CSV

Find the latest `AgedReceivables*.csv` in `~/Downloads`.

The file has a 3-row preamble (report title, location filter, blank) then a header row:
`Primary Guarantor, Phone Number, Last Payment, CP, Unapplied Credits, 0-30, 31-60, 61-90, Over 90, Balance`

The rows are **patient-level** — no location column. Dentrix groups patients by location
with a subtotal row that reads the location name in the "Primary Guarantor" column
and numeric totals in the aging bucket columns. These subtotal rows have no phone number.

**Parsing strategy:**
1. Read the CSV row by row
2. When a row has a location name in col 0 and numeric values in aging columns → it's a subtotal row
3. Location name to code mapping:
   - "Harvey and Nichols Family Dentistry" → LKW
   - "Harvey and Nichols Lincoln Trail" → LT
   - "Harvey and Nichols Radcliff PLLC" → HNR
   - "Harvey and Nichols Shepherdsville PLLC" → HNS
   - "Proctor Family Dental Bardstown" → PB
   - "Proctor Family Dental Radcliff" → PR
4. The last row before "Grand Total" gives org-level bucket totals

For each location, extract:
- `total` = Balance column
- `d0_30`, `d31_60`, `d61_90`, `d90plus` = the four aging bucket columns
- `pct0_30` etc. = bucket / total × 100, rounded to 1 decimal
- `insuranceAR` and `patientAR` = **not in this CSV** — carry forward from prior update unless a new pull was provided

If the AgedReceivables CSV doesn't have clear subtotal rows, read the full file and aggregate
by the location grouping pattern. If uncertain, report the raw totals found and ask Kyle to confirm.

---

## STEP 4 — Get OSB figures

OSB data always comes from Dental Intel (manual source). Check if the latest
`ar-overview-*.csv` and `providers-performance-*.csv` files in `~/Downloads`
are newer than the current `data.ts` dataAsOf date.

If yes, parse:
- `ar-overview`: OSB AR total + aging buckets (rows by patient, or summary row at bottom)
- `providers-performance`: OSB doctor gross prod + collections + new patients

If no new DI files, carry forward existing OSB values from `data.ts` and note "OSB unchanged".

Always badge OSB as `isOSB: true` and never blend into Ascend aggregates without disclosure.

---

## STEP 5 — Compute derived values

**Org totals (in data.ts `org` block):**
```
production      = ascend_grossProd_from_providers + OSB_grossProd
productionGoal  = 2,400,000  (April — do not change unless Kyle provides new goal)
collections     = ascend_collections + OSB_collections
collectionsGoal = 1,320,000  (April — do not change unless Kyle provides new goal)
newPatients     = ascend_newPatients + OSB_newPatients
```

**Per-location `collectionRate`:**
```
collectionRate = collections / production × 100  (can exceed 100% for new locations)
```

**Doctor `prodPerDay`:**
```
prodPerDay = grossProd / daysComplete  (use daysComplete from PERIOD_INFO)
```

**Hygienist `prodPerHr`:**
```
prodPerHr = grossProd / hoursWorked  (hoursWorked from Time Clock CSV)
```

**AR `arToProdRatio`:**
```
arToProdRatio = ar_total / (ascend_net_locations_total × 22/daysComplete)
  — uses projected full-month net production
  — round to 2 decimal places
```

**AR location `arToProd`:**
```
arToProd = loc_ar_total / (loc_net_prod × 22/daysComplete)
```

**AR location `status`:**
- `'good'`       → d90plus_pct < 5% AND d0_30_pct > 75%
- `'watch'`      → d90plus_pct 5–10% OR d31_60_pct > 25%
- `'needs_work'` → d90plus_pct > 10%

**AR `healthScore`:**  
Base 100, subtract 1pt per 0.5pp above 5% in 90+ bucket, subtract 1pt per 1pp above 25% in 31-60 bucket.
Range 0–100. Round to nearest integer.

---

## STEP 6 — Present summary for review

Before writing anything, output a compact review table:

```
PERIOD_INFO  dataAsOf=April 22  daysComplete=16  daysRemaining=6

ORG (Ascend + OSB)
  Gross Prod:  $X,XXX,XXX  (Ascend $X + OSB $X)
  Net Coll:    $X,XXX,XXX  (Ascend $X + OSB $X)
  New Patients: XXX (Ascend XX + OSB XX)

LOCATIONS (net prod / collections / NP)
  LKW: $XXX,XXX / $XXX,XXX / XX
  LT:  ...
  ...

DOCTORS (top 5 by gross prod)
  Nichols Christopher  $XXX,XXX  XX% coll
  ...

AR SUMMARY
  Total: $X,XXX,XXX  |  90+ pct: XX%  |  healthScore: XX
  LKW: $XXX,XXX  90+:XX%  → needs_work
  ...

Files used:
  ProviderTotals (N).csv
  Prod/Coll Summary (N).csv
  New Patients (N).csv
  Time Clock: date range
```

Ask: **"Does this look right? Type 'yes' to write data.ts, or point out any corrections."**

Do not write any files until Kyle confirms.

---

## STEP 7 — Update data.ts

After confirmation, update `lib/data.ts` with all new values.

Key rules:
- Preserve the existing structure and comments — only change values
- Update `PERIOD_INFO` block first
- Update `org` block
- Update each location in the `locations` array (preserve `status`, `recareRate`, `phoneAnswerRate`, `activePatients`, `suppliesPct` from prior unless new data provided)
- Update `doctors` array (preserve `ytdProd` from prior unless new data provided)
- Update `hygienists` array (preserve `recareRate` from prior unless new data provided)
- Update `ar` block
- Do NOT change `MONTHLY_GOALS`, `BENCHMARKS`, or `LOCATIONS` arrays

**Phone answer rate:** Only update if new Mango Voice screenshots were provided.
Otherwise carry forward with a note that phones data is unchanged.

**Recare rate:** Only update if new Dentrix recare report was provided.
Otherwise carry forward from prior period.

---

## STEP 8 — Commit and deploy

```bash
cd /Users/kylenichols/Documents/greenskydashboard-app

git add lib/data.ts
git commit -m "DATA UPDATE: $MONTH $YEAR BD$DAYS_COMPLETE — prod $GROSS_PROD, coll $COLLECTIONS, $NP NP"

git push origin main

npx vercel --prod --yes 2>&1 | grep -E "(Error|✓|Aliased|Production:)"
```

The Vercel deploy auto-aliases to `dashboard.greenskydental.com` — confirm the
`Aliased:` line appears in the output. If not, run:
```bash
npx vercel ls | head -1 | awk '{print $1}' | xargs -I{} npx vercel alias set {} dashboard.greenskydental.com
```

Report the final deployed URL to Kyle.
