# Leonida Vault — GTA 6 Trophy Guide & Tracker

[![Competition](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/Vaniaa98/leonida-vault/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/Vaniaa98/leonida-vault/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard)

An offline web app that guides you to the GTA 6 platinum — **all 55 PS5 trophies** (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden), each with a guide written in our own words, every step citing its source.

## What it does

- **Ledger** — dense 3-column view: checklist on the left (kind filters + search + earned ticks), guide detail in the centre, sources on the right. Saved progress in localStorage, with export/import.
- **Guide detail** — official description, MISSABLE? / WATCH / UNCONFIRMED / SOURCES DISAGREE callouts, numbered steps each cited `[n]`, and a YOUR COUNT counter for the count trophies (18 meditations, 250 stunts, 42 shooting ranges, 100 WAiNK spots…).
- **Roadmap to Platinum** — stages S0–S7 with per-stage progress, a GOAL bar for the platinum, and a Next Up planner that names the next trophy in roadmap order.
- **Source matrix** — the 10 sources read on 20 Nov 2026, each with its "cited by N of 55 guides" count.
- **Missables & Watch** — the 1 possibly missable trophy, the 5 stranger chains to watch, the 6 still-unconfirmed trophies, and the 4 places where the sources disagree, both versions shown.
- **Spoiler guard** — hides story and hidden trophies until earned, with a Reveal per trophy.
- **Audit strip** — 55 official · 1P 2G 6S 46B · 28 hidden · 55/55 guides cite a source · **194/194 steps cited** · 10 sources read 20 Nov 2026 · 1 possibly missable · 5 watch · 6 unconfirmed · 4 disagree.

## Sources (read 20 Nov 2026)

[1] PowerPyx · [2] OutputLag · [3] KeenGamer · [4] eGamers · [5] GTABase · [6] GTA Vibes · [7] Push Square · [8] GTA Spotter · [9] Insider Gaming · [10] the official PlayStation list as shipped in the contest kit (mirrors Exophase and PSNProfiles, which agree on every name, description and grade).

No guide text is copied from any source. Six trophies are still unconfirmed — their guides say what the description points to and do not guess.

## The one missable trophy

**Positive Mental Attitude** — in Chapter 1, the morning after Down to Earth, follow Lucia from the kitchen to the balcony and accept her meditation. It is gone after Chapter 1, and no source has confirmed whether the trophy needs it. Do it, and keep a Chapter 1 manual save.

## Run it

Serve the folder and open `app/index.html` (for example `node serve.ts`, then http://localhost:8080). Fully offline — no network requests at runtime, no account, no Rockstar logo or artwork.

Deterministic screenshots: `app/index.html?shot=1` (ledger, Positive Mental Attitude open), `?shot=2` (roadmap), `?shot=3` (missables & watch), `?shot=4` (spoiler guard on). Seeded progress is 13/55 in every shot view.

## Files

- `app/index.html`, `app/style.css` — shell and the dark trophy-cabinet theme
- `app/src/app.js` — boot, events, deterministic `?shot=` views
- `app/src/data.js` — loads the data, audit stats, Next Up planner
- `app/src/render.js` — every view (ledger, detail, roadmap, matrix, missables)
- `app/src/store.js` — saved progress (localStorage), export/import, demo seed
- `app/src/sources.js` — the 10 sources, the 4 disagreements, the roadmap stages
- `app/data/trophies.json` — all 55 trophies with guides (194 cited steps)
- `screenshots/` — 4 JPEGs, 1280×800, each under 256 KiB
- `main.ts` — copies `app/` + `screenshots/` to `/output` and writes `dossier.json`

Unofficial fan guide. Not affiliated with Rockstar Games.
