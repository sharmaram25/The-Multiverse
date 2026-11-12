'use client';

import React, { memo, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Copy, GripVertical, LayoutTemplate, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { renderSection, SITE_CSS, themeVariables } from '@/lib/builder/render';
import { getSectionDef } from '@/lib/builder/sections';
import type { BuilderComponent, SiteTheme } from '@/lib/builder/types';

export type Device = 'desktop' | 'tablet' | 'mobile';

export const DEVICE_WIDTH: Record<Device, number | null> = { desktop: null, tablet: 820, mobile: 390 };

export const DRAG_SECTION = 'application/x-mv-section-index';
export const DRAG_NEW = 'application/x-mv-section-type';

interface CanvasProps {
  sections: BuilderComponent[];
  theme: SiteTheme;
  device: Device;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, delta: number) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onInsertNew: (type: string, index: number) => void;
  onOpenTemplates: () => void;
}

export function BuilderCanvas({
  sections, theme, device, selectedId, onSelect, onMove, onDuplicate, onRemove, onReorder, onInsertNew, onOpenTemplates,
}: CanvasProps) {
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const style = useMemo(() => themeVariables(theme) as React.CSSProperties, [theme]);
  const width = DEVICE_WIDTH[device];

  const handleDrop = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    setDropIndex(null);
    const fromRaw = event.dataTransfer.getData(DRAG_SECTION);
    const newType = event.dataTransfer.getData(DRAG_NEW);
    if (fromRaw !== '') {
      const from = Number(fromRaw);
      if (Number.isInteger(from)) onReorder(from, index > from ? index - 1 : index);
    } else if (newType) {
      onInsertNew(newType, index);
    }
  };

  const acceptsDrag = (event: React.DragEvent) =>
    event.dataTransfer.types.includes(DRAG_SECTION) || event.dataTransfer.types.includes(DRAG_NEW);

  return (
    <div
      className="flex-1 overflow-auto bg-muted/40 p-3 sm:p-6"
      onClick={() => onSelect(null)}
      onDragOver={(e) => { if (acceptsDrag(e) && sections.length === 0) { e.preventDefault(); setDropIndex(0); } }}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setDropIndex(null); }}
      onDrop={(e) => { if (sections.length === 0) handleDrop(e, 0); }}
    >
      <style>{SITE_CSS}</style>
      <div
        className="mx-auto transition-[max-width] duration-300 ease-out"
        style={{ maxWidth: width ? `${width}px` : '100%' }}
      >
        {width && (
          <div className="mb-2 text-center text-[11px] font-mono text-muted-foreground">{width}px · {device}</div>
        )}
        <div className={cn('mv-site min-h-[70vh] shadow-xl ring-1 ring-black/10 overflow-hidden', device !== 'desktop' && 'rounded-[20px]')} style={style}>
          {sections.length === 0 ? (
            <EmptyCanvas onOpenTemplates={onOpenTemplates} highlight={dropIndex === 0} />
          ) : (
            sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <DropLine active={dropIndex === index} />
                <SectionFrame
                  section={section}
                  index={index}
                  total={sections.length}
                  selected={selectedId === section.id}
                  onSelect={onSelect}
                  onMove={onMove}
                  onDuplicate={onDuplicate}
                  onRemove={onRemove}
                  onDragOverIndex={(i) => setDropIndex(i)}
                  onDropAt={handleDrop}
                  acceptsDrag={acceptsDrag}
                  onDragEnd={() => setDropIndex(null)}
                />
              </React.Fragment>
            ))
          )}
          {sections.length > 0 && <DropLine active={dropIndex === sections.length} />}
        </div>
      </div>
    </div>
  );
}

function DropLine({ active }: { active: boolean }) {
  return (
    <div className={cn('relative h-0 transition-all', active && 'h-1')} aria-hidden="true">
      {active && <div className="absolute inset-x-4 -top-0.5 h-1 rounded-full bg-[#4f46e5] shadow-[0_0_0_3px_rgba(79,70,229,0.25)]" />}
    </div>
  );
}

