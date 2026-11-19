import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/db/schema";

export type AppDatabase = ReturnType<typeof drizzle<typeof schema>>;

export type DatabaseHandle = {
  client: PGlite;
  db: AppDatabase;
};

export function createDatabase(dataDir?: string): DatabaseHandle {
  const client = dataDir ? new PGlite(dataDir) : new PGlite();
  return { client, db: drizzle(client, { schema }) };
}

export async function migrateDatabase(
  client: PGlite,
  migrationsDir = path.join(process.cwd(), "drizzle"),
): Promise<void> {
  await client.exec(`
    create table if not exists mio_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    );
  `);
  const applied = await client.query<{ name: string }>("select name from mio_migrations");
  const completed = new Set(applied.rows.map((row) => row.name));
  const files = (await readdir(migrationsDir)).filter((name) => name.endsWith(".sql")).sort();

  for (const name of files) {
    if (completed.has(name)) continue;
    const sql = await readFile(path.join(migrationsDir, name), "utf8");
    await client.transaction(async (transaction) => {
      await transaction.exec(sql);
      await transaction.query("insert into mio_migrations (name) values ($1)", [name]);
    });
  }
}

let singleton: Promise<DatabaseHandle> | undefined;

export function getDb(): Promise<DatabaseHandle> {
  singleton ??= (async () => {
    const handle = createDatabase(process.env.MIO_DATA_DIR ?? path.join(process.cwd(), "data/mio-data"));
    await migrateDatabase(handle.client);
    return handle;
  })();
  return singleton;
}

