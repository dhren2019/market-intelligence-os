# Auditoría de los Excel de origen

Fecha de auditoría: 18/11/2026. Archivos inspeccionados íntegramente con `openpyxl` 3.1.5, recorriendo todas las celdas, fórmulas, valores cacheados, enlaces, comentarios y hojas. Los originales no se modificaron.

## Conclusión ejecutiva

- `radar_5_sectores_espana_2026.xlsx` contiene 10 hojas y 131 fórmulas.
- `radar_espana_mas_tecnologia_2026.xlsx` contiene 21 hojas y 240 fórmulas.
- Las diez hojas del primer archivo están repetidas en el segundo con el mismo contenido y las mismas dimensiones. No deben importarse dos veces.
- El catálogo canónico contiene 55 oportunidades: 25 filas de `02_25_OPORTUNIDADES` y 30 filas de `12_TECH_30_IDEAS`. Sus 55 IDs son únicos.
- Todos los registros tienen `legacy_score`. Esta puntuación se conserva como evaluación previa y no se usa como prueba comercial nueva.
- El catálogo de competidores tiene 43 registros: 18 sectoriales y 25 tecnológicos. La presencia de una empresa o precio público no demuestra facturación.
- Los cinco sectores tienen fuente INE y unidad declarada, pero sus magnitudes no son homogéneas. Comercio, industria, construcción y transporte usan cifra de negocios empresarial de 2024. Turismo usa gasto de turistas internacionales de 2025. No se suman ni se ordenan juntos como un ranking financiero comparable.

## Integridad y duplicación

| Comprobación | Resultado |
| --- | --- |
| Hojas comunes | 10 de 10, contenido idéntico |
| Oportunidades sectoriales | 25 |
| Oportunidades tecnológicas | 30 |
| Oportunidades canónicas | 55 |
| IDs repetidos | 0 |
| Filas de procedencia repetidas en el JSON | 0 |
| `legacy_score` ausente | 0 |
| Competidores importados | 43 |
| Sectores económicos importados | 5 |
| Ámbitos tecnológicos importados | 1 (5 líneas, sin magnitud comparable) |

Clave estable de oportunidad: `legacy:<ID>`. Procedencia conservada: `source_workbook`, `source_sheet`, `source_row`, URL de fuente y fecha de importación. La deduplicación de hojas repetidas se hace por ID canónico y fingerprint de procedencia; el archivo ampliado es la fuente preferida para las 25 filas comunes.

## Inventario de hojas

| Hoja | Dimensión | Filas de datos o función | Fórmulas |
| --- | ---: | --- | ---: |
| `00_LEER_PRIMERO` | 47×12 | Portada sectorial | 40 |
| `01_5_SECTORES` | 14×12 | 5 sectores | 0 |
| `02_25_OPORTUNIDADES` | 30×26 | 25 oportunidades | 50 |
| `03_COMPETIDORES` | 27×10 | 18 competidores | 0 |
| `04_VALIDAR_21_DIAS` | 17×12 | 10 experimentos | 0 |
| `05_ECONOMIA` | 19×12 | Simulador editable | 40 |
| `06_JUEGOS_AR` | 14×11 | 7 conceptos | 0 |
| `07_FUENTES` | 45×6 | 40 fuentes | 0 |
| `08_CRM_PILOTOS` | 48×12 | Plantilla vacía | 0 |
| `09_CRITERIOS` | 20×8 | Pesos sectoriales | 1 |
| `10_TECH_PORTADA` | 27×12 | Portada tecnológica | 0 |
| `11_TECH_5_LINEAS` | 10×10 | 5 líneas | 0 |
| `20_TECH_CRITERIOS` | 25×8 | Pesos tecnológicos | 1 |
| `12_TECH_30_IDEAS` | 35×29 | 30 oportunidades | 60 |
| `13_TECH_COMPETIDORES` | 30×11 | 25 competidores | 0 |
| `14_TECH_JUEGOS` | 11×15 | 6 juegos | 0 |
| `15_TECH_DESKTOP` | 11×16 | 6 programas desktop | 0 |
| `16_TECH_MODELOS` | 16×9 | 11 modelos | 0 |
| `17_TECH_ECONOMIA` | 17×15 | Simulador editable | 48 |
| `18_TECH_VALIDAR` | 16×11 | 9 experimentos | 0 |
| `19_TECH_FUENTES` | 40×7 | 35 fuentes | 0 |

