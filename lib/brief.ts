import type { PlaybookId } from '@/lib/builder/templates';
import type { Theme } from '@/components/theme-provider';

export interface Brief {
  name: string;
  organization: string;
  summary: string;
  type: PlaybookId;
  launchDate: string;
  primaryGoal: GoalId;
  audience: string;
  tasks: [string, string, string];
  pages: string[];
  customPages: string;
  features: string[];
  copyReady: 'yes' | 'partial' | 'no';
  imageryReady: 'yes' | 'partial' | 'no';
  hasBrand: boolean;
  universe: Theme;
  a11y: 'AA' | 'AAA';
  budget: string;
  notes: string;
}

export type GoalId = 'leads' | 'sales' | 'credibility' | 'inform' | 'recruit' | 'signups';

export const GOALS: Array<{ id: GoalId; label: string; kpis: string[] }> = [
  { id: 'leads', label: 'Generate qualified leads', kpis: ['Qualified inquiries per month', 'Contact form conversion rate', 'Cost per lead'] },
  { id: 'signups', label: 'Drive sign-ups or trials', kpis: ['Trial sign-up rate', 'Activation within 7 days', 'Pricing page conversion'] },
  { id: 'sales', label: 'Sell products online', kpis: ['Conversion rate', 'Average order value', 'Cart abandonment rate'] },
  { id: 'credibility', label: 'Build credibility and trust', kpis: ['Time on key pages', 'Case study views', 'Return visitor rate'] },
  { id: 'inform', label: 'Inform and educate', kpis: ['Organic search traffic', 'Pages per session', 'Newsletter sign-ups'] },
  { id: 'recruit', label: 'Recruit talent', kpis: ['Applications per role', 'Careers page conversion', 'Application completion rate'] },
];

/** Page catalogue: label, route and indicative build hours (design + build + QA). */
export const PAGES: Array<{ id: string; label: string; route: string; hours: number; purpose: string }> = [
  { id: 'home', label: 'Home', route: '/', hours: 14, purpose: 'Value proposition and primary conversion path' },
  { id: 'about', label: 'About', route: '/about', hours: 6, purpose: 'Story, values and credibility' },
  { id: 'services', label: 'Services', route: '/services', hours: 8, purpose: 'Offerings explained in plain language' },
  { id: 'features', label: 'Product / Features', route: '/features', hours: 10, purpose: 'Capabilities mapped to outcomes' },
  { id: 'pricing', label: 'Pricing', route: '/pricing', hours: 8, purpose: 'Plans, comparison and objection handling' },
  { id: 'work', label: 'Case studies', route: '/work', hours: 10, purpose: 'Proof with measurable results' },
  { id: 'team', label: 'Team', route: '/team', hours: 5, purpose: 'People and expertise' },
  { id: 'blog', label: 'Blog / Insights', route: '/blog', hours: 8, purpose: 'Thought leadership and SEO' },
  { id: 'careers', label: 'Careers', route: '/careers', hours: 6, purpose: 'Open roles and culture' },
  { id: 'faq', label: 'FAQ', route: '/faq', hours: 4, purpose: 'Answer common objections' },
  { id: 'contact', label: 'Contact', route: '/contact', hours: 5, purpose: 'Lead capture and routing' },
  { id: 'docs', label: 'Documentation', route: '/docs', hours: 12, purpose: 'Self-serve onboarding' },
  { id: 'shop', label: 'Shop / Catalogue', route: '/shop', hours: 12, purpose: 'Browse and filter products' },
  { id: 'product', label: 'Product detail', route: '/product/[slug]', hours: 10, purpose: 'Details, reviews and add-to-cart' },
  { id: 'legal', label: 'Privacy & terms', route: '/legal', hours: 2, purpose: 'Legal and compliance' },
];

export const FEATURES: Array<{ id: string; label: string; hours: number }> = [
  { id: 'cms', label: 'Content management (CMS)', hours: 16 },
  { id: 'forms', label: 'Contact / lead forms', hours: 6 },
  { id: 'newsletter', label: 'Newsletter sign-up', hours: 4 },
  { id: 'search', label: 'Site search', hours: 10 },
  { id: 'i18n', label: 'Multiple languages', hours: 20 },
  { id: 'auth', label: 'User accounts / login', hours: 30 },
  { id: 'booking', label: 'Booking / scheduling', hours: 18 },
  { id: 'commerce', label: 'Checkout and payments', hours: 50 },
  { id: 'analytics', label: 'Analytics and conversion tracking', hours: 4 },
  { id: 'integrations', label: 'CRM / marketing integrations', hours: 12 },
];

export const BUDGETS = ['Not set', 'Under $10k', '$10k–$25k', '$25k–$75k', '$75k+'];

export const DEFAULT_BRIEF: Brief = {
  name: '', organization: '', summary: '', type: 'saas', launchDate: '',
  primaryGoal: 'signups', audience: '', tasks: ['', '', ''],
  pages: ['home', 'features', 'pricing', 'contact', 'legal'], customPages: '',
  features: ['forms', 'analytics'], copyReady: 'partial', imageryReady: 'partial',
  hasBrand: false, universe: 'minimal', a11y: 'AA', budget: 'Not set', notes: '',
};

