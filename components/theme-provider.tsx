'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'minimal' | 'glass' | 'neon' | 'brutalist';

export const THEMES: Theme[] = ['minimal', 'glass', 'neon', 'brutalist'];

const isTheme = (value: unknown): value is Theme => typeof value === 'string' && (THEMES as string[]).includes(value);

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Owns the active universe. Each universe is a complete, contrast-checked
 * palette defined in globals.css — nothing here overrides those variables, so
 * every universe renders exactly as designed.
 *
 * Design tokens edited in the Playground are applied only inside the
 * Playground preview and Builder canvas, never to the app chrome.
 *
 * A `?universe=<id>` query parameter selects a universe, making any page
 * shareable in a specific universe.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('minimal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial: Theme | null = null;
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('universe');
      if (isTheme(fromUrl)) initial = fromUrl;
      else {
        const saved = localStorage.getItem('multiverse-theme');
        if (isTheme(saved)) initial = saved;
      }
    } catch {
      // storage unavailable — fall back to default
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) setThemeState(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove(...THEMES);
    root.classList.add(theme);
    root.dataset.universe = theme;
    root.style.colorScheme = theme === 'glass' || theme === 'neon' ? 'dark' : 'light';

    // Clear inline token overrides written by earlier versions of the app.
    ['--primary', '--accent', '--bg', '--fg', '--muted', '--border', '--radius-md', '--radius-lg', '--radius-sm'].forEach((v) =>
      root.style.removeProperty(v)
    );

    try { localStorage.setItem('multiverse-theme', theme); } catch { /* ignore */ }
  }, [theme, mounted]);

  const setTheme = useCallback((next: Theme) => {
    if (isTheme(next)) setThemeState(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <div
        className="flex-1 flex flex-col min-h-screen w-full"
        style={{ visibility: mounted ? 'visible' : 'hidden' }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
