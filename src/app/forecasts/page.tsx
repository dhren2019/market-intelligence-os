import { ChartNoAxesCombined, FlaskConical, History } from "lucide-react";
import { ClaimBadge, EmptyState, PageHeader } from "@/components/ui";
import { getForecastData } from "@/domain/dashboard/queries";

export const metadata = { title: "Forecasts" };
const labels = { insufficient_history: "Histórico insuficiente", missing_backtest: "Falta backtest", baseline_not_beaten: "No supera baseline", publishable: "Publicable" } as const;

export default async function ForecastsPage() {
  const data = await getForecastData();
  return <><PageHeader eyebrow="Predicción separada" title="Forecasts" description="Un forecast solo se muestra si existe histórico suficiente y el backtest supera una predicción ingenua. Observaciones y predicciones nunca se mezclan." />
    <section className="decision-grid" aria-label="Estado de forecasts">
      <article className="decision-card"><span className="card-icon"><History size={18} /></span><span className="eyebrow">Series evaluadas</span><strong className="figure">{data.readiness.length}</strong><p>temas con observaciones reales.</p></article>
      <article className="decision-card"><span className="card-icon"><FlaskConical size={18} /></span><span className="eyebrow">Forecasts publicables</span><strong className="figure">{data.publishableCount}</strong><p>modelos que superan baseline con backtest.</p></article>
      <article className="decision-card decision-card-caution"><span className="card-icon"><ChartNoAxesCombined size={18} /></span><span className="eyebrow">Regla</span><strong className="figure figure-text">Sin atajos</strong><p>si falta evidencia, se oculta el valor futuro.</p></article>
    </section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">Preparación por serie</span><h2>Sin pronóstico publicable</h2></div></div>{data.publishableCount === 0 ? <EmptyState title="Sin pronóstico publicable" body="Ninguna serie tiene todavía un modelo con backtest que supere su baseline. Esta ausencia es el resultado correcto, no un fallo de la pantalla." /> : null}<div className="table-wrap forecast-table"><table><thead><tr><th>Serie</th><th>Histórico</th><th>Frecuencia</th><th>Estado</th><th>Predicción</th></tr></thead><tbody>{data.readiness.map((row) => <tr key={row.topic}><td><strong>{row.topic}</strong></td><td>{row.sampleSize} observaciones</td><td>{row.frequency}</td><td><span className="status-label">{labels[row.status]}</span></td><td>{row.status === "publishable" ? <><strong>{row.pointValue?.toLocaleString("es-ES")} {row.unit}</strong><small><ClaimBadge type="prediction" /> · {row.method} · {row.horizonDays} días</small></> : "Oculta"}</td></tr>)}</tbody></table></div></section>
  </>;
}
