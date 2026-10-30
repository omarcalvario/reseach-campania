# Interacciones y filtros — prototipo Fase B

## Modelo

- La unidad de resultado y contador es **campaña**. Una campaña incluye una o más piezas; créditos y derechos se muestran por pieza.
- Filtros: Región, Formato y Disciplina (base obligatoria); Evidencia y Aprendizaje (facetas adicionales).
- Combinación **AND** entre grupos activos; **OR** entre varios valores seleccionados dentro de un mismo grupo.
- Formato se deriva de `pieces[].format`; disciplina de `pieces[].discipline`; región y estado de evidencia de campaña; aprendizaje de `learnings[].campaignIds`.
- Contador se actualiza al aplicar cambios y se anuncia con `aria-live="polite"`. Cada selección ofrece nombre legible, botón quitar y acción **Limpiar filtros**.
- El estado vacío explica que la combinación no encontró campañas y ofrece restablecimiento inmediato.
- Estado de carga y error de lectura de JSON son visibles. No se emplean capturas ni recursos de red como requisito para filtrar.

## Ficha y medios

- Tarjeta muestra institución, campaña, fecha/región, etiquetas editoriales y disciplina disponible.
- Abrir detalles revela los seis campos editoriales con su excerpt/fuente, luego análisis, aprendizaje, limitación y CTA.
- La pieza se presenta con marcador visual abstracto de prototipo o captura contextual interna revisada; nunca incrusta el original externo.
- Pie de cada pieza: marca/universidad, campaña, organización fuente, enlace original, crédito, estado **Solo análisis interno** y la nota de prohibición completa.
- Enlaces externos llevan aviso visible, abren contexto separado y no activan descargas.
