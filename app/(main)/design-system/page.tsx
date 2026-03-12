'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Box, Palette, Type, MousePointer2, Activity } from 'lucide-react';
import Link from 'next/link';
import { useDesignSystem } from '@/lib/design-system-store';
import { cn } from '@/lib/utils';

export default function DesignSystemOverview() {
  const { tokens, updateToken } = useDesignSystem();

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold tracking-tight font-display"
        >
          Design System
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-2xl"
        >
          The foundations and building blocks powering The Multiverse. A scalable, token-driven architecture designed for motion and interaction.
        </motion.p>

        {/* Motion Inspector Toggle */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 w-fit">
           <div className="p-2 bg-primary/10 text-primary rounded-lg">
             <Activity size={20} />
           </div>
           <div>
             <h4 className="text-sm font-bold">Motion Inspector</h4>
             <p className="text-[10px] text-muted-foreground">Debug animations globally</p>
           </div>
           <button 
             onClick={() => updateToken('showInspector', !tokens.showInspector)}
             className={cn(
               "ml-4 w-12 h-6 rounded-full relative transition-colors duration-300",
               tokens.showInspector ? "bg-primary" : "bg-muted"
             )}
           >
             <motion.div 
               animate={{ x: tokens.showInspector ? 24 : 4 }}
               className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" 
             />
           </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            title: "Foundations", 
            description: "Tokens for colors, typography, spacing, and motion that define our visual language.",
            icon: Palette,
            link: "/design-system/tokens"
          },
          { 
            title: "Components", 
            description: "Reusable UI components built with accessibility and physics-based motion in mind.",
            icon: Box,
            link: "/design-system/components"
          },
          { 
            title: "Accessibility", 
            description: "Our philosophy and implementation of inclusive design patterns.",
            icon: MousePointer2,
            link: "/design-system/accessibility"
          },
          { 
            title: "Design Principles", 
            description: "System thinking, engineering maturity, and the philosophies behind the multiverse.",
            icon: Type,
            link: "#"
          },
        ].map((item, i) => (
          <Link key={item.title} href={item.link}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all group"
            >
              <item.icon className="mb-6 text-primary" size={32} />
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground mb-6">{item.description}</p>
              <div className="flex items-center text-primary font-medium">
                Learn more <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </div>
            </motion.div>
          </Link>
        ))}
      </section>
    </div>
  );
}
