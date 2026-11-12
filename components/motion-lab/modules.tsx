'use client';


import { useSafeReducedMotion } from '@/lib/hooks/use-safe-reduced-motion';import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { SegmentControl, SliderControl, TextControl, ToggleControl, Workbench } from '@/components/lab/workbench';

const EASES = {
  standard: [0.2, 0, 0, 1],
  expressive: [0.16, 1, 0.3, 1],
  decelerate: [0, 0, 0, 1],
  overshoot: [0.34, 1.56, 0.64, 1],
} as const;
type EaseKey = keyof typeof EASES;
const easeOptions = (Object.keys(EASES) as EaseKey[]).map((k) => ({ value: k, label: k[0].toUpperCase() + k.slice(1) }));
const fmt = (n: number) => Number(n.toFixed(3));

/* -------------------------------------------------------------------------- */
/* Scroll reveal                                                              */
/* -------------------------------------------------------------------------- */

type RevealEffect = 'fade-up' | 'fade-down' | 'slide-left' | 'slide-right' | 'scale' | 'blur' | 'rotate';

function hiddenState(effect: RevealEffect, d: number): Record<string, number | string> {
  switch (effect) {
    case 'fade-up': return { opacity: 0, y: d };
    case 'fade-down': return { opacity: 0, y: -d };
    case 'slide-left': return { opacity: 0, x: d };
    case 'slide-right': return { opacity: 0, x: -d };
    case 'scale': return { opacity: 0, scale: fmt(1 - d / 200) };
    case 'blur': return { opacity: 0, filter: 'blur(10px)', y: d / 3 };
    case 'rotate': return { opacity: 0, rotate: -6, y: d / 2 };
  }
}
function cssFrom(effect: RevealEffect, d: number): string {
  switch (effect) {
    case 'fade-up': return `transform: translateY(${d}px);`;
    case 'fade-down': return `transform: translateY(-${d}px);`;
    case 'slide-left': return `transform: translateX(${d}px);`;
    case 'slide-right': return `transform: translateX(-${d}px);`;
    case 'scale': return `transform: scale(${fmt(1 - d / 200)});`;
    case 'blur': return `filter: blur(10px); transform: translateY(${Math.round(d / 3)}px);`;
    case 'rotate': return `transform: translateY(${Math.round(d / 2)}px) rotate(-6deg);`;
  }
}

