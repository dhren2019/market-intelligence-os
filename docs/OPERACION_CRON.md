# Operación diaria y runbook

## Horario

El workflow `.github/workflows/market-intelligence-daily.yml` se dispara a las 07:00 y 08:00 UTC. Una comprobación interna solo permite la ejecución programada a las 09:00 de `Europe/Madrid`, por lo que cubre CET y CEST. `daily_runs.run_key` es `daily:AAAA-MM-DD` en Madrid y tiene índice único.

`workflow_dispatch` ejecuta inmediatamente sin la restricción horaria. Un `push` que afecte `data/imports/inbox/**` ejecuta únicamente el importador de inbox.

## Ejecución local

```bash
pnpm data:daily
pnpm data:inbox
```

Los conectores son independientes. Un fallo queda en `data_sources.last_error`, no elimina el último valor válido y no bloquea las demás fuentes. El proceso falla solo si todas las fuentes fallan.

## Inbox

Formatos: `.json`, `.jsonl`, `.ndjson`, `.csv`, `.xlsx`. El workflow no modifica ni commitea archivos. El SHA-256 del contenido evita reimportaciones; los rechazados se conservan con línea, razón y payload.

No añadas secretos, informes sin licencia o datos personales a un repositorio público. Los artefactos del workflow deben permanecer privados.

## Incidencias

1. Revisar la vista Fuentes y `source_runs`.
2. Confirmar respuesta oficial y rate-limit antes de reintentar.
3. No borrar el último snapshot válido por un error transitorio.
4. Para recuperar PGlite, parar la aplicación y restaurar una copia completa de `MIO_DATA_DIR`.
5. Si cambia el formato de una API, actualizar fixture, parser y prueba antes de reactivar el conector.

## Credenciales y bloqueos

- INE y Eurostat no requieren credenciales.
- GitHub funciona sin token con cuota baja; `GITHUB_TOKEN` es recomendado en Actions.
- Trendshift y fuentes comerciales permanecen deshabilitadas hasta aportar credenciales y derecho de uso.
