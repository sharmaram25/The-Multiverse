'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Github, Instagram, Linkedin, Globe } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={cn(
      "py-12 px-6 md:px-12 mt-24 transition-colors duration-500",
      theme === 'glass' ? "bg-white/5 backdrop-blur-md border-t border-white/10" :
      theme === 'neon' ? "bg-black border-t-2 border-[#00f3ff]" :
      theme === 'brutalist' ? "bg-white border-t-4 border-black" :
      "border-t border-border bg-background"
    )}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <Link href="/" className="flex items-center gap-3">
             <Logo size={32} />
             <span className={cn(
               "text-xl tracking-tighter",
               theme === 'brutalist' ? "font-black uppercase text-2xl" : "font-bold",
               theme === 'neon' ? "text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" : ""
             )}>The Multiverse</span>
          </Link>
          <p className={cn(
            "text-sm",
            theme === 'neon' ? "font-mono text-gray-400" :
            theme === 'brutalist' ? "font-bold" :
            "text-muted-foreground"
          )}>
            A playground of frontend design, motion, and performance.
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <motion.a 
            whileHover={{ y: -3, color: theme === 'neon' ? '#00f3ff' : 'var(--primary)' }}
            href="https://github.com/sharmaram25" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "transition-colors",
              theme === 'neon' ? "text-gray-500 hover:text-[#00f3ff]" : "text-muted-foreground"
            )}
          >
            <Github size={20} />
          </motion.a>
          <motion.a 
            whileHover={{ y: -3, color: theme === 'neon' ? '#00f3ff' : 'var(--primary)' }}
            href="https://www.linkedin.com/in/ram-sharma-20rs02/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "transition-colors",
              theme === 'neon' ? "text-gray-500 hover:text-[#00f3ff]" : "text-muted-foreground"
            )}
          >
            <Linkedin size={20} />
          </motion.a>
          <motion.a 
            whileHover={{ y: -3, color: theme === 'neon' ? '#00f3ff' : 'var(--primary)' }}
            href="https://www.instagram.com/ramsharma.25/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "transition-colors",
              theme === 'neon' ? "text-gray-500 hover:text-[#00f3ff]" : "text-muted-foreground"
            )}
          >
            <Instagram size={20} />
          </motion.a>
          <motion.a 
            whileHover={{ y: -3, color: theme === 'neon' ? '#00f3ff' : 'var(--primary)' }}
            href="https://portfolio-ram-sharma.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "transition-colors",
              theme === 'neon' ? "text-gray-500 hover:text-[#00f3ff]" : "text-muted-foreground"
            )}
          >
            <Globe size={20} />
          </motion.a>
        </div>
      </div>
      <div className={cn(
        "max-w-7xl mx-auto mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs",
        theme === 'glass' ? "border-t border-white/10 text-blue-100/50" :
        theme === 'neon' ? "border-t border-[#00f3ff]/30 text-gray-500 font-mono" :
        theme === 'brutalist' ? "border-t-2 border-black text-black font-bold" :
        "border-t border-border/50 text-muted-foreground"
      )}>
        <p>© {new Date().getFullYear()} The Multiverse. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built by Ram Sharma</p>
      </div>
    </footer>
  );
}
