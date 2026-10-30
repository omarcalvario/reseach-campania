# Revisión del prototipo — Fase B

**Estado:** listo para revisión humana; no aprobado.

| Revisor UVP | Fecha | Decisión | Observaciones |
|---|---|---|---|
| Pendiente de asignación | — | Pendiente | Revisar dirección visual, copy, marca, jerarquía y política de medios internos. |
| Pendiente de asignación | — | Pendiente | Revisar filtros, fichas, trazabilidad, responsive y accesibilidad. |

No se atribuye aprobación ni prueba con participantes que no se haya realizado. Este prototipo no habilita desarrollo de producción ni publicación. La revisión de investigación/derechos de Fase A continúa separada.

## Correcciones técnicas previas a la revisión (2026-10-21)

Estas correcciones resuelven el arranque local y la visualización de material propio.
No sustituyen la revisión humana ni habilitan las fases C/D.

| Hallazgo | Corrección | Archivo |
|---|---|---|
| El catálogo canónico daba 404 porque el servidor se levantaba dentro de `prototype/`, fuera de la ruta que el prototipo resuelve (`../research/…`). | Lanzador `serve.sh` / `serve.command` que sirve la raíz del proyecto; detección de la URL que falló, mensaje accionable y botón “Reintentar carga”. | `prototype/serve.sh`, `prototype/serve.command`, `prototype/tools/serve.mjs`, `prototype/prototype.js` |
| Los bocetos de “Análisis de ideas” no se veían: al fallar la carga, la imagen se ocultaba sin ningún aviso, y los PNG de 2 MB ralentizaban la sección. | Previsualizaciones propias en `prototype/media/bocetos/` (1600 px, JPEG q88, 39 MB → 9,5 MB), fallback al original y aviso visible con el nombre del archivo. | `prototype/tools/build-bocetos.mjs`, `prototype/media/bocetos/manifest.json`, `prototype/prototype.js` |
| Las cargas diferidas canceladas por el navegador se confundían con imágenes rotas. | Se distingue la cancelación de un 404 real (Resource Timing + verificación HEAD) antes de ocultar o avisar. | `prototype/prototype.js` |
| El servidor se caía al cancelar peticiones de imagen durante el scroll. | Manejo de `error`/`close` en el stream de respuesta y en `clientError`. | `prototype/tools/serve.mjs` |
| 21 fichas de análisis exigían abrirlas una por una. | Control “Ver todos los bocetos” con contador de apertura. | `prototype/index.html`, `prototype/prototype.js` |
| La numeración de secciones mezclaba denominadores `/ 13` y `/ 14`. | Denominador único `/ 14` en las 14 secciones del prototipo. | `prototype/index.html` |
| No había forma de comprobar el prototipo de forma reproducible. | Smoke test en Chrome headless: `npm run check`. | `prototype/tools/check-render.mjs` |

## Comprobación local

```sh
cd prototype
npm run check    # catálogo, fichas, fuentes, imágenes de ideas y control de apertura
```

Requiere Chrome o Chromium. No requiere `npm install`: el prototipo no tiene dependencias.

Sigue pendiente la revisión de dos personas UVP, la prueba con participantes, la
revisión real en dispositivo, la auditoría automatizada WCAG y la aprobación de
publicación.
