'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export default function Loading() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Animated Logo/Orb */}
        <motion.div
          className={cn(
            "w-24 h-24 rounded-full mb-8 flex items-center justify-center",
            theme === 'neon' ? "border-2 border-[#00f3ff] shadow-[0_0_30px_#00f3ff]" :
            theme === 'glass' ? "bg-blue-500/20 backdrop-blur-xl border border-white/20" :
            theme === 'brutalist' ? "bg-[#ff3300] border-4 border-black rounded-none" :
            "bg-primary/10"
          )}
          animate={{
            rotate: 360,
            borderRadius: theme === 'brutalist' ? ["0%", "0%", "0%"] : ["50%", "30%", "50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            className={cn(
              "w-12 h-12 rounded-full",
              theme === 'neon' ? "bg-[#00f3ff]" :
              theme === 'glass' ? "bg-white/50" :
              theme === 'brutalist' ? "bg-black rounded-none" :
              "bg-primary"
            )}
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className="flex space-x-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {['M', 'U', 'L', 'T', 'I', 'V', 'E', 'R', 'S', 'E'].map((letter, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className={cn(
                "text-2xl font-bold font-display tracking-widest",
                theme === 'neon' ? "text-[#00f3ff] drop-shadow-[0_0_5px_#00f3ff]" :
                theme === 'brutalist' ? "text-black uppercase" :
                "text-foreground"
              )}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
