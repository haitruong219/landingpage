import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditPostForm from './EditPostForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

interface EditPostPageProps {
  params: { id: string }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { category: true },
  })

  if (!post) {
    notFound()
  }

  const categories = await prisma.category.findMany()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Sửa bài viết</h1>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <EditPostForm post={post} categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}

