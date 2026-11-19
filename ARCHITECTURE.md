# Arquitectura

```text
Excel auditados ──> JSON canónico (55) ──> seed idempotente ─┐
Archivos usuario ─> preview/validación ──> import_records ────┼─> PostgreSQL/PGlite
INE / Eurostat / GitHub ─> adaptadores ─> observaciones ──────┘       │
                                                                     ├─> consultas / tendencias
GitHub Actions / CLI / Route Handlers ────────────────────────────────┤
                                                                     └─> Next.js UI + XLSX/CSV/JSONL
```

## Responsabilidades

- `src/db`: esquema Drizzle, cliente PGlite y migraciones SQL ordenadas.
- `src/domain/opportunities`: normalización y seed canónico de 55 oportunidades.
- `src/domain/imports`: parsing, validación, preview, cuarentena, transacción e idempotencia.
- `src/domain/connectors`: contrato común, política HTTP, INE, Eurostat, GitHub y persistencia.
- `src/domain/trends`: cambio observado con ventanas y tolerancias; nunca pronostica.
- `src/domain/exports`: XLSX/CSV/JSON/JSONL y neutralización de fórmulas.
- `src/domain/automation`: clave diaria Europe/Madrid y aislamiento de fallos.
- `src/app`: Server Components, Route Handlers y seis pantallas.
- `scripts`: los mismos servicios de dominio expuestos como CLI.

## Fronteras de confianza

Los valores aportados por usuario se conservan en `raw_payload`, se escapan al renderizar y se neutralizan al exportar a hojas de cálculo. Los conectores solo llaman a URLs constantes controladas por el código, por lo que un import no puede provocar SSRF. Tokens y prompts nunca se envían al navegador.

En desarrollo local la aplicación es abierta. En `NODE_ENV=production`, `src/proxy.ts` exige una cookie HttpOnly obtenida con `MIO_ADMIN_TOKEN` y bloquea también las rutas `/api/*`.

## Persistencia

PGlite ofrece semántica PostgreSQL sin Docker. El esquema ya incluye entidades de segunda etapa para no rehacer migraciones, pero la UI no presenta módulos sin datos como terminados. La instancia web y las CLI comparten `MIO_DATA_DIR`.

GitHub Actions recupera la caché PGlite más reciente, usa una clave nueva por ejecución y sube un artefacto privado. La clave lógica `daily:AAAA-MM-DD` impide dos ejecuciones del mismo día aunque existan dos cron UTC.
