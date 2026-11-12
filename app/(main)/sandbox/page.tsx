'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contrastRatio, mix, normalizeHex, readableOn, wcagRating } from '@/lib/color';
import { ColorField } from '@/components/builder/builder-sidebar';
import { SegmentControl, SliderControl, TextControl, ToggleControl, Workbench } from '@/components/lab/workbench';

type Kind = 'button' | 'badge' | 'alert' | 'input' | 'card';
type Variant = 'solid' | 'soft' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';
type Shadow = 'none' | 'sm' | 'md' | 'lg';

interface Config {
  kind: Kind; color: string; variant: Variant; size: Size; radius: number; shadow: Shadow;
  label: string; icon: boolean; full: boolean; loading: boolean; description: string; error: boolean; surface: 'light' | 'dark';
}

const SIZES: Record<Size, { h: number; px: number; fs: number }> = { sm: { h: 32, px: 12, fs: 13 }, md: { h: 40, px: 16, fs: 14 }, lg: { h: 48, px: 22, fs: 16 } };
const SHADOWS: Record<Shadow, string> = { none: 'none', sm: '0 1px 2px rgba(0,0,0,0.08)', md: '0 4px 12px -2px rgba(0,0,0,0.15)', lg: '0 12px 28px -8px rgba(0,0,0,0.3)' };

/** Resolves the visual tokens for a configuration — shared by preview and every exporter. */
function resolve(c: Config) {
  const base = normalizeHex(c.color) ?? '#2563eb';
  const surfaceBg = c.surface === 'light' ? '#ffffff' : '#0b0f19';
  const surfaceFg = c.surface === 'light' ? '#0f172a' : '#f1f5f9';
  const soft = mix(surfaceBg, base, c.surface === 'light' ? 0.12 : 0.22);
  const strongText = (() => {
    // Darken/lighten the brand color until it is readable on the surface.
    let t = base;
    for (let i = 0; i < 20 && (contrastRatio(t, c.kind === 'button' && c.variant === 'soft' ? soft : surfaceBg) ?? 0) < 4.5; i++) t = mix(base, c.surface === 'light' ? '#000000' : '#ffffff', (i + 1) / 20);
    return t;
  })();
  let bg = 'transparent', fg = strongText, border = 'transparent';
  if (c.variant === 'solid') { bg = base; fg = readableOn(base); }
  if (c.variant === 'soft') { bg = soft; fg = strongText; }
  if (c.variant === 'outline') { border = mix(surfaceBg, base, 0.6); }
  const hoverBg = c.variant === 'solid' ? mix(base, '#000000', 0.12) : mix(surfaceBg, base, 0.18);
  const ratio = contrastRatio(fg, bg === 'transparent' ? surfaceBg : bg) ?? 21;
  return { base, bg, fg, border, hoverBg, soft, surfaceBg, surfaceFg, ratio, s: SIZES[c.size] };
}

