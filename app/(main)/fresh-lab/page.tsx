'use client';

import React, { useMemo, useState } from 'react';
import { Reorder } from 'motion/react';
import { AlertTriangle, CheckCircle2, GripVertical, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersistentState } from '@/lib/hooks/use-persistent-state';
import { analyzeCta, analyzeHeadline, easeLabel, readability } from '@/lib/copy-analysis';
import { CopyButton } from '@/components/docs/doc-blocks';
import { LabIndex } from '@/components/lab/workbench';

const SECTIONS = [
  { id: 'headline', label: 'Headline analyzer' },
  { id: 'readability', label: 'Readability' },
  { id: 'value', label: 'Value proposition' },
  { id: 'cta', label: 'Call-to-action check' },
  { id: 'narrative', label: 'Page narrative' },
];

const input = 'w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30';

export default function CopyLabPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10">
      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Copy Lab</p>
        <h1 className="font-display text-6xl font-bold tracking-tight">Words decide whether a page works.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Test headlines, body copy and calls to action before they reach a designer. Every check runs locally and updates as you type.
        </p>
      </header>
      <div className="mb-10"><LabIndex items={SECTIONS} /></div>
      <div className="space-y-10">
        <HeadlineAnalyzer />
        <ReadabilityChecker />
        <ValueProposition />
        <CtaChecker />
        <NarrativePlanner />
      </div>
    </div>
  );
}

