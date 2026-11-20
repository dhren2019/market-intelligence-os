(function PulsoOpportunities(){
"use strict";
const base="/market-intelligence-os/", themes={agents:["#0d5f70","#75dcd4"],invoices:["#6355a8","#c8b5ff"],returns:["#a45d42","#ffd3a3"],debate:["#a13560","#ff9fbe"]};
const E=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const U=v=>{try{const u=new URL(v);return u.protocol==="https:"?u.href:"#"}catch{return "#"}};
const logo=v=>{const u=U(v);return u==="#"?"":`https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(u).hostname)}&sz=128`};
const byId=id=>(state.studies||[]).find(x=>x.id===id);
const cleanDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||"")?new Intl.DateTimeFormat("es-ES",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(d+"T12:00:00Z")):E(d||"Sin fecha");
const state={studies:[],days:[],news:[],archive:[]};
const rootUrl=(path)=>base+path;
function illustration(kind){
 const [a,b]=themes[kind]||themes.agents;
 const symbols={
 agents:`<path d="M36 90L95 54L154 91" fill="none" stroke="#92fff1" stroke-width="3"/><circle cx="36" cy="90" r="8"/><circle cx="95" cy="54" r="8"/><circle cx="154" cy="91" r="8"/><rect x="202" y="35" width="125" height="94" rx="14" fill="#ffffff" fill-opacity=".12"/><path d="M220 64h89M220 82h62M220 100h42" stroke="#d7fff9" stroke-opacity=".8" stroke-width="5" stroke-linecap="round"/><circle cx="312" cy="111" r="16" fill="#53e9d3"/><path d="m303 111 6 6 12-13" fill="none" stroke="#0b4544" stroke-width="4"/>`,
 invoices:`<rect x="53" y="32" width="115" height="122" rx="12" fill="#fff" fill-opacity=".16"/><rect x="82" y="51" width="115" height="122" rx="12" fill="#fff" fill-opacity=".22"/><path d="M105 81h68M105 98h68M105 116h38" stroke="#f4eaff" stroke-width="6" stroke-linecap="round"/><path d="m212 120 22 20 44-52" fill="none" stroke="#c7ffcf" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="253" cy="99" r="52" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`,
 returns:`<rect x="70" y="43" width="128" height="105" rx="12" fill="#fff" fill-opacity=".15"/><path d="M70 79h128M134 43v105" fill="none" stroke="#ffe7cb" stroke-width="4"/><path d="m226 89 26-25 26 25M252 64v65" fill="none" stroke="#ffefd3" stroke-width="6" stroke-linecap="round"/><circle cx="252" cy="94" r="54" fill="none" stroke="#ffffff" stroke-opacity=".3" stroke-width="2"/>`,
 debate:`<rect x="38" y="31" width="234" height="142" rx="16" fill="#11172c" fill-opacity=".7" stroke="#fff" stroke-opacity=".25"/><path d="M54 121h17l12-24 13 40 18-62 15 44 11-18 12 16 20-8h82" stroke="#ffacbc" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="180" y="53" width="150" height="70" rx="12" fill="#fff" fill-opacity=".14"/><path d="M198 74h114M198 91h73" stroke="#fff" stroke-opacity=".8" stroke-width="5" stroke-linecap="round"/><circle cx="301" cy="109" r="14" fill="#ffc44e"/><text x="301" y="114" text-anchor="middle" font-size="17" fill="#402b22" font-weight="800">?</text>`};
 return `<div class="op-art" style="--op-a:${a};--op-b:${b}"><svg viewBox="0 0 360 194" role="img" aria-label="Ilustración original del caso"><defs><radialGradient id="oGlow"><stop stop-color="${b}" stop-opacity=".5"/><stop offset="1" stop-color="${b}" stop-opacity="0"/></radialGradient></defs><circle cx="285" cy="14" r="145" fill="url(#oGlow)"/><g fill="${b}">${symbols[kind]||symbols.agents}</g><path d="M0 166C130 138 229 210 360 166" stroke="#fff" stroke-opacity=".13" stroke-width="2" fill="none"/></svg><span class="op-visual-label">ANÁLISIS DOCUMENTADO · PULSO</span></div>`;
}
function miniLogo(x){const img=logo(x.url);return img?`<img loading="lazy" alt="" src="${E(img)}">`:"";}
function badge(s){return s==="explore"?'<span class="op-tag op-tag-warn">Exploración · sin validar</span>':'<span class="op-tag">Prioridad de preventa</span>';}
function card(x,toDay){
 const href=toDay?`#day/${E(x.date)}`:`#study/${E(x.id)}`;
 return `<a class="op-card" href="${href}">${illustration(x.art)}<div class="op-card-body"><div class="op-card-metas"><span>${E(x.sector)}</span><small>${cleanDate(x.date)}</small></div><h3>${E(x.title)}</h3><p>${E(x.subtitle)}</p><div class="op-card-proof"><span>${E(x.buyer)}</span></div><div class="op-card-foot">${badge(x.status)}<span class="op-card-go">Ver ${toDay?"día":"estudio"} ↗</span></div></div></a>`;
}
function move(id,dir){const el=document.getElementById(id);if(el)el.scrollBy({left:el.clientWidth*.79*dir,behavior:"smooth"})}
function dailyHome(){
 const anchor=document.querySelector("#pulse-intelligence .pulse-overview");
 if(!anchor||document.getElementById("pulso-daily-carousel"))return;
 const latest=state.days[0];if(!latest)return;
 const section=document.createElement("section");section.id="pulso-daily-carousel";section.className="op-home";
 section.innerHTML=`<div class="op-section-head"><div><span class="eyebrow">OPORTUNIDADES / DOSSIER DIARIO</span><h2>Hoy merecen una investigación más profunda.</h2><p>Tarjetas con productos reales comparables, riesgos, comprador y prueba de pago. <strong>Una nueva edición por fecha cuando hay evidencia nueva.</strong></p></div><div class="op-arrows"><button type="button" data-op-move="-1" aria-label="Anterior">‹</button><button type="button" data-op-move="1" aria-label="Siguiente">›</button></div></div><div class="op-home-strip" id="pulso-home-track">${latest.featuredIds.map(id=>byId(id)).filter(Boolean).map(x=>card(x,true)).join("")}</div><div class="op-home-actions"><a href="#day/${E(latest.date)}">Leer dossier del ${cleanDate(latest.date)} ↗</a><a href="#opportunities">Explorar oportunidades ↗</a></div>`;
 anchor.insertAdjacentElement("afterend",section);
 section.querySelectorAll("[data-op-move]").forEach(b=>b.addEventListener("click",()=>move("pulso-home-track",Number(b.dataset.opMove))));
}
function getStage(){
 const work=document.querySelector(".workspace");if(!work)return null;
 let stage=document.getElementById("pulso-opps-stage");
 if(!stage){stage=document.createElement("section");stage.id="pulso-opps-stage";stage.className="op-page";const main=work.querySelector(":scope > .main-content");if(main)work.insertBefore(stage,main);else work.appendChild(stage)}
 return stage;
}
function nav(){
 document.querySelectorAll('.primary-nav a[href="#opportunities"] span').forEach(x=>x.textContent="Oportunidades");
 const mode=location.hash.startsWith("#study/")||location.hash.startsWith("#day/")||location.hash.startsWith("#legacy/")||location.hash==="#opportunities";
 const active=document.querySelector('.primary-nav a[href="#opportunities"]');
 if(active)active.classList.toggle("web-active",mode);
}
function header(kicker,title,sub,back="#opportunities"){
 return `<div class="op-back-line"><a href="${back}">← Volver a oportunidades</a><span>${E(kicker)}</span></div><div class="op-page-header"><span class="eyebrow">${E(kicker)}</span><h1>${E(title)}</h1><p>${E(sub)}</p></div>`;
}
function filters(){return `<div class="op-filter-pills"><span>01 · Uso frecuente</span><span>02 · Valor en €</span><span>03 · Comprador real</span><span>04 · Previo al desarrollo: preventa</span></div>`}
function renderIndex(stage){
 const candidates=state.studies.filter(x=>x.status==="candidate"), explore=state.studies.filter(x=>x.status==="explore");
 stage.innerHTML=header("SELECCIÓN DOCUMENTADA · 20 NOV 2026","Oportunidades REALES","Productos comparables existentes, compradores identificados y pruebas comerciales ejecutables. No confundimos necesidad plausible con negocio validado.","#home")+filters()+
 `<div class="op-caution"><strong>El filtro es exigente:</strong> las 4 condiciones son hipótesis de viabilidad hasta que se cobren pilotos. El precio de la idea es una propuesta de test, no facturación ni precio confirmado de mercado.</div>`+
 `<div class="op-section-head op-section-head-tight"><div><span class="eyebrow">01 / CANDIDATAS QUE MERECE LA PENA VENDER PRIMERO</span><h2>Menos ideas, más problemas concretos</h2><p>Sin chatbots genéricos ni juegos de moda: propuestas con un proceso específico que demostrar.</p></div><strong>${candidates.length} candidatas</strong></div><div class="op-card-grid">${candidates.map(x=>card(x,false)).join("")}</div>`+
 `<div class="op-section-head op-gap"><div><span class="eyebrow">02 / LABORATORIO DE IDEAS</span><h2>Buenas preguntas que aún no superan el filtro</h2><p>Investigadas aunque tengan problemas de recurrencia, acceso al comprador o competencia.</p></div></div><div class="op-card-grid">${explore.map(x=>card(x,false)).join("")}</div>`+
 `<details id="op-legacy" class="op-legacy"><summary><span><strong>Archivo histórico: 55 hipótesis originales</strong><small>Proceden del Excel inicial. No pasan automáticamente a «reales» por tener score.</small></span><b>Desplegar ↘</b></summary><div class="op-legacy-wrap"><label for="op-legacy-query">Buscar en el archivo</label><input type="search" id="op-legacy-query" placeholder="Sector, nombre, comprador..." autocomplete="off"><div id="op-legacy-results" class="op-legacy-grid"></div></div></details>`;
 const d=stage.querySelector("#op-legacy");d.addEventListener("toggle",()=>{if(d.open)renderArchive()});
}
function renderArchive(){
 const list=document.getElementById("op-legacy-results");if(!list)return;
 const q=String(document.getElementById("op-legacy-query")?.value||"").toLocaleLowerCase("es");
 const filtered=state.archive.filter(x=>{const f=x.original_fields||{};return JSON.stringify(f).toLocaleLowerCase("es").includes(q)}).slice(0,55);
 list.innerHTML=filtered.map((r,i)=>{const f=r.original_fields||{};let id=String(f.ID||r.source_row||i);return `<a href="#legacy/${encodeURIComponent(id)}" class="op-archive-card"><span>${E(f.Sector||f["Línea"]||"Sector por confirmar")}</span><strong>${E(f.Microproducto||f["Producto propuesto"]||"Hipótesis importada")}</strong><small>${E(f["Quién paga"]||"Comprador sin verificar")}</small><em>Ficha del archivo ↗</em></a>`}).join("")||'<p>Sin coincidencias en el archivo.</p>';
}
function renderLegacy(stage,id){
 const item=state.archive.find(x=>String((x.original_fields||{}).ID||x.source_row)===id);
 if(!item){stage.innerHTML=header("ARCHIVO","Ficha no encontrada","No se localizó la hipótesis importada.");return}
 const f=item.original_fields||{};
 const lines=[["Problema que intenta resolver",f["Dolor real"]],["Comprador propuesto",f["Quién paga"]],["Frecuencia supuesta",f["Frecuencia objetivo"]],["Valor económico hipotético",f["€ que protege/genera"]],["Diferenciación propuesta",f["Diferencia frente al líder"]],["Prueba comercial",f["Validación antes de construir"]],["Regla de abandono",f["Criterio para parar"]],["Competidores citados en el Excel",f["Competidores reales"]]];
 stage.innerHTML=header("ARCHIVO / HIPÓTESIS SIN VALIDACIÓN",f.Microproducto||f["Producto propuesto"]||"Oportunidad importada","Ficha preservada del Excel inicial. No representa ventas contrastadas, ni una app con facturación demostrada.")+
 `<div class="op-caution">Score histórico: <b>${E(item.legacy_score??"no disponible")}</b> (prioridad heredada, NO probabilidad de éxito). Precios del Excel = objetivos propuestos, no precios reales verificados.</div><div class="op-facts-grid">${lines.filter(x=>x[1]).map(x=>`<article><span>${E(x[0])}</span><p>${E(x[1])}</p></article>`).join("")}</div>`+
 (U(f["Fuente ejemplo URL"])!=="#"?`<p class="op-source-callout"><a href="${U(f["Fuente ejemplo URL"])}" target="_blank" rel="noopener noreferrer">Abrir fuente de ejemplo original ↗</a> · No validada de nuevo para esta ficha.</p>`:"")+
 `<p class="op-note">Se incorpora al archivo por trazabilidad, pero la investigación competitiva y los cuatro criterios continúan pendientes.</p>`;
}
function renderStudy(stage,x){
 const rivals=x.competitors.map(c=>`<article class="op-rival"><div class="op-rival-head">${miniLogo(c)}<div><strong>${E(c.name)}</strong><small>${E(c.model)}</small></div></div><p>${E(c.differentiation)}</p><div class="op-rival-bottom"><span>${c.price?`Precio publicado: ${E(c.price)}`:"Precio: no verificado"}</span><a href="${U(c.url)}" target="_blank" rel="noopener noreferrer">Web oficial ↗</a></div>${c.priceSource?`<a href="${U(c.priceSource)}" target="_blank" rel="noopener noreferrer" class="op-tiny-source">Ver precio en fuente ↗</a>`:""}</article>`).join("");
 stage.innerHTML=header(`${x.sector} / ${x.subsector}`,x.title,x.subtitle)+
 `<div class="op-study-hero">${illustration(x.art)}<div><div class="op-study-label">${badge(x.status)} <span>Investigada ${cleanDate(x.date)}</span></div><h2>¿Qué resuelve?</h2><p>${E(x.description)}</p><div class="op-info-pair"><span>QUIÉN PAGARÍA</span><strong>${E(x.buyer)}</strong></div><div class="op-info-pair"><span>DÓNDE</span><strong>${E(x.geography)}</strong></div></div></div>`+
 `<div class="op-section-head op-gap"><div><span class="eyebrow">01 / CUATRO FILTROS</span><h2>¿Cumple realmente nuestros requisitos?</h2><p>El estado refleja un supuesto de investigación, no un check de venta cerrada.</p></div></div><div class="op-criteria-grid">${x.criteria.map((c,i)=>`<article><span>0${i+1} · ${E(c.name)}</span><strong>${E(c.state)}</strong><p>${E(c.detail)}</p></article>`).join("")}</div>`+
 `<div class="op-2col op-gap"><article class="op-panel"><span class="eyebrow">02 / CASO DE ESTUDIO Y HUECO REAL</span><h2>Por qué existe este problema</h2><p>${E(x.caseStudy)}</p><p>${E(x.whyNow)}</p><h3>Cómo cobraríamos</h3><p>${E(x.monetization)}</p><p><b>Facilidad de construcción:</b> ${E(x.ease)}</p><div class="op-note">Facturación de los productos comparables: <b>${E(x.revenue)}</b> Descargas: <b>${E(x.downloads)}</b> Crecimiento: ${E(x.growth)}</div></article><article class="op-panel"><span class="eyebrow">03 / BALANCE DE RIESGO</span><h2>Señales a favor y en contra</h2><h3 class="op-positive">Señales favorables</h3><ul>${x.positive.map(t=>`<li>${E(t)}</li>`).join("")}</ul><h3 class="op-negative">Lo que podría hundirla</h3><ul>${x.negative.map(t=>`<li>${E(t)}</li>`).join("")}</ul></article></div>`+
 `<div class="op-section-head op-gap"><div><span class="eyebrow">04 / COMPETENCIA COMPROBABLE</span><h2>Ya hay empresas vendiendo soluciones relacionadas</h2><p>Logos vía favicon del dominio oficial. No se atribuyen ingresos ni descargas sin cifras por producto, periodo y región.</p></div></div><div class="op-rival-grid">${rivals}</div>`+
 `<div class="op-section-head op-gap"><div><span class="eyebrow">05 / PLAN DE EJECUCIÓN</span><h2>7, 14 y 21 días. Solo construir si alguien paga.</h2></div></div><div class="op-timeline">${x.mvp.map(m=>`<article><span>DÍA ${E(m.days)}</span><p>${E(m.text)}</p></article>`).join("")}</div><div class="op-2col op-gap"><article class="op-panel op-action"><span class="eyebrow">PRUEBA DE PREVENTA</span><h2>${E(x.validation)}</h2><p>${E(x.preSale)}</p></article><article class="op-panel op-stop"><span class="eyebrow">CONDICIÓN DE ABANDONO</span><h2>${E(x.stopRule)}</h2></article></div>`+
 `<section class="op-sources"><span class="eyebrow">FUENTES Y COMPROBACIONES</span><h2>Qué hemos podido documentar</h2><div>${x.evidence.map(e=>`<a href="${U(e.url)}" target="_blank" rel="noopener noreferrer"><span>${E(e.kind)}</span><strong>${E(e.label)}</strong><small>${E(e.claim)}</small><em>Consultar ↗</em></a>`).join("")}</div></section><div class="op-home-actions"><a href="#day/${E(x.date)}">Ver investigación de ese día ↗</a><a href="#opportunities">Todas las oportunidades ↗</a></div>`;
}
function renderDay(stage,day){
 const items=day.featuredIds.map(byId).filter(Boolean);
 const news=day.sourceResearchIds.map(id=>state.news.find(n=>n.id===id)).filter(Boolean);
 stage.innerHTML=header("DOSSIER DIARIO · "+cleanDate(day.date),day.title,day.subtitle,"#home")+
 `<div class="op-day-summary"><span class="eyebrow">LO QUE HEMOS CONCLUIDO</span><p>${E(day.summary)}</p><small>${E(day.note)}</small></div><div class="op-section-head op-gap"><div><span class="eyebrow">01 / OPORTUNIDADES INVESTIGADAS</span><h2>La selección del ${cleanDate(day.date)}</h2><p>Abre cada caso para ver su comprador, competencia, pruebas y puntos débiles.</p></div></div><div class="op-card-grid">${items.map(x=>card(x,false)).join("")}</div>`+
 `<div class="op-section-head op-gap"><div><span class="eyebrow">02 / NOTICIAS QUE RESPALDAN EL CONTEXTO</span><h2>Fuentes de mercado de esta edición</h2><p>Financiación anunciada ≠ ingresos. Los titulares se mantienen atribuidos a la fuente original.</p></div></div><div class="op-day-news">${news.map(n=>`<article><span>${E(n.publishedAt||"Fecha no confirmada")} · ${E(n.type||"Señal")}</span><h3>${E(n.title)}</h3><p>${E(n.finding)}</p><small>${E(n.opportunity)}</small><a href="${U(n.url)}" target="_blank" rel="noopener noreferrer">${miniLogo({url:n.url})} Fuente original ↗</a></article>`).join("")||"<p>Sin titulares nuevos comprobables en este dossier.</p>"}</div><div class="op-home-actions"><a href="#opportunities">Explorar todos los casos ↗</a><a href="#home">Volver al panel ↗</a></div>`;
}
function renderRoute(){
 nav();dailyHome();
 const stage=getStage();if(!stage)return;
 const hash=decodeURIComponent(location.hash.slice(1)),mode=hash==="opportunities"||hash.startsWith("study/")||hash.startsWith("day/")||hash.startsWith("legacy/");
 document.body.classList.toggle("pulso-opps-mode",mode);
 if(!mode){stage.innerHTML="";return}
 if(hash==="opportunities")renderIndex(stage);
 else if(hash.startsWith("study/")){const x=byId(hash.slice(6));x?renderStudy(stage,x):stage.innerHTML=header("INVESTIGACIÓN","Estudio no disponible","La ficha todavía no se ha publicado.")}
 else if(hash.startsWith("legacy/"))renderLegacy(stage,hash.slice(7));
 else if(hash.startsWith("day/")){const day=state.days.find(d=>d.date===hash.slice(4));day?renderDay(stage,day):stage.innerHTML=header("DOSSIER","Todavía no hay investigación para ese día","No se generan páginas diarias con datos inventados.")}
 if(hash!==state.lastHash){state.lastHash=hash;window.scrollTo({top:0,behavior:"instant"})}
}
async function load(){
 try{
 const paths=["data/opportunity-studies.json","data/daily-opportunities.json","data/daily-research.json","data/imports/seed/oportunidades_55_importadas.json"];
 const res=await Promise.all(paths.map(p=>fetch(rootUrl(p),{cache:"no-store"}).then(r=>{if(!r.ok)throw Error(p+" "+r.status);return r.json()})));
 if(!Array.isArray(res[0].items)||!Array.isArray(res[1].days))throw Error("Esquema incorrecto");
 state.studies=res[0].items;state.days=res[1].days.slice().sort((a,b)=>b.date.localeCompare(a.date));state.news=Array.isArray(res[2].items)?res[2].items:[];state.archive=Array.isArray(res[3])?res[3]:[];
 }catch(err){
 console.warn("PULSO: no se pudo cargar el dossier",err);
 const host=getStage();if(host&&location.hash==="#opportunities"){document.body.classList.add("pulso-opps-mode");host.innerHTML=header("ERROR DE CARGA","Investigación no disponible","No se ha podido leer el JSON de oportunidades. Prueba a recargar; no se muestran datos sin verificar.")}
 return;
 }
 let attempts=0;const timer=setInterval(()=>{if(document.querySelector(".workspace")){renderRoute();if(location.hash&&location.hash!=="#home"||document.getElementById("pulse-intelligence")||++attempts>70)clearInterval(timer)}else if(++attempts>100)clearInterval(timer)},160);
}
window.addEventListener("hashchange",()=>{setTimeout(renderRoute,70);});
document.addEventListener("input",event=>{if(event.target&&event.target.id==="op-legacy-query")renderArchive()});
load();
})();
