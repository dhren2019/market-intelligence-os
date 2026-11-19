import { getDb } from "@/db/client";
import { runDailySync } from "@/domain/automation/daily";
import { createPublicConnectors } from "@/domain/connectors/registry";

async function main() {
  const { client, db } = await getDb();
  const result = await runDailySync({
    db,
    connectors: createPublicConnectors(),
    enforceMadridHour: process.env.GITHUB_EVENT_NAME === "schedule",
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  await client.close();
  if (result.status === "failed") process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
