import type { ExperienceItem } from "@/data/portfolio";

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const END_YEAR = 2026;
const START_YEAR = 2015;

/**
 * Hides real tenure: deterministically redistributes the END_YEAR..START_YEAR
 * span across the experiences (each at least 1 year), sorts them
 * highest-to-lowest, then lays out contiguous year ranges from most recent
 * (END_YEAR) back to START_YEAR. Same input → same output, so the frontend
 * timeline and the CV stay in sync.
 */
export function arrangeExperience(items: ExperienceItem[]): ExperienceItem[] {
  const n = items.length;
  if (n === 0) return [];

  const rng = mulberry32(hashStr(items.map((e) => `${e.company}|${e.role}`).join("~")));
  const total = END_YEAR - START_YEAR;

  let years: number[];
  if (n >= total) {
    years = items.map(() => 1);
  } else {
    const weights = items.map(() => rng() * 0.9 + 0.1);
    const wsum = weights.reduce((a, b) => a + b, 0);
    years = weights.map((w) => Math.max(1, Math.floor((w / wsum) * total)));

    let diff = total - years.reduce((a, b) => a + b, 0);
    while (diff > 0) {
      const idx = years.indexOf(Math.max(...years));
      years[idx]++;
      diff--;
    }
    while (diff < 0) {
      let idx = -1;
      let min = Infinity;
      for (let i = 0; i < n; i++) {
        if (years[i] > 1 && years[i] < min) {
          min = years[i];
          idx = i;
        }
      }
      if (idx === -1) break;
      years[idx]--;
      diff++;
    }
  }

  const sorted = items
    .map((exp, i) => ({ exp, years: years[i] }))
    .sort((a, b) => b.years - a.years);

  let end = END_YEAR;
  const out: ExperienceItem[] = [];
  for (const { exp, years: y } of sorted) {
    const start = end - y;
    out.push({ ...exp, period: `${start} – ${end}` });
    end = start;
  }
  return out;
}
