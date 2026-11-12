'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

type Theme = 'minimal' | 'glass' | 'neon' | 'brutalist';

interface UniverseProviderProps {
  theme: Theme;
  children: React.ReactNode;
  className?: string;
  tokensOverride?: Record<string, string | number>;
}

/**
 * UniverseProvider allows for scoped theming.
 * It applies the theme class and CSS variable overrides to its container.
 */
export function UniverseProvider({ theme, children, className, tokensOverride }: UniverseProviderProps) {
  const style = useMemo(() => {
    if (!tokensOverride) return {};
    
    const vars: Record<string, string> = {};
    Object.entries(tokensOverride).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}`;
      vars[cssVar] = typeof value === 'number' && !['animation-speed', 'motion-speed'].includes(key.replace(/[A-Z]/g, m => "-" + m.toLowerCase())) 
        ? `${value}px` 
        : String(value);
    });
    return vars;
  }, [tokensOverride]);

  return (
    <div 
      className={cn(theme, "contents-container h-full w-full overflow-auto bg-background text-foreground", className)}
      style={style as React.CSSProperties}
    >
      {children}
    </div>
  );
}
