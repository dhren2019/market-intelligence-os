import { afterEach, describe, expect, it } from "vitest";
import ExcelJS from "exceljs";
import { createDatabase, migrateDatabase } from "@/db/client";
import { imports, importRejections, trendObservations } from "@/db/schema";
import { commitImport, previewImport } from "@/domain/imports/service";

const validSignal = {
  schema_version: "1.0",
  record_type: "trend_observation",
  topic: "computer-vision-on-device",
  source_name: "Fuente aportada por usuario",
  source_url: "https://example.com/source",
  observed_at: "2026-11-18T08:00:00Z",
  country: "global",
  metric_name: "public_repositories_matched",
  value: 12,
  unit: "repositories",
  claim_type: "proxy",
  notes: "Campo desconocido que debe conservarse en raw_payload",
};

describe("importación de archivos", () => {
  const clients: Array<{ close(): Promise<void> }> = [];

  afterEach(async () => {
    await Promise.all(clients.splice(0).map((client) => client.close()));
  });

  it("previsualiza JSON y conserva campos desconocidos", async () => {
    const input = {
      filename: "signal.json",
      mimeType: "application/json",
      content: Buffer.from(JSON.stringify(validSignal)),
    };

    const preview = await previewImport(input);

    expect(preview.acceptedRows).toBe(1);
    expect(preview.rejectedRows).toBe(0);
    expect(preview.preview[0]?.rawPayload.notes).toContain("desconocido");
  });

  it("acepta líneas válidas, rechaza una línea rota y no duplica el archivo", async () => {
    const database = createDatabase();
    clients.push(database.client);
    await migrateDatabase(database.client);
    const input = {
      filename: "signals.jsonl",
      mimeType: "application/x-ndjson",
      content: Buffer.from(`${JSON.stringify(validSignal)}\n{"broken":\n${JSON.stringify({ ...validSignal, topic: "edge-ai" })}\n`),
    };

    const preview = await previewImport(input);
    const first = await commitImport(database.db, input);
    const second = await commitImport(database.db, input);

    expect(preview.acceptedRows).toBe(2);
    expect(preview.rejectedRows).toBe(1);
    expect(preview.rejections[0]?.lineNumber).toBe(2);
    expect(first).toMatchObject({ duplicate: false, acceptedRows: 2, rejectedRows: 1 });
    expect(second).toMatchObject({ duplicate: true, acceptedRows: 2, rejectedRows: 1 });
    expect(await database.db.select().from(imports)).toHaveLength(1);
    expect(await database.db.select().from(importRejections)).toHaveLength(1);
    expect(await database.db.select().from(trendObservations)).toHaveLength(2);
  });

  it("rechaza archivos que superan el límite antes de parsearlos", async () => {
    await expect(
      previewImport({
        filename: "large.json",
        content: Buffer.from("x".repeat(21)),
        maxBytes: 20,
      }),
    ).rejects.toThrow("supera el límite");
  });

  it("rechaza una extensión y un MIME incompatibles", async () => {
    await expect(previewImport({
      filename: "payload.xlsx",
      mimeType: "text/html",
      content: Buffer.from("<html></html>"),
    })).rejects.toThrow("MIME");
  });

  it("acepta CSV con cabeceras canónicas", async () => {
    const headers = Object.keys(validSignal);
    const row = headers.map((key) => JSON.stringify(validSignal[key as keyof typeof validSignal])).join(",");
    const preview = await previewImport({
      filename: "signals.csv",
      mimeType: "text/csv",
      content: Buffer.from(`${headers.join(",")}\n${row}\n`),
    });

    expect(preview.acceptedRows).toBe(1);
    expect(preview.preview[0]?.recordType).toBe("trend_observation");
  });

  it("acepta XLSX y usa la primera hoja no vacía", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Datos");
    const headers = Object.keys(validSignal);
    sheet.addRow(headers);
    sheet.addRow(headers.map((key) => validSignal[key as keyof typeof validSignal]));
    const content = Buffer.from(await workbook.xlsx.writeBuffer());

    const preview = await previewImport({
      filename: "signals.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      content,
    });

    expect(preview.acceptedRows).toBe(1);
    expect(preview.rejectedRows).toBe(0);
  });
});

