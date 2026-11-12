'use client';

import React from 'react';
import { useUniverseTokens } from '@/lib/hooks/use-universe-tokens';
import { DocHeader, DocSection } from '@/components/docs/doc-blocks';

const SCALE = [
  { name: 'Display', cls: 'font-display text-7xl font-bold tracking-tight', spec: '72px · bold · display', sample: 'Plan with certainty' },
  { name: 'Heading 1', cls: 'font-display text-5xl font-bold tracking-tight', spec: '48px · bold · display', sample: 'Websites, planned properly' },
  { name: 'Heading 2', cls: 'font-display text-3xl font-semibold tracking-tight', spec: '30px · semibold · display', sample: 'Decide early, build once' },
  { name: 'Heading 3', cls: 'text-xl font-semibold', spec: '20px · semibold · body', sample: 'Export production-ready code' },
  { name: 'Body large', cls: 'text-lg leading-relaxed', spec: '18px · regular · 1.625', sample: 'Compose pages, define tokens and verify accessibility in one workspace.' },
  { name: 'Body', cls: 'text-base leading-relaxed', spec: '16px · regular · 1.625', sample: 'Every decision exports to a format your engineers already use.' },
  { name: 'Small', cls: 'text-sm text-muted-foreground', spec: '14px · regular · muted', sample: 'Saved locally in this browser.' },
  { name: 'Label', cls: 'text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground', spec: '12px · semibold · tracked', sample: 'Website planning workspace' },
  { name: 'Code', cls: 'font-mono text-sm', spec: '14px · mono', sample: 'const theme = useTheme();' },
];

function familyName(stack: string | undefined): string {
  if (!stack) return '…';
  const s = stack.toLowerCase();
  if (s.includes('geist')) return 'Geist';
  if (s.includes('space')) return 'Space Grotesk';
  if (s.includes('jetbrains')) return 'JetBrains Mono';
  if (s.includes('inter')) return 'Inter';
  return stack.split(',')[0].replace(/['"]/g, '');
}

export default function TypographyPage() {
  const tokens = useUniverseTokens();
  const families = [
    { role: 'Display', cls: 'font-display', stack: tokens?.fonts.display },
    { role: 'Body', cls: 'font-sans', stack: tokens?.fonts.body },
    { role: 'Mono', cls: 'font-mono', stack: tokens?.fonts.mono },
  ];

  return (
    <div>
      <DocHeader title="Typography" lead="Each universe pairs its own families with one shared scale, so hierarchy stays consistent while character changes." />

      <DocSection title="Families" description="Fonts are self-hosted at build time — no layout shift and no third-party requests.">
        <div className="grid grid-cols-3 gap-4">
          {families.map((f) => (
            <div key={f.role} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{f.role}</p>
              <p className={`${f.cls} mt-4 text-5xl font-semibold`}>Aa</p>
              <p className="mt-4 text-sm font-semibold">{familyName(f.stack)}</p>
              <p className="font-mono text-[11px] text-muted-foreground">--font-{f.cls.replace('font-', '')}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Scale">
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {SCALE.map((s) => (
            <div key={s.name} className="grid grid-cols-[150px_1fr] items-baseline gap-6 px-5 py-5">
              <div>
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{s.spec}</p>
              </div>
              <p className={`${s.cls} min-w-0 truncate leading-tight`}>{s.sample}</p>
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  );
}
