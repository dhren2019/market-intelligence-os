import Link from "next/link";
import {
  Building2,
  BellRing,
  ChartNoAxesCombined,
  DatabaseZap,
  Factory,
  FileUp,
  Gauge,
  Landmark,
  Lightbulb,
  LockKeyhole,
  Orbit,
  Gamepad2,
  Laptop,
  Code2,
  Bot,
  Compass,
  Smartphone,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { href: "/", label: "Inicio", icon: Gauge },
  { href: "/sectores", label: "Sectores", icon: Factory },
  { href: "/oportunidades", label: "Oportunidades", icon: Lightbulb },
  { href: "/apps", label: "Ideas tech (Excel)", icon: Smartphone },
  { href: "/mercados", label: "Mercados y tendencias", icon: ChartNoAxesCombined },
  { href: "/mercados/apps", label: "Apps móviles", icon: Smartphone },
  { href: "/mercados/games", label: "Juegos mobile", icon: Gamepad2 },
  { href: "/mercados/saas", label: "SaaS y agentes", icon: Bot },
  { href: "/mercados/software", label: "Software PC", icon: Laptop },
  { href: "/mercados/webdev", label: "Web / Dev tools", icon: Code2 },
  { href: "/mercados/tourism", label: "Turismo y ocio", icon: Compass },
  { href: "/inversores", label: "Inversores", icon: Landmark },
  { href: "/alertas", label: "Alertas", icon: BellRing },
  { href: "/forecasts", label: "Forecasts", icon: ChartNoAxesCombined },
  { href: "/empresas", label: "Empresas", icon: Building2 },
  { href: "/fuentes", label: "Fuentes", icon: DatabaseZap },
  { href: "/importaciones", label: "Importaciones", icon: FileUp },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="Market Intelligence OS, inicio">
          <span className="brand-mark"><Orbit aria-hidden="true" size={18} /></span>
          <span><strong>MIO</strong><small>Market Intelligence OS</small></span>
        </Link>
        <nav aria-label="Navegación principal" className="primary-nav">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link href={href} key={href}><Icon aria-hidden="true" size={17} /><span>{label}</span></Link>
          ))}
        </nav>
        <div className="stage-two" aria-label="Regla de evidencia">
          <span className="eyebrow">Regla de evidencia</span>
          <p>Si faltan datos o backtesting, el módulo lo muestra y no fabrica una respuesta.</p>
        </div>
        <div className="privacy-note"><LockKeyhole aria-hidden="true" size={15} /> Privado · datos locales</div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div><span className="live-dot" aria-hidden="true" />Modo real</div>
          <div className="topbar-actions"><span>España · EUR</span><ThemeToggle /></div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
