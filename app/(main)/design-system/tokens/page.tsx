'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useDesignSystem } from '@/lib/design-system-store';

export default function TokensPage() {
  const { tokens } = useDesignSystem();

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-display">Design Tokens</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Tokens are the smallest building blocks of our design system. They represent the shared language between design and engineering.
        </p>
      </section>

      {/* Color Tokens */}
      <section id="colors" className="space-y-8">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold">Color Tokens</h2>
          <p className="text-muted-foreground mt-1">Foundational colors used across all universes.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Primary', value: tokens.primary, token: '--primary' },
            { label: 'Accent', value: tokens.accent, token: '--accent' },
            { label: 'Background', value: tokens.background, token: '--bg' },
            { label: 'Foreground', value: tokens.foreground, token: '--fg' },
            { label: 'Muted', value: tokens.muted, token: '--muted' },
            { label: 'Border', value: tokens.border, token: '--border' },
          ].map((color) => (
            <div key={color.label} className="p-4 rounded-xl border bg-card flex flex-col gap-4">
              <div 
                className="h-24 rounded-lg border shadow-inner" 
                style={{ backgroundColor: color.value }} 
              />
              <div>
                <h3 className="font-bold">{color.label}</h3>
                <p className="text-sm font-mono text-muted-foreground">{color.token}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-mono uppercase bg-muted px-2 py-1 rounded">{color.value}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(color.value)}
                    className="text-xs text-primary hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing Tokens */}
      <section id="spacing" className="space-y-8">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold">Spacing Scale</h2>
          <p className="text-muted-foreground mt-1">Linear spacing scale for consistent layouts.</p>
        </div>
        
        <div className="space-y-4">
          {[0.25, 0.5, 1, 1.5, 2, 3, 4].map((scale) => {
            const size = tokens.spacing * scale;
            return (
              <div key={scale} className="flex items-center gap-6 p-4 rounded-xl border bg-card/50">
                <div className="w-20 font-mono text-sm">{(scale * 4).toFixed(1)}u ({size}px)</div>
                <div className="flex-1 bg-primary/10 rounded overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: size }}
                    className="h-4 bg-primary"
                  />
                </div>
                <div className="text-xs text-muted-foreground">space-{scale * 4}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Radius Tokens */}
      <section id="radius" className="space-y-8">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold">Border Radius</h2>
          <p className="text-muted-foreground mt-1">Geometry tokens for component shapes.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Small', value: tokens.radius / 2, token: 'radius-sm' },
            { label: 'Medium', value: tokens.radius, token: 'radius-md' },
            { label: 'Large', value: tokens.radius * 2, token: 'radius-lg' },
            { label: 'Full', value: 9999, token: 'radius-full' },
          ].map((r) => (
            <div key={r.label} className="p-6 rounded-xl border bg-card flex flex-col items-center gap-4 text-center">
              <div 
                className="w-16 h-16 bg-primary/20 border-2 border-primary" 
                style={{ borderRadius: `${r.value}px` }}
              />
              <div>
                <h3 className="font-bold">{r.label}</h3>
                <p className="text-xs font-mono text-muted-foreground">{r.value === 9999 ? '9999px' : `${r.value}px`}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
