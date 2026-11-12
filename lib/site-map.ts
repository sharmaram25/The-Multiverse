import type { LucideIcon } from 'lucide-react';
import {
  Blocks, BookOpen, Boxes, Clock, Compass, Gauge, Globe2, Hand, Layers, LayoutTemplate,
  Map, MousePointerClick, Orbit, Palette, Rocket, Shapes, Lightbulb, SplitSquareHorizontal,
  SwatchBook, TestTube2, Waves, Workflow, Zap, FileText,
} from 'lucide-react';

export interface SiteLink {
  name: string;
  path: string;
  description: string;
  icon: LucideIcon;
  keywords?: string;
}

export interface SiteGroup {
  id: 'build' | 'labs' | 'explore';
  label: string;
  summary: string;
  links: SiteLink[];
}

export const SITE_GROUPS: SiteGroup[] = [
  {
    id: 'build',
    label: 'Build',
    summary: 'From brief to code: scope the project, compose pages, define tokens and export.',
    links: [
      { name: 'Project Brief', path: '/brief', description: 'Discovery questions, scope estimate and a written brief.', icon: FileText, keywords: 'brief discovery scope estimate requirements' },
      { name: 'Sitemap Planner', path: '/multiverse-map', description: 'Page hierarchy, diagram and sitemap.xml export.', icon: Map, keywords: 'sitemap information architecture ia pages tree xml' },
      { name: 'UI Builder', path: '/builder', description: 'Compose pages and export HTML, React or JSON.', icon: Blocks, keywords: 'page builder export html react landing' },
      { name: 'Design Playground', path: '/playground', description: 'Tokens, contrast audit and code export.', icon: Palette, keywords: 'tokens colors tailwind css variables wcag' },
      { name: 'Launch Studio', path: '/launch-studio', description: 'Route strategy, KPIs and launch readiness.', icon: Rocket, keywords: 'checklist readiness kpi routes' },
      { name: 'Design System', path: '/design-system', description: 'Colors, type, spacing and accessibility.', icon: SwatchBook, keywords: 'docs typography spacing accessibility' },
      { name: 'Components', path: '/components', description: 'Reference components across universes.', icon: Boxes },
      { name: 'Performance', path: '/performance', description: 'Rendering budgets and optimisation techniques.', icon: Gauge, keywords: 'fps lighthouse speed' },
    ],
  },
  {
    id: 'labs',
    label: 'Labs',
    summary: 'Motion and interaction references to evaluate before you commit.',
    links: [
      { name: 'Motion Lab', path: '/motion-lab', description: 'Easing, springs and choreography.', icon: Waves, keywords: 'animation easing spring' },
      { name: 'Interactions', path: '/interaction-playground', description: 'Drag, gesture and physics patterns.', icon: Hand },
      { name: 'Micro-interactions', path: '/micro-interactions', description: 'Feedback states and UI detail.', icon: MousePointerClick },
      { name: 'Theme Lab', path: '/theme-lab', description: 'Compare visual systems side by side.', icon: Shapes },
      { name: 'Copy Lab', path: '/fresh-lab', description: 'Headline, readability and CTA analysis.', icon: Lightbulb, keywords: 'copywriting headline readability flesch value proposition cta messaging' },
      { name: 'Component Generator', path: '/sandbox', description: 'Configure a component, export HTML, Tailwind or React.', icon: TestTube2, keywords: 'sandbox generator button badge alert input card tailwind css' },
      { name: 'Effects', path: '/experimental', description: 'Mesh gradients, grain, patterns, glass and WebGL.', icon: Workflow, keywords: 'background gradient mesh noise grain pattern grid glassmorphism aurora webgl particles css' },
    ],
  },
  {
    id: 'explore',
    label: 'Explore',
    summary: 'The four universes and the story behind them.',
    links: [
      { name: 'Universes', path: '/universes', description: 'Minimal, Glass, Neon and Brutalist.', icon: Globe2, keywords: 'themes styles' },
      { name: 'Parallel Universes', path: '/parallel-universes', description: 'One section in all four universes, plus a wipe comparison.', icon: SplitSquareHorizontal, keywords: 'compare' },
      { name: 'Time Travel', path: '/time-travel', description: 'Web design across the decades.', icon: Clock, keywords: 'history' },
      { name: 'Portal', path: '/portal', description: 'Interactive 3D gateway.', icon: Orbit, keywords: '3d webgl three' },
      { name: 'Scroll Story', path: '/story', description: 'Write a scroll-driven narrative and export it as a page.', icon: BookOpen, keywords: 'scrollytelling narrative chapters story export' },
      { name: 'About', path: '/about', description: 'Why The Multiverse exists.', icon: Compass },
    ],
  },
];

export const HOME_LINK: SiteLink = { name: 'Home', path: '/', description: 'Overview and guided paths.', icon: Layers };

export const ALL_LINKS: SiteLink[] = [HOME_LINK, ...SITE_GROUPS.flatMap((g) => g.links)];

export const UNIVERSE_LINKS: SiteLink[] = [
  { name: 'Minimal universe', path: '/universes/minimal', description: 'Calm, structured, typographic.', icon: LayoutTemplate },
  { name: 'Glass universe', path: '/universes/glass', description: 'Translucent depth and soft light.', icon: Layers },
  { name: 'Neon universe', path: '/universes/neon', description: 'High-contrast, luminous, technical.', icon: Zap },
  { name: 'Brutalist universe', path: '/universes/brutalist', description: 'Raw structure, bold type.', icon: Shapes },
];

/** True when `pathname` is `path` or nested below it. */
export function isActivePath(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}
