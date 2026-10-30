#!/usr/bin/env bash
# Levanta el prototipo UVP 2027 en http://127.0.0.1:<puerto>/prototype/
#
# Importante: el servidor se inicia en la RAÍZ del proyecto ("research campaña"),
# no dentro de prototype/. El prototipo lee research/approved-campaigns.json y
# ../bocetos IA/ con rutas relativas; servir sólo prototype/ deja el catálogo y
# las imágenes en 404.
#
# Uso:  ./serve.sh [puerto]      (por defecto 8000)
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-8000}"

if command -v node >/dev/null 2>&1; then
  exec node "$DIR/tools/serve.mjs" "$PORT"
fi

echo "Node.js no disponible; se usa python3 como alternativa."
cd "$DIR/.."
exec python3 -m http.server "$PORT" --bind 127.0.0.1
