'use client';

import React from 'react';
import { DocHeader, DocSection } from '@/components/docs/doc-blocks';

const SPACING = [
  { step: '1', px: 4, use: 'Icon-to-label gaps' },
  { step: '2', px: 8, use: 'Tight groups, chips' },
  { step: '3', px: 12, use: 'Inputs, compact padding' },
  { step: '4', px: 16, use: 'Default gap and padding' },
  { step: '6', px: 24, use: 'Card padding, grid gaps' },
  { step: '8', px: 32, use: 'Between groups' },
  { step: '12', px: 48, use: 'Section headers' },
  { step: '16', px: 64, use: 'Between page regions' },
  { step: '24', px: 96, use: 'Major section rhythm' },
];

export default function SpacingPage() {
  return (
    <div>
      <DocHeader title="Spacing" lead="All spacing comes from a 4px grid. Consistent steps create rhythm, and fewer choices make layouts faster to build and review." />

      <DocSection title="Spacing scale" description="Tailwind steps — p-4, gap-6, mt-12 and so on.">
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {SPACING.map((s) => (
            <div key={s.step} className="grid grid-cols-[80px_80px_1fr_200px] items-center gap-4 px-5 py-3">
              <span className="font-mono text-sm font-semibold">{s.step}</span>
              <span className="font-mono text-xs text-muted-foreground">{s.px}px</span>
              <span className="h-3 rounded-sm bg-primary" style={{ width: s.px * 2 }} />
              <span className="text-sm text-muted-foreground">{s.use}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="In practice" description="A card uses step 6 inside and step 4 between its elements; cards sit step 6 apart.">
        <div className="grid grid-cols-3 gap-6 rounded-xl border border-dashed border-border p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="h-3 w-1/2 rounded bg-foreground/80" />
              <div className="space-y-2">
                <div className="h-2 rounded bg-muted-foreground/40" />
                <div className="h-2 w-4/5 rounded bg-muted-foreground/40" />
              </div>
              <div className="h-8 w-24 rounded-md bg-primary" />
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  );
}
