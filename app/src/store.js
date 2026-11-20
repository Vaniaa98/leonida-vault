// store.js — saved progress. Everything lives in localStorage under one
// key, so the tracker works offline and survives a reload. Export writes a
// JSON file; import reads one back. The ?shot= views bypass this entirely
// and use the fixed seed, so screenshots are deterministic.
import { SEED_EARNED, SEED_COUNTS } from "./sources.js";

const KEY = "leonida-vault-v1";

export function emptyState() {
  return {
    earned: [], counts: {}, spoiler: false, revealed: [],
    kind: "all", query: "", tab: "ledger", selected: 28,
  };
}

export function seedState() {
  return {
    earned: [...SEED_EARNED], counts: { ...SEED_COUNTS },
    spoiler: false, revealed: [], kind: "all", query: "",
    tab: "ledger", selected: 28,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    const base = emptyState();
    return { ...base, ...parsed };
  } catch (err) {
    return emptyState();
  }
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* storage full or blocked — the app still works in memory */ }
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "leonida-vault-progress.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function importState(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      onDone({ ...emptyState(), ...parsed });
    } catch (err) { onDone(null); }
  };
  reader.readAsText(file);
}

// Format a counter for display: "6/18 meditations" or "$87,400/$250,000".
export function formatCount(t, value) {
  if (t.count == null) return "";
  const have = value || 0;
  if (t.unit === "$ laundered" || t.unit === "$ spent") {
    return "$" + have.toLocaleString("en-US") + " / $" + t.count.toLocaleString("en-US");
  }
  if (t.unit === "% completion") return have + "% / 100%";
  return have + " / " + t.count + (t.unit ? " " + t.unit : "");
}
