'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useState that survives reloads via localStorage.
 * Falls back to in-memory state when storage is unavailable, and validates
 * stored values with an optional guard so corrupted data never crashes a page.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
  isValid?: (value: unknown) => value is T
): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (!isValid || isValid(parsed)) {
          setValue(parsed as T);
        }
      }
    } catch {
      // ignore unreadable storage
    }
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(resolved)); } catch { /* storage full or blocked */ }
      return resolved;
    });
  }, [key]);

  return [value, update];
}
