import type { CollectionConfig } from 'payload'

import { brokerOnly, loggedIn } from '../access'

/**
 * Every question and valuation request from the website lands here, and also
 * in the office inbox. Keeping the record also keeps the copy of the fair
 * housing disclosure that New York asks brokers to retain for three years.
 */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'email', 'createdAt'],
    group: 'The Office',
    description: 'Questions and valuation requests sent from the website. Only the broker can see these.',
  },
  defaultSort: '-createdAt',
  access: {
    read: brokerOnly,
    create: loggedIn,
    update: brokerOnly,
    delete: brokerOnly,
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'Valuation request (selling)', value: 'valuation' },
        { label: 'About a home', value: 'listing' },
        { label: 'General question', value: 'general' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'propertyAddress', label: 'Address of the property', type: 'text' },
    { name: 'message', type: 'textarea' },
    {
      name: 'listing',
      type: 'relationship',
      relationTo: 'listings',
      admin: { description: 'The home the person asked about, if any.' },
    },
    { name: 'language', type: 'text', admin: { readOnly: true } },
    {
      name: 'disclosureSentAt',
      label: 'Fair housing disclosure sent',
      type: 'date',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        description: 'When the link to the New York State disclosure form was emailed to this person.',
      },
    },
    { name: 'handled', label: 'Handled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
