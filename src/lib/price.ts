export type ListingStatus = 'for-sale' | 'for-rent' | 'sold' | 'rented'

type PriceDoc = { status?: string | null; priceVisibility?: string | null } | null | undefined

/**
 * Prices are shown on every listing, sold and rented included. A single
 * listing can be set to "never show" to keep its price private.
 */
export function priceIsPublic(doc: PriceDoc): boolean {
  if (!doc) return false
  return (doc.priceVisibility ?? 'auto') !== 'hide'
}
