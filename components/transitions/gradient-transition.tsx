'use client';

import React from 'react';
import { motion } from 'motion/react';

export function GradientTransition() {
  return (
    <>
      {/* Enter: Gradient slides out */}
      <motion.div
        className="fixed inset-0 z-[100] bg-gradient-to-br from-primary via-background to-primary pointer-events-none"
        initial={{ x: '0%' }}
        animate={{ x: '-100%' }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Exit: Gradient slides in */}
      <motion.div
        className="fixed inset-0 z-[100] bg-gradient-to-br from-primary via-background to-primary pointer-events-none"
        initial={{ x: '100%' }}
        animate={{ x: '100%' }}
        exit={{ x: '0%' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
