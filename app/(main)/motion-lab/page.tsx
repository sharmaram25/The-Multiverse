'use client';

import React from 'react';
import { EasingWorkbench } from '@/components/motion-lab/easing-workbench';
import { MagneticBench, MarqueeBench, ParallaxBench, PressBench, RevealBench, SpringBench, TextRevealBench } from '@/components/motion-lab/modules';
import { LabIndex } from '@/components/lab/workbench';

const SECTIONS = [
  { id: 'easing', label: 'Easing' },
  { id: 'spring', label: 'Spring physics' },
  { id: 'reveal', label: 'Scroll reveal' },
  { id: 'text', label: 'Text reveal' },
  { id: 'parallax', label: 'Parallax' },
  { id: 'press', label: 'Hover & press' },
  { id: 'magnetic', label: 'Magnetic' },
  { id: 'marquee', label: 'Marquee' },
];

export default function MotionLabPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10">
      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Motion Lab</p>
        <h1 className="font-display text-6xl font-bold tracking-tight">Motion, specified precisely.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Eight workbenches for the motion patterns modern sites use. Tune every value, replay the result, and copy production code for React, plain CSS or both. All output respects reduced-motion preferences.
        </p>
      </header>
      <div className="mb-10"><LabIndex items={SECTIONS} /></div>

      <div className="space-y-10">
        <section id="easing" className="scroll-mt-28">
          <div className="mb-4">
            <h2 className="text-xl font-semibold tracking-tight">Easing curves</h2>
            <p className="mt-1 text-sm text-muted-foreground">Cubic-bézier timing for transitions. Pick a preset or edit the control points.</p>
          </div>
          <EasingWorkbench />
        </section>
        <SpringBench />
        <RevealBench />
        <TextRevealBench />
        <ParallaxBench />
        <PressBench />
        <MagneticBench />
        <MarqueeBench />
      </div>
    </div>
  );
}
