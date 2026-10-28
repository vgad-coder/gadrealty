import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_buildings_overall_rating" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_buildings_doorman_rating" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_buildings_management_rating" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_buildings_lifestyle_rating" AS ENUM('1', '2', '3', '4', '5');
  CREATE TABLE "buildings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"address" varchar NOT NULL,
  	"name" varchar,
  	"overall_rating" "enum_buildings_overall_rating",
  	"doorman_rating" "enum_buildings_doorman_rating",
  	"management_rating" "enum_buildings_management_rating",
  	"lifestyle_rating" "enum_buildings_lifestyle_rating",
  	"management_company" varchar,
  	"slug" varchar,
  	"approved" boolean,
  	"created_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "buildings_locales" (
  	"doorman_note" varchar,
  	"lifestyle_note" varchar,
  	"fun_fact" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "buildings_id" integer;
  ALTER TABLE "buildings" ADD CONSTRAINT "buildings_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "buildings_locales" ADD CONSTRAINT "buildings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "buildings_address_idx" ON "buildings" USING btree ("address");
  CREATE UNIQUE INDEX "buildings_slug_idx" ON "buildings" USING btree ("slug");
  CREATE INDEX "buildings_approved_idx" ON "buildings" USING btree ("approved");
  CREATE INDEX "buildings_created_by_idx" ON "buildings" USING btree ("created_by_id");
  CREATE INDEX "buildings_updated_at_idx" ON "buildings" USING btree ("updated_at");
  CREATE INDEX "buildings_created_at_idx" ON "buildings" USING btree ("created_at");
  CREATE UNIQUE INDEX "buildings_locales_locale_parent_id_unique" ON "buildings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "buildings_locales_parent_id_idx" ON "buildings_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_buildings_fk" FOREIGN KEY ("buildings_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_buildings_id_idx" ON "payload_locked_documents_rels" USING btree ("buildings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "buildings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "buildings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "buildings" CASCADE;
  DROP TABLE "buildings_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_buildings_fk";
  
  DROP INDEX "payload_locked_documents_rels_buildings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "buildings_id";
  DROP TYPE "public"."enum_buildings_overall_rating";
  DROP TYPE "public"."enum_buildings_doorman_rating";
  DROP TYPE "public"."enum_buildings_management_rating";
  DROP TYPE "public"."enum_buildings_lifestyle_rating";`)
}
