'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, Reorder, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Bell, GripVertical, Mail, MessageSquare, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SegmentControl, SliderControl, ToggleControl, Workbench } from '@/components/lab/workbench';

/* -------------------------------------------------------------------------- */
/* 3D tilt                                                                     */
/* -------------------------------------------------------------------------- */

export function TiltBench() {
  const [maxTilt, setMaxTilt] = useState(12);
  const [perspective, setPerspective] = useState(900);
  const [depth, setDepth] = useState(40);
  const [glare, setGlare] = useState(true);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 260, damping: 26 });
  const sy = useSpring(py, { stiffness: 260, damping: 26 });
  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);
  const glareBg = useTransform([sx, sy], ([x, y]) => `radial-gradient(circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(255,255,255,0.35), transparent 55%)`);

  return (
    <Workbench
      id="tilt"
      title="3D tilt"
      description="The card rotates toward the pointer with depth layers. Keep the angle modest for product UI; larger angles suit showcase moments."
      code={[
        { label: 'React (Motion)', code: `const px = useMotionValue(0.5), py = useMotionValue(0.5);
const sx = useSpring(px, { stiffness: 260, damping: 26 });
const sy = useSpring(py, { stiffness: 260, damping: 26 });
const rotateX = useTransform(sy, [0, 1], [${maxTilt}, ${-maxTilt}]);
const rotateY = useTransform(sx, [0, 1], [${-maxTilt}, ${maxTilt}]);

<div style={{ perspective: ${perspective} }}>
  <motion.div
    style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
    onPointerMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width);
      py.set((e.clientY - r.top) / r.height);
    }}
    onPointerLeave={() => { px.set(0.5); py.set(0.5); }}
  >
    <div style={{ transform: 'translateZ(${depth}px)' }}>…</div>
  </motion.div>
</div>` },
      ]}
      preview={
        <div className="flex h-full items-center justify-center" style={{ perspective }}>
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              px.set((e.clientX - r.left) / r.width);
              py.set((e.clientY - r.top) / r.height);
            }}
            onPointerLeave={() => { px.set(0.5); py.set(0.5); }}
            className="relative h-60 w-96 rounded-2xl border border-border bg-card p-7 shadow-2xl"
          >
            <div style={{ transform: `translateZ(${depth}px)` }}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Pro plan</p>
              <p className="mt-3 font-display text-4xl font-bold">$29<span className="text-base font-normal text-muted-foreground"> /month</span></p>
            </div>
            <div style={{ transform: `translateZ(${depth * 1.6}px)` }} className="absolute bottom-7 left-7 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Upgrade</div>
            {glare && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: glareBg, mixBlendMode: 'overlay' }} />}
          </motion.div>
        </div>
      }
      controls={
        <>
          <SliderControl label="Maximum tilt" value={maxTilt} min={0} max={30} unit="°" onChange={setMaxTilt} />
          <SliderControl label="Perspective" value={perspective} min={300} max={2000} step={50} unit="px" onChange={setPerspective} />
          <SliderControl label="Layer depth" value={depth} min={0} max={100} unit="px" onChange={setDepth} />
          <ToggleControl label="Glare" checked={glare} onChange={setGlare} />
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Drag & throw                                                                */
/* -------------------------------------------------------------------------- */

export function DragBench() {
  const area = useRef<HTMLDivElement>(null);
  const [axis, setAxis] = useState<'both' | 'x' | 'y'>('both');
  const [bounded, setBounded] = useState(true);
  const [elastic, setElastic] = useState(0.3);
  const [momentum, setMomentum] = useState(true);
  const [snapBack, setSnapBack] = useState(false);
  const [readout, setReadout] = useState({ x: 0, y: 0, vx: 0, vy: 0 });
  const [key, setKey] = useState(0);

  return (
    <Workbench
      id="drag"
      title="Drag and throw"
      description="Direct manipulation with momentum and boundaries. The readout shows live position and release velocity."
      onReplay={() => { setKey((k) => k + 1); setReadout({ x: 0, y: 0, vx: 0, vy: 0 }); }}
      code={[{ label: 'React (Motion)', code: `const area = useRef(null);

<div ref={area} className="relative">
  <motion.div
    drag${axis === 'both' ? '' : `="${axis}"`}
    ${bounded ? 'dragConstraints={area}' : ''}
    dragElastic={${elastic}}
    dragMomentum={${momentum}}
    ${snapBack ? 'dragSnapToOrigin' : ''}
    whileDrag={{ scale: 1.05 }}
  />
</div>`.replace(/\n\s*\n/g, '\n') }]}
      preview={
        <div ref={area} className="absolute inset-4 rounded-xl border-2 border-dashed border-border">
          <motion.div
            key={key}
            drag={axis === 'both' ? true : axis}
            dragConstraints={bounded ? area : undefined}
            dragElastic={elastic}
            dragMomentum={momentum}
            dragSnapToOrigin={snapBack}
            whileDrag={{ scale: 1.06 }}
            onDrag={(_, info) => setReadout({ x: Math.round(info.offset.x), y: Math.round(info.offset.y), vx: Math.round(info.velocity.x), vy: Math.round(info.velocity.y) })}
            className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-xl active:cursor-grabbing"
          >
            Drag
          </motion.div>
          <div className="absolute bottom-3 left-3 rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">
            x {readout.x} · y {readout.y} · velocity {readout.vx}, {readout.vy} px/s
          </div>
        </div>
      }
      controls={
        <>
          <SegmentControl label="Axis" value={axis} onChange={setAxis} options={[{ value: 'both', label: 'Free' }, { value: 'x', label: 'Horizontal' }, { value: 'y', label: 'Vertical' }]} />
          <SliderControl label="Edge elasticity" value={elastic} min={0} max={1} step={0.05} onChange={setElastic} />
          <ToggleControl label="Keep inside bounds" checked={bounded} onChange={setBounded} />
          <ToggleControl label="Momentum on release" checked={momentum} onChange={setMomentum} />
          <ToggleControl label="Snap back to origin" checked={snapBack} onChange={setSnapBack} />
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Sortable list                                                               */
/* -------------------------------------------------------------------------- */

const INITIAL_ITEMS = ['Hero', 'Logo cloud', 'Feature grid', 'Testimonial', 'Pricing', 'FAQ'];

export function SortableBench() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [handleOnly, setHandleOnly] = useState(false);

  return (
    <Workbench
      id="sortable"
      title="Sortable list"
      description="Drag to reorder with animated layout. Items can also be moved with the keyboard: focus an item and use the arrow keys."
      onReplay={() => setItems(INITIAL_ITEMS)}
      code={[{ label: 'React (Motion)', code: `import { Reorder } from 'motion/react';

const [items, setItems] = useState(['Hero', 'Pricing', 'FAQ']);

<Reorder.Group axis="y" values={items} onReorder={setItems}>
  {items.map((item) => (
    <Reorder.Item key={item} value={item}>
      {item}
    </Reorder.Item>
  ))}
</Reorder.Group>` }]}
      preview={
        <div className="grid h-full grid-cols-[1fr_200px] gap-6 p-8">
          <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
            {items.map((item, i) => (
              <SortableRow key={item} item={item} index={i} total={items.length} handleOnly={handleOnly} onMove={(dir) => {
                const next = [...items];
                const j = i + dir;
                if (j < 0 || j >= next.length) return;
                [next[i], next[j]] = [next[j], next[i]];
                setItems(next);
              }} />
            ))}
          </Reorder.Group>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Current order</p>
            <ol className="mt-3 space-y-1 font-mono text-xs">{items.map((it, i) => <li key={it}>{i + 1}. {it}</li>)}</ol>
          </div>
        </div>
      }
      controls={
        <>
          <ToggleControl label="Drag by handle only" checked={handleOnly} onChange={setHandleOnly} />
          <p className="text-xs text-muted-foreground">Handle-only dragging prevents accidental reordering when items contain other controls.</p>
        </>
      }
    />
  );
}

function SortableRow({ item, index, total, handleOnly, onMove }: { item: string; index: number; total: number; handleOnly: boolean; onMove: (dir: -1 | 1) => void }) {
  return (
    <Reorder.Item
      value={item}
      dragListener={!handleOnly}
      whileDrag={{ scale: 1.02, boxShadow: '0 12px 30px -12px rgba(0,0,0,0.35)' }}
      tabIndex={0}
      aria-label={`${item}, position ${index + 1} of ${total}. Use arrow keys to move.`}
      onKeyDown={(e) => { if (e.key === 'ArrowUp') { e.preventDefault(); onMove(-1); } if (e.key === 'ArrowDown') { e.preventDefault(); onMove(1); } }}
      className={cn('flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary', !handleOnly && 'cursor-grab active:cursor-grabbing')}
    >
      <GripVertical size={16} className={cn('text-muted-foreground', handleOnly && 'cursor-grab')} />
      {item}
    </Reorder.Item>
  );
}

/* -------------------------------------------------------------------------- */
/* Swipe to dismiss                                                            */
/* -------------------------------------------------------------------------- */

const NOTES = [
  { id: 1, icon: Mail, title: 'New lead from the contact form', body: 'Priya at Globex asked about the Team plan.' },
  { id: 2, icon: MessageSquare, title: 'Comment on the homepage draft', body: 'Can we shorten the hero headline?' },
  { id: 3, icon: Bell, title: 'Launch checklist updated', body: '3 accessibility items were completed.' },
];

export function SwipeBench() {
  const [threshold, setThreshold] = useState(120);
  const [notes, setNotes] = useState(NOTES);
  const [last, setLast] = useState<(typeof NOTES)[number] | null>(null);

  return (
    <Workbench
      id="swipe"
      title="Swipe to dismiss"
      description="Drag a notification sideways past the threshold to dismiss it, with an undo. Below the threshold it springs back."
      onReplay={() => { setNotes(NOTES); setLast(null); }}
      code={[{ label: 'React (Motion)', code: `<motion.div
  drag="x"
  dragSnapToOrigin
  onDragEnd={(_, info) => {
    if (Math.abs(info.offset.x) > ${threshold} || Math.abs(info.velocity.x) > 800) dismiss(id);
  }}
  exit={{ opacity: 0, x: 300 }}
/>` }]}
      preview={
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8">
          <AnimatePresence initial={false}>
            {notes.map((n) => (
              <motion.div
                key={n.id}
                layout
                drag="x"
                dragSnapToOrigin
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > 800) {
                    setNotes((all) => all.filter((x) => x.id !== n.id));
                    setLast(n);
                  }
                }}
                exit={{ opacity: 0, x: 320, transition: { duration: 0.2 } }}
                className="flex w-full max-w-md cursor-grab items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm active:cursor-grabbing"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><n.icon size={16} /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{n.title}</span>
                  <span className="block text-xs text-muted-foreground">{n.body}</span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {notes.length === 0 && <p className="text-sm text-muted-foreground">All caught up.</p>}
          {last && (
            <div className="absolute bottom-4 flex items-center gap-3 rounded-lg bg-foreground px-4 py-2 text-sm text-background" role="status">
              <Trash2 size={14} /> Dismissed
              <button type="button" onClick={() => { setNotes((all) => [...all, last].sort((a, b) => a.id - b.id)); setLast(null); }} className="inline-flex items-center gap-1 font-semibold underline underline-offset-2">
                <RotateCcw size={12} /> Undo
              </button>
            </div>
          )}
        </div>
      }
      controls={
        <>
          <SliderControl label="Dismiss threshold" value={threshold} min={40} max={240} step={10} unit="px" onChange={setThreshold} />
          <p className="text-xs text-muted-foreground">A fast flick (over 800 px/s) also dismisses, regardless of distance. Always provide undo for destructive gestures.</p>
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Spotlight hover                                                             */
/* -------------------------------------------------------------------------- */

export function SpotlightBench() {
  const [radius, setRadius] = useState(220);
  const [intensity, setIntensity] = useState(14);
  const [border, setBorder] = useState(true);

  return (
    <Workbench
      id="spotlight"
      title="Spotlight hover"
      description="A soft light follows the pointer across a card grid. Implemented with two CSS variables — no animation library, no re-renders."
      code={[{ label: 'CSS + JS', code: `.spotlight {
  background: radial-gradient(${radius}px circle at var(--x) var(--y),
    color-mix(in srgb, var(--primary) ${intensity}%, transparent), transparent 70%), var(--card);
}

document.querySelectorAll('.spotlight').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', \`\${e.clientX - r.left}px\`);
    el.style.setProperty('--y', \`\${e.clientY - r.top}px\`);
  });
});` }]}
      preview={
        <div className="grid h-full grid-cols-3 content-center gap-4 p-8">
          {['Brief', 'Builder', 'Playground', 'Launch', 'Docs', 'Exports'].map((label) => (
            <div
              key={label}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
              }}
              className={cn('rounded-xl p-5', border ? 'border border-border' : '')}
              style={{ background: `radial-gradient(${radius}px circle at var(--x, -999px) var(--y, -999px), color-mix(in srgb, var(--primary) ${intensity}%, transparent), transparent 70%), var(--card)` }}
            >
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-1 text-xs text-muted-foreground">Move the pointer across the cards.</p>
            </div>
          ))}
        </div>
      }
      controls={
        <>
          <SliderControl label="Light radius" value={radius} min={80} max={500} step={10} unit="px" onChange={setRadius} />
          <SliderControl label="Intensity" value={intensity} min={4} max={40} unit="%" onChange={setIntensity} />
          <ToggleControl label="Card border" checked={border} onChange={setBorder} />
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Proximity grid                                                              */
/* -------------------------------------------------------------------------- */

export function ProximityBench() {
  const [reach, setReach] = useState(3);
  const [scale, setScale] = useState(1.6);
  const [cols, setCols] = useState(16);
  const [hover, setHover] = useState<number | null>(null);
  const rows = 8;

  return (
    <Workbench
      id="proximity"
      title="Proximity grid"
      description="Cells respond to their distance from the pointer, producing a ripple. Useful for feature maps, calendars and data overviews."
      code={[{ label: 'React', code: `const dist = Math.hypot(col - hoverCol, row - hoverRow);
const t = Math.max(0, 1 - dist / ${reach});        // 1 at the pointer, 0 at the edge of reach
style={{ transform: \`scale(\${1 + t * ${(scale - 1).toFixed(2)}})\`, opacity: 0.35 + t * 0.65 }}` }]}
      preview={
        <div className="flex h-full items-center justify-center p-8" onPointerLeave={() => setHover(null)}>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1.25rem)` }}>
            {Array.from({ length: cols * rows }).map((_, i) => {
              const c = i % cols, r = Math.floor(i / cols);
              let t = 0;
              if (hover !== null) {
                const hc = hover % cols, hr = Math.floor(hover / cols);
                t = Math.max(0, 1 - Math.hypot(c - hc, r - hr) / reach);
              }
              return (
                <div
                  key={i}
                  onPointerEnter={() => setHover(i)}
                  className="aspect-square rounded-[4px] transition-transform duration-150 ease-out"
                  style={{ transform: `scale(${1 + t * (scale - 1)})`, background: t > 0 ? 'var(--primary)' : 'var(--muted)', opacity: t > 0 ? 0.35 + t * 0.65 : 1 }}
                />
              );
            })}
          </div>
        </div>
      }
      controls={
        <>
          <SliderControl label="Reach" value={reach} min={1} max={8} step={0.5} unit=" cells" onChange={setReach} />
          <SliderControl label="Peak scale" value={scale} min={1} max={2.5} step={0.1} unit="×" onChange={setScale} />
          <SliderControl label="Columns" value={cols} min={8} max={24} onChange={setCols} />
        </>
      }
    />
  );
}
