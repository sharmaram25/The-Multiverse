'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useTheme, Theme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, LayoutTemplate, Layers, Zap, Square } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const universeData: Record<Theme, { name: string; icon: React.ReactNode; description: string; philosophy: string; colors: { name: string; class: string }[]; typography: { label: string; class: string; text: string }[] }> = {
  minimal: {
    name: 'Minimal Universe',
    icon: <LayoutTemplate size={32} />,
    description: 'Clean, calm, highly structured. Focus on whitespace and typography.',
    philosophy: 'The Minimal Universe strips away the unnecessary. It relies on strong typography, generous whitespace, and a monochromatic palette to guide the user\'s attention to what truly matters. Content is king, and the interface is merely a silent servant.',
    colors: [
      { name: 'Background', class: 'bg-white border border-gray-200' },
      { name: 'Foreground', class: 'bg-[#111111]' },
      { name: 'Muted', class: 'bg-[#f4f4f5]' },
      { name: 'Border', class: 'bg-[#e4e4e7]' },
    ],
    typography: [
      { label: 'Display', class: 'text-5xl font-bold tracking-tight', text: 'Minimalism' },
      { label: 'Heading', class: 'text-2xl font-semibold', text: 'Structured Content' },
      { label: 'Body', class: 'text-base text-muted-foreground', text: 'The interface should get out of the way.' },
    ]
  },
  glass: {
    name: 'Glass Universe',
    icon: <Layers size={32} />,
    description: 'Glassmorphism aesthetic. Soft gradients and layered depth.',
    philosophy: 'The Glass Universe creates a sense of depth and hierarchy through translucency. By blurring the background and using subtle light borders, elements appear to float. It feels modern, premium, and deeply integrated with its environment.',
    colors: [
      { name: 'Background', class: 'bg-[#0f172a]' },
      { name: 'Glass Panel', class: 'bg-white/10 backdrop-blur-md border border-white/20' },
      { name: 'Primary', class: 'bg-white/20' },
      { name: 'Text', class: 'bg-[#f8fafc]' },
    ],
    typography: [
      { label: 'Display', class: 'text-5xl font-light tracking-wide', text: 'Translucency' },
      { label: 'Heading', class: 'text-2xl font-medium', text: 'Layered Depth' },
      { label: 'Body', class: 'text-base text-blue-100/70', text: 'Elements float above the background.' },
    ]
  },
  neon: {
    name: 'Neon Universe',
    icon: <Zap size={32} />,
    description: 'Futuristic cyberpunk interface. Glowing borders and pulse indicators.',
    philosophy: 'The Neon Universe is high-energy and futuristic. It uses stark black backgrounds contrasted with intensely saturated, glowing colors. It draws inspiration from sci-fi interfaces, HUDs, and cyberpunk aesthetics.',
    colors: [
      { name: 'Background', class: 'bg-[#050505] border border-gray-800' },
      { name: 'Cyan Glow', class: 'bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]' },
      { name: 'Magenta Accent', class: 'bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]' },
      { name: 'Dark Surface', class: 'bg-[#0a0a0a] border border-[#00f3ff]/30' },
    ],
    typography: [
      { label: 'Display', class: 'text-5xl font-bold uppercase tracking-widest text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]', text: 'CYBERPUNK' },
      { label: 'Heading', class: 'text-2xl font-bold uppercase tracking-wider', text: 'SYSTEM STATUS' },
      { label: 'Body', class: 'text-base font-mono text-gray-400', text: 'INITIALIZING NEON PROTOCOLS...' },
    ]
  },
  brutalist: {
    name: 'Brutalist Universe',
    icon: <Square size={32} />,
    description: 'Raw, bold, unconventional design. High contrast and sharp edges.',
    philosophy: 'The Brutalist Universe rejects modern polish in favor of raw, unrefined energy. It features harsh contrasts, thick borders, web-safe colors, and a deliberate lack of subtle transitions. It is loud, unapologetic, and highly memorable.',
    colors: [
      { name: 'Background', class: 'bg-[#e6e6e6]' },
      { name: 'Pure Black', class: 'bg-[#000000]' },
      { name: 'Warning Red', class: 'bg-[#ff3300]' },
      { name: 'Hyper Blue', class: 'bg-[#0000ff]' },
    ],
    typography: [
      { label: 'Display', class: 'text-6xl font-black uppercase leading-none', text: 'BRUTAL' },
      { label: 'Heading', class: 'text-3xl font-black uppercase border-b-4 border-black pb-2', text: 'RAW ENERGY' },
      { label: 'Body', class: 'text-lg font-bold', text: 'NO SOFT EDGES. NO SUBTLETY.' },
    ]
  }
};

