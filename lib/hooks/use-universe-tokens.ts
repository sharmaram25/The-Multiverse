'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme-provider';

export const COLOR_ROLES = [
  { variable: '--bg', name: 'Background', utility: 'bg-background', usage: 'Page background' },
  { variable: '--fg', name: 'Foreground', utility: 'text-foreground', usage: 'Primary text' },
  { variable: '--primary', name: 'Primary', utility: 'bg-primary', usage: 'Primary actions, focus, emphasis' },
  { variable: '--primary-fg', name: 'Primary foreground', utility: 'text-primary-foreground', usage: 'Text on primary' },
  { variable: '--muted', name: 'Muted', utility: 'bg-muted', usage: 'Subtle surfaces, hover states' },
  { variable: '--muted-fg', name: 'Muted foreground', utility: 'text-muted-foreground', usage: 'Secondary text' },
  { variable: '--card', name: 'Card', utility: 'bg-card', usage: 'Raised surfaces' },
  { variable: '--border', name: 'Border', utility: 'border-border', usage: 'Dividers and outlines' },
  { variable: '--accent', name: 'Accent', utility: 'bg-accent', usage: 'Highlights' },
  { variable: '--accent-fg', name: 'Accent foreground', utility: 'text-accent-foreground', usage: 'Text on accent' },
] as const;

export const RADIUS_VARS = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--radius-full'] as const;

export interface UniverseTokens {
  /** Raw declared values, e.g. "rgba(255,255,255,0.05)". */
  raw: Record<string, string>;
  /** Opaque hex values, translucent colors composited over the background. */
  solid: Record<string, string>;
  fonts: { body: string; display: string; mono: string };
}

function parseColor(value: string): { r: number; g: number; b: number; a: number } | null {
  const probe = document.createElement('span');
  probe.style.color = value;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const m = computed.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return { r, g, b, a };
}

const toHex = (c: { r: number; g: number; b: number }) =>
  '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** Reads the active universe's design tokens straight from the cascade, so docs always match the UI. */
export function useUniverseTokens(): UniverseTokens | null {
  const { theme } = useTheme();
  const [tokens, setTokens] = useState<UniverseTokens | null>(null);

  useEffect(() => {
    // Wait a frame so the universe class has been applied.
    const id = requestAnimationFrame(() => {
      const cs = getComputedStyle(document.documentElement);
      const read = (v: string) => cs.getPropertyValue(v).trim();
      const raw: Record<string, string> = {};
      [...COLOR_ROLES.map((r) => r.variable), ...RADIUS_VARS].forEach((v) => { raw[v] = read(v); });
      const bg = parseColor(raw['--bg']) ?? { r: 255, g: 255, b: 255, a: 1 };
      const solid: Record<string, string> = {};
      COLOR_ROLES.forEach(({ variable }) => {
        const c = parseColor(raw[variable]);
        if (!c) return;
        solid[variable] = toHex(c.a < 1 ? { r: c.r * c.a + bg.r * (1 - c.a), g: c.g * c.a + bg.g * (1 - c.a), b: c.b * c.a + bg.b * (1 - c.a) } : c);
      });
      setTokens({
        raw,
        solid,
        fonts: { body: read('--u-font-body'), display: read('--u-font-display'), mono: read('--u-font-mono') },
      });
    });
    return () => cancelAnimationFrame(id);
  }, [theme]);

  return tokens;
}

export const UNIVERSE_NAMES: Record<string, { name: string; character: string }> = {
  minimal: { name: 'Minimal', character: 'Editorial restraint. Geist, hairline rules, no decoration that does not carry meaning.' },
  glass: { name: 'Glass', character: 'Translucent depth. Layered surfaces with a lit top edge, soft colored light, slow ambient motion.' },
  neon: { name: 'Neon', character: 'Luminous signal. A technical grid, monospaced labels and edges that glow on interaction.' },
  brutalist: { name: 'Brutalist', character: 'Raw structure. Uppercase grotesk, thick rules and hard offset shadows that move on hover.' },
};
