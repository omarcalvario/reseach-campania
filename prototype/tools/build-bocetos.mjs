#!/usr/bin/env node
/**
 * Genera las previsualizaciones optimizadas de los bocetos IA del proyecto.
 *
 * Entrada : ../bocetos IA/*.png|jpg          (material propio, no referencias externas)
 * Salida  : media/bocetos/<slug>.jpg         (1600 px máx., JPEG q88)
 * Manifiesto: media/bocetos/manifest.json     (trazabilidad de cada derivación)
 *
 * Los originales se conservan intactos en `bocetos IA/` y son la fuente de la
 * pieza; la previsualización existe sólo para que la sección "Análisis de ideas"
 * cargue rápido y no dependa de la raíz del servidor.
 *
 * Uso: node tools/build-bocetos.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const prototypeDir = resolve(here, "..");
const projectRoot = resolve(prototypeDir, "..");
const sketchDir = join(projectRoot, "bocetos IA");
const outputDir = join(prototypeDir, "media", "bocetos");
const maxSide = 1600;
const quality = 88;

/** Slug estable: mismo criterio que `sketchSlug()` en prototype.js. */
export function sketchSlug(filename) {
  return String(filename)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.[A-Za-z0-9]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hasSips() {
  try {
    execFileSync("sips", ["--help"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function hasMagick() {
  for (const bin of ["magick", "convert"]) {
    try {
      execFileSync(bin, ["-version"], { stdio: "ignore" });
      return bin;
    } catch {
      /* siguiente binario */
    }
  }
  return null;
}

function convertImage(input, output) {
  if (hasSips()) {
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", String(quality), "-Z", String(maxSide), input, "--out", output], { stdio: "ignore" });
    return "sips";
  }
  const bin = hasMagick();
  if (bin) {
    execFileSync(bin, [input, "-resize", `${maxSide}x${maxSide}>`, "-quality", String(quality), output], { stdio: "ignore" });
    return bin;
  }
  throw new Error("No se encontró sips (macOS) ni ImageMagick para convertir las imágenes.");
}

function imageSize(filePath) {
  try {
    const output = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", filePath], { encoding: "utf8" });
    const width = Number(output.match(/pixelWidth:\s*(\d+)/)?.[1]);
    const height = Number(output.match(/pixelHeight:\s*(\d+)/)?.[1]);
    if (width && height) return { width, height };
  } catch {
    /* sips no disponible: se omiten las dimensiones */
  }
  return { width: null, height: null };
}

if (!existsSync(sketchDir)) {
  console.error(`No existe la carpeta de bocetos: ${sketchDir}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const ideas = JSON.parse(readFileSync(join(prototypeDir, "analisis-bocetos.json"), "utf8")).ideas || [];
const referenced = new Set(ideas.map((idea) => idea.filename));
const files = readdirSync(sketchDir).filter((name) => /\.(png|jpe?g)$/i.test(name)).sort();

const usedSlugs = new Map();
const manifest = [];
let totalOriginal = 0;
let totalPreview = 0;

for (const filename of files) {
  const slug = sketchSlug(filename);
  if (usedSlugs.has(slug)) {
    console.error(`Slug duplicado: "${filename}" y "${usedSlugs.get(slug)}" → ${slug}`);
    process.exit(1);
  }
  usedSlugs.set(slug, filename);

  const input = join(sketchDir, filename);
  const output = join(outputDir, `${slug}.jpg`);
  const tool = convertImage(input, output);

  const originalSize = statSync(input).size;
  const previewSize = statSync(output).size;
  const dimensions = imageSize(output);
  totalOriginal += originalSize;
  totalPreview += previewSize;

  manifest.push({
    filename,
    original: `../bocetos IA/${filename}`,
    preview: `media/bocetos/${slug}.jpg`,
    width: dimensions.width,
    height: dimensions.height,
    originalBytes: originalSize,
    previewBytes: previewSize,
    referencedInAnalysis: referenced.has(filename)
  });

  console.log(
    `${referenced.has(filename) ? "•" : " "} ${filename}\n  → media/bocetos/${slug}.jpg  ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(previewSize / 1024).toFixed(0)} kB  [${tool}]`
  );
}

const missing = [...referenced].filter((filename) => !files.includes(filename));
writeFileSync(
  join(outputDir, "manifest.json"),
  `${JSON.stringify({
    note: "Previsualizaciones derivadas de los bocetos IA propios del proyecto. Los originales en `bocetos IA/` son la fuente; estas imágenes son sólo para revisión interna.",
    maxSide,
    quality,
    generatedWith: "tools/build-bocetos.mjs",
    items: manifest
  }, null, 2)}\n`
);

console.log("");
console.log(`${manifest.length} previsualizaciones generadas en media/bocetos/`);
console.log(`Peso total: ${(totalOriginal / 1024 / 1024).toFixed(1)} MB → ${(totalPreview / 1024 / 1024).toFixed(1)} MB`);
if (missing.length) {
  console.log(`Atención: analisis-bocetos.json referencia archivos que no existen: ${missing.join(", ")}`);
}
