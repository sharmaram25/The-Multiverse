'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UniverseProvider } from '@/components/universe-provider';
import { 
  Columns2, 
  Split, 
  Layers, 
  MousePointer2, 
  ChevronDown,
  LayoutDashboard,
  Box,
  CreditCard,
  Ghost,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'minimal' | 'glass' | 'neon' | 'brutalist';
type ViewMode = 'split' | 'mirror' | 'overlay';
type ComponentType = 'button' | 'card' | 'input' | 'dashboard';

export default function ParallelUniverses() {
  const [themeA, setThemeA] = useState<Theme>('minimal');
  const [themeB, setThemeB] = useState<Theme>('neon');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [activeComponent, setActiveComponent] = useState<ComponentType>('card');
  const [isHovered, setIsHovered] = useState(false);
  const [overlayPos, setOverlayPos] = useState(50);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
      {/* Control Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
             <Box size={16} className="text-primary" />
             <select 
               value={activeComponent} 
               onChange={(e) => setActiveComponent(e.target.value as any)}
               className="bg-transparent text-sm font-bold border-none focus:ring-0 outline-none"
             >
               <option value="button">Buttons</option>
               <option value="card">Cards</option>
               <option value="dashboard">Dashboard</option>
             </select>
          </div>
          
          <div className="flex bg-muted p-1 rounded-lg">
             {[
               { id: 'split', icon: Columns2, label: 'Split' },
               { id: 'mirror', icon: Split, label: 'Mirror' },
               { id: 'overlay', icon: Layers, label: 'Overlay' },
             ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold transition-all",
                    viewMode === mode.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <mode.icon size={14} />
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
           <div className="flex items-center gap-2">
             <MousePointer2 size={14} />
             <span>Interactions Synced</span>
           </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-black">
        {viewMode === 'split' && (
          <div className="flex h-full w-full">
            <UniversePanel 
              theme={themeA} 
              onThemeChange={setThemeA} 
              component={activeComponent} 
              label="Universe A" 
              isHovered={isHovered}
              onHover={setIsHovered}
            />
            <div className="w-px bg-white/10 relative z-10">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary border-4 border-black text-primary-foreground flex items-center justify-center font-bold text-[10px]">VS</div>
            </div>
            <UniversePanel 
              theme={themeB} 
              onThemeChange={setThemeB} 
              component={activeComponent} 
              label="Universe B" 
              isHovered={isHovered}
              onHover={setIsHovered}
            />
          </div>
        )}

        {viewMode === 'overlay' && (
          <div className="relative h-full w-full overflow-hidden">
             <UniversePanel 
               theme={themeA} 
               onThemeChange={setThemeA} 
               component={activeComponent} 
               label="Universe A" 
               isHovered={isHovered}
               onHover={setIsHovered}
               className="absolute inset-0"
             />
             <div 
               className="absolute inset-0 z-10 overflow-hidden" 
               style={{ clipPath: `inset(0 0 0 ${overlayPos}%)` }}
             >
                <UniversePanel 
                  theme={themeB} 
                  onThemeChange={setThemeB} 
                  component={activeComponent} 
                  label="Universe B" 
                  isHovered={isHovered}
                  onHover={setIsHovered}
                />
             </div>
             {/* Slider Handle */}
             <div 
               className="absolute top-0 bottom-0 w-1 bg-white z-20 cursor-ew-resize group"
               style={{ left: `${overlayPos}%` }}
               onMouseDown={(e) => {
                 const handleMove = (e: MouseEvent) => {
                   const pos = (e.clientX / window.innerWidth) * 100;
                   setOverlayPos(Math.min(Math.max(pos, 0), 100));
                 };
                 window.addEventListener('mousemove', handleMove);
                 window.addEventListener('mouseup', () => window.removeEventListener('mousemove', handleMove));
               }}
             >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 bg-white rounded-full flex flex-col items-center justify-center gap-1 shadow-2xl">
                   <div className="w-0.5 h-4 bg-black/20" />
                </div>
             </div>
          </div>
        )}

        {viewMode === 'mirror' && (
           <div className="grid grid-cols-2 h-full w-full overflow-y-auto overflow-x-hidden">
              <UniversePanel 
                theme={themeA} 
                onThemeChange={setThemeA} 
                component="dashboard"
                label="Universe A" 
                isHovered={isHovered}
                onHover={setIsHovered}
              />
              <UniversePanel 
                theme={themeB} 
                onThemeChange={setThemeB} 
                component="dashboard"
                label="Universe B" 
                isHovered={isHovered}
                onHover={setIsHovered}
              />
           </div>
        )}
      </div>
    </div>
  );
}

