'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight, ArrowUpRight, Blocks, Check, ClipboardCheck, Command, FileCode2, Gauge, Lock,
  FileText, Palette, Rocket, ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { contrastRatio, wcagRating } from '@/lib/color';
import { useTheme, THEMES, type Theme } from '@/components/theme-provider';

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const EXPORT_TARGETS = ['HTML', 'React (TSX)', 'Tailwind v4', 'Tailwind v3', 'W3C Design Tokens', 'CSS Variables', 'SCSS', 'JSON Blueprint'];

const WORKFLOW = [
  { step: '01', title: 'Scope', body: 'Answer discovery questions and get a written brief, a sitemap and an effort estimate you can defend.', href: '/brief', cta: 'Start a brief', icon: FileText },
  { step: '02', title: 'Compose', body: 'Assemble the page from proven sections or start from a complete template. Reorder, edit and preview at real device widths.', href: '/builder', cta: 'Open the Builder', icon: Blocks },
  { step: '03', title: 'Define', body: 'Set color, type, radius and motion tokens. Every color pair is checked against WCAG 2.2 as you change it.', href: '/playground', cta: 'Open the Playground', icon: Palette },
  { step: '04', title: 'Ship', body: 'Export standalone HTML, a React component, Tailwind config or W3C tokens. Hand off a brief your team can act on.', href: '/launch-studio', cta: 'Open Launch Studio', icon: Rocket },
];

const GOALS = [
  { title: 'SaaS product', summary: 'Conversion-led structure: value proposition, proof, pricing and FAQ.', links: [{ label: 'SaaS template in Builder', href: '/builder?template=saas' }, { label: 'Design System', href: '/design-system' }, { label: 'Performance', href: '/performance' }] },
  { title: 'Agency or studio', summary: 'Narrative-led homepage that leads with outcomes and case studies.', links: [{ label: 'Design Story', href: '/story' }, { label: 'Motion Lab', href: '/motion-lab' }, { label: 'Theme Lab', href: '/theme-lab' }] },
  { title: 'Professional firm', summary: 'Authority and clarity: services, credentials and a direct path to contact.', links: [{ label: 'Launch Studio', href: '/launch-studio' }, { label: 'Accessibility', href: '/design-system/accessibility' }, { label: 'Components', href: '/components' }] },
  { title: 'Interactive campaign', summary: 'High-engagement experiences with motion that stays within budget.', links: [{ label: 'Interactions', href: '/interaction-playground' }, { label: 'Micro-interactions', href: '/micro-interactions' }, { label: 'Experimental', href: '/experimental' }] },
];

