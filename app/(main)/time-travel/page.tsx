'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  History, 
  Monitor, 
  Smartphone, 
  Globe, 
  Sparkles,
  MousePointer2,
  Clock,
  ArrowDown,
  ChevronRight,
  Info,
  Layers,
  Zap,
  Palette,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Era = '90s' | '00s' | '10s' | '20s' | 'future';

interface EraData {
  id: Era;
  year: string;
  title: string;
  description: string;
  longDescription: string;
  visuals: {
    bg: string;
    accent: string;
    font: string;
  };
  specs: {
    resolution: string;
    colors: string[];
    fonts: string[];
    tech: string[];
  };
}

const eras: EraData[] = [
  { 
    id: '90s', 
    year: '1995', 
    title: 'Web 1.0', 
    description: 'The era of grey backgrounds, marquee text, and industrial utility.',
    longDescription: 'Web design in the mid-90s was pioneer territory. Constraints like 640x480 resolution and 256 colors forced a functional, often cluttered aesthetic. Animated GIFs and table-based layouts were the height of technology.',
    visuals: {
      bg: 'bg-[#c0c0c0]',
      accent: '#000080',
      font: 'font-serif'
    },
    specs: {
      resolution: '640x480',
      colors: ['#c0c0c0', '#000080', '#ffffff', '#808080'],
      fonts: ['MS Sans Serif', 'Times New Roman'],
      tech: ['HTML 2.0', 'CGI', 'Altavista']
    }
  },
  { 
    id: '00s', 
    year: '2005', 
    title: 'Skeuo-morph', 
    description: 'Digital interfaces mimicking physical objects with gloss, leather, and depth.',
    longDescription: 'The 2000s were obsessed with realism. Buttons looked like they could be pressed, icons had reflections, and textures like brushed metal and glass were everywhere. This era bridged the gap between physical and digital worlds.',
    visuals: {
      bg: 'bg-gradient-to-br from-blue-100 to-blue-300',
      accent: '#3b82f6',
      font: 'font-sans'
    },
    specs: {
      resolution: '1024x768',
      colors: ['#3b82f6', '#f8fafc', '#1e293b', '#94a3b8'],
      fonts: ['Lucida Grande', 'Segoe UI'],
      tech: ['Adobe Flash', 'Web 2.0', 'AJAX']
    }
  },
  { 
    id: '10s', 
    year: '2015', 
    title: 'Flat & Material', 
    description: 'The total removal of decorative elements in favor of grids and bold colors.',
    longDescription: 'With the mobile revolution, complexity gave way to "Flat Design". Microsofts Metro and Googles Material Design introduced a cleaner, card-based language that prioritized content and legibility over visual mimicry.',
    visuals: {
      bg: 'bg-[#0078d7]',
      accent: '#ffffff',
      font: 'font-sans'
    },
    specs: {
      resolution: '1920x1080',
      colors: ['#0078d7', '#00a300', '#da532c', '#603cba'],
      fonts: ['Roboto', 'Open Sans'],
      tech: ['HTML5', 'React', 'Responsive Design']
    }
  },
  { 
    id: '20s', 
    year: '2024', 
    title: 'Modern UI', 
    description: 'Refined systems focusing on dark mode, soft shadows, and motion.',
    longDescription: 'Today, design is a blend of precision and personality. We use complex tokens, sophisticated dark modes, and inter-component motion to create experiences that feel alive yet unobtrusive.',
    visuals: {
      bg: 'bg-zinc-50 dark:bg-zinc-950',
      accent: 'var(--primary)',
      font: 'font-sans'
    },
    specs: {
      resolution: 'Variable',
      colors: ['#18181b', '#ffffff', '#3b82f6', '#f43f5e'],
      fonts: ['Inter', 'Geist'],
      tech: ['Next.js', 'Tailwind', 'AI-Driven UI']
    }
  },
  { 
    id: 'future', 
    year: '2030+', 
    title: 'Ethereal', 
    description: 'Immersive, generative, and cognitive interfaces that transcend screens.',
    longDescription: 'The future of UI is not on a screen, but in the air. Ethereal interfaces use depth, bioluminescence, and generative particles to adapt to the users cognitive state. Interfaces become part of our environment.',
    visuals: {
      bg: 'bg-black',
      accent: '#00f3ff',
      font: 'font-display'
    },
    specs: {
      resolution: 'infinite',
      colors: ['#00f3ff', '#ff00ff', '#000000', '#ffffff'],
      fonts: ['Quantum', 'Neural'],
      tech: ['Neuro-Link', 'Volumetric OS', 'Gen-UI']
    }
  },
];

