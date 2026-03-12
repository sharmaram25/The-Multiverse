'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, Theme } from '@/components/theme-provider';
import { useTransition } from '@/components/transitions/transition-context';
import { Sparkles, X, LayoutTemplate, Layers, Zap, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useDesignSystem } from '@/lib/design-system-store';

const universes: { id: Theme; name: string; icon: React.ReactNode; description: string; color: string }[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    icon: <LayoutTemplate size={20} />,
    description: 'Clean, calm, highly structured.',
    color: 'bg-white text-black border-gray-200',
  },
  {
    id: 'glass',
    name: 'Glass',
    icon: <Layers size={20} />,
    description: 'Frosted aesthetics and soft gradients.',
    color: 'bg-blue-500/20 text-blue-100 border-blue-500/30 backdrop-blur-md',
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: <Zap size={20} />,
    description: 'Cyberpunk interface with glowing accents.',
    color: 'bg-black text-[#00f3ff] border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.5)]',
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    icon: <Square size={20} />,
    description: 'Raw, bold, unconventional design.',
    color: 'bg-[#e6e6e6] text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
  },
];

const secretUniverse = {
  id: 'secret' as any,
  name: 'Hidden Dimension',
  icon: <Zap size={20} />,
  description: 'A reality between the code.',
  color: 'bg-black text-[#0f0] border-[#0f0] border-2 shadow-[0_0_20px_rgba(0,255,0,0.3)] font-mono',
};

export function UniverseSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { setTransitionType } = useTransition();
  const { tokens } = useDesignSystem();
  const router = useRouter();

  const handleSwitchUniverse = (id: Theme) => {
    setTransitionType('portal');
    setTheme(id);
    setIsOpen(false);
    router.push(`/universes/${id}`);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Universe Selector Portal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />

            {/* Portal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-4xl bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-2">Select Universe</h2>
                    <p className="text-muted-foreground text-lg">Travel between different dimensions of design.</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-3 rounded-full hover:bg-muted transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {[...universes, ...(tokens.unlockedSecretUniverse ? [secretUniverse] : [])].map((u) => (
                    <motion.button
                      key={u.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (u.id === 'secret') {
                           setTransitionType('portal');
                           setIsOpen(false);
                           router.push('/universe/secret');
                        } else {
                           handleSwitchUniverse(u.id);
                        }
                      }}
                      className={cn(
                        "relative flex flex-col items-start p-6 md:p-8 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden group",
                        theme === u.id ? "border-primary" : "border-transparent hover:border-primary/30",
                        u.color
                      )}
                    >
                      {theme === u.id && (
                        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-current animate-pulse" />
                      )}
                      <div className="mb-4 p-3 rounded-xl bg-black/5 dark:bg-white/10 backdrop-blur-sm">
                        {u.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{u.name}</h3>
                      <p className="opacity-80 text-sm md:text-base">{u.description}</p>
                      
                      {/* Hover effect background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
