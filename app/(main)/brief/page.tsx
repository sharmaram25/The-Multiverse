'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, ClipboardCopy, Download, FileText, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersistentState } from '@/lib/hooks/use-persistent-state';
import { copyText, downloadFile, slugify } from '@/lib/browser';
import { PLAYBOOKS, STARTER_TEMPLATES } from '@/lib/builder/templates';
import { UNIVERSES } from '@/lib/universes';
import { THEMES } from '@/components/theme-provider';
import {
  BUDGETS, DEFAULT_BRIEF, FEATURES, GOALS, PAGES, briefMarkdown, completeness, estimate, isBrief, routesFor, type Brief,
} from '@/lib/brief';

const input = 'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30';

export default function BriefPage() {
  const router = useRouter();
  const [brief, setBrief] = usePersistentState<Brief>('multiverse-brief', DEFAULT_BRIEF, isBrief);
  const [flash, setFlash] = useState<string | null>(null);
  const set = <K extends keyof Brief>(key: K, value: Brief[K]) => setBrief((b) => ({ ...b, [key]: value }));
  const toggle = (key: 'pages' | 'features', id: string) => setBrief((b) => ({ ...b, [key]: b[key].includes(id) ? b[key].filter((x) => x !== id) : [...b[key], id] }));
  const signal = (k: string) => { setFlash(k); setTimeout(() => setFlash((c) => (c === k ? null : c)), 1600); };

  const est = useMemo(() => estimate(brief), [brief]);
  const done = completeness(brief);
  const md = useMemo(() => briefMarkdown(brief), [brief]);
  const playbook = PLAYBOOKS.find((p) => p.id === brief.type) ?? PLAYBOOKS[0];
  const template = STARTER_TEMPLATES.find((t) => t.id === brief.type);
  const goal = GOALS.find((g) => g.id === brief.primaryGoal) ?? GOALS[0];

  const sendToLaunchStudio = () => {
    const plan = {
      goal: brief.type,
      projectName: brief.name || 'New website',
      routes: routesFor(brief).map((r, i) => ({ id: `b${i}${Date.now().toString(36)}`, ...r })),
      kpis: goal.kpis,
      checked: [] as string[],
    };
    try {
      const existing = JSON.parse(localStorage.getItem('multiverse-launch-plan') || 'null');
      if (existing?.checked) plan.checked = existing.checked;
      localStorage.setItem('multiverse-launch-plan', JSON.stringify(plan));
    } catch { /* storage unavailable */ }
    router.push('/launch-studio');
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_360px] gap-8 px-8 py-10">
      <div className="min-w-0">
        <header className="mb-10">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"><FileText size={14} /> Project Brief</p>
          <h1 className="font-display text-5xl font-bold tracking-tight">Define the project before you design it.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Answer what you know. The brief, scope estimate and recommended stack update as you type, and everything is saved in this browser.</p>
        </header>

        <Section n="01" title="Basics">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Project name"><input className={input} value={brief.name} onChange={(e) => set('name', e.target.value)} placeholder="Northwind website relaunch" /></Field>
            <Field label="Organization"><input className={input} value={brief.organization} onChange={(e) => set('organization', e.target.value)} placeholder="Northwind Ltd." /></Field>
          </div>
          <Field label="One-sentence summary"><input className={input} value={brief.summary} onChange={(e) => set('summary', e.target.value)} placeholder="A conversion-focused site that explains our product and drives trials." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Project type">
              <select className={input} value={brief.type} onChange={(e) => set('type', e.target.value as Brief['type'])}>
                {PLAYBOOKS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Target launch date"><input type="date" className={input} value={brief.launchDate} onChange={(e) => set('launchDate', e.target.value)} /></Field>
          </div>
        </Section>

        <Section n="02" title="Goals and audience">
          <Field label="Primary goal">
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Primary goal">
              {GOALS.map((g) => (
                <button key={g.id} type="button" role="radio" aria-checked={brief.primaryGoal === g.id} onClick={() => set('primaryGoal', g.id)} className={cn('rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors', brief.primaryGoal === g.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted')}>
                  {g.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Who is the site for?"><textarea className={cn(input, 'h-20 py-2')} value={brief.audience} onChange={(e) => set('audience', e.target.value)} placeholder="Operations leaders at mid-size logistics companies evaluating tools for the first time." /></Field>
          <Field label="Top three tasks visitors come to do">
            <div className="space-y-2">
              {brief.tasks.map((t, i) => (
                <input key={i} className={input} value={t} aria-label={`Visitor task ${i + 1}`} onChange={(e) => set('tasks', brief.tasks.map((x, j) => (j === i ? e.target.value : x)) as Brief['tasks'])} placeholder={['Understand what the product does', 'Compare pricing plans', 'Book a demo'][i]} />
              ))}
            </div>
          </Field>
        </Section>

        <Section n="03" title="Scope">
          <Field label="Pages">
            <div className="grid grid-cols-3 gap-2">
              {PAGES.map((p) => (
                <Check2 key={p.id} label={p.label} hint={`${p.hours}h`} checked={brief.pages.includes(p.id)} onChange={() => toggle('pages', p.id)} />
              ))}
            </div>
          </Field>
          <Field label="Other pages (comma separated)"><input className={input} value={brief.customPages} onChange={(e) => set('customPages', e.target.value)} placeholder="Partners, Events, Press" /></Field>
          <Field label="Features">
            <div className="grid grid-cols-2 gap-2">
              {FEATURES.map((f) => (
                <Check2 key={f.id} label={f.label} hint={`${f.hours}h`} checked={brief.features.includes(f.id)} onChange={() => toggle('features', f.id)} />
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Segmented label="Copy ready?" value={brief.copyReady} onChange={(v) => set('copyReady', v)} />
            <Segmented label="Imagery ready?" value={brief.imageryReady} onChange={(v) => set('imageryReady', v)} />
          </div>
        </Section>

        <Section n="04" title="Brand and constraints">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Brand guidelines">
              <div className="flex gap-1 rounded-lg border border-border p-1">
                {[true, false].map((v) => (
                  <button key={String(v)} type="button" aria-pressed={brief.hasBrand === v} onClick={() => set('hasBrand', v)} className={cn('flex-1 rounded-md py-1.5 text-sm font-medium', brief.hasBrand === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>{v ? 'Available' : 'None yet'}</button>
                ))}
              </div>
            </Field>
            <Field label="Accessibility target">
              <div className="flex gap-1 rounded-lg border border-border p-1">
                {(['AA', 'AAA'] as const).map((v) => (
                  <button key={v} type="button" aria-pressed={brief.a11y === v} onClick={() => set('a11y', v)} className={cn('flex-1 rounded-md py-1.5 text-sm font-medium', brief.a11y === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>WCAG {v}</button>
                ))}
              </div>
            </Field>
            <Field label="Budget">
              <select className={input} value={brief.budget} onChange={(e) => set('budget', e.target.value)}>
                {BUDGETS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Visual direction">
            <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Visual direction">
              {THEMES.map((t) => {
                const u = UNIVERSES.find((x) => x.id === t)!;
                return (
                  <button key={t} type="button" role="radio" aria-checked={brief.universe === t} onClick={() => set('universe', t)} className={cn('flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors', brief.universe === t ? 'border-primary ring-1 ring-primary' : 'border-border hover:bg-muted')}>
                    <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: `linear-gradient(135deg, ${u.palette.bg} 0 50%, ${u.palette.primary} 50%)`, boxShadow: `0 0 0 1px ${u.palette.border}` }} />
                    {u.name}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Notes"><textarea className={cn(input, 'h-24 py-2')} value={brief.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Stakeholders, competitors to review, integrations, deadlines…" /></Field>
        </Section>
      </div>

      {/* Live summary */}
      <aside className="sticky top-28 h-fit space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold">Brief completeness</p>
            <p className="font-mono text-sm tabular-nums">{done}%</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${done}%` }} /></div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Indicative effort</p>
          <p className="mt-2 font-display text-4xl font-bold tabular-nums tracking-tight">{est.low}–{est.high}<span className="text-lg font-semibold text-muted-foreground"> h</span></p>
          <p className="text-sm text-muted-foreground">≈ {est.weeksLow === est.weeksHigh ? est.weeksLow : `${est.weeksLow}–${est.weeksHigh}`} weeks for one full-time developer</p>
          <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
            <Row k={`Pages (${brief.pages.length + est.customCount})`} v={`${est.pageHours}h`} />
            <Row k={`Features (${brief.features.length})`} v={`${est.featureHours}h`} />
            <Row k="Setup and launch" v="12h" />
            {est.factors.map((f) => <Row key={f} k={f} v="" muted />)}
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Recommended stack</p>
          <dl className="mt-3 space-y-1.5 text-sm">
            <Row k="Template" v={template?.label ?? playbook.label} />
            <Row k="Universe" v={UNIVERSES.find((u) => u.id === brief.universe)?.name ?? ''} />
            <Row k="Routes" v={String(routesFor(brief).length)} />
            <Row k="Primary KPI" v={goal.kpis[0]} />
          </dl>
        </div>

        <div className="grid gap-2">
          <button type="button" onClick={sendToLaunchStudio} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
            Send to Launch Studio <ArrowRight size={15} />
          </button>
          <button type="button" onClick={() => router.push(`/builder?${template ? `template=${template.id}` : `playbook=${playbook.id}`}`)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted">
            Start in Builder
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={async () => { if (await copyText(md)) signal('copy'); }} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted">
              {flash === 'copy' ? <Check size={14} /> : <ClipboardCopy size={14} />} {flash === 'copy' ? 'Copied' : 'Copy'}
            </button>
            <button type="button" onClick={() => downloadFile(`${slugify(brief.name, 'website')}-brief.md`, md, 'text/markdown')} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted">
              <Download size={14} /> .md
            </button>
          </div>
          <button type="button" onClick={() => { if (window.confirm('Clear the brief and start again?')) setBrief(DEFAULT_BRIEF); }} className="inline-flex items-center justify-center gap-1.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
            <RotateCcw size={12} /> Start over
          </button>
        </div>
      </aside>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-5 flex items-baseline gap-3 text-lg font-semibold"><span className="font-mono text-xs text-muted-foreground">{n}</span>{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}

function Check2({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} onClick={onChange} className={cn('flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors', checked ? 'border-primary bg-muted' : 'border-border hover:bg-muted/60')}>
      <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded border', checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background')}>
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
      <span className="flex-1">{label}</span>
      {hint && <span className="font-mono text-[11px] text-muted-foreground">{hint}</span>}
    </button>
  );
}

function Segmented({ label, value, onChange }: { label: string; value: 'yes' | 'partial' | 'no'; onChange: (v: 'yes' | 'partial' | 'no') => void }) {
  return (
    <Field label={label}>
      <div className="flex gap-1 rounded-lg border border-border p-1">
        {(['yes', 'partial', 'no'] as const).map((v) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)} className={cn('flex-1 rounded-md py-1.5 text-sm font-medium capitalize', value === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>{v}</button>
        ))}
      </div>
    </Field>
  );
}

function Row({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-3', muted && 'text-xs text-muted-foreground')}>
      <dt className={muted ? '' : 'text-muted-foreground'}>{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