export default function TimeTravelPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  return (
    <div ref={containerRef} className="relative bg-background h-[500vh]">
      {/* Fixed Sticky UI */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute top-32 left-12 h-[60vh] w-1 bg-muted/20 rounded-full overflow-hidden hidden lg:block">
           <motion.div 
             style={{ scaleY: scrollYProgress }} 
             className="w-full h-full bg-primary origin-top"
           />
        </div>
        
        {/* Timeline Markers */}
        <div className="absolute top-32 left-12 flex flex-col justify-between h-[60vh] translate-x-4 hidden lg:flex">
          {eras.map((era, i) => (
            <div key={era.id} className="flex items-center gap-4">
               <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground rotate-90 origin-left">
                  {era.year}
               </div>
            </div>
          ))}
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-12 right-12 pointer-events-auto flex flex-col items-end gap-2">
           <div className="p-4 rounded-full bg-card/80 backdrop-blur-xl border border-border shadow-2xl flex items-center gap-4">
              <History className="text-primary" size={20} />
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-tighter opacity-50">Navigation</span>
                 <span className="text-xs font-bold">Scroll to Travel</span>
              </div>
              <ArrowDown className="text-primary animate-bounce ml-4" size={16} />
           </div>
        </div>
      </div>

      {/* Full Page Sections */}
      {eras.map((era, index) => (
        <EraSection key={era.id} era={era} index={index} />
      ))}
    </div>
  );
}

function EraSection({ era, index }: { era: EraData; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div 
        style={{ opacity, scale }}
        className="container max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
      >
        {/* Content Side */}
        <div className="space-y-8 z-10 lg:pr-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6">
               <History size={14} />
               <span>{era.id === '20s' ? 'Current Time' : `Era: ${era.year}`}</span>
            </div>
            
            <h2 className={cn(
              "text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8",
              era.id === '90s' && "italic text-zinc-800",
              era.id === '00s' && "text-blue-700 drop-shadow-lg",
              era.id === 'future' && "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]"
            )}>
              {era.title}
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              {era.description}
            </p>
          </motion.div>

          {/* Design Specs Sidebar (Inside content side) */}
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
             <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground mb-3">
                   <Monitor size={14} />
                   <span>Resolution</span>
                </div>
                <span className="text-lg font-bold tracking-tight">{era.specs.resolution}</span>
             </div>
             <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground mb-3">
                   <Palette size={14} />
                   <span>Colors</span>
                </div>
                <div className="flex gap-1">
                   {era.specs.colors.map(color => (
                     <div key={color} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color }} />
                   ))}
                </div>
             </div>
             <div className="col-span-2 p-4 rounded-2xl bg-card border border-border shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground mb-3">
                   <Type size={14} />
                   <span>Typography</span>
                </div>
                <div className="flex flex-wrap gap-2">
                   {era.specs.fonts.map(font => (
                     <span key={font} className="text-xs font-medium px-2 py-0.5 bg-muted rounded-md">{font}</span>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Visual Side */}
        <div className="relative h-[50vh] lg:h-[65vh] flex items-center justify-center">
           <motion.div 
             style={{ y }}
             className={cn(
               "relative w-full h-full rounded-[3rem] border-4 overflow-hidden shadow-2xl p-8 flex flex-col items-center justify-center",
               era.id === '90s' ? "bg-[#c0c0c0] border-zinc-400 border-t-zinc-100 border-l-zinc-100 shadow-[inset_-2px_-2px_0_0_#444,inset_2px_2px_0_0_#fff]" :
               era.id === '00s' ? "bg-gradient-to-b from-blue-100 to-blue-300 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_2px_15px_rgba(255,255,255,0.8)]" :
               era.id === '10s' ? "bg-[#0078d7] border-none rounded-none" :
               era.id === '20s' ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" :
               "bg-black border-primary/30"
             )}
           >
              {era.id === '90s' && <Era90s />}
              {era.id === '00s' && <Era00s />}
              {era.id === '10s' && <Era10s />}
              {era.id === '20s' && <Era20s />}
              {era.id === 'future' && <EraFuture />}

              {/* Background Decorators */}
              {era.id === 'future' && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.1),transparent)] pointer-events-none" />}
              {era.id === '90s' && (
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/brushed-alum.png')" }}
                />
              )}
           </motion.div>

           {/* Floating Info Marker */}
           <motion.div
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -top-6 -right-6 p-4 rounded-3xl bg-primary text-primary-foreground shadow-2xl rotate-12 z-20"
           >
              <Info size={24} />
           </motion.div>
        </div>
      </motion.div>

      {/* Global Background Effects that shift per era */}
      <div className={cn(
        "absolute inset-0 opacity-20 transition-all duration-1000 -z-10",
        era.id === '90s' ? "bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:20px_20px]" :
        era.id === 'future' ? "bg-[radial-gradient(#00f3ff_1px,transparent_1px)] [background-size:30px_30px]" :
        ""
      )} />
    </section>
  );
}

