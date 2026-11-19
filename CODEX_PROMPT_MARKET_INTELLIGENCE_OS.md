# PROMPT MAESTRO PARA CODEX — MARKET INTELLIGENCE OS

**Fecha de especificación:** 18/11/2026 · **Idioma de producto:** español · **Mercado principal:** España, con comparativas globales · **Alcance:** MVP funcional en 2–3 semanas, ampliable sin rehacer la arquitectura.

## Tu misión

Actúa simultáneamente como *product engineer senior, arquitecto full-stack, data engineer, analista cuantitativo de mercado, diseñador de producto y QA*. **Construye una aplicación web de verdad**, privada al principio, denominada **Market Intelligence OS (MIO)**. No entregues solamente una demo estática, mockups, prompts, planes o pseudocódigo. Ejecuta el trabajo en el repositorio actual, realiza cambios verificables y explica qué funciona, qué está conectado y qué no.

La aplicación sirve para decidir en qué microproducto invertir **nuestro tiempo de desarrollo de 14–21 días**. Debe detectar dónde existe gasto económico y demanda comprobable, seguir cambios de mercado, mostrar competidores que ya comercializan herramientas, ayudar a evaluar ideas de software/SaaS/apps móviles/juegos/apps de escritorio, y facilitar un proceso de preventa antes de escribir mucho código. **No es asesor financiero regulado ni un oráculo capaz de garantizar éxitos.**

Tienes dos Excel de partida que debes importar, preservar y analizar, situados en `data/imports/seed/`:

1. `radar_5_sectores_espana_2026.xlsx` (10 hojas).
2. `radar_espana_mas_tecnologia_2026.xlsx` (21 hojas).

**MUY IMPORTANTE:** El segundo ya contiene las mismas diez hojas originales del primero. Deduplica por identificador y procedencia; el catálogo inicial tiene **25 oportunidades sectoriales + 30 tecnológicas = 55**, no 80. Conserva el nombre de hoja, fila, score original, URL de fuente y fecha de importación. No inventes facturación o demanda a partir de una hipótesis de los Excel.

El workbook ampliado incluye, entre otras hojas: `01_5_SECTORES`, `02_25_OPORTUNIDADES`, `03_COMPETIDORES`, `04_VALIDAR_21_DIAS`, `05_ECONOMIA`, `06_JUEGOS_AR`, `07_FUENTES`, `08_CRM_PILOTOS`, `09_CRITERIOS`, `10_TECH_PORTADA`, `11_TECH_5_LINEAS`, `12_TECH_30_IDEAS`, `13_TECH_COMPETIDORES`, `14_TECH_JUEGOS`, `15_TECH_DESKTOP`, `16_TECH_MODELOS`, `17_TECH_ECONOMIA`, `18_TECH_VALIDAR`, `19_TECH_FUENTES`, `20_TECH_CRITERIOS`.

**Campos principales sectoriales** (verificar contra archivo, no asumir): ID, Sector, Microproducto, Quién paga, Dolor real, Frecuencia objetivo, € que protege/genera, Formato, Modelo, Precio objetivo, Frecuencia/Valor/Acceso/MVP/Hueco, Score 0–100, 4 criterios, Días MVP, Competidores, Diferencia, Contacto, Validación, Abandono, Riesgo, URL. En tecnología son similares, con monetización primaria/secundaria, unidad de precio y precio a probar.

Ejemplos de ideas existentes: TourFoto Upsell, EventMiniPlay, VenueQuest, RepetiPedido, RFQ Radar, RetornoQR, AdPreflight, PreviewGuard, CronPulse, SortPilot Windows, StoreShots Pro, PrismRaid. **Estos nombres son hipótesis propias, no empresas con ventas verificadas.**

**Reglas de producto no negociables:**
- Español claro, nivel visual muy intuitivo: cada gráfico debe explicar «qué significa», «por qué cambia» y «qué haría yo» en un máximo de 2–3 frases.
- Las métricas reales deben mostrar **valor, unidad, país, periodo, fecha de actualización, fuente, calidad y metodología**.
- Diferenciar en toda la UI: **dato observado / proxy / estimación / hipótesis / predicción**. Mostrar `Sin datos suficientes` cuando corresponda.
- **Nunca** inventar búsquedas mensuales, descargas, ingresos, inversión, clientes, tendencias o probabilidades. Nunca presentar estrellas de GitHub como demanda empresarial ni Google Trends como volumen absoluto.
- No incluir salud, fintech regulada, apuestas, cumplimiento laboral/fiscal automatizado ni otros verticales regulatoriamente complejos como oportunidades prioritarias; marcar restricciones cuando apliquen.
- El análisis de software ajeno será de funcionalidades observables y fuentes públicas, con implementación *clean room* original; no copiar código, assets, marcas, contenidos cerrados ni eludir autenticación o restricciones.
- El MVP deberá poder operar localmente con infraestructura gratuita/open source. No depender para arrancar de ninguna API comercial ni de un modelo LLM de pago.

