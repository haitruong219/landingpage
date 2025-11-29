'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface DeleteCategoryButtonProps {
  categoryId: string
}

export function DeleteCategoryButton({ categoryId }: DeleteCategoryButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Có lỗi xảy ra khi xóa danh mục')
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa danh mục')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="text-red-600 hover:text-red-700"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? 'Đang xóa...' : 'Xóa'}
    </Button>
  )
}

