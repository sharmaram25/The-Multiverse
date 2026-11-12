'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { copyText } from '@/lib/browser';

export function DocHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <header className="mb-12">
      <h1 className="font-display text-5xl font-bold tracking-tight">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>
    </header>
  );
}

export function DocSection({ title, description, children, id }: { title: string; description?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mb-14 scroll-mt-28">
      <div className="mb-5 border-b border-border pb-3">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function CopyButton({ value, label = 'Copy', className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(value)) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        }
      }}
      aria-label={copied ? 'Copied' : `${label} ${value.length < 40 ? value : ''}`.trim()}
      className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground', className)}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}

/** Live example above, copyable source below. */
export function Example({ children, code, className }: { children: React.ReactNode; code: string; className?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className={cn('flex flex-wrap items-center justify-center gap-4 bg-card p-8', className)}>{children}</div>
      <div className="relative border-t border-border bg-muted/50">
        <CopyButton value={code} className="absolute right-2 top-2" />
        <pre className="overflow-x-auto p-4 pr-20 font-mono text-[12px] leading-relaxed text-foreground">{code}</pre>
      </div>
    </div>
  );
}

export function PropsTable({ rows }: { rows: Array<{ name: string; type: string; default?: string; description: string }> }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
          <tr><th className="px-4 py-2.5 font-semibold">Prop</th><th className="px-4 py-2.5 font-semibold">Type</th><th className="px-4 py-2.5 font-semibold">Default</th><th className="px-4 py-2.5 font-semibold">Description</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-border align-top">
              <td className="px-4 py-2.5 font-mono text-xs font-semibold">{r.name}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.type}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.default ?? '—'}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
