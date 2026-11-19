import { previewImport } from "@/domain/imports/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) return Response.json({ error: "Falta el archivo." }, { status: 400 });
    const result = await previewImport({
      filename: file.name,
      mimeType: file.type,
      content: new Uint8Array(await file.arrayBuffer()),
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
