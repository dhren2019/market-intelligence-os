import { createHash, randomUUID } from "node:crypto";
import ExcelJS from "exceljs";
import { parse as parseCsvRows } from "csv-parse/sync";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { AppDatabase } from "@/db/client";
import {
  dataSources,
  importRecords,
  importRejections,
  imports,
  trendObservations,
} from "@/db/schema";
import { claimTypes, type ClaimType } from "@/domain/evidence";

const recordTypes = [
  "sector_metric",
  "trend_observation",
  "company",
  "pricing_observation",
  "funding_event",
  "demand_signal",
  "opportunity",
  "app_signal",
  "game_signal",
  "source_event",
] as const;

const baseSchema = z
  .object({
    schema_version: z.string().default("1.0"),
    record_type: z.enum(recordTypes),
    claim_type: z.enum(claimTypes).optional(),
  })
  .passthrough();

const trendSchema = baseSchema.extend({
  record_type: z.literal("trend_observation"),
  topic: z.string().min(1),
  source_name: z.string().min(1),
  source_url: z.url(),
  observed_at: z.iso.datetime(),
  published_at: z.iso.datetime().optional(),
  country: z.string().min(1),
  metric_name: z.string().min(1),
  value: z.coerce.number().finite(),
  unit: z.string().min(1),
  claim_type: z.enum(claimTypes),
  external_id: z.string().optional(),
  period: z.string().optional(),
  data_quality: z.string().optional(),
});

export type ImportInput = {
  filename: string;
  mimeType?: string;
  content: Uint8Array;
  maxBytes?: number;
};

type AcceptedRecord = {
  lineNumber: number;
  recordType: (typeof recordTypes)[number];
  claimType: ClaimType;
  rawPayload: Record<string, unknown>;
  trend?: z.infer<typeof trendSchema>;
};

export type ImportRejection = {
  lineNumber: number;
  reason: string;
  rawPayload: unknown;
};

type ParsedImport = {
  contentHash: string;
  accepted: AcceptedRecord[];
  rejections: ImportRejection[];
};

export type ImportPreview = {
  contentHash: string;
  acceptedRows: number;
  rejectedRows: number;
  preview: AcceptedRecord[];
  rejections: ImportRejection[];
};

function sha256(value: Uint8Array | string): string {
  return createHash("sha256").update(value).digest("hex");
}

function parseJsonRecord(value: unknown, lineNumber: number): AcceptedRecord | ImportRejection {
  const base = baseSchema.safeParse(value);
  if (!base.success) {
    return {
      lineNumber,
      reason: z.prettifyError(base.error),
      rawPayload: value,
    };
  }

  const claimType = base.data.claim_type ?? (base.data.record_type === "opportunity" ? "hypothesis" : null);
  if (!claimType) {
    return {
      lineNumber,
      reason: "claim_type es obligatorio para datos que no sean oportunidades.",
      rawPayload: value,
    };
  }

  if (base.data.record_type === "trend_observation") {
    const trend = trendSchema.safeParse(value);
    if (!trend.success) {
      return {
        lineNumber,
        reason: z.prettifyError(trend.error),
        rawPayload: value,
      };
    }
    return {
      lineNumber,
      recordType: "trend_observation",
      claimType: trend.data.claim_type,
      rawPayload: value as Record<string, unknown>,
      trend: trend.data,
    };
  }

  return {
    lineNumber,
    recordType: base.data.record_type,
    claimType,
    rawPayload: value as Record<string, unknown>,
  };
}

function parseJson(content: string): Array<AcceptedRecord | ImportRejection> {
  try {
    const value = JSON.parse(content) as unknown;
    const values = Array.isArray(value) ? value : [value];
    return values.map((record, index) => parseJsonRecord(record, index + 1));
  } catch (error) {
    return [
      {
        lineNumber: 1,
        reason: error instanceof Error ? error.message : "JSON no válido.",
        rawPayload: content.slice(0, 500),
      },
    ];
  }
}

