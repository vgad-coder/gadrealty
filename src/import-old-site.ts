/**
 * Brings every home from the current gadrealty.com (WordPress) into the new site.
 *
 *   npm run import:old            (reads the old public pages, writes to the database in .env)
 *   npm run import:old -- --dry   (only shows what it found, writes nothing)
 *
 * It can be run again safely: homes that are already in the new site (same web address)
 * are skipped. Photographs are copied to wherever the new site keeps its media
 * (a local folder on a laptop, Vercel Blob on the live site).
 *
 * Only public pages are read. The old site's security certificate has expired, so the
 * certificate check is switched off for requests to gadrealty.com and nowhere else.
 */
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import https from 'node:https'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'

import config from './payload.config'

const dry = process.argv.includes('--dry')
const OLD = 'https://www.gadrealty.com'
const oldSiteAgent = new https.Agent({ rejectUnauthorized: false })

function fetchOld(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https
      .get(url, { agent: oldSiteAgent, headers: { 'User-Agent': 'GadGazette-import/1.0' } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume()
          resolve(fetchOld(new URL(res.headers.location, url).toString()))
          return
        }
        if (res.statusCode !== 200) {
          res.resume()
          reject(new Error(`${res.statusCode} for ${url}`))
          return
        }
        const chunks: Buffer[] = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks)))
      })
      .on('error', reject)
  })
}

const getText = async (url: string) => (await fetchOld(url)).toString('utf8')

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#038;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")

const text = (html: string) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

const STATUS_PAGES = ['for-rent', 'for-sale', 'rented', 'sold'] as const
type Status = 'for-sale' | 'for-rent' | 'sold' | 'rented'

