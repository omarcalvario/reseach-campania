# Prototipo interno — UVP 2027

Este prototipo es una sola presentación editorial con 14 secciones, navegación vertical responsive, filtros locales, fichas trazables, comparativa, biblioteca, análisis de ideas y propuestas creativas. Lee campañas/piezas/fuentes/aprendizajes desde `research/approved-campaigns.json` en modo solo lectura.

## Abrir localmente (recomendado)

Desde `prototype/`:

```sh
./serve.sh          # o: npm start
```

El script levanta el servidor **en la raíz del proyecto** (`research campaña`), no dentro de `prototype/`, y abre `http://127.0.0.1:8000/prototype/`. Se puede indicar otro puerto: `./serve.sh 8123`.

Alternativa sin Node.js (desde la raíz del proyecto):

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

No abras el HTML con `file://`: el navegador bloquea el fetch local del JSON. Mantén el servidor ligado a localhost; no publiques ni expongas esta carpeta a una red pública.

### Por qué importa la raíz del proyecto

El prototipo resuelve el catálogo canónico y los bocetos con rutas relativas (`../research/approved-campaigns.json`, `../bocetos IA/…`). Si el servidor se levanta **dentro de `prototype/`**, esas rutas caen fuera del sitio servido y el catálogo responde 404.

En ese caso la página lo detecta y lo explica: en lugar de un mensaje genérico muestra la URL que se buscó y el comando exacto que hay que ejecutar. El botón “Reintentar carga” vuelve a intentarlo sin recargar la página.

La sección “Análisis de ideas” sí funciona en ambos casos: usa las previsualizaciones optimizadas de `prototype/media/bocetos/`, que viven dentro del prototipo.

## Herramientas

| Comando | Qué hace |
|---|---|
| `npm start` / `./serve.sh [puerto]` | Servidor local en la raíz del proyecto y abre el navegador. |
| `npm run check` | Smoke test en Chrome headless: catálogo, fichas, fuentes e imágenes de ideas. Devuelve error si algo no renderiza. |
| `npm run build:bocetos` | Regenera `prototype/media/bocetos/` (JPEG 1600 px) a partir de los originales en `bocetos IA/`. |

`npm run check` necesita Chrome o Chromium instalado. No requiere `npm install`: el proyecto no tiene dependencias.

## Política de referencia

- El prototipo muestra estado **Solo análisis interno** y la nota de no reutilización en fichas/piezas.
- `referencias-graficas.json` contiene URLs remotas de imágenes atribuidas a sus páginas fuente. El navegador las solicita directamente a esos dominios; no se descargan ni se copian a `assets/` del proyecto.
- Las URLs remotas pueden cambiar, bloquear hotlinking o dejar de estar disponibles. La tarjeta conserva el enlace fuente y señala si se requiere captura manual. Una URL pública o miniatura no concede derechos de reutilización.
- Las tarjetas visuales muestran **Solo análisis interno** y **No reutilizable para campaña UVP**, junto con institución/campaña, fuente/URL, crédito, observación, aprendizaje y riesgo.
- Comparaciones A/B se presentan como aplicaciones/detalles del mismo caso, no como secuencia temporal "antes/después" salvo que la fuente documente esa cronología.
- Se permiten capturas contextuales solo para este análisis interno y con crédito visible, conforme a `design/politica-uso-referencias.md`; el usuario debe gestionar manualmente la captura autorizada y nunca copiarla a una pieza UVP.
- `research/approved-campaigns.json` permanece como fuente canónica de solo lectura; el catálogo visual de esta ampliación vive únicamente en `prototype/referencias-graficas.json`.

## Bocetos IA (material propio del proyecto)

- `bocetos IA/` contiene los originales y es la fuente de la pieza.
- `prototype/media/bocetos/` contiene previsualizaciones derivadas (1600 px, JPEG q88) para que la sección cargue rápido. `media/bocetos/manifest.json` registra la derivación de cada archivo.
- El visor ampliado abre el original cuando está disponible y, si no, la previsualización.
- Si un boceto no carga, la tarjeta lo dice con el nombre del archivo en lugar de dejar un espacio vacío.

## Revisión pendiente

Dirección visual, exactitud y uso interno deben ser revisados por dos personas UVP. No se han realizado pruebas con participantes, revisión real en dispositivo, auditoría automatizada WCAG ni aprobación de publicación. El prototipo no autoriza las fases C/D.
