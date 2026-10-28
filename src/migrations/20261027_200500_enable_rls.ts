import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Turns on Row Level Security (RLS) for every table in the "public" schema.
 *
 * Why: Supabase publishes the "public" schema through its own web API, which anyone holding the
 * public "anon" key can call. With RLS off, that means anyone can read or change the data
 * (including the inquiries with visitors' contact details).
 *
 * Why this does not break the site: the website never uses that Supabase API. Payload connects
 * straight to Postgres with the database owner login (DATABASE_URL), and the owner is not
 * affected by RLS (we use ENABLE, not FORCE). So the site and the admin keep working, and the
 * Supabase API is locked: with RLS on and no policies, "anon" and "authenticated" get nothing.
 *
 * It loops over every table, so it also covers payload_migrations and the Payload system tables.
 * It is safe to run more than once, and it works on the local laptop database too.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      t record;
    BEGIN
      FOR t IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'public'
      LOOP
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', t.schemaname, t.tablename);
      END LOOP;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      t record;
    BEGIN
      FOR t IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'public'
      LOOP
        EXECUTE format('ALTER TABLE %I.%I DISABLE ROW LEVEL SECURITY', t.schemaname, t.tablename);
      END LOOP;
    END
    $$;
  `)
}
