'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Info, Square, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ComponentsPage() {
  const [activeTab, setActiveTab] = useState('button');

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-display">Components</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Modular, accessible, and reactive building blocks. Each component is designed to work across all universes.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {['button', 'card', 'input', 'badge'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all relative capitalize",
              activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'button' && <ButtonDocs />}
      {activeTab !== 'button' && (
        <div className="p-12 rounded-3xl border border-dashed text-center flex flex-col items-center">
          <Info className="mb-4 text-muted-foreground" size={32} />
          <h3 className="text-xl font-bold mb-2">Documentation in Progress</h3>
          <p className="text-muted-foreground">This section is currently being expanded. Check back soon.</p>
        </div>
      )}
    </div>
  );
}

function ButtonDocs() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Anatomy */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold">Button Anatomy</h3>
        <div className="relative p-12 rounded-3xl bg-muted/30 border border-border flex items-center justify-center overflow-hidden">
          <div className="relative p-1 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 pr-4 shadow-xl">
             {/* Labels */}
             <div className="absolute -top-8 left-2 flex flex-col items-center">
               <span className="text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded">ICON</span>
               <div className="w-px h-4 bg-foreground" />
             </div>
             <div className="absolute -bottom-8 right-8 flex flex-col items-center">
               <div className="w-px h-4 bg-foreground" />
               <span className="text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded">LABEL</span>
             </div>

             <div className="p-2 bg-white/20 rounded-md">
               <Play size={16} fill="currentColor" />
             </div>
             <span className="font-bold">Primary Action</span>
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold">Variants</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border bg-card flex flex-col items-center gap-4">
             <button className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg">Primary</button>
             <span className="text-xs text-muted-foreground">High emphasis</span>
          </div>
          <div className="p-6 rounded-2xl border bg-card flex flex-col items-center gap-4">
             <button className="px-6 py-2 border-2 border-foreground font-bold rounded-lg">Outline</button>
             <span className="text-xs text-muted-foreground">Medium emphasis</span>
          </div>
          <div className="p-6 rounded-2xl border bg-card flex flex-col items-center gap-4">
             <button className="px-6 py-2 text-primary font-bold hover:bg-primary/10 rounded-lg">Ghost</button>
             <span className="text-xs text-muted-foreground">Low emphasis</span>
          </div>
        </div>
      </section>

      {/* Interaction States */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold">Interaction States</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Default', className: 'opacity-100' },
            { label: 'Hover', className: ' brightness-110 shadow-xl -translate-y-0.5' },
            { label: 'Pressed', className: 'scale-95 opacity-90' },
            { label: 'Disabled', className: 'opacity-50 grayscale cursor-not-allowed' },
          ].map((state) => (
            <div key={state.label} className="p-4 rounded-xl border flex flex-col items-center gap-3">
               <button className={cn("px-4 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg transition-all", state.className)}>Button</button>
               <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{state.label}</span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
