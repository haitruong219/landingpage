'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export function Header() {
  const t = useTranslations('header')

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Logo
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              {t('home')}
            </Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">
              {t('blog')}
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              {t('contact')}
            </Link>
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  )
}

