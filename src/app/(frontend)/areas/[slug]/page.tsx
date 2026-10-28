import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { PlaceView } from '@/components/PlaceView'
import { getText } from '@/lib/locale'
import { getArea, getBuildings, summarize } from '@/lib/places'
import { pageMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const area = await getArea(slug)
  if (!area) return { title: 'Not found' }
  return pageMetadata({
    title: `${area.name}, New York: Homes Sold and Rented`,
    description: summarize(area, `in ${area.name}, New York`),
    path: `/areas/${area.slug}`,
    image: area.listings[0]?.photos?.[0]?.image,
  })
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params
  const { locale, t } = await getText()
  const area = await getArea(slug)
  if (!area) notFound()

  const buildings = (await getBuildings()).filter((b) => b.listings.some((l) => area.listings.some((a) => a.id === l.id)))
  return (
    <>
      <PlaceView
        title={area.name}
        standfirst={`Homes sold, rented and for sale in ${area.name}, New York.`}
        intro={summarize(area, `in ${area.name}`)}
        place={area}
        t={t}
        locale={locale}
        valuationLine={`Thinking of selling or renting in ${area.name}? Let’s talk about your home.`}
        extra={
          buildings.length ? (
            <section className="block" aria-labelledby="buildings-here">
              <h2 id="buildings-here" className="block__title">
                Buildings in {area.name}
              </h2>
              <ul className="jobs">
                {buildings.map((b) => (
                  <li key={b.slug}>
                    <Link href={`/buildings/${b.slug}`}>{b.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null
        }
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${area.name}: homes sold and rented`,
          url: `${SITE_URL}/areas/${area.slug}`,
          about: { '@type': 'Place', name: `${area.name}, New York` },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: area.listings.map((l, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${SITE_URL}/homes/${l.slug}`,
            })),
          },
        }}
      />
    </>
  )
}
