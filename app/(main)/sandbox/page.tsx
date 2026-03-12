'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Layers, Type, Square, Maximize, Palette, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Sandbox Components ---

// Static color class mappings for Tailwind JIT compatibility
const colorClasses = {
  blue: {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:hover:bg-blue-900/50",
    outline: "border border-blue-200 hover:bg-blue-100 hover:text-blue-900 dark:border-blue-800 dark:hover:bg-blue-900/50 dark:hover:text-blue-100",
    ghost: "hover:bg-blue-100 hover:text-blue-900 dark:hover:bg-blue-900/50 dark:hover:text-blue-100 text-blue-600 dark:text-blue-400",
    link: "underline-offset-4 hover:underline text-blue-600 dark:text-blue-400",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  },
  emerald: {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:hover:bg-emerald-900/50",
    outline: "border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-900 dark:border-emerald-800 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-100",
    ghost: "hover:bg-emerald-100 hover:text-emerald-900 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-100 text-emerald-600 dark:text-emerald-400",
    link: "underline-offset-4 hover:underline text-emerald-600 dark:text-emerald-400",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]",
  },
  rose: {
    primary: "bg-rose-600 text-white hover:bg-rose-700",
    secondary: "bg-rose-100 text-rose-900 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-100 dark:hover:bg-rose-900/50",
    outline: "border border-rose-200 hover:bg-rose-100 hover:text-rose-900 dark:border-rose-800 dark:hover:bg-rose-900/50 dark:hover:text-rose-100",
    ghost: "hover:bg-rose-100 hover:text-rose-900 dark:hover:bg-rose-900/50 dark:hover:text-rose-100 text-rose-600 dark:text-rose-400",
    link: "underline-offset-4 hover:underline text-rose-600 dark:text-rose-400",
    glow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]",
  },
  amber: {
    primary: "bg-amber-600 text-white hover:bg-amber-700",
    secondary: "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:hover:bg-amber-900/50",
    outline: "border border-amber-200 hover:bg-amber-100 hover:text-amber-900 dark:border-amber-800 dark:hover:bg-amber-900/50 dark:hover:text-amber-100",
    ghost: "hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-amber-900/50 dark:hover:text-amber-100 text-amber-600 dark:text-amber-400",
    link: "underline-offset-4 hover:underline text-amber-600 dark:text-amber-400",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]",
  },
  purple: {
    primary: "bg-purple-600 text-white hover:bg-purple-700",
    secondary: "bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-100 dark:hover:bg-purple-900/50",
    outline: "border border-purple-200 hover:bg-purple-100 hover:text-purple-900 dark:border-purple-800 dark:hover:bg-purple-900/50 dark:hover:text-purple-100",
    ghost: "hover:bg-purple-100 hover:text-purple-900 dark:hover:bg-purple-900/50 dark:hover:text-purple-100 text-purple-600 dark:text-purple-400",
    link: "underline-offset-4 hover:underline text-purple-600 dark:text-purple-400",
    glow: "shadow-[0_0_15px_rgba(139,92,246,0.5)]",
  },
  zinc: {
    primary: "bg-zinc-600 text-white hover:bg-zinc-700",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900/30 dark:text-zinc-100 dark:hover:bg-zinc-900/50",
    outline: "border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-100",
    ghost: "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-100 text-zinc-600 dark:text-zinc-400",
    link: "underline-offset-4 hover:underline text-zinc-600 dark:text-zinc-400",
    glow: "shadow-[0_0_15px_rgba(113,113,122,0.5)]",
  },
} as const;

type ColorKey = keyof typeof colorClasses;
type VariantKey = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

