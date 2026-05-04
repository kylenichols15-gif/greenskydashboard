import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import SyncClient from './SyncClient'

export default async function SyncPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const correct = process.env.ADMIN_PASSWORD ?? 'greensky2026'
  if (token !== correct) redirect('/login')

  return <SyncClient syncKey={correct} />
}
