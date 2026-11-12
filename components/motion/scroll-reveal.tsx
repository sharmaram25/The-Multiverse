'use client';

import React, { useRef } from 'react';
import { motion, useInView, Variant } from 'motion/react';
import { cn } from '@/lib/utils';

type RevealType = 'fade' | 'slide' | 'scale' | 'stagger';

interface ScrollRevealProps {
  children: React.ReactNode;
  type?: RevealType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  margin?: string;
}

export function ScrollReveal({ 
  children, 
  type = 'fade', 
  delay = 0, 
  duration = 0.6, 
  className = '', 
  once = true,
  margin = '-20px'
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: margin as any });

  const variants = {
    fade: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    },
    slide: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    stagger: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants[type]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className, "motion-reveal-check")}
    >
      {children}
    </motion.div>
  );
}
