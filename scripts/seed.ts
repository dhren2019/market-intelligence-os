import { getDb } from "@/db/client";
import { seedCatalog } from "@/domain/opportunities/repository";
import { seedReferenceCatalog } from "@/domain/reference/repository";

async function main() {
  const { client, db } = await getDb();
  const opportunities = await seedCatalog(db);
  const references = await seedReferenceCatalog(db);
  console.log(JSON.stringify({ status: "ok", opportunities, references }));
  await client.close();
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});

