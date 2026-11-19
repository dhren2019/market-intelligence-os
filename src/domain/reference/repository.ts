import competitorsPayload from "../../../data/imports/seed/competidores_importados.json";
import sectorsPayload from "../../../data/imports/seed/sectores_5_importados.json";
import technologyPayload from "../../../data/imports/seed/tecnologia_sector_importado.json";
import type { AppDatabase } from "@/db/client";
import { companies, sectorDefinitions } from "@/db/schema";

type SeedEnvelope = {
  origin: string;
  source_workbook: string;
  source_sheet: string;
  source_row: number;
  original_fields: Record<string, unknown>;
  sector_taxonomy?: string;
  methodology?: string;
};

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function seedReferenceCatalog(db: AppDatabase): Promise<{
  sectorsInserted: number;
  companiesInserted: number;
}> {
  const sectors = [...(sectorsPayload as SeedEnvelope[]), technologyPayload as SeedEnvelope];
  const competitors = competitorsPayload as SeedEnvelope[];
  let sectorsInserted = 0;
  let companiesInserted = 0;

  await db.transaction(async (transaction) => {
    for (const [index, record] of sectors.entries()) {
      const name = String(record.original_fields.Sector ?? `Sector ${index + 1}`);
      const inserted = await transaction
        .insert(sectorDefinitions)
        .values({
          id: `sector-seed-${index + 1}-${slug(name)}`,
          name,
          sectorTaxonomy: record.sector_taxonomy ?? null,
          country: "ES",
          methodology:
            record.methodology ??
            "Extracted verbatim from audited workbook; verify the cited source before analytical use",
          rawPayload: record,
        })
        .onConflictDoNothing()
        .returning({ id: sectorDefinitions.id });
      sectorsInserted += inserted.length;
    }

    for (const [index, record] of competitors.entries()) {
      const name = String(record.original_fields.Empresa ?? `Empresa ${index + 1}`);
      const inserted = await transaction
        .insert(companies)
        .values({
          id: `company-seed-${index + 1}-${slug(name)}`,
          name,
          country: null,
          buyerPersona: String(record.original_fields.Sector ?? "") || null,
          sourceUrl: null,
          reviewedAt: null,
          rawPayload: record,
        })
        .onConflictDoNothing()
        .returning({ id: companies.id });
      companiesInserted += inserted.length;
    }
  });

  return { sectorsInserted, companiesInserted };
}
