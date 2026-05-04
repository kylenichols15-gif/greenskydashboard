import { getData, getPeriodInfo } from '@/lib/getData'
import HygieneClient from './HygieneClient'

export default async function HygienePage() {
  const [data, period] = await Promise.all([getData(), getPeriodInfo()])
  return <HygieneClient currentData={data} currentPeriod={period} />
}
