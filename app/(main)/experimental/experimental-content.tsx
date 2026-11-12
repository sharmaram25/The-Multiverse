'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { contrastRatio, mix, normalizeHex } from '@/lib/color';
import { ColorField } from '@/components/builder/builder-sidebar';
import { LabIndex, SegmentControl, SliderControl, ToggleControl, Workbench } from '@/components/lab/workbench';
import { useSafeReducedMotion } from '@/lib/hooks/use-safe-reduced-motion';

const ParticleField = dynamic(() => import('@/components/effects/particle-field'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading WebGL…</div>,
});

const SECTIONS = [
  { id: 'mesh', label: 'Mesh gradient' },
  { id: 'grain', label: 'Grain overlay' },
  { id: 'pattern', label: 'Grid & dots' },
  { id: 'glass', label: 'Frosted glass' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'particles', label: 'Particle field' },
];

export default function EffectsWorkbench() {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10">
      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Effects</p>
        <h1 className="font-display text-6xl font-bold tracking-tight">Backgrounds and surfaces, generated.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          The visual effects modern sites rely on, built from CSS wherever possible. Tune each one and copy code that ships without images or libraries.
        </p>
      </header>
      <div className="mb-10"><LabIndex items={SECTIONS} /></div>
      <div className="space-y-10">
        <MeshBench />
        <GrainBench />
        <PatternBench />
        <GlassBench />
        <AuroraBench />
        <ParticleBench />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function MeshBench() {
  const [base, setBase] = useState('#0b1022');
  const [c1, setC1] = useState('#4f46e5');
  const [c2, setC2] = useState('#ec4899');
  const [c3, setC3] = useState('#14b8a6');
  const [spread, setSpread] = useState(55);
  const [intensity, setIntensity] = useState(70);
  const a = (hex: string) => `color-mix(in srgb, ${normalizeHex(hex) ?? '#000'} ${intensity}%, transparent)`;
  const bg = `radial-gradient(at 12% 18%, ${a(c1)} 0px, transparent ${spread}%), radial-gradient(at 88% 12%, ${a(c2)} 0px, transparent ${spread}%), radial-gradient(at 70% 92%, ${a(c3)} 0px, transparent ${spread}%), ${base}`;
  return (
    <Workbench
      id="mesh"
      title="Mesh gradient"
      description="Layered radial gradients that read as a soft mesh. Pure CSS: no image request, sharp at every resolution."
      code={[{ label: 'CSS', code: `.mesh {\n  background:\n    ${bg.split('), ').join('),\n    ')};\n}` }]}
      preview={<div className="flex h-full min-h-[340px] items-center justify-center" style={{ background: bg }}><p className="font-display text-4xl font-bold tracking-tight" style={{ color: (contrastRatio('#ffffff', base) ?? 0) > 4.5 ? '#ffffff' : '#0a0a0a' }}>Your headline here</p></div>}
      controls={
        <>
          <ColorField label="Base" value={base} onChange={setBase} />
          <ColorField label="Color 1" value={c1} onChange={setC1} />
          <ColorField label="Color 2" value={c2} onChange={setC2} />
          <ColorField label="Color 3" value={c3} onChange={setC3} />
          <SliderControl label="Spread" value={spread} min={20} max={90} unit="%" onChange={setSpread} />
          <SliderControl label="Intensity" value={intensity} min={10} max={100} unit="%" onChange={setIntensity} />
        </>
      }
    />
  );
}

function GrainBench() {
  const [frequency, setFrequency] = useState(0.8);
  const [opacity, setOpacity] = useState(0.18);
  const [base, setBase] = useState('#f4f1ea');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  const url = `url("data:image/svg+xml;utf8,${svg}")`;
  return (
    <Workbench
      id="grain"
      title="Grain overlay"
      description="Fine film grain adds warmth and hides gradient banding. Generated with an inline SVG turbulence filter — about 300 bytes."
      code={[{ label: 'CSS', code: `.grain { position: relative; background: ${base}; }\n.grain::after {\n  content: ''; position: absolute; inset: 0; pointer-events: none;\n  opacity: ${opacity};\n  background-image: ${url};\n}` }]}
      preview={
        <div className="relative flex h-full min-h-[340px] items-center justify-center" style={{ background: `linear-gradient(135deg, ${base}, ${mix(base, '#000000', 0.12)})` }}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ opacity, backgroundImage: url }} />
          <p className="relative font-display text-4xl font-bold tracking-tight" style={{ color: '#111111' }}>Texture, not noise.</p>
        </div>
      }
      controls={
        <>
          <ColorField label="Base color" value={base} onChange={setBase} />
          <SliderControl label="Frequency" value={frequency} min={0.2} max={2} step={0.05} onChange={setFrequency} />
          <SliderControl label="Opacity" value={opacity} min={0.02} max={0.5} step={0.01} onChange={setOpacity} />
        </>
      }
    />
  );
}

