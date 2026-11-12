'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DesignTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  radius: number;
  spacing: number;
  motionSpeed: number;
  animationSpeed: number;
  isPaused: boolean;
  showInspector: boolean;
  showBoundaries: boolean;
  unlockedSecretUniverse: boolean;
  visitedPages: string[];
  secretTriggersActive: number;
  motionEasing: 'easeIn' | 'easeOut' | 'easeInOut' | 'linear' | 'spring';
  fontFamily: string;
  headingScale: number;
}

interface DesignSystemState {
  tokens: DesignTokens;
  updateToken: <K extends keyof DesignTokens>(key: K, value: DesignTokens[K]) => void;
  resetTokens: () => void;
  /** Applies several token values at once (used by presets and share links). */
  setTokens: (partial: Partial<DesignTokens>) => void;
  addVisitedPage: (path: string) => void;
  incrementSecretTrigger: () => void;
}

export const defaultTokens: DesignTokens = {
  primary: '#4f46e5',
  secondary: '#7c3aed',
  accent: '#f43f5e',
  background: '#ffffff',
  foreground: '#111111',
  muted: '#f4f4f5',
  border: '#e4e4e7',
  radius: 8,
  spacing: 16,
  motionSpeed: 1,
  animationSpeed: 1,
  isPaused: false,
  showInspector: false,
  showBoundaries: false,
  unlockedSecretUniverse: false,
  visitedPages: [],
  secretTriggersActive: 0,
  motionEasing: 'easeInOut',
  fontFamily: 'Inter',
  headingScale: 1.25,
};

export const useDesignSystem = create<DesignSystemState>()(
  persist(
    (set) => ({
      tokens: defaultTokens,
      updateToken: (key, value) =>
        set((state) => ({
          tokens: { ...state.tokens, [key]: value }
        })),
      // Reset design values only — exploration progress and unlocks are kept.
      resetTokens: () => set((state) => ({
        tokens: {
          ...defaultTokens,
          unlockedSecretUniverse: state.tokens.unlockedSecretUniverse,
          visitedPages: state.tokens.visitedPages,
          secretTriggersActive: state.tokens.secretTriggersActive,
        },
      })),
      setTokens: (partial) => set((state) => ({ tokens: { ...state.tokens, ...partial } })),
      addVisitedPage: (path) => set((state) => {
        if (state.tokens.visitedPages.includes(path)) return state;
        return {
          tokens: {
            ...state.tokens,
            visitedPages: [...state.tokens.visitedPages, path]
          }
        };
      }),
      incrementSecretTrigger: () => set((state) => ({
        tokens: {
          ...state.tokens,
          secretTriggersActive: state.tokens.secretTriggersActive + 1
        }
      })),
    }),
    {
      name: 'multiverse-design-system',
      version: 2,
      migrate: (persisted) => persisted as DesignSystemState,
      // Saved state from older versions may lack newer fields — fill from defaults.
      merge: (persisted, current) => {
        const saved = (persisted as Partial<DesignSystemState> | undefined)?.tokens;
        return {
          ...current,
          tokens: { ...defaultTokens, ...(saved && typeof saved === 'object' ? saved : {}) },
        };
      },
    }
  )
);
