# Month-end close & next-month launch — runbook

One-pass procedure for closing a month and launching the next. Validated for the July→August close.

## A. Final daily update (close day, e.g. 7/31)
Process the last daily batch exactly like any other day into `lib/data.ts`:
- Production = MTD ProviderTotals (gross Procedure Charges) split to location; HNK+OSB = P/C Summary net proxy.
- **Collections = Deposit Slip report** (source of truth per Tiffany) — sum `Amount` by Location for the month.
  Per-provider collections stay ProviderTotals Payments (deposit slip has no provider column).
- New Patients, PPP patient counts, hours, AR (+ OSB DI carry — **pull a fresh OSB Dental Intel first if possible**),
  DH remaining schedule (will be ~$0 on the last day), single-day leaderboard (full producer lists), phones if a pull came.
- Set PERIOD_INFO: `daysComplete = totalBizDays`, `daysRemaining = 0`.
- Build (`npm run build`) + deploy (`vercel --prod --yes`).

## B. Freeze the closed month
```bash
node scripts/freeze-month.mjs --key 2026-07 --var jul2026 --label "July 2026" --register
```
- Writes `lib/months/2026-07.ts` (a full MonthSnapshot inlined from the just-finalized `lib/data.ts`)
  and appends the import + array entry to `lib/history.ts`.
- Forces `periodInfo.daysRemaining = 0`.
- Add `--partial` only if the month has known gaps (e.g. OSB DI never trued up).
- Verify: `sed -n '/HISTORICAL_MONTHS/,/^]/p' lib/history.ts` shows the new var once, no double comma.

## C. Launch the next month (August)
Reset the LIVE `lib/data.ts` for the new month. This normally happens with the **first August batch**, but the reset
is mechanical:
- `PERIOD_INFO`: `label:'August 2026'`, `dataAsOf:'Aug 3'` (first biz day), `totalBizDays: 21`
  (Aug 2026 = 21 weekdays, **no** holiday), `daysComplete` = biz days elapsed, `daysRemaining` = 21 − daysComplete.
- Header comment block → "AUGUST BDx".
- `DEMO_DATA` org / locations / doctors / hygienists / ar → the first August MTD pull (small numbers early).
- `DAILY_LEADERBOARD` → first August single day.
- `SCHEDULE_DATA` + `REMAINING_SCHEDULE_BY_PROVIDER` → first August DH pull.
- Keep unchanged unless told: `MONTHLY_GOALS`, `MONTHLY_PROD_GOALS`, `org.productionGoal` ($2.4M),
  `org.collectionsGoal` ($1,455,000 = sum of MONTHLY_GOALS), supply %.
- `futureMonths` (Sep/Oct/…) — refresh from the Scheduled-Production-by-Month pull when supplied.
- Build + deploy. YTD page will now show the frozen July automatically (it reads HISTORICAL_MONTHS).

## Notes
- `freeze-month.mjs` transpiles `lib/data.ts` with the local `typescript` and reads `PERIOD_INFO`/`DEMO_DATA`
  (data.ts has no runtime imports, so this is safe). It refuses to overwrite an existing month file without `--force`.
- OSB Dental Intel AR/collections carry (6/30, $111,981) has been stale for weeks — pull fresh DI before freezing
  so July's OSB numbers are real, or mark the freeze `--partial`.
