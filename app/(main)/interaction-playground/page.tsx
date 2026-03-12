'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { Tilt } from '@/components/motion/tilt';
import { Interactive, useCursor } from '@/components/motion/cursor';
import { cn } from '@/lib/utils';

export default function InteractionPlaygroundPage() {
  const { setCursorState } = useCursor();
  const [gridCells, setGridCells] = useState(Array(100).fill(0));

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section */}
      <section className="h-[60vh] flex flex-col items-center justify-center relative overflow-hidden px-6">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 font-display"
          >
            Playground
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground"
          >
            Advanced interaction mechanics and physics-based UI.
          </motion.p>
        </div>
      </section>

      {/* 3D Tilt Cards */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal type="fade" className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">3D Tilt Cards</h2>
          <p className="text-xl text-muted-foreground">Cards tilt based on cursor position.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <Interactive>
            <Tilt className="w-full h-96 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex flex-col items-center justify-center text-white p-8">
              <div 
                style={{ transform: "translateZ(50px)" }}
                className="text-4xl font-bold mb-4"
              >
                Hover Me
              </div>
              <div 
                style={{ transform: "translateZ(30px)" }}
                className="text-lg opacity-80 text-center"
              >
                The content floats above the background.
              </div>
            </Tilt>
          </Interactive>
          
          <Interactive>
            <Tilt className="w-full h-96 rounded-3xl bg-card border border-border shadow-xl flex flex-col items-center justify-center p-8">
              <div 
                style={{ transform: "translateZ(50px)" }}
                className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary" />
              </div>
              <div 
                style={{ transform: "translateZ(30px)" }}
                className="text-2xl font-bold"
              >
                Floating Elements
              </div>
            </Tilt>
          </Interactive>
        </div>
      </section>

      {/* Drag Interactions */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-muted/30 rounded-3xl overflow-hidden">
        <ScrollReveal type="fade" className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Drag Physics</h2>
          <p className="text-xl text-muted-foreground">Elements can be dragged within boundaries.</p>
        </ScrollReveal>

        <div className="relative w-full h-[500px] border-2 border-dashed border-border rounded-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-6xl font-black uppercase tracking-widest">Drag Area</span>
          </div>
          
          <motion.div
            drag
            dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
            dragElastic={0.2}
            whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
            onDragStart={() => setCursorState('drag')}
            onDragEnd={() => setCursorState('default')}
            className="w-48 h-48 bg-primary rounded-2xl shadow-2xl flex items-center justify-center text-primary-foreground font-bold text-xl cursor-grab z-10"
          >
            Drag Me
          </motion.div>

          <motion.div
            drag
            dragConstraints={{ left: -200, right: 200, top: -150, bottom: 150 }}
            dragElastic={0.5}
            whileDrag={{ scale: 1.1, rotate: 10, cursor: 'grabbing' }}
            onDragStart={() => setCursorState('drag')}
            onDragEnd={() => setCursorState('default')}
            className="absolute top-10 left-10 w-32 h-32 bg-secondary rounded-full shadow-xl flex items-center justify-center text-secondary-foreground font-bold cursor-grab z-10"
          >
            Bouncy
          </motion.div>
        </div>
      </section>

      {/* Interactive Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal type="fade" className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Interactive Grid</h2>
          <p className="text-xl text-muted-foreground">Cells respond dynamically to hover.</p>
        </ScrollReveal>

        <div className="grid grid-cols-10 gap-1 md:gap-2 max-w-3xl mx-auto">
          {gridCells.map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.5, backgroundColor: 'hsl(var(--primary))', zIndex: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="aspect-square bg-muted rounded-md cursor-pointer"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
