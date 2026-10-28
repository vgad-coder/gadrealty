import config from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'
import type { Agent, Article, Listing, Neighborhood, SiteSetting } from '@/payload-types'

/**
 * Everything the public pages read. Every call here goes through the same
 * access rules as the web API (overrideAccess: false), so unpublished drafts
 * and private prices never reach a visitor's browser.
 */
const PUBLIC = { overrideAccess: false } as const

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getSettings = cache(async (locale: Locale): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, fallbackLocale: 'en', depth: 0, ...PUBLIC })
})

const byUpdatedDesc = (a: Listing, b: Listing) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)

/** Newest closings first. Homes with no closing date go to the end of their year-less group. */
const byClosedDesc = (a: Listing, b: Listing) => {
  const ad = a.closedOn ? Date.parse(a.closedOn) : Number.NEGATIVE_INFINITY
  const bd = b.closedOn ? Date.parse(b.closedOn) : Number.NEGATIVE_INFINITY
  if (ad !== bd) return bd - ad
  return byUpdatedDesc(a, b)
}

export const getClosedListings = cache(async (): Promise<Listing[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'listings',
    where: { status: { in: ['sold', 'rented'] } },
    limit: 1000,
    pagination: false,
    depth: 2,
    ...PUBLIC,
  })
  return result.docs.sort(byClosedDesc)
})

export const getAvailableListings = cache(async (): Promise<Listing[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'listings',
    where: { status: { in: ['for-sale', 'for-rent'] } },
    limit: 500,
    pagination: false,
    depth: 2,
    ...PUBLIC,
  })
  return result.docs.sort(byUpdatedDesc)
})

export const getLeadStory = cache(async (): Promise<Listing | null> => {
  const payload = await getPayloadClient()
  const flagged = await payload.find({
    collection: 'listings',
    where: { leadStory: { equals: true } },
    sort: '-updatedAt',
    limit: 1,
    depth: 2,
    ...PUBLIC,
  })
  if (flagged.docs[0]) return flagged.docs[0]
  const closed = await getClosedListings()
  if (closed[0]) return closed[0]
  const available = await getAvailableListings()
  return available[0] ?? null
})

export const getListingBySlug = cache(async (slug: string): Promise<Listing | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'listings',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    ...PUBLIC,
  })
  return result.docs[0] ?? null
})

export const getAgents = cache(async (locale: Locale): Promise<Agent[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'agents',
    sort: 'order',
    limit: 100,
    pagination: false,
    depth: 1,
    locale,
    fallbackLocale: 'en',
    ...PUBLIC,
  })
  return result.docs
})

export const getAgentBySlug = cache(async (slug: string, locale: Locale): Promise<Agent | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'agents',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    locale,
    fallbackLocale: 'en',
    ...PUBLIC,
  })
  return result.docs[0] ?? null
})

export function agentIdOf(listing: Listing): number | null {
  const agent = listing.agent
  if (!agent) return null
  return typeof agent === 'number' ? agent : agent.id
}

export const getArticles = cache(async (locale: Locale): Promise<Article[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    sort: '-publishedOn',
    limit: 500,
    pagination: false,
    depth: 2,
    locale,
    fallbackLocale: 'en',
    ...PUBLIC,
  })
  return result.docs
})

export const getArticleBySlug = cache(async (slug: string, locale: Locale): Promise<Article | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    locale,
    fallbackLocale: 'en',
    ...PUBLIC,
  })
  return result.docs[0] ?? null
})

export const getNeighborhoods = cache(async (locale: Locale): Promise<Neighborhood[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'neighborhoods',
    sort: 'order',
    limit: 200,
    pagination: false,
    depth: 2,
    locale,
    fallbackLocale: 'en',
    ...PUBLIC,
  })
  return result.docs
})

export const getNeighborhoodBySlug = cache(async (slug: string, locale: Locale): Promise<Neighborhood | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'neighborhoods',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    locale,
    fallbackLocale: 'en',
    ...PUBLIC,
  })
  return result.docs[0] ?? null
})
