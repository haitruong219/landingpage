export function getSubdomain(hostname: string): string | null {
  if (!hostname) return null
  
  const parts = hostname.split('.')
  
  if (parts.length < 2) return null
  
  if (parts[0] === 'www' && parts.length >= 3) {
    return parts[1]
  }
  
  if (parts.length >= 2) {
    return parts[0]
  }
  
  return null
}

export function isAdminSubdomain(hostname: string): boolean {
  const subdomain = getSubdomain(hostname)
  const adminSubdomain = process.env.NEXT_PUBLIC_ADMIN_SUBDOMAIN || 'admin'
  return subdomain === adminSubdomain
}

