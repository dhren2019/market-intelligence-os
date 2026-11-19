"use client";

import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, BadgeCheck, ChartNoAxesColumnIncreasing, Check, ChevronDown, ExternalLink, Filter, Globe2, Lightbulb, Search, ShieldCheck, TrendingUp } from "lucide-react";
import { investmentTheses, marketVerticals, researchLens, type MarketVertical } from "@/domain/market/market-data";
import "./market-intelligence.css";

const number = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 1 });
const listToCsv = (input: Array<Record<string, string | number>>) => {
 const keys = Object.keys(input[0] || {});
 return [keys.join(";"), ...input.map(row => keys.map(key => `"${String(row[key] ?? "").replaceAll('"','""')}"`).join(";"))].join("\r\n");
};
function download(name: string, content: string, mime: string) {
 const blob = new Blob([content], { type: mime });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a'); a.href = url; a.download = name; a.click();
 setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function MarketBars({vertical}:{vertical:MarketVertical}){
 const max = Math.max(...vertical.bars.map(b => b.value),1);
 return <div className="mio-chart" role="group" aria-label={vertical.chartTitle}>
  {vertical.bars.map(bar => <div className="mio-bar-row" key={bar.name}>
   <div className="mio-bar-meta"><strong>{bar.name}</strong><span>{bar.display}</span></div>
   <div className="mio-bar-track"><div className={`mio-bar-fill ${bar.color === 'amber'?'mio-bar-amber':''}`} style={{width:`${Math.max(bar.value/max*100,0.8)}%`}}/></div>
  </div>)}
 </div>;
}
function EvidenceLink({href,label}:{href:string,label?:string}){return <a className="mio-source-link" href={href} target="_blank" rel="noreferrer">{label||"Abrir fuente original"} <ExternalLink size={13} aria-hidden/></a>}
function ProductTile({product}:{product:MarketVertical['products'][number]}){return <article className="mio-product">
 <a href={product.homepage} target="_blank" rel="noreferrer" aria-label={`Abrir ${product.name}`} className="mio-product-image-link"><img className="mio-product-image" loading="lazy" src={product.image} alt={`Imagen oficial: ${product.name}`} onError={(event)=>{const el=event.currentTarget; if(!el.dataset.fallback){el.dataset.fallback='1';el.src=`https://www.google.com/s2/favicons?domain=${new URL(product.homepage).hostname}&sz=128`;}}}/></a>
 <div className="mio-product-copy"><div className="mio-product-heading"><div><span className="eyebrow">{product.category}</span><h3>{product.name}</h3></div>{product.rank && <span className="mio-rank">{product.rank}</span>}</div>
 <div className="mio-monetization"><BadgeCheck size={15}/><span>{product.monetization}</span></div>
 <p>{product.observation}</p><div className="mio-product-foot"><span>{product.imageSource}</span><EvidenceLink href={product.sourceUrl||product.homepage} label="Comprobar"/></div></div>
 </article>}

function OpportunityCard({idea}:{idea:MarketVertical['ideas'][number]}){return <article className="mio-opportunity">
 <div className="mio-op-head"><span className="eyebrow">HIPÓTESIS A VALIDAR</span><strong>{idea.score}<small>/100</small></strong></div>
 <h3>{idea.name}</h3><p>{idea.concept}</p>
 <dl><div><dt>Comprador</dt><dd>{idea.target}</dd></div><div><dt>Modelo de negocio</dt><dd>{idea.revenue}</dd></div><div><dt>MVP</dt><dd>{idea.time} · {idea.difficulty}</dd></div></dl>
 <div className="mio-criteria" aria-label="Cuatro criterios de inversión">{['Uso frecuente','Valor económico','Comprador','Preventa'].map((name,i)=><span key={name} className={idea.criteria[i]?'yes':'no'} title={name}>{idea.criteria[i]?<Check size={13}/>:<span>?</span>}{name}</span>)}</div>
 <div className="mio-validation"><Lightbulb size={17}/><span>{idea.validation}</span></div>
 </article>}

export function MarketOverview({compact=false}:{compact?:boolean}){
 return <section className={`mio-overview ${compact?'mio-overview-compact':''}`} aria-label="Mapa de mercados tecnológicos">
 <div className="mio-overview-header"><div><span className="eyebrow">RADAR COMPARATIVO · DATOS CON FUENTE</span><h2>De cuánto se gasta a <em>dónde podemos entrar.</em></h2><p>Elige una categoría. Cada dato mantiene año, universo y fuente. No sumamos magnitudes incompatibles.</p></div><a className="button button-primary" href="/mercados">Explorar mercados <ArrowRight size={15}/></a></div>
 <div className="mio-overview-grid">{marketVerticals.map(v=><a key={v.id} href={`/mercados/${v.id}`} className="mio-market-tile"><span className="mio-tile-icon" aria-hidden>{v.icon}</span><div><span>{v.title}</span><strong>{v.metric.value}</strong><small>{v.metric.label} · {v.metric.period}</small></div><ArrowUpRight size={16}/></a>)}</div>
 </section>
}

export function MarketExplorer({initialId='apps', standalone=false}:{initialId?:string;standalone?:boolean}){
 const [activeId,setActiveId]=useState(marketVerticals.some(v=>v.id===initialId)?initialId:'apps');
 const [query,setQuery]=useState('');
 const [onlyValidated,setOnlyValidated]=useState(false);
 const [selectedTab,setSelectedTab]=useState<'markets'|'investment'|'method'>('markets');
 const vertical=marketVerticals.find(v=>v.id===activeId)!;
 const products=useMemo(()=>vertical.products.filter(p=>(p.name+' '+p.category+' '+p.monetization).toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))),[vertical,query]);
 const ideas=useMemo(()=>vertical.ideas.filter(p=>!onlyValidated||p.criteria.every(Boolean)),[vertical,onlyValidated]);
 const exportCurrent=()=>download(`market-intelligence-${activeId}-2026.csv`,listToCsv([...vertical.products.map(p=>({type:'competidor',name:p.name,category:p.category,model:p.monetization,source:p.sourceUrl||p.homepage,description:p.observation})),...vertical.ideas.map(i=>({type:'hipotesis',name:i.name,category:activeId,model:i.revenue,source:vertical.metric.url,description:i.validation}))]),'text/csv;charset=utf-8');
 return <div className="mio-market-explorer">
 <div className="mio-explorer-head"><div><span className="eyebrow">MARKET INTELLIGENCE · ESPAÑA Y MUNDO · NOVIEMBRE 2026</span><h1>¿Qué está vendiendo <em>de verdad?</em></h1><p>Mercados descompuestos en subcategorías, productos líderes, modelos de ingresos y microproductos construibles en 21 días.</p></div><button className="button" type="button" onClick={exportCurrent}><ArrowDownToLine size={17}/> Exportar categoría CSV</button></div>
 <div className="mio-top-tabs" role="tablist" aria-label="Secciones del radar">{([{id:'markets',label:'Desglose de mercados'},{id:'investment',label:'Incubadoras e inversión'},{id:'method',label:'Método y fuentes'}] as const).map(t=><button key={t.id} role="tab" aria-selected={selectedTab===t.id} onClick={()=>setSelectedTab(t.id)} className={selectedTab===t.id?'active':''}>{t.label}</button>)}</div>
 {selectedTab==='markets'&&<>
 <div className="mio-category-tabs" aria-label="Tipo de producto">{marketVerticals.map(v=><button className={v.id===activeId?'active':''} type="button" key={v.id} onClick={()=>{setActiveId(v.id);setQuery('')}}><span>{v.icon}</span>{v.title}</button>)}</div>
 <div className="mio-intro-grid"><article className="mio-lead-panel"><div className="mio-intro-kicker"><span className="eyebrow">EXPLORADOR · {vertical.title.toUpperCase()}</span><span className="mio-date">{vertical.metric.period}</span></div><h2>{vertical.headline}</h2><p>{vertical.description}</p><a href={vertical.metric.url} target="_blank" rel="noreferrer" className="mio-source-link">Datos de referencia y metodología <ExternalLink size={13}/></a></article><article className="mio-hero-metric"><span className="eyebrow">{vertical.metric.label}</span><div>{vertical.metric.value}</div><p>{vertical.metric.qualifier}</p><small>{vertical.metric.source} · {vertical.metric.period}</small></article></div>
 <section className="section-block mio-section"><div className="section-heading"><div><span className="eyebrow">01 / DEMANDA Y SUBMERCADOS</span><h2>Qué parte está creciendo</h2></div><EvidenceLink href={vertical.chartSource} label="Fuente del desglose"/></div>
 <div className="mio-section-layout"><div className="mio-card mio-chart-panel"><h3>{vertical.chartTitle}</h3><MarketBars vertical={vertical}/><p className="mio-footnote">{vertical.chartFootnote}</p></div><aside className="mio-card mio-insight-panel"><TrendingUp size={20}/><h3>Cómo interpretarlo</h3>{vertical.signals.map((s,i)=><p key={i}><span className="mio-signal-number">0{i+1}</span>{s}</p>)}<div className="mio-caveat">{vertical.warning}</div></aside></div></section>
 <section className="section-block mio-section"><div className="section-heading"><div><span className="eyebrow">02 / EMPRESAS QUE VENDEN</span><h2>Productos reales y monetización</h2></div><label className="mio-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar producto o modelo..." aria-label="Buscar producto"/></label></div><div className="mio-product-grid">{products.length?products.map(p=><ProductTile key={p.name} product={p}/>):<div className="mio-card">No hay coincidencias. Prueba otra búsqueda.</div>}</div></section>
 <section className="section-block mio-section"><div className="section-heading"><div><span className="eyebrow">03 / QUÉ CONSTRUIR</span><h2>Oportunidades con plan de validación</h2></div><label className="mio-filter"><input type="checkbox" checked={onlyValidated} onChange={e=>setOnlyValidated(e.target.checked)}/><Filter size={15}/>Solo cuatro criterios superados</label></div><div className="mio-opportunity-grid">{ideas.map(i=><OpportunityCard key={i.name} idea={i}/>)}{!ideas.length&&<p className="mio-empty">No hay hipótesis que cumplan los cuatro criterios; eso también es un resultado útil.</p>}</div></section>
 </>}
 {selectedTab==='investment'&&<><div className="mio-investment-intro"><Globe2 size={28}/><div><h2>El capital sigue tesis, no necesariamente ventas</h2><p>Distinguimos lo que pide una incubadora de una ronda anunciada. No convertimos titulares en importes de inversión.</p></div></div><div className="mio-investment-grid">{investmentTheses.map((t,i)=><article className="mio-opportunity" key={i}><span className="eyebrow">{t.scope}</span><h3>{t.topic}</h3><p>{t.opportunity}</p><p className="mio-caveat">{t.status}</p><EvidenceLink href={t.source} label="Y Combinator · tesis"/></article>)}</div></>}
 {selectedTab==='method'&&<><div className="mio-card mio-method-head"><ShieldCheck size={26}/><div><h2>Una gráfica sin unidad, fecha y fuente no es inteligencia de mercado</h2><p>Priorizamos documentos primarios; separamos facturación auditada, estimaciones de proveedores, encuesta, interés relativo, tesis e hipótesis. No imputamos ventas a una empresa cuando no las publica.</p></div></div><div className="mio-method-grid">{researchLens.map(l=><article key={l.title} className="mio-card"><span className="eyebrow">{l.kind}</span><h3>{l.title}</h3><p>{l.description}</p><EvidenceLink href={l.url}/></article>)}</div></>}
 <div className="mio-final-strip"><ChartNoAxesColumnIncreasing size={21}/><p><strong>Decisión antes de desarrollar.</strong> En B2B exigir uso frecuente, valor económico, compradores identificables y compromiso de pago. En juegos medimos retención y propensión de compra antes de ampliar contenido.</p></div>
 </div>
}
