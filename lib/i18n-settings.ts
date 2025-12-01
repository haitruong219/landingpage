import { prisma } from './prisma'

const ENABLED_LOCALES_KEY = 'enabled_locales'
const DEFAULT_LOCALE = 'vi'

export const ALL_LOCALES = ['vi', 'en'] as const
export type Locale = typeof ALL_LOCALES[number]

export async function getEnabledLocales(): Promise<Locale[]> {
  try {
    let setting = await prisma.setting.findUnique({
      where: { key: ENABLED_LOCALES_KEY },
    })

    if (!setting || !setting.value) {
      await initializeDefaultLocales()
      return [DEFAULT_LOCALE]
    }

    const locales = JSON.parse(setting.value) as string[]
    const validLocales = locales.filter((loc): loc is Locale =>
      ALL_LOCALES.includes(loc as Locale)
    )

    if (!validLocales.includes(DEFAULT_LOCALE)) {
      return [DEFAULT_LOCALE, ...validLocales.filter(l => l !== DEFAULT_LOCALE)]
    }

    return validLocales.length > 0 ? validLocales : [DEFAULT_LOCALE]
  } catch (error) {
    console.error('Error getting enabled locales:', error)
    return [DEFAULT_LOCALE]
  }
}

export async function setEnabledLocales(locales: Locale[]): Promise<void> {
  if (!locales.includes(DEFAULT_LOCALE)) {
    throw new Error('Vietnamese (vi) locale is required')
  }

  const uniqueLocales = Array.from(new Set(locales))

  await prisma.setting.upsert({
    where: { key: ENABLED_LOCALES_KEY },
    update: {
      value: JSON.stringify(uniqueLocales),
    },
    create: {
      key: ENABLED_LOCALES_KEY,
      value: JSON.stringify(uniqueLocales),
    },
  })
}

export async function initializeDefaultLocales(): Promise<void> {
  const existing = await prisma.setting.findUnique({
    where: { key: ENABLED_LOCALES_KEY },
  })

  if (!existing) {
    await prisma.setting.create({
      data: {
        key: ENABLED_LOCALES_KEY,
        value: JSON.stringify([DEFAULT_LOCALE]),
      },
    })
  }
}

