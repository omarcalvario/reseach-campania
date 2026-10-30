# Feature Specification: Referencias para la campaña UVP 2027

**Feature Branch**: `001-uvp-campaign-research`

**Created**: 2026-10-21

**Status**: Draft

**Input**: User description: "Crear un sitio web editorial de una sola página, estilo presentación, llamado ‘Referencias para la campaña UVP 2027’..."

## Clarifications

### Session 2026-10-21

- Q: ¿Qué reglas de procedencia, análisis, crédito y uso deben cumplir las referencias? → A: Aplicar las decisiones detalladas en esta sesión: fuentes verificables con metadatos y fecha de consulta; estados para enlaces inaccesibles; crédito y estado de uso por pieza; análisis visual completo; campos separados de aplicación UVP; etiquetas visibles para dato, interpretación, propuesta y resultado no verificable; registro de discrepancias; no reutilizar material sin autorización.
- Decisión: reunir 36 candidatas como meta de búsqueda (12 globales, 12 México, 12 Puebla/región), no como cuota de publicación. El catálogo solo publica campañas cuya existencia y fuente primaria o confiable estén verificadas. La verificabilidad de resultados es independiente; puede declararse “Resultado no verificable”. Los vacíos regionales se documentan sin rebajar la calidad de fuentes.
- Decisión: `research/candidates.json` es el registro de investigación; `research/approved-campaigns.json` es la fuente canónica de referencias aprobadas; `contracts/campaign-content.schema.json` valida ambos. `src/data/campaigns.json` se genera desde el catálogo aprobado y no se edita manualmente. `src/content/` contiene únicamente textos editoriales, no copias de datos de campañas.
- Decisión: los resultados principales de filtros son campañas; filtros obligatorios: región, formato y disciplina; filtros adicionales: evidencia y aprendizaje. Las piezas mantienen sus propios créditos, URLs y derechos.
- Decisión: Astro con TypeScript queda aprobado para el sitio estático.
- Decisión: SC-002 es la única prueba de usabilidad: cinco participantes; cada persona encuentra una referencia mediante región y formato en menos de dos minutos, distingue las cuatro etiquetas editoriales y localiza la fuente, sin asistencia. Aprobación final: al menos 4/5 completan las tres acciones. Si falla la primera ronda, registrar correcciones y repetir; la ronda final debe alcanzar el mismo umbral o se bloquea la publicación.
- Decisión: SC-005 será el único criterio responsive y valida a 360, 768 y 1280 px. SC-007 será exclusivamente de rendimiento: LCP/CLS con Lighthouse móvil en build de producción local (cuatro ejecuciones y mediana); INP con web-vitals en vista previa local, midiendo una interacción real de filtro cuatro veces. Si falta una medición, repetir con el método definido; si sigue ausente, bloquear publicación hasta registrar medición válida.
- Decisión: crear `research/matriz-cobertura.md` para registrar cada tipo de campaña FR-003 y formato FR-004 con referencias verificadas, fuente, región y estado; cuando no exista evidencia confiable, registrar “sin referencia verificada disponible”.
- Decisión: mantener la numeración actual de FR para conservar trazabilidad. Registrar reordenamiento como mantenimiento posterior.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar el panorama de referencias (Priority: P1)

Como integrante del equipo de Imagen Gráfica de UVP, quiero recorrer una presentación
editorial de investigación que reúna tendencias y campañas universitarias verificables,
para identificar oportunidades relevantes para la campaña 2027.

**Why this priority**: La investigación organizada y confiable constituye el valor
central de la herramienta.

**Independent Test**: Una persona recorre la página y puede identificar su objetivo,
metodología, tendencias y referencias de las tres regiones sin depender de otra función.

**Acceptance Scenarios**:

1. **Given** la página abierta, **When** la persona recorre sus secciones, **Then** encuentra
   portada, objetivo, metodología, tendencias y referencias globales, mexicanas y poblanas.
2. **Given** una referencia presentada, **When** la persona revisa su ficha, **Then** puede
   distinguir información documentada de interpretación y propuesta para UVP.
3. **Given** candidatas de investigación, **When** se prepara el catálogo publicado,
   **Then** solo se incluyen campañas con existencia y fuente primaria o confiable verificadas;
   la evidencia de resultados se registra por separado.

