import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản lý liên hệ</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách liên hệ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Họ tên</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">SĐT</th>
                  <th className="text-left p-2">Ngày gửi</th>
                  <th className="text-left p-2">Trạng thái</th>
                  <th className="text-left p-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b">
                    <td className="p-2">{contact.name}</td>
                    <td className="p-2">{contact.email}</td>
                    <td className="p-2">{contact.phone || '-'}</td>
                    <td className="p-2">{formatDate(contact.createdAt)}</td>
                    <td className="p-2">
                      {contact.read ? (
                        <span className="text-green-600">Đã đọc</span>
                      ) : (
                        <span className="text-blue-600">Chưa đọc</span>
                      )}
                    </td>
                    <td className="p-2">
                      <Link
                        href={`/admin/contacts/${contact.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length === 0 && (
              <p className="text-center py-8 text-gray-500">Chưa có liên hệ nào</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

