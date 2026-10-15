export interface Tokens {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  rule: string;
  accent: string; // marcas e a logo
  accentText: string; // texto e links em laranja
}

export const THEMES: Record<"dark" | "light", Tokens> = {
  dark: { bg: "#161412", surface: "#1E1B18", text: "#F4EFEA", muted: "#B9B2AB", rule: "#2C2926", accent: "#FFA737", accentText: "#FFA737" },
  light: { bg: "#F6F1EB", surface: "#EFE7DE", text: "#1E1D1B", muted: "#5E5750", rule: "#E2D9CF", accent: "#FFA737", accentText: "#A34E08" },
};

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const vars = (t: Tokens) =>
  `--bg:${t.bg};--surface:${t.surface};--text:${t.text};--muted:${t.muted};--rule:${t.rule};--accent:${t.accent};--accent-text:${t.accentText};`;

export function themeCss(): string {
  return `:root,[data-theme="dark"]{${vars(THEMES.dark)}color-scheme:dark}[data-theme="light"]{${vars(THEMES.light)}color-scheme:light}`;
}
