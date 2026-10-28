import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BuildingNotes } from '@/components/BuildingNotes'
import { ElsewhereLinks } from '@/components/ElsewhereLinks'
import { InquiryForm } from '@/components/InquiryForm'
import { JsonLd } from '@/components/JsonLd'
import { Polaroid, tiltFor, toneOf } from '@/components/Polaroid'
import { Paragraphs } from '@/components/Prose'
import { VideoFrame } from '@/components/VideoFrame'
import { getListingBySlug } from '@/lib/data'
import { closedYear, describeHome, isClosed, listingAddress, monthlyLine, priceLine } from '@/lib/format'
import { webUrl } from '@/lib/links'
import { getBuildingNotes } from '@/lib/building-notes'
import { areaSlugOf, buildingSlugOf, getBuildings } from '@/lib/places'
import { getText } from '@/lib/locale'
import { toPicture } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'
import { parseFilm } from '@/lib/video'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { locale, t } = await getText()
  const listing = await getListingBySlug(slug)
  if (!listing) return { title: 'Not found' }
  return pageMetadata({
    title: listing.headline?.trim() || listingAddress(listing),
    description: listing.deck?.trim() || describeHome(listing, t, locale),
    path: `/homes/${listing.slug}`,
    image: listing.photos?.[0]?.image,
  })
}

export default async function HomePage({ params }: Props) {
  const { slug } = await params
  const { locale, t } = await getText()
  const listing = await getListingBySlug(slug)
  if (!listing) notFound()

  const address = listingAddress(listing)
  const closed = isClosed(listing)
  const price = priceLine(listing, t)
  const monthlies = monthlyLine(listing, t)
  const hasBuildingPage = (await getBuildings()).some((b) => b.slug === buildingSlugOf(listing))
  const elsewhere = [
    { label: 'StreetEasy', url: webUrl(listing.streetEasyUrl) },
    { label: 'Zillow', url: webUrl(listing.zillowUrl) },
    { label: 'MLS', url: webUrl(listing.mlsUrl) },
  ].filter((x): x is { label: string; url: string } => Boolean(x.url))
  const film = parseFilm(listing.filmUrl)
  const photos = (listing.photos ?? []).filter((p) => toPicture(p.image))
  const archPhoto = listing.archPhoto ?? photos[1]?.image ?? photos[0]?.image
  const notes = await getBuildingNotes(listing.address)
  const agent = listing.agent && typeof listing.agent === 'object' ? listing.agent : null
  const headline = listing.headline?.trim() || `${address} ${t.headlineWord[listing.status]}`

  return (
    <main className="page" style={{ maxWidth: '1000px' }}>
      <article>
        <header className="home__opening">
          <div className="home__polaroid">
            <Polaroid
              media={archPhoto}
              alt={address}
              tone={toneOf(listing.status)}
              tilt={-1.6}
              large
              address={address}
              sizes="(min-width: 1000px) 560px, 90vw"
              priority
              placeholderLabel={t.placeholder.photoSoon}
            />
          </div>
          <p className={`label tone-text tone-${toneOf(listing.status)}`}>
            {t.status[listing.status]}
            {closed && closedYear(listing) ? ` · ${closedYear(listing)}` : ''}
          </p>
          <h1 className="home__headline">{headline}</h1>
          {listing.deck ? <p className="home__deck">{listing.deck}</p> : null}
          <div>
            <p className="home__facts">{describeHome(listing, t, locale)}</p>
            {price ? <p className="home__price">{price}</p> : null}
            {monthlies ? <p className="home__monthlies">{monthlies}</p> : null}
            {elsewhere.length ? (
              <p className="home__elsewhere">
                <span className="label label--soft">{t.frontPage.alsoOn}</span> <ElsewhereLinks links={elsewhere} />
              </p>
            ) : null}
          </div>
        </header>

        {notes ? <BuildingNotes building={notes} t={t} /> : null}

        <hr className="home__rule" />

        {photos.length ? (
          <div className="gallery">
            {photos.map((photo, index) => (
              <figure key={photo.id ?? index} className="gallery__item">
                <Polaroid
                  media={photo.image}
                  alt={photo.caption || address}
                  tone={toneOf(listing.status)}
                  tilt={tiltFor(index + 1)}
                  natural
                  address={photo.caption || undefined}
                  sizes="(min-width: 1000px) 480px, 90vw"
                  priority={index === 0}
                  placeholderLabel={t.placeholder.photoSoon}
                />
              </figure>
            ))}
          </div>
        ) : null}

        {listing.description ? (
          <div style={{ marginTop: 'clamp(2rem, 5vw, 3.25rem)' }}>
            <Paragraphs text={listing.description} className="columns-2 dropcap" />
          </div>
        ) : null}

        {listing.construction ? (
          <section className="construction" aria-labelledby="construction">
            <h2 id="construction" className="label label--green construction__title">
              {t.home.construction}
            </h2>
            <Paragraphs text={listing.construction} className="columns-2" />
          </section>
        ) : null}

        {film ? (
          <section style={{ marginTop: 'clamp(2rem, 5vw, 3.25rem)' }} aria-label={t.home.film}>
            <VideoFrame film={film} title={headline} playLabel={t.neighborhoods.play} />
          </section>
        ) : null}

        {agent ? (
          <p className="byline">
            {t.home.handledBy}{' '}
            <Link href={`/the-office/${agent.slug}`}>{agent.name}</Link>
            {agent.phone ? (
              <>
                {' · '}
                <a href={`tel:${agent.phone.replace(/[^+\d]/g, '')}`}>{agent.phone}</a>
              </>
            ) : null}
          </p>
        ) : null}

        <nav className="home__more" aria-label={address}>
          {hasBuildingPage ? (
            <Link href={`/buildings/${buildingSlugOf(listing)}`} className="textlink">
              More homes at {listing.address}
            </Link>
          ) : null}
          <Link href={`/areas/${areaSlugOf(listing)}`} className="textlink">
            Homes in {listing.neighborhood}
          </Link>
        </nav>

        <section id="inquire" className="inquiry" aria-labelledby="inquire-title">
          {closed ? (
            <>
              <h2 id="inquire-title" className="inquiry__title">
                {t.sell.valuationTitle}
              </h2>
              <p className="inquiry__lead">{t.sell.valuationLead}</p>
              <div className="statement__links" style={{ justifyContent: 'flex-start' }}>
                <Link href="/sell-with-us#valuation" className="textlink">
                  {t.frontPage.requestValuation}
                </Link>
                <Link href="/sold-and-rented" className="textlink">
                  {t.home.backToList}
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 id="inquire-title" className="inquiry__title">
                {t.home.askAbout}
              </h2>
              <p className="inquiry__lead">{t.home.askLead}</p>
              <InquiryForm
                kind="listing"
                listingId={listing.id}
                labels={{ ...t.form, propertyAddress: t.form.propertyAddress }}
              />
            </>
          )}
        </section>
      </article>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Residence',
          name: headline,
          url: `${SITE_URL}/homes/${listing.slug}`,
          address: { '@type': 'PostalAddress', streetAddress: address, addressLocality: listing.neighborhood, addressRegion: 'NY', addressCountry: 'US' },
        }}
      />
    </main>
  )
}
