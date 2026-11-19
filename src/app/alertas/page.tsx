import { BellRing, DatabaseZap, Radar } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/ui";
import { getAlertsData } from "@/domain/dashboard/queries";

export const metadata = { title: "Alertas" };

export default async function AlertsPage() {
  const data = await getAlertsData();
  return <><PageHeader eyebrow="Revisión diaria" title="Alertas" description="Solo aparecen fallos reales de fuentes o cambios calculados con un punto histórico comparable. Un dato aislado no genera una alerta de tendencia." />
    <section className="decision-grid" aria-label="Resumen de alertas">
      <article className="decision-card decision-card-caution"><span className="card-icon"><BellRing size={18} /></span><span className="eyebrow">Alertas activas</span><strong className="figure">{data.alerts.length}</strong><p>requieren revisión o aportan un cambio observado.</p></article>
      <article className="decision-card"><span className="card-icon"><DatabaseZap size={18} /></span><span className="eyebrow">Fuentes vigiladas</span><strong className="figure">{data.sourceCount}</strong><p>con estado persistido en la base local.</p></article>
      <article className="decision-card"><span className="card-icon"><Radar size={18} /></span><span className="eyebrow">Series observadas</span><strong className="figure">{data.topicCount}</strong><p>temas reales, sin registros demo.</p></article>
    </section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">Atención</span><h2>Qué debes mirar hoy</h2></div></div>{data.alerts.length ? <div className="alert-list">{data.alerts.map((alert) => <article className={`alert-card alert-${alert.severity}`} key={alert.id}><div><span className="eyebrow">{alert.kind === "source_error" ? "Fuente" : "Cambio observado"}</span><h3>{alert.title}</h3></div><p>{alert.detail}</p></article>)}</div> : <EmptyState title="Sin alertas comprobables" body="No hay fallos de fuente ni cambios con histórico comparable en este momento." />}</section>
  </>;
}
