import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ClaimType } from "@/domain/evidence";

type RawSeedRecord = {
  legacy_score: number | null;
  origin: string;
  original_fields: Record<string, unknown>;
  record_type: string;
  source_row: number;
  source_sheet: string;
  source_workbook: string;
};

export type OpportunitySeed = {
  externalId: string;
  name: string;
  category: string;
  buyer: string;
  opportunityType: "sector" | "technology";
  scoringModel: "b2b" | "game";
  legacyScore: number | null;
  claimType: ClaimType;
  sourceUrl: string | null;
  sourceWorkbook: string;
  sourceSheet: string;
  sourceRow: number;
  origin: string;
  rawPayload: Record<string, unknown>;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

function normalizeRecord(record: RawSeedRecord): OpportunitySeed {
  const fields = record.original_fields;
  const externalId = text(fields.ID);
  const technology = record.source_sheet === "12_TECH_30_IDEAS";
  const game = technology && externalId.startsWith("G");

  return {
    externalId,
    name: text(fields.Microproducto ?? fields["Producto propuesto"]),
    category: text(fields.Sector ?? fields.Línea),
    buyer: text(fields["Quién paga"]),
    opportunityType: technology ? "technology" : "sector",
    scoringModel: game ? "game" : "b2b",
    legacyScore: record.legacy_score,
    claimType: "hypothesis",
    sourceUrl: text(fields["Fuente ejemplo URL"] ?? fields["Fuente de competidor"]) || null,
    sourceWorkbook: record.source_workbook,
    sourceSheet: record.source_sheet,
    sourceRow: record.source_row,
    origin: record.origin,
    rawPayload: fields,
  };
}

export async function loadSeedCatalog(
  seedPath = path.join(process.cwd(), "data/imports/seed/oportunidades_55_importadas.json"),
): Promise<OpportunitySeed[]> {
  const records = JSON.parse(await readFile(seedPath, "utf8")) as RawSeedRecord[];
  const normalized = records.map(normalizeRecord);
  const unique = new Map(normalized.map((record) => [record.externalId, record]));

  if (unique.size !== 55 || normalized.length !== 55) {
    throw new Error(
      `El catálogo inicial debe contener 55 oportunidades únicas; recibió ${normalized.length} filas y ${unique.size} IDs.`,
    );
  }

  return [...unique.values()];
}

