'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Layers, Type, Square, Maximize, Palette, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Sandbox Components ---

function ButtonSandbox() {
  const [variant, setVariant] = useState('primary');
  const [size, setSize] = useState('default');
  const [radius, setRadius] = useState('md');
  const [shadow, setShadow] = useState('none');
  const [color, setColor] = useState('blue');
  const [isHovered, setIsHovered] = useState(false);

  const getButtonClasses = () => {
    const base = "inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    
    const variants: Record<string, string> = {
      primary: `bg-${color}-600 text-white hover:bg-${color}-700`,
      secondary: `bg-${color}-100 text-${color}-900 hover:bg-${color}-200 dark:bg-${color}-900/30 dark:text-${color}-100 dark:hover:bg-${color}-900/50`,
      outline: `border border-${color}-200 hover:bg-${color}-100 hover:text-${color}-900 dark:border-${color}-800 dark:hover:bg-${color}-900/50 dark:hover:text-${color}-100`,
      ghost: `hover:bg-${color}-100 hover:text-${color}-900 dark:hover:bg-${color}-900/50 dark:hover:text-${color}-100 text-${color}-600 dark:text-${color}-400`,
      link: `underline-offset-4 hover:underline text-${color}-600 dark:text-${color}-400`,
    };

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
      glow: `shadow-[0_0_15px_rgba(var(--${color}-500),0.5)]`,
    };

    return cn(base, variants[variant], sizes[size], radii[radius], shadows[shadow]);
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
              {['blue', 'emerald', 'rose', 'amber', 'purple', 'zinc'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setColor(c)} 
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform", 
                    color === c ? "scale-110 border-white shadow-md" : "border-transparent hover:scale-105",
                    `bg-${c}-500`
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
      <div className="lg:col-span-2 border border-border rounded-2xl bg-card/50 flex items-center justify-center p-12 min-h-[400px] relative overflow-hidden bg-[url('https://picsum.photos/seed/sandbox/800/600')] bg-cover bg-center">
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
