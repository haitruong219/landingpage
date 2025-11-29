import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { ProductsCarousel } from '@/components/sections/ProductsCarousel'
import { PartnersCarousel } from '@/components/sections/PartnersCarousel'
import { CTA } from '@/components/sections/CTA'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trang chủ',
  description: 'Website giới thiệu sản phẩm và dịch vụ chất lượng cao',
  openGraph: {
    title: 'Trang chủ',
    description: 'Website giới thiệu sản phẩm và dịch vụ chất lượng cao',
  },
}

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
