# Quickstart de validación: Referencias para la campaña UVP 2027

Guía para la futura fase de implementación; este plan no crea la aplicación ni instala
dependencias.

## Prerrequisitos

- Node.js LTS y gestor de paquetes elegido por el equipo.
- Catálogo editorial revisado y permisos de medios aprobados.
- Consultar [data-model.md](data-model.md) y
  [contracts/campaign-content.schema.json](contracts/campaign-content.schema.json).

## Escenarios de aceptación

1. **Lectura editorial**: abrir la página en móvil y escritorio; encontrar portada, método,
   tendencias, tres regiones, galería, comparativa, aprendizajes, tres rutas y créditos.
   Esperado: todo el contenido permanece legible y no hay desplazamiento horizontal global.
2. **Filtros**: combinar región + disciplina + estado de evidencia; quitar un filtro y
   limpiar todos. Esperado: resultados consistentes, contador correcto y mensaje útil en
   cero resultados.
3. **Trazabilidad**: abrir una ficha y seguir fuentes de campaña y pieza. Esperado: título,
   autor/organización, URL, publicación si consta, fecha de consulta, crédito y uso visibles.
4. **Enlace no disponible**: revisar registro con estado inaccesible/retirado. Esperado: URL
   original y fecha preservadas; no aparece como sustento de afirmaciones.
5. **Resultados y discrepancias**: inspeccionar casos con datos insuficientes/contradictorios.
   Esperado: etiqueta “Resultado no verificable” o nota de discrepancia; sin conclusión de
   éxito inferida.
6. **Derechos**: revisar media marcada no reutilizable. Esperado: enlace/crédito/análisis
   conservados, sin incorporación a piezas UVP; captura solo en contexto interno aprobado.
7. **Accesibilidad**: recorrer navegación, filtros y enlaces solo con teclado; comprobar
   foco, contraste, zoom y preferencia de reducción de movimiento. Esperado: controles
   alcanzables/identificables y contenido equivalente sin animación.
8. **Media**: revisar imagen y video. Esperado: alt contextual, dimensiones reservadas,
   medios no críticos diferidos, video sin autoplay y enlace/embed con alternativa.

## Verificación de rendimiento y entrega

En la futura implementación, ejecutar el build estático definido por la configuración del
proyecto y medir Core Web Vitals en un perfil móvil de referencia. Criterios objetivo:
LCP ≤ 2.5 s, INP ≤ 200 ms y CLS ≤ 0.1. Registrar ambiente, URL/build y fecha; no reportar
como aprobado hasta medir. Revisar que el catálogo pase el esquema y que todas las referencias
publicadas tengan datos de trazabilidad y derechos requeridos.
