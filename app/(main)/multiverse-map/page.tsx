'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Download, FileJson, FileText, Globe, Import, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersistentState } from '@/lib/hooks/use-persistent-state';
import { copyText, downloadFile } from '@/lib/browser';
import { escapeHtml } from '@/lib/builder/render';

type PageType = 'landing' | 'content' | 'listing' | 'detail' | 'form' | 'legal';
interface SiteNode { id: string; title: string; slug: string; type: PageType; children: SiteNode[] }

const TYPE_LABEL: Record<PageType, string> = { landing: 'Landing', content: 'Content', listing: 'Listing', detail: 'Detail', form: 'Form', legal: 'Legal' };
const TYPE_DOT: Record<PageType, string> = { landing: 'bg-primary', content: 'bg-foreground/60', listing: 'bg-success', detail: 'bg-warning', form: 'bg-destructive', legal: 'bg-muted-foreground/50' };

let seq = 0;
const nid = () => `n${Date.now().toString(36)}${seq++}`;
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9[\]]+/g, '-').replace(/^-|-$/g, '') || 'page';

const DEFAULT_TREE: SiteNode = {
  id: 'root', title: 'Home', slug: '', type: 'landing', children: [
    { id: 'n1', title: 'Product', slug: 'product', type: 'landing', children: [
      { id: 'n2', title: 'Features', slug: 'features', type: 'content', children: [] },
      { id: 'n3', title: 'Integrations', slug: 'integrations', type: 'listing', children: [] },
    ] },
    { id: 'n4', title: 'Pricing', slug: 'pricing', type: 'landing', children: [] },
    { id: 'n5', title: 'Customers', slug: 'customers', type: 'listing', children: [
      { id: 'n6', title: 'Case study', slug: '[slug]', type: 'detail', children: [] },
    ] },
    { id: 'n7', title: 'Company', slug: 'company', type: 'content', children: [
      { id: 'n8', title: 'About', slug: 'about', type: 'content', children: [] },
      { id: 'n9', title: 'Careers', slug: 'careers', type: 'listing', children: [] },
    ] },
    { id: 'n10', title: 'Contact', slug: 'contact', type: 'form', children: [] },
  ],
};

const isTree = (v: unknown): v is SiteNode => !!v && typeof v === 'object' && typeof (v as SiteNode).title === 'string' && Array.isArray((v as SiteNode).children);

/* ---- tree helpers (immutable) --------------------------------------------- */
function mapTree(n: SiteNode, fn: (n: SiteNode) => SiteNode): SiteNode { const m = fn(n); return { ...m, children: m.children.map((c) => mapTree(c, fn)) }; }
function removeNode(n: SiteNode, id: string): SiteNode { return { ...n, children: n.children.filter((c) => c.id !== id).map((c) => removeNode(c, id)) }; }
function moveNode(n: SiteNode, id: string, d: -1 | 1): SiteNode {
  const i = n.children.findIndex((c) => c.id === id);
  if (i !== -1) { const ch = [...n.children]; const j = i + d; if (j >= 0 && j < ch.length) [ch[i], ch[j]] = [ch[j], ch[i]]; return { ...n, children: ch }; }
  return { ...n, children: n.children.map((c) => moveNode(c, id, d)) };
}
function flatten(n: SiteNode, base = '', depth = 0): Array<{ node: SiteNode; path: string; depth: number }> {
  const path = n.id === 'root' ? '/' : `${base === '/' ? '' : base}/${n.slug}`;
  return [{ node: n, path, depth }, ...n.children.flatMap((c) => flatten(c, path, depth + 1))];
}

