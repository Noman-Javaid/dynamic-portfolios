import type { ExperienceItem } from "@/data/portfolio";

const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const ONGOING = /^(present|current|now|continue)$/i;

function isOngoingPeriod(period: string): boolean {
  const parts = period
    .split(/\s*[-–—]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) return false;
  return ONGOING.test(parts[parts.length - 1]);
}

interface ParsedPeriod {
  start: Date;
  end: Date;
  tenureYears: number;
}

function parseMonthYear(value: string): Date | null {
  const trimmed = value.trim();

  const monthYear = trimmed.match(/^([a-z]+)\s+(\d{4})$/i);
  if (monthYear) {
    const month = MONTHS[monthYear[1].slice(0, 3).toLowerCase()];
    if (month !== undefined) {
      return new Date(Number(monthYear[2]), month, 1);
    }
  }

  const yearOnly = trimmed.match(/^(\d{4})$/);
  if (yearOnly) {
    return new Date(Number(yearOnly[1]), 0, 1);
  }

  return null;
}

function parsePeriod(period: string): ParsedPeriod | null {
  const parts = period
    .split(/\s*[-–—]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return null;

  const start = parseMonthYear(parts[0]);
  if (!start) return null;

  const endRaw = parts.length >= 2 ? parts[parts.length - 1] : parts[0];
  const end = ONGOING.test(endRaw) ? new Date() : parseMonthYear(endRaw);
  if (!end) return null;

  const [rangeStart, rangeEnd] = start <= end ? [start, end] : [end, start];
  const months =
    (rangeEnd.getFullYear() - rangeStart.getFullYear()) * 12 +
    (rangeEnd.getMonth() - rangeStart.getMonth());

  return {
    start: rangeStart,
    end: rangeEnd,
    tenureYears: Math.max(1, Math.round(months / 12) || 1),
  };
}

/**
 * Orders experience for display using each entry's admin "Period" field.
 * Keeps the stored period text as-is. Ongoing roles (Continue, Present, etc.)
 * always appear first, then longest-tenure first, then most-recent end date.
 * Unparseable periods keep their input order at the bottom.
 */
export function arrangeExperience(items: ExperienceItem[]): ExperienceItem[] {
  const indexed = items.map((exp, index) => {
    const parsed = parsePeriod(exp.period);
    return { exp, parsed, ongoing: isOngoingPeriod(exp.period), index };
  });

  return indexed
    .sort((a, b) => {
      if (a.ongoing !== b.ongoing) return a.ongoing ? -1 : 1;

      if (a.parsed && b.parsed) {
        if (a.ongoing && b.ongoing) {
          const byStart = b.parsed.start.getTime() - a.parsed.start.getTime();
          if (byStart !== 0) return byStart;
        }

        const byTenure = b.parsed.tenureYears - a.parsed.tenureYears;
        if (byTenure !== 0) return byTenure;

        const byEnd = b.parsed.end.getTime() - a.parsed.end.getTime();
        if (byEnd !== 0) return byEnd;
      }

      if (a.parsed && !b.parsed) return -1;
      if (!a.parsed && b.parsed) return 1;

      return a.index - b.index;
    })
    .map(({ exp }) => exp);
}
