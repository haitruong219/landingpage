'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function ContactPage() {
  const t = useTranslations('contact')
  
  const contactSchema = z.object({
    name: z.string().min(1, t('nameRequired')),
    email: z.string().email(t('emailInvalid')),
    phone: z.string().optional(),
    message: z.string().min(10, t('messageMin')),
  })

  type ContactFormData = z.infer<typeof contactSchema>

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>{t('title')}</CardTitle>
              <CardDescription>
                {t('subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">
                  {t('success')}
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                  {t('error')}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label={`${t('name')} ${t('required')}`}
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label={`${t('email')} ${t('required')}`}
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Input
                  label={t('phone')}
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <Textarea
                  label={`${t('message')} ${t('required')}`}
                  rows={6}
                  {...register('message')}
                  error={errors.message?.message}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? t('sending') : t('send')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}

