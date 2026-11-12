'use client';

import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { BuilderComponent, BuilderProject, SectionType, SiteTheme } from './types';

const HISTORY_LIMIT = 100;
/** Consecutive edits to the same field within this window collapse into one undo step. */
const COALESCE_MS = 900;

export const DEFAULT_SITE_THEME: SiteTheme = {
  primary: '#4f46e5',
  accent: '#f43f5e',
  background: '#ffffff',
  foreground: '#0f172a',
  radius: 10,
  fontFamily: 'Inter',
  headingScale: 1.25,
};

export function makeId(prefix = 'sec'): string {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

function newProject(name = 'Untitled website'): BuilderProject {
  const now = Date.now();
  return { id: makeId('prj'), name, createdAt: now, updatedAt: now, sections: [], theme: { ...DEFAULT_SITE_THEME }, notes: '' };
}

/** localStorage wrapper that never throws (private mode, quota exceeded, blocked storage). */
const safeStorage: StateStorage = {
  getItem: (name) => {
    try { return localStorage.getItem(name); } catch { return null; }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, value); } catch { /* storage full or unavailable — keep working in memory */ }
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name); } catch { /* ignore */ }
  },
};

interface BuilderState {
  projects: BuilderProject[];
  activeId: string;
  // History is per session and not persisted.
  past: BuilderComponent[][];
  future: BuilderComponent[][];
  lastEdit: { key: string; at: number } | null;

  // Project management
  createProject: (name?: string) => void;
  switchProject: (id: string) => void;
  renameProject: (name: string) => void;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void;
  setNotes: (notes: string) => void;
  setTheme: (patch: Partial<SiteTheme>) => void;
  setSeo: (patch: NonNullable<BuilderProject['seo']>) => void;

  // Section editing (all undoable)
  setSections: (sections: BuilderComponent[]) => void;
  addSection: (type: SectionType, props: Record<string, unknown>, index?: number) => string;
  updateProp: (id: string, key: string, value: unknown) => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => string | null;
  moveSection: (id: string, delta: number) => void;
  reorder: (from: number, to: number) => void;
  clear: () => void;

  undo: () => void;
  redo: () => void;
}

const initial = newProject('My first website');

