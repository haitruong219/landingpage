'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export function Features() {
  const t = useTranslations('features')

  const features = [
    {
      title: t('feature1.title'),
      description: t('feature1.description'),
      icon: '✨',
    },
    {
      title: t('feature2.title'),
      description: t('feature2.description'),
      icon: '🚀',
    },
    {
      title: t('feature3.title'),
      description: t('feature3.description'),
      icon: '💡',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-gray-600 text-lg">
            {t('subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

