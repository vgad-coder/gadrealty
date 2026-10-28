import type { MetadataRoute } from 'next'

import { getArticles, getAvailableListings, getClosedListings, getNeighborhoods } from '@/lib/data'
import { getAreas, getBuildings } from '@/lib/places'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ['', '/sold-and-rented', '/available', '/tip-of-the-week', '/neighborhoods', '/the-office', '/sell-with-us', '/construction-management'].map(
    (path) => ({ url: `${SITE_URL}${path}`, changeFrequency: 'weekly' as const }),
  )

  try {
    // One after the other, so the local database is never asked four things at once.
    const closed = await getClosedListings()
    const available = await getAvailableListings()
    const articles = await getArticles('en')
    const hoods = await getNeighborhoods('en')
    const buildings = await getBuildings()
    const areas = await getAreas()
    return [
      ...fixed,
      ...[...available, ...closed].map((l) => ({
        url: `${SITE_URL}/homes/${l.slug}`,
        lastModified: l.updatedAt,
      })),
      ...articles.map((a) => ({
        url: `${SITE_URL}/tip-of-the-week/${a.slug}`,
        lastModified: a.updatedAt,
      })),
      ...buildings.map((b) => ({ url: `${SITE_URL}/buildings/${b.slug}`, changeFrequency: 'monthly' as const })),
      ...areas.map((a) => ({ url: `${SITE_URL}/areas/${a.slug}`, changeFrequency: 'monthly' as const })),
      ...hoods.map((n) => ({
        url: `${SITE_URL}/neighborhoods/${n.slug}`,
        lastModified: n.updatedAt,
      })),
    ]
  } catch (error) {
    console.error('[sitemap] could not list homes and articles:', error)
    return fixed
  }
}
