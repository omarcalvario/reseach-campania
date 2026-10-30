(() => {
  "use strict";

  const CANONICAL_CATALOG = "research/approved-campaigns.json";
  const ASSET_ROOTS = ["../", "./"];
  const VISUAL_DATA_URL = "./referencias-graficas.json";
  const IDEAS_DATA_URL = "./analisis-bocetos.json";
  const SKETCH_FOLDER = "bocetos IA";
  const SKETCH_PREVIEW_FOLDER = "media/bocetos";
  const RIGHTS_NOTE = "Referencia utilizada con fines de análisis interno. No autorizada para reutilización en piezas UVP";
  const LABELS = {
    region: { global: "Global", mexico: "México", "puebla-regional": "Puebla / región" },
    discipline: { graphic: "Gráfica", audiovisual: "Audiovisual", web: "Web", "cross-disciplinary": "Multidisciplinaria" },
    campaignField: {
      objetivo: "Objetivo", publico: "Público", mensaje: "Mensaje",
      tono: "Tono", concepto: "Concepto", llamada_a_la_accion: "Llamada a la acción"
    },
    evidence: { verified: "Campaña verificada", limited: "Evidencia limitada", "not-verifiable": "No verificable", disputed: "Disputada" }
  };

  const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const uniq = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  const byId = (items) => new Map(items.map((item) => [item.id, item]));
  const asArray = (value) => Array.isArray(value) ? value : [];
  const humanize = (value) => String(value || "").replaceAll("|", " · ").replaceAll("_", " ");
  const formatLabel = (value) => humanize(value).replace(/\bweb\b/gi, "web");

  /* Raíz de recursos -------------------------------------------------------
     El prototipo lee el catálogo canónico y los bocetos propios con rutas
     relativas a la raíz del proyecto. Si el servidor se levanta dentro de
     `prototype/`, esas rutas caen fuera del sitio servido y responden 404.
     Se prueba cada base conocida y se usa la primera que entrega el catálogo. */
  let assetRootPromise;

  async function resolveAssetRoot() {
    if (!assetRootPromise) {
      assetRootPromise = (async () => {
        for (const base of ASSET_ROOTS) {
          const baseUrl = new URL(base, document.baseURI);
          const dataUrl = new URL(CANONICAL_CATALOG, baseUrl);
          try {
            const response = await fetch(dataUrl, { headers: { Accept: "application/json" } });
            if (response.ok) return { base, baseUrl, dataUrl };
          } catch (error) {
            console.warn(`No se pudo leer ${dataUrl.href}`, error);
          }
        }
        return null;
      })();
    }
    return assetRootPromise;
  }

  const sketchSlug = (filename) => String(filename)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.[A-Za-z0-9]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  /* Previsualización optimizada dentro de prototype/ (siempre alcanzable). */
  const sketchPreviewUrl = (filename) => {
    const entry = sketchManifest.get(filename);
    const path = entry?.preview || `${SKETCH_PREVIEW_FOLDER}/${sketchSlug(filename)}.jpg`;
    return new URL(path, document.baseURI).href;
  };

  const sketchDimensions = (filename) => {
    const entry = sketchManifest.get(filename);
    return entry?.width && entry?.height ? { width: entry.width, height: entry.height } : { width: 1280, height: 720 };
  };

  let sketchManifest = new Map();
  let sketchManifestPromise;
  async function loadSketchManifest() {
    if (!sketchManifestPromise) {
      sketchManifestPromise = (async () => {
        try {
          const response = await fetch(new URL(`${SKETCH_PREVIEW_FOLDER}/manifest.json`, document.baseURI), { headers: { Accept: "application/json" } });
          if (!response.ok) return new Map();
          const data = await response.json();
          return new Map(asArray(data.items).map((item) => [item.filename, item]));
        } catch {
          return new Map();
        }
      })();
    }
    sketchManifest = await sketchManifestPromise;
    return sketchManifest;
  }

  /* Original en `bocetos IA/` (material propio del proyecto). */
  const sketchOriginalUrl = (filename, root) => {
    const base = root?.baseUrl || new URL("../", document.baseURI);
    return new URL(`${encodeURI(SKETCH_FOLDER)}/${encodeURIComponent(filename)}`, base).href;
  };

  function sourceFor(piece, sources) {
    return asArray(piece.sourceIds).map((id) => sources.get(id)).find(Boolean);
  }

  function fieldsMarkup(campaign) {
    const names = LABELS.campaignField;
    return Object.entries(names).map(([key, label]) => {
      const evidence = campaign.evidencia_por_campo?.[key] || {};
      const fieldValue = campaign[key] || "No localizado en fuente verificable";
      const editorialKind = key === "tono" || String(fieldValue).startsWith("Interpretación:") ? "Interpretación" : "Dato verificado";
      const excerpt = evidence.supportingExcerpt || "Verificar detalle en la fuente asociada.";
      const sourceId = asArray(evidence.sourceIds)[0] || asArray(evidence.checkedSourceIds)[0];
      const source = sourceId ? (window.__uvpSources?.get(sourceId)) : null;
      return `<div class="field-box"><strong>${esc(label)} <span class="tag">${editorialKind}</span></strong><p>${esc(fieldValue)}</p><p class="evidence-excerpt">${esc(excerpt)}</p>${source ? `<a class="evidence-source source-link" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">Fuente: ${esc(source.title)} ↗</a>` : ""}</div>`;
    }).join("");
  }

  function creditMarkup(piece, campaign, sources) {
    const source = sourceFor(piece, sources);
    const credit = piece.credit || {};
    const sourceTitle = source?.title || "Fuente indicada en el registro";
    const sourceUrl = source?.url || credit.url || "";
    const namedCredit = credit.creatorOrAgency || source?.authorOrganization || "Autoría no identificada en la fuente";
    return `<div class="piece-credit"><strong>${esc(campaign.institution)} · ${esc(campaign.campaignTitle)}</strong><span>Fuente: ${esc(sourceTitle)} · Crédito: ${esc(namedCredit)}</span><br><a class="source-link" href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">Abrir fuente original ↗</a><br><span>Estado: Solo análisis interno</span><p class="rights-note">${esc(RIGHTS_NOTE)}</p></div>`;
  }

  function mediaPreviewMarkup(options = {}) {
    const { imageUrl, alt = "", title = "", sourceUrl = "", className = "detail-image-preview", previewUrl = "", fallbackUrl = "", width = 1280, height = 720, showOpenLabel = true } = options;
    const src = previewUrl || imageUrl;
    const fallbackAttribute = fallbackUrl ? ` data-fallback-url="${esc(fallbackUrl)}"` : "";
    const previewAttribute = previewUrl ? ` data-preview-url="${esc(previewUrl)}"` : "";
    const openLabel = showOpenLabel ? '<span class="preview-open-label">Ampliar</span>' : "";
    return `<button class="${className}" type="button" data-media-preview data-image-url="${esc(imageUrl)}" data-image-alt="${esc(alt)}" data-image-title="${esc(title)}" data-source-url="${esc(sourceUrl || "")}"${fallbackAttribute}${previewAttribute} aria-label="Ampliar imagen: ${esc(title)}"><img src="${esc(src)}" alt="${esc(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async" referrerpolicy="strict-origin-when-cross-origin">${openLabel}</button>`;
  }

  function initializeFilters(campaigns, pieces, learnings) {
    const groups = {
      region: { title: "Región", values: uniq(campaigns.map((item) => item.region)), label: (v) => LABELS.region[v] || v },
      format: { title: "Formato", values: uniq(pieces.map((item) => item.format)), label: formatLabel },
      discipline: { title: "Disciplina", values: uniq(pieces.map((item) => item.discipline)), label: (v) => LABELS.discipline[v] || v },
      evidence: { title: "Evidencia", values: uniq(campaigns.map((item) => item.evidenceStatus)), label: (v) => LABELS.evidence[v] || v },
      learning: { title: "Aprendizaje", values: uniq(learnings.map((item) => item.id)), label: (id) => {
        const learning = learnings.find((item) => item.id === id);
        const campaign = campaigns.find((item) => asArray(learning?.campaignIds).includes(item.id));
        return campaign ? `${campaign.institution}: ${campaign.campaignTitle}` : id;
      } }
    };
    const container = document.getElementById("filter-groups");
    const query = new URLSearchParams(window.location.search);
    container.innerHTML = Object.entries(groups).map(([key, group]) => {
      const selected = query.getAll(key);
      const searchControl = group.values.length > 8
        ? `<label class="filter-option-search">Buscar en ${esc(group.title.toLocaleLowerCase("es"))}<input type="search" data-option-search="${esc(key)}" placeholder="Escribe para reducir opciones" autocomplete="off"></label>`
        : "";
      const options = group.values.map((value) => {
        const label = group.label(value);
        const checked = selected.includes(value) ? " checked" : "";
        return `<label class="filter-option"><input type="checkbox" name="filter-${esc(key)}" value="${esc(value)}"${checked}><span>${esc(label)}</span></label>`;
      }).join("");
      return `<details class="filter-group" id="filter-group-${esc(key)}" data-filter-group="${esc(key)}"${selected.length ? " open" : ""}><summary><span class="filter-group-title">${esc(group.title)}</span><span class="filter-group-count" aria-live="polite">${selected.length ? `${selected.length} seleccionados` : "Todos"}</span></summary><div class="filter-options" role="group" aria-label="${esc(group.title)}">${searchControl}${options}</div></details>`;
    }).join("");
    const search = document.getElementById("filter-search");
    search.value = query.get("q") || "";
    if (!filtersBound) {
      filtersBound = true;
      search.addEventListener("input", renderCampaigns);
      container.addEventListener("change", (event) => {
        if (event.target.matches('input[type="checkbox"]')) renderCampaigns();
      });
      container.addEventListener("input", (event) => {
        const input = event.target.closest("[data-option-search]");
        if (!input) return;
        const needle = normalizeSearch(input.value);
        input.closest(".filter-options").querySelectorAll(".filter-option").forEach((option) => {
          option.hidden = needle !== "" && !normalizeSearch(option.textContent).includes(needle);
        });
      });
    }
    return groups;
  }

  let filtersBound = false;

  function selectedValues(key) {
    const group = document.getElementById(`filter-group-${key}`);
    return group ? [...group.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value) : [];
  }

  function normalizeSearch(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
  }

  let state;
  function campaignMatches(campaign) {
    const relatedPieces = state.pieces.filter((piece) => piece.campaignId === campaign.id);
    const values = {
      region: [campaign.region],
      format: relatedPieces.map((piece) => piece.format),
      discipline: relatedPieces.map((piece) => piece.discipline),
      evidence: [campaign.evidenceStatus],
      learning: state.learnings.filter((item) => asArray(item.campaignIds).includes(campaign.id)).map((item) => item.id)
    };
    const matchesFilters = Object.keys(values).every((key) => {
      const chosen = selectedValues(key);
      return chosen.length === 0 || chosen.some((value) => values[key].includes(value));
    });
    if (!matchesFilters) return false;
    const terms = normalizeSearch(document.getElementById("filter-search")?.value).split(/\s+/).filter(Boolean);
    if (!terms.length) return true;
    const searchable = normalizeSearch([campaign.campaignTitle, campaign.institution, campaign.region, campaign.dateLabel].join(" "));
    return terms.every((term) => searchable.includes(term));
  }

  function activeChips() {
    const labels = {};
    for (const [key, title] of Object.entries({ region: "Región", format: "Formato", discipline: "Disciplina", evidence: "Evidencia", learning: "Aprendizaje" })) {
      const group = document.getElementById(`filter-group-${key}`);
      for (const input of group?.querySelectorAll('input[type="checkbox"]:checked') || []) {
        const name = input.parentElement.querySelector("span")?.textContent || input.value;
        labels[`${key}:${input.value}`] = { key, value: input.value, label: `${title}: ${name}` };
      }
    }
    const searchValue = document.getElementById("filter-search").value.trim();
    if (searchValue) labels.search = { key: "search", value: searchValue, label: `Búsqueda: ${searchValue}` };
    const target = document.getElementById("active-filters");
    target.innerHTML = Object.values(labels).map((chip) => `<span class="filter-chip"><span>${esc(chip.label)}</span><button class="chip-remove" type="button" data-chip-key="${esc(chip.key)}" data-chip-value="${esc(chip.value)}" aria-label="Quitar ${esc(chip.label)}">×</button></span>`).join("");
    target.querySelectorAll("[data-chip-key]").forEach((button) => button.addEventListener("click", () => {
      const { chipKey, chipValue } = button.dataset;
      if (chipKey === "search") {
        document.getElementById("filter-search").value = "";
      } else {
        const group = document.getElementById(`filter-group-${chipKey}`);
        const input = [...group.querySelectorAll('input[type="checkbox"]')].find((option) => option.value === chipValue);
        if (input) input.checked = false;
      }
      renderCampaigns();
    }));
    for (const [key, title] of Object.entries({ region: "Región", format: "Formato", discipline: "Disciplina", evidence: "Evidencia", learning: "Aprendizaje" })) {
      const group = document.getElementById(`filter-group-${key}`);
      if (!group) continue;
      const count = selectedValues(key).length;
      group.querySelector(".filter-group-count").textContent = count ? `${count} seleccionados` : "Todos";
      group.querySelector(".filter-group-title").setAttribute("aria-label", title);
    }
  }

  function renderCampaignCard(campaign) {
    const pieces = state.pieces.filter((piece) => piece.campaignId === campaign.id);
    const region = LABELS.region[campaign.region] || campaign.region;
    const status = LABELS.evidence[campaign.evidenceStatus] || campaign.evidenceStatus;
    const tags = uniq(pieces.flatMap((piece) => [formatLabel(piece.format), LABELS.discipline[piece.discipline] || piece.discipline]));
    const visual = state.visualsByCampaign?.get(campaign.id);
    const evidenceClass = campaign.evidenceStatus === "verified" ? "evidence-verified" : campaign.evidenceStatus === "limited" ? "evidence-limited" : "evidence-uncertain";
    const visualSource = visual?.sourceUrl || state.sourcesByCampaign?.get(campaign.id)?.url || "";
    const thumbnail = visual?.imageUrl
      ? `<div class="campaign-thumbnail">${mediaPreviewMarkup({ imageUrl: visual.imageUrl, alt: visual.alt || `Referencia visual de ${campaign.institution}: ${campaign.campaignTitle}`, title: `${campaign.institution}: ${campaign.campaignTitle}`, sourceUrl: visualSource, className: "campaign-thumbnail-button" })}</div>`
      : '<div class="campaign-thumbnail campaign-thumbnail-empty" aria-hidden="true"><span>Sin imagen directa</span></div>';
    return `<article class="campaign-card" data-campaign-card="${esc(campaign.id)}">${thumbnail}<div class="campaign-card-main"><div class="card-copy"><div class="campaign-card-meta"><span class="tag ${evidenceClass}">${esc(status)}</span><span class="campaign-region">${esc(region)}</span><span class="campaign-date">${esc(campaign.dateLabel)}</span></div><h3>${esc(campaign.campaignTitle)}</h3><p class="campaign-institution">${esc(campaign.institution)}</p><span class="card-tags">${tags.slice(0, 2).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</span><a class="card-detail-link" href="#ficha-${esc(campaign.id)}">Abrir ficha completa <span aria-hidden="true">↗</span></a></div></div></article>`;
  }

  function renderCampaigns() {
    if (!state) return;
    const matches = state.campaigns.filter(campaignMatches);
    const grid = document.getElementById("campaign-grid");
    grid.innerHTML = matches.map(renderCampaignCard).join("");
    connectMediaPreviewFallbacks(grid);
    grid.setAttribute("aria-busy", "false");
    document.getElementById("result-count").textContent = `${matches.length} ${matches.length === 1 ? "campaña" : "campañas"} · ${state.campaigns.length} en el archivo`;
    document.getElementById("empty-state").hidden = matches.length > 0;
    const clearButton = document.getElementById("clear-filters");
    if (clearButton) clearButton.disabled = !document.getElementById("filter-search").value.trim() && !["region", "format", "discipline", "evidence", "learning"].some((key) => selectedValues(key).length);
    syncFilterQuery();
    activeChips();
    renderQuickLinks();
  }

  function syncFilterQuery() {
    const url = new URL(window.location.href);
    for (const key of ["region", "format", "discipline", "evidence", "learning"]) {
      url.searchParams.delete(key);
      selectedValues(key).forEach((value) => url.searchParams.append(key, value));
    }
    url.searchParams.delete("q");
    const search = document.getElementById("filter-search")?.value.trim();
    if (search) url.searchParams.set("q", search);
    const query = url.searchParams.toString();
    window.history.replaceState(window.history.state, "", `${url.pathname}${query ? `?${query}` : ""}${url.hash}`);
  }

  function connectMediaPreviewFallbacks(container) {
    container.querySelectorAll("[data-media-preview] img").forEach((image) => {
      image.addEventListener("error", () => handleImageError(image));
    });
  }

  /* Estado de la última carga de una URL según Resource Timing.
     0 = cancelada o bloqueada; >=400 = la fuente respondió con error. */
  function resourceStatus(url) {
    const entries = performance.getEntriesByName(url, "resource");
    if (!entries.length) return null;
    const status = entries[entries.length - 1].responseStatus;
    return typeof status === "number" ? status : null;
  }

  async function verifyImage(url) {
    try {
      const response = await fetch(url, { method: "HEAD", cache: "no-store" });
      return response.ok;
    } catch {
      return null;
    }
  }

  /* El navegador cancela las cargas diferidas al hacer scroll: eso no es un
     fallo y no debe dejar un hueco vacío ni un aviso de error. */
  async function handleImageError(image) {
    const preview = image.closest("[data-media-preview]");
    const failedUrl = image.currentSrc || image.src;
    const status = resourceStatus(failedUrl);

    const fallbackUrl = preview?.dataset.fallbackUrl;
    if (fallbackUrl && fallbackUrl !== failedUrl && image.dataset.fallbackApplied !== "true") {
      if (status === null) {
        const reachable = await verifyImage(fallbackUrl);
        if (reachable === false) {
          showMediaUnavailable(preview, image);
          return;
        }
        if (reachable === null) return;
      }
      image.dataset.fallbackApplied = "true";
      image.src = fallbackUrl;
      if (preview) preview.dataset.imageUrl = fallbackUrl;
      return;
    }

    if (status === null) {
      const reachable = await verifyImage(failedUrl);
      if (reachable !== false) return;
    }
    showMediaUnavailable(preview, image);
  }

  /* Una imagen que falla se oculta, pero nunca en silencio: se muestra el
     archivo que no cargó y el enlace al original. */
  function showMediaUnavailable(preview, image) {
    if (!preview) return;
    const frame = preview.parentElement;
    preview.hidden = true;
    frame?.classList.add("campaign-thumbnail-unavailable", "image-unavailable");
    const fallback = frame?.querySelector(".media-image-fallback, .image-unavailable-note, .campaign-thumbnail-fallback");
    if (fallback) fallback.hidden = false;
    frame?.querySelector(".image-source-fallback")?.removeAttribute("hidden");
    const detail = frame?.querySelector("[data-media-error-detail]");
    if (detail) detail.textContent = image.getAttribute("src") || "";
  }

  function openMediaViewer(button) {
    const dialog = document.getElementById("media-viewer");
    const image = document.getElementById("media-viewer-image");
    const caption = document.getElementById("media-viewer-caption");
    const title = document.getElementById("media-viewer-title");
    const original = document.getElementById("media-viewer-original");
    const source = document.getElementById("media-viewer-source");
    image.onerror = null;
    image.src = button.dataset.imageUrl;
    const previewUrl = button.dataset.previewUrl;
    if (previewUrl) {
      image.onerror = () => {
        image.onerror = null;
        image.src = previewUrl;
      };
    }
    image.alt = button.dataset.imageAlt || "";
    title.textContent = button.dataset.imageTitle || "Referencia visual";
    caption.textContent = button.dataset.imageTitle || "Referencia visual";
    original.href = button.dataset.imageUrl;
    const sourceUrl = button.dataset.sourceUrl;
    if (sourceUrl) {
      source.href = sourceUrl;
      source.hidden = false;
    } else {
      source.removeAttribute("href");
      source.hidden = true;
    }
    dialog.showModal();
  }

  function renderQuickLinks() {
    document.querySelectorAll("[data-region-link]").forEach((link) => {
      if (link.dataset.bound === "true") return;
      link.dataset.bound = "true";
      link.addEventListener("click", () => {
      const options = document.querySelectorAll('#filter-group-region input[type="checkbox"]');
      options.forEach((option) => { option.checked = option.value === link.dataset.regionLink; });
      renderCampaigns();
      });
    });
  }

  function renderPanoramas() {
    for (const region of ["global", "mexico", "puebla-regional"]) {
      const items = state.campaigns.filter((campaign) => campaign.region === region);
      const target = document.querySelector(`[data-preview="${region}"]`);
      const summary = document.querySelector(`[data-summary="${region}"] strong`);
      if (summary) summary.textContent = String(items.length).padStart(2, "0");
      if (target) target.innerHTML = items.map((campaign, index) => `<a class="panorama-row" href="#ficha-${esc(campaign.id)}"><span>${String(index + 1).padStart(2, "0")}</span><span><strong>${esc(campaign.campaignTitle)}</strong><small>${esc(campaign.institution)} · ${esc(campaign.dateLabel)}</small></span></a>`).join("");
    }
  }

  function renderDetails() {
    const target = document.getElementById("detail-list");
    target.innerHTML = state.campaigns.map((campaign) => {
      const pieces = state.pieces.filter((piece) => piece.campaignId === campaign.id);
      const source = asArray(campaign.sourceIds).map((id) => state.sources.get(id)).find(Boolean);
      const visual = state.visualsByCampaign?.get(campaign.id);
      const sourceUrl = source?.url || "";
      const campaignMedia = visual?.imageUrl
         ? `<figure class="detail-visual"><div class="detail-visual-frame">${mediaPreviewMarkup({ imageUrl: visual.imageUrl, alt: visual.alt || `${campaign.institution}: ${campaign.campaignTitle}`, title: `${campaign.institution}: ${campaign.campaignTitle}`, sourceUrl, showOpenLabel: false })}${source ? `<a class="image-source-fallback source-link" href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer" hidden>Ver sitio de referencia ↗</a>` : ""}</div><figcaption><strong>${esc(campaign.institution)} · ${esc(campaign.campaignTitle)}</strong><span>Solo análisis interno · Crédito: ${esc(visual.credit || source?.authorOrganization || campaign.institution)}</span>${source ? `<a class="source-link" href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">Abrir fuente original: ${esc(source.title)} ↗</a>` : ""}</figcaption></figure>`
        : `<div class="detail-visual-empty"><strong>Sin imagen oficial directa en esta ficha</strong>${source ? `<a class="source-link" href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">Ver sitio de referencia: ${esc(source.title)} ↗</a>` : ""}</div>`;
      return `<details class="detail-item" id="ficha-${esc(campaign.id)}"><summary><span class="detail-summary-title">${esc(campaign.campaignTitle)}</span><span class="detail-summary-meta">${esc(campaign.institution)} · ${esc(LABELS.region[campaign.region] || campaign.region)}</span></summary><div class="detail-body">${campaignMedia}<div class="editorial-fields">${fieldsMarkup(campaign)}</div><h3>Análisis de campaña</h3><p>${esc(campaign.concepto)} ${esc(campaign.tono)}</p><h3>Piezas documentadas</h3><div class="piece-list">${pieces.map((piece) => `<article class="piece-entry"><div class="piece-entry-copy"><strong>${esc(piece.title)} · ${esc(LABELS.discipline[piece.discipline] || piece.discipline)}</strong><p>${esc(piece.visualObservation || "Descripción pendiente de ampliar con revisión del original.")}</p>${creditMarkup(piece, campaign, state.sources)}</div></article>`).join("")}</div><h3>Resultados y límites</h3><p><span class="tag">Resultado no verificable</span> ${esc(campaign.resultSummary)}</p><p>${esc(asArray(campaign.limitations).join(" "))}</p></div></details>`;
    }).join("");
    connectMediaPreviewFallbacks(target);
  }

  function renderComparison() {
    const target = document.getElementById("comparison-list");
    target.innerHTML = state.campaigns.map((campaign) => {
      const learning = state.learnings.find((item) => asArray(item.campaignIds).includes(campaign.id));
      return `<details class="comparison-item"><summary>${esc(campaign.campaignTitle)} <span>${esc(campaign.institution)}</span></summary><div class="comparison-body"><div><strong class="comparison-heading comparison-heading-success"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg><span>Acierto / principio</span></strong><p>${esc(learning?.takeaway || "Principio documentado en la ficha; sin síntesis separada.")}</p></div><div><strong class="comparison-heading comparison-heading-limit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v9M12 17.5v.5M5.6 20h12.8a1.6 1.6 0 0 0 1.4-2.4L13.4 5.8a1.6 1.6 0 0 0-2.8 0L4.2 17.6A1.6 1.6 0 0 0 5.6 20Z" /></svg><span>Límite de evidencia</span></strong><p>${esc(campaign.resultSummary)}</p></div><div><strong class="comparison-heading comparison-heading-risk"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v8M12 16v.5M5 20h14a1.5 1.5 0 0 0 1.3-2.2l-7-12a1.5 1.5 0 0 0-2.6 0l-7 12A1.5 1.5 0 0 0 5 20Z" /></svg><span>Riesgo a evitar</span></strong><p>${esc(learning?.avoidanceRisk || asArray(campaign.limitations).join(" "))}</p></div></div></details>`;
    }).join("");
  }

  function clearFilters() {
    document.querySelectorAll('#filter-groups input[type="checkbox"]').forEach((input) => { input.checked = false; });
    document.getElementById("filter-search").value = "";
    renderCampaigns();
  }

  function renderSources() {
    const target = document.getElementById("source-index");
    const campaignBySource = new Map();
    state.campaigns.forEach((campaign) => asArray(campaign.sourceIds).forEach((sourceId) => campaignBySource.set(sourceId, campaign)));
    target.innerHTML = [...state.sources.values()].map((source) => {
      const campaign = campaignBySource.get(source.id);
      const piece = campaign && state.pieces.find((item) => item.campaignId === campaign.id);
      const creator = piece?.credit?.creatorOrAgency || source.authorOrganization || "Crédito no identificado en fuente";
      return `<article class="source-row"><span><strong>${esc(campaign?.institution || source.authorOrganization || "Fuente")}: ${esc(campaign?.campaignTitle || source.title)}</strong><small>${esc(source.title)} · ${esc(source.sourceType)} · Consulta ${esc(source.consultedAt)}</small><small>Crédito: ${esc(creator)} · Estado de acceso: ${esc(source.accessStatus)} · Solo análisis interno</small></span><a class="source-link" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">Abrir URL original ↗</a></article>`;
    }).join("");
  }

  function ideaCardMarkup(idea, index, root) {
    const previewUrl = sketchPreviewUrl(idea.filename);
    const originalUrl = sketchOriginalUrl(idea.filename, root);
    const { width, height } = sketchDimensions(idea.filename);
    const alt = `Boceto de IA: ${idea.title}`;
    return `<details class="idea-card" open><summary><span class="idea-index">${String(index + 1).padStart(2, "0")}</span><span class="idea-summary"><strong>${esc(idea.title)}</strong><small>${esc(idea.family)} · Narrativa: ${esc(idea.narrative)}</small></span><span class="idea-open" aria-hidden="true">+</span></summary><div class="idea-body"><figure class="idea-visual">${mediaPreviewMarkup({ imageUrl: originalUrl, previewUrl, fallbackUrl: originalUrl, alt, title: idea.title, className: "idea-image-preview", width, height })}<p class="media-unavailable image-unavailable-note" hidden><strong>No se pudo cargar la imagen.</strong> <span data-media-error-detail></span></p><figcaption>Boceto IA interno · referencia de exploración, no arte final.</figcaption></figure><div class="idea-analysis"><span class="tag">${esc(idea.family)}</span><div class="idea-narrative"><strong>Narrativa que puede activar: ${esc(idea.narrative)}</strong><p>${esc(idea.narrativeAngle)}</p></div><div class="idea-analysis-item idea-correct"><strong>Lo correcto</strong><p>${esc(idea.correct)}</p></div><div class="idea-analysis-item idea-improve"><strong>Qué mejorar</strong><p>${esc(idea.improve)}</p></div><div class="idea-analysis-item idea-missing"><strong>Qué hace falta</strong><p>${esc(idea.missing)}</p></div></div></div></details>`;
  }

  async function loadIdeaAnalysis() {
    const gallery = document.getElementById("ideas-gallery");
    if (!gallery) return;
    try {
      const response = await fetch(new URL(IDEAS_DATA_URL, window.location.href), { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const ideas = asArray(data.ideas);
      const [root] = await Promise.all([resolveAssetRoot(), loadSketchManifest()]);
      gallery.innerHTML = ideas.map((idea, index) => ideaCardMarkup(idea, index, root)).join("");
      gallery.setAttribute("aria-busy", "false");
      connectMediaPreviewFallbacks(gallery);
      updateIdeasCount(ideas.length);
      const toggle = document.getElementById("ideas-toggle");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "true");
        toggle.textContent = "Contraer bocetos";
      }
    } catch (error) {
      console.error("No se pudo cargar el análisis de ideas", error);
      gallery.setAttribute("aria-busy", "false");
      gallery.innerHTML = `<p class="loading-note">No se pudo cargar <code>analisis-bocetos.json</code>. Comprueba que el servidor siga activo y usa “Reintentar”.</p>`;
      document.getElementById("ideas-load-error").hidden = false;
      updateIdeasCount(0);
    }
  }

  function updateIdeasCount(total) {
    const count = document.getElementById("ideas-count");
    if (!count) return;
    const open = document.querySelectorAll(".idea-card[open]").length;
    count.textContent = total ? `${total} bocetos analizados · ${open} abiertos` : "Sin bocetos cargados";
  }

  function toggleIdeas() {
    const gallery = document.getElementById("ideas-gallery");
    const button = document.getElementById("ideas-toggle");
    if (!gallery || !button) return;
    const cards = [...gallery.querySelectorAll(".idea-card")];
    const expand = !cards.every((card) => card.open);
    cards.forEach((card) => { card.open = expand; });
    button.setAttribute("aria-expanded", String(expand));
    button.textContent = expand ? "Contraer bocetos" : "Ver todos los bocetos";
    updateIdeasCount(cards.length);
    if (expand) gallery.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const VISUAL_LABELS = {
    "grafica-identidad": "Gráfica e identidad", "web-landing": "Web y landing pages",
    "audiovisual-motion": "Audiovisual y motion", "redes-sociales": "Redes sociales",
    "fotografia-ilustracion": "Fotografía e ilustración", "tipografia-color-composicion": "Tipografía, color y composición"
  };
  let visualState;
  let activeVisualCategory = "all";

  function remoteVisualMarkup(record, campaign, priority = false) {
    const imageUrl = record.imageUrl;
    const institution = campaign?.institution || record.institution || record.credit || "Marca/fuente indicada";
    const campaignTitle = campaign?.campaignTitle || record.title;
    const sourceUrl = record.sourceUrl || campaign?.sourceUrl || "";
    const credit = record.credit || campaign?.institution || "Crédito no identificado";
    const categories = record.category || record.categories || [];
    const siteLink = `<a class="source-link" href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">Ver sitio de referencia ↗</a>`;
    const image = imageUrl
      ? `<div class="visual-image-frame">${mediaPreviewMarkup({ imageUrl, previewUrl: imageUrl, alt: record.alt || `${institution}: ${campaignTitle}`, title: `${institution}: ${campaignTitle}`, sourceUrl, className: "visual-image-link" })}<div class="image-unavailable-note" hidden>La imagen remota no está disponible.</div><a class="image-source-fallback source-link" href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer" hidden>Ver sitio de referencia ↗</a></div>`
      : `<div class="visual-no-image"><span class="no-image-mark" aria-hidden="true">↗</span><strong>Sin recurso visual oficial directo</strong><p>${record.sourceStatus ? esc(record.sourceStatus) : "Se conserva el enlace original; pendiente de captura contextual manual."}</p>${siteLink}</div>`;
    const detail = record.detailUrl ? `<a class="detail-image-link" href="${esc(record.detailUrl)}" target="_blank" rel="noopener noreferrer">Comparar detalle / aplicación B ↗</a>` : "";
    const tags = categories.map((category) => `<span class="tag">${esc(VISUAL_LABELS[category] || category)}</span>`).join("");
    return `<article class="visual-card" data-visual-categories="${esc(categories.join(" "))}" data-priority="${priority}">${image}<div class="visual-card-copy"><div class="visual-card-kicker"><span class="internal-label">Solo análisis interno</span>${record.captureNeeded && !imageUrl ? '<span class="capture-flag">Captura manual pendiente</span>' : ""}</div><h4>${esc(institution)} · ${esc(campaignTitle)}</h4><div class="visual-tags">${tags}</div><p class="visual-observe"><strong>Qué observar</strong>${esc(record.whatToObserve || "Revisar composición, mensaje y aplicaciones de la pieza en contexto.")}</p><p class="visual-learn"><strong>Aprendizaje para UVP</strong>${esc(record.learning || "Analizar el principio, no replicar la ejecución.")}</p><p class="visual-risk"><strong>Riesgo a evitar</strong>${esc(record.risk || "No presentar como propio ni reutilizar sin autorización.")}</p><div class="visual-credit"><span><strong>Fuente:</strong> ${esc(record.sourceTitle || credit)}</span><span><strong>Crédito:</strong> ${esc(credit)}</span><a class="source-link" href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">URL original ↗</a>${detail}<span class="not-reusable">No reutilizable para campaña UVP</span></div></div></article>`;
  }

  function renderVisualGallery() {
    if (!visualState) return;
    const categories = [...document.querySelectorAll("[data-visual-category]")];
    categories.forEach((button) => {
      const active = button.dataset.visualCategory === activeVisualCategory;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const matches = (record) => activeVisualCategory === "all" || (record.category || record.categories || []).includes(activeVisualCategory);
    const approved = visualState.approved.filter(matches);
    const priorities = visualState.priorities.filter(matches);
    const resolve = (record) => ({ ...record, sourceUrl: record.sourceUrl || visualState.sourcesByCampaign.get(record.campaignId)?.url, sourceTitle: visualState.sourcesByCampaign.get(record.campaignId)?.title });
    const approvedGallery = document.getElementById("approved-visual-gallery");
    const priorityGallery = document.getElementById("priority-visual-gallery");
    approvedGallery.innerHTML = approved.map((record) => remoteVisualMarkup(resolve(record), visualState.campaigns.get(record.campaignId))).join("") || '<p class="loading-note">No hay fichas en esta categoría.</p>';
    priorityGallery.innerHTML = priorities.map((record) => remoteVisualMarkup(resolve(record), visualState.campaigns.get(record.campaignId), true)).join("") || '<p class="loading-note">No hay prioridades en esta categoría.</p>';
    connectMediaPreviewFallbacks(approvedGallery);
    connectMediaPreviewFallbacks(priorityGallery);
    const images = [...approved, ...priorities].filter((record) => record.imageUrl).length;
    document.getElementById("visual-result-count").textContent = `${approved.length} campañas aprobadas · ${priorities.length} prioridades · ${images} referencias con imagen remota declarada`;
  }

  async function loadVisualCatalog() {
    try {
      const response = await fetch(new URL(VISUAL_DATA_URL, window.location.href), { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const campaigns = [...state.campaigns];
      const sourcesByCampaign = new Map(campaigns.map((campaign) => {
        const source = asArray(campaign.sourceIds).map((id) => state.sources.get(id)).find(Boolean);
        return [campaign.id, source];
      }));
      state.sourcesByCampaign = sourcesByCampaign;
      visualState = { approved: asArray(data.approved), priorities: asArray(data.priorities), campaigns: byId(campaigns), sourcesByCampaign };
      state.visualsByCampaign = new Map(visualState.approved.map((record) => [record.campaignId, record]));
      renderCampaigns();
      renderDetails();
      renderVisualGallery();
    } catch (error) {
      console.error("No se pudo cargar el catálogo gráfico", error);
      document.getElementById("visual-load-error").hidden = false;
      document.getElementById("approved-visual-gallery").replaceChildren();
      document.getElementById("priority-visual-gallery").replaceChildren();
    }
  }

  let controlsConnected = false;
  function connectControls() {
    if (controlsConnected) return;
    controlsConnected = true;
    document.getElementById("clear-filters")?.addEventListener("click", clearFilters);
    document.querySelector("[data-clear]")?.addEventListener("click", clearFilters);
    document.getElementById("ideas-toggle")?.addEventListener("click", toggleIdeas);
    document.getElementById("ideas-gallery")?.addEventListener("toggle", (event) => {
      if (event.target.matches?.(".idea-card")) updateIdeasCount(document.querySelectorAll(".idea-card").length);
    }, true);
    document.getElementById("detail-list")?.addEventListener("toggle", (event) => {
      const opened = event.target;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
      document.querySelectorAll("#detail-list > .detail-item[open]").forEach((item) => {
        if (item !== opened) item.open = false;
      });
    }, true);
    document.getElementById("comparison-list")?.addEventListener("toggle", (event) => {
      const opened = event.target;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
      document.querySelectorAll("#comparison-list > .comparison-item[open]").forEach((item) => {
        if (item !== opened) item.open = false;
      });
    }, true);
    document.getElementById("media-viewer-close")?.addEventListener("click", () => document.getElementById("media-viewer").close());
    document.querySelectorAll("[data-visual-category]").forEach((button) => button.addEventListener("click", () => {
      activeVisualCategory = button.dataset.visualCategory;
      renderVisualGallery();
    }));
    document.body.addEventListener("click", (event) => {
      const preview = event.target.closest("[data-media-preview]");
      if (preview) {
        openMediaViewer(preview);
        return;
      }
      const link = event.target.closest('a[href^="#ficha-"]');
      if (!link) return;
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (target instanceof HTMLDetailsElement) target.open = true;
    });
    const openLinkedDetail = () => {
      if (!window.location.hash.startsWith("#ficha-")) return;
      let id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    window.addEventListener("hashchange", openLinkedDetail);
    openLinkedDetail();
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("section-nav");
    toggle?.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
    nav?.querySelectorAll("a[href^='#']").forEach((link) => link.addEventListener("click", () => {
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }));
    const sections = document.querySelectorAll("main section[id]");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const active = document.querySelector(`.section-nav a[href="#${CSS.escape(entry.target.id)}"]`);
        document.querySelectorAll(".section-nav a.active").forEach((item) => {
          item.classList.remove("active");
          item.removeAttribute("aria-current");
        });
        active?.classList.add("active");
        active?.setAttribute("aria-current", "location");
      }), { rootMargin: "-18% 0px -70% 0px" });
      sections.forEach((section) => observer.observe(section));
    }
  }

  async function start() {
    connectControls();
    loadIdeaAnalysis();
    try {
      const root = await resolveAssetRoot();
      if (!root) throw new Error(`No se encontró ${CANONICAL_CATALOG} en el servidor actual.`);
      const response = await fetch(root.dataUrl, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      state = {
        campaigns: asArray(data.campaigns),
        pieces: asArray(data.pieces),
        sources: byId(asArray(data.sources)),
        learnings: asArray(data.learnings),
        root
      };
      state.campaignsById = byId(state.campaigns);
      window.__uvpSources = state.sources;
      initializeFilters(state.campaigns, state.pieces, state.learnings);
      document.getElementById("campaign-total").textContent = String(state.campaigns.length);
      renderCampaigns();
      renderPanoramas();
      renderDetails();
      renderComparison();
      renderSources();
      await loadVisualCatalog();
    } catch (error) {
      console.error("No se pudo cargar el catálogo interno", error);
      document.getElementById("campaign-grid").setAttribute("aria-busy", "false");
      renderCatalogError(error);
      document.getElementById("result-count").textContent = "Catálogo no disponible";
      for (const id of ["detail-list", "comparison-list", "source-index", "approved-visual-gallery", "priority-visual-gallery"]) {
        const target = document.getElementById(id);
        if (target) target.innerHTML = "<p class=\"loading-note\">Contenido no disponible mientras no se cargue la fuente canónica.</p>";
      }
    }
  }

  /* Error de catálogo con la instrucción exacta de arranque: el fallo habitual
     es servir la carpeta `prototype/` en lugar de la raíz del proyecto. */
  function renderCatalogError(error) {
    const target = document.getElementById("load-error");
    if (!target) return;
    const origin = window.location.origin + window.location.pathname;
    const projectFolder = "…/research campaña";
    target.innerHTML = `
      <h3>No se pudo cargar el catálogo canónico</h3>
      <p>El navegador pidió <code>${esc(CANONICAL_CATALOG)}</code> y el servidor no lo entregó desde <code>${esc(origin)}</code>.</p>
      <p>El prototipo necesita que se sirva la <strong>raíz del proyecto</strong> (<code>research campaña</code>), no la carpeta <code>prototype/</code>. Ejecuta:</p>
      <code>cd "${esc(projectFolder)}" &amp;&amp; python3 -m http.server 8000</code>
      <p>o usa el lanzador incluido: <code>${esc(projectFolder)}/prototype/serve.sh 8000</code></p>
      <p class="error-detail">Detalle: ${esc(error?.message || error)}</p>
      <button class="button button-dark" type="button" data-retry-load>Reintentar carga</button>`;
    target.hidden = false;
    target.querySelector("[data-retry-load]")?.addEventListener("click", () => {
      assetRootPromise = null;
      target.hidden = true;
      document.getElementById("campaign-grid").setAttribute("aria-busy", "true");
      start();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
