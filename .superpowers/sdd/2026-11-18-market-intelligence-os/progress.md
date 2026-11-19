# SDD ledger — plan: docs/superpowers/plans/2026-11-18-market-intelligence-os.md

Ruling: el paquete recibido no es un repositorio Git y el usuario prohibió commits sin autorización — se ejecuta en una copia de trabajo, con ledger y verificación por tarea, y se sincronizará al directorio indicado al final — si esta decisión fuera incorrecta, faltaría historial de commits por tarea.
Pre-flight: Task 1 produce `getDb`, `migrateDatabase`, `seedCatalog` y `listOpportunities`; Tasks 4 y 5 consumen repositorios asentados sobre esa interfaz, sin conflicto.
Pre-flight: Task 2 produce `previewImport` y `commitImport`; Task 5 los consume mediante Route Handlers, sin conflicto.
Pre-flight: Task 3 produce `ConnectorResult` y observaciones canónicas; Tasks 5 y 6 consumen esos contratos, sin conflicto.
Pre-flight: Task 4 produce exportadores server-side; Task 5 los expone sin duplicar la lógica, sin conflicto.

Task 1: Ruling: las ideas de juego siguen contando dentro de las 30 oportunidades tecnológicas, con `scoring_model=game` separado — conserva el recuento del catálogo y evita mezclar el ranking B2C con B2B — si fuera incorrecto, los filtros por tipo necesitarían una tercera categoría.
Task 1: complete (sin commits por instrucción; tests: seed-catalog + database-seed → 3/3 passed).
Task 2: Ruling: los tipos aún sin tabla específica se conservan en `import_records` y no se muestran como verificados; `trend_observation` sí se materializa en su tabla canónica — evita perder datos sin promoverlos de categoría — si fuera incorrecto, habría que añadir mapeos de dominio antes de aceptar esos tipos.
Task 2: complete (sin commits por instrucción; tests: seed + database + imports → 8/8 passed).
Task 3: Ruling: GitHub Search se conserva exclusivamente como `proxy` de actividad técnica; INE/Eurostat son `observed`, y ninguna de las tres series se interpreta como demanda, facturación o predicción — evita mezclar señales heterogéneas — si fuera incorrecto, el modelo de evidencia perdería su frontera principal.
Task 3: Ruling: la serie INE `IPC251856` es variación anual del IPC, no el nivel del índice; el contrato se corrigió después de contrastarlo con la respuesta oficial antes de persistir datos — evita una unidad y una lectura falsas — si fuera incorrecto, el dashboard rotularía porcentajes como puntos de índice.
Task 3: complete (sin commits por instrucción; tests: connectors + persistence + trend engine → 8/8 passed; ejecución real: INE 24, Eurostat 10, GitHub 1; deduplicación revisada).
Task 4: Ruling: el XLSX incluye hojas separadas de datos, fuentes y metodología y neutraliza prefijos de fórmula en contenido aportado por usuario — conserva trazabilidad sin abrir un vector de CSV/XLSX injection — si fuera incorrecto, una celda maliciosa podría ejecutarse al abrir el archivo.
Task 4: complete (sin commits por instrucción; tests de XLSX, JSON, JSONL y CSV → 2/2 passed).
Task 5: Ruling: el modo real excluye `claim_type=demo` y las pantallas sin evidencia muestran ausencia explícita; empresas heredadas quedan como referencias no revisadas — evita que la interfaz convierta el seed en validación — si fuera incorrecto, el panel exageraría la calidad de la información disponible.
Task 5: complete (sin commits por instrucción; seis rutas, importación web, exportaciones, autenticación remota single-user, claro/oscuro y responsive implementados).
Task 6: Ruling: dos cron UTC más control de hora Madrid y `daily_runs.run_key` único cubren CET/CEST sin doble ejecución; Actions conserva PGlite entre runs mediante caché y artefacto privado — mantiene histórico sin publicar datos — si fuera incorrecto, habría huecos o duplicados en cambios de horario.
Task 6: complete (sin commits por instrucción; 3/3 tests de automatización; CLI, workflow_dispatch y push al inbox implementados).
Task 7: complete (sin commits por instrucción; 25/25 unit tests, typecheck, lint, build y 8/8 Playwright desktop/mobile; revisión visual 1440/390 px; documentación y limitaciones añadidas).