function PatternBench() {
  const [kind, setKind] = useState<'grid' | 'dots' | 'lines'>('grid');
  const [size, setSize] = useState(32);
  const [color, setColor] = useState('#0a0a0a');
  const [alpha, setAlpha] = useState(10);
  const [fade, setFade] = useState(true);
  const c = `color-mix(in srgb, ${normalizeHex(color) ?? '#000'} ${alpha}%, transparent)`;
  const image = kind === 'grid'
    ? `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`
    : kind === 'dots' ? `radial-gradient(${c} 1.5px, transparent 1.5px)` : `repeating-linear-gradient(45deg, ${c} 0 1px, transparent 1px ${Math.round(size / 3)}px)`;
  const mask = 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)';
  return (
    <Workbench
      id="pattern"
      title="Grid and dot patterns"
      description="Subtle structure behind hero sections and feature areas. An elliptical mask fades the edges so the pattern never competes with content."
      code={[{ label: 'CSS', code: `.pattern {\n  background-image: ${image};\n  background-size: ${size}px ${size}px;${fade ? `\n  mask-image: ${mask};` : ''}\n}` }]}
      preview={
        <div className="relative h-full min-h-[340px] bg-white">
          <div className="absolute inset-0" style={{ backgroundImage: image, backgroundSize: `${size}px ${size}px`, maskImage: fade ? mask : undefined, WebkitMaskImage: fade ? mask : undefined }} />
          <div className="relative flex h-full min-h-[340px] items-center justify-center"><p className="font-display text-4xl font-bold tracking-tight text-[#0a0a0a]">Structure without noise.</p></div>
        </div>
      }
      controls={
        <>
          <SegmentControl label="Pattern" value={kind} onChange={setKind} options={[{ value: 'grid', label: 'Grid' }, { value: 'dots', label: 'Dots' }, { value: 'lines', label: 'Diagonal' }]} />
          <SliderControl label="Cell size" value={size} min={8} max={80} step={2} unit="px" onChange={setSize} />
          <ColorField label="Line color" value={color} onChange={setColor} />
          <SliderControl label="Strength" value={alpha} min={3} max={40} unit="%" onChange={setAlpha} />
          <ToggleControl label="Fade edges" checked={fade} onChange={setFade} />
        </>
      }
    />
  );
}

