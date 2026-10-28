import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "street_easy_url";
  ALTER TABLE "site_settings" DROP COLUMN "zillow_url";
  ALTER TABLE "site_settings" DROP COLUMN "mls_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "street_easy_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "zillow_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "mls_url" varchar;`)
}
