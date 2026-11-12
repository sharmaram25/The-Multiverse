'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { THEMES, type Theme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UNIVERSES, getUniverse } from '@/lib/universes';

export default function ThemeLabPage() {
  const [left, setLeft] = useState<Theme>('minimal');
  const [right, setRight] = useState<Theme>('neon');

  return (
    <div className="mx-auto w-full max-w-[1400px] px-8 py-10">
      <header className="mb-10 flex items-end justify-between gap-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Theme Lab</p>
          <h1 className="font-display text-5xl font-bold tracking-tight">Compare universes side by side.</h1>
          <p className="mt-4 text-lg text-muted-foreground">The same working interface rendered in two universes at once. Every control is live, so you can judge identity, hierarchy and legibility in context.</p>
        </div>
        <button type="button" onClick={() => { setLeft(right); setRight(left); }} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted">
          <ArrowLeftRight size={15} /> Swap sides
        </button>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <Pane value={left} onChange={setLeft} />
        <Pane value={right} onChange={setRight} />
      </div>
    </div>
  );
}

function Pane({ value, onChange }: { value: Theme; onChange: (t: Theme) => void }) {
  const spec = getUniverse(value)!;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div role="radiogroup" aria-label="Universe for this pane" className="flex gap-1 rounded-lg border border-border p-1">
          {THEMES.map((t) => (
            <button key={t} type="button" role="radio" aria-checked={value === t} onClick={() => onChange(t)} className={cn('rounded-md px-3 py-1 text-sm font-medium transition-colors', value === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
              {UNIVERSES.find((u) => u.id === t)!.name}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{spec.tagline}</span>
      </div>
      <div className={cn('universe-scope overflow-hidden rounded-2xl border border-border', value)}>
        <SampleDashboard />
      </div>
    </div>
  );
}

function SampleDashboard() {
  const [name, setName] = useState('Jordan Lee');
  const [email, setEmail] = useState('jordan@northwind.example');
  const [notify, setNotify] = useState(true);
  const [saved, setSaved] = useState(false);
  const [plan, setPlan] = useState<'starter' | 'pro'>('pro');

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Workspace settings</h2>
          <p className="text-sm text-muted-foreground">Northwind · 12 members</p>
        </div>
        <Badge variant={plan === 'pro' ? 'default' : 'secondary'}>{plan === 'pro' ? 'Pro' : 'Starter'}</Badge>
      </div>

      <form
        className="space-y-4 rounded-xl border border-border bg-card p-5"
        onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 1600); }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Profile</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1.5 text-sm font-medium">
            <span>Full name</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            <span>Email</span>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Email notifications</p>
            <p className="text-xs text-muted-foreground">Weekly summary and security alerts</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notify}
            aria-label="Email notifications"
            onClick={() => setNotify((v) => !v)}
            className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', notify ? 'bg-primary' : 'bg-muted ring-1 ring-inset ring-border')}
          >
            <span className={cn('absolute left-0 top-1 h-4 w-4 rounded-full shadow transition-transform', notify ? 'translate-x-6 bg-primary-foreground' : 'translate-x-1 bg-foreground/70')} />
          </button>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => { setName('Jordan Lee'); setEmail('jordan@northwind.example'); setNotify(true); }}>Reset</Button>
          <Button type="submit">{saved ? <><Check size={15} className="mr-1.5" /> Saved</> : 'Save changes'}</Button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Plan">
        {(['starter', 'pro'] as const).map((p) => (
          <button
            key={p}
            type="button"
            role="radio"
            aria-checked={plan === p}
            onClick={() => setPlan(p)}
            className={cn('rounded-xl border bg-card p-4 text-left transition-colors', plan === p ? 'border-primary ring-1 ring-primary' : 'border-border hover:bg-muted')}
          >
            <p className="text-sm font-semibold capitalize">{p}</p>
            <p className="mt-1 font-display text-2xl font-bold">{p === 'pro' ? '$29' : '$0'}<span className="text-sm font-normal text-muted-foreground"> /month</span></p>
            <p className="mt-1 text-xs text-muted-foreground">{p === 'pro' ? 'Unlimited projects, priority support' : 'One project, community support'}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
