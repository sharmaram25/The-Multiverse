'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check, ChevronDown, Copy, Download, ExternalLink, FileCode2, FileJson, FileText, FolderOpen,
  Keyboard, Layout, Monitor, Plus, Redo2, Smartphone, Tablet, Trash2, Undo2, Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBuilder, useActiveProject, makeId } from '@/lib/builder/store';
import { getSectionDef, isSectionType } from '@/lib/builder/sections';
import { auditProject } from '@/lib/builder/render';
import { exportBlueprint, exportBrief, exportHtml, exportReact, parseBlueprint } from '@/lib/builder/export';
import { PLAYBOOKS, STARTER_TEMPLATES, type Playbook, type PlaybookId, type StarterTemplate } from '@/lib/builder/templates';
import type { SectionType } from '@/lib/builder/types';
import { useDesignSystem } from '@/lib/design-system-store';
import { copyText, downloadFile, readFileAsText, slugify } from '@/lib/browser';
import { BuilderCanvas, type Device } from '@/components/builder/builder-canvas';
import { BuilderSidebar, type SidebarTab } from '@/components/builder/builder-sidebar';
import { BuilderInspector } from '@/components/builder/builder-inspector';

export default function UIBuilderPage() {
  const [mounted, setMounted] = useState(false);
  // Persisted state lives in localStorage — render only after mount to avoid hydration mismatches.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <BuilderSkeleton />;
  return <Builder />;
}

function BuilderSkeleton() {
  return (
    <div className="flex h-[calc(100vh-6rem)] items-center justify-center text-sm text-muted-foreground">
      <Layout className="mr-2 animate-pulse" size={18} /> Loading builder…
    </div>
  );
}

