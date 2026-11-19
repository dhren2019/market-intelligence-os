/* Static GitHub Pages/Jekyll compatibility layer; no bundler required.
   The React/Vite app also renders its own radar when GitHub Actions is selected as the Pages source. */
(function(){
 'use strict';
 const base='/market-intelligence-os/';
 const research='https://raw.githubusercontent.com/dhren2019/market-intelligence-os/gh-pages/data/daily-research.json';
 const groups=[
  {label:'Apps no-juego',value:85.6},
  {label:'Juegos móviles',value:81.4}
 ];
 const ideas=[
  {name:'Agent QA Monitor',sector:'SaaS y agentes',time:'14–21 días',buyer:'Agencias y equipos que entregan agentes a clientes',money:'49–149 €/mes (hipótesis de precio)',test:'Auditar tres agentes reales y cobrar dos pilotos',link:'#saas'},
  {name:'Web Release Visual Diff',sector:'Web / Dev tools',time:'12–18 días',buyer:'Agencias que publican webs cada semana',money:'29 €/mes (hipótesis de precio)',test:'Ofrecer cinco auditorías visuales de pago antes del desarrollo',link:'#webdev'},
  {name:'Website Change Intelligence',sector:'SaaS y agentes',time:'10–16 días',buyer:'Agencias y distribuidores',money:'29–99 €/mes (hipótesis de precio)',test:'Enviar 10 alertas comerciales manuales y pedir compromiso de pago',link:'#saas'}
 ];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const valid=u=>{try{let a=new URL(u);return a.protocol==='https:'?a.href:'#'}catch{return '#'}};
 function render(root){
  if(document.getElementById('mio-live-radar'))return;
  const wrapper=document.createElement('section');wrapper.id='mio-live-radar';wrapper.className='section-block mio-live-radar';
  wrapper.innerHTML=`<div class="section-heading"><div><span class="eyebrow">DECISION CENTER · NUEVO RADAR</span><h2>Qué investigar para facturar en 21 días</h2><p class="mio-live-lead">Datos de mercado comparables, competidores y validación comercial antes de programar.</p></div><a href="#opportunities">Explorar 55 ideas →</a></div>
  <div class="mio-live-grid"><article class="mio-live-panel"><span class="eyebrow">2025 · GASTO IAP MUNDIAL</span><h3>Apps frente a juegos</h3><div class="mio-live-chart">${groups.map(g=>`<div class="mio-live-bar"><div><b>${esc(g.label)}</b><strong>${g.value.toLocaleString('es-ES')} mil M$</strong></div><div class="mio-live-track"><span style="width:${g.value/85.6*100}%"></span></div></div>`).join('')}</div><small>Sensor Tower: 167.000 M$ total IAP en 2025. Apps no-juego 85.600 M$; juegos = diferencia calculada. No incluye toda la economía publicitaria.</small><a target="_blank" rel="noreferrer" href="https://sensortower.com/blog/state-of-mobile-2026">Consultar metodología ↗</a></article>
  <article class="mio-live-panel"><span class="eyebrow">OPORTUNIDADES · MVP ≤21 DÍAS</span><h3>3 candidatos para validar</h3><p class="mio-live-muted">Son hipótesis de producto, no negocios con ingresos demostrados.</p><div class="mio-live-ideas">${ideas.map((a,i)=>`<details><summary><span>0${i+1}</span><b>${esc(a.name)}</b><small>${esc(a.time)}</small></summary><p><b>Mercado:</b> ${esc(a.sector)}</p><p><b>Comprador:</b> ${esc(a.buyer)}</p><p><b>Monetización:</b> ${esc(a.money)}</p><p><b>Validación:</b> ${esc(a.test)}</p><a href="${a.link}">Ver sector y competidores →</a></details>`).join('')}</div></article></div>
  <div class="mio-live-check"><strong>Antes de construir:</strong> identificar 10 compradores concretos, conseguir al menos 2 pilotos comprometidos, comprobar coste de adquisición y definir cuándo abandonar la idea.</div>
  <div class="section-heading mio-live-news-heading"><div><span class="eyebrow">TECH · BUSINESS · SOFTWARE · STARTUPS · GAMING</span><h2>Noticias y señales verificadas</h2><p class="mio-live-lead" id="mio-live-date">Cargando investigación diaria…</p></div><a href="#trends">Ver fuentes →</a></div><div class="mio-live-feed" id="mio-live-feed" aria-live="polite"></div>`;
  root.insertAdjacentElement('afterend',wrapper);
  const feed=document.getElementById('mio-live-feed');
  fetch(research,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('fetch failed');return r.json()}).then(data=>{
   document.getElementById('mio-live-date').textContent='Última actualización: '+(data.updatedAt||'sin fecha')+' · informes y estimaciones identificados';
   const rows=Array.isArray(data.items)?data.items.filter(i=>i&&i.title&&valid(i.url)!=='#').slice().reverse().slice(0,10):[];
   if(!rows.length){feed.textContent='Sin noticias verificadas para mostrar.';return}
   rows.forEach(item=>{
    const article=document.createElement('article');article.className='mio-live-news';
    const meta=document.createElement('div');meta.className='mio-live-meta';
    const logo=document.createElement('img');logo.alt='';logo.loading='lazy';logo.src='https://www.google.com/s2/favicons?domain='+encodeURIComponent(new URL(item.url).hostname)+'&sz=64';meta.appendChild(logo);
    const t=document.createElement('span');t.textContent=item.type||'Fuente';meta.appendChild(t);
    const dt=document.createElement('span');dt.textContent=item.publishedAt||item.observedAt||'Fecha sin confirmar';meta.appendChild(dt);article.appendChild(meta);
    const title=document.createElement('h3');title.textContent=item.title;article.appendChild(title);
    const p=document.createElement('p');p.textContent=item.finding||'';article.appendChild(p);
    if(item.opportunity){const op=document.createElement('p');op.className='mio-live-op';op.textContent='Oportunidad a estudiar: '+item.opportunity;article.appendChild(op)}
    const a=document.createElement('a');a.href=valid(item.url);a.target='_blank';a.rel='noreferrer';a.textContent='Comprobar fuente ↗';article.appendChild(a);feed.appendChild(article);
   });
  }).catch(()=>{document.getElementById('mio-live-date').textContent='Actualización sin confirmar';feed.textContent='No se ha podido cargar el feed. Consulta Fuentes y tendencias.'});
 }
 function mount(){
  if(location.hash&&location.hash!=='#home')return;
  const header=document.querySelector('.web-kpi-grid');if(header)render(header);
 }
 let attempts=0;
 const interval=setInterval(()=>{mount();if(document.getElementById('mio-live-radar')||++attempts>50)clearInterval(interval)},150);
 window.addEventListener('hashchange',()=>{let el=document.getElementById('mio-live-radar');if(el)el.style.display=(!location.hash||location.hash==='#home')?'':'none';else mount()});
})();
