import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "listings" ADD COLUMN "common_charges" numeric;
  ALTER TABLE "listings" ADD COLUMN "monthly_taxes" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "listings" DROP COLUMN "common_charges";
  ALTER TABLE "listings" DROP COLUMN "monthly_taxes";`)
}