function UniversePanel({ theme, onThemeChange, component, label, isHovered, onHover, className }: any) {
  return (
    <div className={cn("flex-1 h-full flex flex-col relative overflow-hidden", className)}>
      <UniverseProvider theme={theme} className="flex-1 transition-colors duration-700">
        {/* Universe Background Decorator */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           {theme === 'minimal' && (
             <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
           )}
           {theme === 'glass' && (
             <>
               <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full" />
             </>
           )}
           {theme === 'neon' && (
             <div className="absolute inset-0 opacity-20">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
               <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent" />
             </div>
           )}
           {theme === 'brutalist' && (
             <div className="absolute inset-0 bg-[#f0f0f0] opacity-100">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply" />
                <div className="absolute inset-x-0 top-0 h-2 bg-black" />
                <div className="absolute inset-x-0 bottom-0 h-2 bg-black" />
             </div>
           )}
        </div>

        <div className="absolute top-6 left-6 z-30 flex items-center gap-3">
          <div className={cn(
            "px-4 py-1.5 rounded-full border text-[10px] uppercase font-black tracking-[0.2em] shadow-xl backdrop-blur-md",
            theme === 'minimal' ? "bg-white border-black/10 text-black" :
            theme === 'glass' ? "bg-white/10 border-white/20 text-white" :
            theme === 'neon' ? "bg-black border-[#00f3ff] text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.4)]" :
            "bg-[#ff3300] border-black border-2 text-white italic"
          )}>
            {label}
          </div>
          <select 
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as any)}
            className={cn(
              "rounded-full border text-[10px] font-bold px-3 py-1 outline-none transition-all",
              theme === 'minimal' ? "bg-white border-black/10 text-black" :
              theme === 'glass' ? "bg-white/10 border-white/20 text-white" :
              theme === 'neon' ? "bg-black border-[#00f3ff] text-[#00f3ff]" :
              "bg-white border-black border-2 text-black"
            )}
          >
            <option value="minimal">Minimal</option>
            <option value="glass">Glass</option>
            <option value="neon">Neon</option>
            <option value="brutalist">Brutalist</option>
          </select>
        </div>

        <div className="h-full w-full flex items-center justify-center p-12 relative z-20">
           <AnimatePresence mode="wait">
             <motion.div
               key={`${theme}-${component}`}
               initial={{ opacity: 0, y: 30, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -30, scale: 0.9 }}
               transition={{ type: 'spring', damping: 20, stiffness: 100 }}
               className="w-full max-w-lg"
               onMouseEnter={() => onHover(true)}
               onMouseLeave={() => onHover(false)}
             >
                {component === 'button' && <ButtonDemo theme={theme} isHovered={isHovered} />}
                {component === 'card' && <CardDemo theme={theme} isHovered={isHovered} />}
                {component === 'dashboard' && <DashboardDemo theme={theme} isHovered={isHovered} />}
             </motion.div>
           </AnimatePresence>
        </div>
      </UniverseProvider>
    </div>
  );
}

