import Link from 'next/link'

import { Polaroid, tiltFor, toneOf } from '@/components/Polaroid'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/config'
import { listingAddress, monthlyLine, priceLine, shortLine } from '@/lib/format'
import type { Listing } from '@/payload-types'

/** One home, pinned up like an instant photograph with its address written underneath. */
export function Classified({
  listing,
  t,
  locale,
  index = 0,
  inquire = false,
}: {
  listing: Listing
  t: Dictionary
  locale: Locale
  index?: number
  inquire?: boolean
}) {
  const price = priceLine(listing, t)
  const address = listingAddress(listing)
  return (
    <article className="classified classified--card">
      <Link href={`/homes/${listing.slug}`} className="classified__link" aria-label={`${address}, ${t.status[listing.status]}`}>
        <Polaroid
          media={listing.photos?.[0]?.image}
          alt={address}
          tone={toneOf(listing.status)}
          tilt={tiltFor(index)}
          address={address}
          meta={`${t.status[listing.status]} · ${listing.neighborhood}`}
          price={price}
          monthlies={monthlyLine(listing, t)}
          placeholderLabel={t.placeholder.photoSoon}
        />
      </Link>
      <p className="classified__line">{shortLine(listing, t, locale)}</p>
      {inquire ? (
        <Link href={`/homes/${listing.slug}#inquire`} className="textlink inquire-link">
          {t.available.inquire}
        </Link>
      ) : null}
    </article>
  )
}
