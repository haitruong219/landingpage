import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

export async function BlogPreview() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Tin mới nhất</h2>
          <p className="text-gray-600 text-lg">
            Cập nhật những thông tin mới nhất từ chúng tôi
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả tin tức →
          </Link>
        </div>
      </div>
    </section>
  )
}