function ButtonDemo({ theme, isHovered }: any) {
  return (
    <div className="flex flex-col items-center gap-12">
       <div className="flex flex-wrap justify-center gap-8">
         {/* Primary Button */}
         <motion.button 
           animate={{ 
             scale: isHovered ? 1.05 : 1,
             y: isHovered ? -4 : 0
           }}
           className={cn(
             "px-10 py-4 font-bold transition-all relative group overflow-hidden",
             theme === 'minimal' ? "bg-black text-white rounded-xl shadow-sm hover:shadow-xl" :
             theme === 'glass' ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl hover:bg-white/20" :
             theme === 'neon' ? "bg-transparent border-2 border-[#00f3ff] text-[#00f3ff] rounded-none uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(0,243,255,0.5)] hover:shadow-[0_0_30px_rgba(0,243,255,0.8)]" :
             "bg-[#ff3300] border-4 border-black text-white text-xl uppercase italic shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
           )}
         >
           <span className="relative z-10">CORE ACTION</span>
           {theme === 'neon' && (
             <motion.div 
               animate={{ x: isHovered ? ['-100%', '100%'] : '-100%' }}
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#00f3ff]/30 to-transparent -skew-x-12"
             />
           )}
         </motion.button>

         {/* Secondary Button */}
         <button className={cn(
             "px-8 py-4 font-bold transition-all",
             theme === 'minimal' ? "bg-zinc-100 text-zinc-900 rounded-xl hover:bg-zinc-200" :
             theme === 'glass' ? "bg-white/5 border border-white/10 text-white/70 rounded-2xl hover:text-white" :
             theme === 'neon' ? "bg-transparent border border-[#ff00ff] text-[#ff00ff] rounded-none uppercase text-xs tracking-widest shadow-[0_0_10px_rgba(255,0,255,0.3)]" :
             "bg-white border-4 border-black text-black uppercase underline decoration-4 underline-offset-4"
           )}>
           SECONDARY
         </button>
       </div>
       
       <div className={cn(
         "px-6 py-3 rounded-xl border text-[10px] uppercase font-black tracking-widest text-center max-w-xs",
         theme === 'minimal' ? "bg-zinc-50 border-zinc-200 text-zinc-400" :
         theme === 'glass' ? "bg-white/5 border-white/10 text-white/30" :
         theme === 'neon' ? "bg-black/50 border-[#00f3ff]/20 text-[#00f3ff]/50 shadow-[inset_0_0_20px_rgba(0,243,255,0.1)]" :
         "bg-[#ffff00] border-black border-4 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
       )}>
         Interactions are synced across dimensions
       </div>
    </div>
  );
}

function CardDemo({ theme, isHovered }: any) {
  return (
    <motion.div 
      initial={false}
      animate={{ 
        y: isHovered ? -20 : 0,
        rotateX: isHovered ? (theme === 'brutalist' ? 0 : 8) : 0,
        x: isHovered && theme === 'brutalist' ? 8 : 0
      }}
      className={cn(
        "p-10 transition-all duration-500 relative group",
        theme === 'minimal' ? "rounded-[2.5rem] bg-white border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]" :
        theme === 'glass' ? "rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.3)]" :
        theme === 'neon' ? "rounded-none bg-black border-2 border-[#00f3ff] shadow-[0_0_30px_rgba(0,243,255,0.2)]" :
        "rounded-none bg-white border-[6px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
      )}
    >
      <div className={cn(
        "w-20 h-20 flex items-center justify-center mb-8 transition-transform duration-500",
        isHovered ? "scale-110" : "scale-100",
        theme === 'minimal' ? "bg-zinc-50 rounded-3xl text-zinc-900" :
        theme === 'glass' ? "bg-gradient-to-br from-white/20 to-transparent rounded-2xl text-white shadow-xl" :
        theme === 'neon' ? "bg-[#00f3ff]/10 border border-[#00f3ff] text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.5)]" :
        "bg-[#00ff00] border-4 border-black text-black transform rotate-3"
      )}>
         <LayoutDashboard size={40} strokeWidth={theme === 'brutalist' ? 3 : 1.5} />
      </div>

      <h3 className={cn(
        "text-3xl font-black mb-4",
        theme === 'minimal' ? "tracking-tight text-zinc-900" :
        theme === 'glass' ? "tracking-tight text-white leading-tight" :
        theme === 'neon' ? "uppercase tracking-[0.2em] text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]" :
        "uppercase italic text-4xl -skew-x-6 text-black"
      )}>
        The Adapting <br/>Interface
      </h3>
      
      <p className={cn(
        "leading-relaxed mb-10",
        theme === 'minimal' ? "text-zinc-500" :
        theme === 'glass' ? "text-zinc-400 font-light" :
        theme === 'neon' ? "text-zinc-300 font-mono text-sm border-l-2 border-[#00f3ff] pl-4" :
        "text-black font-bold border-2 border-black p-4 bg-[#f0f0f0]"
      )}>
        Observe how border radius, background blur, and shadows change between parallel universes.
      </p>

      <div className="flex gap-4">
         <div className={cn(
           "h-3 flex-1 rounded-full",
           theme === 'minimal' ? "bg-zinc-100 overflow-hidden" :
           theme === 'glass' ? "bg-white/10 overflow-hidden" :
           theme === 'neon' ? "bg-[#00f3ff]/20 border border-[#00f3ff]/50" :
           "bg-black h-4"
         )}>
           <motion.div 
             animate={{ width: isHovered ? '100%' : '30%' }}
             className={cn(
               "h-full rounded-full",
               theme === 'minimal' ? "bg-black" :
               theme === 'glass' ? "bg-white shadow-[0_0_10px_white]" :
               theme === 'neon' ? "bg-[#00f3ff] shadow-[0_0_15px_#00f3ff]" :
               "bg-[#ff3300]"
             )}
           />
         </div>
      </div>

      {theme === 'brutalist' && (
        <div className="absolute -top-4 -right-4 bg-black text-white px-4 py-1 text-xs font-black uppercase transform rotate-12 border-2 border-white">
          WARNING: RAW UI
        </div>
      )}
    </motion.div>
  );
}

