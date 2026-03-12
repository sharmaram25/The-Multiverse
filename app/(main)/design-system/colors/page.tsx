'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useDesignSystem } from '@/lib/design-system-store';

export default function ColorsPage() {
  const { tokens } = useDesignSystem();

  const palettes = [
    {
      name: 'Brand Colors',
      description: 'The primary colors that define our identity.',
      colors: [
        { label: 'Primary', value: tokens.primary, token: '--primary' },
        { label: 'Accent', value: tokens.accent, token: '--accent' },
      ]
    },
    {
      name: 'Neutral Palette',
      description: 'Used for text, backgrounds, and subtle borders.',
      colors: [
        { label: 'Background', value: tokens.background, token: '--bg' },
        { label: 'Foreground', value: tokens.foreground, token: '--fg' },
        { label: 'Muted', value: tokens.muted, token: '--muted' },
        { label: 'Border', value: tokens.border, token: '--border' },
      ]
    }
  ];

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-display">Colors</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          A vibrant yet balanced color system tailored for high-performance interfaces and expressive motion.
        </p>
      </section>

      {palettes.map((palette) => (
        <section key={palette.name} className="space-y-8">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">{palette.name}</h2>
            <p className="text-muted-foreground mt-1">{palette.description}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {palette.colors.map((color) => (
              <div key={color.label} className="group p-4 rounded-xl border bg-card flex flex-col gap-4 hover:border-primary/50 transition-all">
                <div 
                  className="h-32 rounded-lg border shadow-inner transition-transform group-hover:scale-[1.02]" 
                  style={{ backgroundColor: color.value }} 
                />
                <div>
                  <h3 className="font-bold">{color.label}</h3>
                  <p className="text-xs font-mono text-muted-foreground mb-3">{color.token}</p>
                  <div className="flex bg-muted rounded-md p-1.5 justify-between items-center">
                    <span className="text-[10px] font-mono uppercase font-bold">{color.value}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(color.value)}
                      className="text-[10px] font-bold text-primary hover:underline hover:scale-110 transition-transform"
                    >
                      COPY
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="p-8 rounded-3xl bg-primary text-primary-foreground">
        <h3 className="text-xl font-bold mb-2">Dynamic Theming</h3>
        <p className="opacity-90">
          Our color system is fully reactive. Changes made in the <strong>Design Playground</strong> update these tokens globally across all components and universes in real-time.
        </p>
      </section>
    </div>
  );
}
