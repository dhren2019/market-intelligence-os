import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const auditColumns = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const opportunities = pgTable(
  "opportunities",
  {
    id: text("id").primaryKey(),
    externalId: text("external_id").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    buyer: text("buyer").notNull(),
    opportunityType: text("opportunity_type").notNull(),
    scoringModel: text("scoring_model").notNull(),
    status: text("status").notNull().default("idea"),
    legacyScore: integer("legacy_score"),
    evidenceScore: numeric("evidence_score"),
    buildScore: numeric("build_score"),
    claimType: text("claim_type").notNull(),
    sourceUrl: text("source_url"),
    sourceWorkbook: text("source_workbook").notNull(),
    sourceSheet: text("source_sheet").notNull(),
    sourceRow: integer("source_row").notNull(),
    origin: text("origin").notNull(),
    rawPayload: jsonb("raw_payload").notNull(),
    ...auditColumns,
  },
  (table) => [uniqueIndex("opportunities_external_id_uq").on(table.externalId)],
);

export const imports = pgTable(
  "imports",
  {
    id: text("id").primaryKey(),
    filename: text("filename").notNull(),
    contentHash: text("content_hash").notNull(),
    mimeType: text("mime_type"),
    status: text("status").notNull(),
    acceptedRows: integer("accepted_rows").notNull().default(0),
    rejectedRows: integer("rejected_rows").notNull().default(0),
    importedAt: timestamp("imported_at", { withTimezone: true }).notNull().defaultNow(),
    rawMetadata: jsonb("raw_metadata").notNull().default({}),
  },
  (table) => [uniqueIndex("imports_content_hash_uq").on(table.contentHash)],
);

export const importRejections = pgTable("import_rejections", {
  id: text("id").primaryKey(),
  importId: text("import_id").notNull(),
  lineNumber: integer("line_number"),
  reason: text("reason").notNull(),
  rawPayload: jsonb("raw_payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const importRecords = pgTable(
  "import_records",
  {
    id: text("id").primaryKey(),
    importId: text("import_id").notNull(),
    lineNumber: integer("line_number"),
    recordType: text("record_type").notNull(),
    claimType: text("claim_type").notNull(),
    contentHash: text("content_hash").notNull(),
    rawPayload: jsonb("raw_payload").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("import_records_content_hash_uq").on(table.contentHash)],
);

export const dataSources = pgTable(
  "data_sources",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    documentationUrl: text("documentation_url").notNull(),
    scope: text("scope").notNull(),
    license: text("license").notNull(),
    authRequired: boolean("auth_required").notNull().default(false),
    status: text("status").notNull().default("active"),
    rateLimit: text("rate_limit"),
    cost: text("cost").notNull().default("free"),
    lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }),
    lastPublishedAt: timestamp("last_published_at", { withTimezone: true }),
    lastError: text("last_error"),
    ...auditColumns,
  },
  (table) => [uniqueIndex("data_sources_slug_uq").on(table.slug)],
);

export const sourceRuns = pgTable("source_runs", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull(),
  runKey: text("run_key"),
  status: text("status").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  fetchedRecords: integer("fetched_records").notNull().default(0),
  insertedRecords: integer("inserted_records").notNull().default(0),
  error: text("error"),
  metadata: jsonb("metadata").notNull().default({}),
});

export const trendObservations = pgTable(
  "trend_observations",
  {
    id: text("id").primaryKey(),
    externalId: text("external_id"),
    sourceId: text("source_id").notNull(),
    topic: text("topic").notNull(),
    metricName: text("metric_name").notNull(),
    value: numeric("value").notNull(),
    unit: text("unit").notNull(),
    country: text("country").notNull(),
    period: text("period").notNull(),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull(),
    sourceUrl: text("source_url").notNull(),
    dataQuality: text("data_quality").notNull(),
    claimType: text("claim_type").notNull(),
    methodologyVersion: text("methodology_version").notNull(),
    contentHash: text("content_hash").notNull(),
    rawPayload: jsonb("raw_payload").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("trend_observations_hash_uq").on(table.contentHash),
    uniqueIndex("trend_observations_identity_uq").on(
      table.sourceId,
      table.externalId,
      table.value,
      table.unit,
      table.methodologyVersion,
    ),
  ],
);