---

## 0. AUDITORÍA PREVIA OBLIGATORIA Y PLAN BREVE

1. Inspecciona el repositorio y aprovecha su stack si existe. No borres trabajo previo. Si está vacío, usa el stack de abajo.
2. Lee ambos Excel COMPLETOS. Genera `docs/AUDITORIA_EXCEL.md` con hojas, recuentos, duplicados, inconsistencias, fórmulas, columnas, procedencia y cobertura de fuentes. Documenta que los 5 sectores originales contienen métricas NO HOMOGÉNEAS: comercio/industria/construcción/transporte usan cifras de negocios INE 2024; turismo utiliza gasto de turistas extranjeros INE 2025. **No sumes ni compares estas cifras como un ranking financiero homogéneo**.
3. Diseña un mapa de entidades e importadores con claves estables. Los scores 0–100 originales quedan guardados como `legacy_score` y **no son evidencia comercial nueva**.
4. Comprueba documentación y condiciones de uso reales de cada fuente antes de implementar un conector. Especifica fecha y permiso/rate limit en `docs/FUENTES_Y_LICENCIAS.md`.
5. Muestra un plan breve con fases y después **implementa sin parar para pedir permiso por cuestiones menores**. No hagas commits ni despliegues sin instrucciones explícitas. Cuando haya impedimento externo (credenciales/hosting), implementa adaptador, tests y fallback local; deja el bloqueo documentado y continúa.

---

## 1. STACK PROFESIONAL Y ECONÓMICO

Por defecto, si el repo está vacío:
- **Web:** Next.js estable + React + TypeScript estricto + Tailwind CSS + shadcn/ui (o componentes accesibles equivalentes) + iconos Lucide.
- **Gráficos:** Apache ECharts o Recharts; mapas solo si tienen datos geográficos útiles. TanStack Table para filtros/tablas extensas.
- **Persistencia:** PostgreSQL local Docker y posibilidad de conectar Neon Postgres mediante `DATABASE_URL`; Drizzle ORM + migraciones. Guardar la **serie temporal de hechos y snapshots**, no solo el valor actual. Sin Redis/Kafka ni microservicios innecesarios.
- **Ingesta:** Python 3.12+, httpx/requests, Pydantic, Polars si es útil, BeautifulSoup/Trafilatura para HTML autorizado, `openpyxl` o equivalente apropiado para importar Excel. Usar APIs antes que scraping; tareas de extracción independientes, con tests y logs.
- **Automatización:** GitHub Actions programado + `workflow_dispatch` y disparador de importación de ficheros. Que también pueda ejecutarse mediante script local y CLI.
- **Exportación:** XLSX con ExcelJS o librería equivalente, CSV y JSON/JSONL, con fórmulas y codificación válidas. Los gráficos exportados deben llevar fuente y fecha.
- **QA:** Vitest/unitarios, pruebas de integridad de datos en Python, Playwright e2e/responsive y tests de imports. ESLint, formato y TypeScript sin errores.
- **Infraestructura:** modo local totalmente funcional; despliegue web compatible con Vercel (si hay funciones serverless, evitar trabajos de scraping pesados dentro de una petición), y cron externo compatible. No afirmar que los free tiers ofrecen almacenamiento o tráfico ilimitado.
- **IA:** usar extracción heurística/embeddings locales o Ollama **opcionales**. Si no hay LLM, ranking, series, etiquetas y toda la app siguen operativos. La IA puede resumir evidencia **con enlaces**, no crear datos.

Diseña `services/connectors/` para añadir fuentes de datos por separado y ejecutarlas sin bloquear a las demás. Mantén conexión HTTP, parsing, normalización, deduplicación y scoring como módulos distintos.

---

## 2. PANTALLAS Y EXPERIENCIA VISUAL

Diseño premium pero sencillo, información densa bien ordenada, modo oscuro/clarito, gran legibilidad móvil y desktop, tiempos de carga buenos, estados vacíos honestos. Sidebar: **Inicio, Sectores, Demanda empresarial, Tecnología, Apps y juegos, Tendencias, Oportunidades, Empresas, Inversores, Pronósticos, Importaciones, Fuentes y ajustes**.

### 2.1 Inicio — «¿Dónde merece la pena mirar hoy?»
- Hero: fecha de última actualización y semáforo general de cobertura de fuentes.
- 4–6 KPIs útiles basados en datos: fuentes activas, oportunidades examinadas, señales nuevas de 7 días, sectores con aceleración, pilotos iniciados, fuentes fallidas.
- Dos grupos claramente separados: **SEÑALES COMERCIALES** (licitaciones, contratación de herramientas, demanda explícita) y **SEÑALES DE MODA/INTERÉS** (búsquedas, GitHub, noticias).
- Top 5 oportunidades con icono de evidencia: confirmado / plausible / especulativo y botón «Ver por qué».
- Mini línea de tiempo 7/30/90 días y «3 cosas para investigar hoy», basadas únicamente en cambios medidos y con enlaces.
- Actividad de la ingesta: último éxito, última ejecución, errores, datos obsoletos.

