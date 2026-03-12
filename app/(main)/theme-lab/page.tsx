'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutTemplate, Layers, Zap, Square, Palette } from 'lucide-react';

export default function ThemeLabPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display">Theme Lab</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Experience the power of dynamic theming. Switch between different universes and watch the interface transform instantly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Theme Switcher Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Palette className="text-primary w-5 h-5" />
                <CardTitle>Active Universe</CardTitle>
              </div>
              <CardDescription>Select a theme to apply globally.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={() => setTheme('minimal')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  theme === 'minimal' 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className={`p-2 rounded-full ${theme === 'minimal' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <LayoutTemplate size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium">Minimal Universe</p>
                  <p className="text-xs text-muted-foreground">Clean, calm, highly structured.</p>
                </div>
              </button>

              <button
                onClick={() => setTheme('glass')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  theme === 'glass' 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className={`p-2 rounded-full ${theme === 'glass' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Layers size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium">Glass Universe</p>
                  <p className="text-xs text-muted-foreground">Translucent, deep, and atmospheric.</p>
                </div>
              </button>

              <button
                onClick={() => setTheme('neon')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  theme === 'neon' 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className={`p-2 rounded-full ${theme === 'neon' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Zap size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium">Neon Universe</p>
                  <p className="text-xs text-muted-foreground">Cyberpunk interface with glowing accents.</p>
                </div>
              </button>

              <button
                onClick={() => setTheme('brutalist')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  theme === 'brutalist' 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className={`p-2 rounded-full ${theme === 'brutalist' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Square size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium">Brutalist Universe</p>
                  <p className="text-xs text-muted-foreground">Raw, bold, unconventional design.</p>
                </div>
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="p-8 rounded-3xl border border-border bg-background/50 backdrop-blur-sm relative overflow-hidden transition-colors duration-500">
            {/* Decorative background elements based on theme */}
            {theme === 'glass' && (
              <>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              </>
            )}
            {theme === 'neon' && (
              <>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f3ff]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff00ff]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              </>
            )}

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                  <h2 className="text-2xl font-bold">Dashboard Preview</h2>
                  <p className="text-muted-foreground">See how components react to the current theme.</p>
                </div>
                <Button>Create New</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input defaultValue="Ram Sharma" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input 
                        defaultValue="sharmaram25@gmail.com" 
                        className="bg-background"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" className="w-full">Save Changes</Button>
                  </CardFooter>
                </Card>

                <div className="space-y-6">
                  <Card className="bg-primary text-primary-foreground border-none">
                    <CardHeader>
                      <CardTitle className="text-primary-foreground">Pro Plan</CardTitle>
                      <CardDescription className="text-primary-foreground/80">You are currently on the Pro plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">$29<span className="text-sm font-normal text-primary-foreground/80">/mo</span></div>
                      <ul className="space-y-2 text-sm text-primary-foreground/90">
                        <li className="flex items-center gap-2">✓ Unlimited projects</li>
                        <li className="flex items-center gap-2">✓ Priority support</li>
                        <li className="flex items-center gap-2">✓ Custom domains</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="p-6 rounded-xl border border-border bg-card flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications</h4>
                      <p className="text-sm text-muted-foreground">Email alerts</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
