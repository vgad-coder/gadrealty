import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_listings_property_type" ADD VALUE 'apartment' BEFORE 'condo';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "listings" ALTER COLUMN "property_type" SET DATA TYPE text;
  ALTER TABLE "listings" ALTER COLUMN "property_type" SET DEFAULT 'condo'::text;
  DROP TYPE "public"."enum_listings_property_type";
  CREATE TYPE "public"."enum_listings_property_type" AS ENUM('condo', 'coop', 'townhouse', 'rental', 'house', 'commercial');
  ALTER TABLE "listings" ALTER COLUMN "property_type" SET DEFAULT 'condo'::"public"."enum_listings_property_type";
  ALTER TABLE "listings" ALTER COLUMN "property_type" SET DATA TYPE "public"."enum_listings_property_type" USING "property_type"::"public"."enum_listings_property_type";`)
}
