# Centro de decisión visual

## Intento

Hacer que Market Intelligence OS responda de forma visual y directa dónde conviene invertir tiempo de validación, sin convertir los scores heredados del Excel en recomendaciones financieras ni alterar el diseño existente.

## Alcance

- Mantener tipografía, colores, navegación lateral, componentes y densidad visual actuales.
- Añadir Tecnología como sexto ámbito, derivado de las cinco líneas y 30 oportunidades del Excel tecnológico. No asignarle una magnitud económica comparable a los cinco sectores INE.
- Mostrar una cola de validación con prioridad, razón, siguiente acción y freno. El orden usa exclusivamente `legacy_score`; se etiqueta siempre como hipótesis.
- Activar cuatro módulos en navegación: Apps, Inversores, Alertas y Forecasts.
- Apps resume las 30 oportunidades tecnológicas reales del catálogo, agrupadas por línea y formato.
- Inversores muestra solo eventos y tesis documentados. Con la base inicial debe mostrar cero cobertura verificada y no inferir financiación desde competidores o precios.
- Alertas se calculan desde fallos/obsolescencia de fuentes y cambios observados. No generan alertas de mercado sin historial comparable.
- Forecasts publica únicamente preparación y resultados respaldados por backtests. Si no hay forecast que supere el baseline, muestra `Sin pronóstico publicable`.

## Enfoques considerados

1. Reordenar toda la portada y crear una nueva identidad visual. Rechazado porque el usuario pidió conservar el diseño.
2. Añadir tarjetas decorativas con los módulos marcados como próximos. Rechazado porque no resuelve la necesidad operativa.
3. Extender el sistema existente con consultas derivadas y estados honestos. Elegido porque aporta decisión inmediata sin inventar datos ni cambiar el lenguaje visual.

## Restricciones

- Las hipótesis, estimaciones, observaciones y predicciones permanecen separadas.
- `legacy_score` no se renombra ni interpreta como probabilidad, rentabilidad o evidencia comercial.
- No se crean empresas, importes, rondas, facturación ni forecasts sintéticos.
- No se despliega ni publica ningún dato.

