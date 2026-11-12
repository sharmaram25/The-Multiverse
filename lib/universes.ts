import type { Theme } from '@/components/theme-provider';

/**
 * Static description of each universe. Palette values mirror app/globals.css
 * (composited to opaque hex for previews). Keep the two in sync.
 */
export interface UniverseSpec {
  id: Theme;
  name: string;
  tagline: string;
  summary: string;
  traits: Array<{ label: string; value: string }>;
  palette: { bg: string; fg: string; muted: string; mutedFg: string; primary: string; primaryFg: string; card: string; border: string; accent: string };
  radius: number;
  fontDisplay: string;
  fontBody: string;
  displayWeight: number;
  uppercaseDisplay?: boolean;
}

export const UNIVERSES: UniverseSpec[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Editorial restraint',
    summary: 'Precise type, generous whitespace and hairline structure. Nothing decorative that does not carry meaning.',
    traits: [
      { label: 'Type', value: 'Geist, tight and semibold' },
      { label: 'Surfaces', value: 'Flat, hairline borders, no shadows' },
      { label: 'Motion', value: 'Quiet, functional transitions' },
      { label: 'Best for', value: 'SaaS, documentation, product sites' },
    ],
    palette: { bg: '#ffffff', fg: '#0a0a0a', muted: '#f4f4f5', mutedFg: '#52525b', primary: '#111111', primaryFg: '#ffffff', card: '#ffffff', border: '#e4e4e7', accent: '#f4f4f5' },
    radius: 6,
    fontDisplay: 'var(--font-geist), system-ui, sans-serif',
    fontBody: 'var(--font-geist), system-ui, sans-serif',
    displayWeight: 600,
  },
  {
    id: 'glass',
    name: 'Glass',
    tagline: 'Translucent depth',
    summary: 'Layered translucent surfaces lit from the top edge, soft colored light and a slowly drifting aurora behind the page.',
    traits: [
      { label: 'Type', value: 'Inter with luminous gradient headings' },
      { label: 'Surfaces', value: 'Frosted layers with an inner highlight' },
      { label: 'Motion', value: 'Slow ambient drift, soft glow on hover' },
      { label: 'Best for', value: 'Consumer apps, fintech, premium launches' },
    ],
    palette: { bg: '#070b17', fg: '#f1f5f9', muted: '#13172a', mutedFg: '#a8b3c7', primary: '#c7d2fe', primaryFg: '#0b1022', card: '#10142a', border: '#262b3d', accent: '#191e30' },
    radius: 16,
    fontDisplay: 'var(--font-inter), system-ui, sans-serif',
    fontBody: 'var(--font-inter), system-ui, sans-serif',
    displayWeight: 600,
  },
  {
    id: 'neon',
    name: 'Neon',
    tagline: 'Luminous signal',
    summary: 'A technical grid, monospaced labels and edges that glow when you interact. Built for products that live in the dark.',
    traits: [
      { label: 'Type', value: 'Space Grotesk with JetBrains Mono labels' },
      { label: 'Surfaces', value: 'Dark panels with luminous edges' },
      { label: 'Motion', value: 'Glow responses, crisp state changes' },
      { label: 'Best for', value: 'Developer tools, gaming, data products' },
    ],
    palette: { bg: '#05070b', fg: '#e8fbff', muted: '#0b1118', mutedFg: '#8fc9d4', primary: '#00e5ff', primaryFg: '#00151a', card: '#091016', border: '#164a56', accent: '#ff3dd8' },
    radius: 2,
    fontDisplay: 'var(--font-space), system-ui, sans-serif',
    fontBody: 'var(--font-inter), system-ui, sans-serif',
    displayWeight: 700,
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    tagline: 'Raw structure',
    summary: 'Uppercase grotesk, thick rules and hard offset shadows that shift on hover. Confident, unpolished, impossible to ignore.',
    traits: [
      { label: 'Type', value: 'Space Grotesk, uppercase and heavy' },
      { label: 'Surfaces', value: 'Thick borders, hard offset shadows' },
      { label: 'Motion', value: 'Mechanical shifts, no easing flourish' },
      { label: 'Best for', value: 'Agencies, editorial, culture brands' },
    ],
    palette: { bg: '#f1efe8', fg: '#0a0a0a', muted: '#e2dfd4', mutedFg: '#383838', primary: '#b02200', primaryFg: '#ffffff', card: '#ffffff', border: '#0a0a0a', accent: '#1a2fff' },
    radius: 0,
    fontDisplay: 'var(--font-space), system-ui, sans-serif',
    fontBody: 'var(--font-space), system-ui, sans-serif',
    displayWeight: 700,
    uppercaseDisplay: true,
  },
];

export function getUniverse(id: string): UniverseSpec | undefined {
  return UNIVERSES.find((u) => u.id === id);
}
