// data.js — loads the trophy data and answers every question the views ask
// about it: audit-strip numbers, citation coverage, per-source counts, and
// the green/amber backing of each trophy card.
import { SOURCES, DISAGREEMENTS, STAGES } from "./sources.js";

export const KIND_LABELS = {
  goal: "Goal", story: "Story", side: "Side", collectibles: "Collectibles",
  activities: "Activities", crime: "Crime", money: "Money", misc: "Misc",
};

export async function loadTrophies() {
  const res = await fetch("./data/trophies.json");
  if (!res.ok) throw new Error("trophies.json failed to load: " + res.status);
  const doc = await res.json();
  return doc.trophies;
}

// Distinct sources cited by a trophy's steps.
export function trophySources(t) {
  const out = new Set();
  for (const step of t.steps) for (const n of step[1]) out.add(n);
  return out;
}

// Green = the guide rests on more than one source and nothing about it is
// disputed or unconfirmed. Amber = list-only / single source / disagreement /
// unconfirmed — the card says so, and the Missables page explains why.
export function backing(t) {
  if (t.unconfirmed || t.disagree || trophySources(t).size < 2) return "amber";
  return "green";
}

export function auditStats(trophies) {
  const byGrade = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  let hidden = 0, missable = 0, watch = 0, unconfirmed = 0;
  let steps = 0, citedSteps = 0, guidesWithSource = 0;
  const citedBy = new Map(SOURCES.map((s) => [s.n, new Set()]));
  let green = 0, amber = 0;
  for (const t of trophies) {
    byGrade[t.grade]++;
    if (t.hidden) hidden++;
    if (t.missable === "possible") missable++;
    if (t.missable === "watch") watch++;
    if (t.unconfirmed) unconfirmed++;
    steps += t.steps.length;
    if (t.steps.every((s) => s[1].length > 0)) citedSteps += t.steps.length;
    if (trophySources(t).size > 0) guidesWithSource++;
    for (const n of trophySources(t)) citedBy.get(n).add(t.id);
    if (backing(t) === "green") green++; else amber++;
  }
  return {
    total: trophies.length, byGrade, hidden, missable, watch, unconfirmed,
    steps, citedSteps, guidesWithSource,
    citedBy: Object.fromEntries([...citedBy].map(([n, s]) => [n, s.size])),
    green, amber, disagreements: DISAGREEMENTS.length, sources: SOURCES.length,
  };
}

export function auditStrip(stats) {
  const g = stats.byGrade;
  return [
    stats.total + " official",
    g.platinum + "P " + g.gold + "G " + g.silver + "S " + g.bronze + "B",
    stats.hidden + " hidden",
    stats.guidesWithSource + "/" + stats.total + " guides cite a source",
    stats.citedSteps + "/" + stats.steps + " steps cited",
    stats.sources + " sources read 20 Nov 2026",
    stats.missable + " possibly missable",
    stats.watch + " watch",
    stats.unconfirmed + " unconfirmed",
    stats.disagreements + " disagree",
  ].join(" · ");
}

// Progress of one roadmap stage, given the earned set.
export function stageProgress(stageId, trophies, earned) {
  const list = trophies.filter((t) => t.stage === stageId);
  const done = list.filter((t) => earned.has(t.id)).length;
  return { total: list.length, done, list };
}

// Next Up: the first unearned trophy in roadmap order. Stage S0 (the goal
// trophies) is skipped — the platinum and A Long Road complete last, so they
// are never "next".
export function nextUp(trophies, earned) {
  const order = [...STAGES.map((s) => s.id)];
  const sorted = [...trophies].sort(
    (a, b) => order.indexOf(a.stage) - order.indexOf(b.stage) || a.id - b.id,
  );
  return sorted.find((t) => t.stage !== "S0" && !earned.has(t.id)) || null;
}

export { SOURCES, DISAGREEMENTS, STAGES };
