'use client';


import { useSafeReducedMotion } from '@/lib/hooks/use-safe-reduced-motion';import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { ArrowRight, ArrowUpRight, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, THEMES, type Theme } from '@/components/theme-provider';
import { useTransition } from '@/components/transitions/transition-context';
import { Logo } from '@/components/logo';
import { CommandPalette } from '@/components/command-palette';
import { ALL_LINKS, HOME_LINK, SITE_GROUPS, isActivePath, type SiteGroup } from '@/lib/site-map';

type GroupId = SiteGroup['id'];

/** Signature swatches for each universe (static, so they read correctly in any universe). */
const UNIVERSE_SWATCH: Record<Theme, { label: string; fill: string; ring: string }> = {
  minimal: { label: 'Minimal', fill: 'linear-gradient(135deg,#ffffff 50%,#111111 50%)', ring: '#a1a1aa' },
  glass: { label: 'Glass', fill: 'linear-gradient(135deg,#c7d2fe,#7c3aed 60%,#070b17)', ring: '#818cf8' },
  neon: { label: 'Neon', fill: 'linear-gradient(135deg,#00e5ff,#05070b 55%,#ff3dd8)', ring: '#00e5ff' },
  brutalist: { label: 'Brutalist', fill: 'linear-gradient(135deg,#b02200 50%,#f1efe8 50%)', ring: '#0a0a0a' },
};

