// Historical month registry — add new months here as they are populated.
// Order: oldest first. LATEST_MONTH is always the last entry.
// When adding a month: create lib/months/YYYY-MM.ts, import below, append to array.
import type { MonthSnapshot } from './types'
import jan2026 from './months/2026-01'
import feb2026 from './months/2026-02'
import mar2026 from './months/2026-03'
import apr2026 from './months/2026-04'
import may2026 from './months/2026-05'
import jun2026 from './months/2026-06'
import jul2026 from './months/2026-07'
import aug2026 from './months/2026-08'

export const HISTORICAL_MONTHS: MonthSnapshot[] = [
  jan2026,
  feb2026,
  mar2026,
  apr2026,
  may2026,
  jun2026,
  jul2026,
  aug2026,
]

export const LATEST_MONTH = HISTORICAL_MONTHS[HISTORICAL_MONTHS.length - 1]

export function getMonthData(key: string): MonthSnapshot | undefined {
  return HISTORICAL_MONTHS.find(m => m.key === key)
}
