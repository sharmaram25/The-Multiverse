'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence, LayoutGroup, animate, motion, useMotionValue, useMotionValueEvent, useTransform,
  type AnimationPlaybackControls, type MotionValue,
} from 'motion/react';
import { BookOpen, Pause, PenLine, Play, Volume2, VolumeX, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersistentState } from '@/lib/hooks/use-persistent-state';
import { useSafeReducedMotion } from '@/lib/hooks/use-safe-reduced-motion';
import { BrowserFrame, DEFAULT_CONTENT, ERAS, EraPage, FIRST, LAST, eraFor, isContent, type Content, type EraId } from '@/components/time-travel/eras';

const ACCENT: Record<EraId, string> = { web1: '#9ca3af', web2: '#38bdf8', flat: '#1abc9c', material: '#818cf8', modern: '#e5e7eb', spatial: '#a855f7' };
const TONE: Record<EraId, number> = { web1: 220, web2: 262, flat: 294, material: 330, modern: 392, spatial: 440 };
const SPAN = LAST - FIRST;
const WIN_W = 960;
const WIN_H = 624; // frame chrome + page + status bar
const clampYear = (y: number) => Math.min(LAST - 0.5, Math.max(FIRST + 0.5, y));
const snapYear = (y: number) => ERAS.reduce((best, e) => (Math.abs(e.from + 0.5 - y) < Math.abs(best - y) ? e.from + 0.5 : best), ERAS[0].from + 0.5);
const pct = (y: number) => ((y - FIRST) / SPAN) * 100;
const formatLoad = (s: number) => (s < 1 ? `${Math.round(s * 1000)} ms` : `${s.toFixed(1)} s`);

