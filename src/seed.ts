/**
 * Fills the site with a few sample homes, tips and neighborhoods so you can see
 * the Gazette with something on every page.
 *
 *   npm run seed          add the sample content (safe to run again)
 *   npm run seed:clear    remove everything marked "Sample content"
 *
 * The three agents are real (from the current gadrealty.com). The homes, tips
 * and neighborhood films are placeholders and are marked as samples.
 */
import { getPayload } from 'payload'

import { NEIGHBORHOOD_TEXT, splitText } from './lib/neighborhood-text'
import { slugify } from './lib/slug'
import config from './payload.config'

const clear = process.argv.includes('--clear')

const text = (value: string) => ({
  type: 'text',
  version: 1,
  text: value,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
})

const paragraph = (value: string) => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  textFormat: 0,
  textStyle: '',
  children: [text(value)],
})

const richText = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
    children: paragraphs.map(paragraph),
  },
})

const SAMPLE_NOTE = 'Sample content: replace or delete this before the site goes live.'

type Status = 'for-sale' | 'for-rent' | 'sold' | 'rented'

const sampleListings: Array<{
  address: string
  unit?: string
  neighborhood: string
  status: Status
  closedOn?: string
  propertyType: 'condo' | 'coop' | 'townhouse' | 'rental' | 'house' | 'commercial'
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  price?: number
  headline?: string
  deck: string
  description: string
  construction?: string
  leadStory?: boolean
  agentSlug: string
}> = [
  {
    address: '28 Aldous Street',
    unit: 'Apt 12A',
    neighborhood: 'Tribeca',
    status: 'sold',
    closedOn: '2025-09-12',
    propertyType: 'condo',
    rooms: 5,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2400,
    deck: 'A corner loft-style residence, opened up and finished from the first plans.',
    description:
      'Tall windows, wide-plank oak floors and a kitchen that opens to the living room.\n\nThe apartment was taken back to its walls, re-planned, and brought to market as a finished home.',
    construction:
      'Gad Realty managed the work from the first plans to the last coat of paint: a new layout, new mechanical systems, custom millwork, and a kitchen moved to the corner so the room could breathe.',
    leadStory: true,
    agentSlug: 'vanessa-gad',
  },
  {
    address: '810 Meridian Avenue',
    unit: 'Apt 10B',
    neighborhood: 'Upper East Side',
    status: 'sold',
    closedOn: '2025-04-22',
    propertyType: 'coop',
    rooms: 7,
    bedrooms: 3,
    bathrooms: 3,
    deck: 'Full-floor residence with park views and grand proportions.',
    description: 'A prewar full-floor co-op with a gallery, a formal dining room and three bedrooms facing the park.',
    agentSlug: 'vanessa-gad',
  },
  {
    address: '15 East Linden Street',
    neighborhood: 'Upper East Side',
    status: 'sold',
    closedOn: '2024-11-08',
    propertyType: 'townhouse',
    rooms: 9,
    bedrooms: 5,
    bathrooms: 4,
    deck: 'Historic townhouse with a garden and a rooftop terrace.',
    description: 'Five floors, original mantels, and a garden that is a surprise from the street.',
    construction: 'Roof terrace, new stair rail and a restored facade were managed by Gad Realty before the sale.',
    agentSlug: 'vanessa-gad',
  },
  {
    address: '300 Fenwick Park West',
    unit: 'Apt 16C',
    neighborhood: 'Upper West Side',
    status: 'rented',
    closedOn: '2025-02-03',
    propertyType: 'rental',
    rooms: 4,
    bedrooms: 2,
    bathrooms: 2,
    deck: 'Elegant prewar classic with park views.',
    description: 'A bright two-bedroom with high ceilings and original details, leased to a long-term tenant.',
    agentSlug: 'silvia-gaviria',
  },
  {
    address: '120 Calder Street',
    unit: 'Apt 6A',
    neighborhood: 'Park Slope',
    status: 'sold',
    closedOn: '2024-06-17',
    propertyType: 'coop',
    rooms: 5,
    bedrooms: 2,
    bathrooms: 1,
    deck: 'Charming prewar co-op with a sunroom and original detail.',
    description: 'Sunny corner rooms, a sunroom study, and a short walk to the park.',
    agentSlug: 'gerard-bianco-jr',
  },
  {
    address: '1010 Harmon Avenue',
    unit: 'Apt 4B',
    neighborhood: 'Upper East Side',
    status: 'rented',
    closedOn: '2024-03-28',
    propertyType: 'rental',
    rooms: 4,
    bedrooms: 2,
    bathrooms: 1,
    deck: 'Gracious residence in a white-glove, full-service building.',
    description: 'A quiet two-bedroom with a formal entry and a doorman building.',
    agentSlug: 'silvia-gaviria',
  },
  {
    address: '4 West Orchard Street',
    unit: 'PH',
    neighborhood: 'Chelsea',
    status: 'sold',
    closedOn: '2023-10-05',
    propertyType: 'condo',
    rooms: 5,
    bedrooms: 2,
    bathrooms: 2,
    deck: 'Penthouse with a private terrace and spectacular city views.',
    description: 'Two bedrooms and a terrace that runs the length of the living room.',
    agentSlug: 'gerard-bianco-jr',
  },
  {
    address: '40 Sutton Row',
    neighborhood: 'Gramercy',
    status: 'sold',
    closedOn: '2023-05-19',
    propertyType: 'townhouse',
    rooms: 8,
    bedrooms: 4,
    bathrooms: 3,
    deck: 'Beautifully renovated townhouse with a garden oasis.',
    description: 'Renovated from the cellar to the roof, with a garden kitchen and a library on the parlor floor.',
    construction: 'A full renovation, managed by Gad Realty from permits through the final walk-through.',
    agentSlug: 'vanessa-gad',
  },
  {
    address: '52 Wexler Place',
    unit: 'Apt 5D',
    neighborhood: 'Tribeca',
    status: 'for-sale',
    propertyType: 'condo',
    rooms: 4,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1650,
    price: 3250000,
    deck: 'A two-bedroom loft with thirteen-foot ceilings and a windowed kitchen.',
    description: 'Cast-iron columns, oversized windows and quiet cobblestone views.',
    agentSlug: 'vanessa-gad',
  },
  {
    address: '215 Larkin Street',
    unit: 'Apt 3R',
    neighborhood: 'Greenwich Village',
    status: 'for-rent',
    propertyType: 'rental',
    rooms: 3,
    bedrooms: 1,
    bathrooms: 1,
    price: 6800,
    deck: 'A renovated one-bedroom with a home office and new kitchen.',
    description: 'Newly finished, with a south-facing living room and a quiet bedroom.',
    agentSlug: 'silvia-gaviria',
  },
]

