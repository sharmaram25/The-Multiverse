'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useDesignSystem } from '@/lib/design-system-store';

export default function SpacingPage() {
  const { tokens } = useDesignSystem();

  const spacingScale = [
    { name: 'space-xs', scale: 0.25, description: 'Micro-spacing, icons, tight gaps' },
    { name: 'space-sm', scale: 0.5, description: 'Internal component padding, small gaps' },
    { name: 'space-md', scale: 1, description: 'Default gap, component spacing' },
    { name: 'space-lg', scale: 1.5, description: 'Section spacing, large gaps' },
    { name: 'space-xl', scale: 2, description: 'Page headers, loose containers' },
    { name: 'space-2xl', scale: 3, description: 'Hero section spacing' },
    { name: 'space-3xl', scale: 4, description: 'Large layout gaps' },
  ];

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-display">Spacing System</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          We use a base-16 spacing system. All layout gaps, paddings, and margins should ideally be multiples of our base unit.
        </p>
      </section>

      <section className="space-y-6">
        {spacingScale.map((item, i) => {
          const size = tokens.spacing * item.scale;
          return (
            <motion.div 
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border bg-card flex items-center gap-8"
            >
              <div 
                className="bg-primary/20 rounded-md border border-primary/30 flex-shrink-0"
                style={{ width: `${size}px`, height: `${size}px` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <span className="text-xs font-mono text-muted-foreground">{size}px / {item.scale}rem</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      <section className="p-12 rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-center">
        <div className="flex gap-4 mb-8">
          <div className="w-16 h-16 bg-muted rounded-xl" />
          <div 
            className="h-16 bg-primary/20 border border-primary/30 rounded-xl"
            style={{ width: `${tokens.spacing}px` }}
          />
          <div className="w-16 h-16 bg-muted rounded-xl" />
        </div>
        <h3 className="text-xl font-bold mb-2">Visual Consistency</h3>
        <p className="text-muted-foreground max-w-sm">
          By adhering to the spacing scale, we ensure that every world in the multiverse feels balanced and intentional.
        </p>
      </section>
    </div>
  );
}
