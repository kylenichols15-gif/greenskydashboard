import { DEMO_DATA, PERIOD_INFO } from './data'

type DashboardData = typeof DEMO_DATA
type PeriodData = typeof PERIOD_INFO

async function getKV() {
  try {
    const { kv } = await import('@vercel/kv')
    return kv
  } catch {
    return null
  }
}

export async function getData(): Promise<DashboardData> {
  try {
    const kv = await getKV()
    if (!kv) return DEMO_DATA
    const data = await kv.get<DashboardData>('dashboard_data')
    if (data) return data
  } catch {
    // KV not configured or unavailable
  }
  return DEMO_DATA
}

export async function getPeriodInfo(): Promise<PeriodData> {
  try {
    const kv = await getKV()
    if (!kv) return PERIOD_INFO
    const info = await kv.get<PeriodData>('period_info')
    if (info) return info
  } catch {}
  return PERIOD_INFO
}
