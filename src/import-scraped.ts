/**
 * Puts the homes copied from the old gadrealty.com into the new site.
 *
 *   node scripts/scrape-old-site.mjs                 (once: copies the old pages to data/old-site)
 *   npm run import:listings -- --dry                 (shows what would happen, writes nothing)
 *   npm run import:listings                          (writes to the database in .env, or the local one)
 *   npm run import:listings -- --replace-samples     (also removes the sample homes)
 *
 * Safe to run again: a home that is already in the site (same web address) is skipped.
 *
 * Homes that look complete go live. Homes with something doubtful (no street address, an
 * unclear borough, a price that looks wrong) are saved but left NOT approved, so they stay
 * hidden until someone looks at them in the back office. Nothing outside New York City is imported.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'

import config from './payload.config'

// Options can be given as words after the command or as environment settings
// (IMPORT_DRY=1, IMPORT_REPLACE_SAMPLES=1, IMPORT_REPLACE_IMPORTED=1).
const flag = (word: string, env: string) => process.argv.includes(word) || Boolean(process.env[env])
const dry = flag('--dry', 'IMPORT_DRY')
const replaceSamples = flag('--replace-samples', 'IMPORT_REPLACE_SAMPLES')
// Removes homes that an earlier import brought in (same web addresses), so they can be redone cleanly.
const replaceImported = flag('--replace-imported', 'IMPORT_REPLACE_IMPORTED')
const dataDir = path.resolve(process.cwd(), 'data', 'old-site')

type Status = 'for-sale' | 'for-rent' | 'sold' | 'rented'
type Borough = 'manhattan' | 'brooklyn' | 'queens' | 'bronx' | 'staten-island'
type PropertyType = 'apartment' | 'condo' | 'coop' | 'townhouse' | 'rental' | 'house' | 'commercial'

type Scraped = {
  slug: string
  pageTitle: string
  heading: string
  kind: string
  statusBadges: string[]
  price: number | null
  squareFeet: number | null
  bedrooms: number | null
  bathrooms: number | null
  facts: Record<string, string>
  agents: string[]
  description: string
  photoFiles: string[]
}

const SUFFIXES: Record<string, string> = {
  st: 'Street', street: 'Street', ave: 'Avenue', avenue: 'Avenue', pl: 'Place', place: 'Place', rd: 'Road', road: 'Road',
  pkwy: 'Parkway', parkway: 'Parkway', ln: 'Lane', lane: 'Lane', dr: 'Drive', drive: 'Drive', blvd: 'Boulevard',
  boulevard: 'Boulevard', way: 'Way', ct: 'Court', court: 'Court', terrace: 'Terrace', hwy: 'Highway', highway: 'Highway',
  sq: 'Square', square: 'Square', plaza: 'Plaza',
}
const DIRECTIONS: Record<string, string> = { e: 'East', w: 'West', n: 'North', s: 'South' }
const SUFFIX_RE = new RegExp(`^(.*?\\b(?:${Object.keys(SUFFIXES).join('|')}))\\b\\.?\\s*[,\\-–—]?\\s*(.*)$`, 'i')

function tidyWord(word: string): string {
  const bare = word.replace(/\.$/, '')
  const lower = bare.toLowerCase()
  if (SUFFIXES[lower]) return SUFFIXES[lower]
  if (DIRECTIONS[lower]) return DIRECTIONS[lower]
  if (/^\d+(st|nd|rd|th)$/i.test(bare)) return lower
  if (/^\d/.test(bare)) return bare.toUpperCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function splitStreet(raw: string): { street: string; unit?: string } | null {
  // Drop everything after the first comma that starts the city, but keep "#24B" style units.
  // "St Nicholas Avenue" is a saint, not a "Street".
  const text = raw
    .replace(/\s+/g, ' ')
    .replace(/\bSt\.?\s+(Nicholas|Marks|James|Johns?|Ann'?s|Pauls?)\b/i, (_, n: string) => `StX${n}`)
    .trim()
  const noCity = text.replace(/,\s*(New York|Brooklyn|Bronx|Queens|Astoria|Staten Island|NY|Lyndhurst)\b.*$/i, '')
  const match = noCity.match(SUFFIX_RE)
  if (!match || !/^\d/.test(match[1])) return null
  const street = match[1]
    .split(' ')
    .map((w) => (w.startsWith('StX') ? `St. ${tidyWord(w.slice(3))}` : tidyWord(w)))
    .join(' ')
  const rest = match[2]
    .replace(/^[,\-–—\s]+/, '')
    .replace(/^(apartment|apart\.?|apt\.?|unit|suite|ste\.?|#)\s*/i, '')
    .replace(/[,\s]+$/, '')
  return { street, unit: rest || undefined }
}

