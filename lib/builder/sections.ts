import type { SectionDef, SectionType } from './types';

const ALIGN = ['left', 'center', 'right'];

export const SECTION_DEFS: SectionDef[] = [
  {
    type: 'navbar',
    label: 'Navigation Bar',
    description: 'Brand, links and a primary action',
    category: 'Structure',
    defaultProps: { brand: 'Acme', links: 'Product\nPricing\nCustomers\nDocs', cta: 'Get started' },
    fields: [
      { key: 'brand', label: 'Brand name', kind: 'text' },
      { key: 'links', label: 'Links', kind: 'list', hint: 'One link label per line' },
      { key: 'cta', label: 'Button label', kind: 'text', placeholder: 'Leave empty to hide' },
    ],
  },
  {
    type: 'hero',
    label: 'Hero Section',
    description: 'Headline, value proposition and CTAs',
    category: 'Structure',
    defaultProps: {
      title: 'Ship your website with confidence',
      subtitle: 'Plan structure, test messaging and hand off a production-ready blueprint in minutes.',
      align: 'center',
      ctaPrimary: 'Start free',
      ctaSecondary: 'Book a demo',
    },
    fields: [
      { key: 'title', label: 'Headline', kind: 'text' },
      { key: 'subtitle', label: 'Subheadline', kind: 'textarea' },
      { key: 'align', label: 'Alignment', kind: 'select', options: ALIGN },
      { key: 'ctaPrimary', label: 'Primary button', kind: 'text', placeholder: 'Leave empty to hide' },
      { key: 'ctaSecondary', label: 'Secondary button', kind: 'text', placeholder: 'Leave empty to hide' },
    ],
  },
  {
    type: 'logos',
    label: 'Logo Cloud',
    description: 'Customer or partner names for instant credibility',
    category: 'Social proof',
    defaultProps: { heading: 'Trusted by teams at', items: 'Northwind\nGlobex\nInitech\nUmbrella\nHooli' },
    fields: [
      { key: 'heading', label: 'Heading', kind: 'text' },
      { key: 'items', label: 'Names', kind: 'list', hint: 'One company name per line' },
    ],
  },
  {
    type: 'features',
    label: 'Feature Grid',
    description: 'Three-up grid of benefits',
    category: 'Content',
    defaultProps: {
      heading: 'Everything you need to launch',
      subheading: 'Focus on outcomes — the foundations are handled.',
      items: 'Fast setup | Go from idea to live page in an afternoon.\nAccessible by default | Contrast, focus and semantics checked for you.\nPerformance first | Lightweight output with no runtime dependencies.',
    },
    fields: [
      { key: 'heading', label: 'Heading', kind: 'text' },
      { key: 'subheading', label: 'Subheading', kind: 'textarea' },
      { key: 'items', label: 'Features', kind: 'list', hint: 'One per line: Title | Description' },
    ],
  },
  {
    type: 'feature',
    label: 'Single Feature',
    description: 'One highlighted benefit with icon',
    category: 'Content',
    defaultProps: { title: 'Lightning fast', desc: 'Optimised for 60fps interactions and instant loads.' },
    fields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'desc', label: 'Description', kind: 'textarea' },
    ],
  },
  {
    type: 'stats',
    label: 'Stats Band',
    description: 'Key numbers that prove impact',
    category: 'Social proof',
    defaultProps: { items: '2.4k | Teams onboarded\n38% | Faster launches\n99.9% | Uptime\n4.9/5 | Average rating' },
    fields: [{ key: 'items', label: 'Stats', kind: 'list', hint: 'One per line: Value | Label' }],
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    description: 'A customer quote with attribution',
    category: 'Social proof',
    defaultProps: {
      quote: 'We cut our website planning time in half and finally had a blueprint engineering could trust.',
      author: 'Jordan Lee',
      role: 'Head of Growth, Northwind',
    },
    fields: [
      { key: 'quote', label: 'Quote', kind: 'textarea' },
      { key: 'author', label: 'Name', kind: 'text' },
      { key: 'role', label: 'Role & company', kind: 'text' },
    ],
  },
  {
    type: 'pricing',
    label: 'Pricing Table',
    description: 'Plans with features — mark one as featured',
    category: 'Conversion',
    defaultProps: {
      heading: 'Simple, transparent pricing',
      plans: 'Starter | $0 | /month | 1 project; Community support; Basic analytics\n*Pro | $29 | /month | Unlimited projects; Priority support; Advanced analytics; Custom domain\nTeam | $99 | /month | Everything in Pro; SSO; Audit logs; Dedicated manager',
      cta: 'Choose plan',
    },
    fields: [
      { key: 'heading', label: 'Heading', kind: 'text' },
      { key: 'plans', label: 'Plans', kind: 'list', hint: 'One per line: Name | Price | Period | Feature; Feature… — prefix the name with * to feature it' },
      { key: 'cta', label: 'Button label', kind: 'text' },
    ],
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Expandable questions — no JavaScript needed',
    category: 'Conversion',
    defaultProps: {
      heading: 'Frequently asked questions',
      items: 'Can I export my work? | Yes — download a standalone HTML file, a React component or a JSON blueprint.\nDoes it need a server? | No. Everything runs in your browser and is saved locally.\nIs the output accessible? | Sections use semantic HTML and the contrast checker flags low-contrast colors.',
    },
    fields: [
      { key: 'heading', label: 'Heading', kind: 'text' },
      { key: 'items', label: 'Questions', kind: 'list', hint: 'One per line: Question | Answer' },
    ],
  },
  {
    type: 'cta',
    label: 'Call to Action',
    description: 'High-contrast band that drives the next step',
    category: 'Conversion',
    defaultProps: { title: 'Ready to launch?', subtitle: 'Join thousands of teams shipping better websites.', buttonText: 'Get started free' },
    fields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'subtitle', label: 'Subtitle', kind: 'textarea' },
      { key: 'buttonText', label: 'Button label', kind: 'text' },
    ],
  },
  {
    type: 'text',
    label: 'Text Block',
    description: 'Free-form paragraph or heading',
    category: 'Basic',
    defaultProps: { content: 'Add your custom text here. Leave a blank line to start a new paragraph.', size: 'base', align: 'left' },
    fields: [
      { key: 'content', label: 'Content', kind: 'textarea' },
      { key: 'size', label: 'Size', kind: 'select', options: ['sm', 'base', 'lg', 'xl'] },
      { key: 'align', label: 'Alignment', kind: 'select', options: ALIGN },
    ],
  },
  {
    type: 'card',
    label: 'Highlight Card',
    description: 'Callout card for a case study or note',
    category: 'Basic',
    defaultProps: { title: 'Case study highlight', content: 'Show outcomes, not just visuals.', blur: 'md' },
    fields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'content', label: 'Content', kind: 'textarea' },
      { key: 'blur', label: 'Emphasis', kind: 'select', options: ['sm', 'md', 'lg'] },
    ],
  },
  {
    type: 'button',
    label: 'Button',
    description: 'Standalone action button',
    category: 'Basic',
    defaultProps: { text: 'Click me', variant: 'primary', size: 'default' },
    fields: [
      { key: 'text', label: 'Label', kind: 'text' },
      { key: 'variant', label: 'Variant', kind: 'select', options: ['primary', 'outline'] },
      { key: 'size', label: 'Size', kind: 'select', options: ['sm', 'default', 'lg', 'xl'] },
    ],
  },
  {
    type: 'contact',
    label: 'Contact Form',
    description: 'Accessible lead form with labelled fields',
    category: 'Conversion',
    defaultProps: { heading: 'Talk to our team', subheading: 'We reply within one business day.', fields: 'Full name\nWork email\nCompany\nMessage', button: 'Send message', note: 'We never share your details.' },
    fields: [
      { key: 'heading', label: 'Heading', kind: 'text' },
      { key: 'subheading', label: 'Subheading', kind: 'textarea' },
      { key: 'fields', label: 'Fields', kind: 'list', hint: 'One label per line. Labels containing "email" become email fields; "message" becomes a text area.' },
      { key: 'button', label: 'Button label', kind: 'text' },
      { key: 'note', label: 'Privacy note', kind: 'text' },
    ],
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    description: 'Inline email capture band',
    category: 'Conversion',
    defaultProps: { heading: 'Get the monthly briefing', subheading: 'One email a month. Unsubscribe any time.', button: 'Subscribe' },
    fields: [
      { key: 'heading', label: 'Heading', kind: 'text' },
      { key: 'subheading', label: 'Subheading', kind: 'text' },
      { key: 'button', label: 'Button label', kind: 'text' },
    ],
  },
  {
    type: 'team',
    label: 'Team Grid',
    description: 'People with role and short bio',
    category: 'Social proof',
    defaultProps: { heading: 'The people behind the work', items: 'Jordan Lee | Managing Partner | Twenty years advising growth-stage companies.\nPriya Natarajan | Head of Design | Leads brand and product design.\nMarcus Webb | Engineering Lead | Builds fast, accessible front ends.' },
    fields: [
      { key: 'heading', label: 'Heading', kind: 'text' },
      { key: 'items', label: 'People', kind: 'list', hint: 'One per line: Name | Role | Short bio' },
    ],
  },
  {
    type: 'comparison',
    label: 'Comparison Table',
    description: 'Feature-by-feature plan or competitor comparison',
    category: 'Conversion',
    defaultProps: { heading: 'Compare plans', columns: 'Starter | Pro | Team', rows: 'Projects | 1 | Unlimited | Unlimited\nCustom domain | — | ✓ | ✓\nPriority support | — | ✓ | ✓\nSSO | — | — | ✓' },
    fields: [
      { key: 'heading', label: 'Heading', kind: 'text' },
      { key: 'columns', label: 'Column headings', kind: 'text', placeholder: 'Starter | Pro | Team' },
      { key: 'rows', label: 'Rows', kind: 'list', hint: 'One per line: Feature | value | value …' },
    ],
  },
  {
    type: 'timeline',
    label: 'Process Timeline',
    description: 'Numbered steps showing how it works',
    category: 'Content',
    defaultProps: { heading: 'How we work', items: 'Discovery | We define goals, audience and success metrics.\nDesign | We prototype and test the key journeys.\nBuild | We ship in weekly increments you can review.\nLaunch | We measure, learn and iterate.' },
    fields: [
      { key: 'heading', label: 'Heading', kind: 'text' },
      { key: 'items', label: 'Steps', kind: 'list', hint: 'One per line: Step | Description' },
    ],
  },
  {
    type: 'footer',
    label: 'Footer',
    description: 'Brand, tagline, links and copyright',
    category: 'Structure',
    defaultProps: { brand: 'Acme', tagline: 'Websites, planned properly.', links: 'Privacy\nTerms\nContact', copyright: '© 2026 Acme Inc.' },
    fields: [
      { key: 'brand', label: 'Brand name', kind: 'text' },
      { key: 'tagline', label: 'Tagline', kind: 'text' },
      { key: 'links', label: 'Links', kind: 'list', hint: 'One link label per line' },
      { key: 'copyright', label: 'Copyright', kind: 'text' },
    ],
  },
];

const DEF_MAP = new Map(SECTION_DEFS.map((d) => [d.type, d]));

export function getSectionDef(type: SectionType): SectionDef | undefined {
  return DEF_MAP.get(type);
}

export function isSectionType(value: unknown): value is SectionType {
  return typeof value === 'string' && DEF_MAP.has(value as SectionType);
}

/** Splits a list field into rows, each split on `|` into trimmed cells. Empty lines are ignored. */
export function parseList(value: unknown): string[][] {
  if (typeof value !== 'string') return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split('|').map((cell) => cell.trim()));
}
