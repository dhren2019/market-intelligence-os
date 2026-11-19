import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { ClaimBadge, PageHeader } from "@/components/ui";
import { getSectorRows, objectValue } from "@/domain/dashboard/queries";

export const metadata = { title: "Sectores" };

export default async function SectorsPage() {
  const sectors = await getSectorRows();
  return <><PageHeader eyebrow="Radar sectorial" title="Sectores y tecnología" description="Cinco magnitudes económicas y un ámbito tecnológico del Excel auditado. Tecnología agrupa ideas de producto y no se compara ni suma con los indicadores INE." />
    <div className="stack-list">{sectors.map((sector) => {
      const envelope = objectValue(sector.rawPayload);
      const fields = objectValue(envelope.original_fields);
      const magnitudeValue = fields["Magnitud (M€)"];
      const magnitude = typeof magnitudeValue === "number" ? magnitudeValue : Number.NaN;
      const source = String(fields["Fuente INE (URL)"] ?? "");
      const technology = sector.sectorTaxonomy === "technology_lines";
      return <article className="record-card" key={sector.id}>
        <div className="record-main"><h2>{sector.name}</h2><div className="record-kicker"><ClaimBadge type={technology ? "hypothesis" : "observed"} /><span>Excel · {String(fields.Año ?? "Año no indicado")}</span></div><p>{String(fields["Qué mide"] ?? "Sin definición")}</p></div>
        <dl className="record-facts"><div><dt>{technology ? "Catálogo tecnológico" : "Magnitud declarada"}</dt><dd>{technology ? `${String(fields.Oportunidades ?? 30)} oportunidades` : Number.isFinite(magnitude) ? `${magnitude.toLocaleString("es-ES")} M€` : "No publicada"}</dd></div><div><dt>Comprador alcanzable</dt><dd>{String(fields["Comprador alcanzable"] ?? "Sin datos")}</dd></div><div><dt>Nicho prioritario</dt><dd>{String(fields["Nicho prioritario"] ?? "Sin datos")}</dd></div></dl>
        <div className="record-note"><strong>{technology ? "No comparable con magnitudes INE" : "Comparabilidad"}</strong><p>{String(fields["Nota de comparabilidad"] ?? "Revisar la metodología de la fuente.")}</p>{technology ? <Link href="/apps">Ver apps y productos <ExternalLink size={14} /></Link> : source.startsWith("http") ? <a href={source} target="_blank" rel="noreferrer">Abrir fuente INE <ExternalLink size={14} /></a> : null}</div>
      </article>;
    })}</div></>;
}
