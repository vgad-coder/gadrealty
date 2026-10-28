import Link from 'next/link'

import { getNeighborhoods } from '@/lib/data'
import { getText } from '@/lib/locale'
import { getAreas } from '@/lib/places'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Neighborhoods',
  description:
    'Find your little corner of New York. Tribeca, the Upper West Side, the West Village, Brooklyn Heights, Park Slope and more, with Gad Realty NYC.',
  path: '/neighborhoods',
})

const BOROUGHS = ['manhattan', 'brooklyn', 'queens'] as const

export default async function NeighborhoodsPage() {
  const { locale, t } = await getText()
  const neighborhoods = await getNeighborhoods(locale)
  const areas = await getAreas()
  const areaSlugs = new Set(areas.map((a) => a.slug))

  const groups = BOROUGHS.map((borough) => ({
    borough,
    items: neighborhoods.filter((n) => (n.borough ?? 'manhattan') === borough),
  })).filter((g) => g.items.length)

  return (
    <main className="page">
      <header className="section-head">
        <h1 className="section-head__title">{t.neighborhoods.title}</h1>
        <p className="section-head__standfirst">{t.neighborhoods.standfirst}</p>
      </header>

      {groups.length ? (
        groups.map((g) => (
          <section key={g.borough} className="hoods" aria-labelledby={`hoods-${g.borough}`}>
            <h2 id={`hoods-${g.borough}`} className="label label--green hoods__borough">
              {t.neighborhoods[g.borough]}
            </h2>
            <div className="hoods__grid">
              {g.items.map((n) => {
                const hasFilm = Boolean(n.filmUrl || n.film)
                return (
                  <article key={n.id} className="hood-card" id={n.slug ?? undefined}>
                    <h3 className="hood-card__name">
                      {hasFilm ? <Link href={`/neighborhoods/${n.slug}`}>{n.name}</Link> : n.name}
                    </h3>
                    <p className="hood-card__text">
                      <span className="hood-card__lead">{n.tagline}</span> {n.body}
                    </p>
                    {n.slug && areaSlugs.has(n.slug) ? (
                      <Link href={`/areas/${n.slug}`} className="hood-card__link">
                        {t.neighborhoods.homesIn} {n.name}
                      </Link>
                    ) : (
                      <Link href="/the-office#find-us" className="hood-card__link">
                        {t.neighborhoods.askAbout} {n.name}
                      </Link>
                    )}
                    {hasFilm ? (
                      <Link href={`/neighborhoods/${n.slug}`} className="hood-card__link">
                        {t.neighborhoods.watch}
                      </Link>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </section>
        ))
      ) : (
        <p className="empty-note">{t.neighborhoods.none}</p>
      )}
    </main>
  )
}