export const sectorObservations = pgTable("sector_observations", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull(),
  sectorCode: text("sector_code"),
  sectorTaxonomy: text("sector_taxonomy"),
  sectorName: text("sector_name").notNull(),
  metricName: text("metric_name").notNull(),
  value: numeric("value").notNull(),
  unit: text("unit").notNull(),
  currency: text("currency"),
  country: text("country").notNull(),
  period: text("period").notNull(),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
  sourceUrl: text("source_url").notNull(),
  claimType: text("claim_type").notNull(),
  methodologyVersion: text("methodology_version").notNull(),
  rawPayload: jsonb("raw_payload").notNull(),
});

export const sectorDefinitions = pgTable("sector_definitions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sectorCode: text("sector_code"),
  sectorTaxonomy: text("sector_taxonomy"),
  country: text("country").notNull(),
  methodology: text("methodology").notNull(),
  rawPayload: jsonb("raw_payload").notNull().default({}),
});

export const companies = pgTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website"),
  country: text("country"),
  buyerPersona: text("buyer_persona"),
  sourceUrl: text("source_url"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  rawPayload: jsonb("raw_payload").notNull().default({}),
  ...auditColumns,
});

export const pricingObservations = pgTable("pricing_observations", {
  id: text("id").primaryKey(),
  companyId: text("company_id").notNull(),
  planName: text("plan_name"),
  amount: numeric("amount"),
  currency: text("currency"),
  billingPeriod: text("billing_period"),
  claimType: text("claim_type").notNull().default("observed"),
  sourceUrl: text("source_url").notNull(),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
  rawPayload: jsonb("raw_payload").notNull(),
});

export const revenueClaims = pgTable("revenue_claims", {
  id: text("id").primaryKey(),
  companyId: text("company_id").notNull(),
  amount: numeric("amount"),
  currency: text("currency"),
  periodType: text("period_type").notNull(),
  evidenceType: text("evidence_type").notNull(),
  claimType: text("claim_type").notNull(),
  sourceUrl: text("source_url").notNull(),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
  rawPayload: jsonb("raw_payload").notNull(),
});

export const fundingEvents = pgTable("funding_events", {
  id: text("id").primaryKey(),
  companyId: text("company_id"),
  eventType: text("event_type").notNull(),
  amount: numeric("amount"),
  currency: text("currency"),
  announcedAt: timestamp("announced_at", { withTimezone: true }),
  sourceUrl: text("source_url").notNull(),
  claimType: text("claim_type").notNull(),
  rawPayload: jsonb("raw_payload").notNull(),
});

export const investors = pgTable("investors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website"),
  country: text("country"),
  rawPayload: jsonb("raw_payload").notNull().default({}),
});

export const forecasts = pgTable("forecasts", {
  id: text("id").primaryKey(),
  topic: text("topic").notNull(),
  horizonDays: integer("horizon_days").notNull(),
  method: text("method").notNull(),
  status: text("status").notNull(),
  pointValue: numeric("point_value"),
  lowerValue: numeric("lower_value"),
  upperValue: numeric("upper_value"),
  unit: text("unit"),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull(),
  methodologyVersion: text("methodology_version").notNull(),
  rawPayload: jsonb("raw_payload").notNull().default({}),
});

export const forecastBacktests = pgTable("forecast_backtests", {
  id: text("id").primaryKey(),
  forecastId: text("forecast_id").notNull(),
  baselineMethod: text("baseline_method").notNull(),
  modelError: numeric("model_error"),
  baselineError: numeric("baseline_error"),
  sampleSize: integer("sample_size").notNull(),
  passed: boolean("passed").notNull(),
  rawPayload: jsonb("raw_payload").notNull().default({}),
});

export const dailyRuns = pgTable(
  "daily_runs",
  {
    id: text("id").primaryKey(),
    runKey: text("run_key").notNull(),
    status: text("status").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    summary: jsonb("summary").notNull().default({}),
  },
  (table) => [uniqueIndex("daily_runs_run_key_uq").on(table.runKey)],
);