function Builder() {
  const project = useActiveProject();
  const store = useBuilder();
  const { projects, past, future } = store;
  const designTokens = useDesignSystem((s) => s.tokens);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>('desktop');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>(project.sections.length === 0 ? 'templates' : 'add');
  const [activePlaybook, setActivePlaybook] = useState<PlaybookId | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: 'ok' | 'error' } | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((message: string, tone: 'ok' | 'error' = 'ok') => {
    setToast({ message, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const selected = project.sections.find((s) => s.id === selectedId);
  const issues = useMemo(() => auditProject(project.sections, project.theme, project.seo), [project.sections, project.theme, project.seo]);
  const playbook = PLAYBOOKS.find((p) => p.id === activePlaybook);

  // ---- Actions -------------------------------------------------------------
  const addSection = useCallback((type: SectionType, index?: number) => {
    const def = getSectionDef(type);
    if (!def) return;
    let at = index;
    if (at === undefined && selectedId) {
      const i = project.sections.findIndex((s) => s.id === selectedId);
      if (i !== -1) at = i + 1;
    }
    const id = store.addSection(type, def.defaultProps, at);
    setSelectedId(id);
  }, [project.sections, selectedId, store]);

  const applyBlocks = useCallback((blocks: Array<{ type: SectionType; props: Record<string, unknown> }>) => {
    const sections = blocks.map((b) => ({ id: makeId(), type: b.type, props: { ...(getSectionDef(b.type)?.defaultProps ?? {}), ...b.props } }));
    store.setSections(sections);
    setSelectedId(sections[0]?.id ?? null);
  }, [store]);

  const applyTemplate = useCallback((t: StarterTemplate) => {
    applyBlocks(t.blocks);
    if (t.theme) store.setTheme(t.theme);
    setActivePlaybook(null);
    notify(`“${t.label}” applied — Ctrl/⌘+Z to undo`);
  }, [applyBlocks, notify, store]);

  const applyPlaybook = useCallback((p: Playbook) => {
    applyBlocks(p.blocks);
    store.setTheme(p.theme);
    setActivePlaybook(p.id);
    notify(`“${p.label}” playbook applied`);
  }, [applyBlocks, notify, store]);

  // Deep links from other tools: /builder?playbook=saas or /builder?template=agency
  const handledLink = useRef(false);
  useEffect(() => {
    if (handledLink.current) return;
    handledLink.current = true;
    const params = new URLSearchParams(window.location.search);
    const pb = PLAYBOOKS.find((p) => p.id === params.get('playbook'));
    const tpl = STARTER_TEMPLATES.find((t) => t.id === params.get('template'));
    const target = pb ?? tpl;
    if (!target) return;
    window.history.replaceState(null, '', window.location.pathname);
    const hasContent = useBuilder.getState().projects.find((p) => p.id === useBuilder.getState().activeId)?.sections.length;
    if (hasContent && !window.confirm(`Replace the current page with “${target.label}”? You can undo this.`)) return;
    if (pb) applyPlaybook(pb); else if (tpl) applyTemplate(tpl);
  }, [applyPlaybook, applyTemplate]);

  const removeSection = useCallback((id: string) => {
    store.removeSection(id);
    setSelectedId((cur) => (cur === id ? null : cur));
  }, [store]);

  const duplicateSection = useCallback((id: string) => {
    const copy = store.duplicateSection(id);
    if (copy) setSelectedId(copy);
  }, [store]);

  const usePlaygroundTokens = useCallback(() => {
    store.setTheme({
      primary: designTokens.primary,
      accent: designTokens.accent,
      background: designTokens.background,
      foreground: designTokens.foreground,
      radius: designTokens.radius,
      fontFamily: designTokens.fontFamily,
      headingScale: designTokens.headingScale,
    });
    notify('Theme synced from Design Playground');
  }, [designTokens, notify, store]);

  const fileBase = slugify(project.name, 'website');

  const doExport = useCallback(async (kind: 'html' | 'react' | 'json' | 'brief' | 'copy-html') => {
    if (project.sections.length === 0 && kind !== 'json') {
      notify('Add at least one section before exporting', 'error');
      return;
    }
    let ok = false;
    switch (kind) {
      case 'html':
        ok = downloadFile(`${fileBase}.html`, exportHtml(project), 'text/html');
        if (ok) notify('Downloaded standalone HTML — open it in any browser');
        break;
      case 'copy-html':
        ok = await copyText(exportHtml(project));
        if (ok) notify('HTML copied to clipboard');
        break;
      case 'react': {
        const { component, css } = exportReact(project);
        ok = downloadFile(`${fileBase}.tsx`, component, 'text/plain') && downloadFile('site.css', css, 'text/css');
        if (ok) notify('Downloaded React component + site.css');
        break;
      }
      case 'json':
        ok = downloadFile(`${fileBase}.blueprint.json`, exportBlueprint(project), 'application/json');
        if (ok) notify('Blueprint downloaded — import it any time to keep editing');
        break;
      case 'brief':
        ok = await copyText(exportBrief(project, playbook ? { playbook } : undefined));
        if (ok) notify('Planning brief copied as Markdown');
        break;
    }
    if (!ok) notify('Export failed — your browser blocked the action', 'error');
  }, [fileBase, notify, playbook, project]);

  const openPreview = useCallback(() => {
    if (project.sections.length === 0) { notify('Nothing to preview yet', 'error'); return; }
    const url = URL.createObjectURL(new Blob([exportHtml(project)], { type: 'text/html' }));
    const win = window.open(url, '_blank', 'noopener');
    if (!win) notify('Pop-up blocked — allow pop-ups to open the preview', 'error');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }, [notify, project]);

  const handleImport = useCallback(async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2_000_000) { notify('File is too large (max 2 MB)', 'error'); return; }
    try {
      const result = parseBlueprint(await readFileAsText(file));
      if (result.sections.length === 0) throw new Error('The blueprint contains no recognised sections.');
      applyBlocks(result.sections);
      if (result.theme) store.setTheme(result.theme);
      if (result.name) store.renameProject(result.name);
      if (result.notes) store.setNotes(result.notes);
      if (result.seo) store.setSeo(result.seo);
      notify(`Imported ${result.sections.length} sections${result.skipped ? ` (${result.skipped} unknown skipped)` : ''}`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Import failed', 'error');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  }, [applyBlocks, notify, store]);

  // ---- Keyboard shortcuts --------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'z' && !typing) {
        e.preventDefault();
        if (e.shiftKey) store.redo(); else store.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === 'y' && !typing) { e.preventDefault(); store.redo(); return; }
      if (typing) return;
      if (e.key === '?' ) { setShowShortcuts((v) => !v); return; }
      if (e.key === 'Escape') { setSelectedId(null); setShowShortcuts(false); return; }
      if (!selectedId) return;
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeSection(selectedId); }
      else if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicateSection(selectedId); }
      else if (e.altKey && e.key === 'ArrowUp') { e.preventDefault(); store.moveSection(selectedId, -1); }
      else if (e.altKey && e.key === 'ArrowDown') { e.preventDefault(); store.moveSection(selectedId, 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duplicateSection, removeSection, selectedId, store]);

  // Drop selection if the section disappears (undo, project switch).
  useEffect(() => {
    if (selectedId && !project.sections.some((s) => s.id === selectedId)) {
      setSelectedId(null);
    }
  }, [project.sections, selectedId]);

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      {/* Toolbar */}
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-background px-3 py-2">
        <ProjectMenu
          projects={projects}
          activeId={project.id}
          name={project.name}
          onRename={store.renameProject}
          onSwitch={(id) => { store.switchProject(id); setSelectedId(null); }}
          onCreate={() => { store.createProject(); setSelectedId(null); setSidebarTab('templates'); }}
          onDuplicate={() => { store.duplicateProject(project.id); notify('Project duplicated'); }}
          onDelete={() => {
            if (window.confirm(`Delete “${project.name}”? This cannot be undone.`)) { store.deleteProject(project.id); notify('Project deleted'); }
          }}
        />

        <div className="flex items-center rounded-md border border-border">
          <IconButton label="Undo (Ctrl/⌘+Z)" disabled={past.length === 0} onClick={store.undo}><Undo2 size={15} /></IconButton>
          <IconButton label="Redo (Ctrl/⌘+Shift+Z)" disabled={future.length === 0} onClick={store.redo}><Redo2 size={15} /></IconButton>
        </div>

        <div className="flex items-center rounded-md border border-border" role="group" aria-label="Preview device">
          {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([d, Icon]) => (
            <IconButton key={d} label={`${d} preview`} active={device === d} onClick={() => setDevice(d)}><Icon size={15} /></IconButton>
          ))}
        </div>

        <span className="text-xs text-muted-foreground">
          {project.sections.length} section{project.sections.length === 1 ? '' : 's'} · saved locally
        </span>

        <div className="ml-auto flex items-center gap-2">
          <IconButton label="Keyboard shortcuts (?)" onClick={() => setShowShortcuts((v) => !v)}><Keyboard size={15} /></IconButton>
          <input ref={fileInput} type="file" accept=".json,application/json" className="hidden" onChange={(e) => handleImport(e.target.files?.[0])} />
          <button type="button" onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted">
            <Upload size={14} /> Import
          </button>
          <button type="button" onClick={openPreview} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted">
            <ExternalLink size={14} /> Preview
          </button>
          <ExportMenu onExport={doExport} />
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <aside className="w-72 shrink-0 border-r border-border bg-card/40">
          <BuilderSidebar
            tab={sidebarTab}
            onTabChange={setSidebarTab}
            onAdd={(type) => addSection(type)}
            onApplyTemplate={applyTemplate}
            onApplyPlaybook={applyPlaybook}
            activePlaybook={activePlaybook}
            theme={project.theme}
            onThemeChange={store.setTheme}
            onUsePlaygroundTokens={usePlaygroundTokens}
          />
        </aside>

        <main className="flex min-w-0 flex-1">
          <BuilderCanvas
            sections={project.sections}
            theme={project.theme}
            device={device}
            selectedId={selectedId}
            onSelect={(id) => { setSelectedId(id); }}
            onMove={store.moveSection}
            onDuplicate={duplicateSection}
            onRemove={removeSection}
            onReorder={store.reorder}
            onInsertNew={(type, index) => { if (isSectionType(type)) addSection(type, index); }}
            onOpenTemplates={() => setSidebarTab('templates')}
          />
        </main>

        <aside className="w-80 shrink-0 border-l border-border bg-card/40">
          <BuilderInspector
            section={selected}
            onChange={store.updateProp}
            issues={issues}
            sectionCount={project.sections.length}
            notes={project.notes ?? ''}
            onNotesChange={store.setNotes}
            seo={project.seo ?? {}}
            onSeoChange={store.setSeo}
            projectName={project.name}
          />
        </aside>

        {showShortcuts && <ShortcutsPanel onClose={() => setShowShortcuts(false)} />}
      </div>

      {/* Toast */}
      <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
        {toast && (
          <div className={cn('flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-xl', toast.tone === 'ok' ? 'bg-zinc-900 text-white' : 'bg-red-600 text-white')}>
            {toast.tone === 'ok' && <Check size={15} />} {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function IconButton({ label, onClick, disabled, active, children }: { label: string; onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn('p-2 transition-colors disabled:opacity-30', active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}
    >
      {children}
    </button>
  );
}

function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, close]);
  return ref;
}

function ExportMenu({ onExport }: { onExport: (kind: 'html' | 'react' | 'json' | 'brief' | 'copy-html') => void }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss(open, close);
  const items = [
    { kind: 'html' as const, icon: Download, label: 'HTML page', desc: 'Standalone file — open or deploy anywhere' },
    { kind: 'react' as const, icon: FileCode2, label: 'React component', desc: '.tsx + site.css for Next.js / Vite' },
    { kind: 'json' as const, icon: FileJson, label: 'Blueprint (JSON)', desc: 'Re-import later or share with your team' },
    { kind: 'brief' as const, icon: FileText, label: 'Copy planning brief', desc: 'Markdown summary for docs & tickets' },
    { kind: 'copy-html' as const, icon: Copy, label: 'Copy HTML', desc: 'Paste into a CMS or code editor' },
  ];
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md bg-[#4f46e5] px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-[#4338ca]"
      >
        <Download size={14} /> Export <ChevronDown size={13} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-background p-1 shadow-2xl">
          {items.map((it) => (
            <button
              key={it.kind}
              role="menuitem"
              type="button"
              onClick={() => { setOpen(false); onExport(it.kind); }}
              className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted"
            >
              <it.icon size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>
                <span className="block text-sm font-semibold">{it.label}</span>
                <span className="block text-[11px] text-muted-foreground">{it.desc}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectMenu({ projects, activeId, name, onRename, onSwitch, onCreate, onDuplicate, onDelete }: {
  projects: Array<{ id: string; name: string; updatedAt: number; sections: unknown[] }>;
  activeId: string;
  name: string;
  onRename: (name: string) => void;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss(open, close);
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt);
  return (
    <div className="relative flex items-center gap-1" ref={ref}>
      <button type="button" aria-label="Projects" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
        <FolderOpen size={16} />
      </button>
      <input
        aria-label="Project name"
        value={name}
        onChange={(e) => onRename(e.target.value)}
        className="w-48 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-bold outline-none hover:border-border focus:border-border focus:ring-2 focus:ring-primary/30"
      />
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
          <div className="flex gap-1 border-b border-border p-2">
            <button type="button" onClick={() => { onCreate(); close(); }} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary/10 px-2 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"><Plus size={13} /> New</button>
            <button type="button" onClick={() => { onDuplicate(); close(); }} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs font-semibold hover:bg-muted"><Copy size={13} /> Duplicate</button>
            <button type="button" onClick={() => { close(); onDelete(); }} className="inline-flex items-center justify-center rounded-md border border-border px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" aria-label="Delete project"><Trash2 size={13} /></button>
          </div>
          <ul className="max-h-72 overflow-y-auto p-1">
            {sorted.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => { onSwitch(p.id); close(); }}
                  className={cn('flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left hover:bg-muted', p.id === activeId && 'bg-primary/5')}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{p.name || 'Untitled'}</span>
                    <span className="block text-[11px] text-muted-foreground">{p.sections.length} sections · {new Date(p.updatedAt).toLocaleString()}</span>
                  </span>
                  {p.id === activeId && <Check size={14} className="shrink-0 text-primary" />}
                </button>
              </li>
            ))}
          </ul>
          <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">Projects are stored in this browser. Export a blueprint to back up or share.</p>
        </div>
      )}
    </div>
  );
}

function ShortcutsPanel({ onClose }: { onClose: () => void }) {
  const rows: Array<[string, string]> = [
    ['Ctrl/⌘ + Z', 'Undo'],
    ['Ctrl/⌘ + Shift + Z', 'Redo'],
    ['Delete', 'Remove selected section'],
    ['Ctrl/⌘ + D', 'Duplicate selected section'],
    ['Alt + ↑ / ↓', 'Move selected section'],
    ['Enter', 'Select focused section'],
    ['Esc', 'Clear selection'],
    ['?', 'Toggle this panel'],
  ];
  return (
    <div className="absolute right-4 top-4 z-40 w-72 rounded-xl border border-border bg-background p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold">Keyboard shortcuts</p>
        <button type="button" onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
      </div>
      <dl className="space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 text-xs">
            <dt><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">{k}</kbd></dt>
            <dd className="text-muted-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
