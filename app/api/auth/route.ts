import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookieOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const correctPassword = process.env.DASHBOARD_PASSWORD ?? 'GreenSky2026!'

  if (password !== correctPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  const opts = getAuthCookieOptions()
  res.cookies.set(opts)
  return res
}
