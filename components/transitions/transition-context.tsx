'use client';

import React, { createContext, useContext, useState } from 'react';

export type TransitionType = 'curtain' | 'split' | 'gradient' | 'portal';

interface TransitionContextType {
  transitionType: TransitionType;
  setTransitionType: (type: TransitionType) => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [transitionType, setTransitionType] = useState<TransitionType>('curtain');
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <TransitionContext.Provider value={{ transitionType, setTransitionType, isTransitioning, setIsTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}
