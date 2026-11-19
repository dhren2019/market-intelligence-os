import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

function equal(left: string, right: string): boolean {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();
  const expected = process.env.MIO_ADMIN_TOKEN;
  const pathname = request.nextUrl.pathname;
  if (pathname === "/login" || pathname === "/api/auth/login") return NextResponse.next();
  const token = request.cookies.get("mio_session")?.value ?? "";
  if (expected && equal(token, expected)) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
