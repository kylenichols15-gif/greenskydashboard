import { getData, getPeriodInfo } from '@/lib/getData'
import ArClient from './ArClient'

export default async function ARAgingPage() {
  const [data, period] = await Promise.all([getData(), getPeriodInfo()])
  return <ArClient currentData={data} currentPeriod={period} />
}
