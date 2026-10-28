import type { Metadata } from 'next'

import type { Media } from '@/payload-types'
import { toPicture } from '@/lib/media'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
}: {
  title?: string
  description: string
  path: string
  image?: number | Media | null
  noindex?: boolean
}): Metadata {
  const picture = toPicture(image)
  const imageUrl = picture ? (picture.src.startsWith('http') ? picture.src : `${SITE_URL}${picture.src}`) : undefined
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} · Gad Realty NYC`
  return {
    title: title ?? undefined,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: path,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: { card: imageUrl ? 'summary_large_image' : 'summary', title: fullTitle, description },
  }
}
