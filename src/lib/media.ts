import type { Media } from '@/payload-types'

export type Picture = {
  src: string
  srcSet?: string
  width?: number
  height?: number
  alt: string
}

/** Turns an uploaded photograph into what an <img> needs. Returns null when nothing is attached. */
export function toPicture(media: number | Media | null | undefined, fallbackAlt = ''): Picture | null {
  if (!media || typeof media === 'number') return null
  const large = media.sizes?.large
  const card = media.sizes?.card
  const main = large?.url || media.url
  if (!main) return null

  const candidates: string[] = []
  if (card?.url && card.width) candidates.push(`${card.url} ${card.width}w`)
  if (large?.url && large.width) candidates.push(`${large.url} ${large.width}w`)
  if (!candidates.length && media.url && media.width) candidates.push(`${media.url} ${media.width}w`)

  return {
    src: main,
    srcSet: candidates.length > 1 ? candidates.join(', ') : undefined,
    width: large?.width ?? media.width ?? undefined,
    height: large?.height ?? media.height ?? undefined,
    alt: media.alt || fallbackAlt,
  }
}

export function toVideoSrc(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  if (!media.mimeType?.startsWith('video')) return null
  return media.url ?? null
}
