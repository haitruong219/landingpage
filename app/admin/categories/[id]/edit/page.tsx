import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditCategoryForm from './EditCategoryForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface EditCategoryPageProps {
  params: { id: string }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  })

  if (!category) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Sửa danh mục</h1>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <EditCategoryForm category={category} />
        </CardContent>
      </Card>
    </div>
  )
}

