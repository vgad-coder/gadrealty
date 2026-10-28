import { cache } from 'react'

import { getPayloadClient } from '@/lib/data'
import { slugify } from '@/lib/slug'
import type { Building } from '@/payload-types'

/** Look up the building notes that match a home's street address. */
export const getBuildingNotes = cache(async (address: string): Promise<Building | null> => {
  const slug = slugify(address)
  if (!slug) return null
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'buildings',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  })
  return result.docs[0] ?? null
})