function formatUnit(unit?: string): string | undefined {
  if (!unit) return undefined
  const cleaned = unit.trim()
  if (/^(ph|penthouse|duplex|townhouse|garden)\b/i.test(cleaned)) return cleaned.toUpperCase() === cleaned ? cleaned : cleaned
  return `Apt ${cleaned.toUpperCase()}`
}

function boroughFromZip(heading: string): Borough | 'nj' | undefined {
  const zip = heading.match(/\b(\d{5})\b/)?.[1]
  if (!zip) return undefined
  const n = Number(zip)
  if (zip.startsWith('07')) return 'nj'
  if (n >= 10000 && n <= 10282) return 'manhattan'
  if (n >= 10300 && n <= 10314) return 'staten-island'
  if (n >= 10451 && n <= 10475) return 'bronx'
  if (n >= 11200 && n <= 11256) return 'brooklyn'
  if ((n >= 11000 && n <= 11109) || (n >= 11351 && n <= 11697)) return 'queens'
  return undefined
}

const BOROUGH_NAMES: Record<string, Borough> = {
  manhattan: 'manhattan', brooklyn: 'brooklyn', queens: 'queens', bronx: 'bronx', 'the bronx': 'bronx', 'staten island': 'staten-island',
}
const BOROUGH_LABEL: Record<Borough, string> = {
  manhattan: 'Manhattan', brooklyn: 'Brooklyn', queens: 'Queens', bronx: 'The Bronx', 'staten-island': 'Staten Island',
}

function statusOf(s: Scraped): Status | null {
  const label = (s.statusBadges[0] ?? '').toLowerCase()
  if (label.includes('sold')) return 'sold'
  if (label.includes('rented')) return 'rented'
  if (label.includes('rent')) return 'for-rent'
  if (label.includes('sale')) return 'for-sale'
  return null
}

function typeOf(s: Scraped, status: Status): PropertyType {
  const kind = s.kind.toLowerCase()
  if (kind.includes('office') || kind.includes('commercial')) return 'commercial'
  if (kind.includes('condo')) return 'condo'
  if (kind.includes('coop') || kind.includes('co-op')) return 'coop'
  if (kind.includes('house') || kind.includes('town')) return 'house'
  if (status === 'for-rent' || status === 'rented') return 'rental'
  return 'apartment'
}

type Plan = {
  slug: string
  status: Status
  address: string
  unit?: string
  borough: Borough
  neighborhood: string
  propertyType: PropertyType
  price?: number
  commonCharges?: number
  monthlyTaxes?: number
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  description: string
  agentName?: string
  photoFiles: string[]
  review: string[]
}

