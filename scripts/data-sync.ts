import { getDb } from "@/db/client";
import { persistConnectorResult, recordConnectorError, registerPublicSources } from "@/domain/connectors/repository";
import { createPublicConnectors } from "@/domain/connectors/registry";

async function main() {
  const { client, db } = await getDb();
  const connectors = createPublicConnectors();
  await registerPublicSources(db, connectors.map((connector) => connector.source));
  const runKey = `manual:${new Date().toISOString()}`;
  const summary = [];
  for (const connector of connectors) {
    try {
      const result = await connector.fetch();
      summary.push({ source: connector.source.slug, ...(await persistConnectorResult(db, result, runKey)) });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await recordConnectorError(db, connector.source.id, message);
      summary.push({
        source: connector.source.slug,
        error: message,
      });
    }
  }
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  await client.close();
  if (summary.every((item) => "error" in item)) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
