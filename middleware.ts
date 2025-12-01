import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isAdminSubdomain } from './lib/subdomain'
import { routing } from './i18n/routing'
import { getEnabledLocales } from './lib/i18n-settings'

const intlMiddleware = createMiddleware(routing)

let enabledLocalesCache: string[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60000

async function getEnabledLocalesWithCache(): Promise<string[]> {
  const now = Date.now()
  if (enabledLocalesCache && (now - cacheTimestamp) < CACHE_TTL) {
    return enabledLocalesCache
  }

  try {
    enabledLocalesCache = await getEnabledLocales()
    cacheTimestamp = now
    return enabledLocalesCache
  } catch (error) {
    console.error('Error getting enabled locales:', error)
    return ['vi']
  }
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  let pathname = request.nextUrl.pathname
  const isAdmin = isAdminSubdomain(hostname)
  
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
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
    
    return NextResponse.next()
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
  
  const enabledLocales = await getEnabledLocalesWithCache()
  
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/)
  if (localeMatch) {
    const locale = localeMatch[1]
    if (!enabledLocales.includes(locale)) {
      const url = request.nextUrl.clone()
      url.pathname = pathname.replace(`/${locale}`, '') || '/'
      return NextResponse.redirect(new URL(`/${routing.defaultLocale}${url.pathname}`, request.url))
    }
  }
  
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!api|admin|_next/static|_next/image|favicon.ico).*)',
  ],
}

