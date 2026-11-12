'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { normalizeHex } from '@/lib/color';
import { generatePalette, type GeneratedPalette, type Harmony, type Mode } from '@/lib/palette';

const HARMONIES: Harmony[] = ['complementary', 'analogous', 'triadic', 'monochrome'];

export function PaletteGenerator({ onApply }: { onApply: (p: GeneratedPalette) => void }) {
  const [brand, setBrand] = useState('#2563eb');
  const [harmony, setHarmony] = useState<Harmony>('complementary');
  const [mode, setMode] = useState<Mode>('light');
  const palette = useMemo(() => generatePalette(brand, harmony, mode), [brand, harmony, mode]);
  const valid = normalizeHex(brand) !== null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input type="color" aria-label="Brand color picker" value={normalizeHex(brand) ?? '#000000'} onChange={(e) => setBrand(e.target.value)} className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5" />
        <input aria-label="Brand color" value={brand} onChange={(e) => setBrand(e.target.value)} spellCheck={false} className={cn('h-9 w-full rounded-md border bg-background px-2 font-mono text-xs outline-none focus:ring-2 focus:ring-primary/30', valid ? 'border-border' : 'border-destructive')} />
      </div>
      <div className="grid grid-cols-2 gap-1">
        {HARMONIES.map((h) => (
          <button key={h} type="button" aria-pressed={harmony === h} onClick={() => setHarmony(h)} className={cn('rounded-md border px-2 py-1.5 text-[11px] font-semibold capitalize', harmony === h ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted')}>{h}</button>
        ))}
      </div>
      <div className="flex gap-1 rounded-md border border-border p-0.5">
        {(['light', 'dark'] as const).map((m) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={cn('flex-1 rounded py-1 text-[11px] font-semibold capitalize', mode === m ? 'bg-muted text-foreground' : 'text-muted-foreground')}>{m}</button>
        ))}
      </div>
      {palette && (
        <div className="overflow-hidden rounded-md border border-border">
          <div className="flex h-8">
            {(['primary', 'secondary', 'accent', 'background', 'foreground', 'muted', 'border'] as const).map((k) => (
              <span key={k} className="flex-1" style={{ background: palette[k] }} title={`${k} ${palette[k]}`} />
            ))}
          </div>
        </div>
      )}
      <button type="button" disabled={!palette} onClick={() => palette && onApply(palette)} className="w-full rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">
        Apply generated palette
      </button>
      <p className="text-[11px] leading-snug text-muted-foreground">Every text pair is corrected to WCAG AA before it is applied.</p>
    </div>
  );
}
