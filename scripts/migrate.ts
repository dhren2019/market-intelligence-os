import { getDb } from "@/db/client";

async function main() {
  const { client } = await getDb();
  console.log("Migraciones aplicadas.");
  await client.close();
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});

