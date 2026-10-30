#!/usr/bin/env bash
# Doble clic en macOS: inicia el prototipo y abre el navegador.
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$DIR/serve.sh" 8000
echo ""
echo "Servidor detenido. Puedes cerrar esta ventana."
read -r -p "Pulsa Enter para salir… " _ || true
