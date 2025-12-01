import { NextResponse } from 'next/server'
import { getEnabledLocales } from '@/lib/i18n-settings'

export async function GET() {
  try {
    const enabledLocales = await getEnabledLocales()
    return NextResponse.json({ enabledLocales })
  } catch (error) {
    console.error('Error getting enabled locales:', error)
    return NextResponse.json(
      { enabledLocales: ['vi'] },
      { status: 200 }
    )
  }
}

