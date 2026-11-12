'use client';

import React from 'react';
import { motion } from 'motion/react';

export function CurtainTransition() {
  return (
    <>
      {/* Slide out when entering */}
      <motion.div
        className="fixed inset-0 z-[100] bg-black pointer-events-none"
        initial={{ x: '0%' }}
        animate={{ x: '-100%' }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Slide in when exiting */}
      <motion.div
        className="fixed inset-0 z-[100] bg-black pointer-events-none"
        initial={{ x: '100%' }}
        animate={{ x: '100%' }}
        exit={{ x: '0%' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