function GlassBench() {
  const [blur, setBlur] = useState(16);
  const [tint, setTint] = useState(14);
  const [saturate, setSaturate] = useState(160);
  const [border, setBorder] = useState(22);
  const [dark, setDark] = useState(true);
  const tintColor = dark ? '255,255,255' : '255,255,255';
  const panelBg = `rgba(${tintColor}, ${tint / 100})`;
  const textColor = dark ? '#ffffff' : '#0a0a0a';
  // Approximate the panel over the darkest part of the backdrop for a conservative contrast estimate.
  const backdrop = dark ? '#1e1b4b' : '#e0e7ff';
  const effective = mix(backdrop, '#ffffff', tint / 100);
  const ratio = contrastRatio(textColor, effective) ?? 21;
  return (
    <Workbench
      id="glass"
      title="Frosted glass"
      description="Background blur with a light tint and edge. The contrast estimate warns when text on the panel becomes hard to read."
      code={[{ label: 'CSS', code: `.glass {\n  background: ${panelBg};\n  backdrop-filter: blur(${blur}px) saturate(${saturate}%);\n  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturate}%);\n  border: 1px solid rgba(255,255,255,${border / 100});\n  border-radius: 20px;\n  box-shadow: inset 0 1px 0 rgba(255,255,255,${(border / 200).toFixed(2)}), 0 20px 40px -20px rgba(0,0,0,.5);\n}\n/* Fallback where backdrop-filter is unsupported */\n@supports not (backdrop-filter: blur(1px)) { .glass { background: rgba(${tintColor}, ${Math.min(0.9, tint / 100 + 0.5)}); } }` }]}
      preview={
        <div className="relative flex h-full min-h-[340px] items-center justify-center overflow-hidden" style={{ background: dark ? 'linear-gradient(135deg,#1e1b4b,#312e81 50%,#0f172a)' : 'linear-gradient(135deg,#e0e7ff,#fce7f3)' }}>
          <div aria-hidden="true" className="absolute left-[18%] top-[18%] h-44 w-44 rounded-full bg-[#ec4899]" />
          <div aria-hidden="true" className="absolute bottom-[12%] right-[22%] h-52 w-52 rounded-full bg-[#14b8a6]" />
          <div className="relative w-80 p-6" style={{ background: panelBg, backdropFilter: `blur(${blur}px) saturate(${saturate}%)`, WebkitBackdropFilter: `blur(${blur}px) saturate(${saturate}%)`, border: `1px solid rgba(255,255,255,${border / 100})`, borderRadius: 20, boxShadow: `inset 0 1px 0 rgba(255,255,255,${border / 200}), 0 20px 40px -20px rgba(0,0,0,.5)`, color: textColor }}>
            <p className="text-sm font-semibold opacity-80">Monthly revenue</p>
            <p className="mt-1 font-display text-4xl font-bold">$48,250</p>
            <p className="mt-2 text-sm opacity-80">+12% versus last month</p>
          </div>
          <span className={`absolute bottom-3 left-3 rounded-md px-2 py-1 text-xs font-semibold ${ratio >= 4.5 ? 'bg-success text-white' : 'bg-destructive text-white'}`}>Estimated contrast {ratio.toFixed(1)}:1</span>
        </div>
      }
      controls={
        <>
          <SliderControl label="Blur" value={blur} min={0} max={40} unit="px" onChange={setBlur} />
          <SliderControl label="Tint" value={tint} min={0} max={60} unit="%" onChange={setTint} />
          <SliderControl label="Saturation" value={saturate} min={100} max={220} step={5} unit="%" onChange={setSaturate} />
          <SliderControl label="Edge highlight" value={border} min={0} max={60} unit="%" onChange={setBorder} />
          <ToggleControl label="Dark backdrop" checked={dark} onChange={setDark} />
        </>
      }
    />
  );
}

