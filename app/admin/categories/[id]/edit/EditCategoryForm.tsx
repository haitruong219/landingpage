'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

const categorySchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên danh mục'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  description: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface EditCategoryFormProps {
  category: {
    id: string
    name: string
    slug: string
    description: string | null
  }
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    },
  })

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Tên danh mục *"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Slug *"
        {...register('slug')}
        error={errors.slug?.message}
      />
      <Textarea
        label="Mô tả"
        rows={4}
        {...register('description')}
        error={errors.description?.message}
      />
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
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
  )
}

