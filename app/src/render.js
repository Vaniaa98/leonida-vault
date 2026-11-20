// render.js — every view in Leonida Vault. Pure functions of (trophies,
// state, stats): the checklist, the guide detail, the roadmap, the source
// matrix, the missables page, the audit strip and the sources panel.
import { KIND_LABELS, backing, trophySources, stageProgress, nextUp } from "./data.js";
import { SOURCES, DISAGREEMENTS, STAGES } from "./sources.js";
import { formatCount } from "./store.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function gradeChip(t) {
  const map = { platinum: "PLAT", gold: "GOLD", silver: "SILV", bronze: "BRON" };
  return '<span class="chip grade-' + t.grade + '">' + map[t.grade] + "</span>";
}

export function flagBadges(t) {
  const out = [];
  if (t.hidden) out.push('<span class="flag hidden">HIDDEN</span>');
  if (t.missable === "possible") out.push('<span class="flag missable">POSSIBLY MISSABLE</span>');
  if (t.missable === "watch") out.push('<span class="flag watch">WATCH</span>');
  if (t.unconfirmed) out.push('<span class="flag unconfirmed">UNCONFIRMED</span>');
  if (t.disagree) out.push('<span class="flag disagree">SOURCES DISAGREE</span>');
  return out.join(" ");
}

// A trophy is masked when the spoiler guard is on, it is hidden, and it has
// not been earned or revealed yet.
export function isMasked(t, state) {
  return state.spoiler && t.hidden && !state.earned.includes(t.id) && !state.revealed.includes(t.id);
}

export function visibleTrophies(trophies, state) {
  const q = state.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (state.kind !== "all" && t.kind !== state.kind) return false;
    if (q && !(t.name + " " + t.description).toLowerCase().includes(q)) return false;
    return true;
  });
}

export function renderAudit(el, stats) {
  const g = stats.byGrade;
  el.innerHTML =
    "<span><b>" + stats.total + "</b> official</span><i>·</i>" +
    "<span><b>" + g.platinum + "P " + g.gold + "G " + g.silver + "S " + g.bronze + "B</b></span><i>·</i>" +
    "<span><b>" + stats.hidden + "</b> hidden</span><i>·</i>" +
    "<span><b>" + stats.guidesWithSource + "/" + stats.total + "</b> guides cite a source</span><i>·</i>" +
    "<span><b>" + stats.citedSteps + "/" + stats.steps + "</b> steps cited</span><i>·</i>" +
    "<span><b>" + stats.sources + "</b> sources read 20 Nov 2026</span><i>·</i>" +
    "<span class=\"a-miss\"><b>" + stats.missable + "</b> possibly missable</span><i>·</i>" +
    "<span><b>" + stats.watch + "</b> watch</span><i>·</i>" +
    "<span><b>" + stats.unconfirmed + "</b> unconfirmed</span><i>·</i>" +
    "<span><b>" + stats.disagreements + "</b> disagree</span>";
}

export function renderChecklist(el, trophies, state, stats) {
  const list = visibleTrophies(trophies, state);
  const earned = new Set(state.earned);
  el.innerHTML = list.map((t) => {
    const done = earned.has(t.id);
    const back = backing(t);
    if (isMasked(t, state)) {
      return '<div class="row masked' + (state.selected === t.id ? " sel" : "") + '" data-id="' + t.id + '">' +
        '<span class="box">' + (done ? "✓" : "") + "</span>" +
        '<span class="row-main"><span class="row-name">Hidden trophy — earn it to reveal</span>' +
        '<span class="row-sub">Hidden on PlayStation · <button class="reveal" data-reveal="' + t.id + '">Reveal</button></span></span>' +
        gradeChip(t) + "</div>";
    }
    const count = t.count != null ? '<span class="row-count">' + formatCount(t, state.counts[t.id]) + "</span>" : "";
    return '<div class="row back-' + back + (done ? " done" : "") + (state.selected === t.id ? " sel" : "") + '" data-id="' + t.id + '">' +
      '<span class="box" data-toggle="' + t.id + '">' + (done ? "✓" : "") + "</span>" +
      '<span class="row-main"><span class="row-name">' + esc(t.name) + "</span>" +
      '<span class="row-sub">' + KIND_LABELS[t.kind] + " · " + t.stage + " · " + esc(t.description) + "</span></span>" +
      count + flagBadges(t) + gradeChip(t) + "</div>";
  }).join("") || '<div class="empty">No trophies match this filter.</div>';
}

