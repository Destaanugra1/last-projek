import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/lapor', '/profil']
const AUTH_COOKIE = 'payload-token'

export function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (isProtected && !token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/profil', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/lapor/:path*', '/profil/:path*', '/login', '/register'],
}
