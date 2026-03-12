'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useTransition, TransitionType } from '@/components/transitions/transition-context';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'motion/react';
import { Logo } from '@/components/logo';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const { setTransitionType } = useTransition();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Universes', path: '/universes' },
  ];

  const labsLinks = [
    { name: 'UI Builder', path: '/builder' },
    { name: 'Theme Lab', path: '/theme-lab' },
    { name: 'Performance', path: '/performance' },
    { name: 'Motion Lab', path: '/motion-lab' },
    { name: 'Interactions', path: '/interaction-playground' },
    { name: 'Micro-Interactions', path: '/micro-interactions' },
  ];

  const designLinks = [
    { name: 'Design System', path: '/design-system' },
    { name: 'Playground', path: '/playground' },
    { name: 'Components', path: '/components' },
    { name: 'Sandbox', path: '/sandbox' },
    { name: 'Design Story', path: '/story' },
  ];

  const secondaryLinks = [
    { name: 'Multiverse Map', path: '/multiverse-map' },
    { name: 'Parallel Universes', path: '/parallel-universes' },
    { name: 'Time Travel', path: '/time-travel' },
    { name: 'Experiments', path: '/experimental' },
    { name: 'Portal', path: '/portal' },
    { name: 'About', path: '/about' },
  ];

  const handleNavClick = () => {
    // Only randomize if we are actually navigating (optional but keeps things stable)
    const types: TransitionType[] = ['curtain', 'split', 'gradient', 'portal'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    // Use functional update to avoid unnecessary re-renders if the type is the same
    setTransitionType(randomType);
    setIsMobileMenuOpen(false);
  };

  // Theme-specific styles
  const getNavContainerStyle = () => {
    switch (theme) {
      case 'glass':
        return cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full transition-all duration-300",
          isScrolled ? "bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] py-3" : "bg-white/5 backdrop-blur-md border border-white/10 py-4"
        );
      case 'neon':
        return cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-[#00f3ff]",
          isScrolled ? "bg-black/90 backdrop-blur-md shadow-[0_0_15px_rgba(0,243,255,0.3)] py-3" : "bg-black/50 py-5"
        );
      case 'brutalist':
        return cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-4 border-black",
          isScrolled ? "bg-white py-3 shadow-[0_4px_0_0_rgba(0,0,0,1)]" : "bg-[#e6e6e6] py-5"
        );
      case 'minimal':
      default:
        return cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border py-3" : "bg-transparent py-5"
        );
    }
  };

  const getLinkStyle = (isActive: boolean) => {
    switch (theme) {
      case 'neon':
        return cn(
          "text-sm font-bold uppercase tracking-widest transition-colors",
          isActive ? "text-[#00f3ff] drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" : "text-cyan-100/40 hover:text-[#00f3ff] hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]"
        );
      case 'brutalist':
        return cn(
          "text-base font-black uppercase transition-colors px-3 py-1 border-2",
          isActive ? "bg-black text-white border-black" : "bg-transparent text-black border-transparent hover:border-black"
        );
      case 'glass':
        return cn(
          "text-sm font-medium transition-colors px-4 py-2 rounded-full",
          isActive ? "bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" : "text-white/60 hover:text-white hover:bg-white/10"
        );
      case 'minimal':
      default:
        return cn(
          "text-sm font-medium transition-colors",
          isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
        );
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={getNavContainerStyle()}
    >
      <div className={cn(
        "flex items-center justify-between",
        theme === 'glass' ? "px-6 md:px-8" : "max-w-7xl mx-auto px-6 md:px-12"
      )}>
        <Link href="/" className="relative z-10" onClick={handleNavClick}>
          <Logo showText={true} size={40} className={cn(
            theme === 'brutalist' ? "font-black" : "",
            theme === 'neon' ? "text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" : ""
          )} />
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.name} href={link.path} onClick={handleNavClick} className="relative group flex items-center justify-center">
                <span className={getLinkStyle(isActive)}>
                  {link.name}
                </span>
                {isActive && theme === 'minimal' && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Labs Dropdown */}
          <NavDropdown 
            label="Labs" 
            links={labsLinks} 
            pathname={pathname} 
            theme={theme} 
            handleNavClick={handleNavClick} 
            getLinkStyle={getLinkStyle}
          />

          {/* Design Dropdown */}
          <NavDropdown 
            label="Design" 
            links={designLinks} 
            pathname={pathname} 
            theme={theme} 
            handleNavClick={handleNavClick} 
            getLinkStyle={getLinkStyle}
          />

          {/* More Dropdown */}
          <NavDropdown 
            label="More" 
            links={secondaryLinks} 
            pathname={pathname} 
            theme={theme} 
            handleNavClick={handleNavClick} 
            getLinkStyle={getLinkStyle}
            isLast={true}
          />
        </nav>
        <button 
          className={cn(
            "md:hidden relative z-10 p-2",
            theme === 'neon' ? "text-[#00f3ff]" : "text-foreground"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "absolute top-full left-0 right-0 shadow-lg py-4 px-6 flex flex-col space-y-4 md:hidden",
              theme === 'glass' ? "bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl mt-2 mx-4" : 
              theme === 'neon' ? "bg-black border-b-2 border-[#00f3ff]" :
              theme === 'brutalist' ? "bg-white border-b-4 border-black" :
              "bg-background border-b border-border"
            )}
          >
            {[...navLinks, ...labsLinks, ...designLinks, ...secondaryLinks].map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                onClick={handleNavClick}
                className={cn(
                  "text-lg",
                  getLinkStyle(pathname === link.path)
                )}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

function NavDropdown({ 
  label, 
  links, 
  pathname, 
  theme, 
  handleNavClick, 
  getLinkStyle,
  isLast = false 
}: { 
  label: string; 
  links: { name: string; path: string }[]; 
  pathname: string; 
  theme: string; 
  handleNavClick: () => void; 
  getLinkStyle: (isActive: boolean) => string;
  isLast?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button 
        className={cn(
          "flex items-center gap-1 cursor-default",
          getLinkStyle(links.some(l => pathname === l.path))
        )}
      >
        {label} <ChevronDown size={14} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full mt-2 w-52 rounded-xl shadow-xl py-2 z-50 overflow-hidden",
              isLast ? "right-0" : "left-1/2 -translate-x-1/2",
              theme === 'glass' ? "bg-slate-900/90 backdrop-blur-xl border border-white/20" :
              theme === 'neon' ? "bg-black border-2 border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.2)]" :
              theme === 'brutalist' ? "bg-white border-4 border-black" :
              "bg-background border border-border"
            )}
          >
            <div className="grid grid-cols-1 divide-y divide-border/10">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => {
                    handleNavClick();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "block px-5 py-2.5 text-sm transition-all",
                    pathname === link.path 
                      ? (theme === 'neon' ? "text-[#00f3ff] bg-[#00f3ff]/10" : "text-primary bg-primary/10 font-bold")
                      : (theme === 'neon' ? "text-cyan-100/60 hover:text-[#00f3ff] hover:bg-[#00f3ff]/10" : 
                         theme === 'glass' ? "text-white/60 hover:text-white hover:bg-white/10" :
                         "text-muted-foreground hover:text-foreground hover:bg-muted")
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
