import type { DEMO_DATA, PERIOD_INFO } from './data'

type RawData = typeof DEMO_DATA

// patientCount / prodPerPatient are present on the live month (added BD10) but absent on
// frozen historical snapshots — make them optional so both conform to DashboardData.
// `T extends unknown` distributes over the doctor/hygienist union (some members carry isOSB).
// adjProd (adjusted production = Production Total; added BD13 per Tiffany) is on the live month's
// hygienists but absent on frozen snapshots — optional so both conform.
type WithOptionalPerPatient<T> = T extends unknown
  ? Omit<T, 'patientCount' | 'prodPerPatient' | 'adjProd'> & { patientCount?: number; prodPerPatient?: number; adjProd?: number }
  : never

// activeHygienePatients (added BD19, per Chris) is present on the live month but absent on
// frozen historical snapshots — make it optional so both conform to DashboardData.
type WithOptionalHygiene<T> = T extends unknown
  ? Omit<T, 'activeHygienePatients' | 'newPatientsGoal'> & { activeHygienePatients?: number; newPatientsGoal?: number }
  : never

// asOf (added BD10) = "as of" dates for metrics not refreshed daily (phones, supplies, active hygiene);
// present on the live month, absent on frozen historical snapshots — optional so both conform.
export type DashboardData = Omit<RawData, 'doctors' | 'hygienists' | 'locations' | 'asOf'> & {
  asOf?:      { phones: string; supplies: string; activeHygiene: string }
  doctors:    WithOptionalPerPatient<RawData['doctors'][number]>[]
  hygienists: WithOptionalPerPatient<RawData['hygienists'][number]>[]
  locations:  WithOptionalHygiene<RawData['locations'][number]>[]
}
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
