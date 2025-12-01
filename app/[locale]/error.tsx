'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
        <p className="text-gray-600 mb-4">
          {error.message || t('unknownError')}
        </p>
        <Button onClick={() => reset()}>
          {t('tryAgain')}
        </Button>
      </div>
    </div>
  )
}

