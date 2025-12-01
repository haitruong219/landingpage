'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export function Footer() {
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t('aboutUs')}</h3>
            <p className="text-gray-600 text-sm">
              {t('aboutDescription')}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('links')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-blue-600">
                  {tCommon('blog')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                  {tCommon('contact')}
                </Link>
              </li>
              <li>
                <Link href="/policy" className="text-gray-600 hover:text-blue-600">
                  {tCommon('policy')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('contactTitle')}</h3>
            <p className="text-gray-600 text-sm">
              {t('email')}: info@example.com<br />
              {t('phone')}: 0123 456 789
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} {tCommon('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  )
}

