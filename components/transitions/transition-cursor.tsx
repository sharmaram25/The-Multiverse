'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTransition } from './transition-context';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export function TransitionCursor() {
  const { isTransitioning } = useTransition();
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (isTransitioning) {
      window.addEventListener('mousemove', updateMousePosition);
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [isTransitioning]);

  if (!isTransitioning) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[200] flex items-center justify-center mix-blend-difference"
      animate={{
        x: mousePosition.x - 24,
        y: mousePosition.y - 24,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <motion.div
        className={cn(
          "w-full h-full rounded-full",
          theme === 'neon' ? "bg-[#00f3ff] shadow-[0_0_20px_#00f3ff]" :
          theme === 'glass' ? "bg-blue-400/50 backdrop-blur-md" :
          theme === 'brutalist' ? "bg-[#ff3300] border-2 border-black rounded-none" :
          "bg-white"
        )}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
