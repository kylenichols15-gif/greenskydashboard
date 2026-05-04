import { getData, getPeriodInfo } from '@/lib/getData'
import BonusClient from './BonusClient'

export default async function BonusPage() {
  const [data, period] = await Promise.all([getData(), getPeriodInfo()])
  return <BonusClient currentData={data} currentPeriod={period} />
}
