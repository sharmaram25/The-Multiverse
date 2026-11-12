'use client';

import React, { useMemo, useState } from 'react';
import { Layers, LayoutTemplate, Palette, Plus, Search, FileStack, Target, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SECTION_DEFS } from '@/lib/builder/sections';
import { PLAYBOOKS, STARTER_TEMPLATES, type Playbook, type PlaybookId, type StarterTemplate } from '@/lib/builder/templates';
import type { SectionType, SiteTheme } from '@/lib/builder/types';
import { contrastRatio, normalizeHex, readableOn, wcagRating } from '@/lib/color';
import { FONT_STACKS } from '@/lib/tokens-export';
import { DRAG_NEW } from './builder-canvas';

export type SidebarTab = 'add' | 'templates' | 'theme';

interface SidebarProps {
  tab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onAdd: (type: SectionType) => void;
  onApplyTemplate: (template: StarterTemplate) => void;
  onApplyPlaybook: (playbook: Playbook) => void;
  activePlaybook: PlaybookId | null;
  theme: SiteTheme;
  onThemeChange: (patch: Partial<SiteTheme>) => void;
  onUsePlaygroundTokens: () => void;
}

const TABS: Array<{ id: SidebarTab; label: string; icon: LucideIcon }> = [
  { id: 'add', label: 'Sections', icon: Layers },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'theme', label: 'Theme', icon: Palette },
];

export function BuilderSidebar(props: SidebarProps) {
  const { tab, onTabChange } = props;
  return (
    <div className="flex h-full flex-col">
      <div role="tablist" aria-label="Builder panels" className="grid grid-cols-3 gap-1 border-b border-border p-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => onTabChange(t.id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-md py-2 text-[11px] font-semibold transition-colors',
              tab === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === 'add' && <SectionLibrary onAdd={props.onAdd} />}
        {tab === 'templates' && (
          <TemplateList onApplyTemplate={props.onApplyTemplate} onApplyPlaybook={props.onApplyPlaybook} activePlaybook={props.activePlaybook} />
        )}
        {tab === 'theme' && <ThemePanel theme={props.theme} onChange={props.onThemeChange} onUsePlaygroundTokens={props.onUsePlaygroundTokens} />}
      </div>
    </div>
  );
}

