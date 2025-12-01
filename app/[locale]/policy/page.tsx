import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'policy' })

  return {
    title: t('title'),
    description: t('privacyDescription'),
  }
}

export const dynamic = 'force-dynamic'

export default async function PolicyPage() {
  const t = await getTranslations('policy')

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>{t('privacyTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="prose">
              <p>
                {t('privacyDescription')}
              </p>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t('termsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="prose">
              <p>
                {t('termsDescription')}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}

