'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Settings2, 
  Box, 
  Activity, 
  History, 
  LayoutDashboard,
  Zap,
  Lock,
  Compass
} from 'lucide-react';
import { useDesignSystem } from '@/lib/design-system-store';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Node {
  id: string;
  name: string;
  description: string;
  path: string;
  x: number;
  y: number;
  type: 'universe' | 'section' | 'secret';
  icon: any;
  color: string;
}

const NODES: Node[] = [
  { id: 'core', name: 'Multiverse Core', description: 'The point of origin for all dimensions.', path: '/', x: 0, y: 0, type: 'section', icon: Globe, color: '#4f46e5' },
  
  // Universes
  { id: 'univ-minimal', name: 'Minimal Universe', description: 'Focus on essence, spacing, and subtle typography.', path: '/universes?theme=minimal', x: -250, y: -150, type: 'universe', icon: Box, color: '#94a3b8' },
  { id: 'univ-glass', name: 'Glass Universe', description: 'Transparency, depth, and refractive materials.', path: '/universes?theme=glass', x: 250, y: -150, type: 'universe', icon: Box, color: '#38bdf8' },
  { id: 'univ-neon', name: 'Neon Universe', description: 'Vibrant energy, glowing outlines, and high contrast.', path: '/universes?theme=neon', x: 250, y: 150, type: 'universe', icon: Box, color: '#00f3ff' },
  { id: 'univ-brutalist', name: 'Brutalist Universe', description: 'Raw, honest, and intentionally unpolished interfaces.', path: '/universes?theme=brutalist', x: -250, y: 150, type: 'universe', icon: Box, color: '#ffffff' },
  
  // Sections
  { id: 'design-system', name: 'Design System', description: 'Token-driven architecture and documentation.', path: '/design-system', x: 0, y: -250, type: 'section', icon: Settings2, color: '#7c3aed' },
  { id: 'playground', name: 'Design Playground', description: 'Real-time design token customization.', path: '/playground', x: 0, y: 250, type: 'section', icon: Activity, color: '#f43f5e' },
  { id: 'parallel', name: 'Parallel Universes', description: 'Side-by-side design comparison mode.', path: '/parallel-universes', x: 450, y: 0, type: 'section', icon: LayoutDashboard, color: '#fbbf24' },
  { id: 'time-travel', name: 'Time Travel', description: 'Web design evolution through the ages.', path: '/time-travel', x: -450, y: 0, type: 'section', icon: History, color: '#10b981' },
  
  // Secret
  { id: 'univ-secret', name: 'Secret Universe', description: '???', path: '/universe/secret', x: -500, y: -400, type: 'secret', icon: Zap, color: '#0f0' },
];

