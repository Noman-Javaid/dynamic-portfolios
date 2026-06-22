export type ThemeTokens = {
  accent: string;
  accentStrong: string;
  base: string;
  panel: string;
  text: string;
  border: string;
  radius: string;
  font: string;
};

export const DEFAULT_TOKENS: ThemeTokens = {
  accent: "#43e1f0",
  accentStrong: "#14b6cc",
  base: "#ffffff",
  panel: "#ffffff",
  text: "#0a0a0a",
  border: "#ebebed",
  radius: "0.5rem",
  font: "inter",
};

export const FONT_STACKS: Record<string, string> = {
  inter: "var(--font-sans)",
  system: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  serif: "ui-serif, Georgia, Cambria, 'Times New Roman', serif",
  mono: "var(--font-mono), ui-monospace, monospace",
};

export const COLOR_FIELDS: {
  key: keyof ThemeTokens;
  label: string;
  hint: string;
  advanced?: boolean;
}[] = [
  { key: "accent", label: "Accent", hint: "Primary brand color — buttons, links, highlights." },
  { key: "accentStrong", label: "Accent (deep)", hint: "Hover state, icon tint, emphasis." },
  { key: "base", label: "Page background", hint: "The page backdrop.", advanced: true },
  { key: "panel", label: "Card / surface", hint: "Card and panel backgrounds.", advanced: true },
  { key: "text", label: "Text", hint: "Main text color.", advanced: true },
  { key: "border", label: "Borders", hint: "Default border color.", advanced: true },
];

export const RADIUS_OPTIONS = [
  { label: "Sharp", value: "0rem" },
  { label: "Subtle", value: "0.35rem" },
  { label: "Default", value: "0.5rem" },
  { label: "Rounded", value: "0.875rem" },
  { label: "Extra round", value: "1.25rem" },
];

export const FONT_OPTIONS = [
  { label: "Inter (default)", value: "inter" },
  { label: "System", value: "system" },
  { label: "Serif", value: "serif" },
  { label: "Mono", value: "mono" },
];

const COLOR_RE = /^#[0-9a-fA-F]{3,8}$/;
const RADIUS_RE = /^[0-9]*\.?[0-9]+rem$/;

const color = (v: unknown, fb: string) =>
  typeof v === "string" && COLOR_RE.test(v.trim()) ? v.trim() : fb;

export function mergeTokens(t?: Partial<ThemeTokens> | null): ThemeTokens {
  return { ...DEFAULT_TOKENS, ...(t ?? {}) };
}

export function themeStyle(input?: Partial<ThemeTokens> | null): Record<string, string> {
  const t = mergeTokens(input);
  const r = RADIUS_RE.test(t.radius) ? t.radius : DEFAULT_TOKENS.radius;
  return {
    "--accent": color(t.accent, DEFAULT_TOKENS.accent),
    "--accent-strong": color(t.accentStrong, DEFAULT_TOKENS.accentStrong),
    "--base": color(t.base, DEFAULT_TOKENS.base),
    "--panel": color(t.panel, DEFAULT_TOKENS.panel),
    "--text": color(t.text, DEFAULT_TOKENS.text),
    "--border": color(t.border, DEFAULT_TOKENS.border),
    "--base-2": "color-mix(in srgb, var(--base), var(--text) 4%)",
    "--border-strong": "color-mix(in srgb, var(--border), var(--text) 12%)",
    "--accent-soft": "color-mix(in srgb, var(--accent) 16%, transparent)",
    "--text-muted": "color-mix(in srgb, var(--text) 62%, transparent)",
    "--text-faint": "color-mix(in srgb, var(--text) 45%, transparent)",
    "--ui-font": FONT_STACKS[t.font] ?? FONT_STACKS.inter,
    "--radius-sm": `calc(${r} * 0.5)`,
    "--radius-md": `calc(${r} * 0.75)`,
    "--radius-lg": r,
    "--radius-xl": `calc(${r} * 1.5)`,
    "--radius-2xl": `calc(${r} * 2)`,
    "--radius-3xl": `calc(${r} * 3)`,
    "--radius-4xl": `calc(${r} * 4)`,
  };
}
