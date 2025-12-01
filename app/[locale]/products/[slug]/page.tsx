import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    return {}
  }

  return {
    title: product.name,
    description: product.description || '',
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: product.image ? [product.image] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <article>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            {product.image && (
              <div className="relative h-96 w-full mb-8">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}
            {product.description && (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

