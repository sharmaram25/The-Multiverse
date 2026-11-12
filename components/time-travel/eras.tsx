'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export type EraId = 'web1' | 'web2' | 'flat' | 'material' | 'modern' | 'spatial';

export interface Era {
  id: EraId;
  from: number;
  name: string;
  tagline: string;
  screen: string;
  connection: string;
  kbps: number; // typical effective downlink
  pageKB: number; // typical page weight of the era (HTTP Archive / contemporary estimates)
  tech: string[];
  kept: string[];
  retired: string[];
}

export const ERAS: Era[] = [
  { id: 'web1', from: 1996, name: 'Web 1.0', tagline: 'Documents with links', screen: '640 × 480', connection: '28.8k dial-up', kbps: 28.8, pageKB: 45, tech: ['HTML 3.2', 'Tables', 'GIF'], kept: ['Text-first pages that load instantly', 'Visible, underlined links'], retired: ['Table layouts', 'Animated GIF decoration', '“Best viewed in” notices'] },
  { id: 'web2', from: 2004, name: 'Web 2.0', tagline: 'Gloss, gradients and beta badges', screen: '1024 × 768', connection: '1 Mbps DSL', kbps: 1000, pageKB: 350, tech: ['AJAX', 'Flash', 'PNG gradients'], kept: ['Strong, obvious primary buttons', 'Product-led storytelling'], retired: ['Glossy skeuomorphic chrome', 'Flash intros', 'Fixed 960px layouts'] },
  { id: 'flat', from: 2012, name: 'Flat & responsive', tagline: 'Content first, mobile first', screen: '1366 × 768 + phones', connection: '3G · 1.6 Mbps', kbps: 1600, pageKB: 1300, tech: ['Responsive CSS', 'Web fonts', 'jQuery'], kept: ['Responsive layouts', 'Generous whitespace'], retired: ['Low-contrast flat buttons', 'Hero carousels'] },
  { id: 'material', from: 2016, name: 'Material & cards', tagline: 'Depth with meaning', screen: '1920 × 1080', connection: '4G · 10 Mbps', kbps: 10000, pageKB: 2300, tech: ['React', 'Flexbox', 'Icon fonts'], kept: ['Elevation to show hierarchy', 'Consistent component systems'], retired: ['Floating action buttons on websites', 'Ripples everywhere'] },
  { id: 'modern', from: 2021, name: 'Modern product', tagline: 'Type, tokens and restraint', screen: '1440 × 900 · retina', connection: '4G+ · 25 Mbps', kbps: 25000, pageKB: 2200, tech: ['Design tokens', 'Variable fonts', 'Core Web Vitals'], kept: ['Design tokens and systems', 'Performance budgets'], retired: ['Cookie walls', 'Scroll-jacking'] },
  { id: 'spatial', from: 2027, name: 'Adaptive & spatial', tagline: 'Interfaces that respond to context', screen: 'Any surface', connection: '5G · 100 Mbps', kbps: 100000, pageKB: 1600, tech: ['View transitions', 'Scroll-driven CSS', 'Container queries'], kept: ['Accessible-by-default components', 'Native platform motion'], retired: ['Heavy client frameworks for static pages'] },
];
export const FIRST = 1996;
export const LAST = 2030;
export const eraFor = (year: number) => [...ERAS].reverse().find((e) => year >= e.from) ?? ERAS[0];

export interface Content { brand: string; headline: string; sub: string; cta: string }
export const DEFAULT_CONTENT: Content = { brand: 'Northwind', headline: 'Plan your next website with confidence', sub: 'Briefs, sitemaps and design systems in one place.', cta: 'Get started' };
export const isContent = (v: unknown): v is Content => !!v && typeof v === 'object' && typeof (v as Content).headline === 'string';
const FEATURES = ['Fast setup', 'Real exports', 'Private by default'];


/* -------------------------------------------------------------------------- */
/* Browser chrome per era                                                      */
/* -------------------------------------------------------------------------- */

