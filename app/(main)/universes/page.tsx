'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useTheme, Theme } from '@/components/theme-provider';
import { useTransition } from '@/components/transitions/transition-context';
import { useRouter } from 'next/navigation';
import { LayoutTemplate, Layers, Zap, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

const universes: { id: Theme; name: string; icon: React.ReactNode; description: string; color: string; preview: React.ReactNode }[] = [
  {
    id: 'minimal',
    name: 'Minimal Universe',
    icon: <LayoutTemplate size={24} />,
    description: 'Clean, calm, highly structured. Focus on whitespace and typography.',
    color: 'bg-white text-black border-gray-200',
    preview: (
      <div className="flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-3 w-3/4 bg-gray-100 rounded" />
        <div className="mt-2 h-8 w-full bg-black rounded flex items-center justify-center text-white text-xs font-medium">Button</div>
      </div>
    ),
  },
  {
    id: 'glass',
    name: 'Glass Universe',
    icon: <Layers size={24} />,
    description: 'Glassmorphism aesthetic. Soft gradients and layered depth.',
    color: 'bg-slate-900 text-blue-100 border-blue-500/30',
    preview: (
      <div className="relative flex flex-col gap-2 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/50 rounded-full blur-xl" />
        <div className="h-4 w-1/2 bg-white/40 rounded relative z-10" />
        <div className="h-3 w-3/4 bg-white/20 rounded relative z-10" />
        <div className="mt-2 h-8 w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center text-white text-xs font-medium relative z-10">Button</div>
      </div>
    ),
  },
  {
    id: 'neon',
    name: 'Neon Universe',
    icon: <Zap size={24} />,
    description: 'Futuristic cyberpunk interface. Glowing borders and pulse indicators.',
    color: 'bg-black text-[#00f3ff] border-[#00f3ff]',
    preview: (
      <div className="flex flex-col gap-2 p-4 bg-black border border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)] rounded-none">
        <div className="h-4 w-1/2 bg-[#00f3ff] rounded-none shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
        <div className="h-3 w-3/4 bg-[#00f3ff]/50 rounded-none" />
        <div className="mt-2 h-8 w-full bg-transparent border border-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.5),inset_0_0_10px_rgba(0,243,255,0.2)] rounded-none flex items-center justify-center text-[#00f3ff] text-xs font-bold uppercase tracking-widest">Button</div>
      </div>
    ),
  },
  {
    id: 'brutalist',
    name: 'Brutalist Universe',
    icon: <Square size={24} />,
    description: 'Raw, bold, unconventional design. High contrast and sharp edges.',
    color: 'bg-[#e6e6e6] text-black border-4 border-black',
    preview: (
      <div className="flex flex-col gap-2 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
        <div className="h-5 w-1/2 bg-black rounded-none" />
        <div className="h-4 w-3/4 bg-gray-400 rounded-none" />
        <div className="mt-2 h-10 w-full bg-[#ff3300] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none flex items-center justify-center text-white text-sm font-black uppercase">Button</div>
      </div>
    ),
  },
];

export default function UniversesGalleryPage() {
  const { setTheme } = useTheme();
  const { setTransitionType } = useTransition();
  const router = useRouter();

  const handleEnterUniverse = (id: Theme) => {
    setTransitionType('portal');
    setTheme(id);
    router.push(`/universes/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 font-display">The Multiverse Gallery</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore different dimensions of design. Hover to preview the UI, click to enter the universe.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {universes.map((universe, index) => (
          <motion.div
            key={universe.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover="hover"
            onClick={() => handleEnterUniverse(universe.id)}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-3xl border-2 transition-all duration-500",
              universe.color
            )}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="p-8 md:p-10 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/10 backdrop-blur-md">
                  {universe.icon}
                </div>
                <h2 className="text-3xl font-bold font-display">{universe.name}</h2>
              </div>
              
              <p className="text-lg opacity-80 mb-10 flex-1">
                {universe.description}
              </p>

              {/* Preview UI Container */}
              <div className="relative h-48 w-full rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center p-6">
                <motion.div
                  variants={{
                    hover: { scale: 1.05, y: -5 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-full max-w-sm"
                >
                  {universe.preview}
                </motion.div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm font-medium uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                  Click to Enter
                </span>
                <motion.div
                  variants={{
                    hover: { x: 10 },
                  }}
                  className="w-10 h-10 rounded-full bg-current flex items-center justify-center text-background"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
