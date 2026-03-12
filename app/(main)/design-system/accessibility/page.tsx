'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Keyboard, ScanEye, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AccessibilityPage() {
  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-display">Accessibility</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Inclusivity is not a feature; it is a foundation. We ensure that the multiverse is accessible to everyone, regardless of how they navigate the web.
        </p>
      </section>

      {/* Color Contrast */}
      <section className="space-y-8">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold">Color Contrast</h2>
          <p className="text-muted-foreground mt-1">Ensuring readability through high-contrast pairs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">
             <div className="flex items-center gap-2 mb-4">
               <CheckCircle2 size={20} />
               <span className="font-bold uppercase tracking-widest text-xs">Accessible (Pass)</span>
             </div>
             <div className="bg-white dark:bg-black p-6 rounded-2xl border flex flex-col gap-4">
               <div className="p-4 bg-primary text-primary-foreground rounded-lg font-bold text-center">
                 WCAG AAA Compliance
               </div>
               <p className="text-sm dark:text-white text-black">High contrast text on solid background is easy to read for everyone.</p>
             </div>
          </div>
          <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400">
             <div className="flex items-center gap-2 mb-4">
               <XCircle size={20} />
               <span className="font-bold uppercase tracking-widest text-xs">Inaccessible (Fail)</span>
             </div>
             <div className="bg-white dark:bg-black p-6 rounded-2xl border flex flex-col gap-4">
               <div className="p-4 bg-primary/20 text-primary/40 rounded-lg font-bold text-center">
                 Poor Contrast
               </div>
               <p className="text-sm opacity-30 dark:text-white text-black">Low contrast text is difficult for users with visual impairments to distinguish.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Keyboard Navigation */}
      <section className="space-y-8">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold">Focus Indicators</h2>
          <p className="text-muted-foreground mt-1">Never lose track of where you are.</p>
        </div>
        
        <div className="p-12 rounded-[2.5rem] bg-muted/30 border border-border flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Keyboard size={24} />
            </div>
            <h3 className="text-2xl font-bold">Keyboard First</h3>
            <p className="text-muted-foreground">Every interactive element in The Multiverse is focusable and triggerable via keyboard. We never use `outline: none` without a clear focus ring replacement.</p>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-4">
            <button className="px-6 py-3 rounded-xl border border-primary ring-4 ring-primary/20 font-bold bg-card">Focused</button>
            <button className="px-6 py-3 rounded-xl border bg-card/50 text-muted-foreground font-bold opacity-50">Inactive</button>
          </div>
        </div>
      </section>

      {/* Semantic HTML */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: ScanEye, title: "Visual Aids", desc: "Aria labels and screen reader roles are standard across the system." },
          { icon: MousePointer2, title: "Motion Safety", desc: "We respect `prefers-reduced-motion` settings." },
          { icon: CheckCircle2, title: "Form Validation", desc: "Clear error states with both color and icon indicators." },
        ].map((item, i) => (
          <div key={item.title} className="p-6 rounded-2xl border bg-card">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <item.icon size={20} />
            </div>
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
