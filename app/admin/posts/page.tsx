import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản lý bài viết</h1>
        <Button href="/admin/posts/new" asChild>
          Thêm bài viết
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tiêu đề</th>
                  <th className="text-left p-2">Danh mục</th>
                  <th className="text-left p-2">Trạng thái</th>
                  <th className="text-left p-2">Ngày tạo</th>
                  <th className="text-left p-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b">
                    <td className="p-2">{post.title}</td>
                    <td className="p-2">{post.category?.name || '-'}</td>
                    <td className="p-2">
                      {post.published ? (
                        <span className="text-green-600">Đã xuất bản</span>
                      ) : (
                        <span className="text-gray-500">Bản nháp</span>
                      )}
                    </td>
                    <td className="p-2">{formatDate(post.createdAt)}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button href={`/admin/posts/${post.id}/edit`} asChild variant="outline" size="sm">
                          Sửa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && (
              <p className="text-center py-8 text-gray-500">Chưa có bài viết nào</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

