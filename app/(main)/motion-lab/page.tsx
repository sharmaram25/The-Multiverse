'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { Parallax } from '@/components/motion/parallax';
import { Magnetic } from '@/components/motion/magnetic';
import { Elastic } from '@/components/motion/elastic';
import { Interactive } from '@/components/motion/cursor';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export default function MotionLabPage() {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen pb-32">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="h-[80vh] flex flex-col items-center justify-center relative overflow-hidden px-6">
        <Parallax offset={100} className="absolute inset-0 z-0 flex items-center justify-center opacity-20">
          <div className="w-[800px] h-[800px] rounded-full bg-primary/30 blur-[100px]" />
        </Parallax>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 font-display"
          >
            Motion Lab
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground"
          >
            A gallery of complex motion design and animation systems.
          </motion.p>
        </div>
      </section>

      {/* Scroll Reveal System */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal type="fade" className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Scroll Reveal System</h2>
          <p className="text-xl text-muted-foreground">Elements animate into view as you scroll.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal type="fade" delay={0.1}>
            <div className="h-64 rounded-2xl bg-card border border-border flex items-center justify-center p-8 text-center">
              <h3 className="text-2xl font-bold">Fade Up</h3>
            </div>
          </ScrollReveal>
          <ScrollReveal type="scale" delay={0.2}>
            <div className="h-64 rounded-2xl bg-card border border-border flex items-center justify-center p-8 text-center">
              <h3 className="text-2xl font-bold">Scale In</h3>
            </div>
          </ScrollReveal>
          <ScrollReveal type="slide" delay={0.3}>
            <div className="h-64 rounded-2xl bg-card border border-border flex items-center justify-center p-8 text-center">
              <h3 className="text-2xl font-bold">Slide Reveal</h3>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Parallax Layers */}
      <section className="py-32 relative overflow-hidden bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal type="fade" className="mb-24 relative z-20">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Parallax Motion</h2>
            <p className="text-xl text-muted-foreground">Multiple depth layers moving at different speeds.</p>
          </ScrollReveal>

          <div className="relative h-[60vh] rounded-3xl overflow-hidden border border-border bg-background flex items-center justify-center">
            <Parallax offset={150} className="absolute inset-0 z-0 flex items-center justify-center">
              <div className="text-[20rem] font-black opacity-5 select-none">BACKGROUND</div>
            </Parallax>
            
            <Parallax offset={50} className="absolute z-10 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
            </Parallax>

            <Parallax offset={-50} className="relative z-20">
              <div className="p-8 rounded-2xl bg-card/80 backdrop-blur-md border border-border shadow-2xl">
                <h3 className="text-3xl font-bold mb-2">Foreground UI</h3>
                <p className="text-muted-foreground">This element moves faster than the background.</p>
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* Magnetic & Elastic */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal type="fade" className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Physics-Based Hover</h2>
          <p className="text-xl text-muted-foreground">Magnetic attraction and elastic stretching.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-card border border-border">
            <h3 className="text-2xl font-bold mb-12">Magnetic Button</h3>
            <Interactive>
              <Magnetic strength={0.4}>
                <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium text-lg shadow-lg">
                  Hover Me
                </button>
              </Magnetic>
            </Interactive>
          </div>

          <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-card border border-border">
            <h3 className="text-2xl font-bold mb-12">Elastic Card</h3>
            <Interactive>
              <Elastic>
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary/80 to-primary shadow-xl flex items-center justify-center text-primary-foreground font-bold text-xl cursor-pointer">
                  Stretch Me
                </div>
              </Elastic>
            </Interactive>
          </div>
        </div>
      </section>

      {/* Infinite Marquee */}
      <section className="py-24 overflow-hidden bg-primary text-primary-foreground">
        <div className="flex whitespace-nowrap">
          <motion.div 
            className="flex gap-8 text-6xl md:text-8xl font-black font-display uppercase tracking-tighter"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <span>UI ENGINEERING</span>
            <span>•</span>
            <span>MOTION DESIGN</span>
            <span>•</span>
            <span>INTERACTION</span>
            <span>•</span>
            <span>PERFORMANCE</span>
            <span>•</span>
            <span>UI ENGINEERING</span>
            <span>•</span>
            <span>MOTION DESIGN</span>
            <span>•</span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
