import Link from 'next/link'

import { getNeighborhoods } from '@/lib/data'
import { getText } from '@/lib/locale'
import { factForToday, neighborhoodOfTheDay } from '@/lib/neighborhood-facts'
import { NEIGHBORHOOD_TEXT, splitText } from '@/lib/neighborhood-text'
import { getAreas } from '@/lib/places'
import { pageMetadata } from '@/lib/seo'
import { slugify } from '@/lib/slug'

export const metadata = pageMetadata({
  title: 'Neighborhoods',
  description:
    'Find your little corner of New York. Tribeca, the Upper West Side, the West Village, Brooklyn Heights, Park Slope and more, with Gad Realty NYC.',
  path: '/neighborhoods',
})

// The neighborhood and fact of the day change at midnight, so this page is built fresh for each visit.
export const dynamic = 'force-dynamic'

const BOROUGHS = ['manhattan', 'brooklyn', 'queens'] as const
type Borough = (typeof BOROUGHS)[number]

type Hood = {
  key: string
  name: string
  slug: string
  borough: Borough
  tagline: string
  body: string
  hasFilm: boolean
}

export default async function NeighborhoodsPage() {
  const { locale, t } = await getText()
  const stored = await getNeighborhoods(locale)
  const areas = await getAreas()
  const areaSlugs = new Set(areas.map((a) => a.slug))

  // Neighborhoods written in the back office come first. If there are none yet, the built-in descriptions show.
  const hoods: Hood[] = stored.length
    ? stored.map((n) => ({
        key: String(n.id),
        name: n.name,
        slug: n.slug ?? slugify(n.name),
        borough: (BOROUGHS as readonly string[]).includes(n.borough ?? 'manhattan') ? ((n.borough ?? 'manhattan') as Borough) : 'manhattan',
        tagline: n.tagline ?? '',
        body: n.body ?? '',
        hasFilm: Boolean(n.filmUrl || n.film),
      }))
    : NEIGHBORHOOD_TEXT.map((n) => ({
        key: n.name,
        name: n.name,
        slug: slugify(n.name),
        borough: n.borough,
        ...splitText(n.text),
        hasFilm: false,
      }))

  const groups = BOROUGHS.map((borough) => ({ borough, items: hoods.filter((h) => h.borough === borough) })).filter((g) => g.items.length)
  const today = neighborhoodOfTheDay()
  const todayHood = hoods.find((h) => h.slug === today.slug)

  return (
    <main className="page">
      <header className="section-head">
        <h1 className="section-head__title">{t.neighborhoods.title}</h1>
        <p className="section-head__standfirst">{t.neighborhoods.standfirst}</p>
      </header>

      {groups.length ? (
        <>
          <aside className="hood-day" aria-labelledby="hood-day-title">
            <p id="hood-day-title" className="label label--green">
              {t.neighborhoods.dayTitle}
            </p>
            <p className="hood-day__name">{today.name}</p>
            <p className="hood-day__fact">{today.fact}</p>
            {todayHood ? (
              <a href={`#${todayHood.slug}`} className="textlink">
                {t.neighborhoods.dayLink} {today.name}
              </a>
            ) : null}
          </aside>

          <nav className="chips chips--center" aria-label={t.neighborhoods.jumpTo}>
            {groups.map((g) => (
              <a key={g.borough} href={`#hoods-${g.borough}`} className="chip">
                {t.neighborhoods[g.borough]}
                <span className="chip__count">{g.items.length}</span>
              </a>
            ))}
          </nav>

          {groups.map((g) => (
            <section key={g.borough} className="hoods" aria-labelledby={`hoods-${g.borough}`}>
              <h2 id={`hoods-${g.borough}`} className="hoods__borough">
                {t.neighborhoods[g.borough]}
              </h2>
              <div className="hoods__grid">
                {g.items.map((n) => {
                  const fact = factForToday(n.name)
                  return (
                    <article key={n.key} className={`hood-card${n.slug === today.slug ? ' hood-card--today' : ''}`} id={n.slug}>
                      <h3 className="hood-card__name">
                        {n.hasFilm ? <Link href={`/neighborhoods/${n.slug}`}>{n.name}</Link> : n.name}
                      </h3>
                      {n.tagline ? <p className="hood-card__lead">{n.tagline}</p> : null}
                      {n.body ? <p className="hood-card__text">{n.body}</p> : null}
                      {fact ? (
                        <p className="hood-card__fact">
                          <span className="hood-card__fact-label">{t.neighborhoods.didYouKnow}</span> {fact}
                        </p>
                      ) : null}
                      <p className="hood-card__links">
                        {areaSlugs.has(n.slug) ? (
                          <Link href={`/areas/${n.slug}`} className="hood-card__link">
                            {t.neighborhoods.homesIn} {n.name}
                          </Link>
                        ) : (
                          <Link href="/the-office#find-us" className="hood-card__link">
                            {t.neighborhoods.askAbout} {n.name}
                          </Link>
                        )}
                        {n.hasFilm ? (
                          <Link href={`/neighborhoods/${n.slug}`} className="hood-card__link">
                            {t.neighborhoods.watch}
                          </Link>
                        ) : null}
                      </p>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </>
      ) : (
        <p className="empty-note">{t.neighborhoods.none}</p>
      )}
    </main>
  )
}