export default function TimeTravelPage() {
  const reduce = useSafeReducedMotion();
  const year = useMotionValue(FIRST + 0.5);
  const [eraId, setEraId] = useState<EraId>('web1');
  const [traveling, setTraveling] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const [drawer, setDrawer] = useState<'notes' | 'edit' | null>(null);
  const [content, setContent] = usePersistentState<Content>('timetravel-content', DEFAULT_CONTENT, isContent);
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const era = ERAS.find((e) => e.id === eraId)!;
  const loadSeconds = (era.pageKB * 8) / era.kbps;

  useMotionValueEvent(year, 'change', (y) => {
    const next = eraFor(y).id;
    if (next !== eraId) setEraId(next);
  });

  useEffect(() => {
    if (!sound) return;
    try {
      audio.current ??= new AudioContext();
      const ctx = audio.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = TONE[eraId];
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.75);
    } catch { /* audio unavailable */ }
  }, [eraId, sound]);

  const travelTo = useCallback((target: number, duration?: number) => {
    anim.current?.stop();
    const distance = Math.abs(target - year.get());
    setTraveling(true);
    anim.current = animate(year, target, {
      duration: reduce ? 0 : duration ?? Math.min(3, 0.7 + distance * 0.08),
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => { setTraveling(false); setPlaying(false); },
    });
  }, [reduce, year]);

  const step = useCallback((d: -1 | 1) => {
    const i = ERAS.findIndex((e) => e.id === eraFor(year.get()).id);
    travelTo(ERAS[Math.max(0, Math.min(ERAS.length - 1, i + d))].from + 0.5);
  }, [travelTo, year]);

  const togglePlay = useCallback(() => {
    if (playing) { anim.current?.stop(); setPlaying(false); setTraveling(false); return; }
    if (year.get() >= LAST - 1) year.set(FIRST + 0.5);
    setPlaying(true);
    travelTo(LAST - 0.5, 16);
  }, [playing, travelTo, year]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      if (e.key === 'Escape') setDrawer(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, togglePlay]);

  // Size the window to the space actually available — it never overlaps anything.
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el);
      const h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      setScale(Math.max(0.4, Math.min(1, h / WIN_H, w / WIN_W)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="relative isolate flex h-[calc(100vh-6rem)] min-h-[680px] flex-col overflow-hidden bg-[#03050a] text-white" aria-label="Time Travel">
      <WarpField year={year} accent={ACCENT[eraId]} reduce={reduce} />
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" animate={{ background: `radial-gradient(55% 45% at 50% 58%, ${ACCENT[eraId]}22, transparent 70%)` }} transition={{ duration: 1.2 }} />

      {/* 1 — The display */}
      <header className="relative z-10 flex shrink-0 flex-col items-center pt-6 text-center">
        <Odometer year={year} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={era.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <p className="mt-1 text-xl font-semibold tracking-tight">{era.name} <span className="font-normal text-white/60">— {era.tagline}</span></p>
            <p className="mt-1.5 text-sm text-white/70">
              {era.connection} · {era.screen} · this page loads in{' '}
              <span className={cn('font-semibold', loadSeconds > 5 ? 'text-[#fca5a5]' : loadSeconds > 2.5 ? 'text-[#fcd34d]' : 'text-[#86efac]')}>{formatLoad(loadSeconds)}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </header>

      {/* 2 — The window, fitted to the remaining space */}
      <div ref={stageRef} className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-8 py-5">
        <div style={{ width: WIN_W * scale, height: WIN_H * scale }}>
          <motion.div
            style={{ width: WIN_W, transformOrigin: 'top left', scale }}
            animate={{ opacity: traveling ? 0.9 : 1 }}
            transition={{ duration: 0.2 }}
            className="shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          >
            <BrowserFrame era={era.id} brand={content.brand}>
              <LayoutGroup id="time-travel">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div key={era.id} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.35 }} className="absolute inset-0">
                    <EraPage era={era.id} content={content} reduce={reduce} />
                  </motion.div>
                </AnimatePresence>
              </LayoutGroup>
              {!reduce && !traveling && (
                <motion.div
                  key={`load-${era.id}`}
                  aria-hidden="true"
                  initial={{ clipPath: 'inset(0 0 0 0)' }}
                  animate={{ clipPath: 'inset(100% 0 0 0)' }}
                  transition={{ duration: Math.min(2.4, loadSeconds * 0.2), ease: era.id === 'web1' ? 'linear' : [0.2, 0, 0, 1], delay: 0.15 }}
                  className="pointer-events-none absolute inset-0 z-10"
                  style={{ background: era.id === 'web1' ? '#c0c0c0' : era.id === 'spatial' ? '#070b17' : '#ffffff' }}
                />
              )}
              {!reduce && traveling && <div aria-hidden="true" className="tt-scan pointer-events-none absolute inset-0 z-10" />}
            </BrowserFrame>
            <StatusBar eraId={era.id} seconds={loadSeconds} traveling={traveling} />
          </motion.div>
        </div>
      </div>

      {/* 3 — The controls */}
      <footer className="relative z-10 shrink-0 px-10 pb-7">
        <Timeline
          year={year}
          eraId={eraId}
          onTravel={travelTo}
          onScrubStart={() => { anim.current?.stop(); setTraveling(true); setPlaying(false); }}
          onScrubEnd={(v) => {
            anim.current = animate(year, year.get(), { type: 'inertia', velocity: v, min: FIRST + 0.5, max: LAST - 0.5, power: 0.3, timeConstant: 280, modifyTarget: snapYear, onComplete: () => setTraveling(false) });
          }}
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Travel through every era'} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105">
              {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <ConsoleButton label="Era notes" active={drawer === 'notes'} onClick={() => setDrawer(drawer === 'notes' ? null : 'notes')}><BookOpen size={14} /></ConsoleButton>
            <ConsoleButton label="Your site" active={drawer === 'edit'} onClick={() => setDrawer(drawer === 'edit' ? null : 'edit')}><PenLine size={14} /></ConsoleButton>
            <ConsoleButton label={sound ? 'Sound on' : 'Sound off'} active={sound} onClick={() => setSound((s) => !s)}>{sound ? <Volume2 size={14} /> : <VolumeX size={14} />}</ConsoleButton>
          </div>
          <p className="text-xs text-white/55">Drag the timeline · ← → between eras · Space to play</p>
        </div>
      </footer>

      {/* Drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.aside
            role="dialog"
            aria-label={drawer === 'notes' ? 'Era notes' : 'Your site'}
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute inset-y-0 right-0 z-30 w-[360px] border-l border-white/10 bg-[#0a0d16]/95 p-6 backdrop-blur-xl"
          >
            <button type="button" onClick={() => setDrawer(null)} aria-label="Close" className="absolute right-4 top-4 rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><X size={15} /></button>
            {drawer === 'notes' ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{era.from}</p>
                  <p className="mt-1 text-2xl font-semibold">{era.name}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{era.tech.map((t) => <span key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-xs">{t}</span>)}</div>
                </div>
                <div><p className="mb-2 text-sm font-semibold text-[#86efac]">Still works today</p><ul className="space-y-1.5 text-sm text-white/85">{era.kept.map((k) => <li key={k}>{k}</li>)}</ul></div>
                <div><p className="mb-2 text-sm font-semibold text-[#fca5a5]">Retired</p><ul className="space-y-1.5 text-sm text-white/70">{era.retired.map((k) => <li key={k}>{k}</li>)}</ul></div>
                <div className="rounded-xl border border-white/10 p-4 text-sm">
                  <p className="text-white/60">Typical page weight</p>
                  <p className="text-lg font-semibold">{era.pageKB >= 1000 ? `${(era.pageKB / 1000).toFixed(1)} MB` : `${era.pageKB} KB`} on {era.connection}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-semibold">Your site</p>
                  <p className="mt-1 text-sm text-white/60">Every era rebuilds with your content.</p>
                </div>
                {(['brand', 'headline', 'sub', 'cta'] as const).map((k) => (
                  <label key={k} className="block text-sm text-white/70">
                    {{ brand: 'Brand', headline: 'Headline', sub: 'Subheadline', cta: 'Button' }[k]}
                    <input value={content[k]} onChange={(e) => setContent({ ...content, [k]: e.target.value.slice(0, k === 'headline' ? 70 : 60) })} className="mt-1.5 h-10 w-full rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-white/30" />
                  </label>
                ))}
                <button type="button" onClick={() => setContent(DEFAULT_CONTENT)} className="text-xs font-semibold text-white/60 hover:text-white">Restore example</button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <style>{`
        .tt-scan { background: repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 4px); animation: tt-scan 0.16s steps(2) infinite; }
        @keyframes tt-scan { 50% { transform: translateY(2px); } }
      `}</style>
    </section>
  );
}

function ConsoleButton({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={cn('inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors', active ? 'border-white/50 bg-white/15 text-white' : 'border-white/15 text-white/80 hover:bg-white/10 hover:text-white')}>
      {children}{label}
    </button>
  );
}

function StatusBar({ eraId, seconds, traveling }: { eraId: EraId; seconds: number; traveling: boolean }) {
  const text = traveling ? 'Traveling…' : eraId === 'web1' ? `Document: Done (${seconds.toFixed(1)} secs)` : `Done · ${formatLoad(seconds)}`;
  return (
    <div className={cn('flex h-6 items-center px-3 text-[11px]', eraId === 'web1' ? 'border-x-2 border-b-2 border-[#808080] bg-[#c0c0c0] text-black' : 'rounded-b-xl bg-black/40 text-white/70')} style={eraId === 'web1' ? { fontFamily: 'Arial, sans-serif' } : undefined}>
      {text}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Timeline scrubber                                                           */
/* -------------------------------------------------------------------------- */

function Timeline({ year, eraId, onTravel, onScrubStart, onScrubEnd }: { year: MotionValue<number>; eraId: EraId; onTravel: (y: number) => void; onScrubStart: () => void; onScrubEnd: (velocity: number) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);
  const left = useTransform(year, (v) => `${pct(v)}%`);
  const fromPointer = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    return clampYear(FIRST + ((clientX - r.left) / r.width) * SPAN);
  };

  return (
    <div>
      <div className="relative mb-2 h-5">
        {ERAS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => onTravel(e.from + 0.5)}
            aria-current={e.id === eraId ? 'true' : undefined}
            className={cn('absolute -translate-x-1/2 whitespace-nowrap text-xs font-semibold transition-colors', e.id === eraId ? 'text-white' : 'text-white/55 hover:text-white')}
            style={{ left: `${pct(e.from + 0.5)}%` }}
          >
            {e.from} · {e.name}
          </button>
        ))}
      </div>
      <div
        ref={track}
        role="slider"
        tabIndex={0}
        aria-label="Year"
        aria-valuemin={FIRST}
        aria-valuemax={LAST}
        aria-valuenow={ERAS.find((e) => e.id === eraId)?.from ?? FIRST}
        aria-valuetext={ERAS.find((e) => e.id === eraId)?.name}
        onKeyDown={(e) => { if (e.key === 'Home') onTravel(FIRST + 0.5); if (e.key === 'End') onTravel(LAST - 0.5); }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          scrubbing.current = true;
          onScrubStart();
          year.set(fromPointer(e.clientX));
        }}
        onPointerMove={(e) => { if (scrubbing.current) year.set(fromPointer(e.clientX)); }}
        onPointerUp={() => { if (!scrubbing.current) return; scrubbing.current = false; onScrubEnd(year.getVelocity()); }}
        onPointerCancel={() => { scrubbing.current = false; onScrubEnd(0); }}
        className="relative h-10 cursor-ew-resize touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <div className="absolute inset-x-0 top-1/2 flex h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
          {ERAS.map((e, i) => {
            const end = ERAS[i + 1]?.from ?? LAST;
            return <div key={e.id} className="h-full border-r border-[#03050a] transition-opacity" style={{ width: `${((end - e.from) / SPAN) * 100}%`, background: ACCENT[e.id], opacity: e.id === eraId ? 0.95 : 0.35 }} />;
          })}
        </div>
        {Array.from({ length: SPAN + 1 }, (_, i) => (
          <span key={i} aria-hidden="true" className={cn('absolute top-1/2 w-px -translate-y-1/2 bg-white/25', i % 5 === 0 ? 'h-5' : 'h-2.5')} style={{ left: `${(i / SPAN) * 100}%` }} />
        ))}
        <motion.div aria-hidden="true" className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#03050a] shadow-[0_0_24px_4px_rgba(255,255,255,0.35)]" style={{ left }}>
          <span className="absolute inset-1.5 rounded-full bg-white" />
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Odometer                                                                    */
/* -------------------------------------------------------------------------- */

