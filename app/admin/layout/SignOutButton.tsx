'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useIsAdminSubdomain, getAdminPath } from '@/lib/use-admin-path'
import { useState } from 'react'

export function SignOutButton() {
  const router = useRouter()
  const isAdminSubdomain = useIsAdminSubdomain()
  const loginPath = getAdminPath('/login', isAdminSubdomain)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const result = await signOut({ 
        callbackUrl: loginPath,
        redirect: false 
      })
      
      if (result) {
        router.push(loginPath)
        router.refresh()
      }
    } catch (error) {
      console.error('Sign out error:', error)
      router.push(loginPath)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
    </button>
  )
}

