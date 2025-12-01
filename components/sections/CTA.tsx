'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'

export function CTA() {
  const t = useTranslations('cta')

  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">
          {t('title')}
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          {t('description')}
        </p>
        <Link
          href="/contact"
          className={cn(
            'inline-flex items-center justify-center rounded-md font-medium transition-colors',
            'h-12 px-6 text-lg',
            'bg-gray-200 text-gray-900 hover:bg-gray-300'
          )}
        >
          {t('button')}
        </Link>
      </div>
    </section>
  )
}