const sampleTips = [
  {
    title: 'What to Fix Before You Sell',
    summary: 'Buyers and inspectors notice safety, systems and surfaces first. Start there.',
    caption: 'A bright apartment in renovation.',
    paragraphs: [
      'Buyers notice more than you think. A few strategic updates and repairs can increase appeal, smooth the path to contract, and protect your bottom line.',
      'Start with what buyers and inspectors scrutinize most: safety, systems and surfaces that show. A working boiler, tidy wiring, sound windows and fresh paint speak louder than any listing description.',
      'Then leave the rest alone. A renovation done for the buyer is rarely the renovation the buyer wants. Walk through with someone who builds, and decide what is worth doing before the photographer arrives.',
    ],
    daysAgo: 3,
  },
  {
    title: 'Reading a Co-op Alteration Agreement',
    summary: 'What the board asks for, and how to keep a renovation on schedule.',
    caption: '',
    paragraphs: [
      'In a co-op, the walls belong to the building long before they belong to you. An alteration agreement is the document that lets you change them.',
      'Read it with your contractor before you sign: working hours, insurance, protection of common areas and the board\u2019s fees all shape the schedule and the budget.',
    ],
    daysAgo: 10,
  },
]

const agents = [
  {
    name: 'Vanessa Gad',
    slug: 'vanessa-gad',
    title: 'Broker and Construction Manager',
    phone: '1-917-582-9003',
    order: 1,
    bio: 'Vanessa Gad is Gad Realty\u2019s CEO and broker, and a construction manager who runs a project from the first plans to the finished work. She has 32 years of experience buying and selling real estate in both Europe and New York, with more than $500 million in residential and commercial sales.\n\nWith a background in art, diamonds and real estate, Vanessa nurtures high-end transactions and provides exceptional customer service. Over her career she has managed more than 80 agents. Today she owns her own boutique agency, giving buyers and sellers individual attention.',
  },
  { name: 'Gerard Bianco Jr.', slug: 'gerard-bianco-jr', phone: '917-836-3949', order: 2 },
]