### 2.2 Sectores España vs Mundo
- Ranking de sectores con un **selector de métrica**: cifra de negocios, empresas activas, empleo, crecimiento interanual, gasto del consumidor, inversión publicada. Solo ordenar juntos sectores con misma definición, año, moneda y área.
- España: partir de los 5 sectores del Excel, y permitir añadir otros cuando haya datos comparables. Gráficos YoY, línea histórica y tabla con fuente y método. Comunidades autónomas solo cuando el proveedor lo permita.
- Internacional: Eurostat (UE), Banco Mundial (países), OCDE cuando haya series equivalentes; no inventar equivalencias CNAE/ISIC/NACE; documentar mapeos.
- Cada sector tiene subsegmentos, dolores potenciales, compradores contactables y software actual, **sin transformar automáticamente el tamaño económico del sector en TAM para nuestra app**.
- Tooltip didáctico: «El gasto turístico de visitantes no se puede sumar a la cifra de negocios empresarial».

### 2.3 Demanda empresarial — «Qué se está comprando»
- Visualizar **evidencias reales de necesidad**: licitaciones de software/servicios, categorías CPV, presupuestos publicados, concursos recurrentes, compras adjudicadas y señales adicionales con fuente permitida.
- Tabla: fecha, comprador/entidad, país/región, categoría, concepto, importe si está publicado, fecha límite, estado y URL directa.
- Filtros: España/UE, sector, fecha, € mínimo, software/servicio, recurrencia; diferenciación público vs privado.
- Un anuncio de licitación ≠ compra adjudicada ≠ prueba de demanda de pymes privadas. Mostrar esta diferencia visiblemente.
- Hipótesis de pain point basada en documentos reales y frecuencia observada; jamás inferir «necesitan pagar 99€/mes» sin una prueba comercial.

### 2.4 Tecnología / software / SaaS / PC
- Categorías: agentes de IA, developer tools, software vertical, extensiones, automatizaciones, apps desktop, diseño 3D, gaming, marketing y otras descubiertas de manera trazable.
- Cambios en nuevos repositorios, estrellas ganadas por periodo cuando el origen las facilite, repos creados, issues de usuarios públicos, productos lanzados, señales de adopción.
- **No son ventas:** las estrellas, forks o publicaciones tecnológicas solo miden actividad de comunidad. Debe mostrar también el vacío de señal comercial.
- Un radar semanales «Emergente», «Acelerando», «Estable», «Declinando», «Demasiado competido», con método y cobertura.

### 2.5 Apps móviles y juegos
- Android/iOS diferenciados; filtro por país/categoría/fecha, monetización: pago único, freemium, ads, IAP consumible/no consumible, suscripción, capítulos, licencias.
- Tendencias de categorías **solo cuando exista una serie pública comparable**. Por ejemplo, si «fitness crece este año», enseñar fuente y serie para decidir si es búsqueda, ranking, ingresos o uso. Una noticia no sirve como cuota de mercado.
- Las descargas e ingresos de otras apps no son públicos de forma sistemática: mostrar `Desconocido` cuando la fuente no publique datos; nunca convertir ranking o reseñas en ingresos estimados sin modelo explícito.
- Para juegos: ficha de bucle de juego, retención hipotética, microcompras funcionales (niveles, episodios, herramientas, campañas cooperativas), AdMob solo como modelo y estimador con eCPM/DAU **editables** no inventados. Camara/AR originales sin prometer que una mecánica no existe en el mundo.
- Sección «ideas raras pero realizables» procedentes de combinaciones de señales, con viabilidad de un prototipo de 7 días y una prueba de diversión de usuarios.

### 2.6 Tendencias — inspirado en Trendshift, pero con sentido empresarial
- Vista `Hoy / 7d / 30d / 90d / 12m` con cambios relativos, aceleración, origen, fecha y clasificación.
- Tres paneles separados: **código/repos**, **búsqueda/atención**, **dinero/compras/inversión**.
- Cada tendencia tiene evidencia, cobertura, gráficos y motivo del movimiento, sin inventar causas.
- Identificar picos de moda efímeros vs tendencias sostenidas; detectar estacionalidad (ej. viajes verano, fitness enero) y compararlo contra el mismo periodo del año anterior cuando exista histórico.
- El ranking no debe premiar titulares duplicados de una sola noticia.
- Permitir seguir una keyword/sector y guardar consultas.