function Panel({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-card">
      <header className="border-b border-border px-6 py-5">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

function Issue({ level, children }: { level: 'good' | 'warn' | 'bad'; children: React.ReactNode }) {
  const Icon = level === 'good' ? CheckCircle2 : level === 'warn' ? AlertTriangle : XCircle;
  return (
    <li className="flex gap-2 text-sm">
      <Icon size={16} className={cn('mt-0.5 shrink-0', level === 'good' ? 'text-success' : level === 'warn' ? 'text-warning' : 'text-destructive')} />
      <span>{children}</span>
    </li>
  );
}

/* ---------------------------------------------------------------------------- */

function HeadlineAnalyzer() {
  const [text, setText] = usePersistentState('copylab-headline', 'Seamless, innovative solutions that empower your team');
  const r = useMemo(() => analyzeHeadline(text), [text]);
  return (
    <Panel id="headline" title="Headline analyzer" description="Length, reading level, vague language and specificity — plus a live preview of how the headline wraps at real hero sizes.">
      <div className="grid grid-cols-[1fr_260px] gap-6">
        <div className="space-y-5">
          <input aria-label="Headline" value={text} onChange={(e) => setText(e.target.value.slice(0, 160))} className={cn(input, 'h-12 text-base')} />
          <ul className="space-y-2">{r.issues.map((i, k) => <Issue key={k} level={i.level}>{i.message}</Issue>)}</ul>
          <div className="space-y-3 rounded-xl border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Wrap preview</p>
            {[{ label: 'Desktop hero · 72px', size: 72, width: 860 }, { label: 'Laptop hero · 56px', size: 56, width: 640 }, { label: 'Mobile hero · 36px', size: 36, width: 340 }].map((p) => (
              <div key={p.label}>
                <p className="mb-1.5 font-mono text-[10px] text-muted-foreground">{p.label} · {p.width}px column · shown at 50%</p>
                {/* Every dimension is halved together, so line breaks match the real size exactly. */}
                <p className="border-l-2 border-border pl-3 font-display font-bold leading-[1.05] tracking-tight" style={{ width: p.width / 2, fontSize: p.size / 2 }}>{text || '—'}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-background p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Score</p>
            <p className={cn('mt-1 font-display text-6xl font-bold tabular-nums', r.score >= 80 ? 'text-success' : r.score >= 55 ? 'text-warning' : 'text-destructive')}>{r.score}</p>
          </div>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {[['Words', r.words], ['Characters', r.characters], ['Grade', r.grade.toFixed(1)], ['Vague words', r.vague.length]].map(([k, v]) => (
              <div key={k as string} className="rounded-lg border border-border bg-background p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-mono font-semibold">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------------------------- */

function ReadabilityChecker() {
  const [text, setText] = usePersistentState('copylab-body', 'Our platform has been designed to be leveraged by organizations of all sizes that are looking to optimize the way in which their teams are able to collaborate on projects across multiple departments and time zones. Setup takes minutes. Your data stays private.');
  const r = useMemo(() => readability(text), [text]);
  const longSet = new Set(r.longSentences);
  const passiveSet = new Set(r.passive);
  return (
    <Panel id="readability" title="Readability" description="Flesch reading ease, grade level, sentence length and passive voice. Long sentences and passive constructions are highlighted in place.">
      <div className="grid grid-cols-[1fr_260px] gap-6">
        <div className="space-y-4">
          <textarea aria-label="Body copy" value={text} onChange={(e) => setText(e.target.value.slice(0, 6000))} className={cn(input, 'min-h-[140px] py-3 leading-relaxed')} />
          <div className="rounded-xl border border-border bg-background p-5 text-sm leading-relaxed">
            {text.split(/(?<=[.!?])\s+/).map((s, i) => (
              <span key={i} className={cn(longSet.has(s.trim()) && 'bg-warning/20 underline decoration-warning decoration-2 underline-offset-4', passiveSet.has(s.trim()) && 'italic')}>{s} </span>
            ))}
            <p className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <span><span className="bg-warning/20 px-1 underline decoration-warning">Highlighted</span> over 25 words</span>
              <span><em>Italic</em> likely passive voice</span>
            </p>
          </div>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="rounded-xl border border-border bg-background p-5 text-center">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Reading ease</dt>
            <dd className={cn('mt-1 font-display text-5xl font-bold tabular-nums', r.fleschEase >= 60 ? 'text-success' : r.fleschEase >= 40 ? 'text-warning' : 'text-destructive')}>{Math.round(r.fleschEase)}</dd>
            <dd className="text-xs text-muted-foreground">{easeLabel(r.fleschEase)} · target 60+</dd>
          </div>
          {[['Grade level', r.grade.toFixed(1)], ['Words', r.words], ['Avg. sentence', `${r.avgSentence.toFixed(1)} words`], ['Long sentences', r.longSentences.length], ['Passive voice', r.passive.length], ['Reading time', `${Math.max(1, r.readingTimeSec)}s`]].map(([k, v]) => (
            <div key={k as string} className="flex justify-between rounded-lg border border-border bg-background px-3 py-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-mono font-semibold">{v}</dd></div>
          ))}
        </dl>
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------------------------- */

interface VP { audience: string; need: string; product: string; category: string; benefit: string; alternative: string; difference: string; proof: string }
const isVP = (v: unknown): v is VP => !!v && typeof v === 'object' && typeof (v as VP).audience === 'string';

function ValueProposition() {
  const [vp, setVp] = usePersistentState<VP>('copylab-vp', {
    audience: 'operations leads at growing logistics companies', need: 'lose hours every week to manual dispatching', product: 'Routewise',
    category: 'dispatch platform', benefit: 'plans every route automatically in seconds', alternative: 'spreadsheets and phone calls',
    difference: 'learn from every delivery to cut miles driven', proof: '18% fewer miles in the first month',
  }, isVP);
  const set = (k: keyof VP) => (e: React.ChangeEvent<HTMLInputElement>) => setVp((v) => ({ ...v, [k]: e.target.value }));
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const statement = `For ${vp.audience} who ${vp.need}, ${vp.product} is a ${vp.category} that ${vp.benefit}. Unlike ${vp.alternative}, we ${vp.difference}.`;
  const headlines = [
    `${cap(vp.benefit.replace(/^(\w+)s\b/, '$1'))}.`,
    `Stop ${vp.alternative.split(' and ')[0]}. Start ${vp.product}.`,
    `The ${vp.category} for ${vp.audience.split(' at ')[0]}.`,
    vp.proof ? `${cap(vp.proof)}.` : '',
  ].filter(Boolean);
  const sub = `${vp.product} ${vp.benefit} — so ${vp.audience.split(' at ')[0]} no longer ${vp.need.replace(/^(lose|spend|waste)\b/, (m) => m)}.`;
  const ctas = [`Try ${vp.product} free`, 'See it plan a route', 'Book a 20-minute demo'];

  const fields: Array<[keyof VP, string]> = [
    ['audience', 'For (target customer)'], ['need', 'Who (problem or need)'], ['product', 'Product name'], ['category', 'Is a (category)'],
    ['benefit', 'That (key benefit)'], ['alternative', 'Unlike (current alternative)'], ['difference', 'We (differentiator)'], ['proof', 'Proof point'],
  ];

  return (
    <Panel id="value" title="Value proposition builder" description="Complete the positioning statement. The builder drafts hero headlines, a subheadline and calls to action you can refine.">
      <div className="grid grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-3">
          {fields.map(([k, label]) => (
            <label key={k} className={cn('space-y-1 text-xs font-semibold text-muted-foreground', (k === 'audience' || k === 'benefit' || k === 'difference') && 'col-span-2')}>
              {label}
              <input value={vp[k]} onChange={set(k)} className={cn(input, 'h-10 font-normal')} />
            </label>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-5">
            <div className="mb-2 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Positioning statement</p><CopyButton value={statement} /></div>
            <p className="text-sm leading-relaxed">{statement}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Headline options</p>
            <ul className="space-y-2">
              {headlines.map((h) => {
                const score = analyzeHeadline(h).score;
                return (
                  <li key={h} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                    <span className="font-display text-lg font-semibold tracking-tight">{h}</span>
                    <span className="flex shrink-0 items-center gap-1"><span className="font-mono text-xs text-muted-foreground">{score}</span><CopyButton value={h} label="" /></span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Subheadline</p>
            <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Calls to action</p>
            <div className="mt-2 flex flex-wrap gap-2">{ctas.map((c, i) => <span key={c} className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold', i === 0 ? 'bg-primary text-primary-foreground' : 'border border-border')}>{c}</span>)}</div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------------------------- */

function CtaChecker() {
  const [labels, setLabels] = usePersistentState('copylab-ctas', ['Submit', 'Learn more', 'Start free trial', 'Get my free website audit', 'Click here to download our comprehensive guide']);
  return (
    <Panel id="cta" title="Call-to-action check" description="Buttons should name the outcome. Edit any label to re-check it; weak labels get a suggested rewrite.">
      <ul className="space-y-2">
        {labels.map((l, i) => {
          const a = analyzeCta(l);
          return (
            <li key={i} className="grid grid-cols-[260px_auto_1fr] items-center gap-4 rounded-xl border border-border bg-background p-3">
              <input aria-label={`Call to action ${i + 1}`} value={l} onChange={(e) => setLabels(labels.map((x, j) => (j === i ? e.target.value : x)))} className={cn(input, 'h-10 font-semibold')} />
              <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide', a.level === 'good' ? 'bg-success text-white' : a.level === 'warn' ? 'bg-warning text-white' : 'bg-destructive text-white')}>{a.level === 'good' ? 'Strong' : a.level === 'warn' ? 'Review' : 'Weak'}</span>
              <span className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{a.message}</span>
                {a.suggestion && (
                  <button type="button" onClick={() => setLabels(labels.map((x, j) => (j === i ? a.suggestion! : x)))} className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs font-semibold hover:bg-muted">Use “{a.suggestion}”</button>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* ---------------------------------------------------------------------------- */

const NARRATIVE = [
  { id: 'hook', name: 'Hook', role: 'One clear promise in the first viewport', section: 'Hero' },
  { id: 'proof1', name: 'Early proof', role: 'Logos or a number that makes the promise believable', section: 'Logo cloud / Stats' },
  { id: 'problem', name: 'Problem', role: 'Name the pain in the customer’s words', section: 'Text block' },
  { id: 'how', name: 'How it works', role: 'Three steps or capabilities, outcome first', section: 'Feature grid / Timeline' },
  { id: 'proof2', name: 'Deep proof', role: 'A testimonial or case study with a result', section: 'Testimonial' },
  { id: 'offer', name: 'Offer', role: 'Plans and what is included', section: 'Pricing / Comparison' },
  { id: 'objections', name: 'Objections', role: 'Answer the questions that stop a purchase', section: 'FAQ' },
  { id: 'action', name: 'Action', role: 'Repeat the single primary call to action', section: 'Call to action' },
];
const isOrder = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string' && NARRATIVE.some((n) => n.id === x));

function NarrativePlanner() {
  const [order, setOrder] = usePersistentState<string[]>('copylab-narrative', NARRATIVE.map((n) => n.id), isOrder);
  const items = order.map((id) => NARRATIVE.find((n) => n.id === id)!).filter(Boolean);
  const warnings: string[] = [];
  if (order[0] !== 'hook') warnings.push('The page should open with the hook — visitors decide in seconds.');
  if (order.indexOf('offer') < order.indexOf('how')) warnings.push('Pricing appears before visitors understand how it works.');
  if (order[order.length - 1] !== 'action') warnings.push('End with the call to action so the next step is obvious.');
  if (order.indexOf('proof1') > 3) warnings.push('Move early proof closer to the top to support the hook.');
  const outline = items.map((n, i) => `${i + 1}. **${n.name}** — ${n.role} _(${n.section})_`).join('\n');

  return (
    <Panel id="narrative" title="Page narrative" description="Drag to sequence the story of a landing page. The planner flags orders that usually hurt conversion, and exports the outline.">
      <div className="grid grid-cols-[1fr_300px] gap-6">
        <Reorder.Group axis="y" values={order} onReorder={setOrder} className="space-y-2">
          {items.map((n, i) => (
            <Reorder.Item key={n.id} value={n.id} className="flex cursor-grab items-center gap-4 rounded-xl border border-border bg-background px-4 py-3 active:cursor-grabbing" whileDrag={{ scale: 1.02 }}>
              <GripVertical size={16} className="text-muted-foreground" />
              <span className="w-6 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
              <span className="w-32 text-sm font-semibold">{n.name}</span>
              <span className="flex-1 text-sm text-muted-foreground">{n.role}</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{n.section}</span>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Review</p>
            <ul className="space-y-2">
              {warnings.length ? warnings.map((w) => <Issue key={w} level="warn">{w}</Issue>) : <Issue level="good">Strong sequence: hook, proof, explanation, offer, action.</Issue>}
            </ul>
          </div>
          <div className="flex gap-2">
            <CopyButton value={outline} label="Copy outline" className="flex-1 justify-center border border-border py-2" />
            <button type="button" onClick={() => setOrder(NARRATIVE.map((n) => n.id))} className="rounded-md border border-border px-3 text-xs font-semibold hover:bg-muted">Reset</button>
          </div>
        </div>
      </div>
    </Panel>
  );
}
