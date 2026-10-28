import type { GlobalConfig } from 'payload'

import { anyone, brokerOnly } from '../access'
/** Words and facts that appear all over the site. Anything left empty falls back to a sensible default. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Masthead and office details',
  admin: { group: 'The Office' },
  access: { read: anyone, update: brokerOnly },
  fields: [
    {
      type: 'collapsible',
      label: 'Masthead',
      fields: [
        {
          name: 'mastheadLine',
          label: 'Line under the date',
          type: 'text',
          localized: true,
          admin: { description: 'Default: New York · Real Estate and Construction' },
        },
        {
          name: 'establishedLine',
          label: 'Optional "since" line',
          type: 'text',
          admin: { description: 'For example: Serving New York since 1999. Leave empty unless it is accurate.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'The firm',
      fields: [
        {
          name: 'constructionLine',
          label: 'Construction promise (one sentence)',
          type: 'textarea',
          localized: true,
          admin: {
            description:
              'Shown on the Front Page and Sell with Us. Default: Gad Realty is a boutique brokerage and construction management firm. We run a project from the first plans through the finished work, then bring the same home to market.',
          },
        },
        {
          name: 'jobTypes',
          label: 'Kinds of construction work you take',
          type: 'array',
          labels: { singular: 'Kind of job', plural: 'Kinds of jobs' },
          admin: { description: 'Shown on The Office page. Default: gut renovations, apartment combinations, townhouses.' },
          fields: [{ name: 'job', type: 'text', required: true, localized: true }],
        },
        {
          name: 'story',
          label: 'The Office: the firm in a few paragraphs',
          type: 'textarea',
          localized: true,
          admin: { description: 'Leave a blank line between paragraphs.' },
        },
        {
          name: 'ceoQuote',
          label: 'A line from Vanessa',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Office and contact',
      fields: [
        { name: 'phone', type: 'text', admin: { description: 'Default: +1 (212) 671-1897' } },
        { name: 'email', type: 'email', admin: { description: 'Default: contactus@GadRealty.com' } },
        {
          name: 'address',
          type: 'textarea',
          admin: { description: 'Default: 589 Fifth Avenue, Suite 1007, New York, NY 10017' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Licensing and fair housing',
      fields: [
        {
          name: 'licenseLine',
          label: 'Broker license line',
          type: 'text',
          admin: {
            description:
              'Shown in the footer exactly as typed here, for example: Vanessa Gad, Licensed Real Estate Broker. Please enter the wording and license details required for your license.',
          },
        },
        {
          name: 'disclosureUrl',
          label: 'Link to the New York State disclosure form',
          type: 'text',
          admin: { description: 'Leave empty to use the official Department of State form.' },
        },
        {
          name: 'fairHousingNoticeUrl',
          label: 'Link to the New York State fair housing notice',
          type: 'text',
          admin: { description: 'Leave empty to use the official Department of State notice.' },
        },
      ],
    },
  ],
}
