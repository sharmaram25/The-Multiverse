'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowDown, ArrowUp, Download, Pencil, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersistentState } from '@/lib/hooks/use-persistent-state';
import { downloadFile } from '@/lib/browser';
import { escapeHtml } from '@/lib/builder/render';

interface Chapter { id: string; kicker: string; title: string; body: string }
type Effect = 'fade' | 'rise' | 'scale';
interface Story { chapters: Chapter[]; effect: Effect }

const DEFAULT_STORY: Story = {
  effect: 'rise',
  chapters: [
    { id: 'c1', kicker: '01 — The problem', title: 'Most websites are designed in code.', body: 'Decisions about structure, tone and accessibility get made late, when every change is expensive.' },
    { id: 'c2', kicker: '02 — The shift', title: 'Decide before you build.', body: 'Brief, sitemap, tokens and page structure are agreed while they are still cheap to change.' },
    { id: 'c3', kicker: '03 — The proof', title: 'Teams ship in weeks, not months.', body: 'A shared blueprint removes the back-and-forth between strategy, design and engineering.' },
    { id: 'c4', kicker: '04 — Your turn', title: 'Start with a brief.', body: 'Edit this story with the button in the corner, then export it as a standalone page.' },
  ],
};
const isStory = (v: unknown): v is Story => !!v && typeof v === 'object' && Array.isArray((v as Story).chapters) && (v as Story).chapters.length > 0;
let seq = 0;
const nid = () => `c${Date.now().toString(36)}${seq++}`;

