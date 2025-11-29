import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface ContactDetailPageProps {
  params: { id: string }
}

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
  })

  if (!contact) {
    notFound()
  }

  await prisma.contact.update({
    where: { id: params.id },
    data: { read: true },
  })

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/contacts" className="text-blue-600 hover:text-blue-700">
          ← Quay lại
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Họ tên</label>
            <p className="mt-1">{contact.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1">{contact.email}</p>
          </div>
          {contact.phone && (
            <div>
              <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
              <p className="mt-1">{contact.phone}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Ngày gửi</label>
            <p className="mt-1">{formatDate(contact.createdAt)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Nội dung</label>
            <p className="mt-1 whitespace-pre-wrap">{contact.message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

