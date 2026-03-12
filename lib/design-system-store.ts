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
}

interface DesignSystemState {
  tokens: DesignTokens;
  updateToken: <K extends keyof DesignTokens>(key: K, value: DesignTokens[K]) => void;
  resetTokens: () => void;
  addVisitedPage: (path: string) => void;
  incrementSecretTrigger: () => void;
}

const defaultTokens: DesignTokens = {
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
};

export const useDesignSystem = create<DesignSystemState>()(
  persist(
    (set) => ({
      tokens: defaultTokens,
      updateToken: (key, value) => 
        set((state) => ({
          tokens: { ...state.tokens, [key]: value }
        })),
      resetTokens: () => set({ tokens: defaultTokens }),
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
    }
  )
);