export function renderDetail(el, trophies, state, stats) {
  const t = trophies.find((x) => x.id === state.selected) || trophies[0];
  if (!t) { el.innerHTML = ""; return; }
  if (isMasked(t, state)) {
    el.innerHTML = '<div class="detail-masked"><h2>Hidden trophy</h2>' +
      "<p>This trophy is hidden on PlayStation. Turn the spoiler guard off, earn it in the game, or reveal it here to read its guide.</p>" +
      '<button class="btn" data-reveal="' + t.id + '">Reveal this trophy</button></div>';
    return;
  }
  const earned = state.earned.includes(t.id);
  const back = backing(t);
  const srcs = [...trophySources(t)].sort((a, b) => a - b);
  let html = '<div class="detail-head back-' + back + '">' +
    "<h2>" + esc(t.name) + "</h2>" +
    '<div class="detail-meta">' + gradeChip(t) + " " + flagBadges(t) +
    '<span class="kind">' + KIND_LABELS[t.kind] + " · " + t.stage + "</span></div>" +
    '<p class="official">“' + esc(t.description) + "”</p>" +
    '<p class="backing-note">' + (back === "green"
      ? "Green backing — guide source + official list agree, no disagreement."
      : "Amber backing — list-only, single source, disagreement, or unconfirmed. See why below.") + "</p></div>";
  if (t.missable === "possible") {
    html += '<div class="callout missable"><b>⚠ POSSIBLY MISSABLE — do this first.</b><br>' +
      "The Chapter 1 balcony meditation disappears after Chapter 1, and no source has confirmed whether the trophy needs it. Do it, and keep a Chapter 1 manual save until this pops.</div>";
  }
  if (t.missable === "watch") {
    html += '<div class="callout watch"><b>WATCH — start this chain early.</b><br>' +
      "One source warns the stranger chains have windows tied to story progress; another says they stay available after the story. Both versions are shown in the steps below — do the chain when it appears.</div>";
  }
  if (t.unconfirmed) {
    html += '<div class="callout unconfirmed"><b>UNCONFIRMED — exact steps not yet known.</b><br>' +
      "No source has pinned this one down yet. This guide says what the description points to and does not guess the rest.</div>";
  }
  if (t.disagree) {
    html += '<div class="callout disagree"><b>SOURCES DISAGREE — both versions shown.</b><br>' +
      "The steps below give both numbers or both wordings where the sources differ, so you can judge for yourself.</div>";
  }
  if (t.count != null) {
    html += '<div class="counter"><b>YOUR COUNT</b> <span class="count-val">' + formatCount(t, state.counts[t.id]) + "</span>" +
      '<input type="range" min="0" max="' + t.count + '" step="1" value="' + (state.counts[t.id] || 0) + '" data-count="' + t.id + '" aria-label="Your count for ' + esc(t.name) + '">' +
      '<span class="count-hint">Drag to update — saved in this browser.</span></div>';
  }
  html += '<h3>Guide — in our own words, every step cited</h3><ol class="steps">' +
    t.steps.map((s) => "<li>" + esc(s[0].replace(/\s*(\[\d+\])+$/, "")) + ' <span class="cite">[' + s[1].join("][") + "]</span></li>").join("") + "</ol>";
  html += '<p class="guide-src">Sources for this guide: ' + srcs.map((n) => "[" + n + "] " + esc(SOURCES[n - 1].name)).join(", ") + ".</p>";
  html += '<button class="btn earn" data-toggle="' + t.id + '">' + (earned ? "✓ Earned — click to undo" : "Mark as earned") + "</button>";
  el.innerHTML = html;
}

export function renderSources(el, stats) {
  el.innerHTML = "<h3>Sources — read 20 Nov 2026</h3>" +
    SOURCES.map((s) => '<div class="src"><b>[' + s.n + "] " + esc(s.name) + "</b> <span class=\"src-site\">" + esc(s.site) + "</span>" +
      '<span class="src-count">cited by <b>' + (stats.citedBy[s.n] || 0) + " of 55</b> guides</span>" +
      '<span class="src-role">' + esc(s.role) + "</span></div>").join("") +
    '<p class="src-note">Every guide step cites its source by number. Exophase and PSNProfiles were not read directly — the official list in the kit mirrors them and agrees on every name, description and grade.</p>' +
    '<p class="src-note">Legend: <span class="leg-green">green</span> = guide source + list source, no disagreement · <span class="leg-amber">amber</span> = list-only, single source, disagreement, or unconfirmed. ' +
    stats.green + " green · " + stats.amber + " amber.</p>";
}

