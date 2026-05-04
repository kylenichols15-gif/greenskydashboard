import { getData, getPeriodInfo } from '@/lib/getData'
import DoctorsClient from './DoctorsClient'

export default async function DoctorsPage() {
  const [data, period] = await Promise.all([getData(), getPeriodInfo()])
  return <DoctorsClient currentData={data} currentPeriod={period} />
}
