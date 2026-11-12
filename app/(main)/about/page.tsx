'use client';



import Link from 'next/link';import { SITE_GROUPS } from '@/lib/site-map';import React from 'react';
import { motion } from 'motion/react';
import { Layers, Cpu, Zap, Github, Instagram, Linkedin, Globe } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  const { theme } = useTheme();

  const sectionShellClass = cn(
    'p-8 md:p-12 border transition-colors',
    theme === 'glass'
      ? 'rounded-3xl bg-white/5 backdrop-blur-xl border-white/15'
      : theme === 'neon'
        ? 'rounded-none bg-card border-2 border-primary shadow-[0_0_18px_rgba(0,229,255,0.18)]'
        : theme === 'brutalist'
          ? 'rounded-none bg-card border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
          : 'rounded-3xl bg-card border-border'
  );

  const creatorShellClass = cn(
    'p-8 md:p-12 border relative overflow-hidden',
    theme === 'glass'
      ? 'rounded-3xl bg-white/5 backdrop-blur-xl border-white/20'
      : theme === 'neon'
        ? 'rounded-none bg-black border-2 border-primary shadow-[0_0_24px_rgba(0,229,255,0.28)]'
        : theme === 'brutalist'
          ? 'rounded-none bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'
          : 'rounded-3xl bg-card border-border'
  );

  const socialLinkClass = cn(
    'flex items-center gap-2 text-sm font-medium border px-3 py-2 transition-colors',
    theme === 'glass'
      ? 'rounded-full border-white/20 hover:bg-white/10'
      : theme === 'neon'
        ? 'rounded-none border-primary hover:bg-primary/10'
        : theme === 'brutalist'
          ? 'rounded-none border-2 border-black hover:bg-black hover:text-white'
          : 'rounded-lg border-border hover:bg-muted'
  );

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">About The Multiverse</h1>
        <p className="text-xl text-muted-foreground">
          A website planning workspace: scope the project, design the structure and system, verify accessibility and hand off production code.
        </p>
      </motion.div>

      <div className="space-y-14">
        {/* Concept Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={sectionShellClass}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-3xl font-bold mb-4 font-display">The Concept</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Multiverse is a decision-making environment for web teams. Instead of guessing what your marketing or product website should feel like, you can explore complete UI directions, interaction patterns, and layout systems in one place.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Each universe gives you a clear visual personality while keeping architecture and usability grounded. That helps teams align quickly and move into implementation with fewer unknowns.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  'Turn a discovery conversation into a written brief and estimate',
                  'Agree sitemap, page structure and design tokens before design starts',
                  'Verify contrast, readability and performance with real measurements',
                  'Export HTML, React, Tailwind and W3C tokens your engineers can use',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 p-3 border border-border/60 bg-background/40">
                    <span className="mt-1 text-primary">•</span>
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Engineering Approach Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 font-display">Engineering Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={sectionShellClass}>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Component Architecture</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Structured as reusable, composable blocks so teams can prototype common website sections and evolve them into production-ready systems.
                </p>
              </div>
              
              <div className={sectionShellClass}>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Cpu size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Performance First</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Built for fast iteration and fast runtime: route prefetching, lazy-loaded non-critical tools, and motion patterns that avoid jank.
                </p>
              </div>

              <div className={sectionShellClass}>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Motion Design</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Motion is treated as UX communication, not decoration. Interactions are tuned to guide users, reinforce hierarchy, and keep transitions smooth.
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
            className={sectionShellClass}
          >
            
            <h2 className="text-3xl font-bold mb-6 font-display">What&apos;s inside</h2>
            <div className="grid grid-cols-3 gap-3">
              {SITE_GROUPS.flatMap((g) => g.links).map((l) => (
                <Link key={l.path} href={l.path} className="group rounded-xl border border-border bg-background/60 p-4 transition-colors hover:bg-muted">
                  <span className="flex items-center gap-2 text-sm font-semibold"><l.icon size={15} /> {l.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{l.description}</span>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              <strong className="text-foreground">Privacy:</strong> there are no accounts, analytics or cookies. Everything you create is stored in your browser and leaves it only when you export it.
            </p>
          </motion.div>
        </section>

        {/* Creator Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={creatorShellClass}
          >
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="h-full w-full bg-gradient-to-br from-primary/20 via-transparent to-primary/5" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-center">
              <div className={cn(
                'mx-auto w-40 h-40 md:w-[190px] md:h-[190px] overflow-hidden relative border shrink-0',
                theme === 'glass' ? 'rounded-full border-white/30' :
                theme === 'neon' ? 'rounded-none border-2 border-primary' :
                theme === 'brutalist' ? 'rounded-none border-4 border-black' :
                'rounded-full border-border'
              )}>
                <Image src="/ram.jpg" alt="Ram Sharma" fill className="object-cover" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Creator</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 font-display">Built by Ram Sharma</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
                  A solo build across design, frontend architecture, interaction systems, and performance optimization. The Multiverse is crafted as a complete playground to help teams decide faster and build smarter.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Design Systems', value: '4 Universes' },
                    { label: 'Interactive Routes', value: '30+ Pages' },
                    { label: 'Focus', value: 'Performance' },
                    { label: 'Output', value: 'Production-ready Patterns' },
                  ].map((stat) => (
                    <div key={stat.label} className="border border-border/70 bg-background/60 p-3">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                      <p className="text-sm font-semibold mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a href="https://github.com/sharmaram25" target="_blank" rel="noopener noreferrer" className={socialLinkClass}>
                    <Github size={16} /> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/ram-sharma-20rs02/" target="_blank" rel="noopener noreferrer" className={socialLinkClass}>
                    <Linkedin size={16} /> LinkedIn
                  </a>
                  <a href="https://www.instagram.com/ramsharma.25/" target="_blank" rel="noopener noreferrer" className={socialLinkClass}>
                    <Instagram size={16} /> Instagram
                  </a>
                  <a href="https://portfolio-ram-sharma.netlify.app/" target="_blank" rel="noopener noreferrer" className={socialLinkClass}>
                    <Globe size={16} /> Portfolio
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
