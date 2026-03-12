// @ts-nocheck
// Type checking disabled due to @react-three/fiber React 19 type incompatibility
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Beaker, Sparkles, Waves, Type, Code2, Grid3X3 } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

// --- Particle System ---
function ParticleSwarm() {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  if (positions.length === 0) return null;

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00f3ff" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

// --- Fluid Gradient ---
function FluidGradient() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const x = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const y = useSpring(mouseY, { stiffness: 50, damping: 20 });

  return (
    <div 
      className="relative w-full h-64 rounded-2xl overflow-hidden bg-black cursor-crosshair border border-border"
      onMouseMove={handleMouseMove}
    >
      <motion.div 
        className="absolute inset-0 opacity-80 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,0,255,0.8) 0%, transparent 50%)`,
          x: useTransform(x, v => v - 300),
          y: useTransform(y, v => v - 300),
          width: 600,
          height: 600,
        }}
      />
      <motion.div 
        className="absolute inset-0 opacity-80 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0,255,255,0.8) 0%, transparent 50%)`,
          x: useTransform(x, v => -v + 100),
          y: useTransform(y, v => -v + 100),
          width: 800,
          height: 800,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h3 className="text-white font-bold text-2xl mix-blend-difference">Fluid Gradient</h3>
      </div>
    </div>
  );
}

// --- Interactive Typography ---
function InteractiveText({ text }: { text: string }) {
  const rotations = useMemo(() => text.split('').map(() => Math.random() * 20 - 10), [text]);

  return (
    <div className="flex gap-1 justify-center overflow-hidden p-8 border border-border rounded-2xl bg-card">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="text-5xl md:text-7xl font-black uppercase font-display cursor-default"
          whileHover={{ 
            y: -20, 
            color: '#00f3ff',
            scale: 1.2,
            rotate: rotations[i],
            transition: { type: 'spring', stiffness: 300, damping: 10 }
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
}

// --- Noise Background ---
function NoiseBackground() {
  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-border bg-black flex items-center justify-center group">
      <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-500" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      <div className="relative z-10 text-white font-mono text-xl tracking-widest uppercase">Static Noise</div>
    </div>
  );
}

export default function ExperimentalContent() {
  const [devMode, setDevMode] = useState(false);

  // Konami Code Easter Egg
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          alert('🚀 SECRET UNIVERSE UNLOCKED! (Easter Egg Triggered)');
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn(
      "min-h-screen pb-12 px-6 md:px-12 max-w-7xl mx-auto transition-all duration-500",
      devMode ? "outline outline-red-500/20 outline-offset-4 bg-red-500/5" : ""
    )}>
      {/* Dev Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setDevMode(!devMode)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all shadow-lg",
            devMode ? "bg-red-500 text-white shadow-red-500/50" : "bg-card border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Code2 size={14} /> {devMode ? 'Dev Mode: ON' : 'Dev Mode: OFF'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Beaker size={16} />
          <span>Research Facility</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 font-display">Experimental Lab</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Pushing the boundaries of web capabilities with WebGL, advanced physics, and experimental interactions.
        </p>
      </motion.div>

      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8", devMode ? "gap-12" : "")}>
        
        {/* Particle System */}
        <div className={cn("col-span-1 lg:col-span-2 h-[400px] rounded-3xl overflow-hidden relative border border-border bg-black", devMode ? "outline outline-dashed outline-blue-500/50" : "")}>
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white/80 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            <Sparkles size={16} className="text-[#00f3ff]" />
            <span className="text-sm font-medium tracking-wider uppercase">WebGL Particle Swarm</span>
          </div>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ParticleSwarm />
          </Canvas>
        </div>

        {/* Fluid Gradient */}
        <div className={cn("space-y-4", devMode ? "outline outline-dashed outline-green-500/50 p-4 rounded-xl" : "")}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Waves size={18} />
            <h2 className="text-xl font-bold text-foreground">Fluid Gradient</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Animated gradients that react to cursor movement using Framer Motion springs.</p>
          <FluidGradient />
        </div>

        {/* Noise Background */}
        <div className={cn("space-y-4", devMode ? "outline outline-dashed outline-purple-500/50 p-4 rounded-xl" : "")}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Grid3X3 size={18} />
            <h2 className="text-xl font-bold text-foreground">Dynamic Noise</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">SVG turbulence filters generating procedural noise textures.</p>
          <NoiseBackground />
        </div>

        {/* Interactive Typography */}
        <div className={cn("col-span-1 lg:col-span-2 space-y-4", devMode ? "outline outline-dashed outline-orange-500/50 p-4 rounded-xl" : "")}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Type size={18} />
            <h2 className="text-xl font-bold text-foreground">Kinetic Typography</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Hover over individual characters to trigger physics-based distortion.</p>
          <InteractiveText text="MULTIVERSE" />
        </div>

      </div>
    </div>
  );
}
