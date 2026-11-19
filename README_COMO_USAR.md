# Market Intelligence OS — paquete listo para Codex

## ¿Qué contiene?

- `CODEX_PROMPT_MARKET_INTELLIGENCE_OS.md`: especificación maestra del producto para Codex (dashboard, ingeniería, datos, pronósticos y automatizaciones).
- `data/imports/seed/radar_5_sectores_espana_2026.xlsx`: Excel sectorial original entregado por el usuario.
- `data/imports/seed/radar_espana_mas_tecnologia_2026.xlsx`: Excel original ampliado de tecnología; contiene las mismas diez hojas del anterior.
- `data/imports/seed/oportunidades_55_importadas.json`: 55 oportunidades precargadas, sin duplicación de las hojas comunes.
- `data/imports/seed/oportunidades_55_importadas.jsonl`: las mismas 55 oportunidades en JSONL para probar la importación.
- `data/imports/seed/competidores_importados.json`: 43 registros de empresas competidoras publicados en ambos libros (18 sectoriales y 25 tecnológicas); no implica ingresos verificados.
- `data/imports/seed/sectores_5_importados.json`: las cinco magnitudes sectoriales del Excel con sus unidades y fuente original.
- `docs/FUENTES_VERIFICADAS.md`: fuentes abiertas/API y advertencias de licencias.
- `data/examples/ejemplo_importacion.jsonl`: ejemplo sintético, nunca datos de mercado reales.

## Pasos para comenzar

1. Descomprime el ZIP en **una carpeta nueva de proyecto** (por ejemplo `market-intelligence-os/`).
2. Abre esa carpeta con Codex o Cursor. No sobrescribas un repositorio de otro proyecto.
3. En Codex, copia este mensaje de arranque:

   > Lee `CODEX_PROMPT_MARKET_INTELLIGENCE_OS.md` y los dos Excel de `data/imports/seed/`. Audita el contenido real, implementa el MVP descrito con una base de datos local, fuentes auténticas y la importación JSON/JSONL. No uses datos ficticios en modo real ni declares conectores operativos sin verificarlo. Trabaja por fases, escribe pruebas y entrega instrucciones claras de despliegue. Empieza ahora.

4. Codex puede ejecutar el plan en el repositorio; pide autorizaciones solo para operaciones sensibles, despliegues, pagos o acceso a cuentas.
5. Una vez exista una web desplegada, conecta la base de datos y los secretos necesarios para activar el workflow de GitHub Actions.

## Qué significa «automatización diaria» aquí

No es una tarea de ChatGPT ya activada, ni una integración remota que esté funcionando. El prompt exige implementar dos automatismos en la **aplicación que Codex construya**:

1. **Recolector programado:** API/RSS de fuentes que permitan automatización, todos los días alrededor de las 09:00 Europe/Madrid, con snapshots y trazabilidad.
2. **Importador JSON/JSONL:** subida manual desde la UI y carga automática de archivos que el usuario añada y envíe al directorio del repositorio `data/imports/inbox/`.

Subir un archivo a una carpeta local del ordenador **no implica** que un servidor remoto pueda leerlo por sí solo: haría falta un sincronizador o una integración habilitada expresamente.

## Advertencia económica

Las 55 oportunidades proceden de hipótesis de investigación y scores creados previamente. Los modelos y precios propuestos no son ingresos medidos. Los datos de mercado obtenidos posteriormente deben mantenerse **separados** de esas hipótesis.
