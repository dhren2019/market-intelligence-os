import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, ChevronDown, TrendingUp, Target, Clock3, ShieldCheck } from 'lucide-react';
import { marketVerticals } from '../../src/domain/market/market-data';

type FeedItem = {id?:string;title:string;finding:string;opportunity?:string;url:string;publishedAt?:string;observedAt?:string;type?:string;confidence?:string;geography?:string;period?:string;metric?:{value:number;unit:string}};

function BarChart({data}:{data:{label:string;value:number}[]}){
 const max=Math.max(1,...data.map(d=>d.value));
 return <div className="radar-bar-chart" role="img" aria-label="Número de productos documentados por sector; no son ingresos ni descargas">
 {data.map(d=><div className="radar-bar-line" key={d.label}><span>{d.label}</span><div className="radar-bar-bg"><span style={{width:`${Math.max(3,d.value/max*100)}%`}}/></div><strong>{d.value}</strong></div>)}
 </div>
}

export function DecisionRadar({feed,feedDate}:{feed:FeedItem[];feedDate:string}){
 const [filter,setFilter]=useState('Todos');
 const [expanded,setExpanded]=useState(false);
 const products=useMemo(()=>marketVerticals.map(v=>({label:v.title,value:v.products.length})),[]);
 const ideas=useMemo(()=>marketVerticals.flatMap(v=>v.ideas.map(i=>({...i,sector:v.title,sectorId:v.id,source:v.metric.url}))).filter(i=>i.time.includes('21')||/\b(?:1[0-9]|20)\b/.test(i.time)).sort((a,b)=>b.score-a.score),[]);
 const chosen=ideas.slice(0,expanded?9:3);
 const types=['Todos',...new Set(feed.map(f=>f.type||'Otra'))];
 const news=feed.filter(f=>filter==='Todos'||(f.type||'Otra')===filter).slice(0,10);
 return <section className="section-block radar-decision" aria-label="Centro de decisión para lanzar en 21 días">
 <div className="section-heading"><div><span className="eyebrow">RADAR DE DECISIÓN · PRIORIDADES DE INVESTIGACIÓN</span><h2>¿Dónde merece la pena entrar?</h2><p className="radar-subtitle">Señales comprobables, competidores y microproductos que pueden validarse antes de programar.</p></div><a href="#opportunities">Ver 55 ideas <ArrowRight size={15}/></a></div>
 <div className="radar-overview-grid">
 <article className="radar-panel"><span className="eyebrow"><TrendingUp size={14}/> MAPA DE COBERTURA</span><h3>Productos reales analizados</h3><BarChart data={products}/><p className="radar-disclaimer">Recuento de fichas documentadas en MIO, <strong>no tamaño del mercado</strong>, facturación ni ranking de demanda. Pulsa un sector para ver cifras comparables dentro de él.</p><div className="radar-pill-row">{marketVerticals.map(v=><a href={`#${v.id}`} key={v.id}>{v.icon} {v.title} <ArrowRight size={12}/></a>)}</div></article>
 <article className="radar-panel radar-panel-focus"><span className="eyebrow"><Target size={14}/> FILTRO 21 DÍAS</span><h3>Shortlist para validar esta semana</h3><p className="radar-disclaimer">Orden editorial de hipótesis existentes, <strong>no probabilidad de facturar</strong>. No se atribuyen ingresos sin evidencia.</p><div className="radar-shortlist">{chosen.map((i,index)=><details key={i.name} className="radar-idea"><summary><span className="radar-idea-index">{String(index+1).padStart(2,'0')}</span><span><strong>{i.name}</strong><small>{i.sector} · {i.time} · score hipotético {i.score}/100</small></span><ChevronDown size={16}/></summary><div className="radar-idea-details"><p>{i.concept}</p><p><b>Quién paga:</b> {i.target}</p><p><b>Modelo:</b> {i.revenue}</p><p><b>Validación:</b> {i.validation}</p><a href={`#${i.sectorId}`}>Ver competidores y desglose <ArrowRight size={13}/></a></div></details>)}</div><button className="radar-expand" type="button" onClick={()=>setExpanded(!expanded)}>{expanded?'Mostrar menos':'Ver más candidatos'} <ChevronDown size={14}/></button></article>
 </div>
 <div className="radar-watch"><Clock3 size={19}/><div><strong>Qué revisar antes de construir</strong><p>Precio y canal de adquisición del competidor, frecuencia real de uso, primeros 10 compradores potenciales y al menos 2 compromisos de pago. Sin esto, una tendencia no es un negocio viable.</p></div></div>
 <div className="section-heading radar-feed-head"><div><span className="eyebrow">TECH · BUSINESS · STARTUPS · SOFTWARE · GAMING</span><h2>Noticias y señales para actuar</h2><p className="radar-subtitle">{feedDate?`Radar actualizado: ${feedDate}`:'Mostrando las fuentes disponibles'} · Fechas de publicación por noticia; estimaciones diferenciadas de datos realizados.</p></div><a href="#trends">Histórico y fuentes <ArrowRight size={15}/></a></div>
 <div className="radar-filter-row" aria-label="Filtrar noticias por tipo">{types.map(t=><button type="button" key={t} className={filter===t?'active':''} onClick={()=>setFilter(t)}>{t}</button>)}</div>
 {news.length?<div className="radar-news-scroll">{news.map((n,i)=><article className="radar-news" key={n.id||n.url+i}><div className="radar-news-top"><img alt="" loading="lazy" src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(n.url).hostname)}&sz=64`}/><span>{n.type||'Informe'}</span><span>{n.publishedAt||n.observedAt||'Fecha no confirmada'}</span></div><h3>{n.title}</h3><p>{n.finding}</p>{n.opportunity&&<div className="radar-news-op"><strong>Posible oportunidad</strong><p>{n.opportunity}</p></div>}<a target="_blank" rel="noreferrer" href={n.url}>Leer fuente <ExternalLink size={13}/></a></article>)}</div>:<div className="radar-empty">No hay noticias verificadas para este filtro. La automatización completará el feed cuando encuentre fuentes nuevas.</div>}
 <p className="radar-disclaimer radar-sources"><ShieldCheck size={14}/> Logos de dominio vía favicon. Ninguna cifra, descarga, facturación o tendencia se infiere a partir del logo o de las noticias.</p>
 </section>
}
