'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function Elastic({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotation(Math.random() > 0.5 ? 2 : -2);
  }, []);

  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05, rotate: rotation }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.div>
  );
}
