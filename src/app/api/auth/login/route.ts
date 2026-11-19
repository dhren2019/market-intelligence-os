import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

function equal(left: string, right: string): boolean {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.MIO_ADMIN_TOKEN;
  if (!expected) return Response.json({ error: "MIO_ADMIN_TOKEN no está configurado." }, { status: 503 });
  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  if (!equal(token, expected)) return Response.json({ error: "Credencial incorrecta." }, { status: 401 });
  const store = await cookies();
  store.set("mio_session", expected, { httpOnly: true, sameSite: "strict", secure: true, path: "/", maxAge: 60 * 60 * 12 });
  return Response.redirect(new URL("/", request.url), 303);
}
