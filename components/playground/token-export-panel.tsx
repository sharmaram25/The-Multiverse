'use client';

import React, { useMemo, useState } from 'react';
import { Check, Copy, Download, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EXPORT_FORMATS, encodeTokens, type ExportFormat, type PortableTokens } from '@/lib/tokens-export';
import { contrastRatio, readableOn, tonalScale } from '@/lib/color';
import { copyText, downloadFile } from '@/lib/browser';
import { ContrastRow } from '@/components/builder/builder-sidebar';

export function TokenExportPanel({ tokens, onFixContrast }: { tokens: PortableTokens; onFixContrast?: () => string[] }) {
  const [fixLog, setFixLog] = useState<string[] | null>(null);
  const [format, setFormat] = useState<ExportFormat>('css');
  const [flash, setFlash] = useState<string | null>(null);
  const active = EXPORT_FORMATS.find((f) => f.id === format) ?? EXPORT_FORMATS[0];
  const output = useMemo(() => active.build(tokens), [active, tokens]);
  const scale = useMemo(() => tonalScale(tokens.primary), [tokens.primary]);

  const signal = (key: string) => {
    setFlash(key);
    setTimeout(() => setFlash((cur) => (cur === key ? null : cur)), 1600);
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#t=${encodeTokens(tokens)}`;
    if (await copyText(url)) signal('share');
  };

  const pairs: Array<{ label: string; ratio: number | null }> = [
    { label: 'Text on background', ratio: contrastRatio(tokens.foreground, tokens.background) },
    { label: 'Text on muted', ratio: contrastRatio(tokens.foreground, tokens.muted) },
    { label: 'Label on primary', ratio: contrastRatio(readableOn(tokens.primary), tokens.primary) },
    { label: 'Primary on background', ratio: contrastRatio(tokens.primary, tokens.background) },
    { label: 'Accent on background', ratio: contrastRatio(tokens.accent, tokens.background) },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Export tokens</h3>
          <button type="button" onClick={share} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] font-semibold hover:bg-muted">
            {flash === 'share' ? <Check size={12} /> : <Link2 size={12} />} {flash === 'share' ? 'Link copied' : 'Share link'}
          </button>
        </div>
        <div role="tablist" aria-label="Export format" className="flex flex-wrap gap-1">
          {EXPORT_FORMATS.map((f) => (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={format === f.id}
              onClick={() => setFormat(f.id)}
              className={cn('rounded-md px-2 py-1 text-[11px] font-semibold transition-colors', format === f.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/60 px-3 py-1.5">
            <span className="font-mono text-[11px] text-muted-foreground">{active.filename}</span>
            <span className="flex gap-1">
              <button type="button" aria-label="Copy to clipboard" title="Copy" onClick={async () => { if (await copyText(output)) signal('copy'); }} className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground">
                {flash === 'copy' ? <Check size={13} /> : <Copy size={13} />}
              </button>
              <button type="button" aria-label="Download file" title="Download" onClick={() => { if (downloadFile(active.filename, output, active.mime)) signal('dl'); }} className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground">
                {flash === 'dl' ? <Check size={13} /> : <Download size={13} />}
              </button>
            </span>
          </div>
          <pre className="max-h-[340px] overflow-auto bg-background p-3 font-mono text-[11px] leading-relaxed">{output}</pre>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Primary scale</p>
          <div className="grid grid-cols-11 overflow-hidden rounded-md ring-1 ring-border">
            {Object.entries(scale).map(([step, hex]) => (
              <button
                key={step}
                type="button"
                title={`${step}: ${hex} — click to copy`}
                onClick={async () => { if (await copyText(hex)) signal(step); }}
                className="flex h-12 items-end justify-center pb-1 text-[8px] font-mono"
                style={{ background: hex, color: readableOn(hex) }}
              >
                {flash === step ? '✓' : step}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 rounded-lg border border-border p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contrast audit (WCAG 2.2)</p>
          {pairs.map((p) => <ContrastRow key={p.label} label={p.label} ratio={p.ratio} />)}
          {onFixContrast && pairs.some((p) => (p.ratio ?? 21) < (p.label.startsWith('Accent') ? 3 : 4.5)) && (
            <button type="button" onClick={() => setFixLog(onFixContrast())} className="mt-2 w-full rounded-md bg-primary py-1.5 text-xs font-semibold text-primary-foreground">
              Fix contrast automatically
            </button>
          )}
          {fixLog && (
            <p className="pt-1 text-[11px] text-muted-foreground" role="status">
              {fixLog.length ? `Adjusted: ${fixLog.join('; ')}` : 'All pairs already pass.'}
            </p>
          )}
          <p className="pt-1 text-[10px] text-muted-foreground">AA requires 4.5:1 for body text and 3:1 for large text and UI components.</p>
        </div>
      </div>
    </div>
  );
}
