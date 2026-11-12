'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Rating = 'good' | 'needs-improvement' | 'poor' | 'n/a';

interface Metric {
  id: string;
  label: string;
  value: number | null;
  format: (v: number) => string;
  thresholds?: [number, number]; // good ≤ a, needs-improvement ≤ b
  description: string;
}

function rate(value: number | null, t?: [number, number]): Rating {
  if (value === null || !t) return 'n/a';
  if (value <= t[0]) return 'good';
  if (value <= t[1]) return 'needs-improvement';
  return 'poor';
}

const ms = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(2)} s` : `${Math.round(v)} ms`);
const kb = (v: number) => (v >= 1024 ? `${(v / 1024).toFixed(2)} MB` : `${Math.round(v)} KB`);

/**
 * Real measurements from the browser's Performance APIs — nothing here is simulated.
 * Navigation metrics describe the initial document load of this browser session.
 */
export function LiveMetrics() {
  const [vitals, setVitals] = useState<{ lcp: number | null; cls: number; fcp: number | null; ttfb: number | null; dcl: number | null }>({ lcp: null, cls: 0, fcp: null, ttfb: null, dcl: null });
  const [resources, setResources] = useState<{ count: number; kb: number; dom: number; heap: number | null }>({ count: 0, kb: 0, dom: 0, heap: null });
  const [fps, setFps] = useState<number[]>([]);
  const [supported, setSupported] = useState(true);
  const frames = useRef(0);

  // Core Web Vitals + navigation timing
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') { requestAnimationFrame(() => setSupported(false)); return; }
    const first = requestAnimationFrame(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      setVitals((v) => ({
        ...v,
        ttfb: nav ? nav.responseStart - nav.startTime : null,
        dcl: nav ? nav.domContentLoadedEventEnd - nav.startTime : null,
        fcp: fcp ? fcp.startTime : null,
      }));
    });
    const observers: PerformanceObserver[] = [];
    const observe = (type: string, cb: (list: PerformanceObserverEntryList) => void) => {
      try {
        const o = new PerformanceObserver(cb);
        o.observe({ type, buffered: true } as PerformanceObserverInit);
        observers.push(o);
      } catch { /* entry type unsupported in this browser */ }
    };
    observe('largest-contentful-paint', (list) => {
      const last = list.getEntries().at(-1);
      if (last) setVitals((v) => ({ ...v, lcp: last.startTime }));
    });
    observe('layout-shift', (list) => {
      let add = 0;
      for (const e of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) if (!e.hadRecentInput) add += e.value;
      if (add) setVitals((v) => ({ ...v, cls: v.cls + add }));
    });
    return () => { cancelAnimationFrame(first); observers.forEach((o) => o.disconnect()); };
  }, []);

  // Resource and memory snapshot
  const snapshot = () => {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const bytes = entries.reduce((sum, e) => sum + (e.transferSize || 0), nav?.transferSize ?? 0);
    const mem = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    setResources({ count: entries.length + 1, kb: bytes / 1024, dom: document.getElementsByTagName('*').length, heap: mem ? mem.usedJSHeapSize / 1048576 : null });
  };
  useEffect(() => {
    const first = requestAnimationFrame(snapshot);
    const t = setInterval(snapshot, 3000);
    return () => { cancelAnimationFrame(first); clearInterval(t); };
  }, []);

  // Frame rate, sampled every second
  useEffect(() => {
    let raf = 0;
    const loop = () => { frames.current++; raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const t = setInterval(() => {
      const value = frames.current;
      frames.current = 0;
      setFps((prev) => [...prev, value].slice(-30));
    }, 1000);
    return () => { cancelAnimationFrame(raf); clearInterval(t); };
  }, []);

  const currentFps = fps.at(-1) ?? null;
  const metrics: Metric[] = [
    { id: 'lcp', label: 'Largest Contentful Paint', value: vitals.lcp, format: ms, thresholds: [2500, 4000], description: 'When the main content finished rendering.' },
    { id: 'fcp', label: 'First Contentful Paint', value: vitals.fcp, format: ms, thresholds: [1800, 3000], description: 'When the first text or image appeared.' },
    { id: 'cls', label: 'Cumulative Layout Shift', value: vitals.cls, format: (v) => v.toFixed(3), thresholds: [0.1, 0.25], description: 'How much the layout moved unexpectedly.' },
    { id: 'ttfb', label: 'Time to First Byte', value: vitals.ttfb, format: ms, thresholds: [800, 1800], description: 'Server and network response time.' },
    { id: 'kb', label: 'Transferred', value: resources.kb, format: kb, description: `${resources.count} requests in this session.` },
    { id: 'dom', label: 'DOM elements', value: resources.dom, format: (v) => v.toLocaleString(), thresholds: [1500, 3000], description: 'Elements on this page right now.' },
  ];

  if (!supported) return <p className="text-sm text-muted-foreground">This browser does not expose the Performance APIs needed for live measurement.</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((m) => {
          const r = rate(m.value, m.thresholds);
          return (
            <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
                {r !== 'n/a' && <RatingBadge rating={r} />}
              </div>
              <p className="mt-3 font-mono text-3xl font-semibold tabular-nums tracking-tight">{m.value === null ? '—' : m.format(m.value)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_260px] gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-sm font-medium text-muted-foreground">Frame rate · last 30 seconds</p>
            <p className="font-mono text-2xl font-semibold tabular-nums">{currentFps ?? '—'} <span className="text-sm text-muted-foreground">fps</span></p>
          </div>
          <div className="flex h-20 items-end gap-1" aria-label={`Frame rate history, current ${currentFps ?? 'unknown'} frames per second`}>
            {Array.from({ length: 30 }).map((_, i) => {
              const v = fps[i - (30 - fps.length)];
              return (
                <div
                  key={i}
                  className={cn('flex-1 rounded-t-sm transition-[height] duration-300', v === undefined ? 'bg-muted' : v >= 55 ? 'bg-primary' : v >= 30 ? 'bg-warning' : 'bg-destructive')}
                  style={{ height: v === undefined ? '6%' : `${Math.max(6, Math.min(100, (v / 120) * 100))}%` }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">JS heap in use</p>
            <p className="mt-3 font-mono text-3xl font-semibold tabular-nums">{resources.heap === null ? 'n/a' : `${resources.heap.toFixed(1)} MB`}</p>
            <p className="mt-1 text-xs text-muted-foreground">{resources.heap === null ? 'Available in Chromium-based browsers.' : 'Sampled every 3 seconds.'}</p>
          </div>
          <button type="button" onClick={snapshot} className="mt-4 inline-flex items-center gap-1.5 self-start rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted">
            <RefreshCw size={12} /> Refresh now
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Thresholds follow Google&apos;s Core Web Vitals guidance. Paint and navigation metrics describe the first page you opened in this session; reload to re-measure.</p>
    </div>
  );
}

function RatingBadge({ rating }: { rating: Exclude<Rating, 'n/a'> }) {
  const map = {
    good: { label: 'Good', cls: 'bg-success text-white' },
    'needs-improvement': { label: 'Needs work', cls: 'bg-warning text-white' },
    poor: { label: 'Poor', cls: 'bg-destructive text-destructive-foreground' },
  } as const;
  return <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', map[rating].cls)}>{map[rating].label}</span>;
}
