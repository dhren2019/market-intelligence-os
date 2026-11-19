# Fuentes y licencias

Revisión: 18/11/2026. Solo se habilitan conectores con documentación oficial y uso automatizado razonable. Cada ejecución conserva URL, fecha de observación, fecha de extracción, unidad, metodología y respuesta original privada.

## Conectores habilitados en el MVP

### INE OpenAPI

- Documentación: https://www.ine.es/OpenAPI/index.html y https://www.ine.es/dyngs/DAB/index.htm?cid=1100
- Endpoint usado por defecto: serie oficial de ejemplo `IPC251856`, mediante `DATOS_SERIE`, con los últimos periodos y metadatos devueltos por el INE.
- Autenticación: no requerida para los endpoints públicos documentados.
- Reutilización: comercial o no comercial, citando al INE, fecha de actualización cuando exista, sin desnaturalizar el dato ni sugerir respaldo del INE. Aviso legal: https://www.ine.es/ss/Satellite?L=0&c=Page&cid=1254735849170&p=1254735849170&pagename=Ayuda%2FINELayout
- Límite: la documentación consultada no publica una cuota numérica general. El conector usa peticiones pequeñas, caché, timeout y backoff. No realiza descarga masiva.
- Semántica: cada serie conserva nombre, unidad, escala, periodo y código. No se compara con otra serie solo por compartir una etiqueta parecida.

### Eurostat Statistics API

- Documentación: https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-getting-started
- Endpoint por defecto: `nama_10_gdp`, filtrado a España, PIB a precios corrientes en millones de euros. Sirve como contexto macro, no como TAM de una oportunidad.
- Autenticación: no requerida para datos públicos.
- Reutilización: autorizada para fines comerciales y no comerciales con atribución. Contenido editorial de la UE bajo CC BY 4.0; pueden existir excepciones de terceros. Condiciones: https://ec.europa.eu/eurostat/help/copyright-notice
- Límite: no se documenta una cuota fija general. Las extracciones grandes pueden responder 413 y pasar a flujo asíncrono; el MVP solicita subconjuntos pequeños. Los datasets se actualizan hasta dos veces al día y el servicio no conserva versiones históricas por sí mismo, por lo que MIO guarda snapshots.

### GitHub REST API

- Documentación: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- Uso: consultas públicas de repositorios para temas configurados. Se registra actividad técnica como `proxy`, nunca como ventas o compradores.
- Autenticación: opcional. Sin token, 60 peticiones por hora por IP para recursos públicos. Con token personal, normalmente 5.000 peticiones por hora. Search tiene límites propios más restrictivos.
- Condiciones: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service y https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies
- Reglas: respetar `x-ratelimit-*`, `retry-after`, 403/429 y backoff. No recopilar datos personales innecesarios, enviar spam ni compartir tokens para eludir límites.

## Adaptadores documentados pero deshabilitados

| Fuente | Estado | Motivo |
| --- | --- | --- |
| Trendshift | Requiere credenciales | No se asume autorización. GitHub no se presenta como réplica de su ranking. |
| TED Search API | Pendiente de fase siguiente | El adaptador se reserva para demanda pública; una licitación no equivale a adjudicación. |
| Google Trends API | Acceso alfa | No se asume acceso general. RSS de tendencias no equivale a volumen absoluto. |
| App Store y Google Play | Restringido | Sin scraping de Apple; Google Play no ofrece métricas públicas sistemáticas de terceros. |
| Dealroom, PitchBook, Sensor Tower, Similarweb, Crunchbase | Acceso de pago o licenciado | Importación manual solo con derecho de uso. |

## Política de habilitación

Un conector pasa a `activo` solo si tiene documentación oficial, método autorizado, esquema validado, timeout, reintentos acotados, rate-limit, fixture de respuesta y clasificación de evidencia. Un fallo de una fuente no borra el último dato válido ni bloquea las demás.

