/**
 * Palette generation from a single brand color, with every text pair corrected
 * to meet WCAG AA. Pure functions.
 */
import { contrastRatio, ensureContrast, hexToRgb, mix, normalizeHex, readableOn, rgbToHex } from '@/lib/color';

export type Harmony = 'complementary' | 'analogous' | 'triadic' | 'monochrome';
export type Mode = 'light' | 'dark';

interface HSL { h: number; s: number; l: number }

export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

export function hslToHex({ h, s, l }: HSL): string {
  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = hue < 60 ? [c, x, 0] : hue < 120 ? [x, c, 0] : hue < 180 ? [0, c, x] : hue < 240 ? [0, x, c] : hue < 300 ? [x, 0, c] : [c, 0, x];
  return rgbToHex({ r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 });
}

export interface GeneratedPalette {
  primary: string; secondary: string; accent: string;
  background: string; foreground: string; muted: string; border: string;
}

export function generatePalette(brand: string, harmony: Harmony, mode: Mode): GeneratedPalette | null {
  const base = normalizeHex(brand);
  const hsl = base ? hexToHsl(base) : null;
  if (!base || !hsl) return null;
  const offsets: Record<Harmony, [number, number]> = { complementary: [30, 180], analogous: [-30, 30], triadic: [120, 240], monochrome: [0, 0] };
  const [o1, o2] = offsets[harmony];
  const sat = Math.min(0.85, Math.max(0.35, hsl.s));
  const secondary = harmony === 'monochrome' ? hslToHex({ h: hsl.h, s: sat * 0.6, l: mode === 'light' ? 0.35 : 0.7 }) : hslToHex({ h: hsl.h + o1, s: sat, l: mode === 'light' ? 0.45 : 0.65 });
  const accentRaw = harmony === 'monochrome' ? hslToHex({ h: hsl.h, s: sat, l: mode === 'light' ? 0.6 : 0.4 }) : hslToHex({ h: hsl.h + o2, s: sat, l: mode === 'light' ? 0.5 : 0.62 });

  // Neutrals are tinted very slightly toward the brand hue for cohesion.
  const background = mode === 'light' ? hslToHex({ h: hsl.h, s: 0.2, l: 0.99 }) : hslToHex({ h: hsl.h, s: 0.3, l: 0.06 });
  const foreground = mode === 'light' ? hslToHex({ h: hsl.h, s: 0.25, l: 0.09 }) : hslToHex({ h: hsl.h, s: 0.15, l: 0.95 });
  const muted = mix(background, foreground, 0.05);
  const border = mix(background, foreground, 0.13);

  // Primary must work both as a button (with its label) and as text on the background.
  let primary = base;
  if ((contrastRatio(primary, background) ?? 0) < 4.5) primary = ensureContrast(primary, background, 4.5);
  return {
    primary,
    secondary: ensureContrast(secondary, background, 4.5),
    accent: ensureContrast(accentRaw, background, 3),
    background,
    foreground: ensureContrast(foreground, background, 12),
    muted,
    border,
  };
}

/** Corrects failing text pairs in an existing token set, changing as little as possible. */
export function fixContrast<T extends { primary: string; foreground: string; background: string; muted: string; accent: string }>(t: T): { fixed: T; changes: string[] } {
  const fixed = { ...t };
  const changes: string[] = [];
  const fg = ensureContrast(t.foreground, t.background, 4.5);
  const fgOnMuted = ensureContrast(fg, t.muted, 4.5);
  if (fgOnMuted !== t.foreground) { fixed.foreground = fgOnMuted; changes.push(`foreground ${t.foreground} → ${fgOnMuted}`); }
  const primary = ensureContrast(t.primary, t.background, 4.5);
  if (primary !== t.primary) { fixed.primary = primary; changes.push(`primary ${t.primary} → ${primary}`); }
  if ((contrastRatio(readableOn(fixed.primary), fixed.primary) ?? 0) < 4.5) {
    const deeper = ensureContrast(fixed.primary, readableOn(fixed.primary), 4.5);
    if (deeper !== fixed.primary) { changes.push(`primary ${fixed.primary} → ${deeper} (button label)`); fixed.primary = deeper; }
  }
  const accent = ensureContrast(t.accent, t.background, 3);
  if (accent !== t.accent) { fixed.accent = accent; changes.push(`accent ${t.accent} → ${accent}`); }
  return { fixed, changes };
}
