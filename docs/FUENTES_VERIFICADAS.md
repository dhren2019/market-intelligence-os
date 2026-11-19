# Fuentes, herramientas y límites contrastados (18 de noviembre de 2026)

| Fuente / herramienta | Enlace | Uso correcto | Límite que debe reflejar la interfaz |
|---|---|---|---|
| INE OpenAPI | https://www.ine.es/OpenAPI/index.html | Series oficiales españolas | Diferentes tablas, frecuencias, unidades y revisión estadística |
| INE JSON | https://www.ine.es/dyngs/DAB/index.htm?cid=1099 | Estadísticas económicas y coyunturales | Varias series no son comparables ni actualizan cada día |
| Eurostat | https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-getting-started | UE y comparativas armonizadas | Comprobar dataset, versión y unidades |
| Banco Mundial Indicators | https://datahelpdesk.worldbank.org/knowledgebase/articles/889392 | Series comparables internacionales | Muchos indicadores son anuales o tienen rezago |
| TED Search API | https://docs.ted.europa.eu/api/latest/search.html | Licitaciones y contrataciones publicadas UE | Licitación no equivale a adjudicación o compra privada |
| GitHub API | https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api | Actividad de proyectos open source | Estrellas/forks/issues no son ingresos ni compradores |
| Trendshift API | https://api.trendshift.io/docs | Rankings técnicos diarios/semanales/mensuales | Verificar autorización, límites y condiciones antes de usar |
| Google Trends RSS | https://support.google.com/trends/answer/3076011 | Búsquedas que despuntan ahora | No es un volumen absoluto ni toda la demanda del mercado |
| Google Trends API alpha | https://developers.google.com/search/apis/trends | Series históricas si el usuario dispone de acceso | Acceso limitado por programa alpha; no asumir API abierta |
| YC RFS | https://www.ycombinator.com/rfs/ | Tesis públicas de incubadora | Ideas que interesan a YC, no inversiones ejecutadas |
| YC Directory | https://www.ycombinator.com/companies | Empresas de batches | Aceptación ≠ facturación ni ronda concreta |
| YC OSS API (no oficial) | https://github.com/yc-oss/api | Dataset auxiliar a comprobar | Procedencia no oficial, respetar condiciones y licencias |
| SEC EDGAR APIs | https://www.sec.gov/search-filings/edgar-application-programming-interfaces | Hechos documentados en filings | No confundir eventos de filing y desembolsos |
| Hacker News / Algolia | https://github.com/algolia/hn-search | Conversaciones públicas tecnológicas | Sesgo de comunidad, no cuota de mercado |
| RevenueCat State of Subscription Apps 2026 | https://www.revenuecat.com/state-of-subscription-apps | Benchmark sectorial de suscripciones | Benchmark agregado, NO datos financieros por competidor |
| Apple App Review Guidelines | https://developer.apple.com/app-store/review/guidelines/ | Normas para datos de App Store | Prohíbe scraping de propiedades Apple; usar feeds autorizados |
| Scrapy | https://github.com/scrapy/scrapy | Crawlers HTML autorizados | La licencia OSS de Scrapy no permite violar ToS de websites |
| Crawlee | https://github.com/apify/crawlee | Crawlers y automatización web autorizados | Controlar políticas, rate limits y recursos |
| Playwright | https://playwright.dev/ | Navegación automatizada permitida y tests | No usar para evadir barreras anti-bot o login |
| Crawl4AI | https://github.com/unclecode/crawl4ai | Extractor open source de páginas | Separar extracción de inferencia LLM; sin scraping indiscriminado |
| Trafilatura | https://github.com/adbar/trafilatura | Extracción de texto y metadatos | Se requiere confirmar permisos de la fuente |
| Ghidra | https://github.com/NationalSecurityAgency/ghidra | Ingeniería inversa de software autorizada | NO es scraping ni API de mercado |
| REA | https://github.com/morluto/rea | Inspección técnica autorizada de productos | No reutilizar material protegido ni acceso intrusivo |
| Craft Anything | https://github.com/storytold/craft-anything | Estudio funcional y prototipos independientes | Modo clean room; no asumir fidelidad perfecta ni licencia ajena |
| Dealroom | https://dealroom.co/faq/ | Estudio del mercado VC (cuando hay licencia) | Sus exports y API completos requieren plan de pago; no dependencia MVP |

**Política de evidencia:** los resultados históricos de los Excel se importan como `legacy`, no como señal actual. Todas las mediciones nuevas requieren URL, fecha, unidad, geografía, tipo de evidencia y calidad. Si no existen, deben quedar como hipótesis o sin datos.
