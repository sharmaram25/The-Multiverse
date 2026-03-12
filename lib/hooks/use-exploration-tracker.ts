'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDesignSystem } from '@/lib/design-system-store';

const EXPLORATION_THRESHOLD = 5; // Number of unique major pages to visit

export function useExplorationTracker() {
  const pathname = usePathname();
  const { tokens, addVisitedPage, updateToken } = useDesignSystem();

  useEffect(() => {
    // Only track meaningful pages (not the secret one itself)
    if (pathname && !pathname.includes('/secret') && pathname !== '/multiverse-map') {
      addVisitedPage(pathname);
    }
  }, [pathname, addVisitedPage]);

  useEffect(() => {
    // Check for unlock condition
    if (!tokens.unlockedSecretUniverse && tokens.visitedPages.length >= EXPLORATION_THRESHOLD) {
      // In a real app we might want to specifically check if they visited 
      // universes, motion lab, etc., but threshold works for this demo.
      updateToken('unlockedSecretUniverse', true);
      // We could trigger a notification here, but we'll handle visual reveal 
      // in the specific components (Map and Switcher).
    }
  }, [tokens.visitedPages.length, tokens.unlockedSecretUniverse, updateToken]);
}
