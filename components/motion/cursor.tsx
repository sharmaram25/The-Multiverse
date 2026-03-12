'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

type CursorState = 'default' | 'interactive' | 'drag';

interface CursorContextType {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const { theme } = useTheme();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default to true to avoid hydration mismatch, then update

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouchDevice(isTouch);

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    if (!isTouch) {
      window.addEventListener('mousemove', updateMousePosition);
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) {
    return <>{children}</>;
  }

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState }}>
      {children}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[150] flex items-center justify-center mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className={cn(
            "rounded-full transition-colors duration-300",
            theme === 'minimal' ? "bg-white" :
            theme === 'glass' ? "bg-blue-300/50 backdrop-blur-sm" :
            theme === 'neon' ? "bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" :
            theme === 'brutalist' ? "bg-[#ff3300] border border-black rounded-none" :
            "bg-white"
          )}
          animate={{
            width: cursorState === 'interactive' ? 48 : cursorState === 'drag' ? 32 : 16,
            height: cursorState === 'interactive' ? 48 : cursorState === 'drag' ? 32 : 16,
            opacity: cursorState === 'interactive' ? 0.5 : 1,
            scale: cursorState === 'drag' ? 1.5 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        />
      </motion.div>
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    return { cursorState: 'default' as CursorState, setCursorState: () => {} };
  }
  return context;
}

export function Interactive({ children, className }: { children: React.ReactNode, className?: string }) {
  const { setCursorState } = useCursor();
  
  return (
    <div 
      className={className}
      onMouseEnter={() => setCursorState('interactive')}
      onMouseLeave={() => setCursorState('default')}
    >
      {children}
    </div>
  );
}