function parseJsonLines(content: string): Array<AcceptedRecord | ImportRejection> {
  return content
    .split(/\r?\n/)
    .map((line, index) => ({ line, lineNumber: index + 1 }))
    .filter(({ line }) => line.trim().length > 0)
    .map(({ line, lineNumber }) => {
      try {
        return parseJsonRecord(JSON.parse(line) as unknown, lineNumber);
      } catch (error) {
        return {
          lineNumber,
          reason: error instanceof Error ? error.message : "JSONL no válido.",
          rawPayload: line.slice(0, 500),
        } satisfies ImportRejection;
      }
    });
}

function parseCsv(content: string): Array<AcceptedRecord | ImportRejection> {
  try {
    const records = parseCsvRows(content, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, unknown>[];
    return records.map((record, index) => parseJsonRecord(record, index + 2));
  } catch (error) {
    return [
      {
        lineNumber: 1,
        reason: error instanceof Error ? error.message : "CSV no válido.",
        rawPayload: content.slice(0, 500),
      },
    ];
  }
}

function excelCellValue(cell: ExcelJS.Cell): unknown {
  if (cell.value instanceof Date) return cell.value.toISOString();
  if (cell.value && typeof cell.value === "object") {
    if ("formula" in cell.value) return `=${cell.value.formula}`;
    return cell.text;
  }
  return cell.value;
}

async function parseXlsx(content: Uint8Array): Promise<Array<AcceptedRecord | ImportRejection>> {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.from(content) as never);
    const sheet = workbook.worksheets.find((candidate) => candidate.actualRowCount > 0);
    if (!sheet) {
      return [{ lineNumber: 1, reason: "El XLSX no contiene hojas con datos.", rawPayload: {} }];
    }
    const headerRow = sheet.getRow(1);
    const headers = Array.from({ length: headerRow.cellCount }, (_, index) =>
      String(headerRow.getCell(index + 1).text ?? "").trim(),
    );
    const records: Array<AcceptedRecord | ImportRejection> = [];
    for (let rowNumber = 2; rowNumber <= sheet.actualRowCount; rowNumber += 1) {
      const row = sheet.getRow(rowNumber);
      const record = Object.fromEntries(
        headers
          .map((header, index) => [header, excelCellValue(row.getCell(index + 1))] as const)
          .filter(([header]) => header.length > 0),
      );
      if (Object.values(record).every((value) => value === null || value === undefined || value === "")) continue;
      records.push(parseJsonRecord(record, rowNumber));
    }
    return records;
  } catch (error) {
    return [
      {
        lineNumber: 1,
        reason: error instanceof Error ? error.message : "XLSX no válido.",
        rawPayload: {},
      },
    ];
  }
}

function isAccepted(record: AcceptedRecord | ImportRejection): record is AcceptedRecord {
  return "recordType" in record;
}

async function parseImport(input: ImportInput): Promise<ParsedImport> {
  const maxBytes = input.maxBytes ?? 5 * 1024 * 1024;
  if (input.content.byteLength > maxBytes) {
    throw new Error(`El archivo supera el límite de ${maxBytes} bytes.`);
  }
  const contentHash = sha256(input.content);
  const content = Buffer.from(input.content).toString("utf8");
  const extension = input.filename.toLowerCase().split(".").pop();
  const allowedMimes: Record<string, string[]> = {
    json: ["application/json", "text/json"],
    jsonl: ["application/x-ndjson", "application/ndjson", "application/json", "text/plain"],
    ndjson: ["application/x-ndjson", "application/ndjson", "application/json", "text/plain"],
    csv: ["text/csv", "application/csv", "application/vnd.ms-excel", "text/plain"],
    xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  };
  const mimeType = input.mimeType?.toLowerCase().split(";")[0].trim();
  if (
    extension && mimeType && mimeType !== "application/octet-stream" &&
    allowedMimes[extension] && !allowedMimes[extension].includes(mimeType)
  ) {
    throw new Error(`El MIME ${mimeType} no es compatible con la extensión .${extension}.`);
  }
  let records: Array<AcceptedRecord | ImportRejection>;
  if (extension === "jsonl" || extension === "ndjson") records = parseJsonLines(content);
  else if (extension === "json") records = parseJson(content);
  else if (extension === "csv") records = parseCsv(content);
  else if (extension === "xlsx") records = await parseXlsx(input.content);
  else {
    throw new Error("Formato no admitido. Usa JSON, JSONL, NDJSON, CSV o XLSX.");
  }

  return {
    contentHash,
    accepted: records.filter(isAccepted),
    rejections: records.filter((record): record is ImportRejection => !isAccepted(record)),
  };
}

