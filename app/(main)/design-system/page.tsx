'use client';

import React from 'react';
import Link from 'next/link';
import { Accessibility, ArrowRight, Box, Component, Maximize, Palette, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, THEMES } from '@/components/theme-provider';
import { useDesignSystem } from '@/lib/design-system-store';
import { useUniverseTokens, UNIVERSE_NAMES, COLOR_ROLES } from '@/lib/hooks/use-universe-tokens';
import { DocHeader, DocSection } from '@/components/docs/doc-blocks';

const SECTIONS = [
  { title: 'Tokens', href: '/design-system/tokens', icon: Box, body: 'Every CSS variable in the active universe, ready to copy.' },
  { title: 'Colors', href: '/design-system/colors', icon: Palette, body: 'Semantic color roles with measured WCAG contrast.' },
  { title: 'Typography', href: '/design-system/typography', icon: Type, body: 'Type families and the scale used across the product.' },
  { title: 'Spacing', href: '/design-system/spacing', icon: Maximize, body: 'The 4px spacing grid and radius scale.' },
  { title: 'Components', href: '/design-system/components', icon: Component, body: 'Live components with usage code and props.' },
  { title: 'Accessibility', href: '/design-system/accessibility', icon: Accessibility, body: 'Standards, a live contrast checker and keyboard support.' },
];

const PRINCIPLES = [
  { title: 'Tokens before pixels', body: 'Every color, radius and type size is a semantic token. Components never hard-code values, so a universe can change everything at once.' },
  { title: 'Legible in every universe', body: 'Text pairs are verified at WCAG AA or better in all four universes. Identity never comes at the cost of readability.' },
  { title: 'Motion with a purpose', body: 'Animation explains change of state. It uses transform and opacity only, and switches off when the user prefers reduced motion.' },
  { title: 'Keyboard is a first-class input', body: 'Every interaction is reachable and operable from the keyboard, with a visible focus indicator.' },
];

export default function DesignSystemOverview() {
  const { theme, setTheme } = useTheme();
  const tokens = useUniverseTokens();
  const { tokens: ds, updateToken } = useDesignSystem();
  const info = UNIVERSE_NAMES[theme];

  return (
    <div>
      <DocHeader title="Design System" lead="The foundations behind every page of The Multiverse. Values on these pages are read live from the active universe, so the documentation always matches what you see." />

      <DocSection title="Active universe" description="Switch to see every token, color and component update in place.">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-display text-3xl font-bold tracking-tight">{info.name}</p>
              <p className="mt-2 max-w-lg text-muted-foreground">{info.character}</p>
            </div>
            <div className="flex gap-1 rounded-xl border border-border p-1" role="radiogroup" aria-label="Universe">
              {THEMES.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={theme === t} onClick={() => setTheme(t)} className={cn('rounded-lg px-3 py-1.5 text-sm font-medium transition-colors', theme === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                  {UNIVERSE_NAMES[t].name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex overflow-hidden rounded-lg border border-border">
            {COLOR_ROLES.filter((r) => !r.variable.endsWith('-fg')).map((r) => (
              <div key={r.variable} className="h-12 flex-1" style={{ background: tokens?.solid[r.variable] }} title={`${r.name} ${tokens?.solid[r.variable] ?? ''}`} />
            ))}
          </div>
        </div>
      </DocSection>

      <DocSection title="Reference">
        <div className="grid grid-cols-2 gap-4">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-foreground"><s.icon size={18} /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between text-base font-semibold">{s.title}<ArrowRight size={15} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span>
                <span className="mt-1 block text-sm text-muted-foreground">{s.body}</span>
              </span>
            </Link>
          ))}
        </div>
      </DocSection>

      <DocSection id="principles" title="Principles" description="The rules every addition to the system follows.">
        <ol className="grid grid-cols-2 gap-4">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ol>
      </DocSection>

      <DocSection title="Developer tools">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
          <div>
            <p className="font-semibold">Motion Inspector</p>
            <p className="text-sm text-muted-foreground">Overlay that shows animation timing and lets you slow down or pause motion globally.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={ds.showInspector}
            aria-label="Motion Inspector"
            onClick={() => updateToken('showInspector', !ds.showInspector)}
            className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', ds.showInspector ? 'bg-primary' : 'bg-muted ring-1 ring-inset ring-border')}
          >
            <span className={cn('absolute left-0 top-1 h-4 w-4 rounded-full shadow transition-transform', ds.showInspector ? 'translate-x-6 bg-primary-foreground' : 'translate-x-1 bg-foreground/70')} />
          </button>
        </div>
      </DocSection>
    </div>
  );
}
