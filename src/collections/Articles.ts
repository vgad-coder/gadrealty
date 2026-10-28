import type { Access, CollectionBeforeValidateHook, CollectionConfig, Where } from 'payload'

import { brokerOnly, isBroker, loggedIn, stampCreatedBy, updateOwnOrBroker } from '../access'
import { approvedField, createdByField, isSampleField } from '../fields/shared'
import { slugify } from '../lib/slug'

/** The public sees published pieces whose date has arrived, so tips can be scheduled ahead. */
const readPublishedOrOwn: Access = ({ req }) => {
  const user = req.user as { id?: number | string; role?: string } | null
  if (isBroker(user)) return true
  const live: Where = {
    and: [{ approved: { equals: true } }, { publishedOn: { less_than_equal: new Date().toISOString() } }],
  }
  if (user?.id !== undefined) return { or: [live, { createdBy: { equals: user.id } }] }
  return live
}

const prepareArticle: CollectionBeforeValidateHook = async ({ data, originalDoc, req, operation }) => {
  if (!data) return data
  stampCreatedBy({ data, req, operation })

  const kind = (data.kind ?? originalDoc?.kind) as string | undefined
  const title = (data.title ?? originalDoc?.title) as string | undefined

  if (!data.slug && !originalDoc?.slug && title) {
    const base = slugify(title) || 'note'
    let candidate = base
    let counter = 2
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await req.payload.find({
        collection: 'articles',
        where: { slug: { equals: candidate } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        pagination: false,
        req,
      })
      if (existing.docs.length === 0) break
      candidate = `${base}-${counter++}`
    }
    data.slug = candidate
  }

  // Tip numbers count up by themselves: No. 1, No. 2, No. 3 ...
  if (kind === 'tip' && !data.tipNumber && !originalDoc?.tipNumber) {
    const latest = await req.payload.find({
      collection: 'articles',
      where: { kind: { equals: 'tip' } },
      sort: '-tipNumber',
      limit: 1,
      depth: 0,
      overrideAccess: true,
      pagination: false,
      req,
    })
    data.tipNumber = ((latest.docs[0]?.tipNumber as number | undefined) ?? 0) + 1
  }

  if (!data.publishedOn && !originalDoc?.publishedOn) data.publishedOn = new Date().toISOString()

  return data
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Tip or article', plural: 'Tips and articles' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'tipNumber', 'publishedOn', 'approved'],
    group: 'The Paper',
    description: 'The weekly Tip of the Week and longer articles. They share one page in the Gazette.',
  },
  defaultSort: '-publishedOn',
  access: {
    read: readPublishedOrOwn,
    create: loggedIn,
    update: updateOwnOrBroker,
    delete: brokerOnly,
  },
  hooks: { beforeValidate: [prepareArticle] },
  fields: [
    {
      name: 'kind',
      label: 'What is this?',
      type: 'select',
      required: true,
      defaultValue: 'tip',
      index: true,
      options: [
        { label: 'Tip of the Week', value: 'tip' },
        { label: 'Article', value: 'article' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Becomes the big headline, for example "What to Fix Before You Sell".' },
    },
    {
      name: 'summary',
      label: 'One-line summary',
      type: 'textarea',
      localized: true,
      admin: { description: 'Shown in lists and when the page is shared.' },
    },
    { name: 'heroImage', label: 'Photograph', type: 'upload', relationTo: 'media' },
    { name: 'caption', label: 'Photograph caption', type: 'text', localized: true },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      required: true,
      admin: { description: 'The text of the tip or article.' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'agents',
      admin: { description: 'Who is credited with writing it.' },
    },
    {
      name: 'publishedOn',
      label: 'Publish date',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'Choose a future date to schedule it. It appears on that day once it is published.',
      },
    },
    {
      name: 'tipNumber',
      label: 'Tip number',
      type: 'number',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.kind === 'tip',
        description: 'Counts up automatically: Tip of the Week, No. 42.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Web address. Filled in automatically.' },
    },
    approvedField,
    isSampleField,
    createdByField,
  ],
}
