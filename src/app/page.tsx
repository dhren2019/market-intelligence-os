import Link from "next/link";
import { ArrowRight, CircleHelp, Coins, Hammer, Radar, ShieldCheck } from "lucide-react";
import { ClaimBadge, EmptyState, PageHeader, formatDate } from "@/components/ui";
import { getHomeData } from "@/domain/dashboard/queries";
import { MarketOverview } from "@/components/market/market-explorer";

export default async function HomePage() {
  const data = await getHomeData();
  return (
    <>
      <PageHeader
        eyebrow="Panel de decisión · 18 nov 2026"
        title="Qué mercados se mueven y dónde podemos entrar."
        description="Explora sectores, subcategorías y productos reales; después valida el comprador antes de desarrollar."
        actions={<Link className="button button-primary" href="/oportunidades">Revisar oportunidades <ArrowRight size={16} /></Link>}
      />

      <MarketOverview compact />

      <section className="decision-grid" aria-label="Preguntas de decisión">
        <article className="decision-card">
          <span className="card-icon"><Radar size={18} /></span><span className="eyebrow">¿Qué ha cambiado?</span>
          <strong className="figure">{data.observationCount}</strong>
          <p>observaciones públicas guardadas. Las variaciones se muestran solo cuando existe un punto histórico comparable.</p>
        </article>
        <article className="decision-card decision-card-caution">
          <span className="card-icon"><Coins size={18} /></span><span className="eyebrow">¿Hay dinero?</span>
          <strong className="figure figure-text">No demostrado</strong>
          <p>El catálogo contiene hipótesis y precios a probar. No hay ventas, contratos ni facturación verificados.</p>
        </article>
        <article className="decision-card">
          <span className="card-icon"><Hammer size={18} /></span><span className="eyebrow">¿Podemos construirlo?</span>
          <strong className="figure">{data.opportunityCount}</strong>
          <p>ideas con alcance MVP descrito. Sus scores son heredados del Excel, no nueva evidencia comercial.</p>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><span className="eyebrow">Cola de validación</span><h2>Dónde invertir tiempo ahora</h2></div>
          <Link href="/oportunidades">Ver las 55 <ArrowRight size={15} /></Link>
        </div>
        <div className="method-note decision-explainer">
          <ShieldCheck size={18} />
          <div><strong>Prioridad para investigar, no recomendación financiera</strong><p>El orden reproduce el score del Excel. La siguiente acción es validar comprador y pago antes de invertir en desarrollo.</p></div>
        </div>
        <div className="priority-grid">
          {data.validationQueue.map((opportunity) => (
            <article className="priority-card" key={opportunity.id}>
              <div className="priority-rank"><span>#{opportunity.rank}</span><ClaimBadge type="hypothesis" /></div>
              <div><span className="eyebrow">{opportunity.category}</span><h3>{opportunity.name}</h3><p>{opportunity.buyer}</p></div>
              <div className="score-visual" aria-label={`Score legado ${opportunity.legacyScore} de 100`}>
                <div><span>Score legado</span><strong>{opportunity.legacyScore}/100</strong></div>
                <span className="score-track"><span style={{ width: `${opportunity.legacyScore}%` }} /></span>
                <small>{opportunity.basis}</small>
              </div>
              <dl className="action-list"><div><dt>Haz esto ahora</dt><dd>{opportunity.action}</dd></div><div><dt>Para si ocurre</dt><dd>{opportunity.stopRule}</dd></div></dl>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><h2>Tendencias observadas</h2></div><Link href="/fuentes">Auditar fuentes <ArrowRight size={15} /></Link></div>
        {data.trends.length ? (
          <div className="trend-grid">
            {data.trends.map(({ topic, latest, analysis }) => (
              <article className="trend-card" key={topic}>
                <div className="trend-top"><ClaimBadge type={latest.claimType} /><span>{formatDate(latest.observedAt)}</span></div>
                <h3>{latest.metricName.replaceAll("_", " ")}</h3>
                <div className="trend-value"><strong>{Number(latest.value).toLocaleString("es-ES", { maximumFractionDigits: 2 })}</strong><span>{latest.unit}</span></div>
                {analysis.status === "observed_change" ? (
                  <ul className="window-list">{analysis.windows.map((window) => <li key={window.days}><span>{window.days} días</span><strong>{window.percentChange === null ? "N/D" : `${window.percentChange > 0 ? "+" : ""}${window.percentChange.toFixed(1)}%`}</strong></li>)}</ul>
                ) : <p className="muted"><CircleHelp size={14} /> Sin histórico suficiente para calcular cambio.</p>}
                <a className="source-link" href={latest.sourceUrl} target="_blank" rel="noreferrer">Fuente directa <ArrowRight size={14} /></a>
              </article>
            ))}
          </div>
        ) : <EmptyState title="Sin observaciones todavía" body="Ejecuta la sincronización desde Fuentes. El sistema no dibuja una tendencia con datos de ejemplo." />}
      </section>

      <section className="section-block">
        <div className="section-heading"><div><h2>Prioridad heredada, no validación</h2></div><Link href="/oportunidades">Ver las 55 <ArrowRight size={15} /></Link></div>
        <div className="table-wrap"><table><thead><tr><th>Idea</th><th>Sector</th><th>Comprador</th><th>Tipo</th><th className="num">Score legado</th></tr></thead><tbody>
          {data.topOpportunities.map((opportunity) => <tr key={opportunity.id}><td><strong>{opportunity.name}</strong><small>{opportunity.externalId}</small></td><td>{opportunity.category}</td><td>{opportunity.buyer}</td><td><ClaimBadge type={opportunity.claimType} /></td><td className="num">{opportunity.legacyScore ?? "—"}</td></tr>)}
        </tbody></table></div>
      </section>
    </>
  );
}
