import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { brokerOnly, loggedIn, readApprovedOrOwn, stampCreatedBy, updateOwnOrBroker } from '../access'
import { approvedField, createdByField, isSampleField } from '../fields/shared'
import { slugify } from '../lib/slug'

const prepareNeighborhood: CollectionBeforeValidateHook = ({ data, originalDoc, req, operation }) => {
  if (!data) return data
  stampCreatedBy({ data, req, operation })
  const name = (data.name ?? originalDoc?.name) as string | undefined
  if (!data.slug && !originalDoc?.slug && name) data.slug = slugify(name)
  return data
}

export const Neighborhoods: CollectionConfig = {
  slug: 'neighborhoods',
  labels: { singular: 'Neighborhood film', plural: 'Neighborhood films' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'borough', 'order', 'approved'],
    group: 'The Paper',
    description: 'One page per neighborhood: a short film and a few lines of text.',
  },
  defaultSort: 'order',
  access: {
    read: readApprovedOrOwn,
    create: loggedIn,
    update: updateOwnOrBroker,
    delete: brokerOnly,
  },
  hooks: { beforeValidate: [prepareNeighborhood] },
  fields: [
    {
      name: 'name',
      label: 'Neighborhood',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Becomes the huge headline, for example Tribeca.' },
    },
    {
      name: 'borough',
      type: 'select',
      defaultValue: 'manhattan',
      options: [
        { label: 'Manhattan', value: 'manhattan' },
        { label: 'Brooklyn', value: 'brooklyn' },
        { label: 'Queens', value: 'queens' },
        { label: 'The Bronx', value: 'bronx' },
        { label: 'Staten Island', value: 'staten-island' },
      ],
    },
    {
      name: 'tagline',
      label: 'Headline under the name',
      type: 'text',
      localized: true,
      admin: { description: 'For example: A quiet corner of the city worth knowing.' },
    },
    {
      name: 'body',
      label: 'A few lines about the neighborhood',
      type: 'textarea',
      localized: true,
      admin: { description: 'Leave a blank line between paragraphs.' },
    },
    {
      name: 'filmUrl',
      label: 'Film link',
      type: 'text',
      admin: {
        description:
          'A YouTube or Vimeo link, a direct .mp4 link, or mux:PLAYBACK_ID for a Mux film. Or upload a film below.',
      },
    },
    {
      name: 'film',
      label: 'Or upload a film',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video' } },
      admin: { description: 'Short films only. Large films should go on Mux, YouTube or Vimeo.' },
    },
    { name: 'poster', label: 'Still image for the film', type: 'upload', relationTo: 'media' },
    {
      name: 'runtime',
      label: 'Length of the film',
      type: 'text',
      admin: { description: 'For example: 3 minutes.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
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
