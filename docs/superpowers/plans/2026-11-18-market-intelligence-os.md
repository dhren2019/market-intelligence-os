# Market Intelligence OS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el MVP local de Market Intelligence OS con 55 oportunidades deduplicadas, importación/exportación, tres conectores reales, tendencias honestas, seis pantallas y automatización diaria.

**Architecture:** Next.js y TypeScript estricto con servicios de dominio puros. Drizzle define PostgreSQL; PGlite ofrece un archivo local sin infraestructura y un adaptador permite `DATABASE_URL` remoto. La UI consulta datos reales del repositorio y de snapshots, nunca series inventadas.

**Tech Stack:** Next.js, React, TypeScript, Drizzle ORM, PGlite, Zod, ExcelJS, Recharts o SVG accesible, Vitest, Playwright, ESLint y GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-18-market-intelligence-os-design.md`

## Global Constraints

- Producto y documentación en español.
- No inventar métricas, empresas, facturación, demanda ni previsiones.
- Conservar `legacy_score` como evaluación previa y separar `observed`, `proxy`, `estimate`, `hypothesis`, `prediction` y `demo`.
- Importar exactamente 55 oportunidades iniciales; CI falla si aparecen 80.
- Sin despliegue, publicación ni commits, por instrucción explícita del usuario.
- La aplicación debe arrancar localmente sin una API comercial ni un LLM de pago.

## Review Focus

- El mismo archivo o registro repetido no crea duplicados.
- Un JSONL con una línea defectuosa importa las válidas y reporta la línea fallida.
- Una entrada que empieza por `=`, `+`, `-` o `@` no se convierte en fórmula al exportar.
- Una sola observación no genera crecimiento ni forecast.
- Magnitudes sectoriales incompatibles no se agregan ni se ordenan juntas como equivalentes.

---

### Task 1: Fundación, esquema y seed

**Files:** `package.json`, `src/db/*`, `drizzle/*`, `scripts/seed.ts`, `src/domain/opportunities/*`, tests unitarios.

**Interfaces:** produce `getDb()`, `migrateDatabase()`, `seedCatalog()` y `listOpportunities()`.

- [ ] Escribir tests que exigen 55 IDs únicos, 25 sectoriales, 30 tecnológicos y `legacy_score` no nulo.
- [ ] Ejecutarlos y confirmar fallo por ausencia de implementación.
- [ ] Crear el proyecto, esquema Drizzle, migración y adaptador PGlite/Postgres.
- [ ] Implementar el seed idempotente desde el JSON canónico y volver a ejecutar los tests.

### Task 2: Importador seguro y deduplicación

**Files:** `src/domain/imports/*`, rutas `/api/imports/*`, fixtures y tests.

**Interfaces:** produce `previewImport(input)` y `commitImport(input)` con hash, aceptados y rechazos por línea.

- [ ] Escribir tests para JSON, JSONL parcial, hash repetido, campos desconocidos y límite de tamaño.
- [ ] Verificar que fallan.
- [ ] Implementar parseo de JSON/JSONL/NDJSON/CSV/XLSX, Zod, preview de 20 y cuarentena.
- [ ] Verificar tests y transacciones idempotentes.

### Task 3: Conectores y series temporales

**Files:** `services/connectors/*`, `src/domain/trends/*`, `scripts/data-sync.ts`, fixtures y tests.

**Interfaces:** cada conector implementa `fetch(context): Promise<ConnectorResult>`; produce observaciones canónicas y un `source_run` aislado.

- [ ] Escribir tests de fixtures INE, Eurostat y GitHub y del caso 429.
- [ ] Escribir tests de tendencia: una observación devuelve `insufficient_data`; ventanas 7/30/90 solo usan histórico real.
- [ ] Verificar fallos.
- [ ] Implementar HTTP con timeout, User-Agent, ETag, rate-limit y backoff; normalización y snapshots append-only.
- [ ] Ejecutar tests y un smoke real de los tres endpoints.

### Task 4: Exportaciones

**Files:** `src/domain/exports/*`, `/api/exports/*` y tests.

**Interfaces:** produce `exportXlsx(records)`, `exportCsv`, `exportJson` y `exportJsonl`.

- [ ] Escribir tests para hojas `Resumen`, `Datos`, `Fuentes`, `Metodología`, `Avisos`, fechas y neutralización de fórmulas.
- [ ] Verificar fallos.
- [ ] Implementar exports con ExcelJS y filtros recibidos del servidor.
- [ ] Abrir de nuevo el XLSX en test y comprobar contenido.

### Task 5: Seis pantallas profesionales

**Files:** `src/app/*`, `src/components/*`, estilos y tests de componentes.

**Interfaces:** Inicio, Sectores, Oportunidades, Empresas, Importaciones y Fuentes consumen repositorios server-side.

- [ ] Escribir tests de clasificación visual y estados vacíos honestos.
- [ ] Verificar fallos.
- [ ] Construir el shell Wayfind, filtros, tablas, score separado, importación preview/confirm y botones de exportación.
- [ ] Implementar modo oscuro, navegación móvil, foco visible y tablas reordenadas en 360 px.

### Task 6: Automatización y operación

**Files:** `.github/workflows/market-intelligence-daily.yml`, `scripts/daily-run.ts`, `scripts/import-inbox.ts`, `Makefile` y tests.

**Interfaces:** `pnpm data:sync`, `pnpm data:daily`, `pnpm data:inbox` y `make ingest`.

- [ ] Escribir tests para `run_key` Europe/Madrid y doble cron 07:00/08:00 UTC.
- [ ] Implementar lock transaccional diario, errores por fuente y artefacto JSON privado.
- [ ] Validar el YAML y ejecutar las CLIs localmente.

### Task 7: QA, documentación y entrega

**Files:** Playwright, `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, `docs/METODOLOGIA_Y_SCORING.md`, `docs/PLAN_21_DIAS.md`, `docs/OPERACION_CRON.md`, `.env.example`.

- [ ] Ejecutar unitarios, integridad Python, typecheck, lint y build.
- [ ] Ejecutar e2e en escritorio y móvil, capturar Inicio, Oportunidades e Importaciones.
- [ ] Ejecutar Hallmark `sloplint --render`, corregir todos los FAIL y resolver los REFLEX.
- [ ] Releer los criterios de aceptación y documentar limitaciones, credenciales y costes opcionales.

## Self-review

El plan cubre los seis entregables MVP y deja módulos de segunda etapa fuera de la declaración de terminado. Los tipos y nombres de interfaces son consistentes entre tareas. Los cinco riesgos de Review Focus tienen un test asignado. Los commits se omiten porque el usuario prohibió realizarlos sin autorización.

