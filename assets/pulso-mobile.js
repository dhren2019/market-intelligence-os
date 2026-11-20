(function mobileMarket(){
"use strict";
const B="/market-intelligence-os/", state={data:null,mode:"all",cat:"all",last:null};
const e=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const url=v=>{try{const x=new URL(v);return x.protocol==="https:"?x.href:"#"}catch{return "#"}};
const imageUrl=v=>{try{const u=new URL(v);return u.protocol==="https:"&&u.hostname==="play-lh.googleusercontent.com"?u.href:""}catch{return ""}};
const $=s=>document.querySelector(s);
const dcat=id=>state.data?.marketData.categories.find(c=>c.id===id);
const product=id=>state.data?.apps.find(p=>p.id===id);
const opportunity=id=>state.data?.opportunities.find(p=>p.id===id);
const all=state.data?.apps||[];
function img(p,cls="mr-icon"){const src=imageUrl(p.icon);return src?`<img class="${cls}" loading="lazy" src="${e(src)}" alt="Icono oficial de ${e(p.name)} en Google Play">`:`<span class="${cls} mr-img-fallback">▣</span>`}
function back(text="Volver al informe"){return `<a href="#mobile" class="mr-back">← ${e(text)}</a>`}
function stage(){let el=$("#pulso-mobile-stage"),w=$(".workspace");if(!w)return null;if(!el){el=document.createElement("section");el.id="pulso-mobile-stage";el.className="mr-page";const old=w.querySelector(":scope > .main-content");if(old)w.insertBefore(el,old);else w.append(el)}return el}
function nav(){
 const n=$(".primary-nav");if(!n)return;
 let a=n.querySelector('a[href="#mobile"]');
 if(!a){a=document.createElement("a");a.href="#mobile";a.className="pulso-mobile-nav";a.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4M9 5h6"/></svg><span>Mercado móvil</span>';const ref=n.querySelector('a[href="#opportunities"]');if(ref)ref.insertAdjacentElement("afterend",a);else n.appendChild(a);}
 a.classList.toggle("web-active",active());const opp=n.querySelector('a[href="#opportunities"]');if(active()&&opp)opp.classList.remove("web-active");
}
function active(){return /^#(mobile(?:$|[-/]))/.test(location.hash)}
function sourceLink(href,label){return `<a href="${url(href)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`}
function tag(txt,variant="muted"){return `<span class="mr-pill mr-pill-${variant}">${e(txt)}</span>`}
function opportunityCard(x){
 const p=product(x.comparableIds[0])||null;
 return `<a class="mr-op-card" href="#mobile-opportunity/${e(x.id)}"><div class="mr-op-head"><span class="mr-order">${String(x.priority).padStart(2,"0")}</span>${tag(x.phase,x.phase==="PREVENTA"?"good":x.phase==="DESCARTAR MVP COMERCIAL"?"bad":"warn")}</div><div class="mr-op-identity">${p?img(p,"mr-op-icon"):""}<span>${e(x.focus)}</span></div><h3>${e(x.name)}</h3><p>${e(x.reason)}</p><div class="mr-op-bottom"><span>${e(x.type==="game"?"🎮 Gaming / prueba de retención":"📱 App móvil / prueba de pago")}</span><strong>Ver tesis →</strong></div></a>`;
}
function productCard(p){
 return `<a class="mr-prod" href="#mobile-app/${e(p.id)}" data-mr-cat="${e(p.cat)}" data-mr-mode="${p.cat==="gaming"?"game":"app"}">
 <div class="mr-prod-top">${img(p)}<span>${tag(p.cat==="gaming"?"Juego real":"App real","plain")}</span></div><strong>${e(p.name)}</strong><small>${e(dcat(p.cat)?.name||"")}</small><div class="mr-prod-count"><span>Google Play</span><b>${e(p.androidInstalls)}</b></div>
 <p>${e(p.metric||p.price||"Modelo comercial documentado; ingresos por producto no verificados.")}</p>
 <div class="mr-prod-link">Ficha + fuentes →</div></a>`;
}
function marketStat(c){return `<a href="#mobile-category/${e(c.id)}" class="mr-sector-card"><div><span>${e(c.name)}</span>${tag(c.verdict,c.verdict.toLowerCase().includes("no")?"bad":"plain")}</div><strong>${c.revenueB!==null?`${String(c.revenueB).replace(".",",")} mil M$`:"Sin cifra agregada"}</strong><small>${c.revenueB!==null?"Ingresos de categoría 2025 · mundo":"Segmento sin agregado comparable"}</small><div class="mr-sector-pace"><span>${c.yoy!==null?`Ingresos: ${c.yoy>0?"+":""}${String(c.yoy).replace(".",",")}% interanual`:"Cambio anual no verificable"}</span><b>Investigar →</b></div></a>`}
function graph(){
 const cats=state.data.marketData.categories.filter(c=>c.revenueB!==null&&c.id!=="gaming").sort((a,b)=>b.revenueB-a.revenueB);
 const max=cats[0]?.revenueB||1;
 return `<div class="mr-chart"><div class="mr-chart-head"><div><span class="eyebrow">DATOS DE MERCADO, NO FACTURACIÓN DEL MVP</span><h3>¿Dónde se está pagando?</h3><p>Ingresos estimados por categoría, global, 2025. AppTweak, Google Play + App Store.</p></div><a href="${url(state.data.marketData.source)}" target="_blank" rel="noopener noreferrer">Informe ↗</a></div>${cats.map(c=>`<a class="mr-bar-row" href="#mobile-category/${e(c.id)}"><span>${e(c.name)}</span><div class="mr-bar-track"><div style="width:${(c.revenueB/max*100).toFixed(1)}%"></div></div><strong>${String(c.revenueB).replace(".",",")} mil M$</strong></a>`).join("")}<div class="mr-game-stat"><span>Gaming (comparación separada)</span><strong>73,5 mil M$</strong><small>2025 · +3 % ingresos, −6 % descargas</small></div></div>`;
}
function marketHead(){
 return `<header class="mr-heading"><div class="mr-upper"><span class="eyebrow">PULSO / APP STORE INTELLIGENCE</span><span class="mr-updated">20 NOVIEMBRE 2026 · GLOBAL + ESPAÑA</span></div><h1>¿En qué apps y juegos <em>invertiría hoy?</em></h1><p>Investigación de mercado a partir de <b>productos que existen de verdad en Google Play</b>. Precios oficiales, instalaciones publicadas, ingresos empresariales, IAP estimado, competidores y una decisión de inversión para un MVP de 21 días.</p></header>`;
}
function renderIndex(){
 const st=stage();if(!st)return;
 const D=state.data,opp=D.opportunities.slice().sort((a,b)=>a.priority-b.priority),appCount=D.apps.filter(p=>p.cat!=="gaming").length,gameCount=D.apps.filter(p=>p.cat==="gaming").length;
 st.innerHTML=`${marketHead()}<div class="mr-hero-stats"><article><span>Apps reales auditadas</span><strong>${appCount}</strong><small>Google Play · no ideas de Carbon</small></article><article><span>Juegos reales auditados</span><strong>${gameCount}</strong><small>Modelos IAP / ads observados</small></article><article><span>Sectores comparados</span><strong>${D.marketData.categories.length}</strong><small>Datos globales 2025–2026</small></article><article><span>Tesis de inversión</span><strong>${opp.length}</strong><small>Ordenadas por viabilidad, no por hype</small></article></div>
 <div class="mr-findings"><div><span class="eyebrow">RESULTADO DE LA INVESTIGACIÓN</span><h2>Hay dinero, pero no deberíamos perseguir a los líderes.</h2><p>La mayor ventaja de un equipo pequeño es vender primero una solución especializada a un comprador accesible. En gaming, solo arriesgar presupuesto después de medir retención y adquisición.</p></div><div><strong>#1 Móvil B2B</strong><span>Actas y pruebas para instaladores</span><strong>#1 Gaming</strong><span>Experimentar con física original, no otro Sort</span></div></div>
 <div class="mr-section-head"><div><span class="eyebrow">01 / INVERTIBILIDAD</span><h2>Lo que priorizaría para construir</h2><p>Cada tesis incluye contraargumentos, los cuatro filtros, canal de captación y condición de abandono.</p></div><span>${opp.length} tesis · 21 días máximo para decidir</span></div>
 <div class="mr-opp-grid">${opp.slice(0,3).map(opportunityCard).join("")}</div><details class="mr-more-ideas"><summary>Ver las otras ${Math.max(0,opp.length-3)} tesis y las que descartaría <span>↘</span></summary><div class="mr-opp-grid">${opp.slice(3).map(opportunityCard).join("")}</div></details>
 <div class="mr-section-head"><div><span class="eyebrow">02 / MERCADOS REALES</span><h2>Volumen, crecimiento y concentración</h2><p>No confundir ingresos de una categoría con mercado accesible para nuestro producto.</p></div></div>
 ${graph()}<div class="mr-sector-grid">${D.marketData.categories.map(marketStat).join("")}</div>
 <div class="mr-section-head"><div><span class="eyebrow">03 / GOOGLE PLAY / COMPETENCIA REAL</span><h2>Apps y juegos que sí existen</h2><p>Iconos enlazados desde sus fichas oficiales. Bandas de descargas Android acumuladas, no instalaciones de este trimestre.</p></div></div>
 <div class="mr-filters" role="group" aria-label="Filtrar productos"><button data-mr-filter="all" class="${state.mode==="all"?"active":""}">Todos (${D.apps.length})</button><button data-mr-filter="app" class="${state.mode==="app"?"active":""}">Apps (${appCount})</button><button data-mr-filter="game" class="${state.mode==="game"?"active":""}">Juegos (${gameCount})</button></div>
 <div class="mr-products">${D.apps.filter(p=>state.mode==="all"||(state.mode==="game"&&p.cat==="gaming")||(state.mode==="app"&&p.cat!=="gaming")).map(productCard).join("")}</div>
 <div class="mr-section-head"><div><span class="eyebrow">04 / RANKING DE MECÁNICAS</span><h2>Juegos por subgénero: ¿dónde NO entraría?</h2><p>Estas cifras pertenecen a AppMagic. IAP estimado global, no ingresos auditados ni anuncios.</p></div></div>
 <div class="mr-genres">${D.gameGenres.map(g=>`<article><span>${e(g.name)}</span><strong>${g.iap!==null?`${String(g.iap).replace(".",",")} mil M$`:"Sin volumen individual verificado"}</strong><small>${e(g.period)} · ${e(g.unit)}</small><p>${e(g.note)}</p>${tag(g.viable,g.viable==="No"||g.viable==="No en 21 días"?"bad":"warn")}</article>`).join("")}</div>
 <div class="mr-methodology"><span class="eyebrow">CONTROL DE EVIDENCIA</span><h2>Cómo leer estas cifras</h2><div>${D.insights.map(x=>`<article><strong>${e(x.label)}</strong><p>${e(x.finding)}</p>${sourceLink(x.source,"Fuente")}</article>`).join("")}</div><p>España: no se han encontrado series públicas comparables y actuales por cada producto y subgénero. Las cifras de mercado son globales; los compradores de las tesis se entrevistarían inicialmente en España.</p></div>
 <div class="mr-exit"><a href="#opportunities">Volver a Oportunidades →</a><a href="#home">Panel principal →</a></div>`;
}
function renderCategory(c){
 const st=stage();if(!st)return;
 const peers=state.data.apps.filter(x=>x.cat===c.id),opps=state.data.opportunities.filter(x=>x.comparableIds.some(i=>peers.some(p=>p.id===i)));
 st.innerHTML=`${back()}<div class="mr-detail-head"><span class="eyebrow">INFORME SECTORIAL / GOOGLE PLAY</span><h1>${e(c.name)}</h1><p>${e(c.marketNote)}</p></div><div class="mr-hero-stats mr-detail-stats"><article><span>Ingresos de categoría</span><strong>${c.revenueB===null?"No verificados":String(c.revenueB).replace(".",",")+" mil M$"}</strong><small>Estimación AppTweak, global 2025</small></article><article><span>Descargas de categoría</span><strong>${c.downloadsB===null?"No publicadas":String(c.downloadsB).replace(".",",")+" mil M"}</strong><small>App Store y Play, 2025</small></article><article><span>Crecimiento facturación</span><strong>${c.yoy===null?"N/D":(c.yoy>0?"+":"")+String(c.yoy).replace(".",",")+"%"}</strong><small>Interanual 2025</small></article></div>
 <div class="mr-two-cols"><article class="mr-analysis-panel"><span class="eyebrow">¿DÓNDE ENTRAR?</span><h2>${e(c.verdict)}</h2><p>${e(c.why)}</p></article><article class="mr-analysis-panel"><span class="eyebrow">EN CONTRA</span><h2>Barreras reales</h2><p>${e(c.against)}</p></article></div>
 <div class="mr-section-head"><div><span class="eyebrow">EVIDENCIA / TIENDA OFICIAL</span><h2>${peers.length} aplicaciones y juegos reales</h2></div></div><div class="mr-products">${peers.map(productCard).join("")}</div>
 <div class="mr-section-head"><div><span class="eyebrow">APUESTAS PARA UN EQUIPO PEQUEÑO</span><h2>${opps.length?`${opps.length} experimentos relacionados`:"No se recomienda construir sin validar más"}</h2></div></div><div class="mr-opp-grid">${opps.map(opportunityCard).join("")}</div><div class="mr-source-line">${sourceLink(c.source,"Datos y metodología del sector")}</div>`;
}
function renderApp(p){
 const st=stage();if(!st)return;
 const c=dcat(p.cat),ops=state.data.opportunities.filter(x=>x.comparableIds.includes(p.id));
 st.innerHTML=`${back()}<header class="mr-app-head">${img(p,"mr-app-main-icon")}<div><span class="eyebrow">CASO REAL / GOOGLE PLAY / ${e(c?.name||"")}</span><h1>${e(p.name)}</h1><p>Producto existente con ficha oficial y modelo de monetización documentado.</p><div class="mr-inline-links">${sourceLink(p.storeUrl,"Google Play")}${p.priceSource?sourceLink(p.priceSource,"Precios oficiales"):''}${p.metric&&p.metricSource?sourceLink(p.metricSource,"Fuente económica"):''}</div></div></header>
 <div class="mr-hero-stats mr-app-stats"><article><span>Instalaciones Android</span><strong>${e(p.androidInstalls)}</strong><small>Banda acumulada Google Play</small></article><article><span>Monetización</span><strong class="mr-long">${e(p.model)}</strong><small>${e(p.price)}</small></article><article><span>Evidencia económica</span><strong class="mr-long">${p.metric?e(p.metric):"Sin cifra verificable"}</strong><small>${e(p.metricPeriod||"No se encontraron ingresos por producto")}</small></article></div>
 <div class="mr-two-cols"><article class="mr-analysis-panel"><span class="eyebrow">PRODUCTO Y MERCADO</span><h2>¿Qué demuestra?</h2><p>${e(p.notes)}</p>${p.metric?`<p><b>Tipo de cifra:</b> ${e(p.metricType)}. Periodo ${e(p.metricPeriod)}. ${e(p.metricSource?"Fuente atribuida, no ventas de nuestra propuesta.":"")}</p>`:"<p>La existencia de precio/descargas no permite inferir facturación real del producto.</p>"}<p class="mr-attr">${e(p.installsMeaning)}</p></article>
 <article class="mr-analysis-panel"><span class="eyebrow">LECTURA DE INVERSIÓN</span><h2>¿Por qué no replicarlo?</h2><p>${e(p.risk)}</p><p>La oportunidad no es copiar su marca, assets, código ni su conjunto de funciones. Hay que detectar un flujo desatendido y comprobar pago antes de construir.</p></article></div>
 <div class="mr-section-head"><div><span class="eyebrow">INVERSIÓN / ENTRADA DESDE ESPAÑA</span><h2>${ops.length?"Qué estudiaría en vez de clonarlo":"Aún no recomiendo un microproducto derivado"}</h2></div></div><div class="mr-opp-grid">${ops.map(opportunityCard).join("")}</div>
 <div class="mr-methodology"><span class="eyebrow">FUENTES</span><div><article>${sourceLink(p.storeUrl,"Ficha de Google Play")}<p>Icono original ofrecido únicamente como referencia.</p></article>${p.metricSource?`<article>${sourceLink(p.metricSource,"Datos y periodo publicados")}</article>`:""}${c?`<article>${sourceLink(c.source,"Volumen del sector")}</article>`:""}</div></div>`;
}
function renderOpportunity(x){
 const st=stage();if(!st)return;
 const rel=x.comparableIds.map(product).filter(Boolean);
 st.innerHTML=`${back()}<div class="mr-detail-head"><div class="mr-detail-kicker"><span class="eyebrow">TESIS DE INVERSIÓN / Nº ${e(x.priority)} / ${e(x.focus)}</span>${tag(x.phase,x.phase==="PREVENTA"?"good":x.phase==="DESCARTAR MVP COMERCIAL"?"bad":"warn")}</div><h1>${e(x.name)}</h1><p>${e(x.reason)}</p></div>
 <div class="mr-op-summary"><article><span>COMPRADOR</span><strong>${e(x.buyer)}</strong></article><article><span>PRUEBA COMERCIAL</span><strong>${e(x.validation||x.phase)}</strong></article><article><span>PRECIO DE PRUEBA, NO OBSERVADO</span><strong>${e(x.priceHypothesis)}</strong></article></div>
 <div class="mr-section-head"><div><span class="eyebrow">01 / LOS CUATRO CRITERIOS</span><h2>¿Dónde está la evidencia y qué falta?</h2></div></div><div class="mr-criteria">${x.criteria.map((v,i)=>`<article><small>0${i+1} · ${e(v.title)}</small><p>${e(v.state)}</p></article>`).join("")}</div>
 <div class="mr-two-cols"><article class="mr-analysis-panel"><span class="eyebrow">02 / SEÑAL DE MERCADO</span><h2>Por qué merece atención</h2><p>${e(x.proof)}</p><p><b>Distribución:</b> ${e(x.distribution)}</p><p><b>Confianza de esta tesis:</b> ${e(x.confidence)}</p></article>
 <article class="mr-analysis-panel"><span class="eyebrow">CONTRAARGUMENTOS</span><h2>Qué nos puede hacer perder dinero</h2><ul>${x.contrary.map(v=>`<li>${e(v)}</li>`).join("")}</ul></article></div>
 <div class="mr-section-head"><div><span class="eyebrow">03 / COMPETIDORES REALES</span><h2>Qué hay ya publicado en Play Store</h2></div></div><div class="mr-products">${rel.map(productCard).join("")}</div>
 <div class="mr-section-head"><div><span class="eyebrow">04 / TEST 7—14—21 DÍAS</span><h2>Gastar poco y tomar una decisión</h2></div></div><div class="mr-days">${x.days.map(v=>`<article><span>DÍA ${e(v.day)}</span><p>${e(v.task)}</p></article>`).join("")}</div>
 <div class="mr-two-cols mr-last"><article class="mr-analysis-panel mr-stop"><span class="eyebrow">REGLA DE ABANDONO</span><h2>${e(x.stop)}</h2></article><article class="mr-analysis-panel mr-budget"><span class="eyebrow">PRESUPUESTO / SUPUESTO</span><h2>${e(x.budget)}</h2><p>No incluye mano de obra, adquisición pagada, tarifas de tiendas, impuestos ni licencias comerciales adicionales.</p></article></div><div class="mr-source-line">Ninguna cifra del comparable se atribuye a esta idea. ${sourceLink(state.data.sources.find(s=>s.name.includes("RevenueCat"))?.url,"Metodología de conversión")}</div>`;
}
function renderLegacy(id){
 const el=stage();el.innerHTML=`${back()}<div class="mr-detail-head"><span class="eyebrow">ARCHIVO DE IDEAS ANTERIORES</span><h1>El mercado real tiene prioridad</h1><p>Las propuestas antiguas eran hipótesis creativas, no una clasificación de lo que vende en Google Play. Puedes consultar su JSON histórico en el repositorio, pero el ranking vigente está respaldado por fichas oficiales, precios y métricas publicadas.</p></div><a href="#mobile" class="mr-btn-return">Abrir Deep Research 2026 →</a>`;
}
function homePanel(){
 const host=$("#pulso-daily-carousel")||$("#pulse-intelligence");
 if(!host||$("#mr-home-section")||!state.data)return;
 const el=document.createElement("section");el.id="mr-home-section";el.className="mr-home-panel";
 const ids=["companycam","maintainx","pixelflow","mysterytown"],prods=ids.map(product).filter(Boolean);
 el.innerHTML=`<div class="mr-home-head"><div><span class="eyebrow">DEEP RESEARCH / PLAY STORE</span><h2>¿Dónde invertiría en apps y juegos ahora?</h2><p>19 productos reales, cifras con origen y un ranking de 8 tesis, no otra lista de clones.</p></div><a href="#mobile">Ver informe completo →</a></div><div class="mr-home-track">${prods.map(productCard).join("")}</div>`;
 host.insertAdjacentElement("afterend",el);
}
function opportunitiesPanel(){
 const host=$("#pulso-opps-stage");if(!host||!location.hash.startsWith("#opportunities")||$("#mr-opportunity-shortcut"))return;
 const target=host.querySelector(".op-page-header");if(!target)return;
 const el=document.createElement("a");el.href="#mobile";el.id="mr-opportunity-shortcut";el.className="mr-shortcut";
 el.innerHTML='<strong>📊 Deep Research Mobile & Google Play</strong><span>19 apps y juegos reales, demanda por subgénero, cifras verificadas y ranking de inversión · 20 noviembre 2026</span><b>Investigar →</b>';
 target.insertAdjacentElement("afterend",el);
}
function show(){
 nav();document.body.classList.toggle("pulso-mobile-mode",active());
 if(!state.data){return}
 if(active()){
 const hash=decodeURIComponent(location.hash.slice(1)),old=state.last;
 if(hash===old&&stage()?.innerHTML.trim()){homePanel();opportunitiesPanel();return;}
 if(hash==="mobile")renderIndex();
 else if(hash.startsWith("mobile-category/")){const x=dcat(hash.slice(16));x?renderCategory(x):renderLegacy("")}
 else if(hash.startsWith("mobile-app/")){const x=product(hash.slice(11));x?renderApp(x):renderLegacy("")}
 else if(hash.startsWith("mobile-opportunity/")){const x=opportunity(hash.slice(19));x?renderOpportunity(x):renderLegacy("")}
 else if(hash.startsWith("mobile-study/"))renderLegacy(hash.slice(13));
 if(old!==hash){state.last=hash;window.scrollTo(0,0)}
 }
 homePanel();opportunitiesPanel();
}
async function load(){
 try{const r=await fetch(B+"data/mobile-market-2026.json",{cache:"no-store"});if(!r.ok)throw Error(r.status);const j=await r.json();if(j.schemaVersion!==1||!j.apps||!j.opportunities)throw Error("Incompatible");state.data=j;}
 catch(err){console.warn("Mobile Deep Research no disponible",err);if(active()){document.body.classList.add("pulso-mobile-mode");const el=stage();if(el)el.innerHTML='<p>El dataset de investigación no se pudo cargar. Revisa la publicación de GitHub Pages.</p>';}return}
 show();let i=0;const timer=setInterval(()=>{show();if(++i>90)clearInterval(timer)},150);
}
document.addEventListener("click",event=>{const b=event.target.closest?.("[data-mr-filter]");if(!b)return;state.mode=b.dataset.mrFilter;renderIndex()});
window.addEventListener("hashchange",()=>setTimeout(show,110));
load();
})();
