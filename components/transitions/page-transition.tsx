'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useTransition } from './transition-context';
import { CurtainTransition } from './curtain-transition';
import { SplitTransition } from './split-transition';
import { GradientTransition } from './gradient-transition';
import { PortalTransition } from './portal-transition';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { transitionType, setIsTransitioning } = useTransition();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Reset scroll position on pathname change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Set isTransitioning to true when pathname changes
    setIsTransitioning(true);

    if (shouldReduceMotion) {
      // If reduced motion, we don't have an overlay to trigger onExitComplete
      const timeout = setTimeout(() => setIsTransitioning(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [pathname, setIsTransitioning, shouldReduceMotion]);

  const renderTransitionOverlay = () => {
    if (shouldReduceMotion) return null;

    switch (transitionType) {
      case 'curtain':
        return <CurtainTransition key={`overlay-${pathname}`} />;
      case 'split':
        return <SplitTransition key={`overlay-${pathname}`} />;
      case 'gradient':
        return <GradientTransition key={`overlay-${pathname}`} />;
      case 'portal':
        return <PortalTransition key={`overlay-${pathname}`} />;
      default:
        return <CurtainTransition key={`overlay-${pathname}`} />;
    }
  };

  // The overlay animations take 0.4s to cover the screen.
  const exitDuration = 0.4;

  return (
    <>
      {/* Overlay: Mode="wait" is fine here because it's distinct from content */}
      <AnimatePresence mode="wait" onExitComplete={() => setIsTransitioning(false)}>
        {renderTransitionOverlay()}
      </AnimatePresence>
      
      {/* 
          Content: REMOVED mode="wait". 
          Waiting for the old page to exit while the overlay is ALSO waiting for an exit 
          created a race condition that locked navigation. 
          New content now mounts immediately behind the overlay.
      */}
      <AnimatePresence>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1, 
            transition: { duration: 0.3, delay: 0.1 } // Slight delay to let overlay start
          }}
          exit={{ 
            opacity: 0,
            transition: { duration: exitDuration } 
          }} 
          className="flex-1 w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
