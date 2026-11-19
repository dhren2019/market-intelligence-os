import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { AppDatabase } from "@/db/client";
import { dailyRuns } from "@/db/schema";
import { persistConnectorResult, recordConnectorError, registerPublicSources } from "@/domain/connectors/repository";
import type { Connector } from "@/domain/connectors/types";

function madridParts(date: Date): Record<string, string> {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Madrid",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date).map((part) => [part.type, part.value]),
  );
}

export function madridRunKey(date: Date): string {
  const parts = madridParts(date);
  return `daily:${parts.year}-${parts.month}-${parts.day}`;
}

export async function runDailySync({
  db,
  connectors,
  now = new Date(),
  enforceMadridHour = false,
}: {
  db: AppDatabase;
  connectors: Connector[];
  now?: Date;
  enforceMadridHour?: boolean;
}) {
  const parts = madridParts(now);
  const runKey = madridRunKey(now);
  if (enforceMadridHour && parts.hour !== "09") {
    return { status: "outside_window" as const, runKey, summary: {} };
  }

  const inserted = await db.insert(dailyRuns).values({
    id: randomUUID(), runKey, status: "running", startedAt: now, summary: {},
  }).onConflictDoNothing({ target: dailyRuns.runKey }).returning({ id: dailyRuns.id });
  if (!inserted.length) return { status: "already_completed" as const, runKey, summary: {} };

  await registerPublicSources(db, connectors.map((connector) => connector.source));
  const results: Array<Record<string, unknown>> = [];
  for (const connector of connectors) {
    try {
      results.push({ source: connector.source.slug, ...(await persistConnectorResult(db, await connector.fetch(), runKey)) });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await recordConnectorError(db, connector.source.id, message);
      results.push({ source: connector.source.slug, error: message });
    }
  }
  const failures = results.filter((result) => "error" in result).length;
  const status = failures === 0 ? "completed" : failures === results.length ? "failed" : "partial";
  const completedAt = new Date();
  const summary = { sources: results, failures };
  await db.update(dailyRuns).set({ status, completedAt, summary }).where(eq(dailyRuns.runKey, runKey));
  return { status, runKey, summary };
}
