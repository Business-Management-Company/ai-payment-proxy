import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path.startsWith('/dashboard')) {
    const token = request.cookies.get('sb-loaquqkxszzeymbrayhry-auth-token')
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*']
}