function DashboardDemo({ theme, isHovered }: any) {
  return (
    <div className={cn(
      "w-full aspect-square p-8 grid grid-cols-6 grid-rows-6 gap-4 overflow-hidden",
      theme === 'minimal' ? "bg-zinc-50 rounded-[3rem] border border-zinc-100" :
      theme === 'glass' ? "bg-black/20 backdrop-blur-3xl rounded-[3rem] border border-white/10" :
      theme === 'neon' ? "bg-black border-2 border-[#00f3ff]/30 shadow-[inset_0_0_50px_rgba(0,243,255,0.05)]" :
      "bg-white border-4 border-black p-4 pattern-cross"
    )}>
       {/* Main Chart */}
       <div className={cn(
         "col-span-4 row-span-3 rounded-3xl border flex flex-col p-6 overflow-hidden relative",
         theme === 'minimal' ? "bg-white border-zinc-100" :
         theme === 'glass' ? "bg-white/5 border-white/10" :
         theme === 'neon' ? "bg-black border-[#00f3ff] rounded-none" :
         "bg-[#00ff00] border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
       )}>
          <div className="flex justify-between items-center mb-auto">
             <div className={cn(
               "w-10 h-10 rounded-xl flex items-center justify-center",
               theme === 'minimal' ? "bg-zinc-900 text-white" :
               theme === 'glass' ? "bg-white/20 text-white" :
               theme === 'neon' ? "bg-[#00f3ff] text-black" :
               "bg-black text-white"
             )}>
                <Activity size={20} />
             </div>
             <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-current opacity-20" />)}
             </div>
          </div>
          <div className="mt-4 flex items-end gap-1 h-12">
             {[0.4, 0.7, 0.5, 0.9, 0.6, 1, 0.4].map((h, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${h * 100}%` }}
                 className={cn(
                   "flex-1",
                   theme === 'minimal' ? "bg-black rounded-t-sm" :
                   theme === 'glass' ? "bg-white/50 rounded-t-lg" :
                   theme === 'neon' ? "bg-[#00f3ff] opacity-80" :
                   "bg-black"
                 )}
               />
             ))}
          </div>
       </div>

       {/* Small Widget 1 */}
       <div className={cn(
         "col-span-2 row-span-2 rounded-3xl border",
         theme === 'minimal' ? "bg-white border-zinc-100" :
         theme === 'glass' ? "bg-white/10 border-white/20 shadow-xl" :
         theme === 'neon' ? "bg-black border-[#ff00ff]/50 rounded-none shadow-[0_0_15px_rgba(255,0,255,0.1)]" :
         "bg-[#ffff00] border-4 border-black rounded-none"
       )} />

       {/* Small Widget 2 */}
       <div className={cn(
         "col-span-2 row-span-4 rounded-3xl border",
         theme === 'minimal' ? "bg-zinc-900 border-zinc-900" :
         theme === 'glass' ? "bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border-white/20" :
         theme === 'neon' ? "bg-black border-[#00f3ff]/50 rounded-none" :
         "bg-black border-4 border-black rounded-none"
       )} />

       {/* Wide Widget */}
       <div className={cn(
         "col-span-4 row-span-3 rounded-3xl border",
         theme === 'minimal' ? "bg-zinc-100 border-transparent" :
         theme === 'glass' ? "bg-white/5 border-white/10 backdrop-blur-md" :
         theme === 'neon' ? "bg-[#00f3ff]/5 border border-[#00f3ff]/20 rounded-none" :
         "bg-[#f0f0f0] border-4 border-black rounded-none shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)]"
       )} />
    </div>
  );
}
