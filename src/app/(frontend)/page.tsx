import Link from 'next/link'

import { Classified } from '@/components/Classified'
import { JsonLd } from '@/components/JsonLd'
import { Polaroid, toneOf } from '@/components/Polaroid'
import { getClosedListings, getLeadStory } from '@/lib/data'
import { listingAddress, monthlyLine, priceLine } from '@/lib/format'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { FIRM_NAME, SITE_URL, getSite } from '@/lib/site'

export const metadata = pageMetadata({
  description:
    'Gad Realty NYC: a boutique New York brokerage and construction management firm. Selling, buying, renting, or creating a home of your own.',
  path: '/',
})

export default async function FrontPage() {
  const { locale, t } = await getText()
  const [site, lead, closed] = await Promise.all([getSite(locale), getLeadStory(), getClosedListings()])
  const f = t.frontPage

  const featured = lead ?? closed[0] ?? null
  const recent = closed.filter((l) => l.id !== featured?.id).slice(0, 3)
  const address = featured ? listingAddress(featured) : ''
  return (
    <main className="page">
      <section className="welcome" aria-labelledby="welcome-title">
        <div className="welcome__text">
          <h1 id="welcome-title" className="welcome__title">
            {f.title}
          </h1>
          <p className="welcome__standfirst">{f.standfirst}</p>
          <p className="welcome__intro">{f.intro}</p>
        </div>

        <div className="welcome__photo">
          {featured ? (
            <Link href={`/homes/${featured.slug}`} className="classified__link welcome__polaroid" aria-label={address}>
              <Polaroid
                media={featured.photos?.[0]?.image}
                alt={address}
                tone={toneOf(featured.status)}
                tilt={-1.4}
                large
                address={address}
                meta={`${t.status[featured.status]} · ${featured.neighborhood}`}
                price={priceLine(featured, t)}
                monthlies={monthlyLine(featured, t)}
                sizes="(min-width: 1000px) 560px, 90vw"
                priority
                placeholderLabel={t.placeholder.photoSoon}
              />
            </Link>
          ) : (
            <Polaroid media={null} tone="green" tilt={-1.4} large placeholderLabel={t.placeholder.photoSoon} />
          )}
        </div>
      </section>

      <section className="services" aria-label={FIRM_NAME}>
        {f.services.map((service) => (
          <article key={service.title} className="service">
            <h2 className="service__title">{service.title}</h2>
            <p>{service.text}</p>
            <Link href={service.href} className="button">
              {service.label}
            </Link>
          </article>
        ))}
      </section>

      <section className="work" aria-labelledby="work-title">
        <h2 id="work-title" className="block__title">
          {f.workTitle}
        </h2>
        <p className="work__text">{f.workText}</p>
        {recent.length ? (
          <div className="polaroids">
            {recent.map((listing, index) => (
              <Classified key={listing.id} listing={listing} t={t} locale={locale} index={index + 2} />
            ))}
          </div>
        ) : null}
        <p className="work__more">
          <Link href="/sold-and-rented" className="button">
            {f.workLabel}
          </Link>
        </p>
      </section>

      <section className="statement talk" aria-labelledby="talk-title">
        <h2 id="talk-title" className="talk__title">
          {f.talkTitle}
        </h2>
        <p className="statement__text">{f.talkText}</p>
        <div className="talk__buttons">
          <Link href="/the-office#find-us" className="button">
            {f.contactLabel}
          </Link>
          <Link href="/sell-with-us#valuation" className="button button--outline">
            {f.valuationLabel}
          </Link>
        </div>
      </section>

      <section className="languages" aria-labelledby="languages-title">
        <h2 id="languages-title" className="languages__title">
          {f.languagesTitle}
        </h2>
        <p>{f.languagesText}</p>
      </section>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: FIRM_NAME,
          url: SITE_URL,
          telephone: site.phone,
          email: site.email,
          address: { '@type': 'PostalAddress', streetAddress: site.address, addressCountry: 'US' },
          areaServed: 'New York City',
          knowsLanguage: ['en', 'fr', 'it', 'es', 'he'],
        }}
      />
    </main>
  )
}