export function RevealBench() {
  const reduce = useSafeReducedMotion();
  const [effect, setEffect] = useState<RevealEffect>('fade-up');
  const [distance, setDistance] = useState(32);
  const [duration, setDuration] = useState(600);
  const [stagger, setStagger] = useState(80);
  const [count, setCount] = useState(6);
  const [ease, setEase] = useState<EaseKey>('expressive');
  const [run, setRun] = useState(0);
  const hidden = hiddenState(effect, distance);
  const e = EASES[ease];

  const code = [
    { label: 'React (Motion)', code: `import { motion } from 'motion/react';

const item = {
  hidden: ${JSON.stringify(hidden).replace(/"(\w+)":/g, '$1: ').replace(/,(?=\S)/g, ', ')},
  visible: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' },
};

export function RevealList({ items }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ staggerChildren: ${fmt(stagger / 1000)} }}
    >
      {items.map((it) => (
        <motion.li key={it.id} variants={item} transition={{ duration: ${fmt(duration / 1000)}, ease: [${e.join(', ')}] }}>
          {it.content}
        </motion.li>
      ))}
    </motion.ul>
  );
}` },
    { label: 'CSS + JS', code: `.reveal {
  opacity: 0;
  ${cssFrom(effect, distance)}
  transition: opacity ${duration}ms cubic-bezier(${e.join(', ')}),
              transform ${duration}ms cubic-bezier(${e.join(', ')}),
              filter ${duration}ms cubic-bezier(${e.join(', ')});
  transition-delay: calc(var(--i, 0) * ${stagger}ms);
}
.reveal.is-visible { opacity: 1; transform: none; filter: none; }
@media (prefers-reduced-motion: reduce) { .reveal { transition: none; opacity: 1; transform: none; filter: none; } }

/* JS */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.setProperty('--i', i); io.observe(el); });` },
  ];

  return (
    <Workbench
      id="reveal"
      title="Scroll reveal"
      description="Entrance animation for content as it enters the viewport. Tune the effect, then copy it as React or dependency-free CSS."
      onReplay={() => setRun((r) => r + 1)}
      code={code}
      preview={
        <div key={run} className="grid h-full grid-cols-3 content-center gap-4 p-8">
          {Array.from({ length: count }).map((_, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : hidden}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }}
              transition={{ duration: duration / 1000, ease: [...e] as [number, number, number, number], delay: (i * stagger) / 1000 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-3 h-8 w-8 rounded-lg bg-primary" />
              <div className="h-2.5 w-3/4 rounded bg-foreground/70" />
              <div className="mt-2 h-2 w-full rounded bg-muted-foreground/30" />
              <div className="mt-1.5 h-2 w-2/3 rounded bg-muted-foreground/30" />
            </motion.div>
          ))}
        </div>
      }
      controls={
        <>
          <SegmentControl label="Effect" value={effect} onChange={(v) => { setEffect(v); setRun((r) => r + 1); }} options={[
            { value: 'fade-up', label: 'Fade up' }, { value: 'fade-down', label: 'Fade down' }, { value: 'slide-left', label: 'From right' },
            { value: 'slide-right', label: 'From left' }, { value: 'scale', label: 'Scale' }, { value: 'blur', label: 'Blur' }, { value: 'rotate', label: 'Tilt' },
          ]} />
          <SliderControl label="Distance" value={distance} min={0} max={120} unit="px" onChange={setDistance} />
          <SliderControl label="Duration" value={duration} min={150} max={1500} step={50} unit="ms" onChange={setDuration} />
          <SliderControl label="Stagger" value={stagger} min={0} max={300} step={10} unit="ms" onChange={setStagger} />
          <SliderControl label="Items" value={count} min={1} max={9} onChange={(v) => { setCount(v); setRun((r) => r + 1); }} />
          <SegmentControl label="Easing" value={ease} onChange={(v) => { setEase(v); setRun((r) => r + 1); }} options={easeOptions} />
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Spring physics                                                             */
/* -------------------------------------------------------------------------- */

/** Numerically integrates a damped spring from 0 → 1. Returns samples and settle time. */
function simulateSpring(stiffness: number, damping: number, mass: number) {
  const dt = 1 / 600;
  let x = 0, v = 0, t = 0, settled = 0;
  const samples: Array<[number, number]> = [];
  while (t < 4) {
    const a = (-stiffness * (x - 1) - damping * v) / mass;
    v += a * dt; x += v * dt; t += dt;
    if (samples.length === 0 || t - samples[samples.length - 1][0] >= 0.01) samples.push([t, x]);
    if (Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) { if (!settled) settled = t; if (t - settled > 0.05) break; } else settled = 0;
  }
  return { samples, duration: Math.max(0.05, settled || t) };
}

export function SpringBench() {
  const reduce = useSafeReducedMotion();
  const [stiffness, setStiffness] = useState(220);
  const [damping, setDamping] = useState(18);
  const [mass, setMass] = useState(1);
  const [on, setOn] = useState(false);
  const sim = useMemo(() => simulateSpring(stiffness, damping, mass), [stiffness, damping, mass]);
  const peak = Math.max(...sim.samples.map((s) => s[1]));
  const overshoot = Math.max(0, (peak - 1) * 100);

  const path = useMemo(() => {
    const maxY = Math.max(1.4, peak);
    return sim.samples.map(([t, x], i) => `${i ? 'L' : 'M'}${(t / sim.duration) * 260 + 10},${110 - (x / maxY) * 90}`).join(' ');
  }, [sim, peak]);

  const linear = useMemo(() => {
    // Downsample to ~40 points for a CSS linear() easing function.
    const step = Math.max(1, Math.floor(sim.samples.length / 40));
    const pts = sim.samples.filter((_, i) => i % step === 0).map(([t, x]) => `${fmt(x)} ${Math.round((t / sim.duration) * 100)}%`);
    return `linear(0, ${pts.join(', ')}, 1)`;
  }, [sim]);

  return (
    <Workbench
      id="spring"
      title="Spring physics"
      description="Physically based motion. The curve is simulated from your values; export it for Motion, or as a CSS linear() easing that needs no JavaScript."
      onReplay={() => setOn((v) => !v)}
      code={[
        { label: 'React (Motion)', code: `transition={{ type: 'spring', stiffness: ${stiffness}, damping: ${damping}, mass: ${mass} }}` },
        { label: 'CSS linear()', code: `/* Spring approximated as a CSS easing — settles in ${Math.round(sim.duration * 1000)}ms */\n.element {\n  transition: transform ${Math.round(sim.duration * 1000)}ms ${linear};\n}` },
      ]}
      preview={
        <div className="grid h-full grid-rows-[1fr_auto] gap-4 p-8">
          <div className="relative flex items-center rounded-xl border border-border bg-card px-6">
            <SpringPuck on={on} stiffness={stiffness} damping={damping} mass={mass} reduce={!!reduce} />
          </div>
          <div className="flex items-end gap-6">
            <svg viewBox="0 0 280 120" preserveAspectRatio="none" className="h-32 flex-1 rounded-lg border border-border bg-card" role="img" aria-label="Spring response curve">
              <line x1="10" x2="270" y1={110 - (1 / Math.max(1.4, peak)) * 90} y2={110 - (1 / Math.max(1.4, peak)) * 90} stroke="currentColor" strokeOpacity="0.25" strokeDasharray="4 4" />
              <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <dl className="grid shrink-0 grid-cols-1 gap-2 text-sm">
              <div><dt className="text-xs text-muted-foreground">Settles in</dt><dd className="font-mono font-semibold">{Math.round(sim.duration * 1000)}ms</dd></div>
              <div><dt className="text-xs text-muted-foreground">Overshoot</dt><dd className="font-mono font-semibold">{overshoot.toFixed(1)}%</dd></div>
            </dl>
          </div>
        </div>
      }
      controls={
        <>
          <SliderControl label="Stiffness" value={stiffness} min={20} max={800} step={10} onChange={setStiffness} />
          <SliderControl label="Damping" value={damping} min={2} max={80} onChange={setDamping} />
          <SliderControl label="Mass" value={mass} min={0.2} max={5} step={0.1} onChange={setMass} />
          <SegmentControl label="Presets" value={`${stiffness}-${damping}-${mass}`} onChange={(v) => { const [s, d, m] = v.split('-').map(Number); setStiffness(s); setDamping(d); setMass(m); setOn((x) => !x); }} options={[
            { value: '400-40-1', label: 'Snappy' }, { value: '220-18-1', label: 'Natural' }, { value: '120-8-1', label: 'Bouncy' },
            { value: '60-20-1', label: 'Gentle' }, { value: '600-60-1', label: 'Instant' }, { value: '200-10-3', label: 'Heavy' },
          ]} />
          <p className="text-xs text-muted-foreground">Press Replay to move the puck with these settings.</p>
        </>
      }
    />
  );
}

function SpringPuck({ on, stiffness, damping, mass, reduce }: { on: boolean; stiffness: number; damping: number; mass: number; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(400);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.max(0, el.clientWidth - 48)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="h-24 w-full py-6">
      <motion.div
        animate={{ x: on ? w : 0 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness, damping, mass }}
        className="h-12 w-12 rounded-full bg-primary shadow-lg"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax                                                                   */
/* -------------------------------------------------------------------------- */

export function ParallaxBench() {
  const container = useRef<HTMLDivElement>(null);
  const [back, setBack] = useState(0.3);
  const [mid, setMid] = useState(0.6);
  const [front, setFront] = useState(1.2);
  const { scrollYProgress } = useScroll({ container });
  const yBack = useTransform(scrollYProgress, [0, 1], [0, -400 * back]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -400 * mid]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, -400 * front]);

  return (
    <Workbench
      id="parallax"
      title="Parallax layers"
      description="Scroll inside the preview. Each layer moves at its own speed relative to scroll, creating depth. Keep speeds subtle for comfort."
      code={[
        { label: 'React (Motion)', code: `const { scrollYProgress } = useScroll();
const yBack  = useTransform(scrollYProgress, [0, 1], [0, ${Math.round(-400 * back)}]);
const yMid   = useTransform(scrollYProgress, [0, 1], [0, ${Math.round(-400 * mid)}]);
const yFront = useTransform(scrollYProgress, [0, 1], [0, ${Math.round(-400 * front)}]);

<motion.div style={{ y: yBack }}>…</motion.div>
<motion.div style={{ y: yMid }}>…</motion.div>
<motion.div style={{ y: yFront }}>…</motion.div>` },
        { label: 'CSS (scroll-driven)', code: `/* Native scroll-driven animations — no JavaScript (Chromium, Safari 18+) */
@keyframes rise-back  { to { transform: translateY(${Math.round(-400 * back)}px); } }
@keyframes rise-mid   { to { transform: translateY(${Math.round(-400 * mid)}px); } }
@keyframes rise-front { to { transform: translateY(${Math.round(-400 * front)}px); } }
.layer { animation-timeline: scroll(); animation-fill-mode: both; animation-timing-function: linear; }
.layer-back  { animation-name: rise-back; }
.layer-mid   { animation-name: rise-mid; }
.layer-front { animation-name: rise-front; }
@media (prefers-reduced-motion: reduce) { .layer { animation: none; } }` },
      ]}
      preview={
        <div ref={container} className="absolute inset-0 overflow-y-auto" tabIndex={0} aria-label="Scrollable parallax preview">
          <div className="sticky top-0 h-[340px] overflow-hidden">
            <motion.div style={{ y: yBack }} className="absolute inset-x-0 top-10 flex justify-center">
              <span className="select-none font-display text-[9rem] font-bold leading-none text-foreground/[0.06]">DEPTH</span>
            </motion.div>
            <motion.div style={{ y: yMid }} className="absolute left-[12%] top-24 grid grid-cols-3 gap-3 opacity-80">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 w-24 rounded-lg border border-border bg-muted" />)}
            </motion.div>
            <motion.div style={{ y: yFront }} className="absolute right-[12%] top-40 w-64 rounded-xl border border-border bg-card p-5 shadow-xl">
              <p className="text-sm font-semibold">Foreground layer</p>
              <p className="mt-1 text-xs text-muted-foreground">Moves fastest — closest to the viewer.</p>
            </motion.div>
          </div>
          <div className="h-[700px]" />
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">Scroll inside this panel</p>
        </div>
      }
      controls={
        <>
          <SliderControl label="Background speed" value={back} min={0} max={2} step={0.1} unit="×" onChange={setBack} />
          <SliderControl label="Middle speed" value={mid} min={0} max={2} step={0.1} unit="×" onChange={setMid} />
          <SliderControl label="Foreground speed" value={front} min={0} max={2} step={0.1} unit="×" onChange={setFront} />
          <p className="text-xs text-muted-foreground">Large speed differences can cause discomfort for motion-sensitive users. Always honour reduced motion.</p>
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Text reveal                                                                */
/* -------------------------------------------------------------------------- */

export function TextRevealBench() {
  const reduce = useSafeReducedMotion();
  const [text, setText] = useState('Plan with certainty, build with confidence.');
  const [split, setSplit] = useState<'word' | 'char'>('word');
  const [style, setStyle] = useState<'rise' | 'fade' | 'blur'>('rise');
  const [stagger, setStagger] = useState(50);
  const [run, setRun] = useState(0);
  const parts = split === 'word' ? text.split(/(\s+)/) : Array.from(text);
  const from = style === 'rise' ? { opacity: 0, y: '0.6em' } : style === 'blur' ? { opacity: 0, filter: 'blur(8px)' } : { opacity: 0 };

  return (
    <Workbench
      id="text"
      title="Text reveal"
      description="Headline entrance split by word or character. Screen readers receive the full sentence — the split spans are hidden from assistive technology."
      onReplay={() => setRun((r) => r + 1)}
      code={[{ label: 'React (Motion)', code: `const parts = ${split === 'word' ? "text.split(/(\\s+)/)" : 'Array.from(text)'};

<h1 aria-label={text}>
  {parts.map((part, i) => (
    <motion.span
      key={i}
      aria-hidden="true"
      style={{ display: 'inline-block', whiteSpace: 'pre' }}
      initial={${JSON.stringify(from).replace(/"(\w+)":/g, '$1: ').replace(/,(?=\S)/g, ', ')}}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ delay: i * ${fmt(stagger / 1000)}, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {part}
    </motion.span>
  ))}
</h1>` }]}
      preview={
        <div className="flex h-full items-center px-10">
          <h3 key={run} aria-label={text} className="font-display text-5xl font-bold leading-tight tracking-tight">
            {parts.map((p, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
                initial={reduce ? false : from}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: (i * stagger) / 1000, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {p}
              </motion.span>
            ))}
          </h3>
        </div>
      }
      controls={
        <>
          <TextControl label="Text" value={text} onChange={(v) => setText(v.slice(0, 80))} />
          <SegmentControl label="Split by" value={split} onChange={(v) => { setSplit(v); setRun((r) => r + 1); }} options={[{ value: 'word', label: 'Word' }, { value: 'char', label: 'Character' }]} />
          <SegmentControl label="Style" value={style} onChange={(v) => { setStyle(v); setRun((r) => r + 1); }} options={[{ value: 'rise', label: 'Rise' }, { value: 'fade', label: 'Fade' }, { value: 'blur', label: 'Blur' }]} />
          <SliderControl label="Stagger" value={stagger} min={0} max={150} step={5} unit="ms" onChange={setStagger} />
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Magnetic                                                                   */
/* -------------------------------------------------------------------------- */

export function MagneticBench() {
  const [strength, setStrength] = useState(0.35);
  const [stiffness, setStiffness] = useState(160);
  const [damping, setDamping] = useState(14);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness, damping });
  const sy = useSpring(y, { stiffness, damping });

  return (
    <Workbench
      id="magnetic"
      title="Magnetic attraction"
      description="The control drifts toward the pointer when it is near, then springs back. Use sparingly — on one primary action, not every button."
      code={[{ label: 'React (Motion)', code: `function Magnetic({ children }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: ${stiffness}, damping: ${damping} });
  const sy = useSpring(y, { stiffness: ${stiffness}, damping: ${damping} });
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * ${strength});
        y.set((e.clientY - r.top - r.height / 2) * ${strength});
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}` }]}
      preview={
        <div
          className="flex h-full items-center justify-center"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            x.set((e.clientX - r.left - r.width / 2) * strength);
            y.set((e.clientY - r.top - r.height / 2) * strength);
          }}
          onPointerLeave={() => { x.set(0); y.set(0); }}
        >
          <motion.button type="button" style={{ x: sx, y: sy }} className="rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg">
            Get started
          </motion.button>
          <p className="pointer-events-none absolute bottom-3 text-xs text-muted-foreground">Move the pointer around the panel</p>
        </div>
      }
      controls={
        <>
          <SliderControl label="Strength" value={strength} min={0} max={1} step={0.05} onChange={setStrength} />
          <SliderControl label="Stiffness" value={stiffness} min={40} max={500} step={10} onChange={setStiffness} />
          <SliderControl label="Damping" value={damping} min={4} max={50} onChange={setDamping} />
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Hover & press                                                              */
/* -------------------------------------------------------------------------- */

export function PressBench() {
  const [hoverScale, setHoverScale] = useState(1.03);
  const [lift, setLift] = useState(4);
  const [tapScale, setTapScale] = useState(0.97);
  const [stiffness, setStiffness] = useState(400);
  const [damping, setDamping] = useState(25);

  return (
    <Workbench
      id="press"
      title="Hover and press feedback"
      description="Small, fast responses that confirm interactivity. Hover the card and press it to feel the values."
      code={[
        { label: 'React (Motion)', code: `<motion.div
  whileHover={{ scale: ${hoverScale}, y: ${-lift} }}
  whileTap={{ scale: ${tapScale} }}
  transition={{ type: 'spring', stiffness: ${stiffness}, damping: ${damping} }}
/>` },
        { label: 'CSS', code: `.card {
  transition: transform 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms ease;
}
.card:hover { transform: translateY(${-lift}px) scale(${hoverScale}); }
.card:active { transform: scale(${tapScale}); transition-duration: 80ms; }
@media (prefers-reduced-motion: reduce) { .card, .card:hover, .card:active { transform: none; } }` },
      ]}
      preview={
        <div className="flex h-full items-center justify-center gap-8">
          {['Starter', 'Pro'].map((name, i) => (
            <motion.button
              key={name}
              type="button"
              whileHover={{ scale: hoverScale, y: -lift }}
              whileTap={{ scale: tapScale }}
              transition={{ type: 'spring', stiffness, damping }}
              className="w-56 rounded-2xl border border-border bg-card p-6 text-left shadow-sm"
            >
              <p className="text-sm font-semibold">{name}</p>
              <p className="mt-2 font-display text-3xl font-bold">{i ? '$29' : '$0'}<span className="text-sm font-normal text-muted-foreground"> /month</span></p>
              <p className="mt-2 text-xs text-muted-foreground">Hover, then press.</p>
            </motion.button>
          ))}
        </div>
      }
      controls={
        <>
          <SliderControl label="Hover scale" value={hoverScale} min={1} max={1.15} step={0.01} unit="×" onChange={setHoverScale} />
          <SliderControl label="Hover lift" value={lift} min={0} max={16} unit="px" onChange={setLift} />
          <SliderControl label="Press scale" value={tapScale} min={0.85} max={1} step={0.01} unit="×" onChange={setTapScale} />
          <SliderControl label="Stiffness" value={stiffness} min={100} max={800} step={10} onChange={setStiffness} />
          <SliderControl label="Damping" value={damping} min={5} max={60} onChange={setDamping} />
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Marquee (pure CSS)                                                         */
/* -------------------------------------------------------------------------- */

export function MarqueeBench() {
  const [items, setItems] = useState('Northwind, Globex, Initech, Umbrella, Hooli, Stark');
  const [seconds, setSeconds] = useState(20);
  const [reverse, setReverse] = useState(false);
  const [pause, setPause] = useState(true);
  const [gap, setGap] = useState(48);
  const list = items.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <Workbench
      id="marquee"
      title="Infinite marquee"
      description="A seamless, GPU-composited loop built with CSS only. The content is duplicated once and translated by half its width."
      code={[{ label: 'HTML + CSS', code: `<div class="marquee"${pause ? ' data-pause' : ''}>
  <div class="marquee__track">
    ${list.map((i) => `<span>${i}</span>`).join('')}
    <!-- duplicate the items once, with aria-hidden="true" -->
  </div>
</div>

.marquee { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.marquee__track { display: flex; gap: ${gap}px; width: max-content; animation: marquee ${seconds}s linear infinite${reverse ? ' reverse' : ''}; }
${pause ? '.marquee[data-pause]:hover .marquee__track { animation-play-state: paused; }\n' : ''}@keyframes marquee { to { transform: translateX(calc(-50% - ${gap / 2}px)); } }
@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }` }]}
      preview={
        <div className="flex h-full items-center">
          <style>{`@keyframes mv-marquee { to { transform: translateX(calc(-50% - var(--gap) / 2)); } } .mv-marquee-track { animation: mv-marquee var(--dur) linear infinite; } .mv-marquee[data-pause='true']:hover .mv-marquee-track { animation-play-state: paused; } @media (prefers-reduced-motion: reduce) { .mv-marquee-track { animation: none; } }`}</style>
          <div className="mv-marquee w-full overflow-hidden" data-pause={pause} style={{ maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}>
            <div
              className="mv-marquee-track flex w-max"
              style={{ gap, ['--gap' as string]: `${gap}px`, ['--dur' as string]: `${seconds}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
            >
              {[...list, ...list].map((item, i) => (
                <span key={i} aria-hidden={i >= list.length} className="whitespace-nowrap font-display text-4xl font-bold tracking-tight text-foreground/80">{item}</span>
              ))}
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <TextControl label="Items (comma separated)" value={items} onChange={setItems} />
          <SliderControl label="Loop duration" value={seconds} min={5} max={60} unit="s" onChange={setSeconds} />
          <SliderControl label="Gap" value={gap} min={16} max={120} step={4} unit="px" onChange={setGap} />
          <ToggleControl label="Reverse direction" checked={reverse} onChange={setReverse} />
          <ToggleControl label="Pause on hover" checked={pause} onChange={setPause} />
        </>
      }
    />
  );
}
