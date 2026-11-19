import { BadgeEuro, Landmark, ReceiptText } from "lucide-react";
import { ClaimBadge, EmptyState, PageHeader, formatDate } from "@/components/ui";
import { getInvestorData } from "@/domain/dashboard/queries";

export const metadata = { title: "Inversores" };

export default async function InvestorsPage() {
  const data = await getInvestorData();
  return <><PageHeader eyebrow="Capital documentado" title="Inversores" description="Cobertura de inversores y eventos de financiación con fuente. Una tesis, una incubadora y una ronda anunciada no equivalen a dinero desembolsado." />
    <section className="decision-grid" aria-label="Cobertura de inversión">
      <article className="decision-card"><span className="card-icon"><Landmark size={18} /></span><span className="eyebrow">Inversores registrados</span><strong className="figure">{data.coverage.investorCount}</strong><p>entidades con ficha local.</p></article>
      <article className="decision-card"><span className="card-icon"><ReceiptText size={18} /></span><span className="eyebrow">Eventos documentados</span><strong className="figure">{data.coverage.documentedEventCount}</strong><p>eventos con tipo, fecha y fuente.</p></article>
      <article className="decision-card decision-card-caution"><span className="card-icon"><BadgeEuro size={18} /></span><span className="eyebrow">Importe divulgado</span><strong className="figure">{data.coverage.disclosedAmountCount}</strong><p>registros con cuantía publicada; ausencia no significa cero.</p></article>
    </section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">Modo real</span><h2>Qué dinero está demostrado</h2></div></div>{data.events.length ? <div className="table-wrap"><table><thead><tr><th>Tipo</th><th>Fecha</th><th>Importe</th><th>Evidencia</th><th>Fuente</th></tr></thead><tbody>{data.events.map((event) => <tr key={event.id}><td>{event.eventType}</td><td>{formatDate(event.announcedAt)}</td><td>{event.amount === null ? "No publicado" : `${Number(event.amount).toLocaleString("es-ES")} ${event.currency ?? ""}`}</td><td><ClaimBadge type={event.claimType} /></td><td><a href={event.sourceUrl} target="_blank" rel="noreferrer">Abrir fuente</a></td></tr>)}</tbody></table></div> : <EmptyState title="Sin cobertura de inversión verificada" body={data.coverage.message} />}</section>
    <div className="method-note"><strong>Qué falta para orientar capital</strong><p>Importa eventos con empresa, tipo de evento, fecha, fuente y cuantía divulgada. Hasta entonces el sistema no recomendará sectores por financiación.</p></div>
  </>;
}
