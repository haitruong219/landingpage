import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tin tức',
  description: 'Cập nhật những thông tin mới nhất từ chúng tôi',
  openGraph: {
    title: 'Tin tức',
    description: 'Cập nhật những thông tin mới nhất từ chúng tôi',
  },
}

interface BlogPageProps {
  searchParams: { page?: string; category?: string }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1')
  const categorySlug = searchParams.category
  const perPage = 12
  const skip = (page - 1) * perPage

  const where = {
    published: true,
    ...(categorySlug && {
      category: { slug: categorySlug },
    }),
  }

  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.post.count({ where }),
    prisma.category.findMany(),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Tin tức</h1>
          
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      {post.coverImage && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover rounded-t-lg"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription>
                          {formatDate(post.createdAt)}
                          {post.category && ` • ${post.category.name}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {post.excerpt || post.content.substring(0, 100)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Trước
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog?page=${p}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className={`px-4 py-2 border rounded ${
                        p === page
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Sau
                    </Link>
                  )}
                </div>
              )}
            </div>

            <aside className="w-64">
              <Card>
                <CardHeader>
                  <CardTitle>Danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link
                      href="/blog"
                      className={`block ${!categorySlug ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      Tất cả
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/blog?category=${cat.slug}`}
                        className={`block ${categorySlug === cat.slug ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