La posición de `20_TECH_CRITERIOS` antes de `12_TECH_30_IDEAS` es real en el libro. El importador usa el nombre de hoja, no su índice.

`11_TECH_5_LINEAS` aporta cinco líneas con seis oportunidades cada una: SaaS para agencias, herramientas developer, apps móviles útiles, programas de PC y juegos móviles. En el dashboard se agrupan bajo `Tecnología`, pero no se convierten en un sexto indicador económico.

## Fórmulas y consistencia

- Los 131 y 240 campos de fórmula tienen valor cacheado y ninguno contiene un error Excel almacenado.
- Los scores sectoriales y tecnológicos dependen de pesos editables. Se importan los valores cacheados como `legacy_score` y se conserva la fórmula original en `raw_payload` cuando se importa directamente desde XLSX.
- Los simuladores `05_ECONOMIA` y `17_TECH_ECONOMIA` mezclan supuestos editables con fórmulas. Sus resultados son escenarios, no observaciones, y no se incorporan como facturación real.
- `08_CRM_PILOTOS` es una plantilla sin contactos. No hay evidencia de entrevistas, pilotos o pagos en el archivo.
- `openpyxl` avisó de extensiones de formato no soportadas. El análisis fue de contenido; los archivos originales se preservan para no perder formato condicional o extensiones nativas.

## Columnas y mapeo canónico

Las 25 ideas sectoriales incluyen ID, sector, microproducto, comprador, dolor, frecuencia objetivo, valor económico hipotético, formato, modelo, precio a probar, cinco criterios, score, días de MVP, competidores, diferenciación, contacto, validación, abandono, riesgo y URL.

Las 30 ideas tecnológicas incluyen ID, línea, producto, formato, comprador, pain point, frecuencia objetivo, efecto económico hipotético, monetización primaria y secundaria, entrega, precio y unidad a probar, cinco criterios, score, filtros, días de MVP, competidores, diferenciación, captación, validación, abandono, riesgo y URL.

El modelo canónico no fuerza una falsa equivalencia entre ambos formatos. Guarda los campos originales en `raw_payload` y normaliza solo ID, nombre, categoría, comprador, estado, `legacy_score`, tipo de oportunidad, URL y procedencia.

## Cobertura de fuentes

- `07_FUENTES`: 40 URLs HTTPS únicas y presentes.
- `19_TECH_FUENTES`: 35 URLs HTTPS únicas y presentes.
- Comprobación HTTP del 18/11/2026: 73 respondieron con 200. Dos URLs de Channable devolvieron 429, lo que indica rate limiting o protección automatizada, no una URL necesariamente rota.
- Un estado HTTP 200 solo prueba accesibilidad. No valida por sí solo la afirmación, licencia, actualidad o calidad metodológica.
- Los precios son observaciones públicas fechadas, no ingresos. Las cifras de TrustMRR, declaraciones de fundadores o estimaciones de Sensor Tower mantienen su tipo de prueba original y no se promueven a dato oficial.

## Riesgos detectados

1. Mezclar las diez hojas duplicadas produciría 80 oportunidades. El CI debe fallar si el seed no produce exactamente 55.
2. Los dos esquemas de oportunidad tienen nombres de campo distintos. Se normalizan sin descartar el original.
3. Varias URLs se reutilizan como evidencia para ideas distintas. Una URL repetida no es corroboración independiente.
4. Los scores altos describen una evaluación previa. No implican demanda, ventas ni probabilidad de éxito.
5. Las magnitudes sectoriales no constituyen TAM del software y no se agregan.
6. La accesibilidad de páginas comerciales puede variar por región, cookies o controles anti-bot. No se convierten en conectores automáticos sin permiso explícito.

