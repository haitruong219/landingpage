import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DeleteCategoryButton } from './DeleteCategoryButton'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <Button href="/admin/categories/new" asChild>
          Thêm danh mục
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {category._count.posts} bài viết
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button href={`/admin/categories/${category.id}/edit`} asChild variant="outline" size="sm">
                    Sửa
                  </Button>
                  <DeleteCategoryButton categoryId={category.id} />
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center py-8 text-gray-500">Chưa có danh mục nào</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

