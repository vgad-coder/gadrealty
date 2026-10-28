import { withPayload } from '@payloadcms/next/withPayload'

/**
 * Old gadrealty.com (WordPress) addresses are sent to their new homes so that
 * Google and anyone with a saved link land in the right place.
 * Next.js already treats /about and /about/ as the same address.
 */
const redirects = [
  { source: '/about', destination: '/the-office' },
  { source: '/our-agents', destination: '/the-office' },
  { source: '/agents', destination: '/the-office' },
  { source: '/agents/:slug', destination: '/the-office/:slug' },
  { source: '/contact-us', destination: '/sell-with-us' },
  { source: '/contact', destination: '/sell-with-us' },
  { source: '/sell', destination: '/sell-with-us' },
  { source: '/blog', destination: '/tip-of-the-week' },
  { source: '/blog/:slug', destination: '/tip-of-the-week' },
  { source: '/news', destination: '/tip-of-the-week' },
  { source: '/property', destination: '/available' },
  { source: '/properties', destination: '/available' },
  { source: '/property/:slug', destination: '/homes/:slug' },
  { source: '/properties/:slug', destination: '/homes/:slug' },
  { source: '/listing', destination: '/available' },
  { source: '/listings', destination: '/available' },
  { source: '/our-listings', destination: '/available' },
  { source: '/listings/:slug', destination: '/homes/:slug' },
  { source: '/for-sale', destination: '/available' },
  { source: '/for-rent', destination: '/available' },
  { source: '/sold', destination: '/sold-and-rented' },
  { source: '/rented', destination: '/sold-and-rented' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return redirects.map((r) => ({ ...r, permanent: true }))
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
