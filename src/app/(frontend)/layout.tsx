import type { Metadata, Viewport } from 'next'
import { Caveat, Frank_Ruhl_Libre, Libre_Franklin, Playfair_Display, Source_Serif_4 } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/Footer'
import { Masthead } from '@/components/Masthead'
import { directionOf } from '@/i18n/config'
import { getText } from '@/lib/locale'
import { SITE_NAME, SITE_URL, getSite } from '@/lib/site'

import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const source = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-source',
  display: 'swap',
})

const franklin = Libre_Franklin({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-franklin',
  display: 'swap',
})

const hand = Caveat({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-caveat',
  display: 'swap',
})

const hebrew = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  variable: '--font-hebrew',
  display: 'swap',
  preload: false,
})

const DESCRIPTION =
  'Gad Realty NYC is a boutique New York real estate brokerage and construction management firm. Browse the homes we have sold and rented, and read our weekly tip.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} · Gad Realty NYC`, template: `%s · ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} · Gad Realty NYC`,
    description: DESCRIPTION,
    locale: 'en_US',
  },
}

export const viewport: Viewport = {
  themeColor: '#f2ead9',
  width: 'device-width',
  initialScale: 1,
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const { locale, t } = await getText()
  const site = await getSite(locale)

  return (
    <html
      lang={locale}
      dir={directionOf(locale)}
      className={`${playfair.variable} ${source.variable} ${franklin.variable} ${hand.variable} ${hebrew.variable}`}
    >
      <body>
        <a href="#story" className="skip-link">
          {t.skip}
        </a>
        <Masthead t={t} locale={locale} site={site} />
        <div id="story">{children}</div>
        <Footer t={t} locale={locale} site={site} />
      </body>
    </html>
  )
}
