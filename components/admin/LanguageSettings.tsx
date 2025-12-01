'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ALL_LOCALES, type Locale } from '@/lib/i18n-settings'

const LOCALE_NAMES: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
}

export function LanguageSettings() {
  const [enabledLocales, setEnabledLocales] = useState<Locale[]>(['vi'])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadEnabledLocales()
  }, [])

  const loadEnabledLocales = async () => {
    try {
      const response = await fetch('/api/admin/languages')
      if (response.ok) {
        const data = await response.json()
        setEnabledLocales(data.enabledLocales || ['vi'])
      }
    } catch (error) {
      console.error('Error loading enabled locales:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleLocale = (locale: Locale) => {
    if (locale === 'vi') {
      setMessage({ type: 'error', text: 'Không thể tắt tiếng Việt' })
      return
    }

    setEnabledLocales(prev => {
      if (prev.includes(locale)) {
        return prev.filter(l => l !== locale)
      } else {
        return [...prev, locale]
      }
    })
    setMessage(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabledLocales }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Đã lưu cài đặt ngôn ngữ thành công!' })
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Lưu thất bại' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu cài đặt' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Đang tải...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý ngôn ngữ</CardTitle>
        <CardDescription>
          Chọn các ngôn ngữ hiển thị trên website. Tiếng Việt luôn được bật.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ALL_LOCALES.map((locale) => {
            const isEnabled = enabledLocales.includes(locale)
            const isRequired = locale === 'vi'

            return (
              <label
                key={locale}
                className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggleLocale(locale)}
                  disabled={isRequired}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium">{LOCALE_NAMES[locale]}</div>
                  <div className="text-sm text-gray-500">
                    {locale.toUpperCase()} {isRequired && '(Bắt buộc)'}
                  </div>
                </div>
              </label>
            )
          })}

          {message && (
            <div
              className={`p-3 rounded ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Đang lưu...' : 'Lưu cài đặt ngôn ngữ'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

