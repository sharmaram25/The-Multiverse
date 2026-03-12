'use client';

import React from 'react';
import { MotionConfig } from 'motion/react';
import { useDesignSystem } from '@/lib/design-system-store';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const { tokens } = useDesignSystem();

  // We set a default transition that can be overridden or used as a baseline.
  // Note: This won't automatically scale durations of components with explicit transitions
  // unless they are authored to multiply by tokens.animationSpeed.
  const globalTransition = {
    duration: 0.3 * (1 / tokens.animationSpeed),
    ease: tokens.motionEasing === 'spring' ? [0.43, 0.13, 0.23, 0.96] : tokens.motionEasing,
  } as any;

  return (
    <MotionConfig 
      transition={globalTransition}
      reducedMotion={tokens.isPaused ? "always" : "user"}
    >
      <div 
        style={{ 
          filter: tokens.isPaused ? 'grayscale(0.5)' : 'none',
          transition: 'filter 0.5s ease-in-out'
        }}
        className="contents-container"
      >
        {children}
      </div>
    </MotionConfig>
  );
}
