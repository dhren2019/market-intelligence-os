(function mobileModule(){
'use strict';
const BASE="/market-intelligence-os/";
const state={items:[],benchmarks:[],activeTab:"all",last:null};
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safe=x=>{try{const u=new URL(x);return u.protocol==="https:"?u.href:"#"}catch{return "#"}};
const allowed=new Set(["www.bandhelper.com","www.photopills.com","udisc.com","www.snipd.com","www.gstatic.com"]);
const sourceImage=x=>{try{const u=new URL(x);return u.protocol==="https:"&&allowed.has(u.hostname)?u.href:""}catch{return ""}};
const favicon=x=>{const u=safe(x);if(u==="#")return"";return "https://www.google.com/s2/favicons?domain="+encodeURIComponent(new URL(u).hostname)+"&sz=128"};
const isMobile=()=>location.hash==="#mobile"||location.hash.startsWith("#mobile-study/");
function nav(){
 const nav=document.querySelector(".primary-nav");
 if(!nav)return;
 let link=nav.querySelector('a[href="#mobile"]');
 if(!link){link=document.createElement("a");link.href="#mobile";link.className="pulso-mobile-nav";link.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4M9 5h6"/></svg><span>Apps y juegos</span>';const opp=nav.querySelector('a[href="#opportunities"]');if(opp)opp.insertAdjacentElement("afterend",link);else nav.append(link);}
 link.classList.toggle("web-active",isMobile());
 const origin=nav.querySelector('a[href="#opportunities"]');if(origin&&isMobile())origin.classList.remove("web-active");
}
function getStage(){
 const w=document.querySelector(".workspace");
 if(!w)return null;
 let el=document.getElementById("pulso-mobile-stage");
 if(!el){el=document.createElement("section");el.id="pulso-mobile-stage";el.className="pulso-mobile-page";const main=w.querySelector(":scope > .main-content");if(main)w.insertBefore(el,main);else w.appendChild(el)}
 return el;
}
function getCase(id){return state.items.find(x=>x.id===id)}
function tag(x){return x.status==="candidate"?'<span class="pm-tag pm-good">Validar primero</span>':'<span class="pm-tag pm-risk">Laboratorio · alto riesgo</span>'}
function pic(x,dim="card"){
 const src=sourceImage(x.imageUrl);
 return `<div class="pm-photo pm-photo-${dim}">${src?`<img src="${esc(src)}" loading="lazy" alt="${x.kind==="carbon-game"?"Captura oficial de una demo de Google AI Studio Carbon, distinta del juego propuesto":"Imagen de producto comparable "+esc(x.compare?.[0]?.name||"oficial")}, solo para análisis">`:'<div class="pm-photo-fallback">◈</div>'}<span>${x.kind==="carbon-game"?"DEMO GOOGLE CARBON":"CAPTURA DE PRODUCTO REAL"}</span></div>`;
}
function caseCard(x){
 return `<a href="#mobile-study/${esc(x.id)}" class="pm-item-card" data-pm-kind="${esc(x.kind)}">${pic(x)}<div class="pm-item-content"><div class="pm-item-overline"><span>${x.kind==="carbon-game"?"🎮 JUEGO CARBON":"📱 APP FREEMIUM"}</span><span>${esc(x.sector)}</span></div><h3>${esc(x.name)}</h3><p>${esc(x.tagline)}</p><div class="pm-item-compare"><img src="${esc(favicon(x.compare[0].url))}" alt="" loading="lazy"><span>Comparable: <strong>${esc(x.compare[0].name)}</strong></span></div><div class="pm-item-bottom">${tag(x)}<strong>Estudio completo →</strong></div></div></a>`;
}
function renderIndex(){
 const stage=getStage();if(!stage)return;
 const tab=state.activeTab;const filtered=state.items.filter(x=>tab==="all"||x.kind===tab);
 stage.innerHTML=`<div class="pm-breadcrumb"><a href="#opportunities">← Oportunidades</a><span>RESEARCH MOBILE / 20 NOV 2026</span></div><header class="pm-head"><span class="eyebrow">NUEVA VÍA DE INGRESOS / PULSO</span><h1>Apps freemium y juegos <em>hechos con Carbon.</em></h1><p>No otro chatbot, contador de calorías o Bus Jam clonado. Ideas originales, compradores concretos y referencias comerciales con precios o IAP publicados. El prototipo se decide por datos, nunca por el número de descargas de un género.</p></header>
 <div class="pm-kpis"><article><small>Apps freemium</small><strong>${state.items.filter(x=>x.kind==="freemium").length}</strong><span>Profesionales y hobbies de nicho</span></article><article><small>Juegos Carbon</small><strong>${state.items.filter(x=>x.kind==="carbon-game").length}</strong><span>Loops en ≤21 días para validar</span></article><article><small>Presupuesto de prototipo</small><strong>0–120 €</strong><span>Rango supuesto, sin salarios ni UA</span></article></div>
 <div class="pm-important"><strong>Qué significa «la gente paga»:</strong> un comparable con suscripción o IAP a la venta demuestra oferta comercial, no clientes de nuestro producto. Solo llamaremos «ingresos» a importes atribuidos, etiquetados como reales declarados o estimados por proveedor. Retención y primeros pagos propios: pendientes.</div>
 <div class="pm-tabs" role="group" aria-label="Modo de producto"><button type="button" data-pm-tab="all" class="${tab==="all"?"active":""}" aria-pressed="${tab==="all"}">Todos (${state.items.length})</button><button type="button" data-pm-tab="freemium" class="${tab==="freemium"?"active":""}" aria-pressed="${tab==="freemium"}">📱 Apps freemium (${state.items.filter(x=>x.kind==="freemium").length})</button><button type="button" data-pm-tab="carbon-game" class="${tab==="carbon-game"?"active":""}" aria-pressed="${tab==="carbon-game"}">🎮 Juegos Carbon (${state.items.filter(x=>x.kind==="carbon-game").length})</button></div>
 <div class="pm-sect-intro"><div><span class="eyebrow">PROTOTIPOS Y PRUEBA DE PAGO</span><h2>${tab==="freemium"?"Apps para usuarios dispuestos a pagar":tab==="carbon-game"?"Juegos que hay que demostrar, no clonar":"Siete conceptos investigados"}</h2><p>Selecciona una tarjeta para ver productos de referencia, precios, competidores, plan 7/14/21 días y criterio de abandono.</p></div></div>
 <div class="pm-grid">${filtered.map(caseCard).join("")}</div>
 <section class="pm-market"><span class="eyebrow">INFORMES Y COMPROBACIÓN</span><h2>Por qué este mercado merece estudio</h2><div>${state.benchmarks.map(b=>`<a href="${safe(b.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(b.title)}</strong><p>${esc(b.finding)}</p><span>Informe original ↗</span></a>`).join("")}</div></section><div class="pm-footer-links"><a href="#opportunities">Volver a Oportunidades →</a><a href="#home">Panel principal →</a></div>`;
}
function list(items){return `<ul>${items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`}
function renderStudy(x){
 const stage=getStage();if(!stage)return;
 const details=x.compare.map(c=>`<article class="pm-comparable"><div class="pm-comp-title"><img src="${esc(favicon(c.url))}" loading="lazy" alt=""><div><h3>${esc(c.name)}</h3><a href="${safe(c.url)}" target="_blank" rel="noopener noreferrer">Abrir web oficial ↗</a></div></div><p><strong>Precio / monetización:</strong> ${esc(c.price)}</p><p><strong>Ingresos / prueba:</strong> ${esc(c.proof)}</p></article>`).join("");
 const criteria=[
 ["Uso frecuente",x.criteria?.frequent],["Dolor o pago",x.criteria?.economic],["Comprador",x.criteria?.buyer],["Preventa / test",x.criteria?.presale]
 ];
 stage.innerHTML=`<div class="pm-breadcrumb"><a href="#mobile">← Apps y juegos</a><span>${esc(x.sector)} / ${esc(x.period)}</span></div><div class="pm-study-title"><span class="eyebrow">${x.kind==="carbon-game"?"JUEGO PARA GOOGLE AI STUDIO CARBON":"APP MÓVIL FREEMIUM"} / ANÁLISIS DE MERCADO</span><h1>${esc(x.name)}</h1><p>${esc(x.tagline)}</p><div>${tag(x)} <span class="pm-device">${esc(x.feasibility)}</span></div></div><div class="pm-study-hero">${pic(x,"hero")}<div><h2>Qué app o juego construiríamos</h2><p>${esc(x.concept)}</p><dl><div><dt>Usuario que pagaría</dt><dd>${esc(x.buyer)}</dd></div><div><dt>Modelo de monetización</dt><dd>${esc(x.monetization)}</dd></div></dl></div></div>
 <div class="pm-note">La imagen representa <a href="${safe(x.imageSource)}" target="_blank" rel="noopener noreferrer">${esc(x.compare[0].name)}</a> o una demostración de Carbon: <b>no es una captura del concepto diseñado.</b> Se carga desde la fuente oficial sin almacenar ni redistribuir sus assets.</div>
 <div class="pm-sect-intro"><span class="eyebrow">01 / FILTRO DE VALIDACIÓN</span><h2>Nuestros cuatro criterios</h2></div><div class="pm-criteria">${criteria.map((c,i)=>`<article><small>0${i+1} · ${esc(c[0])}</small><p>${esc(c[1])}</p></article>`).join("")}</div>
 <div class="pm-two-col"><article class="pm-panel"><span class="eyebrow">02 / COMPETENCIA EXISTENTE</span><h2>La evidencia de pago</h2>${details}<p class="pm-evidence">Ventas de nuestro concepto: <strong>${esc(x.revenueOwn)}</strong> Descargas propias: <strong>${esc(x.downlOwn)}</strong></p></article><article class="pm-panel"><span class="eyebrow">03 / POR QUÉ SÍ O POR QUÉ NO</span><h2>Balance sin humo</h2><h3 class="pm-plus">A favor</h3>${list(x.positive)}<h3 class="pm-minus">En contra</h3>${list(x.negative)}<p class="pm-evidence"><strong>Comparación:</strong> ${esc(x.marketEvidence)}</p></article></div>
 <div class="pm-sect-intro"><span class="eyebrow">04 / ROADMAP MVP</span><h2>Del prototipo a una decisión en 21 días</h2></div><div class="pm-timeline">${x.mvp.map(m=>`<article><strong>Día ${esc(m.days)}</strong><p>${esc(m.text)}</p></article>`).join("")}</div>
 <div class="pm-two-col pm-validation"><article><span class="eyebrow">EXPERIMENTO COMERCIAL</span><h3>${esc(x.validation)}</h3></article><article><span class="eyebrow">PARAR CUANDO...</span><h3>${esc(x.stopRule)}</h3></article></div>
 <section class="pm-market"><span class="eyebrow">FUENTES Y LÍMITES DE EVIDENCIA</span><h2>Datos contrastables</h2><div>${x.sources.map(s=>`<a href="${safe(s.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(s.label)}</strong><p>${esc(s.finding)}</p><span>Fuente original ↗</span></a>`).join("")}</div></section><div class="pm-footer-links"><a href="#mobile">Volver a las siete fichas →</a></div>`;
}
function addHome(){
 if(!state.items.length)return;
 const home=document.getElementById("pulso-daily-carousel")||document.getElementById("pulse-intelligence");
 if(home&&!document.getElementById("pm-home-section")){
 const box=document.createElement("section");box.id="pm-home-section";box.className="pm-home-section";
 box.innerHTML=`<div class="pm-home-title"><div><span class="eyebrow">NUEVO / MOBILE BUSINESS LAB</span><h2>App freemium o juego con Carbon: ¿qué venderíamos?</h2><p>Proyectos originales, ingresos de referencia atribuidos y un MVP de 21 días.</p></div><a href="#mobile">Ver las 7 fichas ↗</a></div><div class="pm-home-strip">${[state.items[0],state.items[1],state.items[4],state.items[5]].filter(Boolean).map(caseCard).join("")}</div>`;
 home.insertAdjacentElement("afterend",box);
 }
}
function addOppsShortcut(){
 const host=document.getElementById("pulso-opps-stage");
 if(!host||!location.hash.startsWith("#opportunities")||document.getElementById("pm-opp-shortcut"))return;
 const anchor=host.querySelector(".op-page-header")||host.firstElementChild;if(!anchor)return;
 const box=document.createElement("a");box.href="#mobile";box.id="pm-opp-shortcut";box.className="pm-opps-shortcut";
 box.innerHTML='<span class="pm-shortcut-icon">📱</span><span><strong>Nueva sección · Apps freemium y juegos Carbon</strong><small>Productos que ofrecen suscripción/IAP, capturas oficiales, modelos de pago y tests de 21 días</small></span><b>Abrir estudios →</b>';
 anchor.insertAdjacentElement("afterend",box);
}
function render(){
 nav();
 const mobile=isMobile();
 document.body.classList.toggle("pulso-mobile-mode",mobile);
 if(mobile&&state.items.length){const id=location.hash.startsWith("#mobile-study/")?decodeURIComponent(location.hash.slice("#mobile-study/".length)):null;const x=id?getCase(id):null;if(state.renderedHash!==location.hash||state.renderedTab!==state.activeTab){if(id&&x){renderStudy(x)}else{renderIndex()}state.renderedHash=location.hash;state.renderedTab=state.activeTab;}if(state.last!==location.hash){state.last=location.hash;window.scrollTo(0,0)}}
 addHome();
 addOppsShortcut();
}
async function main(){
 try{
 const res=await fetch(BASE+"data/mobile-research.json",{cache:"no-store"});if(!res.ok)throw Error("HTTP "+res.status);
 const json=await res.json();if(json.schemaVersion!==1||!Array.isArray(json.items))throw Error("Esquema JSON no válido");
 state.items=json.items;state.benchmarks=json.benchmarks||[];
 }catch(err){console.warn("PULSO Mobile Lab: error al cargar",err);if(isMobile()){const stage=getStage();if(stage){document.body.classList.add("pulso-mobile-mode");stage.textContent="No se pudo cargar la investigación móvil. Revisa la conexión o vuelve a intentar."}}return;}
 render();let count=0;const t=setInterval(()=>{render();if(++count>100)clearInterval(t)},160);
}
document.addEventListener("click",event=>{const b=event.target.closest?.("[data-pm-tab]");if(!b)return;state.activeTab=b.dataset.pmTab;renderIndex()});
window.addEventListener("hashchange",()=>{setTimeout(render,130);});
main();
})();
