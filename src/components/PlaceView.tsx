import Link from 'next/link'
import type { ReactNode } from 'react'

import { Classified } from '@/components/Classified'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/config'
import type { Place } from '@/lib/places'

/** A building or a neighborhood: a heading, a few honest sentences, and every home as a polaroid. */
export function PlaceView({
  title,
  standfirst,
  intro,
  place,
  t,
  locale,
  extra,
  valuationLine,
}: {
  title: string
  standfirst: string
  intro: string
  place: Place
  t: Dictionary
  locale: Locale
  extra?: ReactNode
  valuationLine: string
}) {
  return (
    <main className="page">
      <header className="section-head">
        <h1 className="section-head__title">{title}</h1>
        <p className="section-head__standfirst">{standfirst}</p>
      </header>

      <p className="place__intro">{intro}</p>

      <div className="polaroids">
        {place.listings.map((listing, index) => (
          <Classified key={listing.id} listing={listing} t={t} locale={locale} index={index} />
        ))}
      </div>

      {extra}

      <section className="statement talk" aria-label={valuationLine}>
        <p className="statement__text">{valuationLine}</p>
        <div className="talk__buttons">
          <Link href="/sell-with-us#valuation" className="button">
            {t.frontPage.valuationLabel}
          </Link>
          <Link href="/the-office#find-us" className="button button--outline">
            {t.frontPage.contactLabel}
          </Link>
        </div>
      </section>
    </main>
  )
}
