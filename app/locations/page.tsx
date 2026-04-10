import { getData, getPeriodInfo } from '@/lib/getData'
import LocationsClient from './LocationsClient'

export default async function LocationsPage() {
  const [data, periodInfo] = await Promise.all([getData(), getPeriodInfo()])
  return (
    <LocationsClient
      locations={data.locations as Parameters<typeof LocationsClient>[0]['locations']}
      periodLabel={periodInfo.label}
      daysRemaining={periodInfo.daysRemaining}
    />
  )
}