export default function StoryPage() {
  const [story, setStory] = usePersistentState<Story>('multiverse-story', DEFAULT_STORY, isStory);
  const [editing, setEditing] = useState(false);
  const [active, setActive] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });
  const n = story.chapters.length;
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(Math.min(n - 1, Math.floor(p * n * 0.9999))));

  const jumpTo = (i: number) => {
    const el = container.current;
    if (!el) return;
    const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / n);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const update = (id: string, patch: Partial<Chapter>) => setStory((s) => ({ ...s, chapters: s.chapters.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const move = (i: number, d: -1 | 1) => setStory((s) => {
    const c = [...s.chapters]; const j = i + d;
    if (j < 0 || j >= c.length) return s;
    [c[i], c[j]] = [c[j], c[i]];
    return { ...s, chapters: c };
  });

  return (
    <div>
      <div ref={container} className="relative" style={{ height: `${n * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-8">
          <Backdrop progress={scrollYProgress} />
          {story.chapters.map((c, i) => (
            <ChapterView key={c.id} chapter={c} index={i} total={n} progress={scrollYProgress} effect={story.effect} />
          ))}
          {/* Chapter rail */}
          <nav aria-label="Chapters" className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-3">
            {story.chapters.map((c, i) => (
              <button key={c.id} type="button" onClick={() => jumpTo(i)} aria-label={`Go to chapter ${i + 1}: ${c.title}`} aria-current={i === active ? 'step' : undefined} className="group flex items-center justify-end gap-3">
                <span className={cn('text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100', i === active && 'opacity-100')}>{c.kicker.split('—').pop()?.trim()}</span>
                <span className={cn('h-2 rounded-full transition-all', i === active ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/40')} />
              </button>
            ))}
          </nav>
          <ProgressBar progress={scrollYProgress} />
        </div>
      </div>

      <button type="button" onClick={() => setEditing(true)} className="fixed bottom-5 left-5 z-40 inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold shadow-lg hover:bg-muted">
        <Pencil size={15} /> Edit story
      </button>

      {editing && (
        <aside role="dialog" aria-label="Story editor" className="fixed inset-y-0 left-0 z-[60] flex w-[420px] flex-col border-r border-border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <p className="font-semibold">Story editor</p>
              <p className="text-xs text-muted-foreground">Changes save automatically and preview live.</p>
            </div>
            <button type="button" onClick={() => setEditing(false)} aria-label="Close editor" className="rounded-md p-1.5 hover:bg-muted"><X size={16} /></button>
          </div>
          <div className="border-b border-border px-5 py-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Transition</p>
            <div className="grid grid-cols-3 gap-1" role="radiogroup" aria-label="Transition">
              {(['rise', 'fade', 'scale'] as Effect[]).map((e) => (
                <button key={e} type="button" role="radio" aria-checked={story.effect === e} onClick={() => setStory((s) => ({ ...s, effect: e }))} className={cn('rounded-md border py-1.5 text-xs font-semibold capitalize', story.effect === e ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted')}>{e}</button>
              ))}
            </div>
          </div>
          <ol className="flex-1 space-y-3 overflow-y-auto p-5">
            {story.chapters.map((c, i) => (
              <li key={c.id} className="space-y-2 rounded-xl border border-border bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">Chapter {i + 1}</span>
                  <span className="flex gap-0.5">
                    <IconBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={13} /></IconBtn>
                    <IconBtn label="Move down" disabled={i === n - 1} onClick={() => move(i, 1)}><ArrowDown size={13} /></IconBtn>
                    <IconBtn label="Delete chapter" disabled={n === 1} onClick={() => setStory((s) => ({ ...s, chapters: s.chapters.filter((x) => x.id !== c.id) }))}><Trash2 size={13} /></IconBtn>
                  </span>
                </div>
                <input aria-label="Kicker" value={c.kicker} onChange={(e) => update(c.id, { kicker: e.target.value })} className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs" />
                <input aria-label="Title" value={c.title} onChange={(e) => update(c.id, { title: e.target.value })} className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm font-semibold" />
                <textarea aria-label="Body" value={c.body} onChange={(e) => update(c.id, { body: e.target.value })} className="min-h-[64px] w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
              </li>
            ))}
          </ol>
          <div className="grid grid-cols-2 gap-2 border-t border-border p-4">
            <button type="button" disabled={n >= 10} onClick={() => setStory((s) => ({ ...s, chapters: [...s.chapters, { id: nid(), kicker: `0${s.chapters.length + 1} — New chapter`, title: 'A new chapter', body: 'Describe this moment in the story.' }] }))} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted disabled:opacity-50">
              <Plus size={14} /> Add chapter
            </button>
            <button type="button" onClick={() => downloadFile('story.html', exportStory(story), 'text/html')} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
              <Download size={14} /> Export HTML
            </button>
            <button type="button" onClick={() => { if (window.confirm('Restore the example story?')) setStory(DEFAULT_STORY); }} className="col-span-2 text-xs font-semibold text-muted-foreground hover:text-foreground">Restore example</button>
          </div>
        </aside>
      )}
    </div>
  );
}

function IconBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30">{children}</button>;
}

function Backdrop({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 1], [1, 2.2]);
  const opacity = useTransform(progress, [0, 0.5, 1], [0.12, 0.22, 0.12]);
  return <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ scale, opacity, background: 'radial-gradient(circle at center, var(--primary) 0%, transparent 60%)' }} />;
}

function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  return <motion.div aria-hidden="true" className="absolute bottom-0 left-0 h-1 origin-left bg-primary" style={{ scaleX: progress, width: '100%' }} />;
}

function ChapterView({ chapter, index, total, progress, effect }: { chapter: Chapter; index: number; total: number; progress: MotionValue<number>; effect: Effect }) {
  const start = index / total;
  const end = (index + 1) / total;
  const fadeIn = index === 0 ? start : start + 0.25 / total;
  const fadeOut = index === total - 1 ? end : end - 0.25 / total;
  const range = [start, fadeIn, fadeOut, end];
  const opacity = useTransform(progress, range, [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0]);
  const y = useTransform(progress, range, effect === 'rise' ? [index === 0 ? 0 : 60, 0, 0, index === total - 1 ? 0 : -60] : [0, 0, 0, 0]);
  const scale = useTransform(progress, range, effect === 'scale' ? [index === 0 ? 1 : 0.92, 1, 1, index === total - 1 ? 1 : 1.06] : [1, 1, 1, 1]);
  const pointer = useTransform(opacity, (o) => (o > 0.5 ? 'auto' : 'none'));
  return (
    <motion.section style={{ opacity, y, scale, pointerEvents: pointer }} className="absolute max-w-4xl text-center" aria-label={chapter.title}>
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{chapter.kicker}</p>
      <h2 className="font-display text-7xl font-bold leading-[0.95] tracking-tight">{chapter.title}</h2>
      <p className="mx-auto mt-8 max-w-2xl text-2xl leading-relaxed text-muted-foreground">{chapter.body}</p>
    </motion.section>
  );
}

/** Standalone page using CSS scroll-driven animations, with an IntersectionObserver fallback. */
function exportStory(story: Story): string {
  const from = story.effect === 'rise' ? 'transform: translateY(60px);' : story.effect === 'scale' ? 'transform: scale(.92);' : '';
  const chapters = story.chapters.map((c) => `  <section class="chapter">
    <div class="inner">
      <p class="kicker">${escapeHtml(c.kicker)}</p>
      <h2>${escapeHtml(c.title)}</h2>
      <p class="body">${escapeHtml(c.body)}</p>
    </div>
  </section>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(story.chapters[0]?.title ?? 'Story')}</title>
<style>
  :root { --bg: #ffffff; --fg: #0a0a0a; --muted: #52525b; --accent: #111111; }
  * { box-sizing: border-box; } body { margin: 0; background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; }
  .chapter { min-height: 100vh; display: grid; place-items: center; padding: 10vh 24px; }
  .inner { max-width: 880px; text-align: center; }
  .kicker { font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); margin: 0 0 24px; }
  h2 { font-size: clamp(40px, 7vw, 80px); line-height: .95; letter-spacing: -.035em; margin: 0; }
  .body { font-size: clamp(18px, 2vw, 24px); line-height: 1.5; color: var(--muted); max-width: 640px; margin: 32px auto 0; }
  .progress { position: fixed; inset: auto 0 0 0; height: 4px; background: var(--accent); transform-origin: left; transform: scaleX(0); }
  @supports (animation-timeline: view()) {
    .inner { animation: reveal linear both; animation-timeline: view(); animation-range: entry 10% cover 40%; }
    .progress { animation: grow linear both; animation-timeline: scroll(root); }
  }
  @keyframes reveal { from { opacity: 0; ${from} } to { opacity: 1; transform: none; } }
  @keyframes grow { to { transform: scaleX(1); } }
  .no-sda .inner { opacity: 0; ${from} transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
  .no-sda .inner.in { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) { .inner, .progress { animation: none !important; opacity: 1 !important; transform: none !important; } }
</style>
</head>
<body>
<div class="progress" aria-hidden="true"></div>
<main>
${chapters}
</main>
<script>
  if (!CSS.supports('animation-timeline: view()')) {
    document.documentElement.classList.add('no-sda');
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: .3 });
    document.querySelectorAll('.inner').forEach((el) => io.observe(el));
  }
</script>
</body>
</html>
`;
}
