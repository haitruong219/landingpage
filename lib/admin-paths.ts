export function normalizeAdminPath(path: string, isAdminSubdomain: boolean = false): string {
  if (!isAdminSubdomain) {
    return path
  }
  
  if (path.startsWith('/admin')) {
    const normalized = path.replace(/^\/admin/, '') || '/'
    return normalized
  }
  
  return path
}

export function getAdminPath(path: string, isAdminSubdomain: boolean = false): string {
  if (isAdminSubdomain) {
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

