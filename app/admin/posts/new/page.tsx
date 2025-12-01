'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { FileUpload } from '@/components/admin/FileUpload'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

const postSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  content: z.string().min(1, 'Vui lòng nhập nội dung'),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
}).refine((data) => {
  const textContent = data.content.replace(/<[^>]*>/g, '').trim()
  return textContent.length >= 10
}, {
  message: 'Nội dung phải có ít nhất 10 ký tự',
  path: ['content'],
})

type PostFormData = z.infer<typeof postSchema>

export default function NewPostPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])

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
      content: '',
      coverImage: '',
    },
  })

  const content = watch('content')
  const coverImage = watch('coverImage')

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {})
  }, [])

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
            <FileUpload
              label="Ảnh cover"
              value={coverImage}
              onChange={(url) => setValue('coverImage', url)}
              error={errors.coverImage?.message}
            />
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                {...register('categoryId')}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Không có danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
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
              <RichTextEditor
                value={content}
                onChange={(value) => setValue('content', value)}
                error={errors.content?.message}
                placeholder="Nội dung của bài viết đầu tiên ở đây"
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

