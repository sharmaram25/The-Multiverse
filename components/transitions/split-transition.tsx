'use client';

import React from 'react';
import { motion } from 'motion/react';

export function SplitTransition() {
  return (
    <>
      {/* Enter: Panels slide apart */}
      <motion.div
        className="fixed top-0 left-0 right-0 bottom-1/2 z-[100] bg-black pointer-events-none"
        initial={{ y: '0%' }}
        animate={{ y: '-100%' }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="fixed top-1/2 left-0 right-0 bottom-0 z-[100] bg-black pointer-events-none"
        initial={{ y: '0%' }}
        animate={{ y: '100%' }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Exit: Panels slide together */}
      <motion.div
        className="fixed top-0 left-0 right-0 bottom-1/2 z-[100] bg-black pointer-events-none"
        initial={{ y: '-100%' }}
        animate={{ y: '-100%' }}
        exit={{ y: '0%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="fixed top-1/2 left-0 right-0 bottom-0 z-[100] bg-black pointer-events-none"
        initial={{ y: '100%' }}
        animate={{ y: '100%' }}
        exit={{ y: '0%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