export function BrowserFrame({ era, brand, children }: { era: EraId; brand: string; children: React.ReactNode }) {
  const url = `${era === 'web1' ? 'http://www.' : 'https://'}${brand.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'example'}.com`;
  const chrome: Record<EraId, { bar: string; addr: string; dots: React.ReactNode; title: string }> = {
    web1: { bar: 'bg-[#c0c0c0] border-b-2 border-[#808080]', addr: 'bg-white border-2 border-[#808080] border-r-white border-b-white font-[Times_New_Roman,serif] rounded-none', dots: <span className="font-[Arial] text-[10px] font-bold text-black">Netscape</span>, title: 'text-black' },
    web2: { bar: 'bg-gradient-to-b from-[#f3f4f6] to-[#cbd5e1] border-b border-[#94a3b8]', addr: 'bg-white border border-[#94a3b8] rounded-md shadow-inner', dots: <WindowDots colors={['#ef4444', '#f59e0b', '#22c55e']} glossy />, title: 'text-slate-700' },
    flat: { bar: 'bg-[#e5e7eb]', addr: 'bg-white rounded-sm', dots: <WindowDots colors={['#9ca3af', '#9ca3af', '#9ca3af']} />, title: 'text-gray-600' },
    material: { bar: 'bg-[#dfe1e5]', addr: 'bg-white rounded-full shadow-sm', dots: <WindowDots colors={['#ff5f57', '#febc2e', '#28c840']} />, title: 'text-gray-700' },
    modern: { bar: 'bg-[#f5f5f5] border-b border-black/5', addr: 'bg-black/[0.05] rounded-lg', dots: <WindowDots colors={['#ff5f57', '#febc2e', '#28c840']} />, title: 'text-gray-700' },
    spatial: { bar: 'bg-white/10 backdrop-blur-xl border-b border-white/15', addr: 'bg-white/15 rounded-full text-white', dots: <WindowDots colors={['rgba(255,255,255,.6)', 'rgba(255,255,255,.4)', 'rgba(255,255,255,.25)']} />, title: 'text-white' },
  };
  const c = chrome[era];
  return (
    <div className={cn('relative overflow-hidden shadow-2xl transition-[border-radius] duration-500', era === 'web1' ? 'rounded-none border-2 border-[#808080]' : era === 'spatial' ? 'rounded-[28px] bg-[#0b1022]' : 'rounded-xl border border-black/10')}>
      <div className={cn('relative z-10 flex h-10 items-center gap-3 px-3 transition-colors duration-500', c.bar)}>
        <div className="w-20">{c.dots}</div>
        <div className={cn('flex h-6 flex-1 items-center px-3 font-mono text-[11px] transition-all duration-500', c.addr, c.title)}>{url}</div>
        <div className="w-20" />
      </div>
      <div className="relative h-[560px] overflow-hidden">{children}</div>
    </div>
  );
}