export async function previewImport(input: ImportInput): Promise<ImportPreview> {
  const parsed = await parseImport(input);
  return {
    contentHash: parsed.contentHash,
    acceptedRows: parsed.accepted.length,
    rejectedRows: parsed.rejections.length,
    preview: parsed.accepted.slice(0, 20),
    rejections: parsed.rejections,
  };
}

export async function commitImport(db: AppDatabase, input: ImportInput) {
  const parsed = await parseImport(input);
  const [existing] = await db.select().from(imports).where(eq(imports.contentHash, parsed.contentHash)).limit(1);
  if (existing) {
    return {
      duplicate: true,
      importId: existing.id,
      acceptedRows: existing.acceptedRows,
      rejectedRows: existing.rejectedRows,
    };
  }

  const importId = randomUUID();
  const fetchedAt = new Date();
  await db.transaction(async (transaction) => {
    await transaction
      .insert(dataSources)
      .values({
        id: "manual-import",
        slug: "manual-import",
        name: "Importación manual",
        documentationUrl: "local://docs/importaciones",
        scope: "Archivos aportados por el usuario",
        license: "Aportada por el usuario; no redistribuir automáticamente",
        authRequired: true,
        status: "active",
        rateLimit: "No aplica",
        cost: "free",
      })
      .onConflictDoNothing();
    await transaction.insert(imports).values({
      id: importId,
      filename: input.filename,
      contentHash: parsed.contentHash,
      mimeType: input.mimeType,
      status: parsed.rejections.length ? "partial" : "completed",
      acceptedRows: parsed.accepted.length,
      rejectedRows: parsed.rejections.length,
      rawMetadata: { size: input.content.byteLength },
    });

    if (parsed.accepted.length) {
      await transaction.insert(importRecords).values(
        parsed.accepted.map((record) => ({
          id: randomUUID(),
          importId,
          lineNumber: record.lineNumber,
          recordType: record.recordType,
          claimType: record.claimType,
          contentHash: sha256(`${parsed.contentHash}:${record.lineNumber}`),
          rawPayload: record.rawPayload,
        })),
      );
    }
    if (parsed.rejections.length) {
      await transaction.insert(importRejections).values(
        parsed.rejections.map((rejection) => ({
          id: randomUUID(),
          importId,
          lineNumber: rejection.lineNumber,
          reason: rejection.reason,
          rawPayload:
            rejection.rawPayload && typeof rejection.rawPayload === "object"
              ? (rejection.rawPayload as Record<string, unknown>)
              : { value: rejection.rawPayload },
        })),
      );
    }
    const trends = parsed.accepted.filter((record) => record.trend);
    if (trends.length) {
      await transaction
        .insert(trendObservations)
        .values(
          trends.map((record) => {
            const trend = record.trend!;
            return {
              id: randomUUID(),
              externalId: trend.external_id,
              sourceId: "manual-import",
              topic: trend.topic,
              metricName: trend.metric_name,
              value: String(trend.value),
              unit: trend.unit,
              country: trend.country,
              period: trend.period ?? trend.observed_at.slice(0, 10),
              observedAt: new Date(trend.observed_at),
              publishedAt: trend.published_at ? new Date(trend.published_at) : null,
              fetchedAt,
              sourceUrl: trend.source_url,
              dataQuality: trend.data_quality ?? "unverified_user_input",
              claimType: trend.claim_type,
              methodologyVersion: "import-v1",
              contentHash: sha256(`${parsed.contentHash}:${record.lineNumber}:trend`),
              rawPayload: record.rawPayload,
            };
          }),
        )
        .onConflictDoNothing();
    }
  });

  return {
    duplicate: false,
    importId,
    acceptedRows: parsed.accepted.length,
    rejectedRows: parsed.rejections.length,
  };
}

