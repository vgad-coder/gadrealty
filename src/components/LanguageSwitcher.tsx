import { setLocaleAction } from '@/app/(frontend)/actions'
import { ENABLED_LOCALES, LOCALE_NAMES, type Locale } from '@/i18n/config'

/** Appears only once more than one language is switched on in src/i18n/config.ts. */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  if (ENABLED_LOCALES.length < 2) return null
  return (
    <form action={setLocaleAction} className="lang" aria-label="Language">
      {ENABLED_LOCALES.map((code) => (
        <button
          key={code}
          type="submit"
          name="locale"
          value={code}
          lang={code}
          aria-current={code === locale ? 'true' : undefined}
        >
          {LOCALE_NAMES[code]}
        </button>
      ))}
    </form>
  )
}