interface UniverseContentProps {
  id: Theme;
}

export function UniverseContent({ id }: UniverseContentProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const data = universeData[id];

  useEffect(() => {
    if (data && theme !== id) {
      setTheme(id);
    }
  }, [id, theme, setTheme, data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Universe not found</h1>
        <Button onClick={() => router.push('/universes')}>Back to Gallery</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Link href="/universes" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-12 transition-colors">
          <ArrowLeft size={16} />
          Back to Gallery
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className={cn(
              "p-4 rounded-2xl",
              id === 'glass' ? "bg-white/10 backdrop-blur-md border border-white/20" :
              id === 'neon' ? "bg-black border border-[#00f3ff] text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)] rounded-none" :
              id === 'brutalist' ? "bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none" :
              "bg-muted"
            )}>
              {data.icon}
            </div>
            <h1 className={cn(
              "text-5xl md:text-7xl tracking-tight",
              id === 'brutalist' ? "font-black uppercase" :
              id === 'neon' ? "font-bold uppercase tracking-widest text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" :
              "font-bold font-display"
            )}>
              {data.name}
            </h1>
          </div>
          <p className={cn(
            "text-2xl max-w-3xl",
            id === 'neon' ? "text-[#00f3ff]/80 font-mono" :
            id === 'brutalist' ? "font-bold" :
            "text-muted-foreground"
          )}>
            {data.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className={cn(
              "text-3xl mb-6",
              id === 'brutalist' ? "font-black uppercase border-b-4 border-black pb-2" :
              id === 'neon' ? "font-bold uppercase tracking-widest text-white border-b border-[#00f3ff]/30 pb-2" :
              "font-semibold"
            )}>Philosophy</h2>
            <p className={cn(
              "text-lg leading-relaxed",
              id === 'neon' ? "text-gray-400 font-mono" :
              id === 'brutalist' ? "font-bold text-xl" :
              "text-muted-foreground"
            )}>
              {data.philosophy}
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className={cn(
              "text-3xl mb-6",
              id === 'brutalist' ? "font-black uppercase border-b-4 border-black pb-2" :
              id === 'neon' ? "font-bold uppercase tracking-widest text-white border-b border-[#00f3ff]/30 pb-2" :
              "font-semibold"
            )}>Color Palette</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.colors.map((color, i) => (
                <div key={i} className="space-y-2">
                  <div className={cn("h-24 w-full rounded-xl", color.class, id === 'brutalist' || id === 'neon' ? 'rounded-none' : '')} />
                  <p className={cn(
                    "text-sm",
                    id === 'neon' ? "font-mono text-[#00f3ff]" :
                    id === 'brutalist' ? "font-bold uppercase" :
                    "font-medium"
                  )}>{color.name}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-24"
        >
          <h2 className={cn(
            "text-3xl mb-8",
            id === 'brutalist' ? "font-black uppercase border-b-4 border-black pb-2" :
            id === 'neon' ? "font-bold uppercase tracking-widest text-white border-b border-[#00f3ff]/30 pb-2" :
            "font-semibold"
          )}>Typography Scale</h2>
          <div className={cn(
            "p-8 rounded-2xl border",
            id === 'glass' ? "bg-white/5 backdrop-blur-md border-white/10" :
            id === 'neon' ? "bg-black border-[#00f3ff]/30 rounded-none" :
            id === 'brutalist' ? "bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" :
            "bg-card border-border"
          )}>
            <div className="space-y-8">
              {data.typography.map((type, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline border-b border-border/50 pb-8 last:border-0 last:pb-0">
                  <div className={cn(
                    "text-sm",
                    id === 'neon' ? "font-mono text-[#00f3ff]/70" :
                    id === 'brutalist' ? "font-bold uppercase" :
                    "text-muted-foreground font-medium"
                  )}>{type.label}</div>
                  <div className="md:col-span-3">
                    <div className={type.class}>{type.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className={cn(
            "text-3xl mb-8",
            id === 'brutalist' ? "font-black uppercase border-b-4 border-black pb-2" :
            id === 'neon' ? "font-bold uppercase tracking-widest text-white border-b border-[#00f3ff]/30 pb-2" :
            "font-semibold"
          )}>Example UI Blocks</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Login Form Example */}
            <Card hoverEffect>
              <CardHeader>
                <CardTitle>System Access</CardTitle>
                <CardDescription>Enter your credentials to continue.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className={cn(
                    "text-sm font-medium",
                    id === 'neon' ? "font-mono text-[#00f3ff]" :
                    id === 'brutalist' ? "font-bold uppercase" : ""
                  )}>Username</label>
                  <Input placeholder="admin" />
                </div>
                <div className="space-y-2">
                  <label className={cn(
                    "text-sm font-medium",
                    id === 'neon' ? "font-mono text-[#00f3ff]" :
                    id === 'brutalist' ? "font-bold uppercase" : ""
                  )}>Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Authenticate</Button>
              </CardFooter>
            </Card>

            {/* Data Card Example */}
            <Card hoverEffect>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Real-time system analysis.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className={cn(
                        "text-sm",
                        id === 'neon' ? "font-mono text-gray-400" :
                        id === 'brutalist' ? "font-bold" : "text-muted-foreground"
                      )}>CPU Usage</span>
                      <span className={cn(
                        "text-sm font-medium",
                        id === 'neon' ? "text-[#00f3ff]" : ""
                      )}>78%</span>
                    </div>
                    <div className={cn(
                      "h-2 w-full bg-muted overflow-hidden",
                      id === 'brutalist' || id === 'neon' ? "rounded-none" : "rounded-full"
                    )}>
                      <div className={cn(
                        "h-full w-[78%]",
                        id === 'neon' ? "bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" :
                        id === 'brutalist' ? "bg-[#ff3300]" : "bg-primary"
                      )} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className={cn(
                        "text-sm",
                        id === 'neon' ? "font-mono text-gray-400" :
                        id === 'brutalist' ? "font-bold" : "text-muted-foreground"
                      )}>Memory Allocation</span>
                      <span className={cn(
                        "text-sm font-medium",
                        id === 'neon' ? "text-[#ff00ff]" : ""
                      )}>4.2 GB</span>
                    </div>
                    <div className={cn(
                      "h-2 w-full bg-muted overflow-hidden",
                      id === 'brutalist' || id === 'neon' ? "rounded-none" : "rounded-full"
                    )}>
                      <div className={cn(
                        "h-full w-[45%]",
                        id === 'neon' ? "bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" :
                        id === 'brutalist' ? "bg-[#0000ff]" : "bg-primary"
                      )} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border pt-6 mt-2">
                <span className={cn(
                  "text-xs",
                  id === 'neon' ? "font-mono text-gray-500" : "text-muted-foreground"
                )}>Last updated: Just now</span>
                <Button variant="outline" size="sm">Refresh</Button>
              </CardFooter>
            </Card>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
