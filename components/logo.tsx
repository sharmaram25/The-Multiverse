'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className, size = 32, showText = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="initial"
        whileHover="hover"
      >
        {/* Dimension Plane 1 (Left) */}
        <motion.path
          d="M20 30L50 15L50 85L20 70V30Z"
          fill="currentColor"
          fillOpacity="0.8"
          variants={{
            initial: { x: 0, opacity: 0.6 },
            hover: { x: -5, opacity: 1 }
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
        
        {/* Dimension Plane 2 (Right) */}
        <motion.path
          d="M80 30L50 15L50 85L80 70V30Z"
          fill="currentColor"
          fillOpacity="0.4"
          variants={{
            initial: { x: 0, opacity: 0.4 },
            hover: { x: 5, opacity: 0.8 }
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />

        {/* Dimension Plane 3 (Top / Core) */}
        <motion.path
          d="M20 30L50 45L80 30L50 15L20 30Z"
          fill="currentColor"
          variants={{
            initial: { y: 0 },
            hover: { y: -5 }
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />

        {/* Floating Core Particle */}
        <motion.circle
          cx="50"
          cy="45"
          r="4"
          fill="var(--accent, #f43f5e)"
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
      
      {showText && (
        <span className="font-display font-black italic tracking-tighter text-xl uppercase">
          Multiverse
        </span>
      )}
    </div>
  );
}
