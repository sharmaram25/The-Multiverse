'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ClipboardCopy, Download, Plus, RotateCcw, Rocket, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLAYBOOKS, type PlaybookId } from '@/lib/builder/templates';
import { usePersistentState } from '@/lib/hooks/use-persistent-state';
import { copyText, downloadFile } from '@/lib/browser';

interface RouteItem { id: string; path: string; purpose: string }
interface Plan { goal: PlaybookId; routes: RouteItem[]; kpis: string[]; checked: string[]; projectName: string }

const ROUTE_PURPOSE: Record<string, string> = {
  '/': 'Value proposition and primary conversion path',
  '/features': 'Capabilities mapped to customer outcomes',
  '/pricing': 'Plans, comparison and objection handling',
  '/docs': 'Self-serve onboarding and reference',
  '/contact': 'Lead capture and support routing',
  '/work': 'Case studies with measurable results',
  '/services': 'Offerings explained in plain language',
  '/process': 'How engagements run, step by step',
  '/industries': 'Sector-specific expertise and proof',
  '/team': 'People, credentials and accountability',
  '/insights': 'Thought leadership and SEO content',
  '/shop': 'Catalogue browsing and filtering',
  '/product/[slug]': 'Product detail, reviews and add-to-cart',
  '/cart': 'Order review and checkout entry',
  '/faq': 'Pre-purchase questions and policies',
  '/projects': 'Selected work with context',
  '/about': 'Background, approach and values',
};

const CHECKLIST: Array<{ category: string; items: Array<{ id: string; label: string; why: string }> }> = [
  { category: 'Content', items: [
    { id: 'c-value', label: 'Value proposition is understandable in five seconds', why: 'Visitors decide to stay or leave almost immediately.' },
    { id: 'c-cta', label: 'One primary call to action per page', why: 'Competing actions reduce conversion.' },
    { id: 'c-proof', label: 'Proof appears near every major claim', why: 'Testimonials, data and logos make claims credible.' },
    { id: 'c-copy', label: 'Copy reviewed for clarity and tone', why: 'Jargon and typos erode trust.' },
  ] },
  { category: 'Accessibility', items: [
    { id: 'a-contrast', label: 'All text meets WCAG AA contrast (4.5:1)', why: 'Required for legal compliance in many regions.' },
    { id: 'a-keyboard', label: 'Every interaction works with the keyboard', why: 'Keyboard and switch users cannot use a mouse.' },
    { id: 'a-alt', label: 'Meaningful images have alt text', why: 'Screen readers announce images by their alt text.' },
    { id: 'a-headings', label: 'One h1 per page and a logical heading order', why: 'Headings are the primary navigation for screen-reader users.' },
  ] },
  { category: 'Performance', items: [
    { id: 'p-lcp', label: 'Largest Contentful Paint under 2.5s on 4G', why: 'Core Web Vital that affects search ranking.' },
    { id: 'p-cls', label: 'Cumulative Layout Shift under 0.1', why: 'Layout jumps cause mis-taps and frustration.' },
    { id: 'p-images', label: 'Images sized correctly and served as AVIF/WebP', why: 'Images are usually the heaviest assets on a page.' },
    { id: 'p-motion', label: 'Animations use transform/opacity and respect reduced motion', why: 'Keeps motion smooth and accessible.' },
  ] },
  { category: 'SEO', items: [
    { id: 's-meta', label: 'Unique title and meta description per page', why: 'Controls how pages appear in search results.' },
    { id: 's-og', label: 'Open Graph image and tags set', why: 'Controls how links render when shared.' },
    { id: 's-sitemap', label: 'sitemap.xml and robots.txt published', why: 'Helps search engines discover every page.' },
  ] },
  { category: 'Legal & operations', items: [
    { id: 'l-privacy', label: 'Privacy policy and cookie consent in place', why: 'Required under GDPR, CCPA and similar laws.' },
    { id: 'l-analytics', label: 'Analytics and conversion events verified', why: 'You cannot improve what you do not measure.' },
    { id: 'l-forms', label: 'Forms tested end-to-end, including error states', why: 'Broken forms lose leads silently.' },
  ] },
];
const ALL_ITEM_IDS = CHECKLIST.flatMap((c) => c.items.map((i) => i.id));

