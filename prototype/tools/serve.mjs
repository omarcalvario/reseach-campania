#!/usr/bin/env node
/**
 * Servidor estático local para el prototipo UVP 2027.
 *
 * Sirve la RAÍZ del proyecto ("research campaña") y no la carpeta `prototype/`,
 * porque el prototipo resuelve datos canónicos y bocetos propios con rutas
 * relativas (`../research/approved-campaigns.json`, `../bocetos IA/…`).
 * Servir sólo `prototype/` provoca 404 y deja el catálogo y las imágenes fuera.
 *
 * Uso: node tools/serve.mjs [puerto]
 */
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { spawn } from "node:child_process";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(here, "../..");
const prototypeDir = join(projectRoot, "prototype");
const port = Number(process.argv[2] || process.env.PORT || 8000);
const shouldOpen = !process.argv.includes("--no-open") && process.env.NO_OPEN !== "1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function safePath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const target = resolve(join(projectRoot, normalize(decoded)));
  if (target !== projectRoot && !target.startsWith(projectRoot + sep)) return null;
  return target;
}

function sendText(response, status, body) {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(body);
}

function sendFile(response, filePath, status = 200, method = "GET") {
  const stats = statSync(filePath);
  response.writeHead(status, {
    "Content-Type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream",
    "Content-Length": stats.size,
    "Cache-Control": "no-cache"
  });
  if (method === "HEAD") {
    response.end();
    return;
  }
  // El navegador cancela peticiones diferidas al hacer scroll: el corte no
  // debe tumbar el servidor ni dejar la respuesta a medias.
  const stream = createReadStream(filePath);
  stream.on("error", () => response.destroy());
  response.on("close", () => stream.destroy());
  stream.pipe(response);
}

const server = createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  if (url.pathname === "/" || url.pathname === "") {
    response.writeHead(302, { Location: "/prototype/" });
    response.end();
    return;
  }
  const target = safePath(url.pathname);
  if (!target) {
    sendText(response, 403, "Ruta fuera del proyecto.");
    return;
  }
  let filePath = target;
  try {
    if (statSync(filePath).isDirectory()) filePath = join(filePath, "index.html");
    statSync(filePath);
  } catch {
    sendText(response, 404, `No encontrado: ${url.pathname}`);
    return;
  }
  try {
    sendFile(response, filePath, 200, request.method === "HEAD" ? "HEAD" : "GET");
  } catch (error) {
    sendText(response, 500, `Error leyendo ${url.pathname}: ${error.message}`);
  }
});

server.on("clientError", (error, socket) => {
  if (socket.writable) socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(port, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${port}/prototype/`;
  console.log(`Prototipo UVP 2027 servido desde la raíz del proyecto:`);
  console.log(`  ${url}`);
  console.log(`  Datos canónicos: ${join(projectRoot, "research", "approved-campaigns.json")}`);
  if (shouldOpen) {
    const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
    spawn(opener, [url], { stdio: "ignore", detached: true }).unref();
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`El puerto ${port} ya está ocupado. Prueba con: ./serve.sh ${port + 1}`);
    process.exit(1);
  }
  throw error;
});