---

### User Story 2 - Filtrar y comparar materiales (Priority: P2)

Como integrante del equipo, quiero filtrar la galería por región, formato y disciplina y
comparar campañas, para revisar rápidamente los casos útiles para una necesidad creativa.

**Why this priority**: La navegación por filtros y la comparación reducen el esfuerzo de
consulta en una biblioteca multidisciplinaria.

**Independent Test**: Se filtra la galería con cada criterio y se comprueba que los
resultados corresponden a los filtros; luego se consultan fichas y comparativas.

**Acceptance Scenarios**:

1. **Given** la galería con referencias, **When** se elige región, formato o disciplina,
   **Then** se muestran solo los elementos coincidentes y se comunica si no hay resultados.
2. **Given** dos o más fichas, **When** la persona consulta la comparativa, **Then** puede
   reconocer aciertos, riesgos, errores y vacíos de evidencia.
3. **Given** el catálogo, **When** se filtra por cualquier criterio, **Then** los resultados
   son campañas y cada campaña conserva sus piezas asociadas con créditos, URLs y derechos
   individuales.

---

### User Story 3 - Convertir hallazgos en dirección creativa (Priority: P3)

Como integrante del equipo, quiero consultar aprendizajes aplicables y tres rutas
creativas originales, para iniciar conversaciones de concepto sin copiar campañas ajenas.

**Why this priority**: La síntesis transforma investigación en una base de decisión
creativa, después de establecer evidencia y herramientas de consulta.

**Independent Test**: La persona consulta aprendizajes y tres rutas, identifica sus
fundamentos y puede diferenciar propuestas originales de referencias documentales.

**Acceptance Scenarios**:

1. **Given** la sección de aprendizajes, **When** se consulta una recomendación, **Then** se
   encuentra vinculada a evidencia o se identifica claramente como hipótesis.
2. **Given** las tres rutas, **When** se revisa cada una, **Then** se presenta como propuesta
   UVP original y no como trabajo o resultado ya validado.

### Edge Cases

- Una campaña no tiene fecha precisa, métrica pública o evidencia de resultados: la ficha
  declara el dato como aproximado, no disponible o no verificado y no lo inventa.
- Una referencia carece de landing page o pieza audiovisual localizable: la ficha indica
  que no se encontró o no se identificó ese material, sin sugerir que existe.
- Una URL no está disponible: se conservan URL original, fecha de consulta y estado
  “inaccesible” o “contenido retirado”; queda como pista documental y no sustenta afirmaciones.
- Las fuentes discrepan: se registran las fuentes y la discrepancia, y no se presenta una
  conclusión definitiva hasta contar con evidencia suficiente.
- No existen métricas, recepción pública o resultados confiables: se indica “resultado no
  verificable”; no se infiere éxito por estética, popularidad o prestigio institucional.
- Una pieza no es reutilizable: se conserva su enlace, crédito y descripción analítica; una
  captura contextual es solo para revisión interna y cualquier propuesta UVP usa traducción
  visual original. No se incorpora material externo a la campaña sin autorización.
- Un filtro no coincide con ninguna referencia: la galería presenta un estado vacío claro
  y permite retirar o cambiar los filtros.
- Una fuente externa deja de estar disponible: la ficha conserva crédito y URL registrada,
  y comunica que el recurso no está disponible cuando ese estado se conoce.
- La búsqueda no encuentra doce campañas verificadas en una región: se documenta el número
  localizado y el vacío; no se publican candidatas no verificadas para completar la meta.
- Una campaña está verificada pero no hay evidencia confiable de sus resultados: puede
  publicarse como campaña verificada y su evidencia de resultados se etiqueta “Resultado no
  verificable”.
- Una candidata no cumple el esquema o contiene IDs/URLs/créditos/estados/referencias
  cruzadas inválidos: no pasa a `approved-campaigns` hasta corregirse.
- Una categoría de campaña o formato no tiene referencias confiables: la matriz registra
  “sin referencia verificada disponible”; no se rellena con fuentes débiles.
- La medición de una métrica de rendimiento no está disponible: repetirla con el método
  asignado; si continúa ausente, bloquear la publicación.
- La primera ronda de usabilidad no alcanza 4/5: documentar hallazgos y correcciones, repetir
  con cinco participantes y bloquear publicación si la ronda final no alcanza 4/5.
