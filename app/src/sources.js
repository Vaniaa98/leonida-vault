// sources.js — the research behind Leonida Vault.
// Every guide step in app/data/trophies.json cites one of these sources by
// number. Sources are dated on the day they were read (20 Nov 2026) and each
// one lists what it actually contributed, so the "cited by N of 55" counts in
// the Sources panel are honest. Nothing here is copied from the sources:
// every guide is written in our own words, and a step that no source could
// confirm says so instead of guessing.
export const SOURCES = [
  { n: 1, name: "PowerPyx", site: "powerpyx.com", url: "https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/", read: "20 Nov 2026", role: "Trophy guide & roadmap — 55 trophies, 5 chapters, ~200h, difficulty 4/10, roadmap steps, balcony meditation, 18 vs 15 meditation count" },
  { n: 2, name: "OutputLag", site: "outputlag.com", url: "https://outputlag.com/guides/gta-6-trophy-list/", read: "20 Nov 2026", role: "Trophy list — all 27 visible + 28 hidden trophies, official descriptions, save-before-every-chapter, balcony meditation, no mission replay" },
  { n: 3, name: "KeenGamer", site: "keengamer.com", url: "https://keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/", read: "20 Nov 2026", role: "Trophy guide & platinum roadmap — 55 trophies, 200h, chapter breakdown, balcony meditation, 100% checklist thresholds" },
  { n: 4, name: "eGamers", site: "egamers.io", url: "https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/", read: "20 Nov 2026", role: "Trophy list — 55 trophies with counts (250 stunts, 42 ranges, 18 meditations), 300h estimate, stranger-chain windows via TechWiser, 6 unconfirmed trophies" },
  { n: 5, name: "GTABase", site: "gtabase.com", url: "https://gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series", read: "20 Nov 2026", role: "Achievements & trophies list — the workhorse source: per-trophy methods, counts, locations, side-character finals, 100% checklist; also reports the chains stay available after the story" },
  { n: 6, name: "GTA Vibes", site: "gtavibes.com", url: "https://gtavibes.com/guides/gta-6-trophy-list-achievements", read: "20 Nov 2026", role: "Trophy list — trophies grouped by kind (story / side / crime / activities), ~200h, 4/10 difficulty, 1 missable trophy" },
  { n: 7, name: "Push Square", site: "pushsquare.com", url: "https://pushsquare.com/guides/gta-6-trophy-guide-and-roadmap", read: "20 Nov 2026", role: "Trophy guide & roadmap — 300h+ estimate, 18 card sets / 15 for 100%, Touch Pad > Progress tracking, 100% checklist" },
  { n: 8, name: "GTA Spotter", site: "gtaspotter.com", url: "https://gtaspotter.com/en/guides/gta-6-trophies-and-achievements/", read: "20 Nov 2026", role: "Trophies & achievements guide — roadmap, cheats disable trophies + saving, no mission replay, Lucia-only / Jason-only quest lines, Irredeemable profile" },
  { n: 9, name: "Insider Gaming", site: "insider-gaming.com", url: "https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/", read: "20 Nov 2026", role: "Complete trophy list — all 55 split visible / hidden, 28 hidden tied to the story" },
  { n: 10, name: "Official list (kit)", site: "PlayStation trophy list, as shipped in the contest kit", url: "", read: "20 Nov 2026", role: "Official list — every trophy's name, description and grade, verbatim. Mirrors Exophase and PSNProfiles, which agree on every name, description and grade" },
];

// The four places where the sources disagree. Each one is shown both ways
// in the guides that touch it, and listed in full on the Missables page.
export const DISAGREEMENTS = [
  { id: "D1", title: "Final-mission wording", a: "Official description: “Complete the final mission.” [10]", b: "Beebom / CULTR (via eGamers): “Complete Chapter 5.” [4]", affects: "You Gotta Know When to Get Off (#7)" },
  { id: "D2", title: "Meditation count", a: "Trophy needs 18 meditations. [1][5]", b: "100% checklist needs 15 meditations. [1][3][4]", affects: "Positive Mental Attitude (#28)" },
  { id: "D3", title: "Platinum time", a: "~200 hours (60–80 story + ~100 checklist + 10–20 cleanup). [1][5][6]", b: "300 hours or more. [7]", affects: "Vice Got a Price! (#1)" },
  { id: "D4", title: "Side-chain windows", a: "Stranger chains have windows tied to story progress. [4] (TechWiser)", b: "The chains stay available after the story. [5]", affects: "Andy, Kenton, Billy, Randy, Tyrone finals (#22, #23, #24, #26, #27)" },
];

// Roadmap stages. S0 is the goal; S1–S7 is the play order.
export const STAGES = [
  { id: "S0", name: "The Goal", blurb: "The platinum and the 100% behind it." },
  { id: "S1", name: "Opening & Chapter 1", blurb: "Story start, the balcony meditation, first stranger chain." },
  { id: "S2", name: "Chapters 2–3", blurb: "Both characters together, side chains open, first activities." },
  { id: "S3", name: "Chapters 4–5 & finale", blurb: "Last chapters, last story trophies, free roam after." },
  { id: "S4", name: "Activities & challenges", blurb: "Ranges, races, stunts, challenges, arcade, airfield." },
  { id: "S5", name: "Collectibles & exploration", blurb: "Cards, WAiNK, meditations, vehicles, all of Leonida." },
  { id: "S6", name: "Crime & money", blurb: "Vaults, shops, gangs, laundry, garages, apps." },
  { id: "S7", name: "Cleanup & 100%", blurb: "Stranger strands, last unknowns, the long road." },
];

// Fixed demo progress used by the ?shot= views and by the "Load demo
// progress" button. 13 of 55 earned, with counters part-way, so the
// screenshots show a guide in use rather than an empty list.
export const SEED_EARNED = [2, 3, 4, 5, 8, 16, 18, 19, 20, 21, 35, 32, 53];
export const SEED_COUNTS = {
  28: 6, 15: 96, 16: 11, 20: 5, 31: 34, 32: 31, 35: 61,
  52: 87400, 54: 3, 55: 4, 25: 3, 48: 212, 14: 41, 43: 4, 40: 2, 30: 1, 17: 21,
};
