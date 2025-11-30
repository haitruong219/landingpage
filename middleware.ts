import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isAdminSubdomain } from './lib/subdomain'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  const isAdmin = isAdminSubdomain(hostname)
  
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      const adminSubdomain = process.env.NEXT_PUBLIC_ADMIN_SUBDOMAIN || 'admin'
      const url = request.nextUrl.clone()
      url.host = `${adminSubdomain}.${url.host.split('.').slice(-2).join('.')}`
      return NextResponse.redirect(url)
    }
    
    if (pathname !== '/admin/login') {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (!token) {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.host = request.headers.get('host') || ''
        return NextResponse.redirect(loginUrl)
      }
    } else {
      const response = NextResponse.next()
      response.headers.set('x-is-login-page', 'true')
      response.headers.set('x-pathname', pathname)
      return response
    }
  }
  
  if (isAdmin && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

