'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { useTheme, type Theme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/docs/doc-blocks';
import { UNIVERSES, getUniverse } from '@/lib/universes';
import { cn } from '@/lib/utils';

export function UniverseContent({ id }: { id: Theme }) {
  const { theme, setTheme } = useTheme();
  const u = getUniverse(id);

  // Visiting a showcase applies its universe.
  useEffect(() => {
    if (u && theme !== id) setTheme(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!u) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Universe not found</h1>
        <Link href="/universes" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">All universes</Link>
      </div>
    );
  }

  const index = UNIVERSES.findIndex((x) => x.id === id);
  const prev = UNIVERSES[(index + UNIVERSES.length - 1) % UNIVERSES.length];
  const next = UNIVERSES[(index + 1) % UNIVERSES.length];
  const paletteRows = [
    ['Background', '--bg', u.palette.bg], ['Foreground', '--fg', u.palette.fg], ['Primary', '--primary', u.palette.primary],
    ['On primary', '--primary-fg', u.palette.primaryFg], ['Muted', '--muted', u.palette.muted], ['Muted text', '--muted-fg', u.palette.mutedFg],
    ['Card', '--card', u.palette.card], ['Border', '--border', u.palette.border],
  ] as const;
  const css = `/* ${u.name} universe */\n:root {\n${paletteRows.map(([, v, hex]) => `  ${v}: ${hex};`).join('\n')}\n  --radius-md: ${u.radius}px;\n}\n`;

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10">
      <nav className="mb-12 flex items-center justify-between text-sm" aria-label="Universe navigation">
        <Link href="/universes" className="inline-flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground"><ArrowLeft size={15} /> All universes</Link>
        <div className="flex items-center gap-2">
          <Link href={`/universes/${prev.id}`} className="rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-muted">← {prev.name}</Link>
          <Link href={`/universes/${next.id}`} className="rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-muted">{next.name} →</Link>
        </div>
      </nav>

      <header className="mb-20 max-w-4xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{u.tagline}</p>
        <h1 className="font-display text-8xl font-bold leading-[0.92] tracking-tight">{u.name}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">{u.summary}</p>
        <dl className="mt-10 grid grid-cols-4 gap-6 border-t border-border pt-6">
          {u.traits.map((t) => (
            <div key={t.label}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t.label}</dt>
              <dd className="mt-1 text-sm font-medium">{t.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="mb-20">
        <div className="mb-6 flex items-end justify-between border-b border-border pb-3">
          <h2 className="text-2xl font-semibold tracking-tight">Palette</h2>
          <CopyButton value={css} label="Copy as CSS" />
        </div>
        <div className="grid grid-cols-8 overflow-hidden rounded-xl border border-border">
          {paletteRows.map(([name, variable, hex]) => (
            <div key={variable} className="border-r border-border last:border-r-0">
              <div className="h-24" style={{ background: hex }} />
              <div className="p-3">
                <p className="text-xs font-semibold">{name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="mb-6 border-b border-border pb-3 text-2xl font-semibold tracking-tight">Typography</h2>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {[
            { label: 'Display', el: <p className="font-display text-6xl font-bold tracking-tight">Plan with certainty</p> },
            { label: 'Heading', el: <p className="font-display text-3xl font-semibold tracking-tight">Decide early, build once</p> },
            { label: 'Body', el: <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">Every decision you make here exports to a format your engineers already use, so nothing is lost in handoff.</p> },
            { label: 'Label', el: <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">System status · operational</p> },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-[140px_1fr] items-baseline gap-6 px-6 py-6">
              <span className="text-sm font-medium text-muted-foreground">{row.label}</span>
              {row.el}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 border-b border-border pb-3 text-2xl font-semibold tracking-tight">In use</h2>
        <div className="grid grid-cols-2 gap-6">
          <SignInExample />
          <MetricsExample />
        </div>
      </section>
    </div>
  );
}

function SignInExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (password.length < 8) next.password = 'Use at least 8 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus('loading');
    setTimeout(() => setStatus('done'), 900);
  };

  return (
    <Card hoverEffect>
      <form onSubmit={submit} noValidate>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Form validation and states in this universe. Nothing is sent anywhere.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'done' ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted p-4 text-sm" role="status">
              <Check size={18} className="text-success" /> Signed in as <strong>{email}</strong>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label htmlFor="u-email" className="text-sm font-medium">Email</label>
                <Input id="u-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'u-email-err' : undefined} />
                {errors.email && <p id="u-email-err" className="text-xs font-medium text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="u-pass" className="text-sm font-medium">Password</label>
                <Input id="u-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'u-pass-err' : undefined} />
                {errors.password && <p id="u-pass-err" className="text-xs font-medium text-destructive">{errors.password}</p>}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          {status === 'done' ? (
            <Button type="button" variant="outline" className="w-full" onClick={() => { setStatus('idle'); setPassword(''); }}>Sign out</Button>
          ) : (
            <Button type="submit" className="w-full" isLoading={status === 'loading'}>Continue</Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

function MetricsExample() {
  const make = () => ({ conversion: 2 + Math.random() * 3, visitors: Math.round(8000 + Math.random() * 6000), at: new Date() });
  const [data, setData] = useState<ReturnType<typeof make> | null>(null);
  const [loading, setLoading] = useState(false);
  // Generate on the client only to avoid hydration mismatches.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setData(make()), []);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => { setData(make()); setLoading(false); }, 600);
  };

  return (
    <Card hoverEffect>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Weekly overview</CardTitle>
            <CardDescription>Sample data — refresh to regenerate.</CardDescription>
          </div>
          <Badge variant="secondary">Demo</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {[
          { label: 'Conversion rate', value: data ? `${data.conversion.toFixed(1)}%` : '—', pct: data ? (data.conversion / 5) * 100 : 0 },
          { label: 'Visitors', value: data ? data.visitors.toLocaleString() : '—', pct: data ? (data.visitors / 14000) * 100 : 0 },
        ].map((m) => (
          <div key={m.label}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">{m.label}</span>
              <span className="font-mono font-semibold tabular-nums">{m.value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className={cn('h-full rounded-full bg-primary transition-[width] duration-500')} style={{ width: `${m.pct}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between border-t border-border pt-5">
        <span className="text-xs text-muted-foreground">{data ? `Updated ${data.at.toLocaleTimeString()}` : 'Loading…'}</span>
        <Button variant="outline" size="sm" onClick={refresh} isLoading={loading}>
          {!loading && <RefreshCw size={13} className="mr-1.5" />} Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
