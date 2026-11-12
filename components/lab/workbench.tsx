'use client';

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/docs/doc-blocks';

export interface CodeSnippet { label: string; code: string }

/**
 * Standard layout for every interactive lab demo:
 * live preview · controls · replay · copyable code in several formats.
 */
export function Workbench({
  id, title, description, preview, controls, code, onReplay, previewClassName,
}: {
  id?: string;
  title: string;
  description: string;
  preview: React.ReactNode;
  controls: React.ReactNode;
  code: CodeSnippet[];
  onReplay?: () => void;
  previewClassName?: string;
}) {
  const [tab, setTab] = useState(0);
  const active = code[Math.min(tab, code.length - 1)];
  return (
    <section id={id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex items-start justify-between gap-6 border-b border-border px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
        {onReplay && (
          <button type="button" onClick={onReplay} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-semibold hover:bg-muted">
            <RotateCcw size={14} /> Replay
          </button>
        )}
      </header>
      <div className="grid grid-cols-[1fr_300px]">
        <div className={cn('relative min-h-[340px] overflow-hidden bg-background', previewClassName)}>{preview}</div>
        <div className="space-y-5 border-l border-border p-5">{controls}</div>
      </div>
      {code.length > 0 && (
        <div className="border-t border-border bg-muted/40">
          <div className="flex items-center justify-between border-b border-border px-3">
            <div role="tablist" aria-label={`${title} code format`} className="flex">
              {code.map((c, i) => (
                <button key={c.label} role="tab" type="button" aria-selected={i === tab} onClick={() => setTab(i)} className={cn('-mb-px border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors', i === tab ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
                  {c.label}
                </button>
              ))}
            </div>
            <CopyButton value={active.code} />
          </div>
          <pre className="max-h-64 overflow-auto p-4 font-mono text-[12px] leading-relaxed text-foreground">{active.code}</pre>
        </div>
      )}
    </section>
  );
}

export function SliderControl({ label, value, min, max, step = 1, unit = '', onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
  const id = `ctl-${label.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <label htmlFor={id} className="font-semibold text-muted-foreground">{label}</label>
        <span className="font-mono tabular-nums">{value}{unit}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-primary" />
    </div>
  );
}

export function SegmentControl<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <div role="radiogroup" aria-label={label} className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(options.length, 3)}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)} className={cn('rounded-md border px-2 py-1.5 text-[11px] font-semibold transition-colors', value === o.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted')}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToggleControl({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn('relative h-5 w-9 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-muted ring-1 ring-inset ring-border')}>
        <span className={cn('absolute left-0 top-0.5 h-4 w-4 rounded-full shadow transition-transform', checked ? 'translate-x-4 bg-primary-foreground' : 'translate-x-0.5 bg-foreground/70')} />
      </button>
    </div>
  );
}

export function TextControl({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const id = `ctl-${label.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-muted-foreground">{label}</label>
      <input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );
}

/** Jump links for pages with several workbenches. */
export function LabIndex({ items }: { items: Array<{ id: string; label: string }> }) {
  return (
    <nav aria-label="On this page" className="flex flex-wrap gap-2">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{i.label}</a>
      ))}
    </nav>
  );
}