function plan(s: Scraped): Plan | { skip: string } {
  const status = statusOf(s)
  if (!status) return { skip: 'no status' }

  const title = s.pageTitle.replace(/^.*?[–—-]\s+(?=\d)/, '') // "Cobblestone Loft – 28 Laight street" -> "28 Laight street"
  const fromHeading = /^\d/.test(s.heading) ? splitStreet(s.heading) : null
  const fromTitle = splitStreet(title)
  const street = fromHeading?.street ?? fromTitle?.street
  const unit = formatUnit(fromHeading?.unit ?? fromTitle?.unit)

  // Borough: the old site's own label, otherwise the ZIP code in the address.
  const labelled = BOROUGH_NAMES[(s.facts['Boroughs'] ?? '').toLowerCase()]
  const zipBorough = boroughFromZip(s.heading)
  if (zipBorough === 'nj' || /new jersey/i.test(s.facts['Boroughs'] ?? '')) return { skip: 'New Jersey, outside New York City' }
  const placeText = [s.slug, s.pageTitle, s.heading, ...Object.values(s.facts)].join(' ')
  if (/hampton|montauk|sag harbor|amagansett|sagaponack|east end|long island/i.test(placeText)) {
    return { skip: 'Hamptons / Long Island (Gad Realty no longer works there)' }
  }
  // A full address with a ZIP code is more reliable than the old site's label (it called 753 St. Nicholas Avenue "The Bronx").
  const borough: Borough | undefined = (zipBorough as Borough | undefined) ?? labelled

  const review: string[] = []
  if (!street) review.push('no street address found')
  if (!borough) review.push('borough unclear')

  const rentLike = status === 'for-rent' || status === 'rented'
  let price: number | undefined = s.price ?? undefined
  if (price !== undefined && price < (rentLike ? 500 : 50_000)) {
    price = undefined // the price of a closed home is never shown, so only a missing asking price needs a look
  }
  if ((status === 'for-sale' || status === 'for-rent') && price === undefined) review.push('no price')

  const bedrooms = s.bedrooms && s.bedrooms <= 15 ? s.bedrooms : undefined
  if (s.bedrooms && s.bedrooms > 15) review.push(`bedrooms look wrong (${s.bedrooms})`)
  const bathrooms = s.bathrooms && s.bathrooms <= 15 ? s.bathrooms : undefined
  const squareFeet = s.squareFeet && s.squareFeet >= 100 ? s.squareFeet : undefined
  const clean = (v?: string) => (v && v !== 'null' && !/^\d+$/.test(v) ? v.trim() : '')
  const neighborhood = clean(s.facts['Neighborhood']) || BOROUGH_LABEL[borough ?? 'manhattan']

  const dollars = (label: string) => {
    const n = parseFloat((s.facts[label] ?? '').replace(/[^0-9.]/g, ''))
    return Number.isFinite(n) && n >= 50 ? Math.round(n) : undefined // the old site has a few junk values such as "$1"
  }
  const commonCharges = rentLike ? undefined : dollars('Common Charges')
  const monthlyTaxes = rentLike ? undefined : dollars('Real Estate Taxes')

  const features = (label: string) =>
    (s.facts[label] ?? '')
      .split('\n')
      .map((x) => x.replace(/^\$/, '').trim())
      .filter(Boolean)
  const notes = [
    features('Building Features').length ? `Building features: ${features('Building Features').join(', ')}.` : '',
    features('Property Features').length ? `Home features: ${features('Property Features').join(', ')}.` : '',
  ].filter(Boolean)

  return {
    slug: s.slug,
    status,
    address: street ?? (s.pageTitle || s.heading),
    unit,
    borough: borough ?? 'manhattan',
    neighborhood,
    propertyType: typeOf(s, status),
    price,
    commonCharges,
    monthlyTaxes,
    bedrooms,
    bathrooms,
    squareFeet,
    description: [s.description, notes.join(' ')].filter(Boolean).join('\n\n'),
    agentName: s.agents[0],
    photoFiles: s.photoFiles,
    review,
  }
}