export function isBrief(v: unknown): v is Brief {
  const b = v as Brief;
  return !!b && typeof b === 'object' && typeof b.name === 'string' && Array.isArray(b.pages) && Array.isArray(b.features) && Array.isArray(b.tasks);
}

export interface Estimate {
  pageHours: number;
  featureHours: number;
  multiplier: number;
  low: number;
  high: number;
  weeksLow: number;
  weeksHigh: number;
  customCount: number;
  factors: string[];
}

/** Indicative effort estimate. Every factor is listed so the number can be challenged. */
export function estimate(b: Brief): Estimate {
  const customCount = b.customPages.split(',').map((s) => s.trim()).filter(Boolean).length;
  const pageHours = b.pages.reduce((sum, id) => sum + (PAGES.find((p) => p.id === id)?.hours ?? 0), 0) + customCount * 6;
  const featureHours = b.features.reduce((sum, id) => sum + (FEATURES.find((f) => f.id === id)?.hours ?? 0), 0);
  let multiplier = 1;
  const factors: string[] = [];
  if (b.copyReady === 'no') { multiplier += 0.2; factors.push('Copy not ready (+20%)'); } else if (b.copyReady === 'partial') { multiplier += 0.1; factors.push('Copy partly ready (+10%)'); }
  if (b.imageryReady === 'no') { multiplier += 0.1; factors.push('Imagery not ready (+10%)'); }
  if (!b.hasBrand) { multiplier += 0.15; factors.push('No brand guidelines (+15%)'); }
  if (b.a11y === 'AAA') { multiplier += 0.15; factors.push('WCAG AAA target (+15%)'); }
  const base = (pageHours + featureHours + 12) * multiplier; // +12h project setup & launch
  const low = Math.round(base * 0.85);
  const high = Math.round(base * 1.3);
  return { pageHours, featureHours, multiplier, low, high, weeksLow: Math.max(1, Math.round(low / 30)), weeksHigh: Math.max(1, Math.round(high / 30)), customCount, factors };
}

export function completeness(b: Brief): number {
  const checks = [
    !!b.name.trim(), !!b.summary.trim(), !!b.audience.trim(), b.tasks.some((t) => t.trim()),
    b.pages.length > 0, !!b.launchDate, b.budget !== 'Not set', b.features.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function routesFor(b: Brief): Array<{ path: string; purpose: string }> {
  const fromCatalogue = PAGES.filter((p) => b.pages.includes(p.id)).map((p) => ({ path: p.route, purpose: p.purpose }));
  const custom = b.customPages.split(',').map((s) => s.trim()).filter(Boolean)
    .map((label) => ({ path: '/' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), purpose: label }));
  return [...fromCatalogue, ...custom];
}

export function briefMarkdown(b: Brief): string {
  const e = estimate(b);
  const goal = GOALS.find((g) => g.id === b.primaryGoal)!;
  const lines = [
    `# ${b.name || 'Untitled project'} — Website Brief`,
    '',
    b.organization ? `**Organization:** ${b.organization}  ` : '',
    b.launchDate ? `**Target launch:** ${new Date(b.launchDate).toLocaleDateString(undefined, { dateStyle: 'long' })}  ` : '',
    `**Budget:** ${b.budget}`,
    '',
    '## Summary', b.summary || '_Not provided_', '',
    '## Goals', `- **Primary:** ${goal.label}`, ...goal.kpis.map((k) => `- KPI: ${k}`), '',
    '## Audience', b.audience || '_Not provided_', '',
    '## Top visitor tasks', ...b.tasks.filter((t) => t.trim()).map((t, i) => `${i + 1}. ${t}`), '',
    '## Sitemap', ...routesFor(b).map((r) => `- \`${r.path}\` — ${r.purpose}`), '',
    '## Features', ...(b.features.length ? b.features.map((id) => `- ${FEATURES.find((f) => f.id === id)?.label}`) : ['- None']), '',
    '## Constraints',
    `- Accessibility target: WCAG 2.2 ${b.a11y}`,
    `- Brand guidelines: ${b.hasBrand ? 'Available' : 'Not available'}`,
    `- Copy ready: ${b.copyReady} · Imagery ready: ${b.imageryReady}`,
    `- Visual direction: ${b.universe} universe`, '',
    '## Indicative effort',
    `- ${e.low}–${e.high} hours (≈ ${e.weeksLow}–${e.weeksHigh} weeks for one full-time developer)`,
    `- Pages: ${e.pageHours}h · Features: ${e.featureHours}h · Setup and launch: 12h`,
    ...e.factors.map((f) => `- ${f}`), '',
    b.notes ? '## Notes\n' + b.notes : '',
    '',
    '_Generated with The Multiverse. Estimates are indicative and should be validated with your delivery team._',
  ];
  return lines.filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n') + '\n';
}
