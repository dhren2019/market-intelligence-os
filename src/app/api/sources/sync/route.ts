import { getDb } from "@/db/client";
import { persistConnectorResult, recordConnectorError, registerPublicSources } from "@/domain/connectors/repository";
import { createPublicConnectors } from "@/domain/connectors/registry";

export const runtime = "nodejs";

export async function POST() {
  const { db } = await getDb();
  const connectors = createPublicConnectors();
  await registerPublicSources(db, connectors.map((connector) => connector.source));
  const runKey = `web:${new Date().toISOString()}`;
  const results = [];
  for (const connector of connectors) {
    try {
      results.push({ source: connector.source.slug, ...(await persistConnectorResult(db, await connector.fetch(), runKey)) });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await recordConnectorError(db, connector.source.id, message);
      results.push({ source: connector.source.slug, error: message });
    }
  }
  const failed = results.filter((result) => "error" in result).length;
  return Response.json({ succeeded: results.length - failed, failed, results }, { status: failed === results.length ? 502 : 200 });
}