export const useBuilder = create<BuilderState>()(
  persist(
    (set, get) => {
      const active = () => get().projects.find((p) => p.id === get().activeId) ?? get().projects[0];

      /** Applies a section change to the active project and records history. */
      const commit = (next: BuilderComponent[], coalesceKey?: string) => {
        const state = get();
        const current = active();
        if (!current) return;
        const now = Date.now();
        const coalesce = coalesceKey && state.lastEdit && state.lastEdit.key === coalesceKey && now - state.lastEdit.at < COALESCE_MS;
        set({
          projects: state.projects.map((p) => (p.id === current.id ? { ...p, sections: next, updatedAt: now } : p)),
          past: coalesce ? state.past : [...state.past, current.sections].slice(-HISTORY_LIMIT),
          future: [],
          lastEdit: coalesceKey ? { key: coalesceKey, at: now } : null,
        });
      };

      const patchActive = (patch: Partial<BuilderProject>) => {
        const current = active();
        if (!current) return;
        set((s) => ({ projects: s.projects.map((p) => (p.id === current.id ? { ...p, ...patch, updatedAt: Date.now() } : p)) }));
      };

      return {
        projects: [initial],
        activeId: initial.id,
        past: [],
        future: [],
        lastEdit: null,

        createProject: (name) => {
          const project = newProject(name);
          set((s) => ({ projects: [project, ...s.projects], activeId: project.id, past: [], future: [], lastEdit: null }));
        },
        switchProject: (id) => {
          if (!get().projects.some((p) => p.id === id)) return;
          set({ activeId: id, past: [], future: [], lastEdit: null });
        },
        renameProject: (name) => patchActive({ name: name.slice(0, 120) }),
        duplicateProject: (id) => {
          const src = get().projects.find((p) => p.id === id);
          if (!src) return;
          const now = Date.now();
          const copy: BuilderProject = {
            ...src,
            id: makeId('prj'),
            name: `${src.name} (copy)`,
            createdAt: now,
            updatedAt: now,
            sections: src.sections.map((s) => ({ ...s, id: makeId(), props: { ...s.props } })),
            theme: { ...src.theme },
          };
          set((s) => ({ projects: [copy, ...s.projects], activeId: copy.id, past: [], future: [], lastEdit: null }));
        },
        deleteProject: (id) => {
          const remaining = get().projects.filter((p) => p.id !== id);
          if (remaining.length === 0) {
            const fresh = newProject();
            set({ projects: [fresh], activeId: fresh.id, past: [], future: [], lastEdit: null });
            return;
          }
          set((s) => ({
            projects: remaining,
            activeId: s.activeId === id ? remaining[0].id : s.activeId,
            past: s.activeId === id ? [] : s.past,
            future: s.activeId === id ? [] : s.future,
          }));
        },
        setNotes: (notes) => patchActive({ notes: notes.slice(0, 20000) }),
        setTheme: (patch) => {
          const current = active();
          if (current) patchActive({ theme: { ...current.theme, ...patch } });
        },

        setSeo: (patch) => {
          const current = active();
          if (current) patchActive({ seo: { ...(current.seo ?? {}), ...patch } });
        },
        setSections: (sections) => commit(sections),
        addSection: (type, props, index) => {
          const id = makeId();
          const sections = [...(active()?.sections ?? [])];
          const item: BuilderComponent = { id, type, props: { ...props } };
          if (index === undefined || index < 0 || index > sections.length) sections.push(item);
          else sections.splice(index, 0, item);
          commit(sections);
          return id;
        },
        updateProp: (id, key, value) => {
          const sections = (active()?.sections ?? []).map((s) => (s.id === id ? { ...s, props: { ...s.props, [key]: value } } : s));
          commit(sections, `${id}:${key}`);
        },
        removeSection: (id) => commit((active()?.sections ?? []).filter((s) => s.id !== id)),
        duplicateSection: (id) => {
          const sections = [...(active()?.sections ?? [])];
          const index = sections.findIndex((s) => s.id === id);
          if (index === -1) return null;
          const copy: BuilderComponent = { ...sections[index], id: makeId(), props: { ...sections[index].props } };
          sections.splice(index + 1, 0, copy);
          commit(sections);
          return copy.id;
        },
        moveSection: (id, delta) => {
          const sections = [...(active()?.sections ?? [])];
          const from = sections.findIndex((s) => s.id === id);
          const to = from + delta;
          if (from === -1 || to < 0 || to >= sections.length) return;
          const [item] = sections.splice(from, 1);
          sections.splice(to, 0, item);
          commit(sections);
        },
        reorder: (from, to) => {
          const sections = [...(active()?.sections ?? [])];
          if (from === to || from < 0 || to < 0 || from >= sections.length || to >= sections.length) return;
          const [item] = sections.splice(from, 1);
          sections.splice(to, 0, item);
          commit(sections);
        },
        clear: () => commit([]),

        undo: () => {
          const { past, future } = get();
          const current = active();
          if (!current || past.length === 0) return;
          const previous = past[past.length - 1];
          set((s) => ({
            projects: s.projects.map((p) => (p.id === current.id ? { ...p, sections: previous, updatedAt: Date.now() } : p)),
            past: past.slice(0, -1),
            future: [current.sections, ...future].slice(0, HISTORY_LIMIT),
            lastEdit: null,
          }));
        },
        redo: () => {
          const { past, future } = get();
          const current = active();
          if (!current || future.length === 0) return;
          const next = future[0];
          set((s) => ({
            projects: s.projects.map((p) => (p.id === current.id ? { ...p, sections: next, updatedAt: Date.now() } : p)),
            past: [...past, current.sections].slice(-HISTORY_LIMIT),
            future: future.slice(1),
            lastEdit: null,
          }));
        },
      };
    },
    {
      name: 'multiverse-builder',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ projects: s.projects, activeId: s.activeId }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<Pick<BuilderState, 'projects' | 'activeId'>> | undefined;
        const projects = Array.isArray(saved?.projects) && saved.projects.length > 0
          ? saved.projects
              .filter((p): p is BuilderProject => !!p && typeof p === 'object' && typeof p.id === 'string' && Array.isArray(p.sections))
              .map((p) => ({ ...p, theme: { ...DEFAULT_SITE_THEME, ...(p.theme ?? {}) } }))
          : current.projects;
        const safeProjects = projects.length > 0 ? projects : current.projects;
        const activeId = safeProjects.some((p) => p.id === saved?.activeId) ? (saved!.activeId as string) : safeProjects[0].id;
        return { ...current, projects: safeProjects, activeId };
      },
    }
  )
);

/** Selector for the active project. */
export function useActiveProject(): BuilderProject {
  return useBuilder((s) => s.projects.find((p) => p.id === s.activeId) ?? s.projects[0]);
}
