# Market Intelligence OS — Radar visual (España y mundo)

**Sitio público:** https://dhren2019.github.io/market-intelligence-os/

**Ramas**
- `main`: base del repositorio, no alterada tras la inicialización.
- `feat/radar-productos-demanda-real`: código fuente de esta edición visual (`docs/index.html`), dataset curado (`docs/data/daily-research.json`).
- `gh-pages`: la versión publicada (`index.html`, `data/daily-research.json`) y workflow de GitHub Pages.

## Qué permite hacer
- Explorar los 5 sectores económicos base y 55 ideas importadas de Excel.
- Analizar Apps móviles, juegos (con ranking y subgéneros), SaaS/agentes, programas PC y herramientas web/dev.
- Comparar indicadores reales publicados por Sensor Tower, AppMagic, G2, Gartner y fuentes oficiales, con año, unidad y enlace.
- Investigar empresas, modelos de monetización, compradores, pruebas comerciales y MVPs.
- Filtrar ideas, abrir fichas, exportar CSV/JSONL e importar JSON/JSONL localmente.
- Mostrar señales verificadas desde `data/daily-research.json`. La automatización ChatGPT las actualiza en `gh-pages` solo cuando encuentra fuentes nuevas fiables.

## Importante
- Esta **es una edición estática publicable**, no la copia íntegra del backend Next.js/PGlite del ZIP de trabajo. GitHub Pages no ejecuta endpoints Next.js ni una base Postgres. Para integrar importación persistente, cron robusto y análisis avanzado en servidor, habrá que migrar aquel backend y desplegarlo en un servicio compatible.
- Google Trends: no se presenta un índice de tendencia sin serie histórica, país y método de extracción. Trendshift y GitHub aportan señales tecnológicas pero no prueban demanda pagada.
- Un ranking de ingresos de apps grandes no es una predicción de ingresos para un desarrollador independiente.
- No se afirma que las hipótesis de los Excel sean ventas observadas; todo supuesto se distingue de los datos publicados.

## Dónde editar
- `docs/index.html` en la rama de desarrollo. Para la web pública hay que replicar el cambio a `gh-pages/index.html`.
- `gh-pages/data/daily-research.json`: JSON servido por GitHub Pages, con `schemaVersion`, `updatedAt` y array `items`.
- `.github/workflows/publish-pages.yml` en `gh-pages`: cada push publica el sitio.

## Fuentes primarias y contexto
- https://sensortower.com/blog/state-of-mobile-2026
- https://gameindustrylibrary.com/documents/casual-games-report-h1-2026-growth-beneath-the-still-surface
- https://sell.g2.com/g2-2026-ai-agents-insight-report
- https://www.gartner.com/en/newsroom/press-releases/2026-07-01-gartner-says-us-dollars-234-billion-in-enterprise-application-software-spend-is-at-risk-from-agentic-artificial-intelligence
- https://www.ycombinator.com/rfs
- https://api.trendshift.io/docs
