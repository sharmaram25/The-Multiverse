'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/** Route-level error boundary: one failing page never takes down the app shell. */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-8 text-center">
      <p className="font-mono text-sm text-muted-foreground">Something went wrong</p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">This page failed to load.</h1>
      <p className="mt-4 text-muted-foreground">Your work in the Builder and Playground is saved in this browser and is not affected.</p>
      <div className="mt-8 flex items-center gap-3">
        <button type="button" onClick={reset} className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Try again</button>
        <Link href="/" className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground hover:bg-muted">Go home</Link>
      </div>
      {error.digest && <p className="mt-6 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>}
    </div>
  );
}
