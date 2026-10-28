import type { CollectionConfig } from 'payload'

import { brokerOnly, brokerOnlyField, isBroker, isLoggedIn } from '../access'

/**
 * People who can log in to the back end.
 * The very first account created becomes the broker.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Team member', plural: 'Team (logins)' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'People',
    description: 'Logins for the broker and the agents. Agents can add listings but cannot publish them.',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  access: {
    admin: ({ req }) => isLoggedIn(req.user),
    create: brokerOnly,
    read: ({ req }) => {
      if (!req.user) return false
      if (isBroker(req.user)) return true
      return { id: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (isBroker(req.user)) return true
      return { id: { equals: req.user.id } }
    },
    delete: brokerOnly,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== 'create' || !data) return data
        const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req })
        if (totalDocs === 0) data.role = 'broker'
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'agent',
      saveToJWT: true,
      options: [
        { label: 'Broker (full control)', value: 'broker' },
        { label: 'Agent (adds listings, broker approves)', value: 'agent' },
      ],
      access: { create: brokerOnlyField, update: brokerOnlyField },
    },
    {
      name: 'agentProfile',
      label: 'Public agent profile',
      type: 'relationship',
      relationTo: 'agents',
      saveToJWT: true,
      admin: { description: 'The public profile this login belongs to. New listings are credited to it.' },
      access: { create: brokerOnlyField, update: brokerOnlyField },
    },
  ],
}
