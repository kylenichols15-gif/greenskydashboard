import { getData, getPeriodInfo } from '@/lib/getData'
import YtdClient from './YtdClient'

export default async function YtdPage() {
  const [data, period] = await Promise.all([getData(), getPeriodInfo()])
  return <YtdClient currentData={data} currentPeriod={period} />
}