const UNIVERSE_INFO: Record<Theme, { name: string; tagline: string; bg: string; fg: string; primary: string; border: string; font: string }> = {
  minimal: { name: 'Minimal', tagline: 'Editorial restraint', bg: '#ffffff', fg: '#0a0a0a', primary: '#111111', border: '#e4e4e7', font: 'var(--font-geist), sans-serif' },
  glass: { name: 'Glass', tagline: 'Translucent depth', bg: '#0b1022', fg: '#f1f5f9', primary: '#c7d2fe', border: 'rgba(255,255,255,0.14)', font: 'var(--font-inter), sans-serif' },
  neon: { name: 'Neon', tagline: 'Luminous signal', bg: '#05070b', fg: '#e8fbff', primary: '#00e5ff', border: '#164a56', font: 'var(--font-space), sans-serif' },
  brutalist: { name: 'Brutalist', tagline: 'Raw structure', bg: '#f1efe8', fg: '#0a0a0a', primary: '#b02200', border: '#0a0a0a', font: 'var(--font-space), sans-serif' },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ExportStrip />
      <Workflow />
      <Bento />
      <Goals />
      <FinalCta />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Hero() {
  const { theme, setTheme } = useTheme();
  // While previewing, remember the universe the visitor had chosen so leaving restores it.
  const [origin, setOrigin] = useState<Theme | null>(null);
  const [previewing, setPreviewing] = useState<Theme | null>(null);
  const committed = origin ?? theme;

  const preview = (t: Theme) => { if (origin === null) setOrigin(theme); setPreviewing(t); setTheme(t); };
  const endPreview = () => { if (origin !== null) setTheme(origin); setOrigin(null); setPreviewing(null); };
  const commit = (t: Theme) => { setOrigin(null); setPreviewing(null); setTheme(t); };

  return (
    <section className="relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-8 pb-24 pt-10 text-center">
      <motion.p {...reveal} className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Website planning workspace
      </motion.p>

      <motion.h1
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.05 }}
        className="font-display text-[clamp(4rem,9vw,8.5rem)] font-bold leading-[0.92] tracking-tight"
      >
        Websites,<br />planned properly.
      </motion.h1>

      <motion.p {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
        Compose the page, set the design tokens, verify accessibility and export production code — before a line of it is written.
      </motion.p>

      <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }} className="mt-10 flex items-center gap-3">
        <Link href="/builder" className="home-cta-primary group inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground">
          Open the Builder <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link href="/playground" className="inline-flex h-12 items-center rounded-xl border border-border px-6 text-[15px] font-semibold text-foreground transition-colors hover:bg-muted">
          Define design tokens
        </Link>
      </motion.div>

      {/* Universe strip — hover to preview the whole page, click to keep */}
      <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.22 }} className="mt-20">
        <div
          role="radiogroup"
          aria-label="Preview this page in another universe"
          onMouseLeave={endPreview}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) endPreview(); }}
          className="hero-strip inline-flex items-center gap-1 rounded-2xl border border-border p-1.5"
        >
          {THEMES.map((t) => {
            const u = UNIVERSE_INFO[t];
            const active = (previewing ?? theme) === t;
            const kept = committed === t;
            return (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={kept}
                onMouseEnter={() => preview(t)}
                onFocus={() => preview(t)}
                onClick={() => commit(t)}
                className={cn('hero-strip-item relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors', active ? 'text-foreground' : 'text-muted-foreground')}
              >
                {active && (
                  <motion.span layoutId="hero-strip-active" className="absolute inset-0 rounded-xl bg-muted" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
                )}
                <span className="relative h-3.5 w-3.5 rounded-full" style={{ background: `linear-gradient(135deg, ${u.bg} 0 50%, ${u.primary} 50% 100%)`, boxShadow: `0 0 0 1px ${u.border}` }} aria-hidden="true" />
                <span className="relative">{u.name}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {previewing && previewing !== committed
            ? `Previewing ${UNIVERSE_INFO[previewing].name} — ${UNIVERSE_INFO[previewing].tagline.toLowerCase()}. Click to keep it.`
            : 'Hover a universe to preview this page in it. Click to keep it.'}
        </p>
      </motion.div>
    </section>
  );
}

function ExportStrip() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-8 py-6">
        <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Exports to</p>
        <ul className="flex flex-wrap gap-x-7 gap-y-2">
          {EXPORT_TARGETS.map((t) => (
            <li key={t} className="font-mono text-sm font-medium text-foreground">{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <motion.div {...reveal} className="mb-12 max-w-2xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
      <h2 className="font-display text-5xl font-bold tracking-tight">{title}</h2>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  );
}

function Workflow() {
  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-28">
      <SectionHeader
        eyebrow="How it works"
        title="Decide early. Build once."
        body="Most rework comes from decisions made in code. The Multiverse moves structure, identity and accessibility to the start of the project, where they are cheap to change."
      />
      <div className="grid grid-cols-4 gap-5">
        {WORKFLOW.map((w, i) => (
          <motion.div key={w.step} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }}>
            <Link href={w.href} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7">
              <div className="mb-10 flex items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">{w.step}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted text-foreground"><w.icon size={18} /></span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">{w.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{w.body}</p>
              <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                {w.cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Bento() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-8 py-28">
        <SectionHeader
          eyebrow="The workspace"
          title="Professional tools, not mockups."
          body="Everything here produces something you can use: files, tokens, checklists and briefs."
        />
        <div className="grid grid-cols-6 gap-5">
          <motion.div {...reveal} className="col-span-4">
            <BentoCard href="/builder" icon={Blocks} title="UI Builder" body="19 section types and three complete templates. Drag to reorder, undo anything, preview at desktop, tablet and phone widths, then export.">
              <div className="mt-6 grid grid-cols-4 gap-2">
                {['Navigation', 'Hero', 'Logo cloud', 'Feature grid', 'Stats', 'Testimonial', 'Pricing', 'FAQ'].map((s) => (
                  <span key={s} className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium">{s}</span>
                ))}
              </div>
            </BentoCard>
          </motion.div>
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.05 }} className="col-span-2">
            <ContrastWidget />
          </motion.div>
          <motion.div {...reveal} className="col-span-2">
            <UniverseWidget />
          </motion.div>
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.05 }} className="col-span-2">
            <BentoCard href="/launch-studio" icon={ClipboardCheck} title="Launch checks" body="Route strategy, KPIs and a readiness checklist that persists between sessions.">
              <ul className="mt-5 space-y-2 text-sm">
                {['Value proposition above the fold', 'Primary CTA visible', 'Contrast passes WCAG AA'].map((c) => (
                  <li key={c} className="flex items-center gap-2"><Check size={15} className="text-foreground" /> {c}</li>
                ))}
              </ul>
            </BentoCard>
          </motion.div>
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="col-span-2">
            <CommandWidget />
          </motion.div>
          <motion.div {...reveal} className="col-span-6">
            <BentoCard href="/performance" icon={Gauge} title="Performance, made visible" body="Every motion and rendering pattern in the labs shows its cost, so you choose effects your users' devices can afford." horizontal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BentoCard({ href, icon: Icon, title, body, children, horizontal }: { href: string; icon: LucideIcon; title: string; body: string; children?: React.ReactNode; horizontal?: boolean }) {
  return (
    <Link href={href} className={cn('group flex h-full rounded-2xl border border-border bg-card p-7', horizontal ? 'items-center justify-between gap-10' : 'flex-col')}>
      <div className={cn(horizontal && 'flex items-center gap-5')}>
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted text-foreground', !horizontal && 'mb-5')}><Icon size={18} /></span>
        <div>
          <h3 className="flex items-center gap-1.5 text-xl font-semibold tracking-tight">
            {title} <ArrowUpRight size={16} className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
        </div>
      </div>
      {children}
    </Link>
  );
}

function ContrastWidget() {
  const [fg, setFg] = useState('#4f46e5');
  const bg = '#ffffff';
  const ratio = contrastRatio(fg, bg) ?? 1;
  const rating = wcagRating(ratio);
  const swatches = ['#4f46e5', '#0f766e', '#f59e0b', '#94a3b8', '#b02200'];
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7">
      <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted text-foreground"><ShieldCheck size={18} /></span>
      <h3 className="text-xl font-semibold tracking-tight">Live contrast audit</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Pick a text color. The rating updates instantly.</p>
      <div className="mt-5 rounded-xl border border-border p-4" style={{ background: bg }}>
        <p className="text-lg font-semibold" style={{ color: fg }}>Readable text</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-xs" style={{ color: '#3f3f46' }}>{ratio.toFixed(2)} : 1</span>
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-bold"
            style={rating === 'Fail' ? { background: '#fee2e2', color: '#991b1b' } : rating === 'AA Large' ? { background: '#fef3c7', color: '#92400e' } : { background: '#dcfce7', color: '#166534' }}
          >
            {rating}
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-2" role="radiogroup" aria-label="Text color">
        {swatches.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={fg === c}
            aria-label={c}
            onClick={() => setFg(c)}
            className={cn('h-7 w-7 rounded-full ring-offset-2 ring-offset-card', fg === c ? 'ring-2 ring-foreground' : 'ring-1 ring-border')}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}

function UniverseWidget() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7">
      <h3 className="text-xl font-semibold tracking-tight">Four universes</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Complete visual systems. Switch this page now.</p>
      <div className="mt-5 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Universe">
        {THEMES.map((t) => {
          const u = UNIVERSE_INFO[t];
          const active = theme === t;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setTheme(t)}
              className={cn('flex flex-col items-start rounded-xl p-3 text-left transition-transform hover:-translate-y-0.5', active ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card' : '')}
              style={{ background: u.bg, color: u.fg, border: `1px solid ${u.border}` }}
            >
              <span className="text-lg leading-none" style={{ fontFamily: u.font, fontWeight: 700 }}>Aa</span>
              <span className="mt-2 text-xs font-semibold">{u.name}</span>
              <span className="mt-1.5 h-1 w-8 rounded-full" style={{ background: u.primary }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CommandWidget() {
  const open = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  return (
    <button type="button" onClick={open} className="group flex h-full w-full flex-col rounded-2xl border border-border bg-card p-7 text-left">
      <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted text-foreground"><Command size={18} /></span>
      <h3 className="text-xl font-semibold tracking-tight">Keyboard first</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Reach any tool, page or universe from anywhere.</p>
      <span className="mt-auto flex items-center gap-2 pt-6">
        <kbd className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs">Ctrl</kbd>
        <kbd className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs">K</kbd>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Try it</span>
      </span>
    </button>
  );
}

function Goals() {
  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-28">
      <SectionHeader
        eyebrow="Start by goal"
        title="A path for every project."
        body="Choose the closest match. Each path links the references and tools that matter most for it."
      />
      <div className="grid grid-cols-4 gap-5">
        {GOALS.map((g, i) => (
          <motion.div key={g.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold tracking-tight">{g.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{g.summary}</p>
            <ul className="mt-6 space-y-1 border-t border-border pt-4">
              {g.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted">
                    {l.label}
                    <ArrowRight size={14} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-8 pb-12">
      <motion.div {...reveal} className="mx-auto flex max-w-7xl items-center justify-between gap-10 rounded-3xl border border-border bg-card px-12 py-14">
        <div>
          <h2 className="font-display text-5xl font-bold tracking-tight">Start your next website here.</h2>
          <p className="mt-3 text-lg text-muted-foreground">Free and private. Your work is saved in this browser and exports whenever you are ready.</p>
        </div>
        <Link href="/builder" className="home-cta-primary group inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground">
          Open the Builder <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </section>
  );
}
