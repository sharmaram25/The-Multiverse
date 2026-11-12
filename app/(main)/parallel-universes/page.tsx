'use client';

import React, { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { THEMES, type Theme } from '@/components/theme-provider';
import { UNIVERSES } from '@/lib/universes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type Specimen = 'pricing' | 'signup' | 'dashboard' | 'article';
const SPECIMENS: Array<{ id: Specimen; label: string }> = [
  { id: 'pricing', label: 'Pricing' },
  { id: 'signup', label: 'Sign-up' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'article', label: 'Article' },
];

export default function ParallelUniversesPage() {
  const [specimen, setSpecimen] = useState<Specimen>('pricing');
  const [mode, setMode] = useState<'grid' | 'wipe'>('grid');
  const [a, setA] = useState<Theme>('minimal');
  const [b, setB] = useState<Theme>('brutalist');

  return (
    <div className="mx-auto w-full max-w-[1400px] px-8 py-10">
      <header className="mb-8 flex items-end justify-between gap-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Parallel Universes</p>
          <h1 className="font-display text-5xl font-bold tracking-tight">One section. Every universe.</h1>
          <p className="mt-4 text-lg text-muted-foreground">The same real interface rendered in all four universes at once, or compared two at a time with a wipe. Everything is live and interactive.</p>
        </div>
        <div className="flex shrink-0 gap-1 rounded-lg border border-border p-1" role="radiogroup" aria-label="View">
          {(['grid', 'wipe'] as const).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className={cn('rounded-md px-4 py-1.5 text-sm font-semibold', mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>{m === 'grid' ? 'Four-up' : 'Wipe compare'}</button>
          ))}
        </div>
      </header>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex gap-1 rounded-lg border border-border p-1" role="radiogroup" aria-label="Section">
          {SPECIMENS.map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={specimen === s.id} onClick={() => setSpecimen(s.id)} className={cn('rounded-md px-3 py-1.5 text-sm font-medium', specimen === s.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground')}>{s.label}</button>
          ))}
        </div>
        {mode === 'wipe' && (
          <div className="flex items-center gap-3 text-sm">
            <UniversePicker value={a} onChange={setA} label="Left" />
            <span className="text-muted-foreground">vs</span>
            <UniversePicker value={b} onChange={setB} label="Right" />
          </div>
        )}
      </div>

      {mode === 'grid' ? (
        <div className="grid grid-cols-2 gap-5">
          {THEMES.map((t) => {
            const u = UNIVERSES.find((x) => x.id === t)!;
            return (
              <figure key={t}>
                <figcaption className="mb-2 flex items-baseline justify-between text-sm">
                  <span className="font-semibold">{u.name}</span>
                  <span className="text-muted-foreground">{u.tagline}</span>
                </figcaption>
                <div className={cn('universe-scope h-[440px] overflow-hidden rounded-2xl border border-border', t)}>
                  <SpecimenView kind={specimen} />
                </div>
              </figure>
            );
          })}
        </div>
      ) : (
        <Wipe a={a} b={b} specimen={specimen} />
      )}
    </div>
  );
}

function UniversePicker({ value, onChange, label }: { value: Theme; onChange: (t: Theme) => void; label: string }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as Theme)} className="h-9 rounded-md border border-border bg-background px-2 text-sm">
        {THEMES.map((t) => <option key={t} value={t}>{UNIVERSES.find((u) => u.id === t)!.name}</option>)}
      </select>
    </label>
  );
}

function Wipe({ a, b, specimen }: { a: Theme; b: Theme; specimen: Specimen }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div ref={box} className="relative h-[600px] select-none overflow-hidden rounded-2xl border border-border" onPointerMove={(e) => { if (e.buttons === 1) drag(e.clientX); }}>
      <div className={cn('universe-scope absolute inset-0', b)}><SpecimenView kind={specimen} /></div>
      <div className={cn('universe-scope absolute inset-0', a)} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><SpecimenView kind={specimen} /></div>
      <div className="absolute inset-y-0 w-0.5 bg-white mix-blend-difference" style={{ left: `${pos}%` }} aria-hidden="true" />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparison position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); drag(e.clientX); }}
        onPointerMove={(e) => { if (e.buttons === 1) drag(e.clientX); }}
        onKeyDown={(e) => { if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 2)); if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 2)); }}
        className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-black/20 bg-white text-xs font-bold text-black shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-black/30"
        style={{ left: `${pos}%` }}
      >
        ⟷
      </div>
      <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">{UNIVERSES.find((u) => u.id === a)!.name}</span>
      <span className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">{UNIVERSES.find((u) => u.id === b)!.name}</span>
    </div>
  );
}

