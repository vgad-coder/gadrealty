import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BuildingNotes } from '@/components/BuildingNotes'
import { JsonLd } from '@/components/JsonLd'
import { PlaceView } from '@/components/PlaceView'
import { getBuildingNotes } from '@/lib/building-notes'
import { getBuilding, summarize } from '@/lib/places'
import { getText } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const building = await getBuilding(slug)
  if (!building) return { title: 'Not found' }
  const first = building.listings[0]
  return pageMetadata({
    title: `${building.name}, ${first.neighborhood}: Homes Sold and Rented`,
    description: summarize(building, `at ${building.name} in ${first.neighborhood}, New York`),
    path: `/buildings/${building.slug}`,
    image: first.photos?.[0]?.image,
  })
}

export default async function BuildingPage({ params }: Props) {
  const { slug } = await params
  const { locale, t } = await getText()
  const building = await getBuilding(slug)
  if (!building) notFound()

  const first = building.listings[0]
  const intro = summarize(building, `at ${building.name} in ${first.neighborhood}`)
  const notes = await getBuildingNotes(building.name)

  return (
    <>
      <PlaceView
        title={building.name}
        standfirst={`Homes sold and rented at ${building.name}, ${first.neighborhood}.`}
        intro={intro}
        place={building}
        t={t}
        locale={locale}
        extra={notes ? <BuildingNotes building={notes} t={t} /> : null}
        valuationLine={`Own a home at ${building.name}? Let’s talk about what it is worth today.`}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${building.name}: homes sold and rented`,
          url: `${SITE_URL}/buildings/${building.slug}`,
          about: {
            '@type': 'Place',
            name: building.name,
            address: { '@type': 'PostalAddress', streetAddress: building.name, addressLocality: 'New York', addressRegion: 'NY', addressCountry: 'US' },
          },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: building.listings.map((l, i) => ({
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