- La página se consulta en móvil, con teclado o con reducción de movimiento: el contenido
  sigue siendo comprensible y operable sin depender de animación o interacción de puntero.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La página MUST presentar el nombre “Referencias para la campaña UVP 2027”,
  su objetivo interno y la metodología de investigación.
- **FR-002**: La página MUST organizar el contenido como una presentación editorial de una
  sola página y mantener este orden canónico de 13 secciones: 1) Portada, 2) Objetivo y
  alcance, 3) Metodología y criterios, 4) Tendencias 2026–2027, 5) Panorama global,
  6) Panorama México, 7) Panorama Puebla y contexto regional, 8) Galería visual y filtros,
  9) Fichas de campañas, 10) Aciertos, limitaciones y errores, 11) Biblioteca para gráfica,
  audiovisual y web, 12) Rutas creativas UVP 2027, 13) Fuentes, créditos y derechos.
- **FR-003**: La investigación MUST cubrir campañas de admisión, posicionamiento,
  empleabilidad, innovación, comunidad, cultura, investigación y vida estudiantil, cuando
  se encuentren fuentes verificables relevantes.
- **FR-004**: La biblioteca MUST contemplar anuncios gráficos, landing pages, sitios,
  videos, reels, motion graphics, redes sociales, activaciones, casos de estudio y premios.
- **FR-005**: Cada ficha de campaña MUST identificar universidad, campaña, país o ciudad,
  fecha, objetivo, público, mensaje, tono, concepto, llamada a la acción y piezas asociadas.
  La fecha MUST marcarse como aproximada cuando corresponda. Cada fuente MUST registrar
  título, autor u organización, URL, fecha de publicación si existe y fecha de consulta.
  Se consideran fuentes verificables las oficiales de universidad, campaña, agencia, medio
  especializado, premio, canal oficial de video o archivo web confiable.
- **FR-006**: Cada ficha MUST analizar mensaje, audiencia, estilo, tipografía, color,
  fotografía o ilustración, composición, sistema de piezas, llamada a la acción y adecuación
  al canal; también interacción o motion cuando exista. El análisis web y audiovisual se
  incluye cuando haya material localizable, y se declara claramente cuando no lo haya.
- **FR-007**: Cada ficha MUST incluir campos separados “aprovechar” (principio que UVP puede
  reinterpretar), “evitar” (riesgo, error o elemento que no conviene repetir) y “aplicación”
  (posible uso concreto en gráfica, audiovisual o web). También MUST documentar limitaciones
  y evidencia de resultados o declarar “resultado no verificable”. El éxito MUST NOT
  inferirse por calidad estética, popularidad o prestigio institucional.
- **FR-008**: La página MUST separar información mediante etiquetas visibles: “Dato
  verificado”, “Interpretación”, “Propuesta para UVP” y “Resultado no verificable”. Las
  interpretaciones y propuestas MUST NOT presentarse como hechos verificados.
- **FR-009**: La galería MUST permitir filtrar referencias por región, formato y disciplina,
  e indicar los resultados y el estado sin resultados.
- **FR-010**: La página MUST incluir una comparativa de aciertos, riesgos y errores, una
  biblioteca para gráfica, audiovisual y web, y una síntesis de aprendizajes aplicables.
- **FR-011**: La página MUST presentar tres rutas creativas originales para UVP 2027,
  identificadas como propuestas y sin atribuirles validación no realizada.
- **FR-012**: Las dos presentaciones `referencias/estilo/Post-Flat_UI_2026.pptx` y
  `referencias/estilo/Tendencias de diseño 2026–2027 _ UVP · referencias reales.pptx`
  MUST considerarse fuentes obligatorias de dirección visual.
- **FR-013**: Cada pieza MUST conservar su crédito, URL y nota de uso, incluso cuando varias
  piezas compartan una ficha de campaña. El registro MUST incluir universidad o marca,
  autor/agencia si se conoce, título de campaña o pieza, tipo de uso y estado: “enlace de
  referencia”, “captura para revisión interna”, “reutilizable con permiso” o “no reutilizable”.
  No se incorporarán recursos externos a la campaña UVP sin autorización. Para material no
  reutilizable se conserva enlace, crédito y descripción analítica; capturas contextuales
  solo se usan para revisión interna y toda propuesta visual UVP será original. El contenido
  MUST priorizar fuentes oficiales, casos de estudio, agencias, premios, páginas y videos
  oficiales y medios especializados.
