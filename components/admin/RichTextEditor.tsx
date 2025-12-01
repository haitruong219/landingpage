'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  error,
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null)

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor()
      const toolbar = quill.getModule('toolbar')
      toolbar.addHandler('image', function () {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
          const file = input.files?.[0]
          if (!file) return

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
            const range = quill.getSelection(true)
            quill.insertEmbed(range.index, 'image', data.url)
            quill.setSelection(range.index + 1)
          } catch (error) {
            console.error('Upload error:', error)
            alert('Có lỗi xảy ra khi upload ảnh')
          }
        }
      })
    }
  }, [])

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link', 'image', 'video'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['clean'],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  }

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'color',
    'background',
    'align',
  ]

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ minHeight: '300px' }}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      <style jsx global>{`
        .quill {
          background: white;
        }
        .quill .ql-container {
          min-height: 300px;
          font-size: 16px;
        }
        .quill .ql-editor {
          min-height: 300px;
        }
        .quill .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
}

