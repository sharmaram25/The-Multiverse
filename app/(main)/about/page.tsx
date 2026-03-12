'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Layers, Cpu, Zap, Github, Instagram, Linkedin, Globe } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">About The Multiverse</h1>
        <p className="text-xl text-muted-foreground">
          Exploring the intersection of design, engineering, and motion.
        </p>
      </motion.div>

      <div className="space-y-24">
        {/* Concept Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <h2 className="text-3xl font-bold mb-6 font-display">The Concept</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The Multiverse is not just a component library; it is an exploration of interface design philosophies. Each &quot;universe&quot; represents a distinct visual language—from the stark utility of Brutalism to the deep, atmospheric layers of Glassmorphism.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By isolating these design languages into their own universes, we can study how typography, spacing, color, and motion interact to create entirely different emotional responses, while maintaining the same underlying functional architecture.
            </p>
          </motion.div>
        </section>

        {/* Engineering Approach Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 font-display">Engineering Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Component Architecture</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Built with modularity in mind. Components are designed to be highly reusable, accessible, and easily composable to build complex interfaces without technical debt.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Cpu size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Performance First</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Optimized for speed. Utilizing Next.js App Router, server components where possible, lazy loading, and minimal bundle sizes to ensure a Lighthouse score of 95+.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Motion Design</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Fluid, physics-based animations powered by Framer Motion. Animations rely strictly on transform and opacity to avoid layout thrashing and maintain 60fps.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Hidden Features Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl bg-black border border-[#0f0]/30 shadow-[0_0_30px_rgba(0,255,0,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Zap size={120} className="text-[#0f0]" />
            </div>
            
            <h2 className="text-3xl font-bold mb-6 font-mono text-[#0f0]">Hidden Dimensions</h2>
            <p className="text-zinc-400 leading-relaxed mb-6 font-mono text-sm">
              The Multiverse contains encrypted layers only accessible to those who look beyond the surface. These &quot;Secret Universes&quot; operate on an independent design protocol, bypassing the standard interface restrictions.
            </p>
            <ul className="space-y-4 text-sm font-mono text-zinc-500">
               <li className="flex items-start gap-3">
                  <span className="text-[#0f0] mt-1">•</span>
                  <span><strong>Terminal Access:</strong> Experienced explorers may find terminal entries hidden in plain sight.</span>
               </li>
               <li className="flex items-start gap-3">
                  <span className="text-[#0f0] mt-1">•</span>
                  <span><strong>Konami Sequence:</strong> A classic sequence may reveal the core kernel.</span>
               </li>
               <li className="flex items-start gap-3">
                  <span className="text-[#0f0] mt-1">•</span>
                  <span><strong>Secret Nodes:</strong> The Discovery Map contains coordinates to dimensions that don&apos;t exist on the standard grid.</span>
               </li>
            </ul>
          </motion.div>
        </section>

        {/* Developer Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl bg-muted/50 border border-border flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden relative border-4 border-background shadow-xl shrink-0">
              <Image src="https://picsum.photos/seed/ram/200/200" alt="Ram Sharma" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Built by Ram Sharma</h2>
              <p className="text-muted-foreground mb-6 max-w-lg leading-relaxed">
                Frontend engineer exploring the intersection of design and engineering. Passionate about creating fluid, accessible, and performant user interfaces.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/sharmaram25" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                  <Github size={18} /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/ram-sharma-20rs02/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                  <Linkedin size={18} /> LinkedIn
                </a>
                <a href="https://www.instagram.com/ramsharma.25/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                  <Instagram size={18} /> Instagram
                </a>
                <a href="https://portfolio-ram-sharma.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                  <Globe size={18} /> Portfolio
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