async function collectUrls(): Promise<Map<string, Status>> {
  const found = new Map<string, Status>()
  for (const status of STATUS_PAGES) {
    for (let page = 1; page <= 30; page++) {
      const url =
        page === 1
          ? `${OLD}/our-listings/?real_status=${status}`
          : `${OLD}/our-listings/page/${page}/?real_status=${status}`
      let html: string
      try {
        html = await getText(url)
      } catch {
        break
      }
      const urls = [
        ...new Set(
          [...html.matchAll(/href="(https?:\/\/(?:www\.)?gadrealty\.com\/property\/[^"#?]+)"/g)].map((m) => m[1]),
        ),
      ]
      const fresh = urls.filter((u) => !found.has(u))
      fresh.forEach((u) => found.set(u, status))
      if (!fresh.length) break
    }
  }
  return found
}

type Parsed = {
  url: string
  slug: string
  status: Status
  title: string
  address: string
  unit?: string
  typeLabel: string
  price?: number
  squareFeet?: number
  bedrooms?: number
  bathrooms?: number
  borough: string
  neighborhood: string
  building?: string
  buildingFeatures: string[]
  propertyFeatures: string[]
  description: string
  agentName?: string
  photos: string[]
}

const BOROUGHS: Record<string, string> = {
  manhattan: 'manhattan',
  brooklyn: 'brooklyn',
  queens: 'queens',
  bronx: 'bronx',
  'the bronx': 'bronx',
  'staten island': 'staten-island',
}

function parseStatus(label: string, fallback: Status): Status {
  const l = label.toLowerCase()
  if (l.includes('sold')) return 'sold'
  if (l.includes('rented')) return 'rented'
  if (l.includes('rent')) return 'for-rent'
  if (l.includes('sale')) return 'for-sale'
  return fallback
}

function parsePage(url: string, html: string, listStatus: Status): Parsed {
  const slug = decodeURIComponent(url.replace(/\/$/, '').split('/').pop() ?? '')
  const title = text(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').replace(/^Gad Realty NYC\s*\|\s*/, '')

  const aside = html.split('single-property-container-aside-block')[1] ?? ''
  const typeLabel = text(aside.match(/apartment-badge text-muted[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '')
  const statusLabel = text(aside.match(/apartment-badge red[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '')
  const h2 = text(aside.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? '')
  const priceText = text(aside.match(/<span class="h1[^>]*>([\s\S]*?)<\/span>/)?.[1] ?? '')
  const price = Number(priceText.replace(/[^0-9]/g, '')) || undefined

  const lis = [...(aside.split('list-inline text-muted')[1] ?? '').split('</ul>')[0].matchAll(/<span>([\s\S]*?)<\/span>/g)].map(
    (m) => text(m[1]),
  )
  let squareFeet: number | undefined
  let bedrooms: number | undefined
  let bathrooms: number | undefined
  for (const li of lis) {
    const n = Number(li.replace(/[^0-9.]/g, ''))
    if (!n) continue
    if (/bedroom/i.test(li)) bedrooms = n
    else if (/bathroom/i.test(li)) bathrooms = n
    else squareFeet = n
  }

  const details = html.split('single-property-container-details-block')[1] ?? ''
  const field = (label: string) => {
    const m = details.match(new RegExp(`<span class="font-weight-semibold">${label}:</span>([\\s\\S]*?)</li>`))
    return m ? m[1] : ''
  }
  const list = (label: string) =>
    field(label)
      .split(/<br\s*\/?>/)
      .map((s) => text(s).replace(/^\$/, '').trim())
      .filter(Boolean)

  const descHtml = details.match(/<span class="text-muted">([\s\S]*?)<\/span>\s*<\/section>/)?.[1] ?? ''
  const description = decode(
    descHtml
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<\/p>\s*<p[^>]*>/g, '\n\n')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const photos = [
    ...new Set(
      [...html.matchAll(/<img src='(https:\/\/www\.gadrealty\.com\/wp-content\/uploads\/[^']+)' alt='[^']*' data-fit='cover'/g)].map(
        (m) => m[1].replace(/-\d+x\d+(\.\w+)$/, '$1'),
      ),
    ),
  ]

  const agentName = text(html.match(/<h6 class="m-0 font-weight-bold">([\s\S]*?)<\/h6>/)?.[1] ?? '') || undefined

  // The address is the heading. When the page title has more after it (an apartment number) that is the unit.
  const address = h2 || title
  let unit: string | undefined
  if (h2 && title.toLowerCase().startsWith(h2.toLowerCase()) && title.length > h2.length) {
    unit = title.slice(h2.length).replace(/^[\s,#-]+/, '').trim() || undefined
  } else if (h2 && !title.toLowerCase().includes(h2.toLowerCase().split(' ')[0])) {
    unit = undefined
  }

  return {
    url,
    slug,
    status: parseStatus(statusLabel, listStatus),
    title,
    address: address.replace(/\s+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\b(\d+)(St|Nd|Rd|Th)\b/g, (_, n, s) => n + s.toLowerCase()),
    unit: unit ? unit.toUpperCase() === unit ? unit : unit : undefined,
    typeLabel,
    price,
    squareFeet,
    bedrooms: bedrooms || undefined,
    bathrooms: bathrooms || undefined,
    borough: BOROUGHS[text(field('Boroughs')).toLowerCase()] ?? 'manhattan',
    neighborhood: text(field('Neighborhood')),
    building: text(field('Building')) || undefined,
    buildingFeatures: list('Building Features'),
    propertyFeatures: list('Property Features'),
    description,
    agentName,
    photos,
  }
}

function propertyType(p: Parsed): 'condo' | 'coop' | 'townhouse' | 'rental' | 'house' | 'commercial' {
  const label = p.typeLabel.toLowerCase()
  const body = `${p.description} ${p.title}`.toLowerCase()
  if (label.includes('commercial')) return 'commercial'
  if (label.includes('condo')) return 'condo'
  if (label.includes('coop') || label.includes('co-op')) return 'coop'
  if (label.includes('house') || body.includes('townhouse')) return label.includes('house') ? 'house' : 'townhouse'
  if (label.includes('rental') || p.status === 'for-rent' || p.status === 'rented') return 'rental'
  if (/co-?op/.test(body)) return 'coop'
  return 'condo'
}

function story(p: Parsed): string {
  const extra: string[] = []
  if (p.building && p.building.toLowerCase() !== p.address.toLowerCase()) extra.push(`Building: ${p.building}.`)
  if (p.buildingFeatures.length) extra.push(`Building features: ${p.buildingFeatures.join(', ')}.`)
  if (p.propertyFeatures.length) extra.push(`Home features: ${p.propertyFeatures.join(', ')}.`)
  return [p.description, extra.join(' ')].filter(Boolean).join('\n\n')
}

async function main() {
  console.log('[import] Reading the list of homes from the current gadrealty.com ...')
  const urls = await collectUrls()
  console.log(`[import] Found ${urls.size} homes.`)

  const homes: Parsed[] = []
  for (const [url, status] of urls) {
    try {
      homes.push(parsePage(url, await getText(url), status))
    } catch (error) {
      console.error(`[import] Could not read ${url}:`, (error as Error).message)
    }
  }

  const counts = homes.reduce<Record<string, number>>((acc, h) => ((acc[h.status] = (acc[h.status] ?? 0) + 1), acc), {})
  console.log('[import] By status:', JSON.stringify(counts))
  for (const h of homes) {
    console.log(
      `  - [${h.status}] ${h.address}${h.unit ? ' / ' + h.unit : ''} | ${h.neighborhood || '?'} | $${h.price ?? '?'} | ${h.bedrooms ?? '-'}bd ${h.bathrooms ?? '-'}ba | ${h.photos.length} photos | ${h.agentName ?? 'no agent'} | /${h.slug}`,
    )
  }
  if (dry) {
    console.log('[import] Dry run: nothing was written.')
    return
  }

  const payload = await getPayload({ config })

  // Agents by name; anyone missing is added.
  const agents = await payload.find({ collection: 'agents', limit: 100, depth: 0, overrideAccess: true })
  const agentByName = new Map(agents.docs.map((a) => [a.name.toLowerCase(), a.id]))
  for (const name of new Set(homes.map((h) => h.agentName).filter(Boolean) as string[])) {
    if (!agentByName.has(name.toLowerCase())) {
      const created = await payload.create({ collection: 'agents', data: { name }, overrideAccess: true })
      agentByName.set(name.toLowerCase(), created.id)
      console.log(`[import] Added agent ${name}`)
    }
  }

  const work = await mkdtemp(path.join(tmpdir(), 'gazette-import-'))
  const mediaCache = new Map<string, number>()
  try {
    let added = 0
    let skipped = 0
    for (const h of homes) {
      const exists = await payload.find({
        collection: 'listings',
        where: { slug: { equals: h.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (exists.docs.length) {
        skipped++
        continue
      }

      const photos: { image: number }[] = []
      for (const [index, src] of h.photos.entries()) {
        let id = mediaCache.get(src)
        if (!id) {
          try {
            const bytes = await fetchOld(src).catch(() => fetchOld(src.replace(/(\.\w+)$/, '-scaled$1')))
            const file = path.join(work, `${h.slug}-${index + 1}${path.extname(new URL(src).pathname) || '.jpg'}`)
            await writeFile(file, bytes)
            const media = await payload.create({
              collection: 'media',
              data: { alt: `${h.address}${h.unit ? ', ' + h.unit : ''}, photograph ${index + 1}` },
              filePath: file,
              overrideAccess: true,
            })
            id = media.id
            mediaCache.set(src, id)
          } catch (error) {
            console.error(`[import]   photo failed ${src}: ${(error as Error).message}`)
            continue
          }
        }
        photos.push({ image: id })
      }

      await payload.create({
        collection: 'listings',
        overrideAccess: true,
        data: {
          status: h.status,
          address: h.address,
          unit: h.unit,
          neighborhood: h.neighborhood || 'New York',
          borough: h.borough as 'manhattan',
          propertyType: propertyType(h),
          bedrooms: h.bedrooms,
          bathrooms: h.bathrooms,
          squareFeet: h.squareFeet,
          price: h.price,
          priceVisibility: 'auto',
          agent: h.agentName ? agentByName.get(h.agentName.toLowerCase()) : undefined,
          description: story(h),
          photos,
          slug: h.slug,
          approved: true,
          isSample: false,
        },
      })
      added++
      console.log(`[import] Added ${h.address}${h.unit ? ' ' + h.unit : ''} (${photos.length} photos)`)
    }
    console.log(`[import] Done. Added ${added}, already there ${skipped}.`)
  } finally {
    await rm(work, { recursive: true, force: true })
  }
}

try {
  await main()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
