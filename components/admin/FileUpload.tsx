'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface FileUploadProps {
  label?: string
  value?: string
  onChange: (url: string) => void
  error?: string
  accept?: string
}

export function FileUpload({
  label,
  value,
  onChange,
  error,
  accept = 'image/*',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(value || null)
  }, [value])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setPreview(data.url)
      onChange(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Có lỗi xảy ra khi upload ảnh')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <div className="space-y-2">
        {preview && (
          <div className="relative w-full max-w-md">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              asChild
            >
              <span>{isUploading ? 'Đang upload...' : 'Chọn ảnh'}</span>
            </Button>
          </label>
          {preview && (
            <input
              type="hidden"
              value={preview}
            />
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}

