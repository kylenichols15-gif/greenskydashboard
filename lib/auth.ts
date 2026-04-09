import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const COOKIE_NAME = 'gs_auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)
  return token?.value === 'authenticated'
}

export function isAuthenticatedFromRequest(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)
  return token?.value === 'authenticated'
}

export function getAuthCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: 'authenticated',
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  }
}

export function getClearCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: '',
    maxAge: 0,
    path: '/',
  }
}
