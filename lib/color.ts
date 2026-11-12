/**
 * Color utilities: parsing, WCAG 2.x contrast, and palette helpers.
 * Pure functions only — safe to use on server and client.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Returns true for #rgb or #rrggbb (with or without the leading #). */
export function isValidHex(value: string): boolean {
  return HEX_RE.test(value.trim());
}

/** Normalises any valid hex to lowercase #rrggbb. Returns null when invalid. */
export function normalizeHex(value: string): string | null {
  const match = value.trim().match(HEX_RE);
  if (!match) return null;
  let hex = match[1].toLowerCase();
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  return `#${hex}`;
}

export function hexToRgb(value: string): RGB | null {
  const hex = normalizeHex(value);
  if (!hex) return null;
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')}`;
}

/** WCAG 2.x relative luminance (0–1). */
export function relativeLuminance(rgb: RGB): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** WCAG contrast ratio between two hex colors (1–21). Returns null if either is invalid. */
export function contrastRatio(a: string, b: string): number | null {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return null;
  const la = relativeLuminance(ra);
  const lb = relativeLuminance(rb);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/** Rating for normal-size body text (AA ≥ 4.5, AAA ≥ 7, large text ≥ 3). */
export function wcagRating(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

/** Picks black or white — whichever has higher contrast against the background. */
export function readableOn(background: string): '#ffffff' | '#000000' {
  const white = contrastRatio(background, '#ffffff') ?? 0;
  const black = contrastRatio(background, '#000000') ?? 0;
  return white >= black ? '#ffffff' : '#000000';
}

/** Mixes two hex colors. weight = share of `b` (0–1). */
export function mix(a: string, b: string, weight: number): string {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return normalizeHex(a) ?? '#000000';
  const w = Math.max(0, Math.min(1, weight));
  return rgbToHex({
    r: ra.r * (1 - w) + rb.r * w,
    g: ra.g * (1 - w) + rb.g * w,
    b: ra.b * (1 - w) + rb.b * w,
  });
}

/**
 * Generates a Tailwind-style 50–950 tonal scale from a base color.
 * The base sits at 500; lighter steps mix toward white, darker toward black.
 */
export function tonalScale(base: string): Record<string, string> {
  const steps: Array<[string, string, number]> = [
    ['50', '#ffffff', 0.92],
    ['100', '#ffffff', 0.84],
    ['200', '#ffffff', 0.68],
    ['300', '#ffffff', 0.48],
    ['400', '#ffffff', 0.24],
    ['500', '#ffffff', 0],
    ['600', '#000000', 0.16],
    ['700', '#000000', 0.32],
    ['800', '#000000', 0.48],
    ['900', '#000000', 0.62],
    ['950', '#000000', 0.76],
  ];
  const out: Record<string, string> = {};
  for (const [key, target, w] of steps) out[key] = mix(base, target, w);
  return out;
}

/**
 * Nudges `fg` darker or lighter until it reaches `target` contrast against `bg`.
 * Returns the original color if it already passes, or the best attempt.
 */
export function ensureContrast(fg: string, bg: string, target = 4.5): string {
  const start = normalizeHex(fg);
  if (!start || !isValidHex(bg)) return fg;
  if ((contrastRatio(start, bg) ?? 0) >= target) return start;
  const direction = readableOn(bg);
  let best = start;
  for (let i = 1; i <= 20; i++) {
    const candidate = mix(start, direction, i / 20);
    best = candidate;
    if ((contrastRatio(candidate, bg) ?? 0) >= target) return candidate;
  }
  return best;
}