### 2.7 Oportunidades — «¿Qué construimos en 21 días?»
- Cargar 55 ideas iniciales desde Excel. Editables, filtrables y exportables.
- 4 filtros **obligatorios B2B**:
  1. Uso al menos varias veces por semana en el segmento objetivo.
  2. Ahorra tiempo, genera ventas o reduce pérdida económica medible.
  3. Comprador identificable y contactable.
  4. Se puede probar voluntad de pago **antes** de construir.
- Mostrar separado `legacy_score` (puntuación original del Excel), `evidence_score` (nuevo) y `build_score` (viabilidad), con pesos editables, logs de cambios y penalización por ausencia de datos.
- Nunca marcar «VALIDADO» por tener score alto. Estados: Idea → Evidencia insuficiente → Entrevistas → Demo → Piloto pagado → Repetición de pago → Listo para escalar.
- Para juegos B2C, señalar **excepción explícita** al filtro de comprador directo y al ahorro económico; evaluar en su lugar diversión, repetición D1/D7, distribución, conversión, IAP y coste de adquisición. No mezclar juegos y B2B en un único ranking como si cumplieran los mismos cuatro requisitos.
- Cada ficha: problema, buyer persona, evidencia, productos comparables, precio objetivo, modelo, coste variable, MVP 14–21 días, dificultad, canal de captación, experimento de preventa, regla de abandono y fuentes.
- Ficha `Investigación con REA/Craft Anything`: URL oficial del competidor, funcionalidades observables, puntos débiles publicados, evaluación de su stack si es legítima, y briefing para desarrollar una solución original. No clon automático ni ingeniería inversa intrusiva.

### 2.8 Competidores y empresas que facturan
- Ficha con empresa, web, producto, país, precio/plan público, monetización, buyer persona, fuentes y fecha de revisión.
- Campo facturación con **tipo de prueba**: cuentas públicas, verificación externa fiable, declaración del fundador, estimación de terceros, desconocida. Período exacto (MRR, ARR, ingresos 30d, facturación anual) y moneda original.
- **No convertir** una cifra de ingresos de un mes a ARR salvo en una simulación etiquetada.
- Botón «Comparar con nuestra propuesta»: qué hace, qué no podemos verificar, por qué paga alguien, diferenciación legal posible, si se puede construir en 21 días.
- Tabla comparativa por funcionalidades/pain points y niveles de precios.

### 2.9 Inversores, incubadoras y Silicon Valley
- Fuentes oficiales y públicas: directorio y RFS de Y Combinator, páginas de portafolio de fondos, anuncios de rondas, SEC EDGAR cuando corresponda, Startup Genome, noticias y programas españoles (ENISA/CDTI cuando publiquen información).
- Distinguir obligatoriamente: `RFS / tesis inversora`, `empresa admitida en incubadora`, `ronda anunciada`, `ronda documentada`, `importe comprometido`, `desembolso`, `contrato público`. No equivalen entre sí.
- Gráfica por vertical y trimestre **solo de los eventos con datos** y con cobertura explícita (no cuota total del VC si el dataset es parcial).
- Cards: quién invierte, en qué empresa, sector, país, fase, importe divulgado o `No publicado`, fecha de anuncio, enlace. Comparación España vs EE. UU. por señales, no por totales incompatibles.
- Pestaña «¿qué observa Silicon Valley?» con resúmenes semanales comprobables, distinguiendo hype y dinero ejecutado.

### 2.10 Pronósticos 30/90/180/365 días
- No ofrecer predicciones sin histórico suficiente. Introducir categorías: **observado**, **señal temprana** y **escenario prospectivo**.
- Para cada serie: n observaciones, frecuencia, cobertura, estacionalidad, cambios respecto a baseline, intervalo de incertidumbre y validación histórica (`backtest`).
- Métodos iniciales simples: medias móviles, medianas robustas, tasas de cambio, EWMA, desestacionalización solo con ciclos suficientes. Probar un forecast sencillo y compararlo con `naive seasonal / naive persistence` mediante `walk-forward backtesting`. Si no mejora baseline o no hay muestra suficiente, ocultar forecast y mostrar `insuficiente evidencia`.
- No fabricar probabilidades porcentuales ni recomendar inversiones financieras. Mostrar **candidatos de producto para entrevistar**, no «negocios seguros para 2027».

### 2.11 Importación JSON/JSONL/XLSX y fuentes
- Arrastrar archivos JSON, JSONL/NDJSON, CSV y XLSX; previsualizar mapeo, advertencias y conflictos antes de confirmar.
- JSONL por streaming/líneas; aceptar arrays de JSON, objetos individuales y estructuras anidadas con asistente de mapeo. Tratar contenido como datos no fiables; no ejecutar código ni instrucciones recibidas en archivos.
- Tipos de entrada: `sector_metric`, `trend_observation`, `company`, `pricing_observation`, `funding_event`, `demand_signal`, `opportunity`, `app_signal`, `game_signal`, `source_event`.
- Reglas de validación con Zod/Pydantic; límite de tamaño, comprobación MIME y extensión, transacciones, vista previa de 20 registros, reportes de errores por línea, cuarentena de rechazados, importación parcial segura, SHA-256 para idempotencia y deduplicación lógica.
- No bloquear la aplicación por un JSONL mal formado. Los registros con campos desconocidos van a una estructura `raw_payload` privada y no se muestran como datos verificados.
- Ver importaciones históricas con fecha, archivo, hash, filas aceptadas/rechazadas, estado y botón «Descargar errores».
- Exportar el resultado filtrado a XLSX, CSV, JSON y JSONL, preservando fuentes, unidades y fechas. Añadir hoja `Metodología` y `Fuentes` al Excel exportado.