// ERA COMPONENTS (Higher Fidelity)

function Era90s() {
  return (
    <div className="w-full h-full flex flex-col font-serif">
      <div className="bg-[#000080] text-white p-2 flex justify-between items-center text-sm font-bold border-b-2 border-zinc-400">
        <span>The_Internets_Largest_Guestbook.html</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-zinc-300 border-2 border-t-white border-l-white border-r-zinc-800 border-b-zinc-800" />
          <div className="w-4 h-4 bg-zinc-300 border-2 border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 text-[8px] flex items-center justify-center text-black">X</div>
        </div>
      </div>
      <div className="bg-white flex-1 p-8 overflow-auto border-t-4 border-l-4 border-zinc-800 border-b-white border-r-white">
        <center>
          <img src="https://web.archive.org/web/20090831135249/http://geocities.com/Heartland/Acres/5115/const1.gif" alt="Construction" className="mb-4 h-12" loading="lazy" />
          <h1 className="text-3xl text-blue-800 underline font-black mb-4">WELCOME TO MY COOL HOMEPAGE</h1>
          <p className="text-red-600 font-bold mb-6">*** BEST VIEWED IN NETSCAPE NAVIGATOR (800x600) ***</p>
        </center>
        
        <table className="w-full border-2 border-zinc-400">
          <tbody>
            <tr>
              <td className="w-1/4 p-4 border-r-2 border-zinc-400 bg-zinc-200 align-top">
                <ul className="space-y-2 text-blue-700 underline text-sm">
                  <li>MY INTERESTS</li>
                  <li>MY FAMILY</li>
                  <li>COOL LINKS</li>
                  <li>MIDI COLLECTION</li>
                </ul>
              </td>
              <td className="p-6 align-top">
                 <p className="mb-4">Hello visitor! You are person number #000429 to visit this page today! Please dont forget to sign my guestbook before you leave!</p>
                 <div className="h-[2px] w-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 my-8" />
                 <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3N2dDdxM3J6ZzRyZzRyZzRyZzRyZzRyZzRyZzRyZzRyZzRyZzRyJmcmVzaD0x/tT7RsqhHLTrmo/giphy.gif" alt="Animated decorative GIF" className="mx-auto h-16" loading="lazy" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Era00s() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
       <div className="w-64 h-64 rounded-[3.5rem] bg-gradient-to-b from-blue-400 to-blue-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.3),0_0_0_10px_#fff] border-2 border-blue-700 flex flex-col items-center justify-center overflow-hidden relative group">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-b-[100%] blur-[2px] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent)]" />
          <Smartphone size={100} className="text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] relative z-20 mb-2" />
          <span className="text-white font-bold tracking-tight text-xl relative z-20 drop-shadow-md">iConnect</span>
       </div>
       
       <div className="mt-16 flex gap-8">
          <button className="px-12 py-4 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-400 border border-gray-500 shadow-[inset_0_2px_0_rgba(255,255,255,1),0_8px_0_#666,0_15px_20px_rgba(0,0,0,0.2)] font-black text-gray-800 text-lg uppercase tracking-wider active:translate-y-1 active:shadow-[inset_0_2px_0_rgba(255,255,255,1),0_4px_0_#666]">
             Launch Flash
          </button>
       </div>
    </div>
  );
}

