import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import {
  brokerOnly,
  brokerOnlyField,
  loggedIn,
  readApprovedOrOwn,
  relationId,
  stampCreatedBy,
  updateOwnOrBroker,
} from '../access'
import { approvedField, createdByField, isSampleField } from '../fields/shared'
import { validateWebUrl } from '../lib/links'
import { priceIsPublic } from '../lib/price'
import { slugify } from '../lib/slug'

const HEADLINE_WORD: Record<string, string> = {
  'for-sale': 'Now Offered',
  'for-rent': 'Now Available',
  sold: 'Sold',
  rented: 'Rented',
}

/** Slug, default headline, and credit the agent who is logged in. */
const prepareListing: CollectionBeforeValidateHook = async ({ data, originalDoc, req, operation }) => {
  if (!data) return data

  stampCreatedBy({ data, req, operation })

  const address = (data.address ?? originalDoc?.address) as string | undefined
  const unit = (data.unit ?? originalDoc?.unit) as string | undefined
  const status = (data.status ?? originalDoc?.status) as string | undefined

  if (!data.slug && !originalDoc?.slug && address) {
    const base = slugify([address, unit].filter(Boolean).join(' ')) || 'home'
    let candidate = base
    let counter = 2
    // Keep addresses unique, for example 28-laight-street and 28-laight-street-2.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await req.payload.find({
        collection: 'listings',
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

  if (!data.headline && !originalDoc?.headline && address) {
    const place = [address, unit].filter(Boolean).join(', ')
    data.headline = `${place} ${HEADLINE_WORD[status ?? ''] ?? ''}`.trim()
  }

  if (!data.agent && !originalDoc?.agent) {
    const profile = relationId((req.user as { agentProfile?: unknown } | null)?.agentProfile)
    if (profile !== undefined) data.agent = profile
  }

  return data
}

export const Listings: CollectionConfig = {
  slug: 'listings',
  labels: { singular: 'Listing', plural: 'Listings' },
  admin: {
    useAsTitle: 'address',
    defaultColumns: ['address', 'status', 'neighborhood', 'agent', 'approved', 'updatedAt'],
    listSearchableFields: ['address', 'neighborhood', 'headline'],
    group: 'The Homes',
    description:
      'Every home for sale, for rent, sold and rented. When a deal closes, change the Status and the home moves into Sold and Rented by itself.',
  },
  defaultSort: '-updatedAt',
  access: {
    read: readApprovedOrOwn,
    create: loggedIn,
    update: updateOwnOrBroker,
    delete: brokerOnly,
  },
  hooks: {
    beforeValidate: [prepareListing],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '1. The home',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'for-sale',
              index: true,
              options: [
                { label: 'For sale', value: 'for-sale' },
                { label: 'For rent', value: 'for-rent' },
                { label: 'Sold', value: 'sold' },
                { label: 'Rented', value: 'rented' },
              ],
            },
            {
              name: 'closedOn',
              label: 'Closing date',
              type: 'date',
              index: true,
              admin: {
                date: { pickerAppearance: 'dayOnly' },
                condition: (data) => data?.status === 'sold' || data?.status === 'rented',
                description: 'Used to file the home under its year in Sold and Rented. The year is what matters.',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'address', type: 'text', required: true, admin: { width: '65%', description: 'Street address, for example 28 Laight Street.' } },
                { name: 'unit', type: 'text', admin: { width: '35%', description: 'Apartment, for example Apt 10B.' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'neighborhood', type: 'text', required: true, index: true, admin: { width: '50%', description: 'For example Tribeca or Upper East Side.' } },
                {
                  name: 'borough',
                  type: 'select',
                  required: true,
                  defaultValue: 'manhattan',
                  index: true,
                  admin: { width: '50%' },
                  options: [
                    { label: 'Manhattan', value: 'manhattan' },
                    { label: 'Brooklyn', value: 'brooklyn' },
                    { label: 'Queens', value: 'queens' },
                    { label: 'The Bronx', value: 'bronx' },
                    { label: 'Staten Island', value: 'staten-island' },
                  ],
                },
              ],
            },
            {
              name: 'propertyType',
              type: 'select',
              required: true,
              defaultValue: 'condo',
              options: [
                { label: 'Apartment', value: 'apartment' },
                { label: 'Condominium', value: 'condo' },
                { label: 'Co-op', value: 'coop' },
                { label: 'Townhouse', value: 'townhouse' },
                { label: 'Rental apartment', value: 'rental' },
                { label: 'House', value: 'house' },
                { label: 'Commercial', value: 'commercial' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'rooms', type: 'number', min: 0, admin: { width: '25%', step: 0.5 } },
                { name: 'bedrooms', type: 'number', min: 0, admin: { width: '25%' } },
                { name: 'bathrooms', type: 'number', min: 0, admin: { width: '25%', step: 0.5 } },
                { name: 'squareFeet', label: 'Square feet', type: 'number', min: 0, admin: { width: '25%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  label: 'Price (asking or sold price, or the monthly rent)',
                  type: 'number',
                  min: 0,
                  admin: { width: '50%' },
                  access: {
                    // The public never receives a price that is meant to stay private.
                    read: ({ req, doc }) =>
                      Boolean(req.user) ||
                      priceIsPublic(doc as { status?: string; priceVisibility?: string } | undefined),
                  },
                },
                {
                  name: 'priceVisibility',
                  label: 'Show the price on the website?',
                  type: 'select',
                  defaultValue: 'auto',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Show it (for sale, for rent, sold and rented)', value: 'auto' },
                    { label: 'Always show', value: 'show' },
                    { label: 'Never show (keep this price private)', value: 'hide' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'commonCharges',
                  label: 'Monthly common charges or maintenance',
                  type: 'number',
                  min: 0,
                  admin: {
                    width: '50%',
                    description: 'Dollars per month. Condos: common charges. Co-ops: maintenance. Leave empty for rentals.',
                  },
                },
                {
                  name: 'monthlyTaxes',
                  label: 'Monthly real estate taxes',
                  type: 'number',
                  min: 0,
                  admin: { width: '50%', description: 'Dollars per month. Leave empty if taxes are included in maintenance.' },
                },
              ],
            },
            {
              name: 'agent',
              type: 'relationship',
              relationTo: 'agents',
              admin: { description: 'The agent who handled this home.' },
            },
          ],
        },
        {
          label: '2. The story',
          fields: [
            {
              name: 'headline',
              type: 'text',
              admin: {
                description:
                  'Written like a newspaper headline, for example "28 Laight Street Sold". Filled in for you, change it if you like.',
              },
            },
            {
              name: 'deck',
              label: 'One line under the headline',
              type: 'text',
              admin: { description: 'For example: Full-floor residence with park views and grand proportions.' },
            },
            {
              name: 'description',
              label: 'About the home',
              type: 'textarea',
              admin: { description: 'A short paragraph. Leave a blank line between paragraphs.' },
            },
            {
              name: 'construction',
              label: 'Construction',
              type: 'textarea',
              admin: {
                description:
                  'Only if Gad Realty managed work on this home: what was done, written like a short feature. Leave empty otherwise.',
              },
            },
          ],
        },
        {
          label: '3. Photos and film',
          fields: [
            {
              name: 'photos',
              type: 'array',
              labels: { singular: 'Photograph', plural: 'Photographs' },
              admin: { description: 'The first photograph is the main one. Drag to change the order.' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
            {
              name: 'archPhoto',
              label: 'Opening photo (optional)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'The large polaroid at the top of the home\'s page. If left empty, the second photograph is used.',
              },
            },
            {
              name: 'filmUrl',
              label: 'Film link (optional)',
              type: 'text',
              admin: { description: 'A YouTube or Vimeo link, or mux:PLAYBACK_ID for a Mux film.' },
            },
            {
              type: 'collapsible',
              label: 'Also listed on other websites (optional)',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'streetEasyUrl',
                  label: 'StreetEasy link',
                  type: 'text',
                  validate: (value: string | null | undefined) => validateWebUrl(value),
                  admin: { description: 'Paste the web address of this home on StreetEasy.' },
                },
                {
                  name: 'zillowUrl',
                  label: 'Zillow link',
                  type: 'text',
                  validate: (value: string | null | undefined) => validateWebUrl(value),
                },
                {
                  name: 'mlsUrl',
                  label: 'MLS or other link',
                  type: 'text',
                  validate: (value: string | null | undefined) => validateWebUrl(value),
                  admin: { description: 'For example the OneKey MLS, Compass or Realtor.com page for this home.' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Web address of this home. Filled in automatically.' },
    },
    approvedField,
    {
      name: 'leadStory',
      label: 'Lead story on the Front Page',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'The most recently updated lead story fills the top of the Front Page.',
      },
      access: { create: brokerOnlyField, update: brokerOnlyField },
    },
    isSampleField,
    createdByField,
  ],
}