async function main() {
  let scraped: Scraped[]
  try {
    scraped = JSON.parse(await readFile(path.join(dataDir, 'listings.json'), 'utf8'))
  } catch {
    throw new Error('Run "node scripts/scrape-old-site.mjs" first, it copies the old pages into data/old-site.')
  }

  const plans: Plan[] = []
  const skipped: string[] = []
  for (const s of scraped) {
    const result = plan(s)
    if ('skip' in result) skipped.push(`${s.slug}: ${result.skip}`)
    else plans.push(result)
  }

  const live = plans.filter((p) => !p.review.length)
  const held = plans.filter((p) => p.review.length)
  console.log(`[import] ${scraped.length} found, ${live.length} ready to publish, ${held.length} held for review, ${skipped.length} skipped`)
  for (const p of plans) {
    const place = [p.address, p.unit].filter(Boolean).join(', ')
    console.log(
      `  ${p.review.length ? 'HOLD' : ' ok '} [${p.status}] ${place} | ${p.neighborhood}, ${p.borough} | ${p.price ?? '-'} | ${p.bedrooms ?? '-'}bd ${p.bathrooms ?? '-'}ba | ${p.photoFiles.length} photos${p.review.length ? ' | ' + p.review.join('; ') : ''}`,
    )
  }
  for (const line of skipped) console.log(`  SKIP ${line}`)
  if (dry) {
    console.log('[import] Dry run: nothing was written.')
    return
  }

  const payload = await getPayload({ config })

  if (replaceSamples) {
    const removed = await payload.delete({ collection: 'listings', where: { isSample: { equals: true } }, overrideAccess: true })
    console.log(`[import] Removed ${removed.docs.length} sample homes`)
  }

  if (replaceImported) {
    const slugs = scraped.map((s) => s.slug)
    const old = await payload.find({
      collection: 'listings',
      where: { slug: { in: slugs }, isSample: { equals: false } },
      limit: 500,
      depth: 0,
      pagination: false,
      overrideAccess: true,
    })
    const mediaIds = new Set<number>()
    for (const doc of old.docs) {
      for (const p of doc.photos ?? []) if (typeof p.image === 'number') mediaIds.add(p.image)
      if (typeof doc.archPhoto === 'number') mediaIds.add(doc.archPhoto)
    }
    for (const doc of old.docs) await payload.delete({ collection: 'listings', id: doc.id, overrideAccess: true })
    for (const id of mediaIds) {
      try {
        await payload.delete({ collection: 'media', id, overrideAccess: true })
      } catch {
        // already gone
      }
    }
    console.log(`[import] Removed ${old.docs.length} earlier imported homes and ${mediaIds.size} photographs`)
  }

  const agents = await payload.find({ collection: 'agents', limit: 100, depth: 0, overrideAccess: true })
  const agentByName = new Map(agents.docs.map((a) => [a.name.toLowerCase(), a.id]))

  let added = 0
  let already = 0
  for (const p of plans) {
    const exists = await payload.find({
      collection: 'listings',
      where: { slug: { equals: p.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (exists.docs.length) {
      already++
      continue
    }

    const label = [p.address, p.unit].filter(Boolean).join(', ')
    const photos: { image: number }[] = []
    for (const [index, relative] of p.photoFiles.entries()) {
      try {
        const media = await payload.create({
          collection: 'media',
          data: { alt: `${label}, photograph ${index + 1}` },
          filePath: path.join(dataDir, relative),
          overrideAccess: true,
        })
        photos.push({ image: media.id })
      } catch (error) {
        console.error(`[import]   photo failed for ${label}: ${(error as Error).message}`)
      }
    }

    await payload.create({
      collection: 'listings',
      overrideAccess: true,
      data: {
        status: p.status,
        address: p.address,
        unit: p.unit,
        neighborhood: p.neighborhood,
        borough: p.borough,
        propertyType: p.propertyType,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        squareFeet: p.squareFeet,
        price: p.price,
        commonCharges: p.commonCharges,
        monthlyTaxes: p.monthlyTaxes,
        priceVisibility: 'auto',
        agent: p.agentName ? agentByName.get(p.agentName.toLowerCase()) : undefined,
        description: p.review.length ? `[To review: ${p.review.join('; ')}]\n\n${p.description}` : p.description,
        photos,
        slug: p.slug,
        approved: p.review.length === 0,
        isSample: false,
      },
    })
    added++
    console.log(`[import] ${p.review.length ? 'Held  ' : 'Added '} ${label} (${photos.length} photos)`)
  }
  console.log(`[import] Done. Added ${added}, already there ${already}.`)
}

try {
  await main()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
