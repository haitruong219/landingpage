'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Có lỗi xảy ra!</h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'Đã xảy ra lỗi không xác định'}
        </p>
        <Button onClick={() => reset()}>
          Thử lại
        </Button>
      </div>
    </div>
  )
}

