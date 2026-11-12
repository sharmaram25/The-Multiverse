'use client';

import React, { useEffect, useState } from 'react';
import { Check, Link2, Mail, Monitor } from 'lucide-react';
import { copyText } from '@/lib/browser';
import { Logo } from '@/components/logo';

/**
 * Shown instead of the app on screens narrower than 1024px (controlled purely by CSS,
 * see `.mobile-gate` in globals.css) — no layout flash and no hydration branching.
 */
export function DesktopOnlyGate() {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setUrl(window.location.href), []);

  const mailto = `mailto:?subject=${encodeURIComponent('Open The Multiverse on desktop')}&body=${encodeURIComponent(`Continue on a desktop browser:\n${url}`)}`;

  return (
    <div className="mobile-gate min-h-[100svh] flex-col bg-background px-6 pb-10 pt-8 text-foreground">
      <div className="flex items-center gap-2">
        <Logo size={26} />
        <span className="font-display text-[15px] font-bold tracking-tight">The Multiverse</span>
      </div>

      <div className="flex flex-1 flex-col justify-center py-12">
        {/* A desktop workspace, drawn in tokens */}
        <div className="mx-auto mb-12 w-full max-w-[300px]" aria-hidden="true">
          <div className="rounded-xl border border-border bg-card p-2 shadow-xl">
            <div className="mb-2 flex gap-1 px-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            </div>
            <div className="grid h-36 grid-cols-[1fr_2.4fr_1fr] gap-1.5">
              <div className="space-y-1.5 rounded-md bg-muted p-1.5">
                {[0, 1, 2, 3].map((i) => <div key={i} className="h-2.5 rounded-sm bg-foreground/10" />)}
              </div>
              <div className="space-y-1.5 rounded-md border border-border p-2">
                <div className="h-3 w-3/4 rounded-sm bg-foreground/80" />
                <div className="h-1.5 w-full rounded-sm bg-foreground/15" />
                <div className="h-1.5 w-5/6 rounded-sm bg-foreground/15" />
                <div className="mt-2 h-4 w-12 rounded-sm bg-primary" />
                <div className="mt-2 grid grid-cols-3 gap-1">
                  {[0, 1, 2].map((i) => <div key={i} className="h-6 rounded-sm bg-muted" />)}
                </div>
              </div>
              <div className="space-y-1.5 rounded-md bg-muted p-1.5">
                {[0, 1, 2].map((i) => <div key={i} className="h-4 rounded-sm border border-border bg-background" />)}
              </div>
            </div>
          </div>
          <div className="mx-auto h-3 w-16 border-x border-border" />
          <div className="mx-auto h-1 w-28 rounded-full bg-border" />
        </div>

        <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Monitor size={14} /> Desktop workspace
        </p>
        <h1 className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight">Designed for the big screen.</h1>
        <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">
          The Multiverse is a professional workspace — multi-panel editors, live previews and code export. Please continue on a desktop or laptop with a screen at least 1024 pixels wide.
        </p>

        <div className="mt-9 grid gap-3">
          <button
            type="button"
            onClick={async () => { if (url && (await copyText(url))) { setCopied(true); setTimeout(() => setCopied(false), 1800); } }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground"
          >
            {copied ? <Check size={17} /> : <Link2 size={17} />} {copied ? 'Link copied' : 'Copy link for later'}
          </button>
          <a href={mailto} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border text-[15px] font-semibold text-foreground">
            <Mail size={17} /> Email me this link
          </a>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">Already on a desktop? Widen your browser window to continue.</p>
    </div>
  );
}
