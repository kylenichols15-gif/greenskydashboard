import { getData, getPeriodInfo } from '@/lib/getData'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const [data, periodInfo] = await Promise.all([getData(), getPeriodInfo()])
  return <AdminClient initialData={data} initialPeriod={periodInfo} />
}
