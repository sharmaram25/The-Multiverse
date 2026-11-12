'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/** 'none' is the default for everyday navigation; the others are reserved for moments that merit them. */
export type TransitionType = 'none' | 'curtain' | 'split' | 'gradient' | 'portal';

interface TransitionContextType {
  transitionType: TransitionType;
  setTransitionType: (type: TransitionType) => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [transitionType, setTransitionType] = useState<TransitionType>('none');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSetTransitionType = useCallback((type: TransitionType) => {
    setTransitionType(type);
  }, []);

  const handleSetIsTransitioning = useCallback((value: boolean) => {
    setIsTransitioning(value);
  }, []);

  const contextValue = useMemo(
    () => ({
      transitionType,
      setTransitionType: handleSetTransitionType,
      isTransitioning,
      setIsTransitioning: handleSetIsTransitioning,
    }),
    [transitionType, handleSetTransitionType, isTransitioning, handleSetIsTransitioning]
  );

  return (
    <TransitionContext.Provider value={contextValue}>
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
