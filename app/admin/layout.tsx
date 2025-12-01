'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { SignOutButton } from './layout/SignOutButton'
import { useEffect, useState } from 'react'
import { useIsAdminSubdomain, getAdminPath } from '@/lib/use-admin-path'

const useSafeSession = () => {
  try {
    const result = useSession()
    return result || { data: null, status: 'loading' as const }
  } catch {
    return { data: null, status: 'loading' as const }
  }
}

const AdminLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const isAdminSubdomain = useIsAdminSubdomain()
  const sessionResult = useSafeSession()
  const session = sessionResult?.data
  const status = sessionResult?.status || 'loading'
  const isLoginPage = pathname === '/admin/login' || (isAdminSubdomain && pathname === '/login')
  
  const loginPath = getAdminPath('/login', isAdminSubdomain)
  const dashboardPath = getAdminPath('/', isAdminSubdomain)
  const postsPath = getAdminPath('/posts', isAdminSubdomain)
  const categoriesPath = getAdminPath('/categories', isAdminSubdomain)
  const contactsPath = getAdminPath('/contacts', isAdminSubdomain)
  const settingsPath = getAdminPath('/settings', isAdminSubdomain)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && status === 'unauthenticated' && !isLoginPage) {
      router.push(loginPath)
    }
  }, [mounted, status, isLoginPage, router, loginPath])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!mounted || status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href={dashboardPath} className="text-xl font-bold">
              Admin Panel
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session.user?.email}</span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64">
            <nav className="space-y-2">
              <Link
                href={dashboardPath}
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                href={postsPath}
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Bài viết
              </Link>
              <Link
                href={categoriesPath}
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Danh mục
              </Link>
              <Link
                href={contactsPath}
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Liên hệ
              </Link>
              <Link
                href={settingsPath}
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Cài đặt
              </Link>
            </nav>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
