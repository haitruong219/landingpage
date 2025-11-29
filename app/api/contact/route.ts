import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendContactNotification } from '@/lib/email'

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      },
    })

    await sendContactNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    })

    if (process.env.WEBHOOK_URL) {
      try {
        await fetch(process.env.WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact),
        })
      } catch (error) {
        console.error('Webhook error:', error)
      }
    }

    return NextResponse.json({ success: true, id: contact.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Contact submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact' },
      { status: 500 }
    )
  }
}