const CLOSE_DELAY = 140;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { setTransitionType } = useTransition();
  const reduceMotion = useSafeReducedMotion();

  const [compact, setCompact] = useState(false);
  const [openGroup, setOpenGroup] = useState<GroupId | null>(null);
  const [direction, setDirection] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Scroll: compact the bar and drive the progress hairline.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.3 });
  useMotionValueEvent(scrollY, 'change', (y) => setCompact(y > 24));

  // Prefetch every destination so navigation is instant.
  useEffect(() => {
    ALL_LINKS.forEach((l) => router.prefetch(l.path));
  }, [router]);

  // Close menus on route change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenGroup(null);
  }, [pathname]);

  // Global shortcut: ⌘K / Ctrl+K opens the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Escape / outside click closes the mega menu.
  useEffect(() => {
    if (!openGroup) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenGroup(null); };
    const onDown = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [openGroup]);

  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpenGroup(null), CLOSE_DELAY); };
  useEffect(() => cancelClose, []);

  const openMenu = useCallback((id: GroupId) => {
    cancelClose();
    setOpenGroup((current) => {
      if (current && current !== id) {
        const order = SITE_GROUPS.map((g) => g.id);
        setDirection(order.indexOf(id) > order.indexOf(current) ? 1 : -1);
      } else {
        setDirection(0);
      }
      return id;
    });
  }, []);

  const onNavigate = useCallback(() => {
    setTransitionType('none');
    setOpenGroup(null);
  }, [setTransitionType]);

  const activeGroup = SITE_GROUPS.find((g) => g.id === openGroup);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3">
        <nav
          ref={navRef}
          aria-label="Primary"
          data-compact={compact || undefined}
          onMouseLeave={() => { setHovered(null); scheduleClose(); }}
          onMouseEnter={cancelClose}
          className={cn(
            'nav-shell relative w-full max-w-6xl rounded-2xl border text-foreground transition-[padding,box-shadow,background-color] duration-300',
            compact ? 'py-1.5' : 'py-2.5'
          )}
        >
          <div className="flex items-center gap-2 px-3">
            {/* Brand */}
            <Link href="/" onClick={onNavigate} className="nav-brand mr-2 flex items-center gap-2 rounded-lg px-1.5 py-1" aria-label="The Multiverse — home">
              <Logo size={compact ? 28 : 32} />
              <span className="font-display text-[15px] font-bold tracking-tight">The Multiverse</span>
            </Link>

            {/* Links with sliding highlight */}
            <ul className="flex items-center" onMouseLeave={() => setHovered(null)}>
              <NavItem id="home" hovered={hovered} setHovered={setHovered}>
                <Link
                  href={HOME_LINK.path}
                  onClick={onNavigate}
                  onMouseEnter={() => scheduleClose()}
                  aria-current={pathname === '/' ? 'page' : undefined}
                  className="nav-link relative z-10 flex items-center rounded-lg px-3 py-2 text-sm font-medium"
                >
                  Home
                  {pathname === '/' && <ActiveDot />}
                </Link>
              </NavItem>
              {SITE_GROUPS.map((group) => {
                const groupActive = group.links.some((l) => isActivePath(pathname, l.path));
                const isOpen = openGroup === group.id;
                return (
                  <NavItem key={group.id} id={group.id} hovered={hovered} setHovered={setHovered} forceHighlight={isOpen}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls="nav-mega"
                      onMouseEnter={() => openMenu(group.id)}
                      onFocus={() => setHovered(group.id)}
                      onClick={() => (isOpen ? setOpenGroup(null) : openMenu(group.id))}
                      onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(group.id); requestAnimationFrame(() => document.querySelector<HTMLElement>('#nav-mega a')?.focus()); } }}
                      className="nav-link relative z-10 flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      {group.label}
                      <ChevronDown size={14} className={cn('opacity-60 transition-transform duration-200', isOpen && 'rotate-180')} />
                      {groupActive && <ActiveDot />}
                    </button>
                  </NavItem>
                );
              })}
            </ul>

            <div className="ml-auto flex items-center gap-2">
              {/* Command palette trigger */}
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="nav-search group flex h-9 items-center gap-2 rounded-lg border px-3 text-sm text-muted-foreground transition-colors"
                aria-label="Search (Ctrl+K)"
              >
                <Search size={15} />
                <span className="hidden lg:inline">Search</span>
                <kbd className="hidden rounded border border-border bg-background px-1.5 py-px font-mono text-[10px] lg:inline">Ctrl K</kbd>
              </button>

              {/* Universe switcher */}
              <div role="radiogroup" aria-label="Universe" className="nav-universes flex items-center gap-1 rounded-lg border px-1.5 py-1">
                {THEMES.map((t) => {
                  const sw = UNIVERSE_SWATCH[t];
                  const active = theme === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      aria-label={`${sw.label} universe`}
                      title={`${sw.label} universe`}
                      onClick={() => setTheme(t)}
                      className="group relative flex h-7 w-7 items-center justify-center rounded-md"
                    >
                      {active && (
                        <motion.span
                          layoutId={reduceMotion ? undefined : 'nav-universe'}
                          className="absolute inset-0 rounded-md bg-muted"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span
                        className="relative h-4 w-4 rounded-full transition-transform duration-200 group-hover:scale-110"
                        style={{ background: sw.fill, boxShadow: `0 0 0 1.5px ${active ? sw.ring : 'rgba(127,127,127,0.45)'}` }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Primary action */}
              <Link
                href="/builder"
                onClick={onNavigate}
                className="nav-cta group inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
              >
                Open Builder
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Mega menu */}
          <AnimatePresence>
            {activeGroup && (
              <motion.div
                id="nav-mega"
                key="mega"
                initial={{ opacity: 0, y: -6, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                onMouseEnter={cancelClose}
                className="nav-mega absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border text-foreground"
              >
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                  <motion.div
                    key={activeGroup.id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -28 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-[220px_1fr] gap-2 p-2"
                  >
                    <div className="flex flex-col justify-between rounded-xl bg-muted p-5">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{activeGroup.label}</p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground">{activeGroup.summary}</p>
                      </div>
                      <Link
                        href={activeGroup.links[0].path}
                        onClick={onNavigate}
                        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                      >
                        Start with {activeGroup.links[0].name} <ArrowUpRight size={14} />
                      </Link>
                    </div>
                    <ul className="grid grid-cols-2 gap-1 p-1">
                      {activeGroup.links.map((link, i) => {
                        const Icon = link.icon;
                        const current = isActivePath(pathname, link.path);
                        return (
                          <motion.li
                            key={link.path}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: reduceMotion ? 0 : 0.02 * i, duration: 0.18 }}
                          >
                            <Link
                              href={link.path}
                              onClick={onNavigate}
                              aria-current={current ? 'page' : undefined}
                              className={cn(
                                'nav-mega-link group flex items-start gap-3 rounded-xl p-3 outline-none transition-colors',
                                current && 'is-current'
                              )}
                            >
                              <span className="nav-mega-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors">
                                <Icon size={16} />
                              </span>
                              <span className="min-w-0">
                                <span className="flex items-center gap-1.5 text-sm font-semibold">
                                  {link.name}
                                  {current && <span className="rounded bg-primary px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-primary-foreground">Here</span>}
                                </span>
                                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{link.description}</span>
                              </span>
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll progress */}
          <div className="pointer-events-none absolute inset-x-4 bottom-0 h-px overflow-hidden" aria-hidden="true">
            <motion.div className="nav-progress h-full origin-left" style={{ scaleX: progress }} />
          </div>
        </nav>
      </header>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}

function NavItem({ id, hovered, setHovered, forceHighlight, children }: {
  id: string;
  hovered: string | null;
  setHovered: (id: string | null) => void;
  forceHighlight?: boolean;
  children: React.ReactNode;
}) {
  const reduceMotion = useSafeReducedMotion();
  const show = hovered === id || (hovered === null && forceHighlight);
  return (
    <li className="relative" onMouseEnter={() => setHovered(id)}>
      {show && (
        <motion.span
          layoutId={reduceMotion ? undefined : 'nav-hover'}
          className="nav-hover absolute inset-0 rounded-lg"
          transition={{ type: 'spring', stiffness: 520, damping: 38 }}
          aria-hidden="true"
        />
      )}
      {children}
    </li>
  );
}

function ActiveDot() {
  return (
    <motion.span
      layoutId="nav-active"
      className="nav-active-dot absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      aria-hidden="true"
    />
  );
}