async function main() {
  const payload = await getPayload({ config })

  if (clear) {
    for (const collection of ['listings', 'articles', 'neighborhoods'] as const) {
      const result = await payload.delete({
        collection,
        where: { isSample: { equals: true } },
        overrideAccess: true,
      })
      console.log(`[seed] Removed ${result.docs.length} sample ${collection}`)
    }
    return
  }

  // Broker login, only if both values are set in .env.
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (email && password) {
    const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
    if (!existing.docs.length) {
      await payload.create({ collection: 'users', data: { email, password, name: 'Vanessa Gad', role: 'broker' } })
      console.log(`[seed] Created broker login for ${email}`)
    }
  }

  // Agents (real people, safe to keep).
  const agentIds: Record<string, number> = {}
  for (const agent of agents) {
    const found = await payload.find({ collection: 'agents', where: { slug: { equals: agent.slug } }, limit: 1 })
    if (found.docs[0]) {
      agentIds[agent.slug] = found.docs[0].id
    } else {
      const created = await payload.create({ collection: 'agents', data: agent })
      agentIds[agent.slug] = created.id
      console.log(`[seed] Added agent ${agent.name}`)
    }
  }

  // Sample homes.
  for (const listing of sampleListings) {
    const { agentSlug, ...rest } = listing
    const wanted = [rest.address, rest.unit].filter(Boolean).join(' ')
    const found = await payload.find({
      collection: 'listings',
      where: { address: { equals: rest.address }, isSample: { equals: true } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs.length) continue
    await payload.create({
      collection: 'listings',
      data: {
        ...rest,
        borough: rest.neighborhood === 'Park Slope' ? 'brooklyn' : 'manhattan',
        description: `${rest.description}\n\n${SAMPLE_NOTE}`,
        approved: true,
        isSample: true,
        agent: agentIds[agentSlug],
      },
    })
    console.log(`[seed] Added sample home ${wanted}`)
  }

  // Sample tips.
  for (const [index, tip] of sampleTips.entries()) {
    const found = await payload.find({
      collection: 'articles',
      where: { title: { equals: tip.title }, isSample: { equals: true } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs.length) continue
    await payload.create({
      collection: 'articles',
      data: {
        kind: 'tip',
        title: tip.title,
        summary: tip.summary,
        caption: tip.caption,
        body: richText(...tip.paragraphs, SAMPLE_NOTE) as never,
        author: agentIds['vanessa-gad'],
        publishedOn: new Date(Date.now() - tip.daysAgo * 86_400_000).toISOString(),
        approved: true,
        isSample: true,
      },
    })
    console.log(`[seed] Added sample tip ${index + 1}: ${tip.title}`)
  }

  // The neighborhood descriptions (real text, no films yet: add a YouTube, Vimeo or Mux link in the back end).
  let hoodOrder = 1
  for (const hood of NEIGHBORHOOD_TEXT) {
    const found = await payload.find({
      collection: 'neighborhoods',
      where: { slug: { equals: slugify(hood.name) } },
      limit: 1,
      overrideAccess: true,
    })
    hoodOrder += 1
    if (found.docs.length) continue
    const { tagline, body } = splitText(hood.text)
    await payload.create({
      collection: 'neighborhoods',
      data: { name: hood.name, borough: hood.borough, tagline, body, order: hoodOrder, approved: true, isSample: false },
    })
    console.log(`[seed] Added neighborhood ${hood.name}`)
  }

  console.log('[seed] Done. Remove the samples any time with: npm run seed:clear')
}

// Top-level await keeps `payload run` waiting until the seeding has finished.
try {
  await main()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
