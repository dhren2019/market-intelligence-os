import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Market Intelligence OS", template: "%s · Market Intelligence OS" },
  description: "Inteligencia de mercado trazable para priorizar microproductos en España.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" suppressHydrationWarning><body suppressHydrationWarning><AppShell>{children}</AppShell></body></html>;
}
