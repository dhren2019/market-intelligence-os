import { desc, ne } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  companies,
  dataSources,
  forecastBacktests,
  forecasts,
  fundingEvents,
  imports,
  investors,
  opportunities,
  sectorDefinitions,
  sourceRuns,
  trendObservations,
} from "@/db/schema";
import { seedCatalog } from "@/domain/opportunities/repository";
import { seedReferenceCatalog } from "@/domain/reference/repository";
import { analyseTrend } from "@/domain/trends/engine";
import { createPublicConnectors } from "@/domain/connectors/registry";
import { registerPublicSources } from "@/domain/connectors/repository";
import {
  buildAlertSummary,
  buildForecastReadiness,
  buildInvestorCoverage,
  buildValidationQueue,
} from "@/domain/decision-center/model";

export function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function prepareDatabase() {
  const database = await getDb();
  await seedCatalog(database.db);
  await seedReferenceCatalog(database.db);
  await registerPublicSources(database.db, createPublicConnectors().map((connector) => connector.source));
  return database;
}

export async function getHomeData() {
  const { db } = await prepareDatabase();
  const [opportunityRows, sectorRows, companyRows, sourceRows, observationRows] = await Promise.all([
    db.select().from(opportunities).orderBy(desc(opportunities.legacyScore)),
    db.select().from(sectorDefinitions),
    db.select().from(companies),
    db.select().from(dataSources),
    db.select().from(trendObservations).where(ne(trendObservations.claimType, "demo")).orderBy(desc(trendObservations.observedAt)),
  ]);
  const topicMap = new Map<string, typeof observationRows>();
  for (const observation of observationRows) {
    topicMap.set(observation.topic, [...(topicMap.get(observation.topic) ?? []), observation]);
  }
  const trends = Array.from(topicMap.entries()).map(([topic, rows]) => ({
    topic,
    latest: rows[0],
    analysis: analyseTrend(rows.map((row) => ({ observedAt: row.observedAt, value: Number(row.value) }))),
  }));
  const validationQueue = buildValidationQueue(
    opportunityRows.map((row) => ({ ...row, rawPayload: objectValue(row.rawPayload) })),
    5,
  );
  return {
    opportunityCount: opportunityRows.length,
    sectorCount: sectorRows.length,
    companyCount: companyRows.length,
    sourceCount: sourceRows.length,
    observationCount: observationRows.length,
    topOpportunities: opportunityRows.slice(0, 8),
    technologyOpportunityCount: opportunityRows.filter((row) => row.opportunityType === "technology").length,
    validationQueue,
    trends,
  };
}

export async function getAppsData() {
  const rows = (await getOpportunityRows()).filter((row) => row.opportunityType === "technology");
  const groups = Array.from(new Set(rows.map((row) => row.category))).map((category) => {
    const opportunitiesInCategory = rows.filter((row) => row.category === category);
    return {
      category,
      count: opportunitiesInCategory.length,
      top: buildValidationQueue(
        opportunitiesInCategory.map((row) => ({ ...row, rawPayload: objectValue(row.rawPayload) })),
        3,
      ),
    };
  });
  return {
    count: rows.length,
    groups,
    queue: buildValidationQueue(rows.map((row) => ({ ...row, rawPayload: objectValue(row.rawPayload) })), 8),
  };
}

export async function getInvestorData() {
  const { db } = await prepareDatabase();
  const [investorRows, eventRows] = await Promise.all([
    db.select().from(investors).orderBy(investors.name),
    db.select().from(fundingEvents).orderBy(desc(fundingEvents.announcedAt)),
  ]);
  return {
    coverage: buildInvestorCoverage(investorRows, eventRows),
    investors: investorRows,
    events: eventRows,
  };
}

function analyseObservationRows(observationRows: Awaited<ReturnType<typeof getObservationRows>>) {
  const topicMap = new Map<string, typeof observationRows>();
  for (const observation of observationRows) {
    topicMap.set(observation.topic, [...(topicMap.get(observation.topic) ?? []), observation]);
  }
  return Array.from(topicMap.entries()).map(([topic, rows]) => {
    const analysis = analyseTrend(rows.map((row) => ({ observedAt: row.observedAt, value: Number(row.value) })));
    return { topic, metricName: rows[0].metricName, rows, analysis };
  });
}

async function getObservationRows() {
  const { db } = await prepareDatabase();
  return db
    .select()
    .from(trendObservations)
    .where(ne(trendObservations.claimType, "demo"))
    .orderBy(desc(trendObservations.observedAt));
}

export async function getAlertsData() {
  const [{ db }, observations] = await Promise.all([prepareDatabase(), getObservationRows()]);
  const sourceRows = await db.select().from(dataSources).orderBy(dataSources.name);
  const topics = analyseObservationRows(observations);
  return {
    alerts: buildAlertSummary({
      sources: sourceRows,
      trends: topics.map(({ topic, metricName, analysis }) => ({
        topic,
        metricName,
        sampleSize: analysis.sampleSize,
        status: analysis.status,
        windows: analysis.windows.map((window) => ({ days: window.days, percentChange: window.percentChange })),
      })),
    }),
    sourceCount: sourceRows.length,
    topicCount: topics.length,
  };
}

function inferFrequency(rows: Array<{ observedAt: Date }>): string {
  const ordered = rows.toSorted((left, right) => left.observedAt.getTime() - right.observedAt.getTime());
  if (ordered.length < 2) return "desconocida";
  const gaps = ordered.slice(1).map((row, index) =>
    (row.observedAt.getTime() - ordered[index].observedAt.getTime()) / 86_400_000,
  );
  const median = gaps.toSorted((left, right) => left - right)[Math.floor(gaps.length / 2)];
  if (median >= 25 && median <= 35) return "mensual";
  if (median >= 330 && median <= 400) return "anual";
  if (median >= 6 && median <= 8) return "semanal";
  return "irregular";
}

export async function getForecastData() {
  const [{ db }, observations] = await Promise.all([prepareDatabase(), getObservationRows()]);
  const [forecastRows, backtestRows] = await Promise.all([
    db.select().from(forecasts).orderBy(desc(forecasts.generatedAt)),
    db.select().from(forecastBacktests),
  ]);
  const topics = analyseObservationRows(observations);
  const readiness = buildForecastReadiness({
    topics: topics.map(({ topic, rows }) => ({
      topic,
      sampleSize: rows.length,
      frequency: inferFrequency(rows),
    })),
    forecasts: forecastRows,
    backtests: backtestRows,
  });
  return {
    readiness,
    publishableCount: readiness.filter((row) => row.status === "publishable").length,
  };
}

export async function getOpportunityRows() {
  const { db } = await prepareDatabase();
  return db.select().from(opportunities).orderBy(desc(opportunities.legacyScore));
}

export async function getSectorRows() {
  const { db } = await prepareDatabase();
  return db.select().from(sectorDefinitions);
}

export async function getCompanyRows() {
  const { db } = await prepareDatabase();
  return db.select().from(companies).orderBy(companies.name);
}

export async function getImportRows() {
  const { db } = await prepareDatabase();
  return db.select().from(imports).orderBy(desc(imports.importedAt));
}

export async function getSourceRows() {
  const { db } = await prepareDatabase();
  const [sources, runs] = await Promise.all([
    db.select().from(dataSources).orderBy(dataSources.name),
    db.select().from(sourceRuns).orderBy(desc(sourceRuns.startedAt)),
  ]);
  return sources.map((source) => ({
    ...source,
    lastRun: runs.find((run) => run.sourceId === source.id) ?? null,
  }));
}
