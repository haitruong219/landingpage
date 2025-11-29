'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { slugify } from '@/lib/utils'

const categorySchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên danh mục'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  description: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

export default function NewCategoryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  })

  const name = watch('name')
  const slug = watch('slug')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slug || slug === slugify(name || '')) {
      const newSlug = slugify(e.target.value)
      // This is a workaround - we'll handle it in the form
    }
  }

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          slug: data.slug || slugify(data.name),
        }),
      })

      if (response.ok) {
        router.push('/admin/categories')
      } else {
        alert('Có lỗi xảy ra')
      }
    } catch (error) {
      alert('Có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Thêm danh mục mới</h1>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Tên danh mục *"
              {...register('name')}
              error={errors.name?.message}
              onChange={(e) => {
                register('name').onChange(e)
                handleNameChange(e)
              }}
            />
            <Input
              label="Slug *"
              {...register('slug')}
              error={errors.slug?.message}
              placeholder={slugify(name || '')}
            />
            <Textarea
              label="Mô tả"
              rows={4}
              {...register('description')}
              error={errors.description?.message}
            />
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu danh mục'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