export default function MultiverseMap() {
  const { tokens } = useDesignSystem();
  const [viewPos, setViewPos] = useState({ x: 0, y: 0, scale: 1 });
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const visibleNodes = useMemo(() => {
    return NODES.filter(n => n.type !== 'secret' || tokens.unlockedSecretUniverse);
  }, [tokens.unlockedSecretUniverse]);

  const handleWheel = (e: React.WheelEvent) => {
    const newScale = Math.min(Math.max(viewPos.scale - e.deltaY * 0.001, 0.5), 2);
    setViewPos(prev => ({ ...prev, scale: newScale }));
  };

  return (
    <div 
      className="relative min-h-screen bg-black overflow-hidden cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={(e) => {
        const startX = e.clientX - viewPos.x;
        const startY = e.clientY - viewPos.y;
        const move = (moveEvent: MouseEvent) => {
          setViewPos(prev => ({ ...prev, x: moveEvent.clientX - startX, y: moveEvent.clientY - startY }));
        };
        const stop = () => {
          window.removeEventListener('mousemove', move);
          window.removeEventListener('mouseup', stop);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
      }}
    >
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-[#020617]">
         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent)]" />
         <div 
           className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
         />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {Array.from({ length: 50 }).map((_, i) => (
           <motion.div 
             key={i}
             className="absolute w-1 h-1 bg-white rounded-full opacity-20"
             animate={{ 
               y: [0, -1000],
               opacity: [0, 0.5, 0]
             }}
             transition={{ 
               duration: Math.random() * 20 + 20, 
               repeat: Infinity, 
               delay: Math.random() * 20 
             }}
             style={{ 
               left: `${Math.random() * 100}%`,
               top: '100%' 
             }}
           />
         ))}
      </div>

      {/* Map Content */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ x: viewPos.x, y: viewPos.y, scale: viewPos.scale }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {/* Connections */}
          {visibleNodes.map(node => {
            if (node.id === 'core') return null;
            return (
              <motion.line
                key={`line-${node.id}`}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${node.x}px)`}
                y2={`calc(50% + ${node.y}px)`}
                stroke={node.color}
                strokeWidth="1"
                strokeDasharray="5 5"
                className="opacity-20"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            );
          })}
        </svg>

        {visibleNodes.map((node) => {
          const isVisited = tokens.visitedPages.some(p => p === node.path || (node.path.includes('?') && p.includes(node.path.split('?')[0])));
          const isCore = node.id === 'core';
          
          return (
            <motion.div
              key={node.id}
              className="absolute"
              style={{ x: node.x, y: node.y }}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <Link href={node.path}>
                <div className="relative group">
                   {/* Aura */}
                   <motion.div 
                     animate={{ 
                       scale: isVisited ? [1, 1.2, 1] : 1,
                       opacity: isVisited ? [0.3, 0.6, 0.3] : 0.1
                     }}
                     transition={{ duration: 3, repeat: Infinity }}
                     className="absolute -inset-10 rounded-full blur-2xl"
                     style={{ backgroundColor: node.color }}
                   />
                   
                   {/* Node Body */}
                   <motion.div 
                     whileHover={{ scale: 1.1 }}
                     className={cn(
                       "relative w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all bg-black",
                       isVisited ? "border-white" : "border-white/10 opacity-60"
                     )}
                     style={{ 
                       borderColor: hoveredNode?.id === node.id ? node.color : undefined,
                       boxShadow: isVisited ? `0 0 20px ${node.color}55` : 'none'
                     }}
                   >
                      <node.icon className={cn("transition-colors", isVisited ? "text-white" : "text-white/20")} size={32} />
                      
                      {/* Sub-label */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-white/50">
                        {node.name}
                      </div>

                      {/* Connection point dots */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-20" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-20" />
                   </motion.div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Info Panel Overlay */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-1/2 left-12 -translate-y-1/2 w-80 p-8 rounded-[2.5rem] bg-black/40 backdrop-blur-3xl border border-white/20 z-50 pointer-events-none"
          >
             <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: hoveredNode.color }}
                >
                   <hoveredNode.icon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">{hoveredNode.name}</h2>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-primary mt-1">{hoveredNode.type}</div>
                </div>
             </div>
             <p className="text-white/60 text-sm leading-relaxed mb-8">
               {hoveredNode.description}
             </p>
             <div className="flex gap-2">
                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '100%' }}
                     className="h-full"
                     style={{ backgroundColor: hoveredNode.color }}
                   />
                </div>
             </div>
             <div className="mt-8 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Click to warp</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interface Labels */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
         <div className="px-6 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3">
            <Compass size={16} className="text-primary animate-spin-slow" />
            <h1 className="text-xs font-black uppercase tracking-[0.5em] text-white">Multiverse Galaxy Map</h1>
         </div>
         <p className="text-[9px] text-white/30 mt-4 uppercase tracking-widest">DRAG TO EXPLORE • SCROLL TO ZOOM</p>
      </div>

      {/* Visited Progress HUD */}
      <div className="fixed bottom-12 left-12 z-40 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl">
         <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">Discovery Status</div>
         <div className="flex items-center gap-4">
            <div className="text-3xl font-black italic tracking-tighter text-white">
               {Math.round((tokens.visitedPages.length / (NODES.length - 1)) * 100)}%
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-white/80">Dimension Data Syncing</span>
               <div className="flex gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={cn("w-4 h-1 rounded-full", i < tokens.visitedPages.length ? "bg-primary" : "bg-white/10")} />
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
