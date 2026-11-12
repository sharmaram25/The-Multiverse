'use client';


import { useSafeReducedMotion } from '@/lib/hooks/use-safe-reduced-motion';import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion} from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight, Check, ChevronUp, Lock } from 'lucide-react';
import { useTheme, type Theme } from '@/components/theme-provider';
import { useTransition } from '@/components/transitions/transition-context';
import { useDesignSystem } from '@/lib/design-system-store';
import { cn } from '@/lib/utils';

/** Static palette previews — they must look the same regardless of the active universe. */
const UNIVERSES: Array<{
  id: Theme;
  name: string;
  description: string;
  preview: { bg: string; fg: string; muted: string; primary: string; primaryFg: string; border: string; radius: number; font: string };
}> = [
  { id: 'minimal', name: 'Minimal', description: 'Calm, structured, typographic.', preview: { bg: '#ffffff', fg: '#0a0a0a', muted: '#52525b', primary: '#111111', primaryFg: '#ffffff', border: '#e4e4e7', radius: 6, font: 'var(--font-geist), system-ui, sans-serif' } },
  { id: 'glass', name: 'Glass', description: 'Translucent depth and soft light.', preview: { bg: '#0b1022', fg: '#f1f5f9', muted: '#a8b3c7', primary: '#c7d2fe', primaryFg: '#0b1022', border: 'rgba(255,255,255,0.14)', radius: 12, font: 'var(--font-inter), system-ui, sans-serif' } },
  { id: 'neon', name: 'Neon', description: 'High-contrast, luminous, technical.', preview: { bg: '#05070b', fg: '#e8fbff', muted: '#8fc9d4', primary: '#00e5ff', primaryFg: '#00151a', border: '#164a56', radius: 2, font: 'var(--font-space), system-ui, sans-serif' } },
  { id: 'brutalist', name: 'Brutalist', description: 'Raw structure, bold type.', preview: { bg: '#f1efe8', fg: '#0a0a0a', muted: '#383838', primary: '#b02200', primaryFg: '#ffffff', border: '#0a0a0a', radius: 0, font: 'var(--font-space), system-ui, sans-serif' } },
];

export function UniverseSwitcher() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { setTransitionType } = useTransition();
  const unlocked = useDesignSystem((s) => s.tokens.unlockedSecretUniverse);
  const router = useRouter();
  const reduceMotion = useSafeReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const current = UNIVERSES.find((u) => u.id === theme) ?? UNIVERSES[0];
  const pathname = usePathname();

  useEffect(() => {
    UNIVERSES.forEach((u) => router.prefetch(`/universes/${u.id}`));
  }, [router]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onDown = (e: MouseEvent) => { if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [open]);

  const visitShowcase = (id: Theme) => {
    setTransitionType('portal');
    setTheme(id);
    setOpen(false);
    router.push(`/universes/${id}`);
  };

  // Cinematic pages with their own fixed palette do not use universes.
  if (pathname === '/time-travel') return null;

  return (
    <div ref={rootRef} className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            id="universe-panel"
            role="dialog"
            aria-label="Choose a universe"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="switcher-panel absolute bottom-full right-0 mb-3 w-[360px] origin-bottom-right overflow-hidden rounded-2xl border text-foreground"
          >
            <div className="flex items-baseline justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Universe</p>
              <p className="text-xs text-muted-foreground">Applies to every page</p>
            </div>
            <ul className="space-y-1 p-2" role="radiogroup" aria-label="Universe">
              {UNIVERSES.map((u) => {
                const active = u.id === theme;
                const p = u.preview;
                return (
                  <li key={u.id} className="group relative">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setTheme(u.id)}
                      className={cn('switcher-option flex w-full items-center gap-3 rounded-xl p-2 pr-10 text-left transition-colors', active && 'is-active')}
                    >
                      {/* Live miniature of the universe */}
                      <span
                        className="flex h-14 w-20 shrink-0 flex-col justify-between overflow-hidden p-2"
                        style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: Math.min(p.radius + 4, 12), fontFamily: p.font }}
                        aria-hidden="true"
                      >
                        <span className="text-[13px] font-bold leading-none" style={{ color: p.fg }}>Aa</span>
                        <span className="h-1 w-10 rounded-full" style={{ background: p.muted, opacity: 0.55 }} />
                        <span className="inline-flex h-3.5 w-9 items-center justify-center text-[6px] font-bold" style={{ background: p.primary, color: p.primaryFg, borderRadius: p.radius }}>
                          CTA
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-sm font-semibold">
                          {u.name}
                          {active && <Check size={14} className="text-foreground" />}
                        </span>
                        <span className="block text-xs text-muted-foreground">{u.description}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => visitShowcase(u.id)}
                      aria-label={`Open ${u.name} showcase`}
                      title={`Open ${u.name} showcase`}
                      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <ArrowUpRight size={15} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border px-4 py-2.5">
              {unlocked ? (
                <button
                  type="button"
                  onClick={() => { setTransitionType('portal'); setOpen(false); router.push('/universe/secret'); }}
                  className="flex w-full items-center justify-between text-xs font-semibold text-foreground hover:underline"
                >
                  Enter the hidden universe <ArrowUpRight size={13} />
                </button>
              ) : (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock size={12} /> A fifth universe unlocks after exploring five sections.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="universe-panel"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 24 }}
        className="switcher-trigger flex h-11 items-center gap-2.5 rounded-full border pl-1.5 pr-3.5 text-sm font-semibold text-foreground"
      >
        <span
          className="h-8 w-8 rounded-full"
          style={{ background: `linear-gradient(135deg, ${current.preview.bg} 0 50%, ${current.preview.primary} 50% 100%)`, boxShadow: `inset 0 0 0 1px ${current.preview.border}` }}
          aria-hidden="true"
        />
        <span className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Universe</span>
          <span className="mt-0.5">{current.name}</span>
        </span>
        <ChevronUp size={15} className={cn('text-muted-foreground transition-transform duration-200', !open && 'rotate-180')} />
      </motion.button>
    </div>
  );
}
