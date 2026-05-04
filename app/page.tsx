import { getData, getPeriodInfo } from '@/lib/getData'
import OverviewClient from './OverviewClient'

export default async function OverviewPage() {
  const [data, period] = await Promise.all([getData(), getPeriodInfo()])
  return <OverviewClient currentData={data} currentPeriod={period} />
}
