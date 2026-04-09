import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isLoginPage = pathname === '/login'
  const isApiRoute  = pathname.startsWith('/api/')
  const isAuth      = req.cookies.get('gs_auth')?.value === 'authenticated'

  if (isApiRoute) return NextResponse.next()
  if (isLoginPage && isAuth) return NextResponse.redirect(new URL('/', req.url))
  if (!isLoginPage && !isAuth) return NextResponse.redirect(new URL('/login', req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
