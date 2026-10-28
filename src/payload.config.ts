import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'

import { Agents } from './collections/Agents'
import { Articles } from './collections/Articles'
import { Buildings } from './collections/Buildings'
import { Inquiries } from './collections/Inquiries'
import { Listings } from './collections/Listings'
import { Media } from './collections/Media'
import { Neighborhoods } from './collections/Neighborhoods'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { LOCAL_DATABASE_URL } from './lib/database'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * The live site uses Postgres. On a laptop the same code talks to a small
 * Postgres-compatible database that starts automatically with `npm run dev`
 * (see scripts/with-db.mjs), so nothing has to be installed.
 */
const databaseUrl = process.env.DATABASE_URL || LOCAL_DATABASE_URL
const isLocalDatabase = databaseUrl === LOCAL_DATABASE_URL

const emailFrom = process.env.EMAIL_FROM || 'contactus@gadrealty.com'

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · The Gad Gazette',
      description: 'Back office for Gad Realty NYC',
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Listings, Buildings, Articles, Neighborhoods, Agents, Media, Inquiries, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
      // Supabase (and most hosted Postgres) require an encrypted connection. Its pooler uses
      // its own certificate, so we accept it rather than fail with "self-signed certificate".
      ...(isLocalDatabase ? {} : { ssl: { rejectUnauthorized: false } }),
      // Each Vercel function opens its own pool, so keep it small to stay under Supabase's limit.
      max: isLocalDatabase ? 10 : 3,
    },
    // Tables come from the saved migrations in src/migrations (applied by `npm run db:migrate`,
    // which `npm run dev` and `npm run seed` run first). When the fields change, run
    // `npm run payload -- migrate:create` to save a new one.
    push: process.env.DB_PUSH === 'true',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  // The structure is ready for French, Italian, Spanish and Hebrew. Only English is switched on
  // for visitors at launch (see ENABLED_LOCALES in src/i18n/config.ts).
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Français', code: 'fr' },
      { label: 'Italiano', code: 'it' },
      { label: 'Español', code: 'es' },
      { label: 'עברית', code: 'he', rtl: true },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: emailFrom,
        defaultFromName: 'Gad Realty NYC',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})

