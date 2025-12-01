'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/lib/i18n-settings'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const [enabledLocales, setEnabledLocales] = useState<Locale[]>(['vi'])

  useEffect(() => {
    fetch('/api/languages')
      .then(res => res.json())
      .then(data => {
        if (data.enabledLocales) {
          setEnabledLocales(data.enabledLocales)
        }
      })
      .catch(() => {
        setEnabledLocales(['vi'])
      })
  }, [])

  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

  if (enabledLocales.length <= 1) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {enabledLocales.map((loc) => (
        <Link
          key={loc}
          href={pathnameWithoutLocale}
          locale={loc}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            locale === loc
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}

