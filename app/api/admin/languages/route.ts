import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { setEnabledLocales, ALL_LOCALES, type Locale } from '@/lib/i18n-settings'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { enabledLocales } = body

    if (!Array.isArray(enabledLocales)) {
      return NextResponse.json(
        { error: 'enabledLocales must be an array' },
        { status: 400 }
      )
    }

    const validLocales = enabledLocales.filter((loc): loc is Locale =>
      ALL_LOCALES.includes(loc as Locale)
    )

    await setEnabledLocales(validLocales)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Language settings update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update language settings' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { getEnabledLocales } = await import('@/lib/i18n-settings')
    const enabledLocales = await getEnabledLocales()
    return NextResponse.json({ enabledLocales })
  } catch (error) {
    console.error('Error getting enabled locales:', error)
    return NextResponse.json(
      { error: 'Failed to get language settings' },
      { status: 500 }
    )
  }
}

