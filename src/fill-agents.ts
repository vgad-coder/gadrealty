/**
 * Puts the agents and their portraits on the site, and credits them on their homes.
 *
 *   npm run fill:agents          (writes to the database in .env, or the local one)
 *   npm run fill:agents -- --dry (shows what it would do, writes nothing)
 *
 * Why: the first import brought the homes over but not the people. This adds Vanessa Gad and
 * Gerard Bianco Jr. with their portraits (copied earlier from the old gadrealty.com into
 * data/old-site/agents), then links every home to the agent the old site named.
 *
 * Safe to run again: agents that already exist are kept, a portrait is only added when an agent
 * has none, and a home that already has an agent is left alone.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'

import config from './payload.config'

const dry = process.argv.includes('--dry') || Boolean(process.env.IMPORT_DRY)
const dataDir = path.resolve(process.cwd(), 'data', 'old-site')

const AGENTS = [
  {
    name: 'Vanessa Gad',
    slug: 'vanessa-gad',
    title: 'Broker and Construction Manager',
    phone: '1-917-582-9003',
    order: 1,
    portrait: 'agents/vanessa-gad-new.jpg',
    bio: 'Vanessa Gad is Gad Realty\u2019s CEO and broker, and a construction manager who runs a project from the first plans to the finished work. She has 32 years of experience buying and selling real estate in both Europe and New York, with more than $500 million in residential and commercial sales.\n\nWith a background in art, diamonds and real estate, Vanessa nurtures high-end transactions and provides exceptional customer service. Over her career she has managed more than 80 agents. Today she owns her own boutique agency, giving buyers and sellers individual attention.',
  },
  {
    name: 'Gerard Bianco Jr.',
    slug: 'gerard-bianco-jr',
    phone: '917-836-3949',
    order: 2,
    portrait: 'agents/gerard-bianco-jr.jpg',
  },
]

type Scraped = { slug: string; agents: string[] }

async function main() {
  const payload = await getPayload({ config })

  const agentIds = new Map<string, number>()
  for (const agent of AGENTS) {
    const { portrait, ...fields } = agent
    const found = await payload.find({ collection: 'agents', where: { slug: { equals: agent.slug } }, limit: 1, depth: 0, overrideAccess: true })
    let doc = found.docs[0]

    if (!doc) {
      if (dry) {
        console.log(`[agents] Would add ${agent.name}`)
        continue
      }
      doc = await payload.create({ collection: 'agents', data: fields, overrideAccess: true })
      console.log(`[agents] Added ${agent.name}`)
    } else {
      console.log(`[agents] ${agent.name} is already there`)
    }
    agentIds.set(agent.name.toLowerCase(), doc.id)

    if (!doc.portrait) {
      if (dry) {
        console.log(`[agents]   Would add the portrait for ${agent.name}`)
      } else {
        const media = await payload.create({
          collection: 'media',
          data: { alt: `${agent.name}, Gad Realty NYC` },
          filePath: path.join(dataDir, portrait),
          overrideAccess: true,
        })
        await payload.update({ collection: 'agents', id: doc.id, data: { portrait: media.id }, overrideAccess: true })
        console.log(`[agents]   Added the portrait for ${agent.name}`)
      }
    }
  }

  // Credit each home to the agent the old site named, when it has none yet.
  const scraped: Scraped[] = JSON.parse((await readFile(path.join(dataDir, 'listings.json'), 'utf8')).replace(/^\uFEFF/, ''))
  const wanted = new Map(scraped.filter((s) => s.agents[0]).map((s) => [s.slug, s.agents[0].toLowerCase()]))

  const homes = await payload.find({ collection: 'listings', limit: 1000, depth: 0, pagination: false, overrideAccess: true })
  let linked = 0
  for (const home of homes.docs) {
    if (home.agent) continue
    const name = wanted.get(home.slug ?? '')
    const id = name ? agentIds.get(name) : undefined
    if (!id) continue
    if (!dry) await payload.update({ collection: 'listings', id: home.id, data: { agent: id }, overrideAccess: true })
    linked++
  }
  console.log(`[agents] ${dry ? 'Would credit' : 'Credited'} ${linked} homes to their agents.`)
}

try {
  await main()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
