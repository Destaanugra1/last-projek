import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  const { pathname } = request.nextUrl

  let isTokenValid = false
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1]
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64))
        if (decoded.exp && decoded.exp > Date.now() / 1000) {
          isTokenValid = true
        }
      }
    } catch (e) {
      // invalid token format
    }
  }

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/laporan', '/profil', '/lapor']

  // Check if current path matches a protected route
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  if (isProtected && !isTokenValid) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    const redirectRes = NextResponse.redirect(url)

    // Clear stale cookie
    if (token) {
      redirectRes.cookies.delete('payload-token')
    }
    return redirectRes
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/login', '/register']
  if (authRoutes.includes(pathname) && isTokenValid) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to all routes except static assets and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
