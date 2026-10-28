import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/config'
import type { Listing } from '@/payload-types'
import { priceIsPublic } from '@/lib/price'

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

function intlLocale(locale: Locale): string {
  return locale === 'he' ? 'he-IL' : locale
}

/** Spelled out in English up to ten, like a newspaper. Digits everywhere else. */
function count(n: number, locale: Locale): string {
  if (locale === 'en' && Number.isInteger(n) && n >= 0 && n <= 10) return NUMBER_WORDS[n]
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 1 }).format(n)
}

export function capitalize(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function listingAddress(listing: Pick<Listing, 'address' | 'unit'>): string {
  return [listing.address, listing.unit].filter(Boolean).join(', ')
}

export function paragraphs(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function formatDate(value: string | Date, locale: Locale, style: 'long' | 'short' = 'long'): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat(
    intlLocale(locale),
    style === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York' }
      : { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/New_York' },
  ).format(date)
}

/** "Friday, October 23, 2026" in New York time. */
export function formatEditionDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York',
  }).format(date)
}

/** The year a home closed, or null when no closing date has been entered (nothing is guessed). */
export function closedYear(listing: Pick<Listing, 'closedOn'>): number | null {
  return listing.closedOn ? new Date(listing.closedOn).getUTCFullYear() : null
}

/** "Four rooms, two bedrooms, two baths, 2,100 square feet." */
export function describeHome(listing: Listing, t: Dictionary, locale: Locale): string {
  const f = t.facts
  const parts: string[] = []
  if (listing.rooms) parts.push(`${count(listing.rooms, locale)} ${listing.rooms === 1 ? f.room : f.rooms}`)
  if (listing.bedrooms) parts.push(`${count(listing.bedrooms, locale)} ${listing.bedrooms === 1 ? f.bedroom : f.bedrooms}`)
  if (listing.bathrooms) parts.push(`${count(listing.bathrooms, locale)} ${listing.bathrooms === 1 ? f.bath : f.baths}`)
  if (listing.squareFeet) parts.push(`${new Intl.NumberFormat(intlLocale(locale)).format(listing.squareFeet)} ${f.squareFeet}`)
  const homeFacts = parts.join(', ')
  const type = t.propertyType[listing.propertyType]
  const place = `${type} ${f.in} ${listing.neighborhood}`
  return capitalize(homeFacts ? `${homeFacts}. ${place}.` : `${place}.`)
}

/** The one line under an address in a classified: the deck when written, otherwise the facts. */
export function shortLine(listing: Listing, t: Dictionary, locale: Locale): string {
  return listing.deck?.trim() || describeHome(listing, t, locale)
}

/** The price line, or null when it is meant to stay private. */
export function priceLine(listing: Listing, t: Dictionary): string | null {
  if (!priceIsPublic(listing)) return null
  if (listing.price == null) return null
  const money = formatMoney(listing.price)
  if (listing.status === 'rented') return `${t.facts.rentedFor} ${money}${t.facts.perMonthShort}`
  if (listing.status === 'for-rent') return `${t.facts.rentOf} ${money} ${t.facts.perMonth}`
  if (listing.status === 'sold') return `${t.facts.soldFor} ${money}`
  return `${t.facts.asking} ${money}`
}

/** The monthly costs of owning: "Common charges $1,640/mo · Taxes $2,176/mo". Null for rentals or when not entered. */
export function monthlyLine(listing: Listing, t: Dictionary): string | null {
  if (listing.status === 'for-rent' || listing.status === 'rented') return null
  const parts: string[] = []
  if (listing.commonCharges) {
    const label = listing.propertyType === 'coop' ? t.facts.maintenance : t.facts.commonCharges
    parts.push(`${label} ${formatMoney(listing.commonCharges)}${t.facts.perMonthShort}`)
  }
  if (listing.monthlyTaxes) parts.push(`${t.facts.taxes} ${formatMoney(listing.monthlyTaxes)}${t.facts.perMonthShort}`)
  return parts.length ? parts.join(' · ') : null
}

export function isClosed(listing: Pick<Listing, 'status'>): boolean {
  return listing.status === 'sold' || listing.status === 'rented'
}
