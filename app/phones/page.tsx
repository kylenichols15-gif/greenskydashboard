import { getData, getPeriodInfo } from '@/lib/getData'
import PhonesClient from './PhonesClient'

export default async function PhonesPage() {
  const [data, period] = await Promise.all([getData(), getPeriodInfo()])
  return <PhonesClient currentData={data} currentPeriod={period} />
}
