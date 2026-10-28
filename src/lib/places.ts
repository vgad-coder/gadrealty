import { cache } from 'react'

import { getAvailableListings, getClosedListings } from '@/lib/data'
import { formatMoney } from '@/lib/format'
import { slugify } from '@/lib/slug'
import type { Listing } from '@/payload-types'

export type Place = {
  slug: string
  name: string
  listings: Listing[]
}

function group(listings: Listing[], nameOf: (l: Listing) => string): Map<string, Place> {
  const places = new Map<string, Place>()
  for (const listing of listings) {
    const name = nameOf(listing).trim()
    const slug = slugify(name)
    if (!slug) continue
    const place = places.get(slug) ?? { slug, name, listings: [] }
    place.listings.push(listing)
    places.set(slug, place)
  }
  return places
}

async function everyHome(): Promise<Listing[]> {
  // One after the other, so the local database is never asked two things at once.
  const closed = await getClosedListings()
  const available = await getAvailableListings()
  return [...available, ...closed]
}

/** Buildings with at least two homes get their own page. A single home already has its own. */
export const getBuildings = cache(async (): Promise<Place[]> => {
  const places = group(await everyHome(), (l) => l.address)
  return [...places.values()].filter((p) => p.listings.length >= 2).sort((a, b) => b.listings.length - a.listings.length)
})

export const getAreas = cache(async (): Promise<Place[]> => {
  const places = group(await everyHome(), (l) => l.neighborhood)
  return [...places.values()].sort((a, b) => b.listings.length - a.listings.length)
})

export async function getBuilding(slug: string): Promise<Place | null> {
  return (await getBuildings()).find((p) => p.slug === slug) ?? null
}

export async function getArea(slug: string): Promise<Place | null> {
  return (await getAreas()).find((p) => p.slug === slug) ?? null
}

export const buildingSlugOf = (listing: Pick<Listing, 'address'>) => slugify(listing.address)
export const areaSlugOf = (listing: Pick<Listing, 'neighborhood'>) => slugify(listing.neighborhood)

/** A plain, factual sentence about the homes on a page. Nothing is guessed: it only uses what is on file. */
export function summarize(place: Place, where: string): string {
  const sold = place.listings.filter((l) => l.status === 'sold')
  const rented = place.listings.filter((l) => l.status === 'rented')
  const open = place.listings.filter((l) => l.status === 'for-sale' || l.status === 'for-rent')
  const bits: string[] = []
  if (sold.length) bits.push(`sold ${sold.length} ${sold.length === 1 ? 'home' : 'homes'}`)
  if (rented.length) bits.push(`rented ${rented.length} ${rented.length === 1 ? 'home' : 'homes'}`)
  let text = bits.length ? `Gad Realty NYC has ${bits.join(' and ')} ${where}.` : `Homes ${where} with Gad Realty NYC.`
  const soldPrices = sold.map((l) => l.price).filter((p): p is number => typeof p === 'number' && p > 0)
  if (soldPrices.length >= 2) {
    text += ` Sales ranged from ${formatMoney(Math.min(...soldPrices))} to ${formatMoney(Math.max(...soldPrices))}.`
  }
  const rentPrices = rented.map((l) => l.price).filter((p): p is number => typeof p === 'number' && p > 0)
  if (rentPrices.length >= 2) {
    text += ` Rentals ranged from ${formatMoney(Math.min(...rentPrices))} to ${formatMoney(Math.max(...rentPrices))} a month.`
  }
  if (open.length) text += ` ${open.length} ${open.length === 1 ? 'home is' : 'homes are'} available now.`
  return text
}