export function renderRoadmap(el, trophies, state) {
  const earned = new Set(state.earned);
  const goal = nextUp(trophies, earned);
  const platDone = trophies.filter((t) => t.id !== 1 && earned.has(t.id)).length;
  let html = '<div class="goal-bar"><div class="goal-text"><b>GOAL — Vice Got a Price!</b> Platinum at ' + platDone + '/54 trophies · ' +
    Math.round((platDone / 54) * 100) + '%</div><div class="bar"><div class="bar-fill" style="width:' + Math.round((platDone / 54) * 100) + '%"></div></div></div>';
  if (goal) {
    html += '<div class="nextup"><b>NEXT UP</b> — ' + esc(goal.name) + " (" + goal.stage + ", " + KIND_LABELS[goal.kind] + ") — " + esc(goal.description) + "</div>";
  }
  html += STAGES.map((st) => {
    const p = stageProgress(st.id, trophies, earned);
    const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
    return '<div class="stage"><div class="stage-head"><b>' + st.id + " — " + esc(st.name) + '</b><span>' + p.done + "/" + p.total + "</span></div>" +
      '<div class="bar"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="stage-blurb">' + esc(st.blurb) + "</div>" +
      '<div class="stage-list">' + p.list.map((t) => '<span class="stage-item' + (earned.has(t.id) ? " done" : "") + '" data-id="' + t.id + '">' + esc(t.name) + "</span>").join(" · ") + "</div></div>";
  }).join("");
  el.innerHTML = html;
}

export function renderMatrix(el, trophies, stats) {
  el.innerHTML = "<h3>Source matrix — who backs what</h3>" +
    '<table class="matrix"><thead><tr><th>Source</th><th>Read</th><th>Guides citing it</th><th>What it backs</th></tr></thead><tbody>' +
    SOURCES.map((s) => "<tr><td><b>[" + s.n + "] " + esc(s.name) + "</b></td><td>" + s.read + "</td><td><b>" + (stats.citedBy[s.n] || 0) + " / 55</b></td><td>" + esc(s.role) + "</td></tr>").join("") +
    "</tbody></table>" +
    '<p class="src-note">194 steps, every one cited. The official list [10] backs every name, description and grade; GTABase [5] backs the most methods (54 of 55).</p>';
}

export function renderMissables(el, trophies) {
  const miss = trophies.filter((t) => t.missable === "possible");
  const watch = trophies.filter((t) => t.missable === "watch");
  const unc = trophies.filter((t) => t.unconfirmed);
  const whyFor = (t) =>
    t.missable === "possible" ? "Chapter 1 balcony meditation — gone after Chapter 1, unconfirmed whether the trophy needs it."
    : t.missable === "watch" ? "Stranger chain — sources disagree whether its window closes with the story."
    : "Exact steps not confirmed by any source yet.";
  const section = (title, list, note) => '<h3>' + title + "</h3>" + (note ? '<p class="sec-note">' + note + "</p>" : "") +
    list.map((t) => '<div class="miss-row" data-id="' + t.id + '"><b>' + esc(t.name) + "</b> — " + esc(t.description) +
      '<span class="miss-why"> ' + esc(whyFor(t)) + "</span></div>").join("");
  el.innerHTML =
    section("1 possibly missable", miss, "The only trophy that can be missed. Do it in Chapter 1 and keep a manual save.") +
    section("5 to watch", watch, "Stranger chains with a disputed window: one source says the window closes with the story, another says they stay available. Start each chain when it appears.") +
    section("6 unconfirmed", unc, "No source has pinned the exact steps down yet. These guides say what the description points to and do not guess.") +
    "<h3>4 disagreements — both versions shown</h3>" +
    '<div class="dis-grid">' +
    DISAGREEMENTS.map((d) => '<div class="dis"><b>' + d.id + " — " + esc(d.title) + "</b><br>A: " + esc(d.a) + "<br>B: " + esc(d.b) + '<br><span class="src-note">Affects: ' + esc(d.affects) + "</span></div>").join("") +
    "</div>";
}