function Odometer({ year }: { year: MotionValue<number> }) {
  return (
    <div className="flex font-semibold leading-none tracking-[-0.05em] tabular-nums" style={{ fontSize: 'clamp(64px, 11vh, 120px)', height: '1em' }} aria-hidden="true">
      {[1000, 100, 10, 1].map((p) => <DigitColumn key={p} year={year} place={p} />)}
    </div>
  );
}

function DigitColumn({ year, place }: { year: MotionValue<number>; place: number }) {
  const y = useTransform(year, (v) => {
    const t = v - 0.5;
    const value = place === 1 ? t : Math.floor(t + 0.0001) / place;
    const digit = place === 1 ? ((value % 10) + 10) % 10 : Math.floor(value) % 10;
    return `${-digit * (100 / 11)}%`; // the column holds 11 glyphs (0–9 plus a trailing 0)
  });
  return (
    <span className="relative inline-block h-[1em] w-[0.6em] overflow-hidden">
      <motion.span style={{ y }} className="absolute left-0 top-0 flex w-full flex-col">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
          <span key={i} className="block h-[1em] bg-gradient-to-b from-white to-white/55 bg-clip-text text-center text-transparent">{d}</span>
        ))}
      </motion.span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Warp field                                                                  */
/* -------------------------------------------------------------------------- */

