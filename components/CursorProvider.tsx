'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import { useDesignSystem } from '@/lib/design-system-store';
import { cn } from '@/lib/utils';

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const { tokens } = useDesignSystem();
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the cursor "lag" effect
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const dotX = useSpring(mouseX, { damping: 40, stiffness: 800 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 800 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (isHidden) setIsHidden(false);

      const target = e.target as HTMLElement;
      const isSelectable = window.getComputedStyle(target).cursor === 'pointer' || 
                         target.tagName === 'BUTTON' || 
                         target.tagName === 'A' ||
                         target.closest('button') ||
                         target.closest('a');
      
      setIsPointer(!!isSelectable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isHidden]);

  if (!mounted) return <>{children}</>;

  return (
    <>
      <AnimatePresence>
        {!isHidden && (
          <>
            {/* Outer Ring */}
            <motion.div
              className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary pointer-events-none z-[9999] mix-blend-difference"
              style={{
                x: cursorX,
                y: cursorY,
                translateX: '-50%',
                translateY: '-50%',
              }}
              animate={{
                scale: isClicking ? 0.8 : isPointer ? 1.5 : 1,
                borderWidth: isPointer ? '2px' : '1px',
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
            />
            
            {/* Inner Dot */}
            <motion.div
              className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-difference"
              style={{
                x: dotX,
                y: dotY,
                translateX: '-50%',
                translateY: '-50%',
              }}
              animate={{
                scale: isClicking ? 2 : isPointer ? 0.5 : 1,
              }}
            />

            {/* Trail / Particle effect for Neon universe */}
            {tokens.primary === '#00f3ff' && !isPaused && (
              <motion.div 
                className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9998] opacity-20"
                style={{
                  x: cursorX,
                  y: cursorY,
                  translateX: '-50%',
                  translateY: '-50%',
                  background: `radial-gradient(circle, ${tokens.primary} 0%, transparent 70%)`,
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}

const isPaused = false; // Placeholder for future use
