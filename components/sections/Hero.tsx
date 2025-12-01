'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'

export function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            {t('description')}
          </p>
          <div className="flex gap-4">
            <Link
              href="/contact"
              className={cn(
                'inline-flex items-center justify-center rounded-md font-medium transition-colors',
                'h-12 px-6 text-lg',
                'bg-gray-200 text-gray-900 hover:bg-gray-300'
              )}
            >
              {t('contactButton')}
            </Link>
            <Link
              href="/blog"
              className={cn(
                'inline-flex items-center justify-center rounded-md font-medium transition-colors',
                'h-12 px-6 text-lg',
                'bg-transparent border border-white text-white hover:bg-white/10'
              )}
            >
              {t('learnMoreButton')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

