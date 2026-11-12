'use client';


import { useSafeReducedMotion } from '@/lib/hooks/use-safe-reduced-motion';import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion} from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/docs/doc-blocks';

type Curve = [number, number, number, number];

const PRESETS: Array<{ name: string; curve: Curve; use: string }> = [
  { name: 'Standard', curve: [0.2, 0, 0, 1], use: 'Most UI state changes' },
  { name: 'Decelerate', curve: [0, 0, 0, 1], use: 'Elements entering the screen' },
  { name: 'Accelerate', curve: [0.3, 0, 1, 1], use: 'Elements leaving the screen' },
  { name: 'Expressive', curve: [0.16, 1, 0.3, 1], use: 'Hero reveals, large moves' },
  { name: 'Overshoot', curve: [0.34, 1.56, 0.64, 1], use: 'Playful confirmations' },
  { name: 'Linear', curve: [0, 0, 1, 1], use: 'Progress and looping motion' },
];

const fmt = (c: Curve) => c.map((v) => Number(v.toFixed(2))).join(', ');

export function EasingWorkbench() {
  const reduce = useSafeReducedMotion();
  const [curve, setCurve] = useState<Curve>(PRESETS[0].curve);
  const [duration, setDuration] = useState(400);
  const [run, setRun] = useState(0);
  const [at, setAt] = useState<'start' | 'end'>('start');
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(400);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.clientWidth - 48 - 56));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const path = useMemo(() => {
    const [x1, y1, x2, y2] = curve;
    // Map 0..1 to a 200x200 box with padding; y is inverted for SVG.
    const P = (x: number, y: number) => `${20 + x * 160},${180 - y * 160}`;
    return { d: `M ${P(0, 0)} C ${P(x1, y1)} ${P(x2, y2)} ${P(1, 1)}`, h1: [P(0, 0), P(x1, y1)], h2: [P(1, 1), P(x2, y2)] };
  }, [curve]);

  const css = `transition: transform ${duration}ms cubic-bezier(${fmt(curve)});`;
  const motionCode = `transition={{ duration: ${(duration / 1000).toFixed(2)}, ease: [${fmt(curve)}] }}`;

  const play = () => { setAt((a) => (a === 'start' ? 'end' : 'start')); setRun((r) => r + 1); };

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6 rounded-2xl border border-border bg-card p-6">
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Presets</p>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.map((p) => {
              const active = fmt(p.curve) === fmt(curve);
              return (
                <button key={p.name} type="button" onClick={() => setCurve(p.curve)} title={p.use} className={cn('rounded-md border px-2.5 py-1.5 text-left text-xs font-semibold transition-colors', active ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted')}>
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Control points</p>
          <div className="grid grid-cols-4 gap-1.5">
            {(['x1', 'y1', 'x2', 'y2'] as const).map((label, i) => (
              <label key={label} className="text-[11px] font-medium text-muted-foreground">
                {label}
                <input
                  type="number"
                  step={0.05}
                  min={i % 2 === 0 ? 0 : -1}
                  max={i % 2 === 0 ? 1 : 2}
                  value={curve[i]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!Number.isFinite(v)) return;
                    const clamped = i % 2 === 0 ? Math.min(1, Math.max(0, v)) : Math.min(2, Math.max(-1, v));
                    setCurve((c) => c.map((x, j) => (j === i ? clamped : x)) as Curve);
                  }}
                  className="mt-1 h-8 w-full rounded-md border border-border bg-background px-1.5 font-mono text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <label htmlFor="ew-duration">Duration</label><span className="font-mono normal-case tracking-normal">{duration}ms</span>
          </div>
          <input id="ew-duration" type="range" min={100} max={1500} step={50} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <svg viewBox="0 0 200 200" className="w-full rounded-lg border border-border bg-background" aria-label={`Easing curve cubic-bezier(${fmt(curve)})`} role="img">
          <rect x="20" y="20" width="160" height="160" fill="none" stroke="currentColor" strokeOpacity="0.12" />
          <line x1={path.h1[0].split(',')[0]} y1={path.h1[0].split(',')[1]} x2={path.h1[1].split(',')[0]} y2={path.h1[1].split(',')[1]} stroke="currentColor" strokeOpacity="0.35" strokeDasharray="3 3" />
          <line x1={path.h2[0].split(',')[0]} y1={path.h2[0].split(',')[1]} x2={path.h2[1].split(',')[0]} y2={path.h2[1].split(',')[1]} stroke="currentColor" strokeOpacity="0.35" strokeDasharray="3 3" />
          <path d={path.d} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
          <circle cx={path.h1[1].split(',')[0]} cy={path.h1[1].split(',')[1]} r="4" fill="var(--primary)" />
          <circle cx={path.h2[1].split(',')[0]} cy={path.h2[1].split(',')[1]} r="4" fill="var(--primary)" />
        </svg>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div ref={trackRef} className="relative flex h-40 items-center rounded-xl border border-border bg-background px-6">
          <motion.div
            initial={false}
            animate={{ x: at === 'end' ? distance : 0 }}
            transition={reduce ? { duration: 0 } : { duration: duration / 1000, ease: curve }}
            className="h-14 w-14 rounded-xl bg-primary shadow-lg"
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={play} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"><Play size={15} /> Play</button>
          <button type="button" onClick={() => { setAt('start'); setRun((r) => r + 1); }} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted"><RotateCcw size={15} /> Reset</button>
          {reduce && <p className="self-center text-xs text-muted-foreground">Reduced motion is on — the preview jumps instead of animating.</p>}
        </div>
        <div className="space-y-2">
          {[{ label: 'CSS', code: css }, { label: 'Motion (React)', code: motionCode }].map((c) => (
            <div key={c.label} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-3 py-2">
              <span className="w-28 shrink-0 text-xs font-semibold text-muted-foreground">{c.label}</span>
              <code className="min-w-0 flex-1 truncate font-mono text-xs">{c.code}</code>
              <CopyButton value={c.code} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
