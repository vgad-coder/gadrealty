import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Paragraphs } from '@/components/Prose'
import { VideoFrame } from '@/components/VideoFrame'
import { getNeighborhoodBySlug, getNeighborhoods } from '@/lib/data'
import { getText } from '@/lib/locale'
import { toPicture, toVideoSrc } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'
import { FIRM_NAME, SITE_URL } from '@/lib/site'
import { JsonLd } from '@/components/JsonLd'
import { parseFilm, type Film } from '@/lib/video'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { locale } = await getText()
  const hood = await getNeighborhoodBySlug(slug, locale)
  if (!hood) return { title: 'Not found' }
  return pageMetadata({
    title: hood.name,
    description: hood.tagline?.trim() || `${hood.name}, on film. A neighborhood by ${FIRM_NAME}.`,
    path: `/neighborhoods/${hood.slug}`,
    image: hood.poster,
  })
}

export default async function NeighborhoodPage({ params }: Props) {
  const { slug } = await params
  const { locale, t } = await getText()
  const hood = await getNeighborhoodBySlug(slug, locale)
  if (!hood) notFound()

  const all = await getNeighborhoods(locale)
  const others = all.filter((n) => n.id !== hood.id)

  const uploaded = toVideoSrc(hood.film)
  const film: Film | null = parseFilm(hood.filmUrl) ?? (uploaded ? { kind: 'file', fileUrl: uploaded } : null)
  const posterUrl = toPicture(hood.poster)?.src ?? null

  return (
    <main className="page">
      <article>
        <header className="hood__top">
          <span className="tag" style={{ fontStyle: 'normal', fontFamily: 'var(--font-label)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {t.neighborhoods.film}
          </span>
          <h1 className="hood__name">{hood.name}</h1>
        </header>

        <div className="hood__layout" style={film ? undefined : { gridTemplateColumns: 'minmax(0, 40rem)' }}>
          <div className="hood__side">
            {hood.tagline ? <p className="hood__tagline">{hood.tagline}</p> : null}
            <hr />
            <Paragraphs text={hood.body} />
            {film ? (
              <p className="label label--soft">
                {t.neighborhoods.filmBy}
                {hood.runtime ? `, ${hood.runtime}` : ''}
              </p>
            ) : null}
          </div>

          {film ? (
            <figure>
              <VideoFrame film={film} posterUrl={posterUrl} title={hood.name} playLabel={t.neighborhoods.play} />
              <figcaption className="caption">
                {t.neighborhoods.filmBy}
                {hood.runtime ? `, ${hood.runtime}` : ''}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </article>

      {others.length ? (
        <section className="archive" aria-labelledby="more-hoods">
          <h2 id="more-hoods" className="label label--green archive__title">
            {t.neighborhoods.more}
          </h2>
          <div className="jobs" style={{ marginTop: '0.75rem' }}>
            {others.map((n) => (
              <Link key={n.id} href={`/neighborhoods/${n.slug}`}>
                {n.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: hood.name,
          url: `${SITE_URL}/neighborhoods/${hood.slug}`,
          address: { '@type': 'PostalAddress', addressLocality: 'New York', addressRegion: 'NY', addressCountry: 'US' },
        }}
      />
    </main>
  )
}