function AuroraBench() {
  const reduce = useSafeReducedMotion();
  const [c1, setC1] = useState('#22d3ee');
  const [c2, setC2] = useState('#a855f7');
  const [seconds, setSeconds] = useState(18);
  const [blur, setBlur] = useState(60);
  const css = `.aurora { position: relative; overflow: hidden; background: #050816; }
.aurora::before {
  content: ''; position: absolute; inset: -40%;
  background: radial-gradient(40% 40% at 30% 40%, ${c1}, transparent 70%),
              radial-gradient(35% 35% at 70% 60%, ${c2}, transparent 70%);
  filter: blur(${blur}px);
  animation: aurora ${seconds}s ease-in-out infinite alternate;
  will-change: transform;
}
@keyframes aurora { to { transform: translate3d(8%, -6%, 0) rotate(20deg) scale(1.1); } }
@media (prefers-reduced-motion: reduce) { .aurora::before { animation: none; } }`;
  return (
    <Workbench
      id="aurora"
      title="Animated aurora"
      description="Slow, ambient colour drift for hero backgrounds. Animates transform only, so it runs on the compositor without repainting."
      code={[{ label: 'CSS', code: css }]}
      preview={
        <div className="relative flex h-full min-h-[340px] items-center justify-center overflow-hidden bg-[#050816]">
          <style>{`@keyframes mv-aurora { to { transform: translate3d(8%, -6%, 0) rotate(20deg) scale(1.1); } }`}</style>
          <div aria-hidden="true" className="absolute" style={{ inset: '-40%', background: `radial-gradient(40% 40% at 30% 40%, ${c1}, transparent 70%), radial-gradient(35% 35% at 70% 60%, ${c2}, transparent 70%)`, filter: `blur(${blur}px)`, animation: reduce ? 'none' : `mv-aurora ${seconds}s ease-in-out infinite alternate`, willChange: 'transform' }} />
          <p className="relative font-display text-4xl font-bold tracking-tight text-white">Ambient, not distracting.</p>
        </div>
      }
      controls={
        <>
          <ColorField label="Color 1" value={c1} onChange={setC1} />
          <ColorField label="Color 2" value={c2} onChange={setC2} />
          <SliderControl label="Cycle" value={seconds} min={6} max={40} unit="s" onChange={setSeconds} />
          <SliderControl label="Softness" value={blur} min={20} max={120} unit="px" onChange={setBlur} />
        </>
      }
    />
  );
}

function ParticleBench() {
  const [count, setCount] = useState(4000);
  const [size, setSize] = useState(0.04);
  const [speed, setSpeed] = useState(1);
  const [spread, setSpread] = useState(10);
  const [color, setColor] = useState('#22d3ee');
  const [on, setOn] = useState(false);
  const cost = useMemo(() => (count > 8000 ? 'High' : count > 3000 ? 'Moderate' : 'Low'), [count]);
  return (
    <Workbench
      id="particles"
      title="WebGL particle field"
      description="A GPU-rendered point cloud with React Three Fiber. Loaded only when you start it — three.js adds about 150 KB gzipped, so reserve this for showcase moments."
      code={[{ label: 'React Three Fiber', code: `<Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.75]}>
  <Points positions={positions /* Float32Array(${count} * 3), spread ${spread} */} stride={3}>
    <PointMaterial transparent color="${color}" size={${size}} sizeAttenuation depthWrite={false} />
  </Points>
</Canvas>
// Rotate in useFrame: rotation.x -= (delta / 10) * ${speed}` }]}
      preview={
        <div className="relative h-full min-h-[340px] bg-[#05070b]">
          {on ? <ParticleField count={count} size={size} speed={speed} color={color} spread={spread} background="#05070b" /> : (
            <div className="flex h-full min-h-[340px] flex-col items-center justify-center gap-3 text-white">
              <p className="text-sm text-white/70">WebGL is loaded on demand.</p>
              <button type="button" onClick={() => setOn(true)} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black">Start particle field</button>
            </div>
          )}
          <span className="absolute bottom-3 left-3 rounded-md bg-white/10 px-2 py-1 font-mono text-xs text-white">GPU cost: {cost}</span>
        </div>
      }
      controls={
        <>
          <SliderControl label="Particles" value={count} min={500} max={15000} step={500} onChange={setCount} />
          <SliderControl label="Point size" value={size} min={0.01} max={0.12} step={0.005} onChange={setSize} />
          <SliderControl label="Rotation speed" value={speed} min={0} max={4} step={0.1} unit="×" onChange={setSpeed} />
          <SliderControl label="Spread" value={spread} min={4} max={20} onChange={setSpread} />
          <ColorField label="Color" value={color} onChange={setColor} />
        </>
      }
    />
  );
}
