import type { DEMO_DATA, PERIOD_INFO } from './data'

export type DashboardData = typeof DEMO_DATA
export type PeriodData    = typeof PERIOD_INFO

// One closed month's full data snapshot.
// key format: 'YYYY-MM' — used as the URL param and history array index.
// partial: true = data was pulled mid-month or has known gaps (e.g. OSB DI lag).
export type MonthSnapshot = {
  key:        string
  periodInfo: PeriodData
  data:       DashboardData
  partial?:   boolean
}
