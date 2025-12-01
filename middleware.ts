import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isAdminSubdomain } from './lib/subdomain'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  let pathname = request.nextUrl.pathname
  const isAdmin = isAdminSubdomain(hostname)
  
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      const adminSubdomain = process.env.NEXT_PUBLIC_ADMIN_SUBDOMAIN || 'admin'
      const url = request.nextUrl.clone()
      url.host = `${adminSubdomain}.${url.host.split('.').slice(-2).join('.')}`
      return NextResponse.redirect(url)
    }
    
    const normalizedPath = pathname.replace(/^\/admin/, '') || '/'
    
    if (normalizedPath !== '/login') {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (!token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.host = request.headers.get('host') || ''
        return NextResponse.redirect(loginUrl)
      }
    }
    
    const url = request.nextUrl.clone()
    url.pathname = pathname
    const response = NextResponse.rewrite(url)
    response.headers.set('x-is-admin-subdomain', 'true')
    response.headers.set('x-original-pathname', pathname)
    response.headers.set('x-normalized-pathname', normalizedPath)
    return response
  }
  
  if (isAdmin && !pathname.startsWith('/api')) {
    if (pathname === '/login') {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (token) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      const response = NextResponse.rewrite(url)
      response.headers.set('x-is-admin-subdomain', 'true')
      response.headers.set('x-is-login-page', 'true')
      return response
    }
    
    if (pathname === '/' || pathname === '') {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (!token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.host = request.headers.get('host') || ''
        return NextResponse.redirect(loginUrl)
      }
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      const response = NextResponse.rewrite(url)
      response.headers.set('x-is-admin-subdomain', 'true')
      return response
    }
    
    const url = request.nextUrl.clone()
    url.pathname = `/admin${pathname}`
    const response = NextResponse.rewrite(url)
    response.headers.set('x-is-admin-subdomain', 'true')
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

