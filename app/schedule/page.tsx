import ScheduleClient from './ScheduleClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Schedule & Pipeline — GreenSky Dental',
}

export default function SchedulePage() {
  return <ScheduleClient />
}
