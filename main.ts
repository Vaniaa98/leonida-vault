// Leonida Vault — entry program (Node 22, standard library only).
//
// The guide is this directory's app/ folder: plain static files a browser
// opens at app/index.html (ES modules, CSS, no build step), fully offline —
// it loads nothing over the network, and its trophy list and guides live in
// app/data/trophies.json. This program hands the entry in: it copies app/
// and screenshots/ from beside this file to /output and writes
// /output/dossier.json, the summary the judge reads (the screenshots, the
// first load's files and bytes, and the source), using the vendored make.fun
// library. vendor/makefun-frontend.ts is left exactly as shipped: the scorer
// requires dossier.json to be byte for byte what its own copy writes.
//
// What the app is: a trophy-cabinet tracker and guide for all 55 GTA 6
// trophies — a dense 3-column ledger (checklist with kind filters + search,
// guide detail with numbered cited steps + YOUR COUNT counters, sources
// panel), a roadmap S0–S7 with per-stage progress and a Next Up planner, a
// source matrix, a missables & watch page, and a spoiler guard that hides
// story and hidden trophies until earned. Every guide step cites one of the
// 10 sources read on 20 Nov 2026; 194 steps, all cited; 55/55 guides cite a
// source. Six trophies are still unconfirmed — their guides say so instead
// of guessing. Screenshots are deterministic ?shot= views (see shots.json).
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 48 MiB of app files: app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