function Era10s() {
  return (
    <div className="w-full h-full overflow-hidden flex flex-col items-start justify-start p-12 gap-8">
       <div className="flex items-center gap-12">
          <h3 className="text-7xl font-light text-white font-sans">Start</h3>
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white">
                <Monitor size={24} />
             </div>
             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0078d7]">
                <Globe size={24} />
             </div>
          </div>
       </div>

       <div className="grid grid-cols-4 grid-rows-2 gap-4 w-full flex-1">
          <div className="col-span-2 row-span-2 bg-[#00a300] p-8 flex flex-col justify-end group cursor-pointer transition-transform active:scale-95">
             <Sparkles className="text-white mb-6" size={48} />
             <span className="text-white text-3xl font-semibold">Store</span>
          </div>
          <div className="bg-[#2d89ef] p-6 flex items-center justify-center transition-transform active:scale-95 cursor-pointer">
             <Smartphone size={32} className="text-white" />
          </div>
          <div className="bg-[#da532c] p-6 transition-transform active:scale-95 cursor-pointer" />
          <div className="col-span-2 bg-[#603cba] p-6 flex flex-col justify-end transition-transform active:scale-95 cursor-pointer">
             <span className="text-white text-xl">Video</span>
          </div>
       </div>
    </div>
  );
}

function Era20s() {
  return (
    <div className="w-full h-full p-12 flex flex-col gap-12">
       <div className="flex justify-between items-center">
          <div className="space-y-4">
             <div className="h-6 w-48 bg-muted rounded-full animate-pulse" />
             <div className="h-3 w-32 bg-muted/50 rounded-full animate-pulse" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
             <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
       </div>

       <div className="grid grid-cols-2 gap-8 flex-1">
          <div className="p-8 rounded-[2.5rem] bg-card border border-border flex flex-col gap-4 shadow-sm">
             <div className="h-4 w-12 bg-primary/20 rounded-full" />
             <div className="h-4 w-full bg-muted rounded-full" />
             <div className="h-4 w-3/4 bg-muted/60 rounded-full" />
          </div>
          <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 flex flex-col gap-4 shadow-xl">
             <p className="text-zinc-400 text-sm font-medium">System Status</p>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-white font-bold">Operational</span>
             </div>
          </div>
       </div>

       <div className="flex gap-4">
          <div className="flex-1 h-14 rounded-2xl bg-foreground text-background font-bold flex items-center justify-center shadow-lg transition-transform hover:scale-[1.02]">
             Deploy Changes
          </div>
          <div className="w-14 h-14 rounded-2xl border border-border flex items-center justify-center group cursor-pointer transition-colors hover:bg-muted">
             <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </div>
       </div>
    </div>
  );
}

function EraFuture() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12 relative">
       {/* Neural Nodes */}
       <div className="absolute inset-0 z-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [Math.random() * 500, Math.random() * 500],
                y: [Math.random() * 400, Math.random() * 400],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{ duration: Math.random() * 10 + 5, repeat: Infinity }}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-[2px]"
            />
          ))}
       </div>

       <motion.div 
         animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
         transition={{ duration: 8, repeat: Infinity }}
         className="relative z-10 w-80 h-80 rounded-full border border-white/10 bg-white/5 backdrop-blur-[100px] flex items-center justify-center shadow-[0_0_100px_rgba(0,243,255,0.15)] overflow-hidden"
       >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-pink-500/10" />
          <div className="flex flex-col items-center gap-6">
             <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl animate-pulse opacity-50" />
                <Sparkles size={80} className="text-white relative z-10 drop-shadow-[0_0_20px_rgba(0,243,255,0.5)]" />
             </div>
             <div className="text-center">
                <h4 className="text-white font-black text-2xl tracking-[0.2em] uppercase mb-1">Ethereal</h4>
                <p className="text-cyan-300 text-[10px] font-black uppercase tracking-widest animate-pulse">Bio-Interface Active</p>
             </div>
          </div>
       </motion.div>

       <div className="flex gap-4 relative z-10">
          {[1,2,3,4].map(i => (
            <motion.div 
               key={i}
               whileHover={{ scale: 1.2, y: -5 }}
               className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-cyan-400 cursor-pointer shadow-lg"
            >
               <Layers size={20} />
            </motion.div>
          ))}
       </div>
    </div>
  );
}
