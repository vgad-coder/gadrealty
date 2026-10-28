import type { Media } from '@/payload-types'
import { toPicture } from '@/lib/media'

type MediaRef = number | Media | null | undefined

/** A plain photograph. Renders nothing when no photograph is attached. */
export function Photo({
  media,
  alt = '',
  sizes = '(min-width: 1000px) 1100px, 100vw',
  priority = false,
}: {
  media: MediaRef
  alt?: string
  sizes?: string
  priority?: boolean
}) {
  const pic = toPicture(media, alt)
  if (!pic) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={pic.src}
      srcSet={pic.srcSet}
      sizes={pic.srcSet ? sizes : undefined}
      width={pic.width}
      height={pic.height}
      alt={pic.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}

function ArchIcon() {
  return (
    <svg viewBox="0 0 40 52" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 50V22C4 11 11 3 20 3s16 8 16 19v28Z" />
      <path d="M12 50V24c0-6 3.6-11 8-11s8 5 8 11v26" />
    </svg>
  )
}

/** Shown while a photograph is still to come. Keeps the page calm and on brand. */
export function Placeholder({ label }: { label: string }) {
  return (
    <div className="placeholder">
      <ArchIcon />
      <span className="label label--soft">{label}</span>
    </div>
  )
}

/**
 * A photograph the way a newspaper prints it: black and white with a fine dot
 * screen. Pass color for homes that are still available.
 */
export function Newsprint({
  media,
  alt = '',
  ratio = '3x2',
  color = false,
  sizes,
  priority,
  placeholderLabel,
}: {
  media: MediaRef
  alt?: string
  ratio?: '3x2' | '4x3' | '16x9' | '3x4'
  color?: boolean
  sizes?: string
  priority?: boolean
  placeholderLabel: string
}) {
  const hasPicture = Boolean(toPicture(media))
  return (
    <div className={`halftone ratio-${ratio}${color ? ' halftone--color' : ''}`}>
      {hasPicture ? (
        <Photo media={media} alt={alt} sizes={sizes} priority={priority} />
      ) : (
        <Placeholder label={placeholderLabel} />
      )}
    </div>
  )
}