export default function SitemapPlannerPage() {
  const [tree, setTree] = usePersistentState<SiteNode>('multiverse-sitemap', DEFAULT_TREE, isTree);
  const [domain, setDomain] = usePersistentState('multiverse-sitemap-domain', 'https://www.example.com');
  const [selected, setSelected] = useState<string>('root');
  const [flash, setFlash] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const flat = useMemo(() => flatten(tree), [tree]);
  const sel = flat.find((f) => f.node.id === selected) ?? flat[0];
  const signal = (k: string) => { setFlash(k); setTimeout(() => setFlash((c) => (c === k ? null : c)), 1600); };

  const patch = (id: string, p: Partial<SiteNode>) => setTree((t) => mapTree(t, (n) => (n.id === id ? { ...n, ...p } : n)));
  const addChild = (id: string) => { const child: SiteNode = { id: nid(), title: 'New page', slug: 'new-page', type: 'content', children: [] }; setTree((t) => mapTree(t, (n) => (n.id === id ? { ...n, children: [...n.children, child] } : n))); setSelected(child.id); };

  const importFromLaunch = () => {
    try {
      const plan = JSON.parse(localStorage.getItem('multiverse-launch-plan') || 'null');
      if (!plan?.routes?.length) { window.alert('No Launch Studio plan found. Create one in Launch Studio or the Project Brief first.'); return; }
      const root: SiteNode = { id: 'root', title: 'Home', slug: '', type: 'landing', children: [] };
      for (const r of plan.routes as Array<{ path: string; purpose: string }>) {
        const parts = r.path.split('/').filter(Boolean);
        let cursor = root;
        parts.forEach((part, i) => {
          let next = cursor.children.find((c) => c.slug === part);
          if (!next) {
            const title = i === parts.length - 1 && r.purpose ? part.replace(/[-[\]]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()).trim() || 'Page' : part;
            next = { id: nid(), title, slug: part, type: part.startsWith('[') ? 'detail' : 'content', children: [] };
            cursor.children.push(next);
          }
          cursor = next;
        });
      }
      if (window.confirm(`Replace the current sitemap with ${plan.routes.length} routes from Launch Studio?`)) { setTree(root); setSelected('root'); }
    } catch { window.alert('Could not read the Launch Studio plan.'); }
  };

  const base = domain.replace(/\/+$/, '');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${flat.filter((f) => !f.path.includes('[')).map((f) => `  <url>\n    <loc>${escapeHtml(base + f.path)}</loc>\n    <priority>${Math.max(0.3, 1 - f.depth * 0.2).toFixed(1)}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
  const md = flat.map((f) => `${'  '.repeat(f.depth)}- **${f.node.title}** \`${f.path}\` · ${TYPE_LABEL[f.node.type]}`).join('\n') + '\n';
  const counts = flat.reduce<Record<PageType, number>>((acc, f) => ({ ...acc, [f.node.type]: (acc[f.node.type] ?? 0) + 1 }), {} as Record<PageType, number>);
  const maxDepth = Math.max(...flat.map((f) => f.depth));

  return (
    <div className="mx-auto w-full max-w-[1400px] px-8 py-10">
      <header className="mb-8 flex items-end justify-between gap-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Sitemap Planner</p>
          <h1 className="font-display text-5xl font-bold tracking-tight">Plan the structure before the screens.</h1>
          <p className="mt-4 text-lg text-muted-foreground">Build the page hierarchy, see it as a diagram and export a sitemap.xml, an outline or JSON. Saved in this browser.</p>
        </div>
        <button type="button" onClick={importFromLaunch} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted"><Import size={15} /> Import from Launch Studio</button>
      </header>

      <div className="grid grid-cols-[320px_1fr] gap-6">
        {/* Editor */}
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Pages <span className="font-normal text-muted-foreground">· {flat.length}</span></p>
              <button type="button" onClick={() => addChild(selected)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-semibold hover:bg-muted"><Plus size={12} /> Child page</button>
            </div>
            <ul className="max-h-[360px] overflow-y-auto p-2" role="tree" aria-label="Page tree">
              {flat.map((f) => (
                <li key={f.node.id} role="treeitem" aria-selected={f.node.id === selected}>
                  <button type="button" onClick={() => setSelected(f.node.id)} className={cn('flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-sm', f.node.id === selected ? 'bg-muted font-semibold' : 'hover:bg-muted/60')} style={{ paddingLeft: 8 + f.depth * 16 }}>
                    <span className={cn('h-2 w-2 shrink-0 rounded-full', TYPE_DOT[f.node.type])} />
                    <span className="min-w-0 flex-1 truncate">{f.node.title}</span>
                    <span className="truncate font-mono text-[10px] text-muted-foreground">{f.path}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {sel && (
            <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Selected page</p>
              <label className="block space-y-1 text-xs font-semibold text-muted-foreground">Title
                <input value={sel.node.title} onChange={(e) => patch(sel.node.id, { title: e.target.value })} className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm font-normal text-foreground" />
              </label>
              {sel.node.id !== 'root' && (
                <label className="block space-y-1 text-xs font-semibold text-muted-foreground">URL segment
                  <input value={sel.node.slug} onChange={(e) => patch(sel.node.id, { slug: slugify(e.target.value) })} className="h-9 w-full rounded-md border border-border bg-background px-2 font-mono text-sm font-normal text-foreground" />
                </label>
              )}
              <label className="block space-y-1 text-xs font-semibold text-muted-foreground">Page type
                <select value={sel.node.type} onChange={(e) => patch(sel.node.id, { type: e.target.value as PageType })} className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm font-normal text-foreground">
                  {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <p className="font-mono text-xs text-muted-foreground">{base}{sel.path}</p>
              {sel.node.id !== 'root' && (
                <div className="flex gap-1">
                  <button type="button" onClick={() => setTree((t) => moveNode(t, sel.node.id, -1))} className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-1.5 text-xs font-semibold hover:bg-muted"><ArrowUp size={12} /> Up</button>
                  <button type="button" onClick={() => setTree((t) => moveNode(t, sel.node.id, 1))} className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-1.5 text-xs font-semibold hover:bg-muted"><ArrowDown size={12} /> Down</button>
                  <button type="button" onClick={() => { if (sel.node.children.length === 0 || window.confirm(`Delete “${sel.node.title}” and its ${sel.node.children.length} child page(s)?`)) { setTree((t) => removeNode(t, sel.node.id)); setSelected('root'); } }} className="inline-flex items-center justify-center rounded-md border border-border px-2.5 text-destructive hover:bg-muted" aria-label="Delete page"><Trash2 size={13} /></button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Export</p>
            <label className="block space-y-1 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-1"><Globe size={12} /> Domain for sitemap.xml</span>
              <input value={domain} onChange={(e) => setDomain(e.target.value)} className="h-9 w-full rounded-md border border-border bg-background px-2 font-mono text-xs font-normal text-foreground" />
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button type="button" onClick={() => { downloadFile('sitemap.xml', xml, 'application/xml'); signal('xml'); }} className="inline-flex flex-col items-center gap-1 rounded-md border border-border py-2 text-[11px] font-semibold hover:bg-muted"><Download size={14} /> {flash === 'xml' ? 'Saved' : 'XML'}</button>
              <button type="button" onClick={async () => { if (await copyText(md)) signal('md'); }} className="inline-flex flex-col items-center gap-1 rounded-md border border-border py-2 text-[11px] font-semibold hover:bg-muted"><FileText size={14} /> {flash === 'md' ? 'Copied' : 'Outline'}</button>
              <button type="button" onClick={() => { downloadFile('sitemap.json', JSON.stringify(tree, null, 2), 'application/json'); signal('json'); }} className="inline-flex flex-col items-center gap-1 rounded-md border border-border py-2 text-[11px] font-semibold hover:bg-muted"><FileJson size={14} /> {flash === 'json' ? 'Saved' : 'JSON'}</button>
            </div>
            <p className="text-[11px] text-muted-foreground">Dynamic routes (with [brackets]) are excluded from sitemap.xml — list those URLs from your CMS.</p>
          </div>
        </aside>

        {/* Diagram */}
        <section className="min-w-0 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3 text-xs text-muted-foreground">
            <span>{flat.length} pages · {maxDepth + 1} levels deep{maxDepth > 2 && <span className="ml-2 font-semibold text-warning">Consider flattening — key pages should be within 3 clicks.</span>}</span>
            <span className="flex items-center gap-3"><label className="flex items-center gap-2">Zoom<input type="range" min={0.4} max={1.2} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-24 accent-primary" aria-label="Diagram zoom" /><span className="w-9 font-mono">{Math.round(zoom * 100)}%</span></label>{(Object.keys(TYPE_LABEL) as PageType[]).filter((t) => counts[t]).map((t) => <span key={t} className="flex items-center gap-1.5"><span className={cn('h-2 w-2 rounded-full', TYPE_DOT[t])} />{TYPE_LABEL[t]} {counts[t]}</span>)}</span>
          </div>
          <div className="overflow-auto p-8">
            <div className="mx-auto w-fit" style={{ zoom }}><TreeNode node={tree} path="/" selected={selected} onSelect={setSelected} onAdd={addChild} /></div>
          </div>
        </section>
      </div>
    </div>
  );
}

function TreeNode({ node, path, selected, onSelect, onAdd }: { node: SiteNode; path: string; selected: string; onSelect: (id: string) => void; onAdd: (id: string) => void }) {
  const childPath = (c: SiteNode) => `${path === '/' ? '' : path}/${c.slug}`;
  return (
    <div className="flex flex-col items-center">
      <div className="group relative">
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className={cn('w-[136px] rounded-xl border bg-background px-2.5 py-2 text-left shadow-sm transition-shadow', node.id === selected ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:shadow-md')}
        >
          <span className="flex items-center gap-1.5"><span className={cn('h-2 w-2 shrink-0 rounded-full', TYPE_DOT[node.type])} /><span className="truncate text-sm font-semibold">{node.title}</span></span>
          <span className="mt-0.5 block truncate font-mono text-[10px] text-muted-foreground">{path}</span>
        </button>
        <button type="button" onClick={() => onAdd(node.id)} aria-label={`Add page under ${node.title}`} className="absolute -bottom-2.5 left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background opacity-0 shadow transition-opacity hover:bg-muted focus-visible:opacity-100 group-hover:opacity-100"><Plus size={11} /></button>
      </div>
      {node.children.length > 0 && (
        <>
          <div className="h-6 w-px bg-border" />
          <div className="flex">
            {node.children.map((c, i) => (
              <div key={c.id} className="relative flex flex-col items-center px-1.5">
                {/* horizontal connector */}
                {node.children.length > 1 && <div className={cn('absolute top-0 h-px bg-border', i === 0 ? 'left-1/2 right-0' : i === node.children.length - 1 ? 'left-0 right-1/2' : 'inset-x-0')} />}
                <div className="h-6 w-px bg-border" />
                <TreeNode node={c} path={childPath(c)} selected={selected} onSelect={onSelect} onAdd={onAdd} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
