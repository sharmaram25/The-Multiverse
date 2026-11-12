'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useTransition } from '@/components/transitions/transition-context';
import { UNIVERSES, type UniverseSpec } from '@/lib/universes';

export default function UniversesPage() {
  const { theme, setTheme } = useTheme();
  const { setTransitionType } = useTransition();

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-12">
      <header className="mb-14 max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Universes</p>
        <h1 className="font-display text-6xl font-bold tracking-tight">Four complete visual systems.</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Each universe defines its own typography, surfaces, depth, background and interaction — not just colors. Apply one to the whole workspace, or open its showcase to see it in context.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {UNIVERSES.map((u, i) => (
          <motion.article
            key={u.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
          >
            <UniversePreview u={u} />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight">{u.name}</h2>
                <span className="text-sm text-muted-foreground">{u.tagline}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.summary}</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-5">
                {u.traits.map((t) => (
                  <div key={t.label}>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t.label}</dt>
                    <dd className="mt-0.5 text-sm">{t.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTheme(u.id)}
                  aria-pressed={theme === u.id}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {theme === u.id ? <><Check size={15} /> Active</> : `Apply ${u.name}`}
                </button>
                <Link
                  href={`/universes/${u.id}`}
                  onClick={() => { setTransitionType('portal'); setTheme(u.id); }}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Open showcase <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

/** A miniature page rendered with the universe's own palette and type — independent of the active universe. */
function UniversePreview({ u }: { u: UniverseSpec }) {
  const p = u.palette;
  const r = u.radius;
  return (
    <div className="relative h-56 overflow-hidden border-b border-border" style={{ background: p.bg, color: p.fg }} aria-hidden="true">
      {u.id === 'neon' && (
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,229,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      )}
      {u.id === 'glass' && (
        <div className="absolute inset-0" style={{ background: 'radial-gradient(at 15% 10%, rgba(59,130,246,0.35), transparent 50%), radial-gradient(at 90% 20%, rgba(139,92,246,0.35), transparent 50%)' }} />
      )}
      <div className="relative flex h-full flex-col justify-between p-7">
        <div className="flex items-center justify-between text-[11px]" style={{ color: p.mutedFg, fontFamily: u.id === 'neon' ? 'var(--font-jetbrains), monospace' : u.fontBody }}>
          <span style={{ color: p.fg, fontWeight: 600 }}>Acme</span>
          <span className="flex gap-4"><span>Product</span><span>Pricing</span><span>Docs</span></span>
        </div>
        <div>
          <p
            className="leading-[0.95]"
            style={{
              fontFamily: u.fontDisplay,
              fontWeight: u.displayWeight,
              fontSize: 38,
              letterSpacing: u.id === 'minimal' ? '-0.045em' : '-0.03em',
              textTransform: u.uppercaseDisplay ? 'uppercase' : undefined,
              textShadow: u.id === 'neon' ? '0 0 24px rgba(0,229,255,0.35)' : undefined,
              ...(u.id === 'glass' ? { backgroundImage: 'linear-gradient(180deg,#fff 20%,#c7d2fe)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : {}),
            }}
          >
            Ship with certainty.
          </p>
          <div className="mt-4 flex items-center gap-2" style={{ fontFamily: u.fontBody }}>
            <span
              className="inline-flex h-8 items-center px-3.5 text-xs font-semibold"
              style={{
                background: p.primary,
                color: p.primaryFg,
                borderRadius: r,
                border: u.id === 'brutalist' ? `2px solid ${p.border}` : undefined,
                boxShadow: u.id === 'brutalist' ? `3px 3px 0 ${p.border}` : u.id === 'neon' ? '0 0 16px rgba(0,229,255,0.5)' : undefined,
              }}
            >
              Get started
            </span>
            <span className="inline-flex h-8 items-center px-3.5 text-xs font-semibold" style={{ border: `${u.id === 'brutalist' ? 2 : 1}px solid ${p.border}`, borderRadius: r, color: p.fg, background: u.id === 'glass' ? 'rgba(255,255,255,0.06)' : 'transparent' }}>
              Learn more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
