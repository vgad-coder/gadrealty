import type { CollectionBeforeValidateHook, CollectionConfig, Field } from 'payload'

import { brokerOnly, loggedIn, readApprovedOrOwn, stampCreatedBy, updateOwnOrBroker } from '../access'
import { approvedField, createdByField } from '../fields/shared'
import { slugify } from '../lib/slug'

const prepareBuilding: CollectionBeforeValidateHook = ({ data, originalDoc, req, operation }) => {
  if (!data) return data
  stampCreatedBy({ data, req, operation })
  const address = (data.address ?? originalDoc?.address) as string | undefined
  if (address) data.slug = slugify(address.trim())
  return data
}

const stars = [
  { label: '1 star', value: '1' },
  { label: '2 stars', value: '2' },
  { label: '3 stars', value: '3' },
  { label: '4 stars', value: '4' },
  { label: '5 stars', value: '5' },
]

const rating = (name: string, label: string, description: string): Field => ({
  name,
  label,
  type: 'select',
  options: stars,
  admin: { width: '30%', description },
})

/**
 * One page of facts per building, shared by every home in it.
 * The address must be written exactly as it is on the homes (for example 28 Laight Street).
 */
export const Buildings: CollectionConfig = {
  slug: 'buildings',
  labels: { singular: 'Building', plural: 'Buildings' },
  admin: {
    useAsTitle: 'address',
    defaultColumns: ['address', 'name', 'overallRating', 'doormanRating', 'managementRating', 'lifestyleRating'],
    group: 'The Paper',
    description:
      'Ratings and a fun fact for each building. They appear on every home in that building. Leave a rating empty to hide it.',
  },
  defaultSort: 'address',
  access: {
    read: readApprovedOrOwn,
    create: loggedIn,
    update: updateOwnOrBroker,
    delete: brokerOnly,
  },
  hooks: { beforeValidate: [prepareBuilding] },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'address',
          label: 'Street address',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { width: '60%', description: 'Exactly as on the homes, for example 28 Laight Street. No apartment number.' },
        },
        {
          name: 'name',
          label: 'Building name (optional)',
          type: 'text',
          admin: { width: '40%', description: 'For example The Dakota.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Our ratings (from our own experience with the building)',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            rating('overallRating', 'The building', 'The building as a whole.'),
            rating('doormanRating', 'Doorman and staff', 'Doorman, concierge and building staff.'),
            rating('managementRating', 'Management company', 'How well the building is managed.'),
          ],
        },
        {
          type: 'row',
          fields: [rating('lifestyleRating', 'Life around the building', 'Streets, shops, parks, transit and everyday life nearby.')],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'doormanNote',
          label: 'Doorman and staff, in a few words',
          type: 'text',
          localized: true,
          admin: { width: '50%', description: 'For example: Full-time doorman and live-in superintendent.' },
        },
        {
          name: 'managementCompany',
          label: 'Management company',
          type: 'text',
          admin: { width: '50%', description: 'The company that manages the building, if you want to show it.' },
        },
      ],
    },
    {
      name: 'lifestyleNote',
      label: 'Life around the building, in a sentence',
      type: 'textarea',
      localized: true,
      admin: { description: 'For example: Steps from Riverside Park, with the 1 train at the corner.' },
    },
    {
      name: 'funFact',
      label: 'Fun fact about the building',
      type: 'textarea',
      localized: true,
      admin: { description: 'Only a fact you are sure of, for example the year it was built or who designed it.' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Web address. Filled in automatically.' },
    },
    approvedField,
    createdByField,
  ],
}
