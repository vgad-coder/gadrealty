import Link from 'next/link'

import { Classified } from '@/components/Classified'
import { getClosedListings } from '@/lib/data'
import { closedYear } from '@/lib/format'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { slugify } from '@/lib/slug'

export const metadata = pageMetadata({
  title: 'Sold and Rented',
  description:
    'Every home Gad Realty NYC has sold or rented in New York, newest first, filed by year and neighborhood.',
  path: '/sold-and-rented',
})

type Search = { year?: string; neighborhood?: string; type?: string }

function buildHref(current: Search, change: Partial<Search>): string {
  const next: Search = { ...current, ...change }
  const params = new URLSearchParams()
  if (next.type) params.set('type', next.type)
  if (next.year) params.set('year', next.year)
  if (next.neighborhood) params.set('neighborhood', next.neighborhood)
  const query = params.toString()
  return query ? `/sold-and-rented?${query}` : '/sold-and-rented'
}

export default async function SoldAndRentedPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { locale, t } = await getText()
  const search = await searchParams
  const closed = await getClosedListings()

  const type = search.type === 'sold' || search.type === 'rented' ? search.type : undefined
  const year = search.year && /^\d{4}$/.test(search.year) ? search.year : undefined
  const neighborhood = search.neighborhood?.trim() || undefined
  const current: Search = { type, year, neighborhood }

  const years = [...new Set(closed.map((l) => closedYear(l)).filter((y): y is number => y !== null))].sort((a, b) => b - a)
  const neighborhoods = [...new Set(closed.map((l) => l.neighborhood))].sort((a, b) => a.localeCompare(b))

  const shown = closed.filter(
    (l) =>
      (!type || l.status === type) &&
      (!year || String(closedYear(l)) === year) &&
      (!neighborhood || l.neighborhood === neighborhood),
  )

  return (
    <main className="page">
      <header className="section-head">
        <h1 className="section-head__title">{t.soldRented.title}</h1>
        <p className="section-head__standfirst">{t.soldRented.standfirst}</p>
      </header>

      {closed.length > 0 ? (
        <div className="filters">
          <div className="filters__row">
            <span className="label filters__label">{t.soldRented.show}</span>
            <Link href={buildHref(current, { type: undefined })} aria-current={(!type) ? 'true' : undefined}>
              {t.soldRented.all}
            </Link>
            <Link href={buildHref(current, { type: 'sold' })} aria-current={(type === 'sold') ? 'true' : undefined}>
              {t.status.sold}
            </Link>
            <Link href={buildHref(current, { type: 'rented' })} aria-current={(type === 'rented') ? 'true' : undefined}>
              {t.status.rented}
            </Link>
          </div>
          {years.length > 1 ? (
            <div className="filters__row">
              <span className="label filters__label">{t.soldRented.year}</span>
              <Link href={buildHref(current, { year: undefined })} aria-current={(!year) ? 'true' : undefined}>
                {t.soldRented.allYears}
              </Link>
              {years.map((y) => (
                <Link key={y} href={buildHref(current, { year: String(y) })} aria-current={(year === String(y)) ? 'true' : undefined}>
                  {y}
                </Link>
              ))}
            </div>
          ) : null}
          {neighborhoods.length > 1 ? (
            <div className="filters__row">
              <span className="label filters__label">{t.soldRented.neighborhood}</span>
              <Link href={buildHref(current, { neighborhood: undefined })} aria-current={(!neighborhood) ? 'true' : undefined}>
                {t.soldRented.allNeighborhoods}
              </Link>
              {neighborhoods.map((n) => (
                <Link key={n} href={`/areas/${slugify(n)}`} aria-current={(neighborhood === n) ? 'true' : undefined}>
                  {n}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {shown.length === 0 ? (
        <p className="empty-note">{t.soldRented.nothingYet}</p>
      ) : (
        <div className="polaroids">
          {shown.map((listing, index) => (
            <Classified key={listing.id} listing={listing} t={t} locale={locale} index={index} />
          ))}
        </div>
      )}
    </main>
  )
}
