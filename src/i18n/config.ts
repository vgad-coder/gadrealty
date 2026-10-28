export const LOCALES = ['en', 'fr', 'it', 'es', 'he'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

/**
 * Languages visitors can switch to. English only at launch.
 * To switch another language on, add its code here once its pages are translated,
 * for example: ['en', 'fr', 'it', 'es', 'he'].
 */
export const ENABLED_LOCALES: Locale[] = ['en']

export const RTL_LOCALES: Locale[] = ['he']

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  he: 'עברית',
}

export const LOCALE_COOKIE = 'gazette-lang'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

export function directionOf(locale: Locale): 'ltr' | 'rtl' {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'
}