---

## 3. FUENTES REALES PRIORITARIAS Y CONECTORES

Implementa catálogo `source_registry` con: nombre, URL documentación, ámbito, licencia/condiciones, API o RSS, auth requerida, frecuencia real, periodicidad del dato, tasa límite, último fetch, último dato publicado, error, estado activo/inactivo y coste. **Investiga antes de habilitar, no asumas que toda página es scrapeable o que todas las APIs son públicas.**

**Fase 1 — Implementar primero con fuentes autorizadas/gratuitas:**

1. **INE (España)** — INEbase JSON/OpenAPI y descargas estructuradas; estadísticas empresariales, empleo y turismo cuando exista serie. Documentación: https://www.ine.es/OpenAPI/index.html y https://www.ine.es/dyngs/DAB/index.htm?cid=1099
2. **Eurostat** — Statistics API y SDMX, series comparables UE: https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-getting-started
3. **Banco Mundial** — Indicators API global: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
4. **TED / EU Procurement** — avisos y adjudicaciones (demanda pública explícita): https://docs.ted.europa.eu/api/latest/search.html
5. **GitHub REST** — actividad de repositorios, releases, issues públicos con rate limits: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
6. **Trendshift API** — investigar la API documentada y sus condiciones/credenciales: https://api.trendshift.io/docs y https://trendshift.io/signal . Si requiere autorización, mostrar estado `requiere credenciales` y fallback a Github REST con un método distinto, sin fingir que replica su ranking.
7. **Google Trends, «Tendencias actuales»** — exportación RSS oficial de tendencias; no equivale a volumen absoluto. La API oficial Google Trends está en programa alfa y no debe considerarse gratuita para todos: https://support.google.com/trends/answer/3076011 y https://developers.google.com/search/apis/trends
8. **Hacker News** — API pública / Algolia de búsqueda, cuando sus condiciones permitan el volumen requerido: https://github.com/algolia/hn-search
9. **Y Combinator** — directorio y «Requests for Startups»: https://www.ycombinator.com/companies y https://www.ycombinator.com/rfs/ . Una petición RFS no es una ronda de financiación. Puede utilizarse JSON comunitario de https://github.com/yc-oss/api solo etiquetado como `no oficial`, verificando licencias y procedencia.
10. **SEC EDGAR** — APIs oficiales para empresas/fondos que presentan documentación estadounidense; no convertir cualquier filing en inversión real: https://www.sec.gov/search-filings/edgar-application-programming-interfaces
11. **RSS oficiales de fondos y empresas** — solo fuentes autorizadas; extraer fechas y URL originales, evitar titulares repetidos.

**Fase 2 (dejar adaptadores y documentación, NO inventar conectividad):**
- Portal de contratación pública español / datos abiertos, según disponibilidad y licencia oficial.
- OCDE SDMX / EIC / ENISA / CDTI para datos complementarios.
- App Store: feeds RSS aprobados y otras fuentes expresamente permitidas. Apple restringe scraping de App Store; revisar sus normas: https://developer.apple.com/app-store/review/guidelines/
- Google Play: solo métricas propias mediante API autenticada; para competidores, información que pueda consultarse legalmente y datos aportados por usuario o fuentes licenciadas, NO suponer que existe API pública gratuita de descargas/ingresos de terceros.
- Dealroom, PitchBook, Sensor Tower, Similarweb, Crunchbase u otros: **no depender de sus APIs comerciales**. Guardar `requires_paid_access` e importación manual de informes obtenidos con derecho de uso.

