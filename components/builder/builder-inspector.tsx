'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, MousePointerClick, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSectionDef } from '@/lib/builder/sections';
import type { AccessibilityIssue } from '@/lib/builder/render';
import type { BuilderComponent, FieldDef, PageSeo } from '@/lib/builder/types';

interface InspectorProps {
  section: BuilderComponent | undefined;
  onChange: (id: string, key: string, value: unknown) => void;
  issues: AccessibilityIssue[];
  sectionCount: number;
  notes: string;
  onNotesChange: (notes: string) => void;
  seo: PageSeo;
  onSeoChange: (patch: PageSeo) => void;
  projectName: string;
}

const inputClass = 'w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40';

export function BuilderInspector({ section, onChange, issues, sectionCount, notes, onNotesChange, seo, onSeoChange, projectName }: InspectorProps) {
  const def = section ? getSectionDef(section.type) : undefined;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-border p-4">
        {section && def ? (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Editing</p>
              <h2 className="text-base font-bold">{def.label}</h2>
            </div>
            {def.fields.map((field) => (
              <Field key={field.key} field={field} value={section.props[field.key]} onChange={(v) => onChange(section.id, field.key, v)} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Page settings</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><MousePointerClick size={13} /> Select a section to edit its content.</p>
            </div>
            <SeoField label="Page title" value={seo.title ?? ''} placeholder={projectName} limit={60} onChange={(v) => onSeoChange({ title: v })} />
            <SeoField label="Meta description" value={seo.description ?? ''} placeholder="Shown in search results and link previews" limit={160} multiline onChange={(v) => onSeoChange({ description: v })} />
            <SeoField label="Social image URL" value={seo.ogImage ?? ''} placeholder="https://…/og-image.png (1200×630)" onChange={(v) => onSeoChange({ ogImage: v })} />
            <div className="space-y-1">
              <label htmlFor="seo-lang" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Language</label>
              <select id="seo-lang" value={seo.lang ?? 'en'} onChange={(e) => onSeoChange({ lang: e.target.value })} className={inputClass}>
                {[['en', 'English'], ['en-GB', 'English (UK)'], ['es', 'Spanish'], ['fr', 'French'], ['de', 'German'], ['pt', 'Portuguese'], ['it', 'Italian'], ['nl', 'Dutch'], ['ja', 'Japanese'], ['hi', 'Hindi']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <SerpPreview title={seo.title || projectName} description={seo.description || ''} />
          </div>
        )}
      </div>

      <div className="border-b border-border p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Page checks</p>
        {sectionCount === 0 ? (
          <p className="text-xs text-muted-foreground">Add sections to run accessibility and conversion checks.</p>
        ) : issues.length === 0 ? (
          <p className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400"><CheckCircle2 size={14} /> All checks passed.</p>
        ) : (
          <ul className="space-y-2">
            {issues.map((issue, i) => (
              <li key={i} className="flex gap-2 text-xs leading-snug">
                {issue.severity === 'error'
                  ? <XCircle size={14} className="mt-px shrink-0 text-red-600" />
                  : <AlertTriangle size={14} className="mt-px shrink-0 text-amber-600" />}
                <span>{issue.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4">
        <label htmlFor="mv-notes" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Project notes</label>
        <textarea
          id="mv-notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Audience, goals, open questions… (included in the brief and blueprint)"
          className={cn(inputClass, 'min-h-[110px] text-xs')}
        />
      </div>
    </div>
  );
}

function SeoField({ label, value, placeholder, limit, multiline, onChange }: { label: string; value: string; placeholder?: string; limit?: number; multiline?: boolean; onChange: (v: string) => void }) {
  const id = `seo-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const over = limit !== undefined && value.length > limit;
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
        {limit !== undefined && <span className={cn('font-mono text-[10px]', over ? 'font-bold text-destructive' : 'text-muted-foreground')}>{value.length}/{limit}</span>}
      </div>
      {multiline
        ? <textarea id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, 'min-h-[72px] text-xs')} aria-invalid={over} />
        : <input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass} aria-invalid={over} />}
    </div>
  );
}

/** How the page is likely to appear in a search result. */
function SerpPreview({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Search preview</p>
      <p className="truncate text-sm font-medium" style={{ color: 'var(--primary)' }}>{title.length > 60 ? `${title.slice(0, 57)}…` : title}</p>
      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{description ? (description.length > 160 ? `${description.slice(0, 157)}…` : description) : 'Add a meta description to control this text.'}</p>
    </div>
  );
}

function Field({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: string) => void }) {
  const id = `field-${field.key}`;
  const text = typeof value === 'string' ? value : '';
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{field.label}</label>
      {field.kind === 'select' ? (
        <select id={id} value={text || field.options?.[0]} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, 'capitalize')}>
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : field.kind === 'text' ? (
        <input id={id} value={text} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      ) : (
        <textarea
          id={id}
          value={text}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={field.kind !== 'list'}
          className={cn(inputClass, field.kind === 'list' ? 'min-h-[130px] font-mono text-xs leading-relaxed' : 'min-h-[84px]')}
        />
      )}
      {field.hint && <p className="text-[11px] text-muted-foreground">{field.hint}</p>}
    </div>
  );
}
