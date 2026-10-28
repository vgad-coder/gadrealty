import Link from 'next/link'

import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/config'
import { formatEditionDate } from '@/lib/format'
import { factOfTheDay } from '@/lib/fun-facts'
import { SITE_NAME, type Site } from '@/lib/site'

import { Nav } from './Nav'

export function Masthead({ t, locale, site }: { t: Dictionary; locale: Locale; site: Site }) {
  const items = [
    { href: '/', label: t.nav.frontPage },
    { href: '/sold-and-rented', label: t.nav.soldAndRented },
    { href: '/available', label: t.nav.available },
    { href: '/construction-management', label: t.nav.construction },
    { href: '/tip-of-the-week', label: t.nav.tip },
    { href: '/neighborhoods', label: t.nav.neighborhoods },
    { href: '/the-office', label: t.nav.office },
    { href: '/sell-with-us', label: t.nav.sell },
  ]

  return (
    <header className="masthead">
      <Link href="/" className="masthead__title" aria-label={`${SITE_NAME}: ${t.nav.frontPage}`}>
        {SITE_NAME}
      </Link>
      <div className="masthead__dateline">
        <span>{formatEditionDate(new Date(), locale)}</span>
        <span aria-hidden="true">·</span>
        <span>{site.mastheadLine}</span>
      </div>
      <p className="masthead__fact">
        <span className="masthead__fact-label">{t.factOfTheDay}</span> {factOfTheDay()}
      </p>
      {site.establishedLine ? <p className="masthead__since">{site.establishedLine}</p> : null}
      <Nav items={items} label={t.menu} />
    </header>
  )
}
