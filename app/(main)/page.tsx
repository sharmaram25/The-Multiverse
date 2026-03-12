'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Layers, Zap, Code, Layout, Cpu, MousePointer2 } from 'lucide-react';
import { MagneticButton } from '@/components/magnetic-button';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y, opacity }} 
          className="absolute inset-0 z-0 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-screen animate-pulse" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 font-display"
          >
            The Multiverse
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            A playground of frontend design, motion, and performance.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/universes">
              <MagneticButton variant="primary" className="w-full sm:w-auto flex items-center gap-2">
                Explore the Universes <ArrowRight size={18} />
              </MagneticButton>
            </Link>
            <Link href="/components">
              <MagneticButton variant="outline" className="w-full sm:w-auto">
                View Components
              </MagneticButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 1: What is The Multiverse */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-display">
              Worlds of Design
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              The Multiverse is a collection of design worlds — each exploring different philosophies of interface design, motion, and interaction.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From brutalist typography to glassmorphic depth, every universe is built with precision, performance, and a relentless focus on the user experience.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-square rounded-3xl overflow-hidden glass-panel flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-64 h-64 border border-primary/30 rounded-full flex items-center justify-center"
            >
              <div className="w-48 h-48 border border-primary/40 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-primary/20 rounded-full blur-xl" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Capabilities Grid */}
      <section className="py-24 px-6 md:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">Capabilities</h2>
            <p className="text-xl text-muted-foreground">The foundation of every universe.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Code size={24} />, title: "UI Engineering", desc: "Pixel-perfect implementation of complex interfaces." },
              { icon: <Zap size={24} />, title: "Motion Design", desc: "Fluid, physics-based animations that feel natural." },
              { icon: <Layers size={24} />, title: "Design Systems", desc: "Scalable tokens, components, and patterns." },
              { icon: <Layout size={24} />, title: "Component Architecture", desc: "Modular, reusable, and accessible building blocks." },
              { icon: <Cpu size={24} />, title: "Performance Optimization", desc: "60fps animations and minimal bundle sizes." },
              { icon: <MousePointer2 size={24} />, title: "Interaction Design", desc: "Micro-interactions that delight users." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Interaction & Motion */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">Interaction & Motion</h2>
          <p className="text-xl text-muted-foreground">Explore the physics and mechanics of the multiverse.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Motion Lab", desc: "Complex motion design and animation systems.", link: "/motion-lab", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
            { title: "Playground", desc: "Advanced interaction mechanics and physics.", link: "/interaction-playground", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
            { title: "Micro-Interactions", desc: "Attention to small UI details and feedback.", link: "/micro-interactions", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
            { title: "Storytelling", desc: "Scroll-driven narrative experiences.", link: "/story", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
          ].map((item, i) => (
            <Link key={item.title} href={item.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-8 rounded-3xl border ${item.color} hover:bg-opacity-20 transition-all duration-300 h-full flex flex-col justify-center`}
              >
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="opacity-80">{item.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 4: Experimental & Performance */}
      <section className="py-24 px-6 md:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">Experimental & Performance</h2>
            <p className="text-xl text-muted-foreground">Pushing the boundaries of web capabilities.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "3D Portal", desc: "Interactive WebGL gateway to the multiverse.", link: "/portal", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
              { title: "Observatory", desc: "Real-time performance telemetry and optimization.", link: "/performance", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
              { title: "Sandbox", desc: "Interactive component playground.", link: "/sandbox", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
              { title: "UI Builder", desc: "Drag-and-drop layout generation.", link: "/builder", color: "bg-teal-500/10 text-teal-500 border-teal-500/20" },
              { title: "Experimental Lab", desc: "Shaders, fluid gradients, and advanced physics.", link: "/experimental", color: "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20" },
            ].map((item, i) => (
              <Link key={item.title} href={item.link} className={i === 4 ? "lg:col-span-4" : ""}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`p-8 rounded-3xl border ${item.color} hover:bg-opacity-20 transition-all duration-300 h-full flex flex-col justify-center`}
                >
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="opacity-80">{item.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Preview of Universes */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">Explore Universes</h2>
          <p className="text-xl text-muted-foreground">Discover the different dimensions of design.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Minimal Universe", color: "from-zinc-200 to-zinc-400 dark:from-zinc-800 dark:to-zinc-900", link: "/universes/minimal" },
            { title: "Glass Universe", color: "from-blue-400/20 to-purple-500/20 backdrop-blur-xl", link: "/universes/glass" },
            { title: "Neon Universe", color: "from-pink-500 to-violet-600", link: "/universes/neon" },
            { title: "Brutalist Universe", color: "from-yellow-400 to-orange-500", link: "/universes/brutalist" },
          ].map((universe, i) => (
            <Link key={universe.title} href={universe.link}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
                style={{ transformPerspective: 1000 }}
                className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${universe.color} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">{universe.title}</h3>
                  <div className="w-0 h-0.5 bg-white mt-2 group-hover:w-12 transition-all duration-300" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 4: Call to Explore */}
      <section className="py-32 px-6 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-primary/10" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 font-display">Ready to explore?</h2>
          <Link href="/universes">
            <MagneticButton variant="primary" className="text-lg px-8 py-4">
              Enter The Multiverse
            </MagneticButton>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
