'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useDesignSystem } from '@/lib/design-system-store';
import { usePersistentState } from '@/lib/hooks/use-persistent-state';
import { copyText } from '@/lib/browser';
import { decodeTokens, fontStack, FONT_STACKS, typeScale, type PortableTokens } from '@/lib/tokens-export';
import { TokenExportPanel } from '@/components/playground/token-export-panel';
import { PaletteGenerator } from '@/components/playground/palette-generator';
import { fixContrast } from '@/lib/palette';
import { ColorField } from '@/components/builder/builder-sidebar';
import { ensureContrast, mix, readableOn } from '@/lib/color';
import {
  RotateCcw,
  Link2,
  Type,
  SwatchBook,
  Palette,
  Circle,
  Zap,
  Orbit,
  Crosshair,
  AudioLines,
  MousePointer2,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_READINESS = [
  { id: 'messaging', label: 'Clear value proposition in hero section', done: false },
  { id: 'cta', label: 'Primary CTA appears above the fold', done: false },
  { id: 'trust', label: 'Trust signals (proof/testimonials) are visible', done: false },
  { id: 'contrast', label: 'All text pairs pass WCAG AA contrast', done: false },
  { id: 'mobile', label: 'Mobile readability and spacing reviewed', done: false },
  { id: 'performance', label: 'Motion and performance budget reviewed', done: false },
];
type ReadinessItem = (typeof DEFAULT_READINESS)[number];
const isReadiness = (v: unknown): v is ReadinessItem[] =>
  Array.isArray(v) && v.every((i) => i && typeof i.id === 'string' && typeof i.label === 'string' && typeof i.done === 'boolean');

/** Curated, contrast-checked starting palettes. */
const PRESETS: Array<{ name: string; tokens: Partial<PortableTokens> }> = [
  { name: 'Indigo SaaS', tokens: { primary: '#4f46e5', secondary: '#7c3aed', accent: '#f43f5e', background: '#ffffff', foreground: '#0f172a', muted: '#f4f4f5', border: '#e4e4e7', radius: 10, fontFamily: 'Inter' } },
  { name: 'Corporate Navy', tokens: { primary: '#1e3a5f', secondary: '#2f5d8a', accent: '#b8860b', background: '#ffffff', foreground: '#111827', muted: '#f3f4f6', border: '#e5e7eb', radius: 6, fontFamily: 'Serif' } },
  { name: 'Fintech Teal', tokens: { primary: '#0f766e', secondary: '#0e7490', accent: '#f59e0b', background: '#fbfdfc', foreground: '#042f2e', muted: '#ecfdf5', border: '#d1e7e0', radius: 12, fontFamily: 'Inter' } },
  { name: 'Studio Mono', tokens: { primary: '#111111', secondary: '#404040', accent: '#f97316', background: '#fafaf9', foreground: '#0c0a09', muted: '#f5f5f4', border: '#e7e5e4', radius: 2, fontFamily: 'Space Grotesk' } },
  { name: 'Dark Product', tokens: { primary: '#818cf8', secondary: '#a78bfa', accent: '#fb7185', background: '#0b1020', foreground: '#e5e7eb', muted: '#151b2e', border: '#252c44', radius: 12, fontFamily: 'Inter' } },
];

export default function DesignPlayground() {
  const { tokens, updateToken, resetTokens, setTokens } = useDesignSystem();
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [sharedTokens, setSharedTokens] = useState<Partial<PortableTokens> | null>(null);
  const [readiness, setReadiness] = usePersistentState<ReadinessItem[]>('multiverse-playground-readiness', DEFAULT_READINESS, isReadiness);

  // Detect a shared token link (#t=…) and offer to apply it.
  useEffect(() => {
    const match = window.location.hash.match(/^#t=([\w-]+)$/);
    if (!match) return;
    const decoded = decodeTokens(match[1]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (decoded && Object.keys(decoded).length > 0) setSharedTokens(decoded);
  }, []);

  const clearHash = () => history.replaceState(null, '', window.location.pathname + window.location.search);

  const portable: PortableTokens = useMemo(() => ({
    primary: tokens.primary, secondary: tokens.secondary, accent: tokens.accent, background: tokens.background,
    foreground: tokens.foreground, muted: tokens.muted, border: tokens.border, radius: tokens.radius,
    spacing: tokens.spacing, motionSpeed: tokens.motionSpeed, fontFamily: tokens.fontFamily, headingScale: tokens.headingScale,
  }), [tokens]);

  const scale = useMemo(() => typeScale(16, tokens.headingScale), [tokens.headingScale]);

  const readinessScore = useMemo(
    () => Math.round((readiness.filter((item) => item.done).length / readiness.length) * 100),
    [readiness]
  );

  const copyHandoffSummary = async () => {
    const summary = `# UI Handoff Summary\n\n## Token Snapshot\n- primary: ${tokens.primary}\n- secondary: ${tokens.secondary}\n- accent: ${tokens.accent}\n- background: ${tokens.background}\n- foreground: ${tokens.foreground}\n- muted: ${tokens.muted}\n- border: ${tokens.border}\n- radius: ${tokens.radius}px\n- spacing: ${tokens.spacing}px\n- font: ${tokens.fontFamily} (scale ${tokens.headingScale})\n- motionSpeed: ${tokens.motionSpeed}x\n\n## Launch Readiness\n- score: ${readinessScore}%\n${readiness.map((item) => `- [${item.done ? 'x' : ' '}] ${item.label}`).join('\n')}\n`;

    if (await copyText(summary)) {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 1800);
    }
  };

  const toggleReadiness = (id: string) => {
    setReadiness((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  // Tokens are scoped to the preview only, so the app chrome keeps the active universe's look.
  const previewVars = useMemo(() => ({
    '--primary': tokens.primary,
    '--primary-fg': readableOn(tokens.primary),
    '--accent': tokens.accent,
    '--accent-fg': readableOn(tokens.accent),
    '--bg': tokens.background,
    '--fg': tokens.foreground,
    '--card': tokens.background,
    '--card-fg': tokens.foreground,
    '--muted': tokens.muted,
    '--muted-fg': ensureContrast(mix(tokens.foreground, tokens.background, 0.4), tokens.background, 4.5),
    '--border': tokens.border,
    '--radius-sm': `${tokens.radius / 2}px`,
    '--radius-md': `${tokens.radius}px`,
    '--radius-lg': `${tokens.radius * 1.5}px`,
    '--radius-xl': `${tokens.radius * 2}px`,
    '--radius-2xl': `${tokens.radius * 2.5}px`,
    '--u-font-body': fontStack(tokens.fontFamily),
    '--u-font-display': fontStack(tokens.fontFamily),
    fontFamily: fontStack(tokens.fontFamily),
    backgroundColor: tokens.background,
    color: tokens.foreground,
  }) as React.CSSProperties, [tokens]);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-hidden bg-background">
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted text-foreground rounded-lg border border-border">
            <Palette size={18} />
          </div>
          <div>
            <h1 className="font-bold leading-tight">Design Playground</h1>
            <p className="text-xs text-muted-foreground">Define tokens, verify contrast, export production code.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/builder" className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-muted transition-colors">
            Open in Builder
          </Link>
          <button
            onClick={copyHandoffSummary}
            className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-muted transition-colors"
            title="Copy the token snapshot and readiness status as Markdown"
          >
            {copiedSummary ? 'Copied' : 'Copy handoff summary'}
          </button>
          <button
            onClick={() => { if (window.confirm('Reset all design tokens to their defaults?')) resetTokens(); }}
            className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
            title="Reset to defaults"
            aria-label="Reset tokens to defaults"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {sharedTokens && (
        <div className="flex items-center justify-between gap-4 border-b border-border bg-muted px-6 py-2.5 text-sm">
          <span className="flex items-center gap-2"><Link2 size={14} /> This link contains a shared token set ({Object.keys(sharedTokens).length} values). Applying it replaces your current tokens.</span>
          <span className="flex gap-2">
            <button type="button" onClick={() => { setTokens(sharedTokens); setSharedTokens(null); clearHash(); }} className="rounded-md bg-foreground px-3 py-1 text-xs font-semibold text-background">Apply</button>
            <button type="button" onClick={() => { setSharedTokens(null); clearHash(); }} className="rounded-md border border-border px-3 py-1 text-xs font-semibold">Dismiss</button>
          </span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Controls */}
        <aside className="w-80 border-r border-border bg-card h-full overflow-y-auto shrink-0">
          <div className="p-6 space-y-8">
            <ControlSection title="Generate from brand color" icon={Palette}>
              <PaletteGenerator onApply={(p) => setTokens(p)} />
            </ControlSection>

            <ControlSection title="Presets" icon={SwatchBook}>
              <div className="grid grid-cols-1 gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setTokens(preset.tokens)}
                    className="flex items-center justify-between rounded-md border border-border px-2.5 py-2 text-left text-xs font-semibold hover:bg-muted"
                  >
                    {preset.name}
                    <span className="flex gap-1">
                      {[preset.tokens.primary, preset.tokens.accent, preset.tokens.background].map((c) => (
                        <span key={c} className="h-3.5 w-3.5 rounded-full ring-1 ring-black/15" style={{ background: c }} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </ControlSection>

            <ControlSection title="Colors" icon={Palette}>
              <ColorField label="Primary" value={tokens.primary} onChange={(v) => updateToken('primary', v)} />
              <ColorField label="Secondary" value={tokens.secondary} onChange={(v) => updateToken('secondary', v)} />
              <ColorField label="Accent" value={tokens.accent} onChange={(v) => updateToken('accent', v)} />
              <ColorField label="Background" value={tokens.background} onChange={(v) => updateToken('background', v)} />
              <ColorField label="Foreground" value={tokens.foreground} onChange={(v) => updateToken('foreground', v)} />
              <ColorField label="Muted surface" value={tokens.muted} onChange={(v) => updateToken('muted', v)} />
              <ColorField label="Border" value={tokens.border} onChange={(v) => updateToken('border', v)} />
            </ControlSection>

            <ControlSection title="Geometry" icon={Circle}>
              <Slider label="Border Radius" value={tokens.radius} min={0} max={32} unit="px" onChange={(v) => updateToken('radius', v)} />
              <Slider label="Base Spacing" value={tokens.spacing} min={8} max={32} unit="px" onChange={(v) => updateToken('spacing', v)} />
            </ControlSection>

            <ControlSection title="Typography" icon={Type}>
              <Select label="Font Family" value={tokens.fontFamily} options={Object.keys(FONT_STACKS)} onChange={(v) => updateToken('fontFamily', v)} />
              <Slider label="Heading Scale" value={tokens.headingScale} min={1.067} max={1.618} step={0.001} onChange={(v) => updateToken('headingScale', Math.round(v * 1000) / 1000)} />
              <p className="text-[11px] text-muted-foreground font-mono">h1 {scale.h1}px · h2 {scale.h2}px · h3 {scale.h3}px · body {scale.body}px</p>
            </ControlSection>

            <ControlSection title="Motion" icon={Zap}>
              <Slider label="Duration Scale" value={tokens.motionSpeed} min={0.1} max={3} step={0.1} unit="x" onChange={(v) => updateToken('motionSpeed', v)} />
              <p className="text-[11px] text-muted-foreground font-mono">fast {Math.round(150 * tokens.motionSpeed)}ms · base {Math.round(250 * tokens.motionSpeed)}ms · slow {Math.round(400 * tokens.motionSpeed)}ms</p>
            </ControlSection>
          </div>
        </aside>

        {/* Center Panel: Preview (token-scoped) */}
        <main className="token-scope flex-1 h-full overflow-y-auto relative group" style={previewVars}>
          <div className="min-h-full p-12 flex flex-col items-center gap-12 max-w-4xl mx-auto">
             <div className="w-full rounded-2xl border border-border bg-card p-6">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                 <div>
                   <h3 className="text-lg font-bold">Launch Readiness Checklist</h3>
                   <p className="text-sm text-muted-foreground">Track whether this design direction is ready for implementation.</p>
                 </div>
                 <div className="text-sm font-semibold text-primary">Readiness {readinessScore}%</div>
               </div>
               <div className="space-y-2">
                 {readiness.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => toggleReadiness(item.id)}
                     className={cn(
                       'w-full text-left flex items-center justify-between px-4 py-2.5 rounded-lg border transition-colors',
                       item.done ? 'border-primary/40 bg-primary/5' : 'border-border hover:bg-muted/70'
                     )}
                   >
                     <span className="text-sm font-medium">{item.label}</span>
                     <span className={cn('text-xs font-semibold', item.done ? 'text-primary' : 'text-muted-foreground')}>
                       {item.done ? 'Done' : 'Pending'}
                     </span>
                   </button>
                 ))}
               </div>
             </div>

             <div className="w-full space-y-4 text-center">
               <h2 className="font-bold tracking-tight" style={{ fontSize: scale.h1, lineHeight: 1.1 }}>Interface Preview</h2>
               <p className="text-muted-foreground">Simulate real website components and validate your visual system quickly.</p>
             </div>

             <PreviewCard title="Standout Interaction Patterns" className="md:col-span-2">
               <div className="w-full space-y-6">
                 <AdaptiveSpotlightPanel />
                 <MagneticDockNav />
                 <ContextAwareCTA />
               </div>
             </PreviewCard>

             {/* UI Sandbox Components */}
             <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Buttons */}
               <PreviewCard title="Buttons">
                 <div className="flex flex-wrap gap-4 justify-center">
                   <button className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-md shadow-lg transition-all hover:scale-105">Primary</button>
                   <button className="px-6 py-2 border-2 border-primary text-primary font-bold rounded-md hover:bg-primary/5 transition-all">Outline</button>
                 </div>
               </PreviewCard>

               {/* Cards */}
               <PreviewCard title="Cards">
                 <div className="p-6 rounded-lg bg-card border shadow-xl w-full">
                    <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-4">
                      <Palette size={24} />
                    </div>
                    <h4 className="font-bold text-lg mb-1">Glassmorphic Card</h4>
                    <p className="text-sm text-muted-foreground">Tokens are being applied globally to this component.</p>
                 </div>
               </PreviewCard>

               {/* Navigation */}
               <PreviewCard title="Navigation" className="md:col-span-2">
                 <div className="bg-card border rounded-xl overflow-hidden shadow-lg w-full">
                    <div className="px-6 py-4 flex items-center justify-between border-b">
                      <span className="font-black uppercase tracking-tighter">Multiverse</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-bold text-primary">Home</span>
                        <span className="text-sm font-medium text-muted-foreground">About</span>
                      </div>
                    </div>
                    <div className="p-8 flex items-center gap-6">
                       <div className="flex-1 space-y-2">
                         <div className="h-4 w-3/4 bg-muted rounded" />
                         <div className="h-4 w-1/2 bg-muted rounded" />
                       </div>
                       <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">+</button>
                    </div>
                 </div>
               </PreviewCard>
             </div>
          </div>
        </main>

        {/* Right Panel: Export */}
        <aside className="w-96 border-l border-border bg-card h-full overflow-hidden flex flex-col shrink-0">
          <TokenExportPanel
            tokens={portable}
            onFixContrast={() => {
              const { fixed, changes } = fixContrast(portable);
              if (changes.length) setTokens({ foreground: fixed.foreground, primary: fixed.primary, accent: fixed.accent });
              return changes;
            }}
          />
        </aside>
      </div>
    </div>
  );
}

function AdaptiveSpotlightPanel() {
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const smoothX = useSpring(x, { stiffness: 130, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 130, damping: 20 });

  return (
    <div
      className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(((event.clientX - rect.left) / rect.width) * 100);
        y.set(((event.clientY - rect.top) / rect.height) * 100);
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            [smoothX, smoothY],
            ([latestX, latestY]) =>
              `radial-gradient(circle at ${latestX}% ${latestY}%, color-mix(in oklab, var(--primary) 24%, transparent), transparent 45%)`
          ),
        }}
      />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Adaptive Spotlight</p>
          <p className="text-sm mt-1">Card emphasis follows user intent and subtly highlights active exploration zones.</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Crosshair size={18} />
        </div>
      </div>
    </div>
  );
}

function MagneticDockNav() {
  const pointerX = useMotionValue(0);

  const dockItems = [
    { icon: <Orbit size={16} />, label: 'Identity' },
    { icon: <AudioLines size={16} />, label: 'Tone' },
    { icon: <MousePointer2 size={16} />, label: 'Motion' },
    { icon: <Gauge size={16} />, label: 'Perf' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-3">Magnetic Dock Navigation</p>
      <div
        className="flex items-center justify-center gap-2"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          pointerX.set(event.clientX - rect.left);
        }}
      >
        {dockItems.map((item, index) => (
          <DockItem key={item.label} index={index} pointerX={pointerX} label={item.label}>
            {item.icon}
          </DockItem>
        ))}
      </div>
    </div>
  );
}