function ButtonSandbox() {
  const [variant, setVariant] = useState<VariantKey>('primary');
  const [size, setSize] = useState('default');
  const [radius, setRadius] = useState('md');
  const [shadow, setShadow] = useState('none');
  const [color, setColor] = useState<ColorKey>('blue');
  const [isHovered, setIsHovered] = useState(false);

  const getButtonClasses = () => {
    const base = "inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    
    const sizes: Record<string, string> = {
      sm: "h-9 px-3 text-xs",
      default: "h-10 py-2 px-4 text-sm",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10",
    };

    const radii: Record<string, string> = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };

    const shadows: Record<string, string> = {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      glow: colorClasses[color].glow,
    };

    return cn(base, colorClasses[color][variant], sizes[size], radii[radius], shadows[shadow]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Preview Area */}
      <div className="lg:col-span-2 border border-border rounded-2xl bg-card/50 flex items-center justify-center p-12 min-h-[400px] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        
        <motion.button
          className={getButtonClasses()}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileTap={{ scale: 0.95 }}
          style={{
            // Dynamic color injection for Tailwind arbitrary values if needed, 
            // but we'll rely on standard Tailwind classes for simplicity in this demo.
            // In a real app, we'd use CSS variables or a more robust color system.
          }}
        >
          Interactive Button
          {isHovered && <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 5 }} className="ml-2">→</motion.span>}
        </motion.button>
      </div>

      {/* Controls Area */}
      <div className="space-y-6 border border-border rounded-2xl bg-card p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-4"><Settings2 size={18} /> Properties</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Variant</label>
            <div className="flex flex-wrap gap-2">
              {['primary', 'secondary', 'outline', 'ghost', 'link'].map(v => (
                <button key={v} onClick={() => setVariant(v)} className={cn("px-3 py-1.5 text-xs rounded-md border transition-colors", variant === v ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border hover:bg-muted")}>{v}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Size</label>
            <div className="flex flex-wrap gap-2">
              {['sm', 'default', 'lg', 'icon'].map(s => (
                <button key={s} onClick={() => setSize(s)} className={cn("px-3 py-1.5 text-xs rounded-md border transition-colors", size === s ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border hover:bg-muted")}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Border Radius</label>
            <div className="flex flex-wrap gap-2">
              {['none', 'sm', 'md', 'lg', 'full'].map(r => (
                <button key={r} onClick={() => setRadius(r)} className={cn("px-3 py-1.5 text-xs rounded-md border transition-colors", radius === r ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border hover:bg-muted")}>{r}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Shadow</label>
            <div className="flex flex-wrap gap-2">
              {['none', 'sm', 'md', 'lg', 'glow'].map(s => (
                <button key={s} onClick={() => setShadow(s)} className={cn("px-3 py-1.5 text-xs rounded-md border transition-colors", shadow === s ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border hover:bg-muted")}>{s}</button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Color Theme</label>
            <div className="flex flex-wrap gap-2">
              {(['blue', 'emerald', 'rose', 'amber', 'purple', 'zinc'] as const).map(c => (
                <button 
                  key={c} 
                  onClick={() => setColor(c)} 
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform", 
                    color === c ? "scale-110 border-white shadow-md" : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: c === 'zinc' ? '#71717a' : c === 'blue' ? '#3b82f6' : c === 'emerald' ? '#10b981' : c === 'rose' ? '#f43f5e' : c === 'amber' ? '#f59e0b' : '#8b5cf6' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardSandbox() {
  const [padding, setPadding] = useState('p-6');
  const [blur, setBlur] = useState('none');
  const [border, setBorder] = useState('default');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div 
        className="lg:col-span-2 border border-border rounded-2xl bg-card/50 flex items-center justify-center p-12 min-h-[400px] relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://picsum.photos/seed/sandbox/800/600')" }}
      >
        <div className="absolute inset-0 bg-black/20" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative z-10 max-w-sm w-full transition-all duration-500",
            padding,
            blur === 'sm' ? "backdrop-blur-sm bg-white/10" : blur === 'md' ? "backdrop-blur-md bg-white/20" : blur === 'lg' ? "backdrop-blur-xl bg-white/30" : "bg-card",
            border === 'none' ? "border-none" : border === 'thin' ? "border border-white/20" : "border-2 border-white/40",
            "rounded-2xl shadow-2xl"
          )}
        >
          <h4 className={cn("text-xl font-bold mb-2", blur !== 'none' ? "text-white" : "text-foreground")}>Glassmorphic Card</h4>
          <p className={cn("text-sm mb-6", blur !== 'none' ? "text-white/80" : "text-muted-foreground")}>Experiment with blur, padding, and borders to create the perfect container.</p>
          <button className={cn("w-full py-2 rounded-lg font-medium transition-colors", blur !== 'none' ? "bg-white/20 hover:bg-white/30 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
            Action
          </button>
        </motion.div>
      </div>

      <div className="space-y-6 border border-border rounded-2xl bg-card p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-4"><Layers size={18} /> Properties</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Backdrop Blur</label>
            <div className="flex flex-wrap gap-2">
              {['none', 'sm', 'md', 'lg'].map(b => (
                <button key={b} onClick={() => setBlur(b)} className={cn("px-3 py-1.5 text-xs rounded-md border transition-colors", blur === b ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border hover:bg-muted")}>{b}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Padding</label>
            <div className="flex flex-wrap gap-2">
              {['p-4', 'p-6', 'p-8', 'p-12'].map(p => (
                <button key={p} onClick={() => setPadding(p)} className={cn("px-3 py-1.5 text-xs rounded-md border transition-colors", padding === p ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border hover:bg-muted")}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Border</label>
            <div className="flex flex-wrap gap-2">
              {['none', 'thin', 'thick'].map(b => (
                <button key={b} onClick={() => setBorder(b)} className={cn("px-3 py-1.5 text-xs rounded-md border transition-colors", border === b ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border hover:bg-muted")}>{b}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComponentSandbox() {
  const [activeTab, setActiveTab] = useState('button');

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Layers size={16} />
          <span>Interactive Playground</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 font-display">Component Sandbox</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Experiment with UI components interactively. Modify properties and instantly see the result.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 border-b border-border pb-4 overflow-x-auto">
        {[
          { id: 'button', label: 'Buttons', icon: <MousePointer2 size={16} /> },
          { id: 'card', label: 'Cards', icon: <Square size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Sandbox Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'button' && <ButtonSandbox />}
          {activeTab === 'card' && <CardSandbox />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
