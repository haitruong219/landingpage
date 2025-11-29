import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(partners)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 })
  }
}

