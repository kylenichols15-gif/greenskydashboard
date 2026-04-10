import { NextRequest, NextResponse } from 'next/server'

function isAuthed(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  const correct = process.env.ADMIN_PASSWORD ?? 'greensky2026'
  return token === correct
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { section, payload } = body as { section: string; payload: unknown }

  try {
    const { kv } = await import('@vercel/kv')

    if (section === 'period') {
      await kv.set('period_info', payload)
    } else {
      // Merge into the full dashboard_data object
      const { DEMO_DATA } = await import('@/lib/data')
      const existing = (await kv.get<Record<string, unknown>>('dashboard_data')) ?? { ...DEMO_DATA }
      const updated = { ...existing, [section]: payload }
      await kv.set('dashboard_data', updated)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('KV save error:', err)
    return NextResponse.json({ error: 'KV not configured or save failed' }, { status: 500 })
  }
}
