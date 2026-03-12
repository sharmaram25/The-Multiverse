'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Activity, Zap, HardDrive, Cpu, Image as ImageIcon, Layers, List, BarChart3 } from 'lucide-react';

// --- Animated Metric Card ---
function MetricCard({ title, value, unit, icon, delay, color }: any) {
  const [count, setCount] = useState(0);
  // eslint-disable-next-line react-hooks/purity
  const randomHeights = useMemo(() => Array.from({ length: 12 }, () => Math.random() * 80 + 20), []);
  
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    const duration = 2000;
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = time - startTime;
      const percent = Math.min(progress / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeOut = percent === 1 ? 1 : 1 - Math.pow(2, -10 * percent);
      
      setCount(start + (end - start) * easeOut);
      
      if (percent < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    setTimeout(() => requestAnimationFrame(animate), delay * 1000);
  }, [value, delay]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="p-6 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden group"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-colors duration-500 ${color}`} />
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-full bg-background border border-border ${color.replace('bg-', 'text-')}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold font-mono tracking-tighter">
          {count.toFixed(value.includes('.') ? 1 : 0)}
        </span>
        <span className="text-lg text-muted-foreground font-mono">{unit}</span>
      </div>
      
      {/* Animated Graph Line */}
      <div className="mt-6 h-8 w-full flex items-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
        {randomHeights.map((h, i) => (
          <motion.div 
            key={i}
            initial={{ height: '10%' }}
            animate={{ height: `${h}%` }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: 'reverse',
              delay: i * 0.1 
            }}
            className={`flex-1 rounded-t-sm ${color}`}
          />
        ))}
      </div>
    </motion.div>
  );
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
          <h3 className="text-2xl font-bold flex items-center gap-2"><ImageIcon className="text-blue-500" /> Image Lazy Loading</h3>
          <p className="text-muted-foreground mt-1">Images only load when they enter the viewport.</p>
        </div>
        <button 
          onClick={toggleOptimized}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isOptimized ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30' : 'bg-red-500/20 text-red-600 border border-red-500/30'}`}
        >
          {isOptimized ? 'Optimized: ON' : 'Optimized: OFF'}
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
                  className="flex justify-between text-emerald-500"
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
                src={`https://picsum.photos/seed/perf${i}/400/200`} 
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
          <h3 className="text-2xl font-bold flex items-center gap-2"><Layers className="text-purple-500" /> Code Splitting</h3>
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
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <span className="font-mono text-sm text-emerald-600 font-bold">main.js (Core React)</span>
              <span className="text-xs text-emerald-600/70">120kb</span>
            </div>
            <AnimatePresence>
              {loadedChunks.filter(c => c !== 'main.js').map((chunk, i) => (
                <motion.div 
                  key={chunk}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-between"
                >
                  <span className="font-mono text-sm text-blue-600">{chunk}</span>
                  <span className="text-xs text-blue-600/70">{10 + (chunk.length * 2)}kb</span>
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
          <h3 className="text-2xl font-bold flex items-center gap-2"><List className="text-orange-500" /> Virtualized List</h3>
          <p className="text-muted-foreground mt-1">Rendering 10,000 items by only drawing what&apos;s visible.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-muted-foreground">DOM Nodes: <span className="text-orange-500 font-bold">{visibleItems.length}</span> / 10000</div>
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
            <div className="border-2 border-orange-500 rounded-lg h-32 relative overflow-hidden bg-background shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <motion.div 
                className="absolute left-0 right-0 bg-orange-500/20 border-y border-orange-500/50"
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
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Activity size={16} />
          <span>System Telemetry</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 font-display">Performance Observatory</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Real-time insights into the engineering techniques that keep The Multiverse running at 60fps.
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        <MetricCard title="Lighthouse Score" value="100" unit="" icon={<Zap size={20} />} delay={0.1} color="bg-emerald-500" />
        <MetricCard title="First Contentful Paint" value="0.8" unit="s" icon={<Activity size={20} />} delay={0.2} color="bg-blue-500" />
        <MetricCard title="Time to Interactive" value="1.2" unit="s" icon={<Cpu size={20} />} delay={0.3} color="bg-purple-500" />
        <MetricCard title="Initial Bundle Size" value="84" unit="kb" icon={<HardDrive size={20} />} delay={0.4} color="bg-orange-500" />
      </div>

      {/* Demonstrations */}
      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-8 flex items-center gap-3">
            <BarChart3 className="text-primary" /> Optimization Techniques
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
