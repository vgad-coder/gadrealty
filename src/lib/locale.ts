import { cookies } from 'next/headers'

import { DEFAULT_LOCALE, ENABLED_LOCALES, LOCALE_COOKIE, isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

/** The language chosen by the visitor. English until more languages are switched on. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  if (isLocale(value) && ENABLED_LOCALES.includes(value)) return value
  return DEFAULT_LOCALE
}

export async function getText() {
  const locale = await getLocale()
  return { locale, t: getDictionary(locale) }
}
