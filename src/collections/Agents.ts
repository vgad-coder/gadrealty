import type { CollectionConfig } from 'payload'

import { anyone, brokerOnly, brokerOnlyField, isBroker, relationId } from '../access'
import { slugify } from '../lib/slug'

/** Public agent profiles shown on The Office and on credited listings. */
export const Agents: CollectionConfig = {
  slug: 'agents',
  labels: { singular: 'Agent', plural: 'Agents' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'phone'],
    group: 'People',
    description: 'Public profiles. These appear on The Office page and are credited on listings.',
  },
  access: {
    read: anyone,
    create: brokerOnly,
    delete: brokerOnly,
    update: ({ req }) => {
      if (isBroker(req.user)) return true
      const profileId = relationId((req.user as { agentProfile?: unknown } | null)?.agentProfile)
      if (profileId !== undefined) return { id: { equals: profileId } }
      return false
    },
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Filled in automatically from the name.' },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (value) return value
            const name = (siblingData as { name?: string }).name
            return name ? slugify(name) : value
          },
        ],
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'For example: Broker and Construction Manager, or Licensed Salesperson.' },
    },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'languages',
      type: 'text',
      hasMany: true,
      admin: { description: 'Press Enter after each language, for example English, French, Hebrew.' },
    },
    { name: 'bio', type: 'textarea', localized: true },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Lower numbers appear first on The Office page.' },
      access: { create: brokerOnlyField, update: brokerOnlyField },
    },
  ],
}