let uid = 0;
const rid = () => `r${Date.now().toString(36)}${(uid++).toString(36)}`;

function planFor(goal: PlaybookId, keep?: Partial<Plan>): Plan {
  const pb = PLAYBOOKS.find((p) => p.id === goal) ?? PLAYBOOKS[0];
  return {
    goal,
    routes: pb.routes.map((path) => ({ id: rid(), path, purpose: ROUTE_PURPOSE[path] ?? '' })),
    kpis: [...pb.kpis],
    checked: keep?.checked ?? [],
    projectName: keep?.projectName ?? 'New website',
  };
}

const isPlan = (v: unknown): v is Plan =>
  !!v && typeof v === 'object' && Array.isArray((v as Plan).routes) && Array.isArray((v as Plan).kpis) && Array.isArray((v as Plan).checked) && PLAYBOOKS.some((p) => p.id === (v as Plan).goal);

export default function LaunchStudioPage() {
  const [plan, setPlan] = usePersistentState<Plan>('multiverse-launch-plan', planFor('saas'), isPlan);
  const [flash, setFlash] = useState<string | null>(null);
  const [newKpi, setNewKpi] = useState('');
  const playbook = PLAYBOOKS.find((p) => p.id === plan.goal) ?? PLAYBOOKS[0];

  const score = Math.round((plan.checked.filter((id) => ALL_ITEM_IDS.includes(id)).length / ALL_ITEM_IDS.length) * 100);
  const signal = (key: string) => { setFlash(key); setTimeout(() => setFlash((c) => (c === key ? null : c)), 1600); };

  const update = (patch: Partial<Plan>) => setPlan((p) => ({ ...p, ...patch }));
  const toggle = (id: string) => setPlan((p) => ({ ...p, checked: p.checked.includes(id) ? p.checked.filter((x) => x !== id) : [...p.checked, id] }));

  const markdown = useMemo(() => {
    const lines = [
      `# ${plan.projectName} — Launch Plan`, '',
      `- **Project type:** ${playbook.label}`,
      `- **Focus:** ${playbook.focus}`,
      `- **Readiness:** ${score}%`, '',
      '## Routes', ...plan.routes.map((r) => `- \`${r.path}\`${r.purpose ? ` — ${r.purpose}` : ''}`), '',
      '## KPIs', ...plan.kpis.map((k) => `- ${k}`), '',
      '## Launch checklist',
    ];
    CHECKLIST.forEach((c) => {
      lines.push('', `### ${c.category}`);
      c.items.forEach((i) => lines.push(`- [${plan.checked.includes(i.id) ? 'x' : ' '}] ${i.label}`));
    });
    return lines.join('\n') + '\n';
  }, [plan, playbook, score]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-8 py-10">
      {/* Header */}
      <section className="flex items-end justify-between gap-8 rounded-2xl border border-border bg-card p-8">
        <div className="min-w-0">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"><Rocket size={14} /> Launch Studio</p>
          <input
            aria-label="Project name"
            value={plan.projectName}
            onChange={(e) => update({ projectName: e.target.value.slice(0, 80) })}
            className="w-full bg-transparent font-display text-5xl font-bold tracking-tight outline-none focus:underline decoration-border underline-offset-8"
          />
          <p className="mt-3 max-w-2xl text-muted-foreground">Plan routes and success metrics, then work through the launch checklist. Your plan is saved in this browser.</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Readiness</p>
          <p className="font-display text-6xl font-bold tabular-nums">{score}%</p>
          <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${score}%` }} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-[1fr_1.25fr] gap-6">
        {/* Strategy */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">1. Project type</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sets recommended routes and KPIs. Your checklist progress is kept.</p>
            <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Project type">
              {PLAYBOOKS.map((pb) => (
                <button
                  key={pb.id}
                  type="button"
                  role="radio"
                  aria-checked={plan.goal === pb.id}
                  onClick={() => {
                    if (pb.id === plan.goal) return;
                    if (window.confirm(`Switch to ${pb.label}? Routes and KPIs will be replaced with its recommendations.`)) setPlan((p) => planFor(pb.id, p));
                  }}
                  className={cn('rounded-xl border p-3 text-left transition-colors', plan.goal === pb.id ? 'border-foreground bg-muted' : 'border-border hover:bg-muted')}
                >
                  <span className="block text-sm font-semibold">{pb.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{pb.focus}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">2. Route plan</h2>
              <button type="button" onClick={() => update({ routes: [...plan.routes, { id: rid(), path: '/new-page', purpose: '' }] })} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:bg-muted">
                <Plus size={13} /> Add route
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {plan.routes.map((r, i) => (
                <li key={r.id} className="group grid grid-cols-[150px_1fr_auto] items-center gap-2">
                  <input
                    aria-label={`Route ${i + 1} path`}
                    value={r.path}
                    onChange={(e) => update({ routes: plan.routes.map((x) => (x.id === r.id ? { ...x, path: e.target.value } : x)) })}
                    className="h-9 rounded-lg border border-border bg-background px-2.5 font-mono text-xs outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    aria-label={`Route ${i + 1} purpose`}
                    value={r.purpose}
                    placeholder="What this page must achieve"
                    onChange={(e) => update({ routes: plan.routes.map((x) => (x.id === r.id ? { ...x, purpose: e.target.value } : x)) })}
                    className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button type="button" aria-label={`Remove ${r.path}`} onClick={() => update({ routes: plan.routes.filter((x) => x.id !== r.id) })} className="rounded-md p-2 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">3. Success metrics</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {plan.kpis.map((k) => (
                <li key={k} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background py-1 pl-3 pr-1 text-sm">
                  {k}
                  <button type="button" aria-label={`Remove ${k}`} onClick={() => update({ kpis: plan.kpis.filter((x) => x !== k) })} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><Trash2 size={12} /></button>
                </li>
              ))}
            </ul>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const v = newKpi.trim();
                if (v && !plan.kpis.includes(v)) update({ kpis: [...plan.kpis, v.slice(0, 60)] });
                setNewKpi('');
              }}
            >
              <input value={newKpi} onChange={(e) => setNewKpi(e.target.value)} placeholder="Add a metric, e.g. Demo requests per week" aria-label="New metric" className="h-9 flex-1 rounded-lg border border-border bg-background px-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              <button type="submit" className="rounded-lg border border-border px-3 text-sm font-semibold hover:bg-muted">Add</button>
            </form>
          </section>
        </div>

        {/* Checklist */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">4. Launch checklist</h2>
            <button type="button" onClick={() => { if (window.confirm('Clear all checklist progress?')) update({ checked: [] }); }} className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <div className="mt-4 space-y-6">
            {CHECKLIST.map((cat) => {
              const done = cat.items.filter((i) => plan.checked.includes(i.id)).length;
              return (
                <div key={cat.category}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{cat.category}</h3>
                    <span className="font-mono text-xs text-muted-foreground">{done}/{cat.items.length}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {cat.items.map((item) => {
                      const checked = plan.checked.includes(item.id);
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={checked}
                            onClick={() => toggle(item.id)}
                            className={cn('flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors', checked ? 'border-border bg-muted' : 'border-border hover:bg-muted/60')}
                          >
                            <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border', checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background')}>
                              {checked && <Check size={13} strokeWidth={3} />}
                            </span>
                            <span>
                              <span className={cn('block text-sm font-medium', checked && 'line-through decoration-muted-foreground/60')}>{item.label}</span>
                              <span className="mt-0.5 block text-xs text-muted-foreground">{item.why}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Actions */}
      <section className="flex items-center justify-between gap-6 rounded-2xl border border-border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold">Hand off the plan</h2>
          <p className="text-sm text-muted-foreground">Export as Markdown for your docs or tickets, or open the matching playbook in the Builder.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={async () => { if (await copyText(markdown)) signal('copy'); }} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted">
            {flash === 'copy' ? <Check size={15} /> : <ClipboardCopy size={15} />} {flash === 'copy' ? 'Copied' : 'Copy Markdown'}
          </button>
          <button type="button" onClick={() => { if (downloadFile('launch-plan.md', markdown, 'text/markdown')) signal('dl'); }} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted">
            {flash === 'dl' ? <Check size={15} /> : <Download size={15} />} Download .md
          </button>
          <Link href={`/builder?playbook=${plan.goal}`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Open in Builder <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
