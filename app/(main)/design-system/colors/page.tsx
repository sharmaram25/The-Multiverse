'use client';

import React from 'react';
import { useUniverseTokens, COLOR_ROLES } from '@/lib/hooks/use-universe-tokens';
import { contrastRatio, readableOn, wcagRating } from '@/lib/color';
import { ContrastRow } from '@/components/builder/builder-sidebar';
import { CopyButton, DocHeader, DocSection } from '@/components/docs/doc-blocks';

const PAIRS: Array<{ label: string; fg: string; bg: string }> = [
  { label: 'Foreground on background', fg: '--fg', bg: '--bg' },
  { label: 'Muted text on background', fg: '--muted-fg', bg: '--bg' },
  { label: 'Muted text on muted surface', fg: '--muted-fg', bg: '--muted' },
  { label: 'Foreground on card', fg: '--fg', bg: '--card' },
  { label: 'Label on primary', fg: '--primary-fg', bg: '--primary' },
  { label: 'Primary as text on background', fg: '--primary', bg: '--bg' },
  { label: 'Label on accent', fg: '--accent-fg', bg: '--accent' },
];

export default function ColorsPage() {
  const tokens = useUniverseTokens();
  const swatches = COLOR_ROLES.filter((r) => !r.variable.endsWith('-fg'));

  return (
    <div>
      <DocHeader title="Colors" lead="Colors are defined as semantic roles. Each role below shows its live value in the active universe and the contrast of every text pair the product uses." />

      <DocSection title="Roles">
        <div className="grid grid-cols-3 gap-4">
          {swatches.map((r) => {
            const hex = tokens?.solid[r.variable] ?? '#000000';
            return (
              <div key={r.variable} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex h-24 items-end justify-between p-3" style={{ background: tokens?.raw[r.variable] }}>
                  <span className="font-mono text-[11px] font-semibold" style={{ color: readableOn(hex) }}>{hex}</span>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-border p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.usage}</p>
                  </div>
                  <CopyButton value={hex} label="" />
                </div>
              </div>
            );
          })}
        </div>
      </DocSection>

      <DocSection title="Contrast" description="WCAG 2.2: AA requires 4.5:1 for body text and 3:1 for large text. Translucent surfaces are measured as rendered.">
        <div className="grid grid-cols-[1fr_1fr] gap-6">
          <div className="space-y-2 rounded-xl border border-border bg-card p-5">
            {PAIRS.map((p) => (
              <ContrastRow key={p.label} label={p.label} ratio={tokens ? contrastRatio(tokens.solid[p.fg], tokens.solid[p.bg]) : null} />
            ))}
          </div>
          <div className="space-y-3">
            {PAIRS.slice(0, 5).map((p) => {
              const ratio = tokens ? contrastRatio(tokens.solid[p.fg], tokens.solid[p.bg]) ?? 1 : 1;
              return (
                <div key={p.label} className="flex items-center justify-between rounded-xl border border-border px-4 py-3" style={{ background: tokens?.solid[p.bg], color: tokens?.solid[p.fg] }}>
                  <span className="text-sm font-medium">{p.label}</span>
                  <span className="font-mono text-xs">{ratio.toFixed(2)} · {wcagRating(ratio)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </DocSection>
    </div>
  );
}
