import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
const r = await payload.find({ collection: 'listings', limit: 500, pagination: false, overrideAccess: true, depth: 0 })
const map = new Map<string, { n: number; hood: string; statuses: Set<string> }>()
for (const l of r.docs) {
  const k = l.address.trim()
  const e = map.get(k) ?? { n: 0, hood: l.neighborhood, statuses: new Set() }
  e.n++
  e.statuses.add(l.status)
  map.set(k, e)
}
console.log('total', r.docs.length, 'addresses', map.size)
for (const [k, e] of [...map].sort()) console.log(`${k} | ${e.hood} | ${e.n} | ${[...e.statuses].join(',')}`)
process.exit(0)