function SectionLibrary({ onAdd }: { onAdd: (type: SectionType) => void }) {
  const [query, setQuery] = useState('');
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = SECTION_DEFS.filter((d) => !q || d.label.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    const order = ['Structure', 'Content', 'Social proof', 'Conversion', 'Basic'] as const;
    return order.map((cat) => ({ cat, items: filtered.filter((d) => d.category === cat) })).filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <div className="space-y-4 p-3">
      <label className="relative block">
        <span className="sr-only">Search sections</span>
        <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sections…"
          className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </label>
      {groups.length === 0 && <p className="px-1 text-sm text-muted-foreground">No sections match “{query}”.</p>}
      {groups.map((g) => (
        <div key={g.cat}>
          <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{g.cat}</p>
          <div className="space-y-1.5">
            {g.items.map((def) => (
              <button
                key={def.type}
                type="button"
                draggable
                onDragStart={(e) => { e.dataTransfer.setData(DRAG_NEW, def.type); e.dataTransfer.effectAllowed = 'copy'; }}
                onClick={() => onAdd(def.type)}
                className="group flex w-full items-center gap-3 rounded-lg border border-border bg-card p-2.5 text-left transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{def.label}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{def.description}</div>
                </div>
                <Plus size={15} className="shrink-0 text-muted-foreground group-hover:text-primary" />
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="px-1 text-[11px] text-muted-foreground">Tip: drag a section onto the canvas to place it exactly.</p>
    </div>
  );
}

function TemplateList({ onApplyTemplate, onApplyPlaybook, activePlaybook }: { onApplyTemplate: (t: StarterTemplate) => void; onApplyPlaybook: (p: Playbook) => void; activePlaybook: PlaybookId | null }) {
  return (
    <div className="space-y-5 p-3">
      <div>
        <p className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"><FileStack size={12} /> Full-page templates</p>
        <div className="space-y-1.5">
          {STARTER_TEMPLATES.map((t) => (
            <button key={t.id} type="button" onClick={() => onApplyTemplate(t)} className="w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/50">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{t.label}</span>
                <span className="flex gap-1">
                  {[t.theme?.primary, t.theme?.accent, t.theme?.background].filter(Boolean).map((c) => (
                    <span key={c} className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                  ))}
                </span>
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{t.description}</div>
              <div className="mt-1 text-[10px] font-mono text-muted-foreground">{t.blocks.length} sections</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"><Target size={12} /> Strategy playbooks</p>
        <div className="space-y-1.5">
          {PLAYBOOKS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onApplyPlaybook(p)}
              className={cn('w-full rounded-lg border p-3 text-left transition-colors', activePlaybook === p.id ? 'border-primary/60 bg-primary/5' : 'border-border bg-card hover:border-primary/50')}
            >
              <div className="text-sm font-semibold">{p.label}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{p.focus}</div>
            </button>
          ))}
        </div>
      </div>
      <p className="px-1 text-[11px] text-muted-foreground">Applying a template replaces the page. Press Ctrl/⌘ + Z to undo.</p>
    </div>
  );
}

const SCALES: Array<[number, string]> = [[1.125, 'Major second'], [1.2, 'Minor third'], [1.25, 'Major third'], [1.333, 'Perfect fourth'], [1.414, 'Augmented fourth'], [1.5, 'Perfect fifth']];

function ThemePanel({ theme, onChange, onUsePlaygroundTokens }: { theme: SiteTheme; onChange: (p: Partial<SiteTheme>) => void; onUsePlaygroundTokens: () => void }) {
  const checks = [
    { label: 'Body text', ratio: contrastRatio(theme.foreground, theme.background) },
    { label: 'Button label', ratio: contrastRatio(readableOn(theme.primary), theme.primary) },
    { label: 'Primary on background', ratio: contrastRatio(theme.primary, theme.background) },
  ];
  return (
    <div className="space-y-5 p-3">
      <button type="button" onClick={onUsePlaygroundTokens} className="w-full rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10">
        Use tokens from Design Playground
      </button>
      <div className="space-y-3">
        <ColorField label="Primary" value={theme.primary} onChange={(v) => onChange({ primary: v })} />
        <ColorField label="Accent" value={theme.accent} onChange={(v) => onChange({ accent: v })} />
        <ColorField label="Background" value={theme.background} onChange={(v) => onChange({ background: v })} />
        <ColorField label="Text" value={theme.foreground} onChange={(v) => onChange({ foreground: v })} />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <label htmlFor="mv-radius">Corner radius</label><span className="font-mono">{theme.radius}px</span>
        </div>
        <input id="mv-radius" type="range" min={0} max={32} value={theme.radius} onChange={(e) => onChange({ radius: Number(e.target.value) })} className="w-full accent-primary" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="mv-font" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Font</label>
        <select id="mv-font" value={theme.fontFamily} onChange={(e) => onChange({ fontFamily: e.target.value })} className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm">
          {Object.keys(FONT_STACKS).map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="mv-scale" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Type scale</label>
        <select id="mv-scale" value={theme.headingScale} onChange={(e) => onChange({ headingScale: Number(e.target.value) })} className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm">
          {SCALES.map(([v, name]) => <option key={v} value={v}>{name} ({v})</option>)}
        </select>
      </div>
      <div className="space-y-1.5 rounded-lg border border-border bg-card p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contrast (WCAG 2.2)</p>
        {checks.map((c) => <ContrastRow key={c.label} label={c.label} ratio={c.ratio} />)}
      </div>
    </div>
  );
}

export function ContrastRow({ label, ratio }: { label: string; ratio: number | null }) {
  if (ratio === null) return <div className="flex justify-between text-xs"><span>{label}</span><span className="text-muted-foreground">invalid color</span></div>;
  const rating = wcagRating(ratio);
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-muted-foreground">{ratio.toFixed(2)}:1</span>
        <span className={cn(
          'rounded px-1.5 py-0.5 text-[10px] font-bold',
          rating === 'AAA' || rating === 'AA' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : rating === 'AA Large' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400' : 'bg-red-500/15 text-red-700 dark:text-red-400'
        )}>{rating}</span>
      </span>
    </div>
  );
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const shown = editing ? draft : value;
  const valid = normalizeHex(shown) !== null;
  const id = `color-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} color picker`}
          value={normalizeHex(value) ?? '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
        />
        <input
          id={id}
          value={shown}
          onFocus={() => { setDraft(value); setEditing(true); }}
          onBlur={() => setEditing(false)}
          onChange={(e) => {
            setDraft(e.target.value);
            const hex = normalizeHex(e.target.value);
            if (hex) onChange(hex);
          }}
          aria-invalid={!valid}
          spellCheck={false}
          className={cn('h-9 w-full rounded-md border bg-background px-2 font-mono text-xs outline-none focus:ring-2 focus:ring-primary/40', valid ? 'border-border' : 'border-red-500')}
        />
      </div>
    </div>
  );
}