**Herramientas de extracción cuando sea necesario y permitido:**
- Scrapy (spiders HTML, programación); Crawlee+Playwright (JS dinámico); Crawl4AI (extracción); Trafilatura (texto/metadata). Elige una por conector según necesidad; no las instales todas sin uso.
- Preferencia firme: API oficial / RSS / descarga abierta > HTML estático autorizado > navegador automatizado autorizado.
- Respetar robots, ToS, licencias, límites, `Retry-After`, User-Agent, caché, backoff y concurrency control. Nada de proxies para evadir límites, CAPTCHAs, logins ajenos o controles anti-bot. Nada de recolectar datos personales innecesarios.
- **Ghidra** (https://github.com/NationalSecurityAgency/ghidra) es ingeniería inversa de binarios, **NO scraping**. REA (https://github.com/morluto/rea) y Craft Anything (https://github.com/storytold/craft-anything) son herramientas de investigación funcional; su uso pertenece al laboratorio de competidores y es opcional, nunca al pipeline de datos de mercado.

---

## 4. MODELO DE DATOS, TRAZABILIDAD Y CALIDAD

Diseña esquema SQL/migraciones al menos con:

`data_sources`, `source_runs`, `source_documents`, `sector_definitions`, `sector_observations`, `trend_topics`, `trend_observations`, `demand_signals`, `companies`, `company_products`, `pricing_observations`, `revenue_claims`, `funding_events`, `investors`, `investment_theses`, `opportunities`, `opportunity_evidence`, `opportunity_scores`, `validation_experiments`, `customer_contacts`, `imports`, `import_rejections`, `forecasts`, `forecast_backtests`, `user_settings`.

Campos en observaciones cuando correspondan: `id`, `external_id`, `source_id`, `source_url`, `source_license`, `observed_at`, `published_at`, `fetched_at`, `country`, `region`, `sector_code`, `sector_taxonomy`, `metric_name`, `value`, `unit`, `currency`, `period`, `sample_size`, `coverage`, `data_quality`, `claim_type`, `methodology_version`, `raw_payload`, `content_hash`.

Requisitos:
- Preservar fechas de publicación y de extracción por separado, y mostrar ambas.
- Series append-only o con revisión versionada: al corregir un dato no borrar el historial.
- Fichas con evidencia auditables y enlaces directos. Las afirmaciones generadas con IA sin cita quedan `draft`.
- Moneda original y conversiones FX solo con fuente, fecha y método explícitos.
- Políticas de obsolescencia por tipo de fuente: un dato anual puede seguir vigente aunque no cambie hoy; un feed diario sin actualizar es obsoleto.
- Dedupe: URL canónica + ID externo + fingerprint de documento + ventana temporal; guardar procedencia múltiple.
- Test de importación de 55 ideas y deduplicación de las diez hojas repetidas. Fallar CI si aparecen 80 por error.

### Scoring explicable, separado de scoring histórico

- El legacy score de los Excel se presenta intacto y etiquetado como evaluación previa.
- Para B2B, proponer `opportunity_score` de 0 a 100 basado en 4 criterios: frecuencia de uso (25%), ahorro/ingresos/pérdidas (30%), comprador accesible (20%), preventa testable (25%). **Hasta confirmar cada criterio, registrar evidencia y mostrar penalización por incertidumbre**.
- Añadir 3 metadimensiones independientes: saturación/competencia, costes de operar y riesgo de distribución. No sumar señales no homogéneas sin normalización.
- `market_evidence_score`: niveles claros (sin datos, una fuente, fuentes corroboradas, señales de pago, ventas propias) sin traducir arbitrariamente a «85% de éxito».
- Para juegos B2C crear score específico (diversión, repetición, canal, coste de adquisición, monetización no intrusiva), siempre etiquetado como modelo distinto.
- Permitir cambiar pesos y ver exactamente qué datos movieron el ranking.

### Detección de tendencias y alerta diaria

- Por fuente y categoría medir `observaciones_7d`, `observaciones_30d`, `observaciones_90d` y comparativas YoY **solo si existe histórico**.
- Movimiento robusto: mediana móvil, variación porcentual si denominador >0, z-score robusto o IQR, y persistencia del cambio. Separar tendencia estable de pico viral.
- Para términos Google Trends aclarar índice normalizado y muestreo/cobertura. Para GitHub aclarar que actividad técnica no es gasto B2B. Para YC aclarar que su tesis no es inversión ejecutada.
- Confirmación cruzada: etiquetar «convergencia» solo si hay >=2 familias de fuentes independientes y al menos una señal de demanda, gasto o compra; de lo contrario «interés temprano».
- El informe diario debe explicar **qué cambió frente a ayer/última semana, con fecha y enlace**, y no repetir titulares idénticos.

---

## 5. AUTOMATIZACIÓN REAL: EJECUTAR DIARIAMENTE E IMPORTAR JSON/JSONL

**Quiero dos vías que funcionen de verdad:**

### A. Actualización automática de fuentes
- Crear `.github/workflows/market-intelligence-daily.yml` con `schedule` diario y `workflow_dispatch` manual. Objetivo de ejecución: alrededor de las **09:00 hora Europe/Madrid**; GitHub Actions cron usa UTC y puede retrasarse. Resolver horario de verano sin dos informes: programar a las 07:00 y 08:00 UTC y comprobar en el script si son las 09:00 locales; registrar `run_key=YYYY-MM-DD-Europe/Madrid` e impedir duplicados por transacción.
- Flujo: verificar secretos/configuración → fetch de fuentes habilitadas → validar → guardar snapshots → comparar con ayer → recalcular señales y score → generar digest → registrar resultados y errores.
- Job resiliente: si cae Trendshift no borrar datos de INE; preservar última lectura válida, marcar `error/obsoleto`, reintentos con backoff y métricas de ejecución. Informar duración, fuentes activas/fallidas, nº nuevos cambios y fecha.
- Si no se configuran credenciales de hosting, debe funcionar localmente mediante `make ingest`/`npm run data:sync` y producir artefacto JSON de salida; el despliegue conectado exige autorización del propietario.

### B. Ingesta de archivos propios
- Vista `/importaciones`: subir `*.json`, `*.jsonl`, `*.ndjson`, `*.csv` o `*.xlsx` desde el navegador. Parseo, preview, mapping, validar, importar y refrescar gráficos. Sin necesidad de ejecutar un script manual.
- **Importación automática de archivos añadidos al repositorio:** incluir carpeta `data/imports/inbox/`; workflow con evento `push` sobre esa ruta además de cron y `workflow_dispatch`. Leer archivos nuevos, deduplicar por SHA y guardar en BD. Mover/archivar lógicamente procesados para no repetir; no reescribir compulsivamente el repo ni hacer commits en bucle.
- **Importación diaria sin acción manual:** los conectores recopilan datos por sí mismos. Un archivo local en mi Mac **no aparece mágicamente en la web**: para automatizarlo habrá que subirlo por la UI, hacer commit a inbox, o instalar/configurar una integración explícita en fase posterior (Google Drive, carpeta local sync, etc.). No fingir que hay permisos para leer carpetas remotas.
- Añadir script de conversión JSONL y una muestra `data/examples/sample_signals.jsonl` bien etiquetada como `DEMO` para verificar end-to-end.
- Configurar autenticación single-user: en local modo desarrollo, en remoto login privado (preferentemente proveedor ya usado por el proyecto) + autorización server-side para subir/ver archivos. Nunca exponer prompts, logs, tokens ni JSONL privados públicamente. Limitar peso de archivos, validar formatos y prevenir SSRF/XSS/CSV injection al mostrar/exportar datos.
- Cron no debe publicar automáticamente al público datos de investigaciones privadas ni realizar envíos de correo no configurados. El estado debe verse en la web.

**Formato recomendado de señal canónica (aceptar otros formatos mediante mapping):**

```json
{
  "schema_version": "1.0",
  "record_type": "trend_observation",
  "topic": "computer-vision-on-device",
  "source_name": "GitHub API",
  "source_url": "https://github.com/topics/computer-vision",
  "observed_at": "2026-11-18T08:00:00Z",
  "country": "global",
  "metric_name": "public_repositories_matched",
  "value": 0,
  "unit": "repositories",
  "claim_type": "demo",
  "notes": "EJEMPLO DE ESQUEMA, NO DATO OBSERVADO"
}
```

El `value: 0` del ejemplo es una muestra estructural, no una medición real. Nunca debe aparecer en el dashboard de producción como observación de mercado.

---

## 6. EXPORTACIONES Y SIMULADORES

- Botón persistente `Descargar Excel` en sectores, tendencias, empresas, inversiones y oportunidades.
- Exportar filtros tal como los ve el usuario, sin perder unidades, fechas o URL de fuente.
- Workbook de salida con `Resumen`, `Datos`, `Fuentes`, `Metodología`, `Avisos`, indicando cuántos registros son observados, estimados o hipótesis.
- Simulador independiente por modelo: SaaS MRR = clientes de pago × precio; licencias = unidades vendidas × ticket (NO MRR); apps freemium = altas × conversión × ticket y cohortes; ads = DAU × impresiones por usuario al día × días × eCPM / 1000; IAP = número de compras × ticket; margen = ingresos netos – comisiones – costes variables – infraestructura. Inputs editables, jamás presentados como hechos.
- CSV/JSON/JSONL siempre disponibles sin licencias de pago.

---

## 7. UX «PARA TONTOS», PERO PRODUCTO PROFESIONAL

- Primera pantalla debe responder «¿Qué ha cambiado?», «¿Hay dinero?», «¿Podemos construirlo?».
- Microcopys explícitos: `Cambio semanal`, `Volumen comprobado`, `Estimación`, `Sin dato público`, `Qué significa`, `Acción sugerida`.
- Comparación visual tipo semáforo **solo** para estados raros e importantes (fuente caída, validación confirmada), no un carnaval de badges.
- Gráficos de líneas para series, barras para comparación homogénea, heatmap para sector×señal, dispersión para `facilidad vs valor`, tarjetas para recomendaciones con evidencias. Las recomendaciones NUNCA reemplazan los datos.
- Responsive real 360–1440 px, tooltips accesibles, teclado, dark mode, estados loading/error/empty y búsqueda global.
- Modo `Demo` explícito para ver pantallas con datos de ejemplo; modo `Real` utiliza solo datos auténticos. Nunca mezclar los dos.

---

## 8. ORDEN DE IMPLEMENTACIÓN (NO CONSTRUIR TODO A MEDIAS)

**Sprint MVP obligatorio:**
1. Auditoría Excel + importador de 55 ideas sin duplicados + esquema de BD + seed.
2. Dashboard real de `Inicio`, `Sectores`, `Oportunidades`, `Empresas`, `Fuentes`, `Importaciones` con exportación XLSX.
3. Tres conectores reales prioritarios y estables: INE, GitHub y TED o Eurostat (elige los 3 según disponibilidad; documenta por qué). Añadir Trendshift API **si funciona con acceso autorizado**; en caso contrario usar Github y mostrar estado real.
4. Serie temporal, tendencia 7/30/90d cuando haya historial, comparación con datos del Excel, score explicable y enlaces.
5. Workflow diario robusto + ingestión manual JSON/JSONL + inbox automático con tests.
6. Calidad: unit/e2e, seguridad mínima, responsive, documentación, runbook, instrucciones de despliegue, `env.example`.

**Segunda etapa (estructura y placeholders honestos si no cabe en 21 días):** Apps/juegos por país, portfolio de inversores, YC, informes diarios avanzados, pronósticos con backtesting, alertas y más conectores. Si puedes construirlos completos y con pruebas sin comprometer la calidad del MVP, hazlo. **No presentes un módulo sin datos como terminado**.

---

## 9. CRITERIOS DE ACEPTACIÓN OBJETIVOS

No consideres terminado el proyecto hasta poder demostrar lo siguiente:

1. Inicia localmente con instrucciones claras y DB migrada, sin un servicio SaaS de pago obligatorio.
2. Importa ambos `.xlsx` y aparecen exactamente **55 oportunidades únicas**; las hojas comunes no duplican entradas. Se conservan `legacy_score`, URL y procedencia.
3. Los sectores originales no se suman ni comparan indebidamente; la UI advierte si las métricas no son homogéneas.
4. Al menos tres fuentes reales conectadas y con fecha de respuesta válida, o un bloqueo documentado y fallback fiable sin datos inventados. Verifica cada conector con un test/fixture de respuesta de origen.
5. Los datos reales tienen fuente y fecha; un dato sin fuente aparece como hipótesis o se excluye del ranking de evidencia.
6. Importar un JSONL válido genera nuevas observaciones visibles; repetir el mismo archivo no duplica los registros; uno defectuoso produce reporte por línea sin bloquear todo.
7. Los exports `.xlsx` se abren, incluyen valores coherentes, hoja de fuentes y fechas; no hay celdas peligrosas interpretadas como fórmulas a partir de entradas de usuario.
8. La tarea diaria se puede ejecutar con `workflow_dispatch` y localmente; registra una única ejecución lógica por día Madrid aunque el cron se lance dos veces UTC.
9. El flujo `push` al inbox procesa sólo archivos nuevos y no publica datos privados.
10. Un gráfico de tendencia no inventa crecimiento cuando solo existe un punto; pronóstico muestra `Sin datos suficientes` sin histórico/backtest válido.
11. Distingue un plan de precio de un dato de facturación, una ronda anunciada de inversión cerrada y unas estrellas GitHub de compradores.
12. `typecheck`, `lint`, unit tests y e2e esenciales pasan; pruebas visuales en móvil y escritorio.

---

## 10. ENTREGABLES Y REPORTE FINAL DE CODEX

En el repo, entregar código funcional, migraciones, scripts de ingesta, workflow, tests y documentación:

- `README.md` (instalación exacta, demo local, variables de entorno, limitaciones).
- `AGENTS.md` (convenciones del agente, normas de datos/evidencia, seguridad, testing).
- `ARCHITECTURE.md` (diagrama y responsabilidades de servicios).
- `docs/AUDITORIA_EXCEL.md`, `docs/FUENTES_Y_LICENCIAS.md`, `docs/METODOLOGIA_Y_SCORING.md`, `docs/PLAN_21_DIAS.md`, `docs/OPERACION_CRON.md`.
- `.env.example` sin secretos, migraciones, scripts, workflow y fixtures.
- Ejemplo JSONL compatible, endpoints de importación, tests de XLSX/exportaciones.
- Si configuras una demo pública, no publicar secretos ni registros privados. No desplegar ni modificar repos remotos sin autorización del usuario.

**Tu respuesta final debe contener:** funciones implementadas y comprobadas; lista de fuentes realmente conectadas vs pendientes; comandos ejecutados y resultado; pasos para correr local y desplegar; configuraciones requeridas; costes estimados diferenciando gratuitos y opcionales; limitaciones reales; capturas o reporte de validación visual; checklist de aceptación marcado.

**No me entregues una web vacía con gráficos inventados. Prefiero 3 conectores sólidos y 6 pantallas terminadas que 15 paneles decorativos. Comienza auditando los Excel y ejecuta.**
