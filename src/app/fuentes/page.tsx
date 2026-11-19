import { ExternalLink } from "lucide-react";
import { SyncButton } from "@/components/sync-button";
import { PageHeader, formatDate } from "@/components/ui";
import { getSourceRows } from "@/domain/dashboard/queries";

export const metadata = { title: "Fuentes" };

export default async function SourcesPage() {
  const rows = await getSourceRows();
  return <><PageHeader eyebrow="Trazabilidad y operación" title="Fuentes" description="Tres conectores públicos, gratuitos y aislados. Cada ejecución conserva fecha, recuento y error; GitHub sigue siendo un proxy de actividad técnica." actions={<SyncButton />} />
    <div className="source-grid">{rows.map((row) => <article className="source-card" key={row.id}><header><div><span className={`status-dot ${row.lastError ? "status-error" : ""}`} /><span className="eyebrow">{row.status}</span></div><h2>{row.name}</h2><p>{row.scope}</p></header><dl><div><dt>Última extracción</dt><dd>{formatDate(row.lastFetchedAt)}</dd></div><div><dt>Última ejecución</dt><dd>{row.lastRun ? `${row.lastRun.status} · ${row.lastRun.insertedRecords}/${row.lastRun.fetchedRecords} nuevos` : "Sin ejecuciones"}</dd></div><div><dt>Límite</dt><dd>{row.rateLimit ?? "No documentado"}</dd></div><div><dt>Licencia / uso</dt><dd>{row.license}</dd></div></dl>{row.lastError ? <p className="source-error">{row.lastError}</p> : null}<footer><a href={row.documentationUrl} target="_blank" rel="noreferrer">Documentación <ExternalLink size={14} /></a><span>{row.authRequired ? "Credencial necesaria" : "Sin credencial obligatoria"}</span></footer></article>)}</div>
    <aside className="method-note"><strong>Regla de lectura</strong><p>Una observación oficial describe la serie indicada. Un proxy solo describe su propio recuento. Ninguno equivale por sí solo a demanda, ingreso o previsión.</p></aside>
  </>;
}
