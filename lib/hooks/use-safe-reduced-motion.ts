'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * `useReducedMotion` is unknown during server rendering, so branching on it in
 * render causes hydration mismatches. This returns `false` for the first
 * (hydrating) render and the real preference afterwards.
 */
export function useSafeReducedMotion(): boolean {
  const prefers = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return mounted && !!prefers;
}
