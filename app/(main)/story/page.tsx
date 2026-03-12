'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTheme } from '@/components/theme-provider';

export default function StoryPage() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.6], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.6], [100, 0, 0, -100]);

  const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.8, 0.9], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.6, 0.8, 0.9], [100, 0, 0, -100]);

  const opacity4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [100, 0, 0]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        
        {/* Background Elements */}
        <motion.div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ 
            background: `radial-gradient(circle at center, var(--primary) 0%, transparent 70%)`,
            scale: useTransform(scrollYProgress, [0, 1], [1, 3])
          }}
        />

        {/* Section 1 */}
        <motion.div 
          className="absolute z-10 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: opacity1, y: y1 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold font-display mb-6 tracking-tighter">
            The Evolution of UI
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl">
            Scroll to explore how interfaces adapt across dimensions.
          </p>
        </motion.div>

        {/* Section 2 */}
        <motion.div 
          className="absolute z-10 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: opacity2, y: y2 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold font-display mb-6 text-primary">
            From Static to Dynamic
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
            Early interfaces were rigid. Today, they breathe. They respond to touch, to movement, to intent.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                className="w-24 h-24 rounded-2xl bg-card border border-border shadow-lg"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Section 3 */}
        <motion.div 
          className="absolute z-10 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: opacity3, y: y3 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold font-display mb-6 text-secondary">
            Physics & Emotion
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
            We added mass, friction, and elasticity. Interfaces stopped feeling like software and started feeling like physical objects.
          </p>
          <motion.div 
            className="mt-12 w-48 h-48 rounded-full bg-gradient-to-br from-secondary to-primary shadow-2xl"
            animate={{ 
              borderRadius: ["50%", "30%", "50%"],
              y: [0, -20, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Section 4 */}
        <motion.div 
          className="absolute z-10 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: opacity4, y: y4 }}
        >
          <h2 className="text-6xl md:text-8xl font-bold font-display mb-6 tracking-tighter">
            The Multiverse
          </h2>
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl mb-12">
            Now, we build systems that adapt entirely to their environment. Welcome to the future.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-xl shadow-xl"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