/* Specimens use only shared tokens and components, so each universe renders them authentically. */
function SpecimenView({ kind }: { kind: Specimen }) {
  if (kind === 'pricing') return <PricingSpecimen />;
  if (kind === 'signup') return <SignupSpecimen />;
  if (kind === 'dashboard') return <DashboardSpecimen />;
  return <ArticleSpecimen />;
}

function PricingSpecimen() {
  const [yearly, setYearly] = useState(true);
  const plans = [
    { name: 'Starter', price: 0, features: ['1 project', 'Community support'] },
    { name: 'Pro', price: 29, features: ['Unlimited projects', 'Priority support', 'Custom domain'], featured: true },
  ];
  return (
    <div className="flex h-full flex-col p-7">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-3xl font-bold tracking-tight">Simple pricing</h2>
        <button type="button" role="switch" aria-checked={yearly} onClick={() => setYearly((v) => !v)} className="flex items-center gap-2 rounded-full border border-border px-1 py-1 text-xs font-semibold">
          <span className={cn('rounded-full px-2.5 py-1', !yearly && 'bg-primary text-primary-foreground')}>Monthly</span>
          <span className={cn('rounded-full px-2.5 py-1', yearly && 'bg-primary text-primary-foreground')}>Yearly −20%</span>
        </button>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-4">
        {plans.map((p) => (
          <div key={p.name} className={cn('flex flex-col rounded-xl border bg-card p-5', p.featured ? 'border-primary' : 'border-border')}>
            <div className="flex items-center justify-between"><p className="font-semibold">{p.name}</p>{p.featured && <Badge>Popular</Badge>}</div>
            <p className="mt-3 font-display text-4xl font-bold">${yearly ? Math.round(p.price * 0.8) : p.price}<span className="text-sm font-normal text-muted-foreground"> /mo</span></p>
            <ul className="mt-4 flex-1 space-y-2 text-sm">{p.features.map((f) => <li key={f} className="flex items-center gap-2"><Check size={14} className="text-primary" />{f}</li>)}</ul>
            <Button variant={p.featured ? 'default' : 'outline'} className="mt-4 w-full">Choose {p.name}</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignupSpecimen() {
  return (
    <div className="flex h-full items-center justify-center p-7">
      <form className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Create your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Free for 14 days. No card required.</p>
        </div>
        <label className="block space-y-1.5 text-sm font-medium"><span>Work email</span><Input type="email" placeholder="you@company.com" /></label>
        <label className="block space-y-1.5 text-sm font-medium"><span>Password</span><Input type="password" placeholder="At least 8 characters" /></label>
        <Button type="submit" className="w-full">Start free trial</Button>
        <p className="text-center text-xs text-muted-foreground">By continuing you agree to the terms.</p>
      </form>
    </div>
  );
}

function DashboardSpecimen() {
  const bars = [42, 58, 51, 74, 66, 88, 79];
  return (
    <div className="flex h-full flex-col gap-4 p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold tracking-tight">Overview</h2>
        <Badge variant="secondary">Last 7 days</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[['Visitors', '12,480', '+8.2%'], ['Conversion', '3.4%', '+0.6%'], ['Revenue', '$9,210', '+12%']].map(([k, v, d]) => (
          <div key={k} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{k}</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">{v}</p>
            <p className="text-xs font-semibold text-primary">{d}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-2 rounded-xl border border-border bg-card p-4">
        {bars.map((h, i) => <div key={i} className="flex-1 rounded-t-md bg-primary" style={{ height: `${h}%`, opacity: 0.45 + (i / bars.length) * 0.55 }} />)}
      </div>
    </div>
  );
}

function ArticleSpecimen() {
  return (
    <article className="h-full overflow-hidden p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Insights · 6 min read</p>
      <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight">Why the best websites are planned in a week</h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">Most redesigns stall in the gap between strategy and code. Teams that agree on structure, tone and tokens first move faster and argue less.</p>
      <blockquote className="mt-5 border-l-2 border-primary pl-4 text-lg font-medium">“We cut our launch timeline in half.”</blockquote>
      <div className="mt-5 flex gap-2"><Button size="sm">Read the article</Button><Button size="sm" variant="ghost">Save for later</Button></div>
    </article>
  );
}