function DockItem({
  children,
  pointerX,
  index,
  label,
}: {
  children: React.ReactNode;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  index: number;
  label: string;
}) {
  const center = 38 + index * 68;
  const distance = useTransform(pointerX, (latest) => Math.abs(latest - center));
  const scale = useTransform(distance, [0, 140], [1.24, 0.92]);

  return (
    <motion.div
      style={{ scale }}
      className="w-14 h-14 rounded-xl border border-border bg-card flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
    >
      {children}
      <span className="text-[9px] uppercase tracking-wider font-semibold">{label}</span>
    </motion.div>
  );
}

function ContextAwareCTA() {
  const [mode, setMode] = useState<'explore' | 'build' | 'ship'>('explore');

  const modeMap = {
    explore: {
      title: 'Exploration Mode',
      desc: 'Discover references and interaction patterns.',
      cta: 'Open Universes',
      href: '/universes',
    },
    build: {
      title: 'Build Mode',
      desc: 'Assemble sections and tune design tokens.',
      cta: 'Open Builder',
      href: '/builder',
    },
    ship: {
      title: 'Ship Mode',
      desc: 'Run readiness checks and generate handoff docs.',
      cta: 'Open Launch Studio',
      href: '/launch-studio',
    },
  } as const;

  const current = modeMap[mode];

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap gap-2 mb-4">
        {(['explore', 'build', 'ship'] as const).map((item) => (
          <button
            key={item}
            onClick={() => setMode(item)}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors capitalize',
              mode === item ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border hover:bg-muted'
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-border/70 bg-background p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">{current.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{current.desc}</p>
        </div>
        <Link href={current.href} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold whitespace-nowrap">{current.cta}</Link>
      </div>
    </div>
  );
}

// Sub-components for cleaner structure
function ControlSection({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary font-bold border-b border-primary/10 pb-2">
        <Icon size={16} />
        <span className="text-xs uppercase tracking-widest">{title}</span>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, unit = '', onChange }: { label: string, value: number, min: number, max: number, step?: number, unit?: string, onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
        <span className="text-[10px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 bg-muted border-none rounded-md px-2 text-xs font-medium focus:ring-1 ring-primary outline-none"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function PreviewCard({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow", className)}>
      <h3 className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-6">{title}</h3>
      <div className="flex flex-col items-center justify-center min-h-[100px]">
        {children}
      </div>
    </div>
  );
}
