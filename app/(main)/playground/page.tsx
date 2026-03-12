'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDesignSystem, DesignTokens } from '@/lib/design-system-store';
import { 
  Settings2, 
  Eye, 
  Code2, 
  RotateCcw, 
  Download, 
  Copy, 
  Check,
  Type,
  Palette,
  Maximize,
  Circle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DesignPlayground() {
  const { tokens, updateToken, resetTokens } = useDesignSystem();
  const [activeTab, setActiveTab] = useState<'controls' | 'preview' | 'inspect'>('preview');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportConfig = {
    css: `:root {
  --primary: ${tokens.primary};
  --accent: ${tokens.accent};
  --bg: ${tokens.background};
  --fg: ${tokens.foreground};
  --radius: ${tokens.radius}px;
  --spacing: ${tokens.spacing}px;
}`,
    tailwind: `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "${tokens.primary}",
        accent: "${tokens.accent}",
      },
      borderRadius: {
        md: "${tokens.radius}px",
      }
    }
  }
}`
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-hidden bg-background">
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Zap size={20} />
          </div>
          <div>
            <h1 className="font-bold">Design Playground</h1>
            <p className="text-xs text-muted-foreground">Modify the system in real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={resetTokens}
            className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
            title="Reset to defaults"
          >
            <RotateCcw size={18} />
          </button>
          <div className="h-6 w-px bg-border mx-2 md:hidden" />
          <div className="flex bg-muted p-1 rounded-lg md:hidden">
             {[
               { id: 'controls', icon: Settings2 },
               { id: 'preview', icon: Eye },
               { id: 'inspect', icon: Code2 },
             ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  <tab.icon size={16} />
                </button>
             ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Controls */}
        <aside className={cn(
          "w-80 border-r bg-card h-full overflow-y-auto hidden md:block shrink-0",
          activeTab === 'controls' ? "!block absolute inset-0 z-10 w-full" : ""
        )}>
          <div className="p-6 space-y-8">
            {/* Color Controls */}
            <ControlSection title="Colors" icon={Palette}>
              <ColorPicker label="Primary" value={tokens.primary} onChange={(v) => updateToken('primary', v)} />
              <ColorPicker label="Accent" value={tokens.accent} onChange={(v) => updateToken('accent', v)} />
              <ColorPicker label="Background" value={tokens.background} onChange={(v) => updateToken('background', v)} />
              <ColorPicker label="Foreground" value={tokens.foreground} onChange={(v) => updateToken('foreground', v)} />
            </ControlSection>

            {/* Geometry Controls */}
            <ControlSection title="Geometry" icon={Circle}>
              <Slider 
                label="Border Radius" 
                value={tokens.radius} 
                min={0} 
                max={32} 
                unit="px"
                onChange={(v) => updateToken('radius', v)} 
              />
              <Slider 
                label="Base Spacing" 
                value={tokens.spacing} 
                min={8} 
                max={32} 
                unit="px"
                onChange={(v) => updateToken('spacing', v)} 
              />
            </ControlSection>

            {/* Typography Controls */}
            <ControlSection title="Typography" icon={Type}>
               <Select 
                 label="Font Family" 
                 value="Inter" 
                 options={['Inter', 'Poppins', 'Space Grotesk']} 
                 onChange={() => {}} 
               />
               <Slider 
                 label="Heading Scale" 
                 value={1.2} 
                 min={1} 
                 max={2} 
                 step={0.1}
                 onChange={() => {}} 
               />
            </ControlSection>

            {/* Motion Controls */}
            <ControlSection title="Motion" icon={Zap}>
              <Slider 
                label="Duration Scale" 
                value={tokens.motionSpeed} 
                min={0.1} 
                max={3} 
                step={0.1}
                unit="x"
                onChange={(v) => updateToken('motionSpeed', v)} 
              />
            </ControlSection>
          </div>
        </aside>

        {/* Center Panel: Preview */}
        <main className={cn(
          "flex-1 h-full overflow-y-auto bg-muted/20 relative group",
          activeTab === 'preview' ? "block" : "hidden md:block"
        )}>
          <div className="min-h-full p-12 flex flex-col items-center gap-12 max-w-4xl mx-auto">
             <div className="w-full space-y-4 text-center">
               <h2 className="text-4xl font-bold font-display">Interface Preview</h2>
               <p className="text-muted-foreground">Interact with elements to see token changes in action.</p>
             </div>

             {/* UI Sandbox Components */}
             <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Buttons */}
               <PreviewCard title="Buttons">
                 <div className="flex flex-wrap gap-4 justify-center">
                   <button className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-md shadow-lg transition-all hover:scale-105">Primary</button>
                   <button className="px-6 py-2 border-2 border-primary text-primary font-bold rounded-md hover:bg-primary/5 transition-all">Outline</button>
                 </div>
               </PreviewCard>

               {/* Cards */}
               <PreviewCard title="Cards">
                 <div className="p-6 rounded-lg bg-card border shadow-xl w-full">
                    <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-4">
                      <Palette size={24} />
                    </div>
                    <h4 className="font-bold text-lg mb-1">Glassmorphic Card</h4>
                    <p className="text-sm text-muted-foreground">Tokens are being applied globally to this component.</p>
                 </div>
               </PreviewCard>

               {/* Navigation */}
               <PreviewCard title="Navigation" className="md:col-span-2">
                 <div className="bg-card border rounded-xl overflow-hidden shadow-lg w-full">
                    <div className="px-6 py-4 flex items-center justify-between border-b">
                      <span className="font-black uppercase tracking-tighter">Multiverse</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-bold text-primary">Home</span>
                        <span className="text-sm font-medium text-muted-foreground">About</span>
                      </div>
                    </div>
                    <div className="p-8 flex items-center gap-6">
                       <div className="flex-1 space-y-2">
                         <div className="h-4 w-3/4 bg-muted rounded" />
                         <div className="h-4 w-1/2 bg-muted rounded" />
                       </div>
                       <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">+</button>
                    </div>
                 </div>
               </PreviewCard>
             </div>
          </div>
        </main>

        {/* Right Panel: Inspector */}
        <aside className={cn(
          "w-80 border-l bg-card h-full overflow-hidden hidden lg:flex flex-col shrink-0",
          activeTab === 'inspect' ? "!flex absolute inset-0 z-10 w-full" : ""
        )}>
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Code2 size={16} /> Token Inspector
            </h3>
            <button 
              onClick={() => copyToClipboard(exportConfig.css)}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {copied ? <Check size={16} /> : <Download size={16} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-6">
            <div>
              <span className="text-muted-foreground block mb-2 px-2 uppercase tracking-widest font-black text-[9px]">CSS Variables</span>
              <div className="bg-muted p-4 rounded-lg border">
                <pre className="text-blue-600 dark:text-blue-400">{exportConfig.css}</pre>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground block mb-2 px-2 uppercase tracking-widest font-black text-[9px]">Tailwind Config</span>
              <div className="bg-muted p-4 rounded-lg border">
                <pre className="text-emerald-600 dark:text-emerald-400">{exportConfig.tailwind}</pre>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground block mb-2 px-2 uppercase tracking-widest font-black text-[9px]">Store State</span>
              <div className="bg-muted p-4 rounded-lg border">
                <pre className="text-orange-600 dark:text-orange-400">{JSON.stringify(tokens, null, 2)}</pre>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Sub-components for cleaner structure
function ControlSection({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary font-bold border-b border-primary/10 pb-2">
        <Icon size={16} />
        <span className="text-xs uppercase tracking-widest">{title}</span>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-md border shadow-sm overflow-hidden flex-shrink-0">
          <input 
            type="color" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer border-none p-0 bg-transparent scale-150"
          />
        </div>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-8 bg-muted border-none rounded-md px-2 font-mono text-[10px] focus:ring-1 ring-primary outline-none"
        />
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, unit = '', onChange }: { label: string, value: number, min: number, max: number, step?: number, unit?: string, onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
        <span className="text-[10px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 bg-muted border-none rounded-md px-2 text-xs font-medium focus:ring-1 ring-primary outline-none"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function PreviewCard({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow", className)}>
      <h3 className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-6">{title}</h3>
      <div className="flex flex-col items-center justify-center min-h-[100px]">
        {children}
      </div>
    </div>
  );
}
