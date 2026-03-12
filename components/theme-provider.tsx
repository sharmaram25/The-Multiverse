'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDesignSystem } from '@/lib/design-system-store';

export type Theme = 'minimal' | 'glass' | 'neon' | 'brutalist';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('minimal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('multiverse-theme') as Theme;
    if (savedTheme && ['minimal', 'glass', 'neon', 'brutalist'].includes(savedTheme)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(savedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    root.classList.remove('minimal', 'glass', 'neon', 'brutalist');
    root.classList.add(theme);
    
    localStorage.setItem('multiverse-theme', theme);
  }, [theme, mounted]);

  // Handle Design System Overrides
  const { tokens } = useDesignSystem();
  
  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    
    // Apply overrides
    root.style.setProperty('--primary', tokens.primary);
    root.style.setProperty('--accent', tokens.accent);
    root.style.setProperty('--bg', tokens.background);
    root.style.setProperty('--fg', tokens.foreground);
    root.style.setProperty('--muted', tokens.muted);
    root.style.setProperty('--border', tokens.border);
    root.style.setProperty('--radius-md', `${tokens.radius}px`);
    root.style.setProperty('--radius-lg', `${tokens.radius * 2}px`);
    root.style.setProperty('--radius-sm', `${tokens.radius / 2}px`);
    
    // Motion Speed and Easing would be handled in components via the hook
    // But we can set a root transition duration if needed
  }, [tokens, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div 
        className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out"
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
