// app.js — boots Leonida Vault, wires every control, and implements the
// deterministic ?shot=1..4 views used for the entry screenshots. In shot
// mode the app ignores localStorage and uses the fixed seed, so the same URL
// always renders the same pixels.
import { loadTrophies, auditStats } from "./data.js";
import { loadState, saveState, seedState, exportState, importState, emptyState, formatCount } from "./store.js";
import {
  renderAudit, renderChecklist, renderDetail, renderSources,
  renderRoadmap, renderMatrix, renderMissables,
} from "./render.js";

const params = new URLSearchParams(location.search);
const shot = params.get("shot");
const shotMode = shot === "1" || shot === "2" || shot === "3" || shot === "4";

let trophies = [];
let stats = null;
let state = shotMode ? seedState() : loadState();

if (shotMode) {
  if (shot === "2") state.tab = "roadmap";
  if (shot === "3") state.tab = "missables";
  if (shot === "4") { state.spoiler = true; state.selected = 7; }
  document.body.classList.add("shot");
}

const $ = (id) => document.getElementById(id);

function persist() { if (!shotMode) saveState(state); }

function renderAll() {
  const earned = state.earned.length;
  $("progress").textContent = earned + " / 55 earned · " + Math.round((earned / 55) * 100) + "%";
  renderAudit($("audit"), stats);
  renderChecklist($("checklist"), trophies, state, stats);
  renderDetail($("detail"), trophies, state, stats);
  renderSources($("sources"), stats);
  renderRoadmap($("roadmap"), trophies, state);
  renderMatrix($("matrix"), trophies, stats);
  renderMissables($("missables"), trophies);
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === state.tab));
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + state.tab));
  $("spoiler").checked = state.spoiler;
  $("search").value = state.query;
  document.querySelectorAll(".kind-btn").forEach((b) => b.classList.toggle("active", b.dataset.kind === state.kind));
}

function toggleEarned(id) {
  const i = state.earned.indexOf(id);
  if (i >= 0) state.earned.splice(i, 1);
  else state.earned.push(id);
  persist(); renderAll();
}

function reveal(id) {
  if (!state.revealed.includes(id)) state.revealed.push(id);
  state.selected = id;
  persist(); renderAll();
}

function bind() {
  document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => {
    state.tab = b.dataset.tab; persist(); renderAll();
  }));
  document.querySelectorAll(".kind-btn").forEach((b) => b.addEventListener("click", () => {
    state.kind = b.dataset.kind; state.tab = "ledger"; persist(); renderAll();
  }));
  $("search").addEventListener("input", (e) => { state.query = e.target.value; renderAll(); });
  $("spoiler").addEventListener("change", (e) => { state.spoiler = e.target.checked; persist(); renderAll(); });
  $("export").addEventListener("click", () => exportState(state));
  $("import-file").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (f) importState(f, (next) => { if (next) { state = next; persist(); renderAll(); } });
    e.target.value = "";
  });
  $("demo").addEventListener("click", () => { state = seedState(); persist(); renderAll(); });
  $("reset").addEventListener("click", () => { state = emptyState(); persist(); renderAll(); });
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-toggle]");
    if (t) { toggleEarned(Number(t.dataset.toggle)); return; }
    const r = e.target.closest("[data-reveal]");
    if (r) { reveal(Number(r.dataset.reveal)); return; }
    const row = e.target.closest(".row[data-id]");
    if (row) { state.selected = Number(row.dataset.id); state.tab = "ledger"; persist(); renderAll(); return; }
    const item = e.target.closest(".stage-item[data-id], .miss-row[data-id]");
    if (item) { state.selected = Number(item.dataset.id); state.tab = "ledger"; persist(); renderAll(); }
  });
  document.addEventListener("input", (e) => {
    const c = e.target.closest("[data-count]");
    if (c) {
      const id = Number(c.dataset.count);
      state.counts[id] = Number(c.value);
      persist();
      const val = c.parentElement.querySelector(".count-val");
      const t = trophies.find((x) => x.id === id);
      if (val && t) val.textContent = formatCount(t, state.counts[id]);
    }
  });
}

try {
  trophies = await loadTrophies();
  stats = auditStats(trophies);
  bind();
  renderAll();
  document.body.classList.add("ready");
} catch (err) {
  $("detail").innerHTML = "<p class=\"error\">Could not load the trophy data. Serve this folder over HTTP (for example: npx serve app) and reload.</p>";
  console.error(err);
}
