import ExcelJS from "exceljs";
import type { AppDatabase } from "@/db/client";
import {
  dataSources,
  forecastBacktests,
  forecasts,
  fundingEvents,
  importRecords,
  imports,
  investors,
  opportunities,
  sectorDefinitions,
  trendObservations,
} from "@/db/schema";

export type ExportFormat = "json" | "jsonl" | "csv";

const FORMULA_PREFIX = /^[=+\-@\t\r]/;

export function neutraliseSpreadsheetValue(value: unknown): unknown {
  if (typeof value === "string") return FORMULA_PREFIX.test(value) ? `'${value}` : value;
  if (Array.isArray(value)) return value.map(neutraliseSpreadsheetValue);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, neutraliseSpreadsheetValue(nested)]),
    );
  }
  return value;
}

function serialiseCell(value: unknown): string | number | boolean | Date | null {
  const safe = neutraliseSpreadsheetValue(value);
  if (safe === null || safe === undefined) return null;
  if (safe instanceof Date || ["string", "number", "boolean"].includes(typeof safe)) {
    return safe as string | number | boolean | Date;
  }
  return JSON.stringify(safe);
}

function addSheet(
  workbook: ExcelJS.Workbook,
  name: string,
  records: Record<string, unknown>[],
): void {
  const sheet = workbook.addWorksheet(name, { views: [{ state: "frozen", ySplit: 1 }] });
  const keys = records.length ? Object.keys(records[0]) : ["sin_datos"];
  sheet.columns = keys.map((key) => ({ header: key, key, width: Math.min(42, Math.max(14, key.length + 2)) }));
  for (const record of records) {
    sheet.addRow(Object.fromEntries(keys.map((key) => [key, serialiseCell(record[key])])));
  }
  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF13233A" } };
  header.alignment = { vertical: "middle" };
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: keys.length } };
}

function plainRecord(record: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`), value]),
  );
}

export async function exportIntelligenceWorkbook(db: AppDatabase): Promise<Uint8Array> {
  const [opportunityRows, sectorRows, observationRows, sourceRows, investorRows, fundingRows, forecastRows, backtestRows, importRows, importedRows] = await Promise.all([
    db.select().from(opportunities),
    db.select().from(sectorDefinitions),
    db.select().from(trendObservations),
    db.select().from(dataSources),
    db.select().from(investors),
    db.select().from(fundingEvents),
    db.select().from(forecasts),
    db.select().from(forecastBacktests),
    db.select().from(imports),
    db.select().from(importRecords),
  ]);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Market Intelligence OS";
  workbook.created = new Date();
  addSheet(workbook, "Oportunidades", opportunityRows.map((row) => plainRecord(row)));
  addSheet(workbook, "Sectores", sectorRows.map((row) => plainRecord(row)));
  addSheet(workbook, "Observaciones", observationRows.map((row) => plainRecord(row)));
  addSheet(workbook, "Fuentes", sourceRows.map((row) => plainRecord(row)));
  addSheet(workbook, "Inversores", investorRows.map((row) => plainRecord(row)));
  addSheet(workbook, "Financiación", fundingRows.map((row) => plainRecord(row)));
  addSheet(workbook, "Forecasts", forecastRows.map((row) => plainRecord(row)));
  addSheet(workbook, "Backtests", backtestRows.map((row) => plainRecord(row)));
  addSheet(workbook, "Metodología", [
    { concepto: "Generado", definición: new Date().toISOString() },
    { concepto: "observed", definición: "Dato observado en la fuente citada; conserva unidad, periodo y fecha." },
    { concepto: "proxy", definición: "Medida indirecta de su propio fenómeno; no equivale a demanda o ingreso." },
    { concepto: "estimate", definición: "Estimación explícita; no se mezcla con observaciones." },
    { concepto: "hypothesis", definición: "Supuesto pendiente de validación comercial." },
    { concepto: "prediction", definición: "Pronóstico; solo se publica con método y backtest válidos." },
    { concepto: "legacy_score", definición: "Score heredado del Excel; no es evidencia comercial nueva." },
  ]);
  addSheet(workbook, "Importaciones", importRows.map((row) => plainRecord(row)));
  addSheet(workbook, "Registros importados", importedRows.map((row) => plainRecord(row)));
  const buffer = await workbook.xlsx.writeBuffer();
  return new Uint8Array(buffer as ArrayBuffer);
}

function csvCell(value: unknown): string {
  const serialised = serialiseCell(value);
  const text = serialised instanceof Date ? serialised.toISOString() : String(serialised ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function exportOpportunities(db: AppDatabase, format: ExportFormat): Promise<string> {
  const records = (await db.select().from(opportunities)).map((record) => plainRecord(record));
  if (format === "json") return JSON.stringify(records.map(neutraliseSpreadsheetValue), null, 2);
  if (format === "jsonl") {
    return records.map((record) => JSON.stringify(neutraliseSpreadsheetValue(record))).join("\n") + "\n";
  }
  const headers = records.length ? Object.keys(records[0]) : [];
  return [
    headers.map(csvCell).join(","),
    ...records.map((record) => headers.map((header) => csvCell(record[header])).join(",")),
  ].join("\n") + "\n";
}
