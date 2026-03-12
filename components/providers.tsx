'use client';

import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { TransitionProvider } from '@/components/transitions/transition-context';
import { CursorProvider } from '@/components/CursorProvider';
import { MotionProvider } from '@/components/motion-provider';
import { MotionInspector } from '@/components/motion-inspector';
import { KonamiListener } from '@/components/konami-listener';
import { useExplorationTracker } from '@/lib/hooks/use-exploration-tracker';

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
