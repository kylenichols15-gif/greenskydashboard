import { NextRequest, NextResponse } from 'next/server'
import { getData, getPeriodInfo } from '@/lib/getData'

function isAuthed(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  const correct = process.env.ADMIN_PASSWORD ?? 'greensky2026'
  return token === correct
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [data, periodInfo] = await Promise.all([getData(), getPeriodInfo()])
  return NextResponse.json({ data, periodInfo })
}
