import type { CheckboxField, Field } from 'payload'

import { brokerOnlyField, isBroker } from '../access'

/** Only the broker can tick this. It decides what the public can see. */
export const approvedField: CheckboxField = {
  name: 'approved',
  label: 'Published on the website',
  type: 'checkbox',
  defaultValue: ({ user }) => isBroker(user as { role?: string } | null),
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Only the broker can publish. Leave unticked to keep it private while it is a draft.',
  },
  access: { create: brokerOnlyField, update: brokerOnlyField },
}

export const createdByField: Field = {
  name: 'createdBy',
  type: 'relationship',
  relationTo: 'users',
  index: true,
  admin: { position: 'sidebar', readOnly: true, description: 'Set automatically.' },
}

/** Lets sample content from the seed script be found and removed in one step. */
export const isSampleField: CheckboxField = {
  name: 'isSample',
  label: 'Sample content',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    position: 'sidebar',
    description: 'Marks placeholder content. Run "npm run seed:clear" to delete everything marked this way.',
  },
  access: { create: brokerOnlyField, update: brokerOnlyField },
}
