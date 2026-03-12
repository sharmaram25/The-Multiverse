'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, Plus, Trash2, Move, Settings, Type, Image as ImageIcon, Square, MousePointer2, AlignLeft, AlignCenter, AlignRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
type ComponentType = 'button' | 'card' | 'text' | 'hero' | 'feature';

interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

// --- Component Library Definitions ---
const COMPONENT_LIBRARY = [
  { type: 'hero', label: 'Hero Section', icon: <Layout size={16} />, defaultProps: { title: 'Welcome to the Multiverse', subtitle: 'Build your universe block by block.', align: 'center' } },
  { type: 'feature', label: 'Feature Block', icon: <Square size={16} />, defaultProps: { title: 'Lightning Fast', desc: 'Optimized for 60fps performance.' } },
  { type: 'card', label: 'Glass Card', icon: <ImageIcon size={16} />, defaultProps: { title: 'Interactive Element', content: 'Hover to see the effect.', blur: 'md' } },
  { type: 'button', label: 'Primary Button', icon: <MousePointer2 size={16} />, defaultProps: { text: 'Click Me', variant: 'primary', size: 'default' } },
  { type: 'text', label: 'Text Block', icon: <Type size={16} />, defaultProps: { content: 'Add your custom text here. You can change the alignment and size.', size: 'base', align: 'left' } },
];

