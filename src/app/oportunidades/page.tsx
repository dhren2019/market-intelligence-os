import { ClaimBadge, ExportActions, PageHeader } from "@/components/ui";
import { getOpportunityRows, objectValue } from "@/domain/dashboard/queries";

export const metadata = { title: "Oportunidades" };

export default async function OpportunitiesPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const params = await searchParams;
  const rows = await getOpportunityRows();
  const query = params.q?.trim().toLowerCase() ?? "";
  const type = params.type ?? "all";
  const filtered = rows.filter((row) => (!query || `${row.name} ${row.category} ${row.buyer}`.toLowerCase().includes(query)) && (type === "all" || row.opportunityType === type));
  return <><PageHeader eyebrow="55 ideas canónicas" title="Oportunidades" description="Cada registro conserva hoja, fila, URL y score original. Todo el catálogo empieza como hipótesis; los campos de evidencia nueva permanecen vacíos." actions={<ExportActions />} />
    <form className="filter-bar"><label><span>Buscar</span><input name="q" defaultValue={params.q} placeholder="Idea, sector o comprador" /></label><label><span>Tipo</span><select name="type" defaultValue={type}><option value="all">Todos</option><option value="sector">Sectoriales</option><option value="technology">Tecnológicas</option></select></label><button className="button" type="submit">Aplicar</button><span className="result-count">{filtered.length} resultados</span></form>
    <div className="table-wrap"><table><thead><tr><th>ID / oportunidad</th><th>Comprador</th><th>Modelo</th><th>Evidencia</th><th className="num">Score legado</th><th>Procedencia</th></tr></thead><tbody>{filtered.map((row) => { const raw = objectValue(row.rawPayload); const original = objectValue(raw.original_fields); return <tr key={row.id}><td><strong>{row.name}</strong><small>{row.externalId} · {row.category}</small></td><td>{row.buyer}</td><td>{String(original.Modelo ?? original["Monetización primaria"] ?? "Sin datos")}</td><td><ClaimBadge type={row.claimType} /></td><td className="num"><strong>{row.legacyScore ?? "—"}</strong><small>No recalculado</small></td><td><small>{row.sourceSheet} · fila {row.sourceRow}</small>{row.sourceUrl ? <a href={row.sourceUrl} target="_blank" rel="noreferrer">Fuente</a> : null}</td></tr>; })}</tbody></table></div>
  </>;
}
