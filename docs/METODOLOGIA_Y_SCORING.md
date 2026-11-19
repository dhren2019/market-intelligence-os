# Metodología y scoring

## Tipos de afirmación

| Tipo | Significado | Puede entrar en evidencia comercial |
| --- | --- | --- |
| `observed` | Valor publicado por la fuente citada, con unidad y fecha. | Sí, para la afirmación exacta que mide. |
| `proxy` | Medida indirecta de su propio fenómeno. | Solo como señal secundaria. |
| `estimate` | Cálculo explícito con supuestos. | No se mezcla con observado. |
| `hypothesis` | Supuesto pendiente de validar. | No. |
| `prediction` | Pronóstico con método y horizonte. | Solo con backtest válido. |
| `demo` | Dato sintético de prueba. | Nunca en modo real. |

GitHub Search mide repositorios que coinciden con una consulta. No mide compradores, ventas o demanda. El PIB de Eurostat y la variación anual del IPC del INE son contexto macro y no constituyen TAM de software.

## Scores

`legacy_score` es el valor cacheado de las fórmulas de los Excel. Se conserva junto con hoja, fila y payload original. No se recalcula ni se usa como evidencia nueva.

La cola `Dónde invertir tiempo ahora` ordena hipótesis por `legacy_score` y muestra la prueba comercial y la regla de abandono registradas en el Excel. Significa `prioridad de validación`, no probabilidad de éxito, rentabilidad esperada ni recomendación de invertir capital.

`evidence_score` y `build_score` permanecen nulos. Para habilitarlos se necesitan, como mínimo, una especificación versionada de componentes y pesos, evidencia no demo con fuente, explicación por componente y tests de regresión. Un dato ausente se muestra como “Sin datos suficientes”, no como cero.

Las ideas de juego usan `scoring_model=game`; no se comparan silenciosamente con oportunidades B2B.

## Tendencias

Las ventanas admitidas son 7, 30 y 90 días. Se utiliza el último punto anterior al umbral solo si está suficientemente próximo: tolerancia de 2, 7 y 14 días, respectivamente. Así una serie anual no aparece como variación de siete días. El resultado es un cambio observado, no una predicción.

No se genera forecast hasta disponer de histórico suficiente, horizonte explícito y backtest que supere un baseline documentado.

El módulo Forecasts usa cuatro estados: `Histórico insuficiente`, `Falta backtest`, `No supera baseline` y `Publicable`. Solo el último puede mostrar un valor futuro, siempre etiquetado como `prediction`.

El módulo Alertas admite dos hechos: error persistido de una fuente y cambio observado con punto histórico comparable. Una serie de un solo punto nunca genera una alerta de tendencia.

## Sectores

Las cinco magnitudes del Excel mantienen definición, unidad, año y fuente. No se suman ni se presentan como comparables: cuatro son cifra de negocios empresarial y turismo usa gasto de turistas internacionales. Ninguna es automáticamente mercado direccionable de software.

Tecnología se añade como sexto ámbito de exploración porque el Excel auditado aporta cinco líneas y 30 oportunidades. No tiene magnitud en M€, no se suma con los sectores INE y sus precios, modelos y scores permanecen como hipótesis.

## Inversores

Una tesis inversora, una admisión en incubadora, una ronda anunciada, una ronda documentada, un compromiso y un desembolso son eventos distintos. El módulo parte con cobertura cero porque los Excel no incluyen eventos verificables; no infiere financiación desde competidores, precios o menciones.
