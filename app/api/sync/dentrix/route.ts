import { NextRequest, NextResponse } from 'next/server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-sync-key',
}

function isAuthed(req: NextRequest) {
  const key = req.headers.get('x-sync-key')
  const correct = process.env.ADMIN_PASSWORD ?? 'greensky2026'
  return key === correct
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }

  try {
    const { kv } = await import('@vercel/kv')
    const { DEMO_DATA } = await import('@/lib/data')
    const existing = (await kv.get<Record<string, unknown>>('dashboard_data')) ?? { ...DEMO_DATA }

    const updated = { ...existing }

    // Merge each provided section
    if (body.locations) updated.locations = body.locations
    if (body.doctors) updated.doctors = body.doctors
    if (body.hygienists) updated.hygienists = body.hygienists
    if (body.org) updated.org = { ...(existing.org as object), ...body.org }

    updated._syncedAt = new Date().toISOString()
    updated._syncSource = 'dentrix-bookmarklet'

    await kv.set('dashboard_data', updated)

    return NextResponse.json(
      { ok: true, updated: Object.keys(body).filter(k => k !== 'org' || body.org) },
      { headers: CORS }
    )
  } catch (err) {
    console.error('Dentrix sync error:', err)
    return NextResponse.json({ error: 'KV not configured or save failed' }, { status: 500, headers: CORS })
  }
}
