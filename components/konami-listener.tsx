'use client';

import React, { useEffect, useState } from 'react';
import { useDesignSystem } from '@/lib/design-system-store';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Zap } from 'lucide-react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 
  'ArrowLeft', 'ArrowRight', 
  'b', 'a'
];

export function KonamiListener() {
  const [input, setInput] = useState<string[]>([]);
  const [isTriggered, setIsTriggered] = useState(false);
  const { tokens, updateToken } = useDesignSystem();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const nextInput = [...input, e.key];
      
      // Keep only the last N keys where N is length of code
      if (nextInput.length > KONAMI_CODE.length) {
        nextInput.shift();
      }
      
      setInput(nextInput);

      if (nextInput.join(',') === KONAMI_CODE.join(',')) {
        handleUnlock();
      }
    };

    const handleUnlock = () => {
      if (tokens.unlockedSecretUniverse) return;
      
      setIsTriggered(true);
      updateToken('unlockedSecretUniverse', true);
      
      // Clear after animation
      setTimeout(() => setIsTriggered(false), 3000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, tokens.unlockedSecretUniverse, updateToken]);

  return (
    <AnimatePresence>
      {isTriggered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Glitch Overlay */}
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay animate-pulse" />
          
          <div className="bg-black border-2 border-primary p-8 rounded-2xl shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)] flex flex-col items-center gap-4">
            <div className="relative">
               <Terminal size={64} className="text-primary animate-bounce" />
               <Zap className="absolute -top-2 -right-2 text-white animate-pulse" size={32} />
            </div>
            <div className="text-center">
               <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Hidden Dimension Unlocked</h2>
               <p className="text-primary font-mono text-sm mt-2">A terminal to the secret universe has appeared.</p>
            </div>
          </div>

          {/* Code Rain Effect snippet (Simplified) */}
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
             {Array.from({ length: 20 }).map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ y: -100 }}
                 animate={{ y: 1000 }}
                 transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, ease: 'linear' }}
                 className="absolute text-primary font-mono text-[10px]"
                 style={{ left: `${i * 5}%` }}
               >
                 {Math.random() > 0.5 ? '1' : '0'}
               </motion.div>
             ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
