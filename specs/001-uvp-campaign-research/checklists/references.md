# Referencias Checklist: Referencias para la campaña UVP 2027

**Purpose**: Evaluar si los requisitos de documentación de referencias son completos, claros y verificables.
**Created**: 2026-10-21
**Feature**: [spec.md](../spec.md)

**Note**: Esta checklist personalizada valida la calidad de los requisitos, no la implementación.
**Review Ownership**: Esta checklist pertenece a la persona revisora. Marque `[x]` solo cuando determine que el criterio de calidad de requisitos está satisfecho.
**Marker Semantics**: `[x]` significa que el requisito fue revisado y satisface el criterio; no significa que el trabajo de implementación esté completo.

## Completitud de requisitos

- [ ] CHK001 ¿Los requisitos especifican qué fuente debe respaldar cada referencia y qué hacer cuando no se encuentra una fuente fiable? [Completeness, Spec §FR-005, FR-013]
- [ ] CHK002 ¿Los requisitos definen qué información debe acompañar al crédito y a la nota de uso de cada recurso externo? [Completeness, Spec §FR-013]
- [ ] CHK003 ¿Los requisitos enumeran los componentes del análisis visual que deben documentarse para cada tipo de pieza? [Gap, Spec §FR-006]
- [ ] CHK004 ¿Los requisitos definen cómo expresar la relevancia de cada referencia para UVP y qué no debe repetir UVP? [Completeness, Spec §FR-007]

## Claridad y trazabilidad

- [ ] CHK005 ¿Está definido qué cuenta como una URL o fuente verificable, incluido cómo registrar enlaces inaccesibles o indirectos? [Clarity, Spec §FR-005, FR-013]
- [ ] CHK006 ¿Los requisitos distinguen inequívocamente entre dato documentado, interpretación y propuesta para UVP en cada ficha? [Clarity, Spec §FR-008]
- [ ] CHK007 ¿Está claro cómo atribuir crédito cuando una ficha incluye varias piezas o fuentes con autorías distintas? [Ambiguity, Spec §FR-013]

## Consistencia y calidad de aceptación

- [ ] CHK008 ¿Los campos obligatorios de las fichas son consistentes entre los requisitos por referencia y el criterio de éxito de completitud? [Consistency, Spec §FR-005, SC-001]
- [ ] CHK009 ¿El criterio de aceptación permite determinar objetivamente si una referencia tiene análisis visual y aprendizaje aplicable a UVP? [Measurability, Spec §FR-006, FR-007, SC-001]

## Cobertura de escenarios y excepciones

- [ ] CHK010 ¿Los requisitos especifican cómo registrar la falta de evidencia, resultados no verificables y limitaciones sin inferir éxito? [Coverage, Spec §FR-007, Edge Cases]
- [ ] CHK011 ¿Los requisitos contemplan fuentes contradictorias y explican cómo evitar presentar una interpretación como hecho? [Gap, Spec §FR-008, FR-014]
- [ ] CHK012 ¿Los requisitos definen qué debe documentarse cuando una pieza visual no puede reproducirse o reutilizarse por derechos de uso? [Gap, Spec §FR-013, Edge Cases]

## Notas

- Marque `[x]` solo después de revisar que el requisito esté suficientemente definido.
- Mantenga sin marcar los criterios que requieran aclaración o cambios en la especificación.
- `/speckit.implement` puede leer el estado de esta checklist, pero no debe modificar sus marcadores.
