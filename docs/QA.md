# QA y validación

Validación del 18/11/2026 en macOS arm64 con Node 24 del runtime de Codex y Chromium 159.

| Comprobación | Resultado |
| --- | --- |
| TypeScript estricto | Aprobado, 0 errores |
| ESLint / Next.js | Aprobado, 0 errores |
| Vitest | 9 archivos, 25 tests aprobados |
| Build Next.js | Aprobado, 15 rutas dinámicas y Proxy; avisos de trazado por acceso local a migraciones/seed documentados |
| Playwright escritorio | 4/4 aprobados a 1440 px |
| Playwright móvil | 4/4 aprobados a 390 px |
| XLSX | Abre con ExcelJS, 6 hojas, 55 oportunidades, fórmulas neutralizadas |
| Conectores reales | INE 24 observaciones, Eurostat 10, GitHub 1 proxy en la ejecución verificada |

Los e2e recorren las seis pantallas, validan las tres preguntas de decisión, previsualizan un JSONL sin confirmarlo y descargan un XLSX cuyo contenido empieza por la firma ZIP `PK`.

Capturas locales de revisión: `test-results/home-desktop.png` y `test-results/home-mobile.png`. `test-results/` está ignorado y no forma parte del producto entregable.

La prueba visual confirmó navegación horizontal accesible en móvil, tablas con scroll en lugar de compresión, contraste claro y ausencia de desbordamiento del layout. El botón rojo de Next.js visible en capturas de desarrollo pertenece al inspector del framework y no aparece en producción.
