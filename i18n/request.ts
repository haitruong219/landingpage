import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { ALL_LOCALES } from '@/lib/i18n-settings'

type Messages = Record<string, any>

const messageCache = new Map<string, Messages>()

type MessageLoader = () => Promise<Messages>

const messageLoaders: Record<string, MessageLoader> = {
  vi: async () => {
    const module = await import('../messages/vi.json')
    return module.default
  },
  en: async () => {
    const module = await import('../messages/en.json')
    return module.default
  },
}

async function loadMessages(locale: string): Promise<Messages> {
  if (messageCache.has(locale)) {
    return messageCache.get(locale)!
  }

  const loader = messageLoaders[locale] || messageLoaders[routing.defaultLocale]
  
  if (!loader) {
    console.error(`No loader found for locale: ${locale}, using default`)
    return {}
  }

  try {
    const messages = await loader()
    messageCache.set(locale, messages)
    return messages
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    
    if (locale !== routing.defaultLocale) {
      try {
        const defaultLoader = messageLoaders[routing.defaultLocale]
        if (defaultLoader) {
          const defaultMessages = await defaultLoader()
          messageCache.set(locale, defaultMessages)
          return defaultMessages
        }
      } catch (fallbackError) {
        console.error('Failed to load default messages', fallbackError)
      }
    }
    
    return {}
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  const messages = await loadMessages(locale)

  return {
    locale,
    messages
  }
})

