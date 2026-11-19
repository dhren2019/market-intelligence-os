import { afterEach, describe, expect, it } from "vitest";
import ExcelJS from "exceljs";
import { createDatabase, migrateDatabase } from "@/db/client";
import { importRecords, imports } from "@/db/schema";
import { exportIntelligenceWorkbook, exportOpportunities } from "@/domain/exports/service";
import { seedCatalog } from "@/domain/opportunities/repository";

describe("exports", () => {
  const clients: Array<{ close(): Promise<void> }> = [];
  afterEach(async () => Promise.all(clients.splice(0).map((client) => client.close())));

  it("creates an XLSX with sources and methodology, and neutralises spreadsheet formulas", async () => {
    const database = createDatabase();
    clients.push(database.client);
    await migrateDatabase(database.client);
    await seedCatalog(database.db);
    await database.db.insert(imports).values({
      id: "orphan-test-import",
      filename: "unsafe.jsonl",
      contentHash: "unsafe-import-hash",
      status: "completed",
      acceptedRows: 1,
      rejectedRows: 0,
    });
    await database.db.insert(importRecords).values({
      id: "unsafe-record",
      importId: "orphan-test-import",
      recordType: "company",
      claimType: "observed",
      contentHash: "unsafe-record-hash",
      rawPayload: { name: "=HYPERLINK(\"https://evil.invalid\")" },
    });

    const output = await exportIntelligenceWorkbook(database.db);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.from(output) as never);

    expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual([
      "Oportunidades",
      "Sectores",
      "Observaciones",
      "Fuentes",
      "Inversores",
      "Financiación",
      "Forecasts",
      "Backtests",
      "Metodología",
      "Importaciones",
      "Registros importados",
    ]);
    expect(workbook.getWorksheet("Oportunidades")?.actualRowCount).toBe(56);
    const rawPayloadCell = workbook
      .getWorksheet("Registros importados")
      ?.getRow(2)
      .values as unknown[];
    expect(JSON.stringify(rawPayloadCell)).toContain("'=HYPERLINK");
  });

  it("exports the canonical catalog as JSON, JSONL and CSV", async () => {
    const database = createDatabase();
    clients.push(database.client);
    await migrateDatabase(database.client);
    await seedCatalog(database.db);

    const json = await exportOpportunities(database.db, "json");
    const jsonl = await exportOpportunities(database.db, "jsonl");
    const csv = await exportOpportunities(database.db, "csv");

    expect(JSON.parse(json)).toHaveLength(55);
    expect(jsonl.trim().split("\n")).toHaveLength(55);
    expect(csv.split("\n")[0]).toContain("external_id");
    expect(csv.trim().split("\n")).toHaveLength(56);
  });
});
