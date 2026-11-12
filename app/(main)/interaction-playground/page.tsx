'use client';

import React from 'react';
import { LabIndex } from '@/components/lab/workbench';
import { DragBench, ProximityBench, SortableBench, SpotlightBench, SwipeBench, TiltBench } from '@/components/interaction-lab/modules';

const SECTIONS = [
  { id: 'sortable', label: 'Sortable list' },
  { id: 'drag', label: 'Drag and throw' },
  { id: 'swipe', label: 'Swipe to dismiss' },
  { id: 'tilt', label: '3D tilt' },
  { id: 'spotlight', label: 'Spotlight hover' },
  { id: 'proximity', label: 'Proximity grid' },
];

export default function InteractionsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10">
      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Interactions</p>
        <h1 className="font-display text-6xl font-bold tracking-tight">Direct manipulation, done right.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Gesture and pointer patterns with the details that make them feel solid: boundaries, momentum, thresholds, undo and keyboard alternatives. Configure each one and copy the implementation.
        </p>
      </header>
      <div className="mb-10"><LabIndex items={SECTIONS} /></div>
      <div className="space-y-10">
        <SortableBench />
        <DragBench />
        <SwipeBench />
        <TiltBench />
        <SpotlightBench />
        <ProximityBench />
      </div>
    </div>
  );
}
