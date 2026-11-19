import { randomUUID } from "node:crypto";
import { desc, eq, inArray } from "drizzle-orm";
import type { AppDatabase } from "@/db/client";
import { opportunities } from "@/db/schema";
import { loadSeedCatalog } from "@/domain/opportunities/seed-catalog";

export async function seedCatalog(db: AppDatabase): Promise<{ inserted: number; existing: number }> {
  const records = await loadSeedCatalog();
  const ids = records.map((record) => record.externalId);
  const found = await db
    .select({ externalId: opportunities.externalId })
    .from(opportunities)
    .where(inArray(opportunities.externalId, ids));
  const existingIds = new Set(found.map((record) => record.externalId));
  const pending = records.filter((record) => !existingIds.has(record.externalId));

  if (pending.length) {
    await db.insert(opportunities).values(
      pending.map((record) => ({
        id: randomUUID(),
        externalId: record.externalId,
        name: record.name,
        category: record.category,
        buyer: record.buyer,
        opportunityType: record.opportunityType,
        scoringModel: record.scoringModel,
        legacyScore: record.legacyScore,
        claimType: record.claimType,
        sourceUrl: record.sourceUrl,
        sourceWorkbook: record.sourceWorkbook,
        sourceSheet: record.sourceSheet,
        sourceRow: record.sourceRow,
        origin: record.origin,
        rawPayload: record.rawPayload,
      })),
    );
  }

  return { inserted: pending.length, existing: existingIds.size };
}

export async function listOpportunities(db: AppDatabase) {
  return db.select().from(opportunities).orderBy(desc(opportunities.legacyScore), opportunities.externalId);
}

export async function getOpportunityByExternalId(db: AppDatabase, externalId: string) {
  const [record] = await db
    .select()
    .from(opportunities)
    .where(eq(opportunities.externalId, externalId))
    .limit(1);
  return record ?? null;
}

