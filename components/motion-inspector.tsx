'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDesignSystem } from '@/lib/design-system-store';
import { 
  Activity, 
  Play, 
  Pause, 
  FastForward, 
  Rewind, 
  Eye, 
  EyeOff,
  Crosshair,
  Settings2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MotionInspector() {
  const { tokens, updateToken } = useDesignSystem();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (tokens.showBoundaries) {
      document.body.classList.add('show-boundaries');
    } else {
      document.body.classList.remove('show-boundaries');
    }
  }, [tokens.showBoundaries]);

  if (!tokens.showInspector) return null;

  return (
    <>
      {/* Floating Toggle */}
      <motion.button
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-24 right-6 z-[60] p-3 rounded-full shadow-2xl transition-all",
          isOpen ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border"
        )}
      >
        {isOpen ? <X size={20} /> : <Activity size={20} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed bottom-36 right-6 w-80 bg-card border border-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2rem] overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 size={16} className="text-primary" />
                <span className="font-bold text-sm tracking-tight">Motion Inspector</span>
              </div>
              <div className="flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Playback Controls */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Playback</label>
                <div className="flex items-center justify-between bg-muted rounded-xl p-2">
                  <button 
                    onClick={() => updateToken('isPaused', !tokens.isPaused)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg flex items-center justify-center gap-2 transition-all",
                      tokens.isPaused ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-card"
                    )}
                  >
                    {tokens.isPaused ? <Play size={14} /> : <Pause size={14} />}
                    <span className="text-xs font-bold">{tokens.isPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                </div>
              </div>

              {/* Speed Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time Scale</label>
                  <span className="text-xs font-mono font-bold text-primary">{tokens.animationSpeed}x</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0.25, 0.5, 1, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => updateToken('animationSpeed', speed)}
                      className={cn(
                        "py-2 rounded-lg text-[10px] font-bold transition-all border",
                        tokens.animationSpeed === speed 
                          ? "bg-primary border-primary text-primary-foreground" 
                          : "bg-muted border-transparent hover:border-border"
                      )}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="3" 
                  step="0.1"
                  value={tokens.animationSpeed}
                  onChange={(e) => updateToken('animationSpeed', Number(e.target.value))}
                  className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>

              {/* Debug Overlays */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visualization</label>
                <div className="flex flex-col gap-2">
                   <button 
                     onClick={() => {
                        const newVal = !tokens.showBoundaries;
                        updateToken('showBoundaries', newVal);
                        if (newVal) {
                          document.body.classList.add('show-boundaries');
                        } else {
                          document.body.classList.remove('show-boundaries');
                        }
                     }}
                     className={cn(
                       "flex items-center justify-between p-3 rounded-xl bg-muted/50 border transition-all",
                       tokens.showBoundaries ? "border-primary" : "border-transparent hover:border-border"
                     )}
                   >
                     <div className="flex items-center gap-2">
                       <Crosshair size={14} className={tokens.showBoundaries ? "text-primary" : ""} />
                       <span className="text-xs font-bold">Show Boundaries</span>
                     </div>
                     <div className={cn(
                       "w-8 h-4 rounded-full relative transition-colors",
                       tokens.showBoundaries ? "bg-primary" : "bg-muted-foreground/30"
                     )}>
                        <motion.div 
                          animate={{ x: tokens.showBoundaries ? 18 : 2 }}
                          className="absolute top-1 w-2 h-2 bg-white rounded-full" 
                        />
                     </div>
                   </button>
                </div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="px-6 py-3 bg-muted/50 border-t flex items-center justify-between text-[9px] font-mono text-muted-foreground">
               <span>RAF: 60FPS</span>
               <span>TARGET: MOTION.JS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
