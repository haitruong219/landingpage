import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">{t('title')}</h2>
        <p className="text-gray-600 mb-8">
          {t('description')}
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          {t('backHome')}
        </Link>
      </div>
    </div>
  )
}

