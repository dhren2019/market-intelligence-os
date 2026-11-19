import { ClaimBadge, PageHeader } from "@/components/ui";
import { getCompanyRows, objectValue } from "@/domain/dashboard/queries";

export const metadata = { title: "Empresas" };

export default async function CompaniesPage() {
  const rows = await getCompanyRows();
  return <><PageHeader eyebrow="43 referencias competitivas" title="Empresas" description="Inventario extraído del Excel. Precio e ingresos se reproducen tal como aparecen y no se completan ni estiman cuando la fuente no los publica." />
    <div className="company-grid">{rows.map((row) => { const envelope = objectValue(row.rawPayload); const fields = objectValue(envelope.original_fields); return <article className="company-card" key={row.id}><div><span className="eyebrow">{String(fields.Sector ?? "Sector no clasificado")}</span><h2>{row.name}</h2><p>{String(fields["Producto vendido"] ?? "Producto no descrito")}</p></div><dl><div><dt>Precio público</dt><dd>{String(fields["Precio público (si existe)"] ?? "No publicado")}</dd></div><div><dt>Ingresos públicos</dt><dd>{String(fields["Ingresos públicos"] ?? "No publicados")}</dd></div><div><dt>Nivel de evidencia</dt><dd><ClaimBadge type="hypothesis" /> {String(fields["Nivel de evidencia"] ?? "N/D")}</dd></div></dl><footer><span>Fuente {String(fields["Fuente ID"] ?? "sin ID")} · fila {String(envelope.source_row ?? "—")}</span><span>Referencia heredada, no revisada</span></footer></article>; })}</div>
  </>;
}
