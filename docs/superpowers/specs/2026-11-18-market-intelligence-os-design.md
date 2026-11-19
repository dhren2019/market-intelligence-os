# Market Intelligence OS: diseño del MVP

## Intención

Construir una aplicación privada y local para decidir qué microproducto merece investigación comercial. La interfaz debe mostrar datos reales y trazables, sin convertir hipótesis o proxies en ventas, demanda o predicciones.

## Objetivos

- Importar exactamente 55 oportunidades iniciales sin duplicar las diez hojas comunes.
- Ofrecer seis pantallas terminadas: Inicio, Sectores, Oportunidades, Empresas, Importaciones y Fuentes.
- Importar JSON, JSONL, NDJSON, CSV y XLSX con preview, validación, deduplicación SHA-256 y rechazo por registro.
- Exportar filtros a XLSX, CSV, JSON y JSONL con fuentes y metodología.
- Conectar INE, Eurostat y GitHub con snapshots, errores aislados y ejecución local o diaria.
- Calcular tendencias solo con histórico suficiente; ocultar forecast si no existe muestra y backtest válido.
- Funcionar sin API de pago y sin despliegue.

## No objetivos del MVP

- No estimar ingresos, descargas, búsquedas mensuales, TAM o probabilidades.
- No completar inversores, apps/juegos ni pronósticos avanzados sin datos suficientes.
- No enviar correo, publicar datos, desplegar ni modificar repositorios remotos.
- No automatizar scraping de páginas comerciales de los Excel.

## Restricciones

- Producto en español, TypeScript estricto, accesible y responsive de 360 a 1440 px.
- Persistencia local compatible con PostgreSQL. El modo local no exige Docker ni credenciales.
- Observado, proxy, estimación, hipótesis y predicción son tipos distintos en modelo, filtros y UI.
- Las observaciones conservan fuente, URL, unidad, geografía, periodo, publicación, extracción, calidad y método.
- Datos de ejemplo quedan marcados `demo` y fuera del modo real.

## Enfoques considerados

1. **Next.js más PostgreSQL Docker desde el primer minuto.** Es el objetivo de producción, pero obliga a Docker para cualquier uso local y complica el arranque del MVP.
2. **Next.js con PGlite local y el mismo esquema PostgreSQL para remoto. Elegido.** Mantiene SQL Postgres, migraciones y snapshots sin infraestructura obligatoria; `DATABASE_URL` permite sustituir el adaptador local por Postgres/Neon.
3. **Frontend Next.js más servicio Python separado.** Aísla mejor la ingesta pesada, pero añade dos procesos, dos despliegues y contratos prematuros. Python queda para auditoría e integridad; los conectores MVP usan módulos TypeScript independientes.

## Arquitectura elegida

Una aplicación Next.js con Server Components y Route Handlers. El dominio vive en módulos puros: importación, clasificación de evidencia, tendencias, exportación y conectores. Drizzle define el esquema PostgreSQL; PGlite guarda el archivo local. Las tareas CLI llaman a los mismos servicios que la web. GitHub Actions ejecuta la CLI y publica únicamente un artefacto privado del workflow.

La UI sigue una dirección Wayfind: señalización clara, tablas legibles, cifras tabulares y color reservado a estados. No hay imágenes decorativas ni gráficos sin serie real. En móvil, la tabla se convierte en bloques etiquetados y la navegación lateral pasa a un panel.

## Entidades y fronteras

- `data_sources`, `source_runs`, `source_documents`: catálogo, ejecuciones y respuestas.
- `sector_definitions`, `sector_observations`: definiciones y series comparables.
- `trend_topics`, `trend_observations`: proxies y observaciones temporales.
- `opportunities`, `opportunity_evidence`, `opportunity_scores`: idea, evidencia y modelos de score separados.
- `companies`, `company_products`, `pricing_observations`, `revenue_claims`: producto, precio e ingreso con tipo de prueba distinto.
- `imports`, `import_rejections`: idempotencia, preview y trazabilidad.
- Tablas de segunda etapa se incluyen en migración para evitar rehacer el esquema, pero no se presentan como módulos terminados.

## Decisiones del builder

- El seed JSON de 55 oportunidades es la entrada canónica. Los Excel se auditan y se pueden reimportar, pero no se mezclan dos veces.
- El score nuevo queda vacío hasta que exista evidencia. La UI muestra `Sin datos suficientes`, no cero.
- GitHub es un proxy de actividad técnica. INE y Eurostat son observaciones estadísticas. Las hipótesis de los Excel mantienen `claim_type=hypothesis`.
- El forecast devuelve `insufficient_data` hasta tener histórico, estacionalidad y backtest que supere al baseline.

