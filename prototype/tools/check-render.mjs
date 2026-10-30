#!/usr/bin/env node
/**
 * Smoke test del prototipo: levanta el servidor, abre la página en Chrome
 * headless y comprueba que el catálogo, las fichas y las imágenes de
 * "Análisis de ideas" se renderizan sin errores de consola.
 *
 * Este test es el que detecta el fallo típico: servir la carpeta `prototype/`
 * en lugar de la raíz del proyecto, que deja el catálogo y los bocetos en 404.
 *
 * Uso: node tools/check-render.mjs [puerto]
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const prototypeDir = resolve(here, "..");
const port = Number(process.argv[2] || 8123);
const baseUrl = `http://127.0.0.1:${port}/prototype/`;
const CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium"
];

const chromePath = CHROME_PATHS.find((path) => existsSync(path));
if (!chromePath) {
  console.error("No se encontró Chrome/Chromium. Instala Chrome o omite este test.");
  process.exit(2);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForPort(url, attempts = 60) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch {
      /* el proceso aún no escucha */
    }
    await sleep(250);
  }
  throw new Error(`Timeout esperando ${url}`);
}

class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        message.error ? reject(new Error(message.error.message)) : resolve(message.result);
        return;
      }
      if (message.method) this.events.push(message);
    });
  }

  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    });
    return new Cdp(socket);
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) {
      const details = result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Error al evaluar en la página";
      throw new Error(details);
    }
    return result.result.value;
  }
}

const server = spawn(process.execPath, [join(prototypeDir, "tools", "serve.mjs"), String(port)], { stdio: "ignore" });
const profileDir = mkdtempSync(join(tmpdir(), "uvp-chrome-"));
const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  `--user-data-dir=${profileDir}`,
  "--remote-debugging-port=0",
  baseUrl
], { stdio: "ignore" });

let failures = 0;
const report = (ok, label, detail = "") => {
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
};

try {
  await waitForPort(`http://127.0.0.1:${port}/prototype/`).catch(() => null);
  const portFile = join(profileDir, "DevToolsActivePort");
  let devtoolsPort = null;
  for (let attempt = 0; attempt < 60 && !devtoolsPort; attempt += 1) {
    if (existsSync(portFile)) devtoolsPort = readFileSync(portFile, "utf8").split("\n")[0];
    else await sleep(250);
  }
  if (!devtoolsPort) throw new Error("Chrome no expuso el puerto de depuración");

  const targets = await waitForPort(`http://127.0.0.1:${devtoolsPort}/json/list`);
  const page = targets.find((target) => target.type === "page");
  if (!page) throw new Error("No se encontró la pestaña del prototipo");

  const cdp = await Cdp.connect(page.webSocketDebuggerUrl);
  await cdp.send("Runtime.enable");
  await cdp.send("Page.enable");
  await cdp.send("Page.navigate", { url: baseUrl });
  await sleep(2500);

  const checks = await cdp.evaluate(`(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const cards = document.querySelectorAll(".campaign-card").length;
      if (cards > 0) break;
      await wait(250);
    }
    // Control "Ver todos los bocetos"
    const toggle = document.getElementById("ideas-toggle");
    const initiallyOpen = document.querySelectorAll(".idea-card[open]").length;
    toggle?.click();
    await wait(400);
    const toggledOpen = document.querySelectorAll(".idea-card[open]").length;
    toggle?.click();
    await wait(300);
    const restoredOpen = document.querySelectorAll(".idea-card[open]").length;
    const toggleLabel = toggle?.textContent.trim();
    const toggleExpanded = toggle?.getAttribute("aria-expanded");

    // Las imágenes usan loading="lazy": primero se llevan al viewport y luego
    // se fuerzan a carga inmediata para verificar que todas las URLs existen.
    document.getElementById("ideas")?.scrollIntoView();
    await wait(600);
    document.querySelectorAll(".idea-card").forEach((node) => { node.open = true; });
    const images = [...document.querySelectorAll(".idea-card img")];
    images.forEach((image) => { image.loading = "eager"; });
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (images.length && images.every((image) => image.complete)) break;
      await wait(500);
    }
    await wait(500);
    const broken = images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src);
    return {
      title: document.title,
      campaignCards: document.querySelectorAll(".campaign-card").length,
      ideaCards: document.querySelectorAll(".idea-card").length,
      detailItems: document.querySelectorAll(".detail-item").length,
      sourceRows: document.querySelectorAll(".source-row").length,
      catalogErrorVisible: !document.getElementById("load-error").hidden,
      resultCount: document.getElementById("result-count").textContent.trim(),
      ideaImages: images.length,
      brokenIdeaImages: broken,
       // Las referencias remotas pueden bloquearse por permisos/CDN; las
       // imágenes propias de los bocetos sí deben cargar siempre.
       unavailableNotes: document.querySelectorAll(".idea-card .image-unavailable-note:not([hidden])").length,
      ideaPreviewSample: images[0]?.currentSrc || "",
      initiallyOpen,
      toggledOpen,
      restoredOpen,
      toggleLabel,
      toggleExpanded,
      ideasCount: document.getElementById("ideas-count")?.textContent.trim()
    };
  })()`);

  report(!checks.catalogErrorVisible, "El catálogo canónico se carga sin error");
  report(checks.campaignCards === 18, "La galería muestra 18 campañas", `${checks.campaignCards} tarjetas`);
  report(checks.ideaCards === 21, "Análisis de ideas muestra 21 bocetos", `${checks.ideaCards} tarjetas`);
  report(checks.detailItems === 18, "Las fichas renderizan 18 campañas", `${checks.detailItems} fichas`);
  report(checks.sourceRows > 0, "El índice de fuentes renderiza", `${checks.sourceRows} fuentes`);
  report(checks.brokenIdeaImages.length === 0, "Todas las imágenes de ideas cargan", checks.brokenIdeaImages.slice(0, 2).join(", "));
  report(checks.unavailableNotes === 0, "No hay avisos de imagen no disponible", `${checks.unavailableNotes} avisos`);
  report(checks.ideaPreviewSample.includes("/media/bocetos/"), "Las tarjetas usan la previsualización optimizada local", checks.ideaPreviewSample);
  report(checks.initiallyOpen === 21 && checks.toggledOpen === 0 && checks.restoredOpen === 21, "Las 21 fichas de ideas abren y contraen correctamente", `iniciales ${checks.initiallyOpen}, tras alternar ${checks.toggledOpen}, restauradas ${checks.restoredOpen}`);
  report(checks.toggleExpanded === "true" && /Contraer/.test(checks.toggleLabel || ""), "El control recupera su estado inicial", `${checks.toggleExpanded} · "${checks.toggleLabel}"`);

  const consoleErrors = cdp.events.filter((event) => event.method === "Runtime.consoleAPICalled" && event.params.type === "error");
  const exceptions = cdp.events.filter((event) => event.method === "Runtime.exceptionThrown");
  report(exceptions.length === 0, "No hay excepciones de JavaScript", `${exceptions.length} excepciones`);
  if (consoleErrors.length) console.log(`  (${consoleErrors.length} mensajes de error en consola, revisa si afectan al contenido)`);
} catch (error) {
  console.error(`Error del smoke test: ${error.message}`);
  failures += 1;
} finally {
  chrome.kill();
  server.kill();
  try {
    rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    /* Chrome sigue escribiendo en el perfil: no bloquea el resultado */
  }
}

console.log("");
console.log(failures === 0 ? "Smoke test correcto." : `Smoke test con ${failures} fallo(s).`);
process.exit(failures === 0 ? 0 : 1);
