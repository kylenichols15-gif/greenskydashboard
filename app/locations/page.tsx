import { getData, getPeriodInfo } from '@/lib/getData'
import LocationsClient from './LocationsClient'

export default async function LocationsPage() {
  const [data, period] = await Promise.all([getData(), getPeriodInfo()])
  return <LocationsClient currentData={data} currentPeriod={period} />
}
