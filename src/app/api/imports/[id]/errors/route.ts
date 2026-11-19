import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { importRejections } from "@/db/schema";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { db } = await getDb();
  const rows = await db.select().from(importRejections).where(eq(importRejections.importId, id));
  return new Response(JSON.stringify(rows, null, 2), { headers: {
    "content-type": "application/json; charset=utf-8",
    "content-disposition": `attachment; filename="import-${id}-errores.json"`,
    "cache-control": "no-store",
  } });
}
