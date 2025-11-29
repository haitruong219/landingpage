import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  })

  if (!post || !post.published) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  })

  if (!post || !post.published) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <article>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="text-gray-600 mb-8">
              <time>{formatDate(post.createdAt)}</time>
              {post.category && (
                <span className="ml-4">• {post.category.name}</span>
              )}
            </div>
            {post.coverImage && (
              <div className="relative h-96 w-full mb-8">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

