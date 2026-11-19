import { getDb } from "@/db/client";
import { exportIntelligenceWorkbook } from "@/domain/exports/service";

export const runtime = "nodejs";

export async function GET() {
  const { db } = await getDb();
  const workbook = await exportIntelligenceWorkbook(db);
  return new Response(Buffer.from(workbook), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": 'attachment; filename="market-intelligence-os.xlsx"',
      "cache-control": "no-store",
    },
  });
}