- **FR-017**: Una URL inaccesible MUST conservarse con URL original, fecha de consulta y
  estado “inaccesible” o “contenido retirado”; podrá usarse como pista documental, pero no
  como sustento de afirmaciones.
- **FR-018**: Cuando fuentes confiables discrepen, MUST registrarse cada fuente y describirse
  la discrepancia; no se formularán conclusiones definitivas hasta tener evidencia suficiente.
- **FR-019**: La investigación MUST buscar una meta de 36 candidatas: 12 globales, 12 de
  México y 12 de Puebla o contexto regional. Esta meta MUST NOT funcionar como cuota de
  publicación. El catálogo publicado MUST incluir solo campañas cuya existencia y fuente
  primaria o confiable estén verificadas. La evidencia de resultados MUST registrarse como
  campo independiente; una campaña verificada puede tener resultado no verificable. Los
  vacíos regionales MUST documentarse sin sustituirlos con fuentes débiles ni inventar
  resultados.
- **FR-020**: La investigación MUST conservar candidatas en `research/candidates.json` y
  referencias aprobadas en `research/approved-campaigns.json`, que será la fuente canónica.
  `contracts/campaign-content.schema.json` MUST validar ambos archivos. `src/data/campaigns.json`
  MUST generarse desde las referencias aprobadas y MUST NOT editarse manualmente. `src/content/`
  MUST contener solo textos editoriales, sin duplicar datos de campañas.
- **FR-021**: Los resultados principales de galería y filtros MUST ser campañas. Los filtros
  obligatorios MUST ser región, formato y disciplina; evidencia y aprendizaje son filtros
  adicionales. Cada campaña MUST agrupar sus piezas y cada pieza MUST conservar sus propios
  créditos, URLs y derechos.
- **FR-022**: El sitio estático MUST construirse con Astro y TypeScript.
- **FR-023**: El catálogo de candidatas y referencias aprobadas MUST validarse contra
  `contracts/campaign-content.schema.json` y comprobar unicidad e integridad de IDs, URLs,
  créditos, estados de uso y referencias cruzadas. Los registros inválidos MUST bloquear la
  aprobación/publicación hasta corregirse.
- **FR-024**: `research/matriz-cobertura.md` MUST registrar cada tipo de campaña enumerado en
  FR-003 y cada formato de FR-004 (gráfica, sitio, landing page, video, reel, motion, red
  social, activación, caso de estudio y premio), junto con referencias verificadas, fuente,
  región y estado. Cuando no exista evidencia confiable, MUST indicar “sin referencia
  verificada disponible”; la matriz MUST NOT completarse con fuentes débiles.
- **FR-025**: La numeración vigente de FR MUST conservarse durante esta fase. El posible
  reordenamiento se registrará como mantenimiento posterior, sin cambiar IDs existentes.
- **FR-014**: La página MUST NOT inventar campañas, tendencias, enlaces, métricas ni
  resultados, y MUST NOT copiar identidades, fotografías, slogans o campañas de terceros.
- **FR-015**: La experiencia MUST mantener jerarquía tipográfica, retícula editorial,
  módulos claros e imágenes prioritarias, con lectura adaptable a móvil.
- **FR-016**: La interfaz MUST ofrecer contraste suficiente, navegación por teclado y foco
  visible, y respetar la reducción de movimiento. Collage, texturas, cristal, 3D, gradientes
  y motion MUST emplearse solo como acentos con propósito comunicativo.

### Key Entities *(include if feature involves data)*

- **Referencia**: Campaña o pieza documentada; reúne procedencia, contexto, formato,
  disciplina, fecha, análisis, evidencia, aprendizajes y crédito.
- **Ficha de campaña**: Presentación detallada de una referencia, con análisis gráfico,
  web y audiovisual según disponibilidad, además de oportunidades y cautelas para UVP.
- **Fuente**: Sitio, publicación o recurso que respalda una afirmación; incluye título,
  autor u organización, URL, fechas de publicación y consulta cuando estén disponibles,
  estado de acceso, crédito y nota de uso.
