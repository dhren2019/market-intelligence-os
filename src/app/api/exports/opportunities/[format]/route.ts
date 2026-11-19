import { getDb } from "@/db/client";
import { exportOpportunities, type ExportFormat } from "@/domain/exports/service";

export const runtime = "nodejs";

const contentTypes: Record<ExportFormat, string> = {
  csv: "text/csv; charset=utf-8",
  json: "application/json; charset=utf-8",
  jsonl: "application/x-ndjson; charset=utf-8",
};

export async function GET(_request: Request, context: { params: Promise<{ format: string }> }) {
  const { format } = await context.params;
  if (!(format in contentTypes)) return Response.json({ error: "Formato no admitido." }, { status: 404 });
  const typedFormat = format as ExportFormat;
  const { db } = await getDb();
  const body = await exportOpportunities(db, typedFormat);
  return new Response(body, { headers: {
    "content-type": contentTypes[typedFormat],
    "content-disposition": `attachment; filename="oportunidades.${typedFormat}"`,
    "cache-control": "no-store",
  } });
}
