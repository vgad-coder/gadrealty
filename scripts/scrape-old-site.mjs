/**
 * Copies the listings from the current WordPress site (gadrealty.com) into data/old-site/.
 *
 *   node scripts/scrape-old-site.mjs
 *
 * - Reads the public listing pages only. Nothing on the old site is changed.
 * - The old site's security certificate has expired, so the pages are read over plain http.
 * - Writes data/old-site/listings.json and downloads each listing's photographs to
 *   data/old-site/images/<slug>/.
 */
import { mkdir, writeFile, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'data', 'old-site')
const BASE = 'http://www.gadrealty.com'
const MAX_PHOTOS = 12
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function get(url, binary = false) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url.replace('https://', 'http://'), { redirect: 'follow' })
      if (!res.ok) return null
      return binary ? Buffer.from(await res.arrayBuffer()) : await res.text()
    } catch {
      await wait(500 * attempt)
    }
  }
  return null
}

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const clean = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

function toText(html) {
  return decode(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function parse(html, slug) {
  const first = (re) => html.match(re)?.[1]

  const pageTitle = clean(first(/<title>([\s\S]*?)<\/title>/) ?? '').replace(/^Gad Realty NYC\s*\|\s*/i, '')
  const heading = clean(first(/<h2 class="mt-2 font-weight-semibold">([\s\S]*?)<\/h2>/) ?? '')
  const kind = clean(first(/apartment-badge text-muted pl-0"><b>([\s\S]*?)<\/b>/) ?? '')
  const statusBadges = [...html.matchAll(/<div class="apartment-badge (?!text-muted)[^"]*">\s*([\s\S]*?)\s*<\/div>/g)].map((m) => clean(m[1]))
  const priceText = first(/<span class="h1 font-weight-semibold my-3">\s*([^<&]*)/) ?? ''
  const price = Number(priceText.replace(/[^\d.]/g, '')) || null
  const sqft = Number((first(/fa-ruler-combined[\s\S]*?<span>\s*([\d,]+)/) ?? '').replace(/,/g, '')) || null
  const bedrooms = first(/(\d+(?:\.\d+)?)\s*Bedrooms?/i)
  const bathrooms = first(/(\d+(?:\.\d+)?)\s*Bathrooms?/i)

  const facts = {}
  for (const m of html.matchAll(/<li><span class="font-weight-semibold">([^<]*?):<\/span>\s*([\s\S]*?)<\/li>/g)) {
    facts[clean(m[1])] = toText(m[2])
  }

  const agents = [...html.matchAll(/<h6 class="m-0 font-weight-bold">([\s\S]*?)<\/h6>/g)].map((m) => clean(m[1]))
  const descriptionHtml = first(/<span class="text-muted">\s*([\s\S]*?)\s*<\/span>\s*<\/section>/) ?? ''

  const images = []
  for (const m of html.matchAll(/<img src='([^']+\/wp-content\/uploads\/[^']+)'[^>]*data-fit/g)) {
    if (!images.includes(m[1])) images.push(m[1])
  }

  return {
    slug,
    url: `${BASE}/property/${slug}/`,
    pageTitle,
    heading,
    kind,
    statusBadges,
    price,
    squareFeet: sqft,
    bedrooms: bedrooms === undefined ? null : Number(bedrooms),
    bathrooms: bathrooms === undefined ? null : Number(bathrooms),
    facts,
    agents,
    description: toText(descriptionHtml),
    images,
  }
}

async function exists(file) {
  try {
    await stat(file)
    return true
  } catch {
    return false
  }
}

async function main() {
  await mkdir(outDir, { recursive: true })

  // 1. Find every listing address on the archive pages.
  const slugs = []
  for (let page = 1; page < 40; page++) {
    const html = await get(page === 1 ? `${BASE}/property/` : `${BASE}/property/page/${page}/`)
    if (!html) break
    const found = [...html.matchAll(/href="https?:\/\/www\.gadrealty\.com\/property\/([^"\/]+)\/"/g)]
      .map((m) => m[1])
      .filter((s) => s !== 'feed' && s !== 'page')
    for (const s of found) if (!slugs.includes(s)) slugs.push(s)
    await wait(200)
  }
  console.log(`[scrape] Found ${slugs.length} listings`)

  // 2. Read each listing page and download its photographs.
  const listings = []
  for (const [index, slug] of slugs.entries()) {
    const html = await get(`${BASE}/property/${slug}/`)
    if (!html) {
      console.log(`[scrape] Could not read ${slug}`)
      continue
    }
    const listing = parse(html, slug)

    const dir = path.join(outDir, 'images', slug)
    await mkdir(dir, { recursive: true })
    const files = []
    for (const [n, url] of listing.images.slice(0, MAX_PHOTOS).entries()) {
      // The page shows cropped copies (…-870x350.jpg). Try the full-size original first.
      const original = url.replace(/-\d+x\d+(\.\w+)$/, '$1')
      const ext = path.extname(original) || '.jpg'
      const file = path.join(dir, `${String(n + 1).padStart(2, '0')}${ext}`)
      if (!(await exists(file))) {
        const data = (await get(original, true)) ?? (await get(url, true))
        if (!data) continue
        await writeFile(file, data)
        await wait(150)
      }
      files.push(path.relative(outDir, file).replaceAll('\\', '/'))
    }
    listing.photoFiles = files
    listings.push(listing)
    console.log(`[scrape] ${index + 1}/${slugs.length} ${listing.pageTitle || slug} (${files.length} photos)`)
    await wait(200)
  }

  await writeFile(path.join(outDir, 'listings.json'), JSON.stringify(listings, null, 2) + '\n')
  console.log(`[scrape] Saved ${listings.length} listings to data/old-site/listings.json`)
}

await main()