- **Pieza**: Recurso individual asociado a una campaña; conserva su propio formato, URL,
  autoría, crédito, estado de uso y nota, aunque comparta la ficha principal.
- **Tendencia**: Observación visual o de comunicación para 2026–2027, diferenciada de
  hechos respaldados y vinculada a sus fuentes.
- **Ruta creativa**: Propuesta original de dirección para UVP, con concepto y relación
  explícita con aprendizajes; no equivale a campaña ejecutada o validada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En una revisión de contenido, el 100% de las fichas publicadas contiene
  contexto, análisis visual, campos aprovechar/evitar/aplicación, etiquetas de información,
  aprendizaje, fuentes y créditos por pieza; cualquier dato no disponible declara su estado.
- **SC-002**: La prueba de usabilidad incluye exactamente cinco personas. Sin asistencia,
  cada persona debe: a) encontrar una referencia mediante los filtros de región y formato en
  menos de dos minutos; b) distinguir correctamente “Dato verificado”, “Interpretación”,
  “Propuesta para UVP” y “Resultado no verificable”; y c) localizar la fuente de la referencia
  elegida. La validación final aprueba únicamente si al menos 4 de 5 personas completan las
  tres acciones sin asistencia. Registrar escenario, ID de participante, dispositivo, tarea,
  tiempo, resultado, problemas y conclusión. Si falla la primera ronda, registrar problemas
  y correcciones, repetir la prueba con exactamente cinco personas y exigir nuevamente 4/5.
  Si la ronda final falla, bloquear publicación.
- **SC-003**: En una revisión de accesibilidad manual, todas las funciones de navegación y
  filtrado se pueden usar con teclado y muestran foco visible; la reducción de movimiento
  no oculta información.
- **SC-004**: En una revisión de contenido, todas las afirmaciones de resultados se
  respaldan con fuentes verificables o se etiquetan “Resultado no verificable”; enlaces
  inaccesibles y discrepancias entre fuentes quedan identificados sin sustentar afirmaciones
  no verificadas. Las tres rutas están rotuladas como propuestas UVP.
- **SC-005**: En pruebas a 360, 768 y 1280 px, las 13 secciones canónicas pueden localizarse
  y leerse sin pérdida de contenido ni desplazamiento horizontal de la página.
- **SC-007**: Medir LCP y CLS con Lighthouse móvil sobre una compilación de producción local,
  en cuatro ejecuciones y registrar la mediana. Medir INP mediante `web-vitals` en vista previa
  local, con cuatro interacciones reales sobre los filtros, y registrar la mediana. Para cada
  medición registrar dispositivo/emulación, navegador, fecha y red simulada. Si una métrica no
  está disponible, repetir el método definido para esa métrica; si continúa sin medición
  válida, bloquear publicación. Umbrales: LCP ≤ 2.5 s, INP ≤ 200 ms y CLS ≤ 0.1.
- **SC-008**: El 100% de candidatas y referencias aprobadas pasa validación de esquema e
  integridad de IDs, URLs, créditos, estados de uso y referencias cruzadas antes de avanzar
  al siguiente estado editorial. La matriz de cobertura contiene todas las categorías de
  FR-003 y formatos de FR-004, con evidencia o el estado “sin referencia verificada disponible”.

## Assumptions

- El sitio es una herramienta interna para el equipo de Imagen Gráfica de UVP; no se
  requiere autenticación o publicación pública como parte del alcance descrito.
- La meta 12/12/12 guía la búsqueda, pero el número publicado depende de referencias
  verificadas y puede ser menor; los vacíos se comunican explícitamente.
- Las rutas creativas se redactarán como propuestas originales, sujetas a evaluación del
  equipo, y no como decisiones finales de campaña.
- Se permite que ciertas fichas indiquen datos o piezas no localizados, en vez de completar
  campos con suposiciones.
- Las dos presentaciones mencionadas están disponibles en el repositorio y guían la
  dirección visual junto con las reglas vigentes de la constitución del proyecto.
- Astro con TypeScript es la tecnología aprobada; el archivo de datos de publicación se
  genera desde el registro canónico aprobado y no se mantiene por edición manual duplicada.
- Los IDs FR se mantienen sin reordenar durante esta fase; el mantenimiento de su orden podrá
  planificarse después de completar esta trazabilidad.
