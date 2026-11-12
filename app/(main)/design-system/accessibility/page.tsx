'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contrastRatio, ensureContrast, normalizeHex } from '@/lib/color';
import { ColorField } from '@/components/builder/builder-sidebar';
import { DocHeader, DocSection } from '@/components/docs/doc-blocks';

const STANDARDS = [
  { title: 'Contrast', body: 'Body text 4.5:1, large text and UI components 3:1 (WCAG 2.2 AA). Verified in all four universes.' },
  { title: 'Keyboard', body: 'Every control is reachable with Tab and operable with Enter or Space. Menus close with Escape.' },
  { title: 'Focus', body: 'A 2px focus ring in the primary color appears on keyboard focus. Outlines are never removed without a replacement.' },
  { title: 'Motion', body: 'Animations respect prefers-reduced-motion. Ambient motion stops; state changes become instant.' },
  { title: 'Semantics', body: 'Native elements first. Custom widgets expose ARIA roles and states — tabs, radios, switches, dialogs.' },
  { title: 'Text', body: 'Meaning is never conveyed by color alone. Status always includes a label or icon.' },
];

const SHORTCUTS: Array<[string, string]> = [
  ['Ctrl / ⌘ + K', 'Open the command palette from any page'],
  ['Tab / Shift + Tab', 'Move between controls'],
  ['Esc', 'Close menus, dialogs and the command palette'],
  ['↑ ↓', 'Move through command palette results'],
  ['Ctrl / ⌘ + Z', 'Undo in the Builder'],
  ['?', 'Show Builder shortcuts'],
];

export default function AccessibilityPage() {
  const [fg, setFg] = useState('#6b7280');
  const [bg, setBg] = useState('#ffffff');
  const ratio = contrastRatio(fg, bg);
  const suggestion = ratio !== null && ratio < 4.5 ? ensureContrast(fg, bg, 4.5) : null;
  const checks = ratio === null ? [] : [
    { label: 'Normal text AA', need: 4.5 },
    { label: 'Normal text AAA', need: 7 },
    { label: 'Large text AA', need: 3 },
    { label: 'Large text AAA', need: 4.5 },
    { label: 'UI components', need: 3 },
  ];

  return (
    <div>
      <DocHeader title="Accessibility" lead="Accessibility is a release requirement, not an enhancement. These are the standards every page meets, and a checker you can use on your own colors." />

      <DocSection title="Contrast checker" description="Enter any two colors. If a pair fails, the closest passing text color is suggested.">
        <div className="grid grid-cols-[280px_1fr] gap-6 rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            <ColorField label="Text" value={fg} onChange={setFg} />
            <ColorField label="Background" value={bg} onChange={setBg} />
            <button type="button" onClick={() => { setFg(bg); setBg(fg); }} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted">
              <ArrowLeftRight size={13} /> Swap
            </button>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-border p-6" style={{ background: normalizeHex(bg) ?? '#fff', color: normalizeHex(fg) ?? '#000' }}>
              <p className="text-2xl font-semibold">Large text preview</p>
              <p className="mt-2 text-sm">Body text preview — the quick brown fox jumps over the lazy dog.</p>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="font-display text-4xl font-bold tabular-nums">{ratio ? `${ratio.toFixed(2)}:1` : '—'}</p>
              {suggestion && (
                <button type="button" onClick={() => setFg(suggestion)} className="inline-flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted">
                  <span className="h-3.5 w-3.5 rounded-sm ring-1 ring-border" style={{ background: suggestion }} /> Use {suggestion} (passes AA)
                </button>
              )}
            </div>
            <ul className="grid grid-cols-5 gap-2">
              {checks.map((c) => {
                const pass = (ratio ?? 0) >= c.need;
                return (
                  <li key={c.label} className={cn('rounded-lg border p-2.5 text-center', pass ? 'border-border' : 'border-destructive/50')}>
                    {pass ? <CheckCircle2 size={16} className="mx-auto text-success" /> : <XCircle size={16} className="mx-auto text-destructive" />}
                    <p className="mt-1.5 text-[11px] font-semibold leading-tight">{c.label}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{c.need}:1 · {pass ? 'Pass' : 'Fail'}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Standards">
        <div className="grid grid-cols-3 gap-4">
          {STANDARDS.map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Keyboard reference">
        <dl className="divide-y divide-border rounded-xl border border-border bg-card">
          {SHORTCUTS.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-5 py-3">
              <dt><kbd className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs">{k}</kbd></dt>
              <dd className="text-sm text-muted-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </DocSection>
    </div>
  );
}
