'use client'

import { signOut } from 'next-auth/react'

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' })
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

