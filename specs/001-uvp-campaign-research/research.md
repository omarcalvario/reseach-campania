# Research: Referencias para la campaña UVP 2027

## Dirección visual de fuentes obligatorias

### `referencias/estilo/Post-Flat_UI_2026.pptx`

Se revisaron las 13 diapositivas visualmente. La portada presenta una retícula arquitectónica
superpuesta a un lado oscuro de grano y otro claro con capas translúcidas y malla de
gradiente. Las páginas siguientes comparan brutalismo táctil ortogonal con geometrías
fluidas/espaciales; muestran grano, capas, tipografía protagonista, módulos asimétricos y
microinteracción scroll-driven. La conclusión visual es una oposición controlada entre
estructura y fluidez, humanidad y tecnología.

**Decision**: conservar retícula, jerarquía y estructura como base; permitir textura,
transparencia, gradiente y profundidad como tratamientos de sección o acentos, nunca como
fondo universal ni sustituto de información.

**Rationale**: la investigación necesita lectura y orientación estables, mientras que los
contrastes de material pueden ayudar a separar disciplinas y niveles de contenido.

**Alternatives considered**: reproducir el lenguaje oscuro/neón/glass completo (rechazado
por carga visual, contraste y riesgo de imitación); usar interfaz plana uniforme (rechazado
por perder el carácter editorial pedido).

### `referencias/estilo/Tendencias de diseño 2026–2027 _ UVP · referencias reales.pptx`

Se revisaron las 25 diapositivas. La presentación propone minimalismo cálido; tipografía
monumental/variable; collage táctil; texturas y gradientes materiales; Y2K/brutalismo;
cristal y 3D; interfaces orientadas a tareas; bento; escalabilidad multiformato; y accesibilidad
como condición. Recomienda adoptar jerarquía, sistemas de campaña, módulos claros y
accesibilidad; probar collage, Y2K, cristal, 3D y motion por público/canal; limitar efectos que
ocultan información, animación disruptiva y variantes que diluyen identidad. Especifica
contraste WCAG AA, teclado, foco, movimiento reducido y equivalencia estática. Los ejemplos
conceptuales están identificados como creados con IA; las proyecciones 2027 son hipótesis.
Notion/Bento, Apple/Liquid Glass y Santa Teresa Festival aparecen como referencias reales
con advertencia de permisos de reutilización.

**Decision**: adoptar retícula, texto protagonista, módulos bento y principios de
accesibilidad; alternar modo humano/cultural e institucional; tratar cristal, 3D, gradientes y
motion como mejoras opcionales con alternativa estática. No convertir ejemplos conceptuales
ni predicciones en evidencia externa.

**Rationale**: alinea directamente el brief con las conclusiones de “adoptar / experimentar /
limitar” de la presentación y separa sistema visual de efectos de tendencia.

**Alternatives considered**: considerar cada tendencia un requisito visual (rechazado; el
material indica que depende del público/canal); tomar capturas de las presentaciones como
contenido del sitio (rechazado por originalidad/derechos).

## Tecnología y contenido

**Decision**: Astro 5 + TypeScript para render estático, archivos JSON/Markdown versionados,
HTML semántico y CSS; sin backend ni CMS en primera entrega.

**Rationale**: el alcance acordado es una sola página interna, catálogo finito de 36 campañas,
filtros locales y pocas interacciones. El contenido separado permite agregar casos sin
modificar componentes y no requiere fetch en runtime.

**Alternatives considered**:
- HTML/CSS/JS sin framework: viable y aún más ligero; preferible si se decide no usar
  componentes y el volumen de presentación permanece sencillo.
- Next.js: no aporta ventaja para contenido editorial estático sin autenticación, backend ni
  rutas dinámicas especificadas; incrementa superficie de dependencias.
- CMS/backend: aplazado; requiere roles, alojamiento, flujos editoriales y mantenimiento no
  establecidos en el alcance.

## Datos, filtros y derechos

**Decision**: entidad principal Campaign con una o más Piece; cada afirmación puede enlazarse
a Source; separar etiquetas editoriales, estado de evidencia y estado de derechos.

**Rationale**: una campaña puede tener piezas y autores distintos; atribución y permisos se
deben mantener a nivel de pieza. Dato/interpretación/propuesta son tipos de contenido, no
estados de éxito. El filtro de evidencia necesita su propio campo.

**Alternatives considered**: una fila plana por pieza (duplica datos de campaña); crédito
único por campaña (pierde atribución individual); booleano “éxito” (fomenta inferencias no
respaldadas).

## Medios y accesibilidad

**Decision**: enlaces y miniaturas locales aprobadas como valor predeterminado; video con
miniatura enlazada o embed bajo demanda; captura solo para revisión interna; alt text y
dimensiones reservadas; carga diferida fuera del primer viewport.

**Rationale**: reduce riesgos de permiso, transferencia y movimiento inesperado, y permite
leer el análisis incluso si la fuente externa deja de estar disponible.

**Alternatives considered**: auto-play/descarga de videos (rechazado por accesibilidad,
rendimiento y derechos); capturas indiscriminadas (rechazadas por derechos y privacidad).

## Supuestos de planificación

- 36 casos en grupos 12 global / 12 México / 12 Puebla o contexto regional; idioma español;
  audiencias aspirantes, madres/padres, estudiantes actuales y empleadores.
- Los responsables UVP aprobarán lineamientos de marca, exactitud de casos y estado de uso
  antes de publicar. Sus nombres/roles concretos no están definidos; asignación operativa
  para la fase de trabajo.
- La viabilidad de hosting, navegadores corporativos, presupuesto y licencias tipográficas
  debe confirmarse antes de implementación. No bloquea este diseño estático.
- WCAG 2.2 AA es objetivo del plan; las métricas de rendimiento son objetivos por validar,
  no resultados medidos.