function WindowDots({ colors, glossy }: { colors: string[]; glossy?: boolean }) {
  return (
    <span className="flex gap-1.5">
      {colors.map((c, i) => <span key={i} className="h-3 w-3 rounded-full" style={{ background: glossy ? `radial-gradient(circle at 35% 30%, #fff8, ${c} 60%)` : c }} />)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* The page, rendered per era. Shared layoutIds make elements morph between eras. */
/* -------------------------------------------------------------------------- */

export function EraPage({ era, content, reduce }: { era: EraId; content: Content; reduce: boolean }) {
  const t = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 120, damping: 20 };
  const L = (id: string) => ({ layoutId: `tt-${id}`, transition: { layout: t } });

  if (era === 'web1') {
    return (
      <div className="h-full overflow-hidden bg-[#c0c0c0] p-5 text-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <motion.p {...L('brand')} className="text-center text-3xl font-bold text-[#000080]">{content.brand}</motion.p>
        <p className="mt-1 text-center text-xs">[ <u className="text-[#0000ee]">Home</u> | <u className="text-[#0000ee]">Products</u> | <u className="text-[#551a8b]">Guestbook</u> ]</p>
        <hr className="my-3 border-t-2 border-[#808080]" />
        <motion.h2 {...L('headline')} className="text-center text-2xl font-bold">{content.headline}</motion.h2>
        <motion.p {...L('sub')} className="mt-2 text-center text-sm">{content.sub}</motion.p>
        <table className="mx-auto mt-4 border-2 border-[#808080] bg-white text-sm" cellPadding={8}>
          <tbody><tr>{FEATURES.map((f, i) => <motion.td key={f} {...L(`f${i}`)} className="border border-[#808080] text-center"><b>{f}</b><br /><span className="text-xs">Click <u className="text-[#0000ee]">here</u></span></motion.td>)}</tr></tbody>
        </table>
        <div className="mt-4 text-center"><motion.button {...L('cta')} type="button" className="border-2 border-white border-b-[#404040] border-r-[#404040] bg-[#c0c0c0] px-4 py-1 text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>{content.cta}</motion.button></div>
        <p className="mt-6 text-center text-xs">You are visitor <span className="bg-black px-1 font-mono text-[#39ff14]">004291</span> · Best viewed in Netscape at 640×480</p>
        <p className="mt-2 text-center text-[10px] text-[#800000]">⚠ UNDER CONSTRUCTION ⚠</p>
      </div>
    );
  }

  if (era === 'web2') {
    return (
      <div className="h-full overflow-hidden bg-[#eef2f7] text-[#1f2937]" style={{ fontFamily: 'Verdana, Geneva, sans-serif' }}>
        <div className="flex items-center justify-between bg-gradient-to-b from-[#7dd3fc] via-[#38bdf8] to-[#0284c7] px-6 py-3 shadow-md">
          <motion.p {...L('brand')} className="text-2xl font-bold italic text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]">{content.brand}<sup className="ml-1 rounded bg-[#f97316] px-1 text-[9px] not-italic">BETA</sup></motion.p>
          <div className="flex gap-1">{['Home', 'Tour', 'Blog'].map((n, i) => <span key={n} className={cn('rounded-t-lg px-3 py-1 text-xs font-bold', i === 0 ? 'bg-[#eef2f7] text-[#0284c7]' : 'bg-white/30 text-white')}>{n}</span>)}</div>
        </div>
        <div className="mx-auto max-w-[760px] px-6 pt-8 text-center">
          <motion.h2 {...L('headline')} className="text-3xl font-bold tracking-tight text-[#0f172a]">{content.headline}</motion.h2>
          <motion.p {...L('sub')} className="mt-2 text-sm text-[#475569]">{content.sub}</motion.p>
          <motion.button {...L('cta')} type="button" className="mt-5 rounded-full border border-[#15803d] bg-gradient-to-b from-[#86efac] to-[#16a34a] px-8 py-2.5 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_6px_rgba(0,0,0,0.25)]">{content.cta} »</motion.button>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f} {...L(`f${i}`)} className="rounded-xl border border-[#cbd5e1] bg-gradient-to-b from-white to-[#e2e8f0] p-4 shadow">
                <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-gradient-to-b from-[#fde68a] to-[#f59e0b] shadow-inner" />
                <p className="text-xs font-bold">{f}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-[10px] text-[#64748b]">Digg it · Add to del.icio.us · RSS</p>
        </div>
      </div>
    );
  }

  if (era === 'flat') {
    return (
      <div className="h-full overflow-hidden bg-white text-[#2c3e50]" style={{ fontFamily: '"Segoe UI", "Open Sans", Arial, sans-serif' }}>
        <div className="flex items-center justify-between px-8 py-4">
          <motion.p {...L('brand')} className="text-xl font-light uppercase tracking-[0.3em]">{content.brand}</motion.p>
          <span className="flex flex-col gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-0.5 w-6 bg-[#2c3e50]" />)}</span>
        </div>
        <div className="bg-[#1abc9c] px-8 py-12 text-white">
          <motion.h2 {...L('headline')} className="max-w-xl text-4xl font-light leading-tight">{content.headline}</motion.h2>
          <motion.p {...L('sub')} className="mt-3 max-w-lg text-base font-light opacity-90">{content.sub}</motion.p>
          <motion.button {...L('cta')} type="button" className="mt-6 bg-[#e74c3c] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white">{content.cta}</motion.button>
        </div>
        <div className="grid grid-cols-3">
          {FEATURES.map((f, i) => <motion.div key={f} {...L(`f${i}`)} className="p-6 text-white" style={{ background: ['#3498db', '#9b59b6', '#f39c12'][i] }}><p className="text-lg font-light">{f}</p><p className="mt-1 text-xs opacity-80">Learn more →</p></motion.div>)}
        </div>
      </div>
    );
  }

  if (era === 'material') {
    return (
      <div className="relative h-full overflow-hidden bg-[#fafafa] text-[#212121]" style={{ fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <div className="flex items-center gap-6 bg-[#3f51b5] px-6 py-4 text-white shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          <motion.p {...L('brand')} className="text-xl font-medium">{content.brand}</motion.p>
          <span className="ml-auto flex gap-6 text-sm font-medium uppercase opacity-90"><span>Features</span><span>Pricing</span></span>
        </div>
        <div className="px-10 pt-10">
          <motion.h2 {...L('headline')} className="max-w-2xl text-4xl font-normal leading-tight">{content.headline}</motion.h2>
          <motion.p {...L('sub')} className="mt-3 max-w-xl text-base text-[#616161]">{content.sub}</motion.p>
          <motion.button {...L('cta')} type="button" className="mt-6 rounded bg-[#ff4081] px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-white shadow-[0_3px_6px_rgba(0,0,0,0.2)]">{content.cta}</motion.button>
          <div className="mt-10 grid grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f} {...L(`f${i}`)} className="rounded bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)]">
                <div className="mb-3 h-10 w-10 rounded-full bg-[#e8eaf6]" />
                <p className="text-base font-medium">{f}</p>
                <p className="mt-1 text-xs text-[#757575]">Supporting text for this card.</p>
              </motion.div>
            ))}
          </div>
        </div>
        <span className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff4081] text-2xl text-white shadow-[0_6px_10px_rgba(0,0,0,0.3)]">+</span>
      </div>
    );
  }

  if (era === 'modern') {
    return (
      <div className="h-full overflow-hidden bg-white text-[#0a0a0a]" style={{ fontFamily: 'var(--font-geist), var(--font-inter), system-ui, sans-serif' }}>
        <div className="flex items-center justify-between border-b border-black/5 px-10 py-4">
          <motion.p {...L('brand')} className="text-base font-semibold tracking-tight">{content.brand}</motion.p>
          <span className="flex items-center gap-6 text-sm text-[#52525b]"><span>Product</span><span>Pricing</span><span className="rounded-lg bg-[#0a0a0a] px-3 py-1.5 text-white">Sign in</span></span>
        </div>
        <div className="px-10 pt-14 text-center">
          <motion.h2 {...L('headline')} className="mx-auto max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em]">{content.headline}</motion.h2>
          <motion.p {...L('sub')} className="mx-auto mt-4 max-w-lg text-lg text-[#52525b]">{content.sub}</motion.p>
          <motion.button {...L('cta')} type="button" className="mt-7 rounded-xl bg-[#0a0a0a] px-6 py-3 text-sm font-semibold text-white">{content.cta} →</motion.button>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-3 text-left">
            {FEATURES.map((f, i) => <motion.div key={f} {...L(`f${i}`)} className="rounded-2xl border border-black/[0.08] p-5"><p className="font-mono text-xs text-[#a1a1aa]">0{i + 1}</p><p className="mt-6 text-sm font-semibold">{f}</p></motion.div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden text-white" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', background: 'radial-gradient(at 20% 10%, #3b82f6 0, transparent 45%), radial-gradient(at 85% 30%, #a855f7 0, transparent 45%), radial-gradient(at 50% 100%, #14b8a6 0, transparent 50%), #070b17' }}>
      <div className="flex items-center justify-between px-10 py-5">
        <motion.p {...L('brand')} className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-xl">{content.brand}</motion.p>
        <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs backdrop-blur-xl">Adapts to you · Light ◐</span>
      </div>
      <div className="px-10 pt-8 text-center">
        <motion.h2 {...L('headline')} className="mx-auto max-w-3xl bg-gradient-to-b from-white to-white/60 bg-clip-text text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-transparent">{content.headline}</motion.h2>
        <motion.p {...L('sub')} className="mx-auto mt-4 max-w-lg text-lg text-white/75">{content.sub}</motion.p>
        <motion.button {...L('cta')} type="button" className="mt-7 rounded-full border border-white/30 bg-white/15 px-7 py-3 text-sm font-semibold backdrop-blur-xl">{content.cta}</motion.button>
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4" style={{ perspective: 900 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={f} {...L(`f${i}`)} className="rounded-3xl border border-white/20 bg-white/10 p-5 text-left backdrop-blur-xl" style={{ transform: `rotateY(${(i - 1) * -12}deg) translateZ(${i === 1 ? 30 : 0}px)` }}>
              <p className="text-sm font-semibold">{f}</p>
              <p className="mt-1 text-xs text-white/70">Context-aware</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
