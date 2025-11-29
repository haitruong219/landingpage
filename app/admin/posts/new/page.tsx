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

const postSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  content: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
})

type PostFormData = z.infer<typeof postSchema>

export default function NewPostPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      published: false,
    },
  })

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/admin/posts')
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
      <h1 className="text-3xl font-bold mb-8">Thêm bài viết mới</h1>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Tiêu đề *"
              {...register('title')}
              error={errors.title?.message}
            />
            <Input
              label="Slug *"
              {...register('slug')}
              error={errors.slug?.message}
            />
            <Input
              label="Ảnh cover"
              {...register('coverImage')}
              error={errors.coverImage?.message}
            />
            <Textarea
              label="Mô tả ngắn"
              rows={3}
              {...register('excerpt')}
              error={errors.excerpt?.message}
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Nội dung *
              </label>
              <Textarea
                rows={15}
                {...register('content')}
                error={errors.content?.message}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                {...register('published')}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm">
                Xuất bản ngay
              </label>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu bài viết'}
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