export default function UIBuilder() {
  const [canvasComponents, setCanvasComponents] = useState<BuilderComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addComponent = useCallback((type: ComponentType, defaultProps: any) => {
    const newId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newComponent: BuilderComponent = {
      id: newId,
      type,
      props: { ...defaultProps }
    };
    setCanvasComponents(prev => [...prev, newComponent]);
    setSelectedId(newId);
  }, []);

  const removeComponent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCanvasComponents(canvasComponents.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateProp = (id: string, key: string, value: any) => {
    setCanvasComponents(canvasComponents.map(c => 
      c.id === id ? { ...c, props: { ...c.props, [key]: value } } : c
    ));
  };

  const selectedComponent = canvasComponents.find(c => c.id === selectedId);

  // --- Renderers ---
  const renderComponent = (comp: BuilderComponent) => {
    const { type, props } = comp;
    const isSelected = selectedId === comp.id;

    const wrapperClass = cn(
      "relative group cursor-pointer transition-all duration-200 border-2",
      isSelected ? "border-primary ring-4 ring-primary/20 z-10" : "border-transparent hover:border-border"
    );

    const renderContent = () => {
      switch (type) {
        case 'hero':
          return (
            <div className={cn("py-20 px-8 rounded-2xl bg-gradient-to-br from-primary/10 to-background border border-border", props.align === 'center' ? 'text-center' : props.align === 'right' ? 'text-right' : 'text-left')}>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-display">{props.title}</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{props.subtitle}</p>
            </div>
          );
        case 'feature':
          return (
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{props.title}</h3>
                <p className="text-muted-foreground">{props.desc}</p>
              </div>
            </div>
          );
        case 'card':
          return (
            <div className={cn(
              "p-8 rounded-2xl border border-white/20 shadow-xl relative overflow-hidden",
              props.blur === 'sm' ? "backdrop-blur-sm bg-white/5" : props.blur === 'md' ? "backdrop-blur-md bg-white/10" : "backdrop-blur-xl bg-white/20"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <h4 className="text-xl font-bold text-foreground mb-2 relative z-10">{props.title}</h4>
              <p className="text-muted-foreground relative z-10">{props.content}</p>
            </div>
          );
        case 'button':
          return (
            <button className={cn(
              "inline-flex items-center justify-center font-medium transition-colors rounded-md",
              props.variant === 'primary' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              props.size === 'sm' ? "h-9 px-3 text-xs" : props.size === 'lg' ? "h-11 px-8 text-base" : "h-10 py-2 px-4 text-sm"
            )}>
              {props.text}
            </button>
          );
        case 'text':
          return (
            <div className={cn(
              "p-4",
              props.size === 'sm' ? "text-sm" : props.size === 'lg' ? "text-lg" : props.size === 'xl' ? "text-2xl font-bold" : "text-base",
              props.align === 'center' ? 'text-center' : props.align === 'right' ? 'text-right' : 'text-left'
            )}>
              {props.content}
            </div>
          );
        default:
          return <div>Unknown Component</div>;
      }
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        key={comp.id}
        onClick={() => setSelectedId(comp.id)}
        className={wrapperClass}
      >
        {renderContent()}
        
        {/* Overlay Controls */}
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute -top-10 right-0 flex items-center gap-1 p-1 bg-card border border-border rounded-lg shadow-lg z-20"
            >
              <div className="px-2 py-1 text-xs font-mono text-muted-foreground border-r border-border mr-1">{type}</div>
              <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors cursor-move"><Move size={14} /></button>
              <button 
                onClick={(e) => removeComponent(comp.id, e)}
                className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md text-muted-foreground transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Layout className="text-primary" size={20} />
          <h1 className="font-bold tracking-tight">UI Builder</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider ml-2">Beta</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Preview</button>
          <button className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Publish</button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Library */}
        <aside className="w-64 border-r border-border bg-card/30 flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Components</h2>
          </div>
          <div className="p-4 space-y-2 overflow-y-auto flex-1">
            {COMPONENT_LIBRARY.map((item) => (
              <button
                key={item.type}
                onClick={() => addComponent(item.type as ComponentType, item.defaultProps)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
                <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
              </button>
            ))}
          </div>
        </aside>

        {/* Center Panel: Canvas */}
        <main className="flex-1 bg-muted/20 overflow-y-auto p-8 relative" onClick={() => setSelectedId(null)}>
          <div className="max-w-4xl mx-auto min-h-[800px] bg-background border border-border shadow-xl rounded-sm p-8 space-y-4 relative">
            {canvasComponents.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <Layout size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Canvas is empty</p>
                <p className="text-sm opacity-70">Click components on the left to add them here.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {canvasComponents.map(renderComponent)}
              </AnimatePresence>
            )}
          </div>
        </main>

        {/* Right Panel: Properties */}
        <aside className="w-80 border-l border-border bg-card/30 flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Settings size={16} /> Properties
            </h2>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            {selectedComponent ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-border">
                  <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    {COMPONENT_LIBRARY.find(c => c.type === selectedComponent.type)?.icon}
                  </div>
                  <div>
                    <h3 className="font-bold capitalize">{selectedComponent.type}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{selectedComponent.id.split('_')[1]}</p>
                  </div>
                </div>

                {/* Dynamic Property Editors based on component type */}
                {Object.keys(selectedComponent.props).map(key => {
                  const value = selectedComponent.props[key];
                  
                  // Text Inputs
                  if (typeof value === 'string' && !['align', 'variant', 'size', 'blur'].includes(key)) {
                    return (
                      <div key={key}>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">{key}</label>
                        {value.length > 50 ? (
                          <textarea 
                            value={value}
                            onChange={(e) => updateProp(selectedComponent.id, key, e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background text-sm min-h-[100px] focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={value}
                            onChange={(e) => updateProp(selectedComponent.id, key, e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                        )}
                      </div>
                    );
                  }

                  // Selectors / Toggles
                  if (key === 'align') {
                    return (
                      <div key={key}>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Alignment</label>
                        <div className="flex bg-muted p-1 rounded-lg">
                          {['left', 'center', 'right'].map(a => (
                            <button 
                              key={a}
                              onClick={() => updateProp(selectedComponent.id, key, a)}
                              className={cn("flex-1 py-1.5 flex justify-center rounded-md transition-colors", value === a ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
                            >
                              {a === 'left' ? <AlignLeft size={16} /> : a === 'center' ? <AlignCenter size={16} /> : <AlignRight size={16} />}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (key === 'variant' || key === 'size' || key === 'blur') {
                    const options = key === 'variant' ? ['primary', 'outline'] : key === 'size' ? ['sm', 'default', 'lg', 'xl'] : ['sm', 'md', 'lg'];
                    return (
                      <div key={key}>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">{key}</label>
                        <select 
                          value={value}
                          onChange={(e) => updateProp(selectedComponent.id, key, e.target.value)}
                          className="w-full p-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none capitalize"
                        >
                          {options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center">
                <Settings size={32} className="mb-4 opacity-20" />
                <p className="text-sm">Select a component on the canvas to edit its properties.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
