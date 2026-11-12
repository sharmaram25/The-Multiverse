'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { useUniverseTokens, COLOR_ROLES, RADIUS_VARS, UNIVERSE_NAMES } from '@/lib/hooks/use-universe-tokens';
import { CopyButton, DocHeader, DocSection } from '@/components/docs/doc-blocks';

export default function TokensPage() {
  const { theme } = useTheme();
  const tokens = useUniverseTokens();
  const css = tokens
    ? `/* ${UNIVERSE_NAMES[theme].name} universe */\n:root {\n${[...COLOR_ROLES.map((r) => r.variable), ...RADIUS_VARS].map((v) => `  ${v}: ${tokens.raw[v]};`).join('\n')}\n}\n`
    : '';

  return (
    <div>
      <DocHeader title="Tokens" lead="Design tokens are the contract between design and code. These are the live values of the active universe — copy one, or the whole set." />

      <DocSection title="Color tokens" description="Semantic roles. Components reference the role, never the raw value.">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2.5 font-semibold">Token</th><th className="px-4 py-2.5 font-semibold">Utility</th><th className="px-4 py-2.5 font-semibold">Value</th><th className="px-4 py-2.5" /></tr>
            </thead>
            <tbody>
              {COLOR_ROLES.map((r) => (
                <tr key={r.variable} className="border-t border-border">
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-3">
                      <span className="h-6 w-6 shrink-0 rounded-md ring-1 ring-border" style={{ background: tokens?.raw[r.variable] }} />
                      <span>
                        <span className="block font-mono text-xs font-semibold">{r.variable}</span>
                        <span className="block text-xs text-muted-foreground">{r.usage}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.utility}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">{tokens?.raw[r.variable]}</td>
                  <td className="px-4 py-2.5 text-right">{tokens && <CopyButton value={tokens.raw[r.variable]} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection title="Radius tokens">
        <div className="grid grid-cols-6 gap-3">
          {RADIUS_VARS.map((v) => (
            <div key={v} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center">
              <div className="h-14 w-14 border-2 border-foreground bg-muted" style={{ borderRadius: `var(${v})` }} />
              <div>
                <p className="font-mono text-[11px] font-semibold">{v.replace('--', '')}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{tokens?.raw[v]}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Export" description="The complete token set for this universe as CSS custom properties.">
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted/50">
          {tokens && <CopyButton value={css} label="Copy CSS" className="absolute right-2 top-2" />}
          <pre className="max-h-96 overflow-auto p-4 font-mono text-[12px] leading-relaxed">{css}</pre>
        </div>
      </DocSection>
    </div>
  );
}
