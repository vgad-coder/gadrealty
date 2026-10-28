import path from 'path'
import type { CollectionConfig } from 'payload'

import { anyone, brokerOnly, loggedIn } from '../access'

/** Photographs and short films. In production these go to Vercel Blob. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo or film', plural: 'Photos and films' },
  admin: {
    group: 'Library',
    useAsTitle: 'filename',
    description: 'Upload photographs here, or pick them from inside a listing, tip or neighborhood.',
  },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: brokerOnly,
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400, withoutEnlargement: true },
      { name: 'card', width: 900, withoutEnlargement: true },
      { name: 'large', width: 1800, withoutEnlargement: true },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Description (for people who cannot see the picture)',
      type: 'text',
    },
  ],
}
