'use client'

import { signOut } from 'next-auth/react'
import { useIsAdminSubdomain, getAdminPath } from '@/lib/use-admin-path'

export function SignOutButton() {
  const isAdminSubdomain = useIsAdminSubdomain()
  const loginPath = getAdminPath('/login', isAdminSubdomain)
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: loginPath })
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-red-600 hover:text-red-700"
    >
      Đăng xuất
    </button>
  )
}

