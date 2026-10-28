import type { CSSProperties, ReactNode } from 'react'

import { Photo, Placeholder } from '@/components/Photo'
import { toPicture } from '@/lib/media'
import type { Listing, Media } from '@/payload-types'

type MediaRef = number | Media | null | undefined

/** The colour that goes with each kind of home: it tints the tape, the label and an empty picture. */
export type Tone = 'sold' | 'rented' | 'sale' | 'rent' | 'green'

export function toneOf(status: Listing['status']): Tone {
  return { 'for-sale': 'sale', 'for-rent': 'rent', sold: 'sold', rented: 'rented' }[status] as Tone
}

// A fixed set of small tilts, so the pictures look pinned up by hand but never change between visits.
const TILTS = [-2.2, 1.6, -1, 2.1, -1.7, 0.9, -0.6, 1.9]
export const tiltFor = (index: number) => TILTS[Math.abs(index) % TILTS.length]

/**
 * An instant photograph: colour picture, white frame, a strip of coloured tape and a
 * handwritten line underneath. Always a block-level span so it can sit inside a link.
 */
export function Polaroid({
  media,
  alt = '',
  tone = 'green',
  tilt = 0,
  address,
  meta,
  price,
  monthlies,
  placeholderLabel,
  sizes = '(min-width: 1000px) 340px, 90vw',
  priority = false,
  natural = false,
  large = false,
  portrait = false,
  tape = true,
}: {
  media: MediaRef
  alt?: string
  tone?: Tone
  tilt?: number
  address?: ReactNode
  meta?: ReactNode
  /** "Sold for $1,200,000", written under the address. */
  price?: ReactNode
  /** "Common charges $1,640/mo · Taxes $2,176/mo" */
  monthlies?: ReactNode
  portrait?: boolean
  placeholderLabel: string
  sizes?: string
  priority?: boolean
  /** Keep the picture's own shape instead of cropping it to the frame. */
  natural?: boolean
  large?: boolean
  tape?: boolean
}) {
  const hasPicture = Boolean(toPicture(media))
  const classes = ['polaroid', `tone-${tone}`, natural ? 'polaroid--natural' : '', large ? 'polaroid--large' : '', portrait ? 'polaroid--portrait' : '']
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes} style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
      {tape ? <span className="polaroid__tape" aria-hidden="true" /> : null}
      <span className="polaroid__photo">
        {hasPicture ? (
          <Photo media={media} alt={alt} sizes={sizes} priority={priority} />
        ) : (
          <Placeholder label={placeholderLabel} />
        )}
      </span>
      {address || meta || price || monthlies ? (
        <span className="polaroid__caption">
          {address ? <span className="polaroid__address">{address}</span> : null}
          {meta ? <span className="polaroid__meta">{meta}</span> : null}
          {price ? <span className="polaroid__price">{price}</span> : null}
          {monthlies ? <span className="polaroid__monthlies">{monthlies}</span> : null}
        </span>
      ) : (
        <span className="polaroid__caption polaroid__caption--empty" />
      )}
    </span>
  )
}
