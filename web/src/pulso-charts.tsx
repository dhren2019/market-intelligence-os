import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { marketVerticals } from '../../src/domain/market/market-data';
import { ArrowRight, ExternalLink } from 'lucide-react';

const COLORS=['#08cfb5','#249ee5','#8f78ef','#e6aa4e','#5bb3c6','#e47d9f'];
const rounded=(n:number)=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:1}).format(n);
const spend=[{name:'Apps no-juego',value:85.6},{name:'Juegos móviles',value:81.4}];
export function PulsoCharts(){
 const [id,setId]=useState('saas');
 const market=marketVerticals.find(m=>m.id===id)||marketVerticals[0];
 const chart=market.bars.map(x=>({name:x.name,value:x.value,display:x.display}));
 return <section className="section-block pulso-react-charts" aria-label="Pulso: inteligencia visual de mercados">
 <div className="section-heading"><div><span className="eyebrow">PULSO · CENTRO VISUAL</span><h2>Detecta el mercado. Encuentra el hueco.</h2><p className="lead">Análisis por sector con magnitudes verificables, competidores y un primer experimento comercial en 21 días.</p></div></div>
 <div className="pulso-react-grid"><article className="pulso-react-card"><span className="eyebrow">IAP GLOBAL 2025 · MILES DE MILLONES USD</span><h3>Apps no-juego vs. juegos</h3><div className="pulso-react-pie"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={spend} cx="50%" cy="50%" innerRadius={75} outerRadius={110} dataKey="value" nameKey="name" paddingAngle={2}>{spend.map((d,i)=><Cell key={d.name} fill={COLORS[i]}/>)}</Pie><Tooltip formatter={(value,name)=>[`${rounded(Number(value))} mil M$`,name]}/></PieChart></ResponsiveContainer></div><div className="pulso-react-legend">{spend.map((d,i)=><span key={d.name}><i style={{background:COLORS[i]}}/>{d.name}: <strong>{rounded(d.value)}</strong></span>)}</div><p>Gasto IAP estimado, no beneficio. La cifra de juegos es la diferencia de cifras globales redondeadas.</p><a href="https://sensortower.com/blog/state-of-mobile-2026" target="_blank" rel="noreferrer">Fuente Sensor Tower <ExternalLink size={13}/></a></article>
 <article className="pulso-react-card"><span className="eyebrow">DESGLOSE INTERACTIVO</span><h3>Explora la categoría que te interese</h3><div className="pulso-react-tabs">{marketVerticals.map(m=><button key={m.id} type="button" className={m.id===id?'active':''} onClick={()=>setId(m.id)}>{m.icon} {m.title}</button>)}</div><strong className="pulso-react-big">{market.metric.value}</strong><small>{market.metric.label} · {market.metric.period}</small><div className="pulso-react-bars"><ResponsiveContainer width="100%" height={Math.max(240,chart.length*55)}><BarChart accessibilityLayer data={chart} layout="vertical" margin={{top:8,right:34,bottom:10,left:5}}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" strokeOpacity={.08}/><XAxis type="number" tick={{fontSize:11}}/><YAxis type="category" dataKey="name" width={126} tick={{fontSize:11}}/><Tooltip formatter={(value,name,props)=>[props.payload.display,'Métrica publicada']} /><Bar dataKey="value" fill="var(--color-accent)" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></div><p>{market.chartFootnote}</p><a href={market.chartSource} target="_blank" rel="noreferrer">Datos originales <ExternalLink size={13}/></a></article></div>
 <div className="pulso-react-bottom"><div><span className="eyebrow">NICHO A VALIDAR EN ≤21 DÍAS</span><h3>{market.ideas[0]?.name}</h3><p>{market.ideas[0]?.concept}</p><p><b>Comprador:</b> {market.ideas[0]?.target} · <b>Preventa:</b> {market.ideas[0]?.validation}</p></div><a href={`#${market.id}`}>Competidores y monetización <ArrowRight size={15}/></a></div>
 </section>
}
