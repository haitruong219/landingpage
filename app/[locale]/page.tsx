import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { ProductsCarousel } from '@/components/sections/ProductsCarousel'
import { PartnersCarousel } from '@/components/sections/PartnersCarousel'
import { CTA } from '@/components/sections/CTA'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata.home' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
  }
}

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <BlogPreview />
        <ProductsCarousel />
        <PartnersCarousel />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