export default function ComponentGeneratorPage() {
  const [c, setC] = useState<Config>({
    kind: 'button', color: '#2563eb', variant: 'solid', size: 'md', radius: 8, shadow: 'sm',
    label: 'Start free trial', icon: true, full: false, loading: false, description: 'Your workspace is ready. Invite your team to get started.', error: false, surface: 'light',
  });
  const set = <K extends keyof Config>(k: K, v: Config[K]) => setC((x) => ({ ...x, [k]: v }));
  const t = useMemo(() => resolve(c), [c]);
  const code = useMemo(() => buildCode(c, t), [c, t]);

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Component Generator</p>
        <h1 className="font-display text-6xl font-bold tracking-tight">Configure a component. Ship the code.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Choose a component, set your brand color and style, and copy it as plain HTML and CSS, Tailwind classes or a React component. Text colors are corrected automatically to meet WCAG AA.
        </p>
      </header>

      <Workbench
        title={`${c.kind[0].toUpperCase()}${c.kind.slice(1)}`}
        description={`Contrast ${t.ratio.toFixed(2)}:1 · ${wcagRating(t.ratio)} on the ${c.surface} surface.`}
        code={code}
        previewClassName="min-h-[420px]"
        preview={
          <div className="flex h-full min-h-[420px] items-center justify-center p-10 transition-colors" style={{ background: t.surfaceBg, color: t.surfaceFg }}>
            <Preview c={c} t={t} />
          </div>
        }
        controls={
          <>
            <SegmentControl label="Component" value={c.kind} onChange={(v) => set('kind', v)} options={[{ value: 'button', label: 'Button' }, { value: 'badge', label: 'Badge' }, { value: 'alert', label: 'Alert' }, { value: 'input', label: 'Input' }, { value: 'card', label: 'Card' }]} />
            <ColorField label="Brand color" value={c.color} onChange={(v) => set('color', v)} />
            {c.kind !== 'input' && c.kind !== 'card' && (
              <SegmentControl label="Variant" value={c.variant} onChange={(v) => set('variant', v)} options={[{ value: 'solid', label: 'Solid' }, { value: 'soft', label: 'Soft' }, { value: 'outline', label: 'Outline' }, { value: 'ghost', label: 'Ghost' }]} />
            )}
            {c.kind !== 'alert' && c.kind !== 'card' && <SegmentControl label="Size" value={c.size} onChange={(v) => set('size', v)} options={[{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]} />}
            <SliderControl label="Corner radius" value={c.radius} min={0} max={24} unit="px" onChange={(v) => set('radius', v)} />
            {(c.kind === 'button' || c.kind === 'card') && <SegmentControl label="Shadow" value={c.shadow} onChange={(v) => set('shadow', v)} options={[{ value: 'none', label: 'None' }, { value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]} />}
            <TextControl label={c.kind === 'input' ? 'Label' : 'Text'} value={c.label} onChange={(v) => set('label', v.slice(0, 60))} />
            {(c.kind === 'alert' || c.kind === 'card') && <TextControl label="Description" value={c.description} onChange={(v) => set('description', v.slice(0, 160))} />}
            {c.kind === 'button' && (
              <>
                <ToggleControl label="Trailing icon" checked={c.icon} onChange={(v) => set('icon', v)} />
                <ToggleControl label="Full width" checked={c.full} onChange={(v) => set('full', v)} />
                <ToggleControl label="Loading state" checked={c.loading} onChange={(v) => set('loading', v)} />
              </>
            )}
            {c.kind === 'input' && <ToggleControl label="Error state" checked={c.error} onChange={(v) => set('error', v)} />}
            <SegmentControl label="Preview surface" value={c.surface} onChange={(v) => set('surface', v)} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
          </>
        }
      />
    </div>
  );
}

function Preview({ c, t }: { c: Config; t: ReturnType<typeof resolve> }) {
  const [hover, setHover] = useState(false);
  if (c.kind === 'button') {
    return (
      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        disabled={c.loading}
        style={{ height: t.s.h, padding: `0 ${t.s.px}px`, fontSize: t.s.fs, borderRadius: c.radius, background: hover && !c.loading ? t.hoverBg : t.bg, color: t.fg, border: `1px solid ${t.border}`, boxShadow: c.variant === 'solid' ? SHADOWS[c.shadow] : 'none', width: c.full ? 320 : undefined }}
        className="inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-progress disabled:opacity-80"
      >
        {c.loading && <Loader2 size={t.s.fs + 2} className="animate-spin" />}
        {c.label}
        {c.icon && !c.loading && <ArrowRight size={t.s.fs + 2} />}
      </button>
    );
  }
  if (c.kind === 'badge') {
    return <span style={{ background: t.bg, color: t.fg, border: `1px solid ${t.border}`, borderRadius: c.radius, fontSize: t.s.fs - 2, padding: `${t.s.h / 10}px ${t.s.px / 1.5}px` }} className="inline-flex items-center font-semibold">{c.label}</span>;
  }
  if (c.kind === 'alert') {
    const Icon = c.variant === 'solid' ? Info : AlertTriangle;
    return (
      <div role="status" style={{ background: c.variant === 'solid' ? t.base : t.soft, color: c.variant === 'solid' ? readableOn(t.base) : t.surfaceFg, border: `1px solid ${c.variant === 'outline' ? t.border : 'transparent'}`, borderRadius: c.radius }} className="flex w-[440px] gap-3 p-4">
        <Icon size={18} className="mt-0.5 shrink-0" style={{ color: c.variant === 'solid' ? readableOn(t.base) : t.fg }} />
        <div><p className="text-sm font-semibold">{c.label}</p><p className="mt-0.5 text-sm opacity-80">{c.description}</p></div>
      </div>
    );
  }
  if (c.kind === 'input') {
    const err = c.surface === 'light' ? '#c81e1e' : '#f87171';
    return (
      <div className="w-[320px] space-y-1.5">
        <label htmlFor="gen-input" className="text-sm font-semibold">{c.label}</label>
        <input id="gen-input" placeholder="name@company.com" aria-invalid={c.error} style={{ height: t.s.h, padding: `0 ${t.s.px * 0.8}px`, fontSize: t.s.fs, borderRadius: c.radius, border: `1px solid ${c.error ? err : mix(t.surfaceBg, t.surfaceFg, 0.2)}`, background: t.surfaceBg, color: t.surfaceFg, outlineColor: t.base }} className="w-full focus:outline focus:outline-2 focus:outline-offset-1" />
        {c.error && <p className="text-xs font-medium" style={{ color: err }}>Enter a valid email address.</p>}
      </div>
    );
  }
  return (
    <div style={{ borderRadius: c.radius, boxShadow: SHADOWS[c.shadow], border: `1px solid ${mix(t.surfaceBg, t.surfaceFg, 0.12)}`, background: c.surface === 'light' ? '#ffffff' : '#111827' }} className="w-[340px] p-6">
      <div style={{ background: t.soft, color: t.fg, borderRadius: Math.max(4, c.radius - 4) }} className="mb-4 flex h-10 w-10 items-center justify-center"><Info size={18} /></div>
      <p className="font-semibold">{c.label}</p>
      <p className="mt-1 text-sm opacity-75">{c.description}</p>
      <button type="button" style={{ background: t.base, color: readableOn(t.base), borderRadius: Math.max(4, c.radius - 2) }} className="mt-5 h-9 px-4 text-sm font-semibold">Continue</button>
    </div>
  );
}

function buildCode(c: Config, t: ReturnType<typeof resolve>) {
  const r = `${c.radius}px`;
  if (c.kind === 'button') {
    const css = `.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: ${t.s.h}px; padding: 0 ${t.s.px}px; font-size: ${t.s.fs}px; font-weight: 600;
  border-radius: ${r}; border: 1px solid ${t.border};
  background: ${t.bg}; color: ${t.fg};${c.variant === 'solid' && c.shadow !== 'none' ? `\n  box-shadow: ${SHADOWS[c.shadow]};` : ''}${c.full ? '\n  width: 100%;' : ''}
  transition: background-color 150ms ease;
  cursor: pointer;
}
.btn:hover { background: ${t.hoverBg}; }
.btn:focus-visible { outline: 2px solid ${t.base}; outline-offset: 2px; }
.btn:disabled { opacity: .7; cursor: progress; }`;
    const tw = `inline-flex items-center justify-center gap-2 h-[${t.s.h}px] px-[${t.s.px}px] text-[${t.s.fs}px] font-semibold rounded-[${c.radius}px] border border-[${t.border === 'transparent' ? 'transparent' : t.border}] bg-[${t.bg === 'transparent' ? 'transparent' : t.bg}] text-[${t.fg}] hover:bg-[${t.hoverBg}] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[${t.base}]${c.full ? ' w-full' : ''}${c.variant === 'solid' && c.shadow !== 'none' ? ` shadow-${c.shadow}` : ''}`;
    return [
      { label: 'HTML + CSS', code: `<button class="btn" type="button">${c.label}</button>\n\n${css}` },
      { label: 'Tailwind', code: `<button type="button" className="${tw}">\n  ${c.label}\n</button>` },
      { label: 'React', code: `export function Button({ children, loading, ...props }) {\n  return (\n    <button className="btn" disabled={loading} aria-busy={loading} {...props}>\n      {children}\n    </button>\n  );\n}\n\n/* site.css */\n${css}` },
    ];
  }
  if (c.kind === 'badge') {
    const css = `.badge { display: inline-flex; align-items: center; font-size: ${t.s.fs - 2}px; font-weight: 600; padding: ${t.s.h / 10}px ${t.s.px / 1.5}px; border-radius: ${r}; background: ${t.bg}; color: ${t.fg}; border: 1px solid ${t.border}; }`;
    return [{ label: 'HTML + CSS', code: `<span class="badge">${c.label}</span>\n\n${css}` }, { label: 'Tailwind', code: `<span className="inline-flex items-center font-semibold text-[${t.s.fs - 2}px] px-[${Math.round(t.s.px / 1.5)}px] py-[${Math.round(t.s.h / 10)}px] rounded-[${c.radius}px] bg-[${t.bg === 'transparent' ? 'transparent' : t.bg}] text-[${t.fg}]">${c.label}</span>` }];
  }
  if (c.kind === 'alert') {
    const bg = c.variant === 'solid' ? t.base : t.soft;
    const fg = c.variant === 'solid' ? readableOn(t.base) : t.surfaceFg;
    return [{ label: 'HTML + CSS', code: `<div class="alert" role="status">\n  <p class="alert__title">${c.label}</p>\n  <p class="alert__body">${c.description}</p>\n</div>\n\n.alert { display: flex; flex-direction: column; gap: 2px; padding: 16px; border-radius: ${r}; background: ${bg}; color: ${fg};${c.variant === 'outline' ? ` border: 1px solid ${t.border};` : ''} }\n.alert__title { font-weight: 600; font-size: 14px; }\n.alert__body { font-size: 14px; opacity: .8; }` }];
  }
  if (c.kind === 'input') {
    return [{ label: 'HTML + CSS', code: `<label for="email">${c.label}</label>\n<input id="email" type="email" class="input"${c.error ? ' aria-invalid="true" aria-describedby="email-error"' : ''} />${c.error ? '\n<p id="email-error" class="input-error">Enter a valid email address.</p>' : ''}\n\n.input { width: 100%; height: ${t.s.h}px; padding: 0 ${Math.round(t.s.px * 0.8)}px; font-size: ${t.s.fs}px; border-radius: ${r}; border: 1px solid ${mix(t.surfaceBg, t.surfaceFg, 0.2)}; background: ${t.surfaceBg}; color: ${t.surfaceFg}; }\n.input:focus-visible { outline: 2px solid ${t.base}; outline-offset: 1px; }\n.input[aria-invalid="true"] { border-color: #c81e1e; }\n.input-error { color: #c81e1e; font-size: 12px; }` }];
  }
  return [{ label: 'HTML + CSS', code: `<article class="card">\n  <h3>${c.label}</h3>\n  <p>${c.description}</p>\n  <button class="card__action">Continue</button>\n</article>\n\n.card { padding: 24px; border-radius: ${r}; border: 1px solid ${mix(t.surfaceBg, t.surfaceFg, 0.12)}; box-shadow: ${SHADOWS[c.shadow]}; }\n.card h3 { font-weight: 600; }\n.card p { margin-top: 4px; font-size: 14px; opacity: .75; }\n.card__action { margin-top: 20px; height: 36px; padding: 0 16px; border-radius: ${Math.max(4, c.radius - 2)}px; background: ${t.base}; color: ${readableOn(t.base)}; font-weight: 600; }` }];
}
