import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default async function AdminDashboard() {
  const [postsCount, contactsCount, categoriesCount, unreadContacts] = await Promise.all([
    prisma.post.count(),
    prisma.contact.count(),
    prisma.category.count(),
    prisma.contact.count({ where: { read: false } }),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tổng bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{postsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{categoriesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tổng liên hệ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{contactsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Liên hệ chưa đọc</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{unreadContacts}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

