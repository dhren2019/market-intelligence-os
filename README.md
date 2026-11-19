## Market Intelligence OS — actualización visual noviembre 2026

**Esta es la aplicación Next.js original del ZIP**, ampliada con mercados, datos y fichas visuales (no un clon HTML). Ver [docs/PUBLICACION_Y_DATOS.md](docs/PUBLICACION_Y_DATOS.md).

- Frontend original: `src/app`, `src/components`, `src/domain`, `drizzle`, `scripts`, `tests`.
- Categorías visuales: `/mercados` y rutas `/mercados/[slug]`.
- Proyección pública React con mismos componentes/tokens: `web/`; GitHub Pages no ejecuta API de Next.js.
- Build público: `npm install --prefix web && npm run build --prefix web`.
- Las importaciones persistentes y el cron del ZIP necesitan backend y base remota para desplegarse en producción.

---

# Market Intelligence OS

MVP privado y local para priorizar oportunidades de microproducto con evidencia trazable. El sistema importa exactamente 55 oportunidades canónicas, separa observaciones, proxies, estimaciones, hipótesis y predicciones, sincroniza tres fuentes públicas y permite importar/exportar datos sin depender de una API de pago.

## Qué funciona

- Diez vistas operativas: Inicio, Sectores, Oportunidades, Apps, Inversores, Alertas, Forecasts, Empresas, Fuentes e Importaciones.
- Catálogo inicial idempotente de 55 oportunidades: 25 sectoriales y 30 tecnológicas. Las diez hojas repetidas no se duplican.
- Persistencia PostgreSQL local con PGlite y migraciones SQL.
- Importación desde navegador y CLI de JSON, JSONL, NDJSON, CSV y XLSX: límite de 5 MB, preview de 20 filas, Zod, error por línea, importación parcial, transacción y SHA-256.
- Exportación XLSX con oportunidades, sectores, observaciones, fuentes, inversión, forecasts, backtests, metodología e importaciones; también CSV, JSON y JSONL.
- Conectores reales para INE, Eurostat y GitHub con timeout, backoff, rate-limit, snapshots e idempotencia.
- Cola visual de validación: indica qué idea investigar primero, qué hacer y cuándo parar. Su orden reproduce `legacy_score`; no es consejo financiero.
- Tecnología como sexto ámbito: 30 oportunidades en cinco líneas, sin inventar una magnitud económica comparable a los sectores INE.
- Tendencias y alertas 7/30/90 solo cuando existe un punto próximo a la ventana. Forecasts se ocultan sin histórico y backtest superior al baseline.
- GitHub Actions diario, `workflow_dispatch` e importación automática del inbox.
- Autenticación single-user en ejecución remota mediante `MIO_ADMIN_TOKEN`; desarrollo local abierto.
- Tema claro/oscuro y responsive comprobado en 390 px y 1440 px.

## Requisitos y arranque local

- Node.js 22 LTS.
- pnpm 11 mediante Corepack.

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm db:migrate
pnpm db:seed
pnpm data:sync
pnpm dev
```

Abrir `http://localhost:3000`. `pnpm data:sync` consulta servicios públicos y requiere acceso a Internet; el dashboard arranca sin esa sincronización y muestra un estado vacío honesto.

Comprobación completa:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Playwright necesita Chromium una vez: `pnpm exec playwright install chromium`.

## Operación

| Comando | Función |
| --- | --- |
| `pnpm db:migrate` | Aplica migraciones pendientes. |
| `pnpm db:seed` | Inserta 55 oportunidades, 5 sectores económicos, 1 ámbito tecnológico y 43 empresas sin duplicar. |
| `pnpm data:sync` | Ejecuta INE, Eurostat y GitHub manualmente. |
| `pnpm data:daily` | Ejecuta una sincronización lógica diaria por fecha Madrid. |
| `pnpm data:inbox` | Procesa los archivos admitidos de `data/imports/inbox/`. |
| `pnpm dev` | Inicia el dashboard en desarrollo. |

La base local está en `data/mio-data/` y no se versiona. Haz copia de esa carpeta con la aplicación parada si necesitas conservar un snapshot fuera del equipo.

## Variables de entorno

- `MIO_DATA_DIR`: ruta de la base PGlite. Por defecto `data/mio-data`.
- `GITHUB_TOKEN`: opcional; amplía los límites de GitHub Search. Nunca se expone al cliente.
- `MIO_ADMIN_TOKEN`: obligatorio para acceso remoto/producción. En local no se solicita.

## Despliegue, sin ejecutarlo

El proyecto no ha sido desplegado ni se ha publicado ningún dato. El build es `pnpm build` y el arranque `pnpm start`. La configuración actual requiere un servidor Node con volumen persistente para PGlite; no es apta tal cual para un filesystem efímero/serverless. Para producción multiinstancia debe añadirse un adaptador PostgreSQL remoto y migración de datos antes de desplegar.

Pasos mínimos para un servidor privado de una sola instancia:

1. Proporcionar Node 22, HTTPS y un volumen persistente montado en `MIO_DATA_DIR`.
2. Definir un `MIO_ADMIN_TOKEN` largo y aleatorio y, opcionalmente, `GITHUB_TOKEN`.
3. Ejecutar `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm db:migrate` y `pnpm start`.
4. Restringir el acceso de red y verificar backups/restauración antes de cargar datos privados.

## Coste

- Local, PGlite, INE y Eurostat: gratuitos.
- GitHub API: gratuita dentro de sus cuotas; token opcional.
- GitHub Actions: usa la cuota incluida del repositorio y conserva artefactos 14 días; los excesos dependen del plan de GitHub.
- Hosting, disco persistente y PostgreSQL remoto: opcionales y no contratados.
- Fuentes comerciales como PitchBook, Dealroom, Sensor Tower o Similarweb: deshabilitadas; cualquier licencia sería un coste externo.

## Límites honestos

- No hay ventas, entrevistas, contratos, facturación ni TAM verificados en los Excel. El dashboard no los estima.
- Las 55 ideas y sus scores son hipótesis/`legacy_score`, no un ranking basado en nueva evidencia.
- Empresas y precios heredados del Excel no se promueven a facturación.
- Apps está activo como catálogo de hipótesis tecnológicas. No contiene ventas o usuarios verificados.
- Inversores está activo y muestra cobertura cero hasta importar eventos documentados. Ausencia de datos no equivale a cero inversión.
- Alertas está activo para fallos de fuentes y cambios con histórico comparable.
- Forecasts está activo como control de preparación; no publica valores futuros hasta que un modelo supere el baseline en backtest.
- YC y TED completo continúan pendientes de conectores y datos autorizados.
- El catálogo de ejemplo con `claim_type=demo` se conserva para probar imports y se excluye del modo real.

Consulta [ARCHITECTURE.md](./ARCHITECTURE.md), [auditoría](./docs/AUDITORIA_EXCEL.md), [metodología](./docs/METODOLOGIA_Y_SCORING.md) y [runbook](./docs/OPERACION_CRON.md).
