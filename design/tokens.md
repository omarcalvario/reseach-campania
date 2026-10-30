# Tokens editoriales — prototipo Fase B

Dirección propia, pendiente de contraste con los lineamientos oficiales de marca UVP. Los valores de acento son tokens de prototipo, no colores normativos de UVP.

## Color y superficie

| Token | Valor de prototipo | Uso |
|---|---|---|
| `--ink` | `#17212B` | Texto y navegación |
| `--paper` | `#F5F6F3` | Fondo editorial |
| `--surface` | `#FFFFFF` | Paneles de datos y controles |
| `--line` | `#76838A` | Bordes y divisores que deben distinguir controles sobre superficies claras |
| `--accent` | `#2458C6` | Acción/enlace y estado activo; no único portador de significado |
| `--accent-soft` | `#E5ECFA` | Resalte secundario |
| `--cultural` | `#E9E2D3` | Campo de collage/textura, solo en secciones culturales |
| `--warning` | `#713910` | Avisos y derechos, siempre junto a texto |
| `--success` | `#174C39` | Evidencia o estado favorable, siempre acompañado por etiqueta |
| `--focus` | `var(--accent)` | Anillo de foco visible y consistente |
| `--accent-hover` | `#1B438F` | Estado hover de la acción principal |
| `--warning-surface` | `#FFF8ED` | Fondo de avisos, con texto `--warning` |
| `--warning-border` | `#B77A3A` | Borde de aviso, nunca como único indicador |

El azul `--accent` es el único acento de navegación, enlaces, selección y acción. Verde y café se reservan para estados semánticos etiquetados, no para decoración. Pares de texto/fondo se diseñan para WCAG AA: 4.5:1 en texto normal y 3:1 para texto grande y elementos gráficos pertinentes. Verificar con herramienta y en navegador antes de aprobar colores institucionales UVP.

## Tipografía y ritmo

- Display y cuerpo: sans-serif nativa del sistema, con pesos y tamaños diferenciados. Sin fuentes remotas ni dependencia de licencia durante el prototipo.
- Escala fluida con `clamp()`: título 2.5–6.6 rem; encabezado de sección 2–4 rem; cuerpo 1 rem; metadatos 0.82–0.9 rem.
- Ancho de lectura 68ch máximo; separación vertical 5–9 rem escritorio, 3.5–5 rem móvil.
- Retícula de 12 columnas en escritorio; una columna en móvil. Línea y número de sección actúan como reglas de ritmo.
- Esquinas: 2–4 px en elementos institucionales; píldoras solo para filtros/etiquetas.

## Movimiento, foco y breakpoints

- Base estática. Transiciones de feedback breves para controles; sin parallax, scroll hijack ni animación automática.
- `prefers-reduced-motion: reduce` elimina transiciones y cualquier revelado no esencial.
- Foco visible de 3 px con offset; objetivos táctiles mínimo 44×44 px.
- Puntos de decisión: 48 rem (colapso de retícula), 64 rem (navegación lateral fija y módulos amplios), 80 rem (área de contenido extendida). Verificar reflow a 360, 768 y 1280 px durante la revisión en navegador; aún no hay comprobación visual real registrada.
- No se incorpora cristal/3D en los módulos de evidencia. Los gradientes son un acento experimental de portada con alternativa sólida.
