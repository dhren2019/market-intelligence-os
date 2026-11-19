# Decision Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir una capa visual de decisión y activar Tecnología, Apps, Inversores, Alertas y Forecasts con datos reales o estados explícitamente insuficientes.

**Architecture:** Mantener la UI existente y añadir funciones puras de decisión sobre oportunidades, fuentes, observaciones, financiación y backtests. Las páginas server-side consumen esas funciones desde las consultas actuales; Tecnología se añade como definición auditada sin duplicar las 55 oportunidades.

**Tech Stack:** Next.js 16, React 19, TypeScript, Drizzle, PGlite, Vitest y Playwright.

**Spec:** `docs/superpowers/specs/2026-11-18-decision-center-design.md`

## Global Constraints

- No modificar el lenguaje visual existente.
- No presentar `legacy_score` como probabilidad o evidencia.
- No publicar forecasts sin backtest que supere baseline.
- No inferir inversión, ingresos o ventas desde precios, competidores o actividad técnica.
- Conservar exactamente 55 oportunidades únicas.

## Review Focus

- Una oportunidad sin score debe quedar fuera de prioridades, no recibir cero implícito.
- Un solo punto temporal no debe producir alerta de cambio ni forecast.
- La ausencia de eventos de financiación debe verse como cobertura cero, no como cero inversión.
- Tecnología no debe mostrar una magnitud económica inventada ni sumarse a los sectores INE.
- El responsive debe mantener navegación y tarjetas legibles a 360 px.

---

### Task 1: Decision models

**Files:**
- Create: `src/domain/decision-center/model.ts`
- Test: `tests/unit/decision-center.test.ts`

**Interfaces:**
- Produces: `buildValidationQueue`, `buildAlertSummary`, `buildForecastReadiness`, `buildInvestorCoverage`.

- [ ] Escribir pruebas fallidas para orden, ausencia de score, alertas sin comparables, forecast sin backtest y cobertura de inversión vacía.
- [ ] Ejecutar `pnpm test tests/unit/decision-center.test.ts` y confirmar fallos por módulo ausente.
- [ ] Implementar las funciones puras con estados y etiquetas explícitos.
- [ ] Ejecutar la prueba y confirmar que pasa.

### Task 2: Technology reference and dashboard queries

**Files:**
- Create: `data/imports/seed/tecnologia_sector_importado.json`
- Modify: `src/domain/reference/repository.ts`
- Modify: `src/db/schema.ts`
- Modify: `src/domain/dashboard/queries.ts`
- Modify: `tests/unit/reference-seed.test.ts`

**Interfaces:**
- Consumes: funciones de Task 1.
- Produces: `getDecisionCenterData`, `getAppsData`, `getInvestorData`, `getAlertsData`, `getForecastData`.

- [ ] Cambiar primero la prueba de referencias para exigir seis ámbitos con Tecnología no comparable.
- [ ] Ejecutarla y observar el fallo 5 != 6.
- [ ] Añadir la referencia tecnológica auditada y tipos Drizzle ya presentes en la migración inicial.
- [ ] Añadir consultas derivadas para los cinco módulos.
- [ ] Ejecutar unitarias afectadas y confirmar que pasan.

### Task 3: Visual modules and navigation

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/sectores/page.tsx`
- Modify: `src/components/app-shell.tsx`
- Modify: `src/app/globals.css`
- Create: `src/app/apps/page.tsx`
- Create: `src/app/inversores/page.tsx`
- Create: `src/app/alertas/page.tsx`
- Create: `src/app/forecasts/page.tsx`
- Modify: `tests/e2e/dashboard.spec.ts`

**Interfaces:**
- Consumes: consultas de Task 2.
- Produces: páginas accesibles con la misma identidad visual.

- [ ] Añadir primero pruebas e2e para la cola visual, Tecnología y las cuatro rutas.
- [ ] Ejecutar Playwright y observar las rutas/encabezados ausentes.
- [ ] Implementar páginas, navegación y estilos con tokens existentes.
- [ ] Ejecutar e2e en escritorio y móvil y confirmar que pasa.

### Task 4: Documentation and verification

**Files:**
- Modify: `README.md`
- Modify: `docs/METODOLOGIA_Y_SCORING.md`
- Modify: `docs/AUDITORIA_EXCEL.md`

**Interfaces:**
- Consumes: comportamiento final.
- Produces: limitaciones y uso reproducibles.

- [ ] Documentar los cuatro módulos y la separación entre recomendación de validación y recomendación financiera.
- [ ] Ejecutar `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` y `pnpm test:e2e`.
- [ ] Revisar visualmente portada y rutas nuevas a anchura normal y móvil.

