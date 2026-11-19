import Link from "next/link";
import { ArrowRight, Boxes, Smartphone, Users } from "lucide-react";
import { ClaimBadge, PageHeader } from "@/components/ui";
import { getAppsData } from "@/domain/dashboard/queries";

export const metadata = { title: "Apps" };

export default async function AppsPage() {
  const data = await getAppsData();
  return <><PageHeader eyebrow="Tecnología · Excel auditado" title="Apps y productos tecnológicos" description="30 hipótesis tecnológicas agrupadas en cinco líneas. El score orienta qué validar primero; no demuestra ventas, usuarios ni rentabilidad." actions={<Link className="button button-primary" href="/oportunidades?type=technology">Ver catálogo <ArrowRight size={16} /></Link>} />
    <section className="decision-grid" aria-label="Resumen tecnológico">
      <article className="decision-card"><span className="card-icon"><Smartphone size={18} /></span><span className="eyebrow">Ideas tecnológicas</span><strong className="figure">{data.count}</strong><p>registros únicos del Excel ampliado.</p></article>
      <article className="decision-card"><span className="card-icon"><Boxes size={18} /></span><span className="eyebrow">Líneas</span><strong className="figure">{data.groups.length}</strong><p>SaaS, developer, apps móviles, PC y juegos.</p></article>
      <article className="decision-card decision-card-caution"><span className="card-icon"><Users size={18} /></span><span className="eyebrow">Ventas verificadas</span><strong className="figure figure-text">Sin datos</strong><p>Los precios y modelos son hipótesis para probar.</p></article>
    </section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">Mapa tecnológico</span><h2>Qué tipo de producto hay</h2></div></div><div className="category-bars">{data.groups.map((group) => <article key={group.category}><div><strong>{group.category}</strong><span>{group.count} ideas</span></div><span className="score-track"><span style={{ width: `${(group.count / data.count) * 100}%` }} /></span><small>Prioridad: {group.top.map((item) => item.name).join(" · ")}</small></article>)}</div></section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">Siguiente paso</span><h2>Primero valida estas apps</h2></div></div><div className="table-wrap"><table><thead><tr><th>#</th><th>Producto</th><th>Comprador</th><th>Acción</th><th className="num">Score legado</th></tr></thead><tbody>{data.queue.map((item) => <tr key={item.id}><td>{item.rank}</td><td><strong>{item.name}</strong><small>{item.category}</small></td><td>{item.buyer}</td><td>{item.action}<small><ClaimBadge type="hypothesis" /></small></td><td className="num"><strong>{item.legacyScore}</strong><small>No es probabilidad</small></td></tr>)}</tbody></table></div></section>
  </>;
}
