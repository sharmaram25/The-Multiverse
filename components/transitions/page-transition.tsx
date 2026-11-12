'use client';


import { useSafeReducedMotion } from '@/lib/hooks/use-safe-reduced-motion';import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence} from 'motion/react';
import { usePathname } from 'next/navigation';
import { useTransition, type TransitionType } from './transition-context';
import { CurtainTransition } from './curtain-transition';
import { SplitTransition } from './split-transition';
import { GradientTransition } from './gradient-transition';
import { PortalTransition } from './portal-transition';

const OVERLAY_MS = 900;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { transitionType, setTransitionType, setIsTransitioning } = useTransition();
  const prefersReduced = useSafeReducedMotion();
  const [overlay, setOverlay] = useState<{ type: Exclude<TransitionType, 'none'>; key: string } | null>(null);
  const isFirst = useRef(true);
  // Read the requested transition at navigation time without re-running the effect when it changes.
  const requested = useRef(transitionType);
  useEffect(() => { requested.current = transitionType; }, [transitionType]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (isFirst.current) { isFirst.current = false; return; } // never animate the initial load

    const type = requested.current;
    setTransitionType('none'); // special transitions apply to one navigation only
    if (type === 'none' || prefersReduced) return;

    // One-shot overlay: plays its reveal on arrival, then is removed without an exit animation.
    setOverlay({ type, key: pathname });
    setIsTransitioning(true);
    const t = setTimeout(() => { setOverlay(null); setIsTransitioning(false); }, OVERLAY_MS);
    return () => clearTimeout(t);
  }, [pathname, prefersReduced, setIsTransitioning, setTransitionType]);

  const renderOverlay = () => {
    if (!overlay) return null;
    switch (overlay.type) {
      case 'curtain': return <CurtainTransition key={overlay.key} />;
      case 'split': return <SplitTransition key={overlay.key} />;
      case 'gradient': return <GradientTransition key={overlay.key} />;
      case 'portal': return <PortalTransition key={overlay.key} />;
    }
  };

  return (
    <>
      {renderOverlay()}

      {/* The outgoing page leaves immediately so two pages are never stacked in the layout. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.18, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          className="flex-1 w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
