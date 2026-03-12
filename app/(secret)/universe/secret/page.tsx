'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldAlert, Cpu, Database, Network, Power, Lock, Unlock, Zap, ChevronRight, X } from 'lucide-react';
import { useDesignSystem } from '@/lib/design-system-store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SecretUniverse() {
  const { tokens } = useDesignSystem();
  const router = useRouter();
  const [isAccessing, setIsAccessing] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [systemLogs, setSystemLogs] = useState<{ id: number; msg: string; type: 'info' | 'warn' | 'err' }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redirect if not unlocked
  useEffect(() => {
    if (!tokens.unlockedSecretUniverse) {
      router.push('/');
    } else {
      const timer = setTimeout(() => setIsAccessing(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [tokens.unlockedSecretUniverse, router]);

  // Matrix Rain Effect (Higher Density)
  useEffect(() => {
    if (isAccessing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const fontSize = 18;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw character with varied opacity
        ctx.fillStyle = Math.random() > 0.9 ? '#fff' : '#0f0';
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40);
    return () => clearInterval(interval);
  }, [isAccessing]);

  const addLine = (line: string) => {
    setTerminalOutput(prev => [...prev.slice(-20), `> ${line}`]);
  };

  const addLog = (msg: string, type: 'info' | 'warn' | 'err' = 'info') => {
    setSystemLogs(prev => [{ id: Date.now(), msg, type }, ...prev.slice(0, 29)]);
  };

  const [input, setInput] = useState('');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    if (!cmd) return;
    
    addLine(cmd.toUpperCase());
    
    switch (cmd) {
      case 'help':
        addLine('CORE COMMANDS: SCAN, STATUS, KERNEL, LOGS, OVERRIDE, EXIT');
        break;
      case 'scan':
        addLine('INITIALIZING SECTOR SCAN...');
        setTimeout(() => addLine('DETECTED_VULNERABILITIES: [TIME_RIFT_2024, NEON_BLOOM_01]'), 1000);
        break;
      case 'status':
        addLine('GRID_STABILITY: 99.4%');
        addLine('SYNC_LEVEL: SYNAPTIC');
        break;
      case 'kernel':
        addLine('MULTIVERSE-OS v2.4.0-IMMERSIVE');
        addLine('ARCHITECTURE: QUANTUM-BIT-ARRAY');
        break;
      case 'logs':
        addLine('DISPLAYING RECENT SYSTEM EVENTS...');
        break;
      case 'override':
        addLine('ATTEMPTING KERNEL OVERRIDE...');
        setTimeout(() => addLine('ACCESS_DENIED: ROOT_PRIVILEGES_REQUIRED'), 1500);
        addLog('UNAUTHORIZED_OVERRIDE_ATTEMPT', 'err');
        break;
      case 'exit':
        router.push('/universes');
        break;
      default:
        addLine('ERR: COMMAND_UNKNOWN. ACCESS "HELP" FOR PROTOCOLS.');
    }
    setInput('');
  };

  if (!tokens.unlockedSecretUniverse) return null;

  return (
    <div className="relative min-h-screen bg-black text-[#0f0] font-mono overflow-hidden">
      <AnimatePresence>
        {isAccessing ? (
          <motion.div
            key="access"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-8"
          >
             <div className="relative">
                <ShieldAlert size={100} className="text-[#0f0] drop-shadow-[0_0_20px_#0f0]" />
                <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-[-20px] border-2 border-dashed border-[#0f0]/30 rounded-full"
                />
             </div>
             
             <div className="flex flex-col items-center gap-2">
                <div className="text-2xl font-black tracking-[0.5em] uppercase animate-pulse">Establishing Nexus</div>
                <div className="text-[10px] opacity-50 tracking-widest uppercase">Encryption Layer 128-Bit Quantum</div>
             </div>

             <div className="w-80 h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                   initial={{ x: '-100%' }}
                   animate={{ x: '0%' }}
                   transition={{ duration: 2, ease: 'circOut' }}
                   className="w-full h-full bg-[#0f0]" 
                />
             </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen w-screen flex flex-col p-6 lg:p-12 gap-6 relative"
          >
             <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />
             
             {/* Dynamic Header HUD */}
             <div className="flex justify-between items-start z-10">
                <div className="flex flex-col gap-4">
                   <div className="border-l-4 border-[#0f0] pl-4 py-2 bg-black/40 backdrop-blur-md">
                      <div className="text-[10px] opacity-70 mb-1 tracking-[0.2em] font-black uppercase">Core_System_ID</div>
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded-full bg-[#0f0] animate-ping" />
                         <span className="text-xl font-black italic tracking-tighter">MULTIVERSE_ROOT://NEXUS-01</span>
                      </div>
                   </div>
                   
                   <div className="flex gap-2">
                      <div className="px-3 py-1 bg-[#0f0] text-black text-[10px] font-black uppercase">Active_Session</div>
                      <div className="px-3 py-1 border border-[#0f0] text-[10px] font-black uppercase">Encrypted</div>
                   </div>
                </div>

                <div className="text-right">
                   <div className="text-[10px] opacity-70 mb-1 font-black uppercase tracking-widest">Chronos_Sync</div>
                   <div className="text-3xl font-black italic tracking-tighter uppercase tabular-nums">{new Date().toLocaleTimeString()}</div>
                   <div className="flex justify-end gap-2 mt-2">
                       <button 
                         onClick={() => router.push('/universes')}
                         className="flex items-center gap-2 px-4 py-1.5 bg-red-600/20 text-red-500 border border-red-500/50 hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase group"
                       >
                          <Power size={14} className="group-hover:[transform:rotate(90deg)] transition-transform" />
                          Escape_Nexus
                       </button>
                   </div>
                </div>
             </div>

             <div className="flex-1 grid grid-cols-12 gap-8 min-h-0 z-10">
                {/* Left Sidebar: System Diagnostics */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                   <div className="flex-1 border border-[#0f0]/30 bg-black/60 backdrop-blur-xl p-6 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#0f0]/50" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#0f0]/50" />
                      
                      <div className="text-xs font-black uppercase mb-6 flex items-center gap-2">
                         <Cpu size={16} />
                         System_Load
                      </div>

                      <div className="space-y-6">
                         {[
                           { label: 'Neural_Buffer', val: 78, color: 'bg-emerald-500' },
                           { label: 'Reality_Sync', val: 42, color: 'bg-sky-500' },
                           { label: 'Entropy_Level', val: 12, color: 'bg-amber-500' }
                         ].map((stat, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between text-[10px] font-bold uppercase opacity-70">
                                 <span>{stat.label}</span>
                                 <span>{stat.val}%</span>
                              </div>
                              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.val}%` }}
                                    className={cn("h-full", stat.color)}
                                 />
                              </div>
                           </div>
                         ))}
                      </div>

                      <div className="mt-12 space-y-4">
                         <div className="text-[10px] font-black uppercase opacity-50 mb-4 tracking-widest italic">Node_Distribution</div>
                         <div className="grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4, 5, 6].map(node => (
                               <div key={node} className="p-2 border border-[#0f0]/10 bg-[#0f0]/5 flex items-center justify-between">
                                  <span className="text-[8px] font-bold">NODE_{node}</span>
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#0f0] animate-pulse" />
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Center: Main Terminal */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 min-h-[400px]">
                   <div className="flex-1 border border-[#0f0]/50 bg-black/90 shadow-[0_0_100px_rgba(0,255,0,0.05)] backdrop-blur-2xl flex flex-col p-8 rounded-lg relative">
                      <div className="absolute -top-3 left-6 px-3 bg-black border border-[#0f0]/50 text-[10px] font-black uppercase italic tracking-widest text-[#0f0]">
                         Terminal_Interface_Alpha
                      </div>
                      
                      <div className="flex-1 overflow-auto space-y-2 text-sm custom-scrollbar pr-4 mb-6">
                         <div className="opacity-30 text-[9px] mb-8 leading-tight">
                            {'>>> ACCESSING CORE DIMENSIONAL KERNEL...'}<br/>
                            {'>>> AUTHORIZATION: GHOST-MODE-ACTIVE'}<br/>
                            {'>>> PROTOCOL: 0-X-DARK-UNIVERSE'}<br/>
                            {'>>> WARNING: SESSION IS BEING MONITORED BY THE ARCHITECT'}
                         </div>
                         
                         {terminalOutput.map((line, i) => (
                           <motion.div 
                              initial={{ opacity: 0, x: -10 }} 
                              animate={{ opacity: 1, x: 0 }} 
                              key={i}
                              className="flex gap-4"
                           >
                              <span className="opacity-40 italic">#</span>
                              <span className={cn(line.startsWith('ERR') ? 'text-red-500' : 'text-[#0f0]')}>{line}</span>
                           </motion.div>
                         ))}
                         {!terminalOutput.length && (
                           <div className="flex items-center gap-4 text-emerald-400 font-bold animate-pulse">
                              <ChevronRight size={18} />
                              INITIAL_SYSTEM_READY._
                           </div>
                         )}
                      </div>
                      
                      <form onSubmit={handleCommand} className="flex gap-4 border-t border-[#0f0]/20 pt-6">
                         <div className="flex items-center gap-2 text-[#0f0]">
                            <span className="font-black">λ</span>
                            <span className="animate-pulse">_</span>
                         </div>
                         <input 
                            autoFocus
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-transparent border-none outline-none flex-1 font-mono uppercase tracking-[0.2em] text-lg font-black placeholder:opacity-20"
                            placeholder="TYPE COMMAND..."
                         />
                      </form>
                   </div>
                </div>

                {/* Right Sidebar: Logs & Nodes */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                   <div className="h-2/3 border border-[#0f0]/30 bg-black/60 backdrop-blur-xl p-6 flex flex-col">
                      <div className="text-xs font-black uppercase mb-4 flex items-center gap-2">
                         <Database size={16} />
                         Security_Logs
                      </div>
                      <div className="flex-1 overflow-auto space-y-3 custom-scrollbar text-[10px]">
                         {systemLogs.map(log => (
                           <div key={log.id} className="flex gap-3 leading-tight group">
                              <span className="opacity-30 tabular-nums">[{new Date(log.id).toLocaleTimeString()}]</span>
                              <span className={cn(
                                log.type === 'err' ? 'text-red-500' : 'text-[#0f0]/70'
                              )}>{log.msg}</span>
                           </div>
                         ))}
                         {!systemLogs.length && <div className="opacity-20 italic">No events recorded...</div>}
                      </div>
                   </div>

                   <div className="h-1/3 border border-[#0f0]/30 bg-[#0f0]/5 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center gap-4 group">
                      <Lock className="text-[#0f0]/30 group-hover:text-[#0f0] transition-colors" size={32} />
                      <div className="space-y-1">
                         <div className="text-[10px] font-black uppercase">Core_Encryption</div>
                         <div className="text-xs opacity-50 italic">RSA-4096 VALID</div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Footer Micro-stats */}
             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 z-10 border-t border-[#0f0]/10 pt-4">
                <div className="flex gap-8">
                   <span>Lat: 34.0522° N</span>
                   <span>Lng: 118.2437° W</span>
                   <span>Alt: 240m</span>
                </div>
                <div>Protocol: Multiverse-Core-V1</div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
