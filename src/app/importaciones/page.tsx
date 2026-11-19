import { ImportCenter } from "@/components/import-center";
import { PageHeader, formatDate } from "@/components/ui";
import { getImportRows } from "@/domain/dashboard/queries";

export const metadata = { title: "Importaciones" };

export default async function ImportsPage() {
  const rows = await getImportRows();
  return (
    <>
      <PageHeader
        eyebrow="Ingesta controlada"
        title="Importaciones"
        description="Previsualiza 20 registros, valida cada línea y confirma en una transacción. El SHA-256 impide reimportar el mismo archivo."
      />
      <ImportCenter />
      <section className="section-block">
        <div className="section-heading"><h2>Archivos procesados</h2></div>
        {rows.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Archivo</th><th>Fecha</th><th>Estado</th><th className="num">Aceptados</th><th className="num">Rechazados</th><th>Hash</th></tr></thead>
              <tbody>{rows.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.filename}</strong></td>
                  <td>{formatDate(row.importedAt)}</td><td>{row.status}</td>
                  <td className="num">{row.acceptedRows}</td>
                  <td className="num">{row.rejectedRows}{row.rejectedRows > 0 ? <a href={`/api/imports/${row.id}/errors`}>Descargar errores</a> : null}</td>
                  <td><code>{row.contentHash.slice(0, 14)}…</code></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <p className="muted">Todavía no hay archivos importados manualmente.</p>}
      </section>
    </>
  );
}
