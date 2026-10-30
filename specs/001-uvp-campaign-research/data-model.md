# Data Model: Referencias para la campaña UVP 2027

Este modelo describe contenido editorial estático y sus relaciones. Los valores no
disponibles se expresan explícitamente; no se rellenan mediante inferencia.

## Campaign

Representa una iniciativa de una universidad/marca; tiene una ficha estable aunque contenga
varias piezas.

| Campo | Tipo | Regla |
|---|---|---|
| id | string | Obligatorio, único, slug estable |
| institution | string | Obligatorio |
| campaignTitle | string | Obligatorio |
| region | enum | `global`, `mexico`, `puebla-regional` |
| country | string | Obligatorio; usar país verificable |
| city | string/null | Opcional; Puebla/región incluye ciudad cuando se conoce |
| dateLabel | string | Obligatorio; declarar aproximación si aplica |
| objective | string | Obligatorio o marcar no localizado |
| audiences | string[] | Aspirantes, madres/padres, estudiantes, empleadores u otro documentado |
| message | string | Mensaje documentado; vincular fuentes |
| tone | string | Análisis etiquetado Interpretación si no es declaración oficial |
| concept | string | Dato o interpretación claramente etiquetados |
| callToAction | string/null | CTA de campaña cuando se identifica |
| campaignType | string[] | Admisión, posicionamiento, empleabilidad, innovación, comunidad, cultura, investigación, vida estudiantil |
| evidenceStatus | enum | `verified`, `limited`, `not-verifiable`, `disputed` |
| resultSummary | string | Fuente o “resultado no verificable”; no inferir éxito |
| limitations | string[] | Incertidumbres, errores o límites documentados |
| learnings | Learning[] | Relación a aprendizajes aplicables |
| pieceIds | string[] | Una o más piezas |
| sourceIds | string[] | Fuentes pertinentes a nivel campaña |

## Piece

Recurso individual perteneciente a una Campaign. Crédito, URL y uso son propios de cada pieza.

| Campo | Tipo | Regla |
|---|---|---|
| id | string | Obligatorio y único |
| campaignId | string | Obligatorio; referencia Campaign.id |
| title | string | Obligatorio |
| format | enum/string | Gráfica, landing, sitio, video, reel, motion, social, activación, caso, premio u otro |
| discipline | enum | `graphic`, `audiovisual`, `web`, `cross-disciplinary` |
| channel | string | Obligatorio si se conoce |
| visualObservation | string | Observación formal; análisis interpretativo etiquetado |
| analysis | VisualAnalysis | Mensaje, audiencia, estilo, tipografía, color, imagen, composición, sistema, CTA, canal; motion/interacción si existe |
| sourceIds | string[] | Una o más fuentes que documentan la pieza |
| credit | Credit | Marca, título, autoría conocida, URL, tipo de uso y estado |
| media | MediaReference/null | Solo archivo local con permiso o URL externa |
| altText | string/null | Descripción significativa; no sustituye crédito |

## VisualAnalysis

Campos requeridos: `message`, `audience`, `style`, `typography`, `color`, `photographyOrIllustration`,
`composition`, `pieceSystem`, `callToAction`, `channelFit`. `interaction` y `motion` son
opcionales; su ausencia se etiqueta “no identificada” cuando aplica.

## Source

| Campo | Tipo | Regla |
|---|---|---|
| id | string | Único |
| title | string | Obligatorio |
| authorOrganization | string/null | Registrar si se conoce |
| sourceType | enum | Oficial universidad/campaña, agencia, medio especializado, premio, canal oficial de video, archivo web confiable |
| url | URI | URL original obligatoria |
| publishedAt | string/null | Fecha original si existe |
| consultedAt | date | Obligatoria ISO 8601 |
| accessStatus | enum | `accessible`, `inaccessible`, `removed`, `unknown` |
| discrepancyNote | string/null | Describe conflicto con otras fuentes |
| supports | string[] | Afirmaciones que respalda; fuente inaccesible no respalda claims |

## Credit and Rights

Cada Piece lleva su propio crédito: `brand`, `creatorOrAgency` nullable, `workTitle`, `url`,
`useType` y `rightsStatus` (`reference-link`, `internal-review-capture`,
`reusable-with-permission`, `not-reusable`), `permissionEvidence` nullable y `useNote`.
Ningún activo se publica como recurso UVP sin autorización documentada. `internal-review-capture`
no concede derecho de publicación.

## Trend

`id`, `title`, `discipline[]`, `period`, `observation`, `evidenceLabel`, `sources[]`,
`uvpRelevance`, `risk`, `confidence` (`documented`, `hypothesis`) y `visualReferences[]`.
Las predicciones para 2027 permanecen como hipótesis hasta ser corroboradas.

## Learning

`id`, `principle`, `takeaway`, `avoidanceRisk`, `application` (una o más de gráfica,
audiovisual, web), `label` (`Interpretación` o `Propuesta para UVP`) y `sourceIds[]`/`campaignIds[]`.

## Etiquetas editoriales

- `Dato verificado`: afirmación respaldada por fuente accesible que la sustenta.
- `Interpretación`: análisis editorial derivado de una o más piezas; no se presenta como cita.
- `Propuesta para UVP`: hipótesis original que el equipo puede evaluar.
- `Resultado no verificable`: no hay métricas/recepción/resultados fiables; no equivale a fracaso.

## Relaciones y validaciones

- Campaign 1:N Piece; Campaign N:N Source; Piece N:N Source; Piece 1:1 Credit.
- Campaign N:N Learning; Trend N:N Source; Learning puede apuntar a Campaigns.
- Una fuente `inaccessible` o `removed` puede mantenerse como pista, pero sus `supports` no
  pueden justificar una afirmación.
- `verified` exige al menos una fuente accesible relevante; de lo contrario el estado es
  `limited`, `not-verifiable` o `disputed`.
- Cada pieza requiere disciplina, URL, nota de uso y crédito; assets locales exigen estado
  `reusable-with-permission` con evidencia de permiso o autorización interna explícita.
