'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Activity, Image as ImageIcon, Layers, List, BarChart3 } from 'lucide-react';
import { LiveMetrics } from '@/components/performance/live-metrics';

/** Locally generated placeholder image (no network dependency). */
function placeholder(i: number): string {
  const hue = (i * 47) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},55%,62%)"/><stop offset="1" stop-color="hsl(${(hue + 40) % 360},60%,38%)"/></linearGradient></defs><rect width="400" height="200" fill="url(#g)"/><text x="24" y="176" font-family="monospace" font-size="18" fill="rgba(255,255,255,0.85)">image_${i}.jpg</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function SimulationBadge() {
  return <span className="ml-2 rounded-full border border-border px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Simulation</span>;
}

// --- Lazy Loading Demo ---
function LazyLoadingDemo() {
  const [isOptimized, setIsOptimized] = useState(true);
  const [loadedImages, setLoadedImages] = useState<number[]>([0, 1]);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isOptimized) return;
    
    const { scrollTop, clientHeight } = e.currentTarget;
    const visibleIndex = Math.floor((scrollTop + clientHeight) / 150);
    
    setLoadedImages(prev => {
      const newLoaded = [...prev];
      for (let i = 0; i <= visibleIndex + 1; i++) {
        if (!newLoaded.includes(i)) newLoaded.push(i);
      }
      return newLoaded;
    });
  };

  const toggleOptimized = () => {
    const nextState = !isOptimized;
    setIsOptimized(nextState);
    if (!nextState) {
      setLoadedImages([...Array(10)].map((_, i) => i));
    } else {
      setLoadedImages([0, 1]);
    }
  };

  return (
    <div className="p-8 rounded-3xl border border-border bg-card/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2"><ImageIcon className="text-foreground" /> Image Lazy Loading<SimulationBadge /></h3>
          <p className="text-muted-foreground mt-1">Images only load when they enter the viewport.</p>
        </div>
        <button 
          onClick={toggleOptimized}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isOptimized ? 'bg-primary text-primary-foreground border border-transparent' : 'bg-transparent text-foreground border border-border'}`}
        >
          {isOptimized ? 'Lazy loading on' : 'Lazy loading off'}
        </button>
      </div>
      
      <div 
        className="h-[300px] overflow-y-auto border border-border rounded-xl bg-background p-4 space-y-4 relative"
        onScroll={handleScroll}
      >
        {/* Network Monitor Visualization */}
        <div className="absolute top-4 right-4 w-48 bg-card border border-border rounded-lg p-3 shadow-lg z-10 text-xs font-mono">
          <div className="text-muted-foreground mb-2 border-b border-border pb-1">Network Requests</div>
          <div className="space-y-1 max-h-32 overflow-hidden flex flex-col-reverse">
            <AnimatePresence>
              {loadedImages.map(i => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between text-success"
                >
                  <span>GET image_{i}.jpg</span>
                  <span>200 OK</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-[120px] w-2/3 bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
            {loadedImages.includes(i) ? (
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={placeholder(i)} 
                alt="Demo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <div className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs font-mono">Waiting for scroll...</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Code Splitting Demo ---
function CodeSplittingDemo() {
  const [activeRoute, setActiveRoute] = useState('home');
  const [loadedChunks, setLoadedChunks] = useState<string[]>(['main.js', 'home.js']);

  const navigate = (route: string) => {
    setActiveRoute(route);
    if (!loadedChunks.includes(`${route}.js`)) {
      setTimeout(() => {
        setLoadedChunks(prev => [...prev, `${route}.js`]);
      }, 500); // Simulate network delay
    }
  };

  return (
    <div className="p-8 rounded-3xl border border-border bg-card/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2"><Layers className="text-foreground" /> Code Splitting<SimulationBadge /></h3>
          <p className="text-muted-foreground mt-1">JavaScript is split into smaller chunks and loaded on demand.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* App UI */}
        <div className="border border-border rounded-xl bg-background overflow-hidden flex flex-col h-[300px]">
          <div className="flex border-b border-border bg-muted/50 p-2 gap-2">
            {['home', 'dashboard', 'settings'].map(route => (
              <button 
                key={route}
                onClick={() => navigate(route)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${activeRoute === route ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
              >
                {route}
              </button>
            ))}
          </div>
          <div className="flex-1 p-6 flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRoute}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                {loadedChunks.includes(`${activeRoute}.js`) ? (
                  <>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <Layers className="text-primary w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold capitalize mb-2">{activeRoute} Component</h4>
                    <p className="text-sm text-muted-foreground">Fully loaded and interactive.</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-muted-foreground font-mono">Fetching {activeRoute}.js...</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bundle Visualizer */}
        <div className="border border-border rounded-xl bg-background p-4 flex flex-col h-[300px]">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 border-b border-border pb-2">Browser Memory</h4>
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
            <div className="p-3 rounded-lg bg-muted border border-border flex items-center justify-between">
              <span className="font-mono text-sm text-success font-bold">main.js (Core React)</span>
              <span className="text-xs text-success">120kb</span>
            </div>
            <AnimatePresence>
              {loadedChunks.filter(c => c !== 'main.js').map((chunk, i) => (
                <motion.div 
                  key={chunk}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  className="p-3 rounded-lg bg-card border border-border flex items-center justify-between"
                >
                  <span className="font-mono text-sm text-foreground">{chunk}</span>
                  <span className="text-xs text-foreground">{10 + (chunk.length * 2)}kb</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Virtualized List Demo ---
function VirtualizedListDemo() {
  const [items] = useState(Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`));
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = 300;
  const itemHeight = 40;
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return (
    <div className="p-8 rounded-3xl border border-border bg-card/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2"><List className="text-foreground" /> Virtualized List</h3>
          <p className="text-muted-foreground mt-1">A real virtualized list: 10,000 rows, only the visible ones exist in the DOM.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-muted-foreground">DOM Nodes: <span className="text-foreground font-bold">{visibleItems.length}</span> / 10000</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          className="h-[300px] overflow-y-auto border border-border rounded-xl bg-background relative"
          onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        >
          <div style={{ height: `${items.length * itemHeight}px`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, transform: `translateY(${offsetY}px)` }}>
              {visibleItems.map((item, index) => (
                <div 
                  key={startIndex + index} 
                  className="h-[40px] border-b border-border/50 px-4 flex items-center text-sm font-mono hover:bg-muted/50 transition-colors"
                >
                  <span className="text-muted-foreground w-12">{startIndex + index}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-border rounded-xl bg-background p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          
          <div className="relative z-10 w-full max-w-[200px]">
            <div className="text-center mb-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">Viewport</div>
            <div className="border-2 border-primary rounded-lg h-32 relative overflow-hidden bg-background ">
              <motion.div 
                className="absolute left-0 right-0 bg-primary/20 border-y border-primary/60"
                style={{ 
                  height: '40%', 
                  top: `${(scrollTop / (items.length * itemHeight)) * 100}%` 
                }}
              />
            </div>
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Only rendering <strong className="text-foreground">{visibleItems.length}</strong> items in memory instead of 10,000.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PerformanceObservatory() {
  return (
    <div className="pt-10 pb-16 px-8 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Activity size={16} />
          <span>Measured live in your browser</span>
        </div>
        <h1 className="text-6xl font-bold tracking-tight mb-6 font-display">Performance</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Core Web Vitals and runtime metrics for this session, measured with the browser&apos;s Performance APIs — followed by the techniques that keep a site fast.
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="mb-24">
        <LiveMetrics />
      </div>

      {/* Demonstrations */}
      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-8 flex items-center gap-3">
            <BarChart3 className="text-foreground" /> Optimization techniques
          </h2>
          
          <div className="space-y-8">
            <CodeSplittingDemo />
            <LazyLoadingDemo />
            <VirtualizedListDemo />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
