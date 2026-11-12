'use client';

import React from 'react';
import { LabIndex } from '@/components/lab/workbench';
import { AsyncButtonBench, CopyBench, FavoriteBench, LoaderBench, SwitchBench, TickerBench, ToastBench, ValidationBench } from '@/components/micro-lab/modules';

const SECTIONS = [
  { id: 'async', label: 'Async button' },
  { id: 'toasts', label: 'Toasts' },
  { id: 'validation', label: 'Field validation' },
  { id: 'loaders', label: 'Loaders & skeletons' },
  { id: 'switch', label: 'Toggle switch' },
  { id: 'ticker', label: 'Number ticker' },
  { id: 'copy', label: 'Copy button' },
  { id: 'favorite', label: 'Favorite' },
];

export default function MicroInteractionsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10">
      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Micro-interactions</p>
        <h1 className="font-display text-6xl font-bold tracking-tight">The details that build trust.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Feedback for every state a user can be in — waiting, succeeding, failing, correcting. Each pattern includes its accessibility requirements and production code.
        </p>
      </header>
      <div className="mb-10"><LabIndex items={SECTIONS} /></div>
      <div className="space-y-10">
        <AsyncButtonBench />
        <ToastBench />
        <ValidationBench />
        <LoaderBench />
        <SwitchBench />
        <TickerBench />
        <CopyBench />
        <FavoriteBench />
      </div>
    </div>
  );
}
