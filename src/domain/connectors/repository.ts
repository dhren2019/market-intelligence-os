import { createHash, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { AppDatabase } from "@/db/client";
import { dataSources, sourceRuns, trendObservations } from "@/db/schema";
import type { CanonicalObservation, ConnectorResult } from "@/domain/connectors/types";
import type { PublicSourceDefinition } from "@/domain/connectors/types";

function observationHash(sourceId: string, observation: CanonicalObservation): string {
  return createHash("sha256")
    .update(JSON.stringify({
      sourceId,
      externalId: observation.externalId,
      metricName: observation.metricName,
      value: observation.value,
      unit: observation.unit,
      methodologyVersion: observation.methodologyVersion,
    }))
    .digest("hex");
}

export async function persistConnectorResult(
  db: AppDatabase,
  result: ConnectorResult,
  runKey?: string,
): Promise<{ runId: string; fetched: number; inserted: number }> {
  const runId = randomUUID();
  const completedAt = new Date();
  let inserted = 0;

  await db.transaction(async (transaction) => {
    await transaction
      .insert(dataSources)
      .values({
        id: result.source.id,
        slug: result.source.slug,
        name: result.source.name,
        documentationUrl: result.source.documentationUrl,
        scope: result.source.scope,
        license: result.source.license,
        authRequired: result.source.authRequired,
        status: "active",
        rateLimit: result.source.rateLimit,
        cost: result.source.cost,
        lastFetchedAt: completedAt,
      })
      .onConflictDoUpdate({
        target: dataSources.slug,
        set: {
          name: result.source.name,
          documentationUrl: result.source.documentationUrl,
          scope: result.source.scope,
          license: result.source.license,
          authRequired: result.source.authRequired,
          rateLimit: result.source.rateLimit,
          lastFetchedAt: completedAt,
          lastError: null,
          updatedAt: completedAt,
        },
      });

    for (const observation of result.observations) {
      const rows = await transaction
        .insert(trendObservations)
        .values({
          id: randomUUID(),
          externalId: observation.externalId,
          sourceId: result.source.id,
          topic: observation.topic,
          metricName: observation.metricName,
          value: String(observation.value),
          unit: observation.unit,
          country: observation.country,
          period: observation.period,
          observedAt: observation.observedAt,
          publishedAt: observation.publishedAt,
          fetchedAt: observation.fetchedAt,
          sourceUrl: observation.sourceUrl,
          dataQuality: observation.dataQuality,
          claimType: observation.claimType,
          methodologyVersion: observation.methodologyVersion,
          contentHash: observationHash(result.source.id, observation),
          rawPayload: observation.rawPayload,
        })
        .onConflictDoNothing()
        .returning({ id: trendObservations.id });
      inserted += rows.length;
    }

    await transaction.insert(sourceRuns).values({
      id: runId,
      sourceId: result.source.id,
      runKey,
      status: "completed",
      completedAt,
      fetchedRecords: result.observations.length,
      insertedRecords: inserted,
      metadata: result.metadata,
    });

    await transaction
      .update(dataSources)
      .set({ lastFetchedAt: completedAt, updatedAt: completedAt })
      .where(eq(dataSources.id, result.source.id));
  });

  return { runId, fetched: result.observations.length, inserted };
}

export async function registerPublicSources(
  db: AppDatabase,
  sources: PublicSourceDefinition[],
): Promise<void> {
  for (const source of sources) {
    await db.insert(dataSources).values({
      id: source.id,
      slug: source.slug,
      name: source.name,
      documentationUrl: source.documentationUrl,
      scope: source.scope,
      license: source.license,
      authRequired: source.authRequired,
      rateLimit: source.rateLimit,
      cost: source.cost,
      status: "active",
    }).onConflictDoUpdate({
      target: dataSources.slug,
      set: {
        name: source.name,
        documentationUrl: source.documentationUrl,
        scope: source.scope,
        license: source.license,
        authRequired: source.authRequired,
        rateLimit: source.rateLimit,
        updatedAt: new Date(),
      },
    });
  }
}

export async function recordConnectorError(
  db: AppDatabase,
  sourceId: string,
  message: string,
): Promise<void> {
  await db.update(dataSources).set({ lastError: message, updatedAt: new Date() }).where(eq(dataSources.id, sourceId));
}
