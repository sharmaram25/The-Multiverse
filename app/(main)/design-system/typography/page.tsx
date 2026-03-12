'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useDesignSystem } from '@/lib/design-system-store';

export default function TypographyPage() {
  const { tokens } = useDesignSystem();

  const styles = [
    { label: 'H1 Display', size: 'text-6xl md:text-8xl', weight: 'font-black', tracking: 'tracking-tighter', font: 'font-display' },
    { label: 'H2 Heading', size: 'text-4xl md:text-5xl', weight: 'font-bold', tracking: 'tracking-tight', font: 'font-display' },
    { label: 'H3 Subheading', size: 'text-2xl md:text-3xl', weight: 'font-semibold', tracking: 'tracking-tight', font: 'font-display' },
    { label: 'Body Large', size: 'text-xl', weight: 'font-normal', tracking: 'tracking-normal', font: 'font-sans' },
    { label: 'Body Standard', size: 'text-base', weight: 'font-normal', tracking: 'tracking-normal', font: 'font-sans' },
    { label: 'Caption', size: 'text-sm', weight: 'font-medium', tracking: 'tracking-wide', font: 'font-sans' },
    { label: 'Mono / Code', size: 'text-sm', weight: 'font-medium', tracking: 'tracking-tight', font: 'font-mono' },
  ];

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-display">Typography</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Our typography system is built on a modular scale, ensuring hierarchy and legibility across all viewport sizes.
        </p>
      </section>

      <section className="space-y-12">
        {styles.map((style, i) => (
          <motion.div 
            key={style.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="flex justify-between items-end mb-4 border-b pb-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{style.label}</span>
              <span className="text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {style.size} {style.weight}
              </span>
            </div>
            <p className={`${style.size} ${style.weight} ${style.tracking} ${style.font} leading-none`}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </motion.div>
        ))}
      </section>

      <section className="p-8 rounded-3xl bg-muted/50 border border-border">
        <h3 className="text-xl font-bold mb-4">Responsive Scale</h3>
        <p className="text-muted-foreground mb-6">
          Headings automatically scale based on the viewport size using Tailwind's responsive prefixes.
        </p>
        <div className="flex gap-4">
          <div className="w-1/2 p-4 bg-card rounded-xl border">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">Mobile</span>
            <span className="text-3xl font-bold font-display">Heading</span>
          </div>
          <div className="w-1/2 p-4 bg-card rounded-xl border">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">Desktop</span>
            <span className="text-6xl font-bold font-display">Heading</span>
          </div>
        </div>
      </section>
    </div>
  );
}
