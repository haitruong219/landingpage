'use client'

import { useEffect, useState } from 'react'

export function useIsAdminSubdomain(): boolean {
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]
      const adminSubdomain = process.env.NEXT_PUBLIC_ADMIN_SUBDOMAIN || 'admin'
      setIsAdminSubdomain(subdomain === adminSubdomain)
    }
  }, [])

  return isAdminSubdomain
}

export function getAdminPath(path: string, isAdminSubdomain: boolean): string {
  if (isAdminSubdomain) {
    if (path.startsWith('/admin')) {
      return path.replace(/^\/admin/, '') || '/'
    }
    return path
  }
  
  if (path === '/') {
    return '/admin'
  }
  
  if (!path.startsWith('/admin')) {
    return `/admin${path}`
  }
  
  return path
}

