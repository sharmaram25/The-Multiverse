'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { Interactive } from '@/components/motion/cursor';
import { Heart, Bell, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MicroInteractionsPage() {
  const [isToggled, setIsToggled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'warning' | 'error' }[]>([]);

  const addToast = (type: 'success' | 'warning' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section */}
      <section className="h-[60vh] flex flex-col items-center justify-center relative overflow-hidden px-6">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 font-display"
          >
            Micro-Interactions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground"
          >
            Attention to small UI details.
          </motion.p>
        </div>
      </section>

      {/* Toggles & Buttons */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal type="fade" className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Toggles & Buttons</h2>
          <p className="text-xl text-muted-foreground">Smooth physics animations for common controls.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-card border border-border">
            <h3 className="text-2xl font-bold mb-12">Liquid Toggle</h3>
            <Interactive>
              <motion.div
                className={cn(
                  "w-24 h-12 rounded-full p-1 cursor-pointer flex items-center shadow-inner transition-colors duration-300",
                  isToggled ? "bg-primary" : "bg-muted"
                )}
                onClick={() => setIsToggled(!isToggled)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-10 h-10 bg-white rounded-full shadow-md"
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{ marginLeft: isToggled ? 'auto' : '0' }}
                />
              </motion.div>
            </Interactive>
          </div>

          <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-card border border-border">
            <h3 className="text-2xl font-bold mb-12">Like Animation</h3>
            <Interactive>
              <motion.button
                className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl"
                onClick={() => setIsLiked(!isLiked)}
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Heart 
                  size={40} 
                  className={cn("transition-colors duration-300", isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground")} 
                />
                <AnimatePresence>
                  {isLiked && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-red-500"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            </Interactive>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-muted/30 rounded-3xl overflow-hidden relative">
        <ScrollReveal type="fade" className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Notification Toasts</h2>
          <p className="text-xl text-muted-foreground">Animated notifications appearing from screen edge.</p>
        </ScrollReveal>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <button onClick={() => addToast('success')} className="px-6 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition-colors">Success Toast</button>
          <button onClick={() => addToast('warning')} className="px-6 py-3 rounded-full bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-colors">Warning Toast</button>
          <button onClick={() => addToast('error')} className="px-6 py-3 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">Error Toast</button>
        </div>

        {/* Toast Container */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-50">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                layout
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-white font-medium min-w-[300px]",
                  toast.type === 'success' ? "bg-green-500" :
                  toast.type === 'warning' ? "bg-yellow-500" :
                  "bg-red-500"
                )}
              >
                {toast.type === 'success' && <CheckCircle size={20} />}
                {toast.type === 'warning' && <AlertCircle size={20} />}
                {toast.type === 'error' && <XCircle size={20} />}
                <span>This is a {toast.type} message!</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Loaders */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <ScrollReveal type="fade" className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Loading Indicators</h2>
          <p className="text-xl text-muted-foreground">Multiple animated loaders.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-64 rounded-3xl bg-card border border-border flex flex-col items-center justify-center p-8">
            <h3 className="text-lg font-bold mb-8">Spinner</h3>
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>

          <div className="h-64 rounded-3xl bg-card border border-border flex flex-col items-center justify-center p-8">
            <h3 className="text-lg font-bold mb-8">Dot Loader</h3>
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-primary rounded-full"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>

          <div className="h-64 rounded-3xl bg-card border border-border flex flex-col items-center justify-center p-8">
            <h3 className="text-lg font-bold mb-8">Morphing Loader</h3>
            <motion.div
              className="w-12 h-12 bg-primary"
              animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
