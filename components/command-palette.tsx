'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CornerDownLeft, Paintbrush, Search, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ALL_LINKS, UNIVERSE_LINKS, SITE_GROUPS, type SiteLink } from '@/lib/site-map';
import { useTheme, THEMES, type Theme } from '@/components/theme-provider';

interface Item {
  id: string;
  label: string;
  hint: string;
  group: string;
  icon: LucideIcon;
  keywords: string;
  run: () => void;
}

const UNIVERSE_LABEL: Record<Theme, string> = { minimal: 'Minimal', glass: 'Glass', neon: 'Neon', brutalist: 'Brutalist' };

/** Scores how well `query` matches `text` (0 = no match). Rewards prefix and word-start matches. */
function score(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  if (t.startsWith(q)) return 100;
  const idx = t.indexOf(q);
  if (idx > 0 && /[\s/-]/.test(t[idx - 1])) return 80;
  if (idx >= 0) return 60;
  // Subsequence match: all characters in order.
  let pos = 0;
  for (const ch of q) {
    pos = t.indexOf(ch, pos);
    if (pos === -1) return 0;
    pos++;
  }
  return 20;
}

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const items = useMemo<Item[]>(() => {
    const groupOf = (link: SiteLink) => SITE_GROUPS.find((g) => g.links.includes(link))?.label ?? 'Pages';
    const nav = (link: SiteLink, group: string): Item => ({
      id: link.path,
      label: link.name,
      hint: link.description,
      group,
      icon: link.icon,
      keywords: `${link.name} ${link.description} ${link.keywords ?? ''} ${link.path}`,
      run: () => router.push(link.path),
    });
    return [
      ...ALL_LINKS.map((l) => nav(l, groupOf(l))),
      ...UNIVERSE_LINKS.map((l) => nav(l, 'Universes')),
      ...THEMES.filter((t) => t !== theme).map<Item>((t) => ({
        id: `theme:${t}`,
        label: `Switch to ${UNIVERSE_LABEL[t]}`,
        hint: 'Change the active universe',
        group: 'Actions',
        icon: Paintbrush,
        keywords: `theme universe switch ${t}`,
        run: () => setTheme(t),
      })),
    ];
  }, [router, setTheme, theme]);

  const results = useMemo(() => {
    if (!query.trim()) return items;
    return items
      .map((item) => ({ item, s: Math.max(score(item.label, query) * 1.2, score(item.keywords, query)) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.item);
  }, [items, query]);

  // Open/close housekeeping: reset state, manage focus, lock scroll.
  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery('');
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      restoreFocus.current?.focus?.();
    };
  }, [open]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const runItem = (item: Item | undefined) => {
    if (!item) return;
    close();
    item.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(results.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); runItem(results[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  };

  // Group results while keeping the ranked order for keyboard navigation.
  const grouped: Array<{ group: string; entries: Array<{ item: Item; index: number }> }> = [];
  results.forEach((item, index) => {
    let g = grouped.find((x) => x.group === item.group);
    if (!g) { g = { group: item.group, entries: [] }; grouped.push(g); }
    g.entries.push({ item, index });
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="cmdk-shell relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-2xl"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search size={17} className="shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, pages and actions…"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmdk-list"
                aria-activedescendant={results[active] ? `cmdk-${active}` : undefined}
                className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
              />
              <kbd className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">ESC</kbd>
            </div>

            <div ref={listRef} id="cmdk-list" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-10 text-center text-sm text-muted-foreground">No results for “{query}”.</p>
              )}
              {grouped.map(({ group, entries }) => (
                <div key={group} className="mb-1">
                  <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{group}</p>
                  {entries.map(({ item, index }) => {
                    const Icon = item.icon;
                    const selected = index === active;
                    return (
                      <div
                        key={item.id}
                        id={`cmdk-${index}`}
                        data-index={index}
                        role="option"
                        aria-selected={selected}
                        onMouseMove={() => setActive(index)}
                        onClick={() => runItem(item)}
                        className={cn(
                          'relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                          selected ? 'bg-muted' : 'hover:bg-muted/60'
                        )}
                      >
                        <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border', selected ? 'bg-primary text-primary-foreground border-transparent' : 'bg-card text-foreground')}>
                          <Icon size={15} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{item.label}</span>
                          <span className="block truncate text-xs text-muted-foreground">{item.hint}</span>
                        </span>
                        {selected && <ArrowRight size={14} className="shrink-0 text-muted-foreground" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border bg-muted/50 px-4 py-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><CornerDownLeft size={11} /> open</span>
              </span>
              <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
