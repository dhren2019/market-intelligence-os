(function(){
'use strict';
let ticks=0;
const interval=setInterval(()=>{
 const nav=document.querySelector('.pulse-sectors');
 const content=document.getElementById('pulse-market-content');
 if(!nav||!content){if(++ticks>90)clearInterval(interval);return;}
 clearInterval(interval);
 if(nav.querySelector('[data-pulso-fitness]'))return;
 const button=document.createElement('button');
 button.textContent='💪 Fitness y bienestar';
 button.type='button';
 button.setAttribute('aria-pressed','false');
 button.dataset.pulsoFitness='true';
 nav.insertBefore(button,nav.children[1]||null);
 const source='https://sensortower.com/blog/health-and-fitness-apps-ai';
 const competitors=[['Cal AI','https://www.calai.app/','Nutrición por foto; suscripción'],['MacroFactor','https://macrofactorapp.com/','Seguimiento nutricional por suscripción'],['YAZIO','https://www.yazio.com/','Freemium y Pro']];
 const render=()=>{nav.querySelectorAll('button').forEach(el=>{el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button))});
 content.innerHTML='<div class="pulse-metric"><div><span class="eyebrow">HEALTH & FITNESS · 2025 · IAP GLOBAL</span><h3>4.500 M$</h3><p>+13 % interanual · estimación Sensor Tower · cerca de 4.000 millones de descargas</p></div><a href="'+source+'" target="_blank" rel="noreferrer">Informe original ↗</a></div><div class="pulse-market-columns"><article class="pulse-chart-card"><div class="pulse-small-head"><strong>¿Crece el negocio o solo las instalaciones?</strong><small>Variación interanual 2025 · %</small></div><svg class="pulse-svg-chart" viewBox="0 0 560 175" role="img" aria-label="IAP de Fitness creció 13%; descargas subieron un 0,8%"><text x="15" y="36" fill="currentColor" font-size="13">Gasto IAP</text><rect x="140" y="19" width="345" height="25" rx="7" fill="currentColor" opacity=".06"/><rect x="140" y="19" width="345" height="25" rx="7" fill="#08cfb5"/><text x="495" y="37" fill="currentColor" font-size="13" font-weight="800">+13 %</text><text x="15" y="102" fill="currentColor" font-size="13">Descargas</text><rect x="140" y="85" width="345" height="25" rx="7" fill="currentColor" opacity=".06"/><rect x="140" y="85" width="21" height="25" rx="7" fill="#249ee5"/><text x="495" y="103" fill="currentColor" font-size="13" font-weight="800">+0,8 %</text><text x="140" y="150" fill="currentColor" font-size="11">Distintas bases: se comparan tasas de variación, no volúmenes.</text></svg><p class="pulse-foot">Las apps del sector monetizan más, pero esto no garantiza rentabilidad para nuevos entrantes.</p></article><article class="pulse-analysis-card"><span class="eyebrow">NICHO A ESTUDIAR</span><h3>Seguimiento de fuerza para entrenadores</h3><p>No otro contador genérico de calorías. Un flujo B2B de check-in, progresión y reportes semanales para profesionales que ya cobran cuotas a sus clientes.</p><div class="pulse-attention"><strong>⚑ Riesgo</strong><p>Competencia consolidada y posible adquisición cara. Verificar a quién vender y qué hacen hoy manualmente.</p></div><div class="pulse-launch"><small>MVP EN 14–21 DÍAS · HIPÓTESIS</small><b>Diario de progreso + resumen semanal</b><span>Comprador: entrenadores independientes</span><p><b>Prueba:</b> hablar con 12 entrenadores; pedir 3 pilotos pagados antes de desarrollar.</p></div></article></div><div class="pulse-rivals"><div class="pulse-small-head"><strong>Productos existentes y monetización</strong><small>No se atribuyen ingresos individuales no publicados</small></div><div class="pulse-rival-grid">'+competitors.map(p=>'<a target="_blank" rel="noreferrer" href="'+p[1]+'"><img alt="" loading="lazy" src="https://www.google.com/s2/favicons?domain='+new URL(p[1]).hostname+'&sz=128"><span><b>'+p[0]+'</b><small>'+p[2]+'</small></span><span>↗</span></a>').join('')+'</div></div>';
 };
 button.addEventListener('click',render);
},180);
})();