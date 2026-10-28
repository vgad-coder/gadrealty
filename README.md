# The Gad Gazette: gadrealty.com

A vintage-newspaper website for Gad Realty NYC, with a private back office for the team.
Built with Next.js and Payload CMS (admin at `/admin`) on Postgres.

## On your computer

```
npm install
copy .env.example .env      (then put a long random string in PAYLOAD_SECRET)
npm run dev                 (site at http://localhost:3000, back office at /admin)
npm run seed                (optional: fills the site with clearly marked sample homes, tips and films)
```

- The first person to register at `/admin` becomes the **broker** (full control). Everyone
  after that is an **agent** unless the broker changes their role.
- Agents add homes under **Listings**. A listing marked "approved" appears on the site; the
  broker can switch approval on or off. Prices are hidden on sold and rented homes unless the
  listing says to show them.
- A local copy of the database is kept in `.data/` (it is not part of the site and is not committed).

## Putting it online (private Vercel preview first)

1. Create a Postgres database (Neon or Vercel Postgres) and copy its connection string.
2. In Vercel, import the project and set these environment variables:
   - `DATABASE_URL`: the Postgres connection string
   - `PAYLOAD_SECRET`: a long random string (keep it the same forever)
   - `NEXT_PUBLIC_SITE_URL`: the preview address, later `https://gadrealty.com`
   - `BLOB_READ_WRITE_TOKEN`: from Vercel Blob (photos and uploaded films)
   - `RESEND_API_KEY` and `EMAIL_FROM`, `OFFICE_EMAIL`: for inquiry emails
3. Deploy. The build runs `payload migrate`, which creates the tables.
4. Open `/admin` on the preview, create the broker login, and enter the real listings.
5. Review the preview, confirm the license wording (Site Settings), then connect `gadrealty.com`.

## Bringing the homes over from the old gadrealty.com

```
node scripts/scrape-old-site.mjs                        copies every home and photograph from the old site into data/old-site
npm run import:listings                                 adds them to the site (safe to run again; existing homes are skipped)
```

Useful settings (PowerShell): `$env:IMPORT_DRY='1'` shows what would happen without writing,
`$env:IMPORT_REPLACE_SAMPLES='1'` removes the sample homes, `$env:IMPORT_REPLACE_IMPORTED='1'`
redoes homes that were imported before. To fill the live site, set `DATABASE_URL` and
`BLOB_READ_WRITE_TOKEN` in `.env` first so the homes and photographs go to the live database and storage.
Homes with something doubtful are saved but left unapproved; find them in the back office under Listings.

## Before going live

- Remove the sample content: `npm run seed:clear` (with the live `DATABASE_URL` set), or delete the
  items marked "sample" in the back office.
- Fill in **Site Settings**: license line (only if confirmed), phone, address, story.
- Add real photographs, films (YouTube, Vimeo, `mux:ID`, an `.mp4` link, or an upload) and agent photos.
- Add redirects for the old WordPress addresses in `next.config.mjs`.

## Languages

English is on. French, Italian, Spanish and Hebrew (right-to-left) are prepared. To switch them on,
add the codes to `ENABLED_LOCALES` in `src/i18n/config.ts`, translate the fields in the back office,
and have a native speaker review the text in `src/i18n/dictionaries.ts`.

## When the fields change

Run `npm run payload -- migrate:create`, commit the new file in `src/migrations`, and deploy.
