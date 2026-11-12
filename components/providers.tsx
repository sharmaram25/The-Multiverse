'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/components/theme-provider';
import { TransitionProvider } from '@/components/transitions/transition-context';
import { CursorProvider } from '@/components/CursorProvider';
import { MotionProvider } from '@/components/motion-provider';
import { useExplorationTracker } from '@/lib/hooks/use-exploration-tracker';

const MotionInspector = dynamic(
  () => import('@/components/motion-inspector').then((mod) => mod.MotionInspector),
  { ssr: false }
);

const KonamiListener = dynamic(
  () => import('@/components/konami-listener').then((mod) => mod.KonamiListener),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  useExplorationTracker();

  return (
    <ThemeProvider>
      <TransitionProvider>
        <CursorProvider>
          <MotionProvider>
            {children}
            <MotionInspector />
            <KonamiListener />
          </MotionProvider>
        </CursorProvider>
      </TransitionProvider>
    </ThemeProvider>
  );
}
