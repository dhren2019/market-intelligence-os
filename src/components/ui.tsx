import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="lead">{description}</p></div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  );
}

export function ClaimBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    observed: "Observado",
    proxy: "Proxy",
    estimate: "Estimación",
    hypothesis: "Hipótesis",
    prediction: "Predicción",
    demo: "Demo",
  };
  return <span className={`claim claim-${type}`}>{labels[type] ?? type}</span>;
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="empty-state"><strong>{title}</strong><p>{body}</p></div>;
}

export function ExportActions() {
  return (
    <div className="button-row">
      <Link className="button button-primary" href="/api/exports/intelligence.xlsx">Exportar XLSX</Link>
      <Link className="button" href="/api/exports/opportunities/csv">CSV</Link>
      <Link className="button" href="/api/exports/opportunities/json">JSON</Link>
      <Link className="button" href="/api/exports/opportunities/jsonl">JSONL</Link>
    </div>
  );
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "Sin datos";
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeZone: "Europe/Madrid" }).format(new Date(value));
}