function WarpField({ year, accent, reduce }: { year: MotionValue<number>; accent: string; reduce: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef(accent);
  useEffect(() => { accentRef.current = accent; }, [accent]);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0, raf = 0, speed = 0.5;
    const stars = Array.from({ length: 480 }, () => ({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: Math.random() }));
    const resize = () => { w = el.clientWidth; h = el.clientHeight; el.width = w * dpr; el.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const frame = () => {
      const v = Math.abs(year.getVelocity());
      const target = reduce ? 0 : 0.5 + Math.min(18, v * 1.6);
      speed += (target - speed) * 0.08;
      ctx.fillStyle = 'rgba(3,5,10,0.32)';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.55;
      ctx.strokeStyle = accentRef.current;
      ctx.lineCap = 'round';
      for (const s of stars) {
        const pz = s.z;
        s.z -= 0.0022 * speed;
        if (s.z <= 0.02) { s.x = (Math.random() - 0.5) * 2; s.y = (Math.random() - 0.5) * 2; s.z = 1; continue; }
        ctx.globalAlpha = Math.min(1, 0.2 + (1 - s.z) * 1.2) * 0.85;
        ctx.lineWidth = Math.max(1, (1 - s.z) * 2.4);
        ctx.beginPath();
        ctx.moveTo(cx + (s.x / pz) * w * 0.5, cy + (s.y / pz) * h * 0.5);
        ctx.lineTo(cx + (s.x / s.z) * w * 0.5, cy + (s.y / s.z) * h * 0.5);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame); };
    raf = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, [year, reduce]);

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