function EmptyCanvas({ onOpenTemplates, highlight }: { onOpenTemplates: () => void; highlight: boolean }) {
  return (
    <div className={cn('flex min-h-[70vh] flex-col items-center justify-center gap-4 p-10 text-center transition-colors', highlight && 'bg-[#4f46e5]/5')}>
      <LayoutTemplate size={44} className="opacity-25" />
      <div>
        <p className="text-lg font-semibold">Start with a template or add sections</p>
        <p className="mt-1 text-sm opacity-70">Click a section in the library, or drag it here.</p>
      </div>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onOpenTemplates(); }}
        className="rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#4338ca]"
      >
        Browse templates
      </button>
    </div>
  );
}

interface FrameProps {
  section: BuilderComponent;
  index: number;
  total: number;
  selected: boolean;
  onSelect: (id: string | null) => void;
  onMove: (id: string, delta: number) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onDragOverIndex: (index: number) => void;
  onDropAt: (event: React.DragEvent, index: number) => void;
  acceptsDrag: (event: React.DragEvent) => boolean;
  onDragEnd: () => void;
}

const SectionFrame = memo(function SectionFrame({
  section, index, total, selected, onSelect, onMove, onDuplicate, onRemove, onDragOverIndex, onDropAt, acceptsDrag, onDragEnd,
}: FrameProps) {
  // Re-render HTML only when this section's props change.
  const html = useMemo(() => renderSection(section), [section]);
  const label = getSectionDef(section.type)?.label ?? section.type;

  const insertionIndex = (event: React.DragEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2 ? index : index + 1;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${label} section${selected ? ' (selected)' : ''}`}
      aria-pressed={selected}
      onClick={(e) => { e.stopPropagation(); onSelect(section.id); }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(section.id); }
      }}
      onDragOver={(e) => { if (acceptsDrag(e)) { e.preventDefault(); onDragOverIndex(insertionIndex(e)); } }}
      onDrop={(e) => { e.stopPropagation(); onDropAt(e, insertionIndex(e)); }}
      className={cn(
        'group/frame relative cursor-pointer outline-none',
        'after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:transition-shadow',
        selected
          ? 'after:shadow-[inset_0_0_0_2px_#4f46e5]'
          : 'hover:after:shadow-[inset_0_0_0_1px_rgba(79,70,229,0.55)] focus-visible:after:shadow-[inset_0_0_0_2px_#4f46e5]'
      )}
    >
      {/* Rendered section — links are inert inside the editor. */}
      <div className="pointer-events-none select-none" dangerouslySetInnerHTML={{ __html: html }} />

      <div
        className={cn(
          'absolute right-2 top-2 z-[2] flex items-center gap-0.5 rounded-lg border border-black/10 bg-white p-1 text-zinc-700 shadow-lg transition-opacity',
          selected ? 'opacity-100' : 'opacity-0 group-hover/frame:opacity-100 group-focus-within/frame:opacity-100'
        )}
        style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData(DRAG_SECTION, String(index));
            e.dataTransfer.effectAllowed = 'move';
          }}
          onDragEnd={onDragEnd}
          className="flex cursor-grab items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-semibold active:cursor-grabbing hover:bg-zinc-100"
          title="Drag to reorder"
        >
          <GripVertical size={13} /> {label}
        </span>
        <ToolbarButton label="Move up" disabled={index === 0} onClick={() => onMove(section.id, -1)}><ChevronUp size={14} /></ToolbarButton>
        <ToolbarButton label="Move down" disabled={index === total - 1} onClick={() => onMove(section.id, 1)}><ChevronDown size={14} /></ToolbarButton>
        <ToolbarButton label="Duplicate" onClick={() => onDuplicate(section.id)}><Copy size={13} /></ToolbarButton>
        <ToolbarButton label="Delete" danger onClick={() => onRemove(section.id)}><Trash2 size={13} /></ToolbarButton>
      </div>
    </div>
  );
});

function ToolbarButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'rounded-md p-1.5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent',
        danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-zinc-100'
      )}
    >
      {children}
    </button>
  );
}
