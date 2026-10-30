# Implementation Plan: Referencias para la campaña UVP 2027

**Branch**: `001-uvp-campaign-research` | **Date**: 2026-10-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-uvp-campaign-research/spec.md`

## Summary

Diseñar una publicación editorial estática en español, de una sola página y fácil de
actualizar por contenido, para que Imagen Gráfica de UVP explore, filtre y compare
referencias universitarias verificables. La dirección combina retícula editorial, escala
tipográfica y módulos claros con modos humanos y experimentales subordinados a legibilidad,
accesibilidad y derechos. La tecnología aprobada es Astro con TypeScript; el contenido
aprobado se mantiene en JSON canónico y la aplicación estática se genera desde esa fuente.

## Hallazgos de las referencias visuales obligatorias

Se revisaron visualmente ambas presentaciones. `Post-Flat_UI_2026.pptx` (13 diapositivas)
contrapone una retícula arquitectónica visible y bordes geométricos con grano humano,
capas translúcidas, degradados fluidos y profundidad espacial. Su síntesis propone tensión
entre lo táctil/ortogonal y lo fluido/espacial, con tipografía como interfaz. Se traduce en
una retícula estructural constante con tratamientos de sección variables; no se copiarán
composiciones ni imágenes de las diapositivas.

`Tendencias de diseño 2026–2027 _ UVP · referencias reales.pptx` establece jerarquía
tipográfica, sistemas que escalan entre formatos, bento adaptable, minimalismo cálido,
tipografía variable, collage táctil y uso moderado de cristal, 3D y motion. Propone adoptar
jerarquía, sistemas y accesibilidad; experimentar con efectos; limitar animación que
interrumpe, efectos que ocultan información y variaciones que diluyen identidad. La
accesibilidad incluye contraste WCAG AA, teclado, foco, reducción de movimiento y señales
que no dependan solo del color. Sus pantallas conceptuales están marcadas como generadas
con IA, sus proyecciones 2027 como hipótesis y sus referencias reales (Notion, Apple,
Santa Teresa Festival) como material sujeto a permisos: sirven como análisis, no como
activos reutilizables.

## Technical Context

**Language/Version**: TypeScript 5.x; contenido JSON UTF-8.

**Primary Dependencies**: Astro 5.x con TypeScript para generación estática; HTML semántico y
CSS; evitar dependencias de interfaz cliente salvo que una interacción lo requiera. Esta
decisión queda aprobada (no es una alternativa pendiente).

**Storage**: `research/candidates.json` contiene candidatas e investigación inicial;
`research/approved-campaigns.json` es la fuente canónica de referencias aprobadas;
`contracts/campaign-content.schema.json` valida ambos. `src/data/campaigns.json` se genera
desde el archivo aprobado y no se edita manualmente. `src/content/` contiene solo textos
editoriales de la página, sin duplicar datos de campañas. Sin base de datos ni servicio
externo en tiempo de ejecución.

**Testing**: Validación de schema e integridad de IDs, URLs, créditos, estados de uso y
referencias cruzadas; revisión obligatoria de la matriz de cobertura antes de aprobar
candidatas; pruebas de filtros y enlaces; revisión manual de teclado, contraste y reducción
de movimiento; prueba de build estático; prueba SC-002 con cinco personas por ronda; revisión
responsive a 360, 768 y 1280 px; LCP/CLS con Lighthouse móvil (cuatro ejecuciones en build de
producción local y mediana) e INP con web-vitals (cuatro interacciones reales de filtro en
vista previa local y mediana).

**Target Platform**: Navegadores modernos en escritorio, tablet y móvil; alojamiento como
sitio estático.

**Project Type**: Sitio web editorial estático, una página con navegación por anclas y
filtros locales.

**Performance Goals**: LCP ≤ 2.5 s, INP ≤ 200 ms y CLS ≤ 0.1. Protocolo obligatorio: medir
LCP y CLS con Lighthouse móvil sobre compilación de producción local en cuatro ejecuciones y
registrar mediana; medir INP con web-vitals en vista previa local mediante cuatro
interacciones reales sobre filtros y registrar mediana. Registrar dispositivo/emulación,
navegador/versión, fecha y red simulada. Repetir cualquier medición ausente con el mismo
método; si sigue sin medición válida, bloquear publicación. No usar Lighthouse para medir INP.
Evitar video autoplay y diferir imágenes no críticas.

**Constraints**: WCAG 2.2 AA como objetivo; cero recursos externos necesarios para el
render inicial; medios externos por enlace o embed consentido; ningún recurso sin crédito,
URL y estado de derechos. No publicar material restringido.

**Scale/Scope**: meta de búsqueda de 36 candidatas (12 globales, 12 de México y 12 de
Puebla/contexto regional), no cuota de publicación. Solo se publican campañas con existencia
y fuente primaria o confiable verificadas; evidencia de resultados es independiente y puede
ser “Resultado no verificable”. Los vacíos regionales se documentan. Cada campaña agrupa
piezas, fuentes y aprendizajes; créditos, URLs y derechos permanecen por pieza. Español.
Audiencias de análisis: aspirantes, madres/padres, estudiantes actuales y empleadores.

## Constitution Check

| Principio | Decisión de diseño | Estado |
|---|---|---|
| Investigación editorial útil | Presentación de una página, jerarquía visual, galería y comparación | PASS |
| Evidencia trazable | Metadatos por fuente y pieza, estados de acceso y resultados | PASS |
| Separar evidencia e interpretación | Cuatro etiquetas editoriales persistentes | PASS |
| Originalidad y uso responsable | No copiar piezas; capturas internas y permisos explícitos | PASS |
| Referencias visuales obligatorias | Síntesis examinada; traducción propia, no reproducción | PASS |
| Accesibilidad y experiencia | Contraste, teclado, foco, móvil y movimiento reducido | PASS |

No se identifica una excepción a la constitución. El objetivo WCAG se concreta en pruebas
de contraste, control por teclado, foco visible y contenido no dependiente de color/motion.

## Research Summary

Decisiones de arquitectura, contenido y dirección visual detalladas en [research.md](research.md).
Las únicas fuentes visuales obligatorias son las dos presentaciones locales ya revisadas;
las fuentes citadas dentro de ellas se tratarán como pistas que requieren verificación propia
antes de afirmar hechos o reutilizar material.

## Design Overview

### 1. Arquitectura de información y orden editorial

1. Portada.
2. Objetivo y alcance.
3. Metodología y criterios.
4. Tendencias 2026–2027.
5. Panorama global.
6. Panorama México.
7. Panorama Puebla y contexto regional.
8. Galería visual y filtros.
9. Fichas de campañas.
10. Aciertos, limitaciones y errores.
11. Biblioteca para gráfica, audiovisual y web.
12. Rutas creativas UVP 2027.
13. Fuentes, créditos y derechos.

La leyenda editorial (Dato verificado, Interpretación, Propuesta para UVP y Resultado no
verificable) se presenta en metodología y se aplica en todas las secciones pertinentes.

### 2. Navegación y filtros

Navegación superior por anclas a las 13 secciones, con omisión al contenido principal. La
unidad de resultado principal es campaña; cada tarjeta/ficha agrupa piezas individuales. Los
filtros obligatorios son región, formato y disciplina; evidencia y aprendizaje son filtros
adicionales. Los grupos se combinan con AND y los valores de un mismo grupo con OR. Mostrar
cantidad de campañas, chips removibles, acción “limpiar filtros” y estado vacío. Cada pieza
conserva crédito, URL y derechos propios. La URL fragment/hash conserva la sección; no se
requiere persistencia de datos en servidor.

### 3. Sistema editorial y dirección de arte

**Base**: retícula de columnas visible como regla de composición, no como ruido; títulos
grandes y contraste claro entre encabezados y texto de lectura; módulos bento asimétricos
con función identificable; márgenes generosos; navegación directa; superficies lisas para
datos, filtros, fechas, créditos y CTA.

**Modo humano/cultural**: fotografía con autoría y contexto, collage y textura en portadas,
aprendizajes culturales o rutas creativas; trazos/imperfecto con una zona limpia para datos.

**Modo institucional/conversión**: retícula estricta, etiquetas consistentes, navegación
predecible, llamadas descriptivas y formularios solo si existe una tarea real de contacto o
solicitud (no se añade formulario al catálogo por decoración).

**Modo experimental**: cristal, gradientes, 3D, interfaz líquida y motion solo para señalar
relaciones, profundidad o transición. Alternativa estática disponible; no aplicar a párrafos,
etiquetas probatorias ni controles si reduce contraste o reconocimiento.

**Color**: usar tokens de marca UVP solo tras contrastarlos con lineamientos oficiales; no
extraer una paleta normativa de ejemplos conceptuales. Mantener pares texto/fondo con
contraste WCAG AA (4.5:1 texto normal, 3:1 texto grande y elementos gráficos relevantes).
Etiquetas se diferencian también por texto/icono, nunca solo por color.

**Tipografía**: familia sans legible para interfaz/cuerpo, display de marca para títulos y
posible serif/mono como acento editorial; fuentes con licencia clara y fallback local.
Validar caracteres españoles, tamaños móviles y ampliación.

**Ritmo**: alternar dobles páginas visuales, mosaicos de catálogo, fichas densas y pausas
monocromas. No convertir cada sección en tarjeta. Fotografía prioritaria solo cuando sea
propia o exista permiso; capturas de referencia se restringen al uso interno aprobado.

### 4. Estructura de ficha

**Campaña**: institución; nombre y fecha/contexto; región/país; objetivo y públicos; mensaje,
tono y concepto; CTA; evidencia y limitaciones; resultado verificable o “resultado no
verificable”; síntesis comparativa; campos aprovechar/evitar/aplicación; enlaces a piezas,
tendencias y fuentes.

**Pieza**: formato y disciplina; canal; descripción visual; análisis de mensaje, audiencia,
estilo, tipografía, color, imagen/ilustración, composición, sistema, CTA, adecuación al canal,
interacción/motion si existe; miniatura/captura o enlace; texto alternativo; crédito propio,
URL, fecha de consulta y estado/nota de uso.

Las afirmaciones se marcan por fragmento con etiquetas visibles. Las fuentes contradictorias
se muestran juntas con la discrepancia descrita y sin resolverla artificialmente.

### 5. Estrategia de investigación, verificación y derechos

1. Registrar una pista y clasificar región, objetivo, público, formato y disciplina.
2. Buscar fuente primaria: universidad/campaña/canal oficial; corroborar con agencia,
   premio, medio especializado o archivo web confiable cuando sea necesario.
3. Registrar título, autor/organización, URL, fecha de publicación si existe y fecha de
   consulta. Verificar que la fuente respalde exactamente la afirmación asociada.
4. Ante liga inaccesible, conservar URL original, fecha y estado “inaccesible” o “contenido
   retirado”; no usar como sustento. Si fuentes discrepan, documentar cada una y suspender
   conclusión definitiva.
5. No inferir éxito por estética, popularidad o prestigio. Sin métricas/recepción confiable,
   declarar “resultado no verificable”; incluir resultados limitados o controversias si hay
   documentación confiable y contexto suficiente.
6. Atribuir crédito por pieza, no solo por campaña: marca, autor/agencia si se conoce,
   título, URL, tipo de uso y estado (enlace de referencia, captura interna, reutilizable
   con permiso, no reutilizable). Ningún recurso externo se integra en campaña UVP sin permiso.
7. Capturas solo para revisión interna permitida; usar enlace y descripción analítica en
   publicación. La propuesta UVP debe ser traducción visual original, no derivación copiada.

### 6. Estrategia de medios y responsive

Imágenes servidas como miniaturas locales optimizadas solo si el uso está autorizado; enlace
a original y crédito junto al material; texto alternativo describe función/contenido, vacío
para decoración. Lazy-load para medios fuera de primer viewport, dimensiones reservadas para
evitar CLS, formatos modernos con fallback. Video no inicia automáticamente: preferir
miniatura enlazada; embed bajo demanda con título accesible, subtítulos/transcripción cuando
estén disponibles y enlace externo alternativo. Nunca descargar ni republicar video sin
permiso.

En móvil, navegación compacta pero operable, filtros en panel/lista con etiquetas visibles,
tarjetas en una columna, tablas comparativas convertidas a bloques con encabezados repetidos,
orden de lectura lineal y medios fluidos. Sin desplazamiento horizontal de página; cualquier
tabla debe tener alternativa accesible.

### 7. Accesibilidad, privacidad y rendimiento

HTML semántico, orden lógico de encabezados, landmarks, enlace de salto, controles nativos,
etiquetas asociadas y estados anunciables; teclado completo y foco visible no tapado. Contraste
WCAG 2.2 AA; información no codificada solo por color; zoom/reflow; alt text contextual;
subtítulos/transcripción en video cuando existan. Respetar `prefers-reduced-motion` y ofrecer
contenido estático equivalente. Evitar tracking, formularios y datos personales innecesarios.

Rendimiento: sitio pre-renderizado, CSS/JS mínimo, imágenes dimensionadas, carga diferida,
sin auto-play ni dependencias de terceros para leer contenido. Medir LCP/INP/CLS en móvil y
revisar peso de página en entrega; el plan no presupone números de laboratorio no medidos.

### 8. Tecnología y actualización editorial

Decisión aprobada: Astro + TypeScript, sitio estático con componentes pequeños y funcionalidad
de filtrado cliente limitada al catálogo; CSS propio y datos locales. No hay razón actual para
backend/CMS: la publicación es estática, se mantiene por el equipo y no requiere autenticación.

Archivos editoriales previstos: `src/data/campaigns.json` para campañas y piezas, generado
desde `research/approved-campaigns.json` y no editable manualmente; `src/data/tendencias.json`
para tendencias; y `src/content/` únicamente para copy editorial y textos de secciones, sin
duplicar datos de campañas. `public/media/` contiene solo medios con permiso y
`public/media/credits.json` conserva metadatos y derechos. El flujo de edición debe incluir
guía, validación de campos/enlaces y revisión humana antes de publicar. El equipo puede
agregar entradas con archivos, sin modificar lógica de página.

### 9. Tabla editorial de las 13 secciones oficiales

| Sección | Objetivo | Contenido | Referencias visuales | Interacción | Riesgo a evitar |
|---|---|---|---|---|---|
| 1. Portada | Orientar | Título y acceso a explorar | Retícula y contraste Post-Flat | Saltar a contenido | Hero abstracto sin propósito |
| 2. Objetivo y alcance | Aclarar propósito y cobertura | Equipo, audiencia, meta de búsqueda y vacíos | Tipografía protagonista | Ancla a método | Presentar meta como cuota publicada |
| 3. Metodología y criterios | Explicar rigor | Fuentes, verificación y etiquetas | Jerarquía institucional | Navegar criterios | Mezclar evidencia y opinión |
| 4. Tendencias 2026–2027 | Dar marco visual | Señales, aplicación y cautelas | Tipografía, bento, collage y acentos | Explorar por disciplina | Tratar hipótesis como hecho |
| 5. Panorama global | Exponer cobertura | Candidatas, aprobadas y vacíos | Bento modular | Saltar a región | Rellenar con fuentes débiles |
| 6. Panorama México | Exponer cobertura | Candidatas, aprobadas y vacíos | Módulos editoriales | Saltar a región | Implicar representatividad total |
| 7. Panorama Puebla y contexto regional | Contextualizar región | Candidatas, aprobadas y vacíos | Tratamiento cultural con evidencia clara | Saltar a región | Forzar equivalencia geográfica |
| 8. Galería visual y filtros | Descubrir campañas | Tarjetas y etiquetas | Mosaico adaptativo | Filtros combinables | No mostrar contador/estado vacío |
| 9. Fichas de campañas | Analizar casos y piezas | Contexto, evidencia, análisis, créditos | Editorial con zonas de lectura | Abrir fuentes/piezas | Omitir derechos por pieza |
| 10. Aciertos, limitaciones y errores | Comparar aprendizajes | Evidencia y cautelas | Retícula comparativa | Referencias cruzadas | Comparar resultados incompatibles |
| 11. Biblioteca para gráfica, audiovisual y web | Consultar piezas | Recursos y análisis por disciplina | Medios con pies/créditos | Filtrar/enlazar | Publicar recursos no autorizados |
| 12. Rutas creativas UVP 2027 | Abrir exploración | Tres propuestas originales | Tres tratamientos sobre sistema común | Recorrer rutas | Confundir propuesta con decisión |
| 13. Fuentes, créditos y derechos | Permitir auditoría | URLs, autoría, fecha y uso | Índice utilitario legible | Enlaces externos | Fuente sin contexto o permiso |

## Implementation Phases and Acceptance Criteria

### Fase A — Investigación, validación y catálogo

**Entregables**: lectura documentada de PPTX; `research/candidates.json` con hasta la meta de
36 candidatas (12 por región); `research/matriz-cobertura.md`; `research/approved-campaigns.json`
con campañas aprobadas y verificadas; inventario de fuentes, fichas de campaña/pieza, análisis,
créditos, derechos, discrepancias, vacíos regionales y estados independientes de evidencia de
resultados.

**Aceptación medible**: se documenta el resultado de búsqueda frente a la meta 12/12/12; no
se exige publicar 36 campañas. `research/matriz-cobertura.md` registra todos los tipos de
campaña FR-003 y formatos FR-004, con referencias encontradas, fuente, región y estado; cuando
no haya evidencia válida indica “sin referencia verificada disponible”. La revisión de la
matriz es obligatoria antes de aprobar candidatas: se comprueba que estén todas las categorías,
que cada referencia tenga fuente verificable y que cada vacío esté declarado, sin fuentes
débiles. 100% de campañas aprobadas tiene existencia y fuente primaria o confiable verificadas.
Evidencia de resultados se evalúa por separado: toda afirmación de éxito está respaldada o
marcada “Resultado no verificable”. Los vacíos regionales y URLs no disponibles se documentan.
Las candidatas y aprobadas validan contra el schema y reglas de integridad antes de avanzar;
Los permisos de uso se aprueban mediante revisión humana antes de reproducir cualquier recurso.

### Fase B — Sistema editorial y prototipo

**Entregables**: dirección de arte, tokens y reglas, navegación, filtros, galería, estados,
ficha y prototipo responsive.

**Aceptación medible**: prototipo incluye las 13 secciones oficiales en orden; resultados de
galería son campañas y filtros requeridos/adicionales tienen feedback/estado vacío; dos
revisores UVP aprueban jerarquía y dirección visual; revisión a 360, 768 y 1280 px sin pérdida
de contenido ni overflow horizontal; contraste de pares texto/fondo cumple WCAG AA.

### Fase C — Desarrollo e integración

**Entregables**: página estática, contenido estructurado, vínculos y guía para añadir entradas.

**Aceptación medible**: build Astro estático produce página sin llamadas de datos requeridas
en runtime. `src/data/campaigns.json` se genera desde `research/approved-campaigns.json` y
no se edita manualmente; `src/content/` no duplica registros. La galería filtra campañas por
región, formato y disciplina, con evidencia/aprendizaje como filtros adicionales. Candidatas
y aprobadas validan contra el contrato y reglas de IDs, URLs, créditos, estados de uso y
referencias cruzadas; cualquier inválido bloquea aprobación/publicación.

### Fase D — Revisión, accesibilidad y entrega

**Entregables**: revisión editorial/derechos, auditoría de teclado y contraste, revisión
responsive a 360/768/1280 px, prueba de usabilidad con cinco personas, medición de rendimiento
reproducible y documentación de entrega.

**Prueba de usabilidad SC-002 (único protocolo)**: realizar cada ronda con exactamente cinco
participantes. Sin asistencia, cada persona debe localizar una referencia con filtros de
región y formato en menos de dos minutos, interpretar correctamente las etiquetas editoriales
y localizar la fuente de la referencia elegida. Registrar por participante el escenario, ID
anonimizado, dispositivo, tarea, tiempo, resultado, problemas y conclusión. La ronda aprueba
solo si al menos 4/5 completan las tres acciones sin asistencia. Si una ronda falla, registrar
problemas y correcciones y ejecutar una segunda ronda obligatoria con cinco participantes; la
ronda final debe alcanzar nuevamente 4/5. Si no lo hace, bloquear publicación.

**Protocolo de rendimiento SC-007 (obligatorio)**: medir LCP y CLS con Lighthouse móvil sobre
compilación de producción local, cuatro ejecuciones y mediana. Medir INP con web-vitals en
vista previa local, ejecutando cuatro interacciones reales sobre filtros y registrando la
mediana. Registrar dispositivo/emulación, navegador/versión, fecha y red simulada para cada
método. Repetir una medición ausente con su mismo método; si continúa sin medición válida,
bloquear publicación. Umbrales: LCP ≤2.5 s, INP ≤200 ms y CLS ≤0.1.

**Aceptación medible**: navegación/filtrado usable por teclado con foco visible; reducción de
movimiento preserva contenido; contraste WCAG AA; sin pérdida ni overflow horizontal a
360/768/1280 px. SC-002 aprueba únicamente cuando la ronda final cumple al menos 4/5 en las
tres acciones sin asistencia; de lo contrario la publicación queda bloqueada. SC-007 sigue
exactamente el protocolo Lighthouse para LCP/CLS y web-vitals para INP; una métrica sin
medición válida tras repetir el método bloquea publicación. Umbrales: LCP ≤2.5 s, INP ≤200 ms,
CLS ≤0.1. Cero recursos sin crédito/estado de uso; aprobaciones humanas de datos, fuentes y
dirección de arte registradas.

## Constitution Check (Post-Design)

| Regla | Verificación del plan | Estado |
|---|---|---|
| Cada referencia lleva trazabilidad y aprendizaje | Entidades y protocolo lo exigen por pieza | PASS |
| No inventar ni copiar | Evidencia, incertidumbre y derechos son puertas de aceptación | PASS |
| Diferenciar dato, interpretación y propuesta | Etiquetas editoriales explícitas en modelo y UI | PASS |
| Presentaciones obligatorias guían el diseño | Se analizaron ambas; se prohíbe reproducción literal | PASS |
| Accesibilidad en toda interacción | Contraste, teclado, foco, alt, móvil y movimiento reducido | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/001-uvp-campaign-research/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── campaign-content.schema.json
```

### Source Code (repository root; planned, not created by this planning command)

```text
src/
├── pages/index.astro
├── components/           # navegación, filtros, tarjetas, fichas, etiquetas
├── data/
│   ├── campaigns.json          # generado desde research/approved-campaigns.json; no editar
│   └── tendencias.json
├── content/
│   └── editorial copy only     # sin duplicar datos de campañas
├── styles/
│   ├── tokens.css
│   └── global.css
└── scripts/filters.ts
public/media/              # solo material con uso autorizado
public/media/credits.json
research/
├── candidates.json             # candidatas e investigación inicial
└── approved-campaigns.json     # fuente canónica de publicación
contracts/campaign-content.schema.json # valida ambos archivos de investigación
```

**Structure Decision**: Proyecto único Astro + TypeScript, generación estática, sin backend.
La fuente editorial canónica aprobada vive en `research/approved-campaigns.json`; la salida
de publicación `src/data/campaigns.json` se genera y no se edita. `src/content/` es solo para
copy editorial. Las rutas describen la arquitectura planeada, no archivos de aplicación
creados por este plan.

## Complexity Tracking

Sin desviaciones que requieran justificación.
