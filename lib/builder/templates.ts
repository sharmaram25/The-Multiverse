import type { SectionType, SiteTheme } from './types';

type Block = { type: SectionType; props: Record<string, unknown> };

export interface StarterTemplate {
  id: string;
  label: string;
  description: string;
  theme?: Partial<SiteTheme>;
  blocks: Block[];
}

export type PlaybookId = 'saas' | 'agency' | 'firm' | 'ecommerce' | 'portfolio';

export interface Playbook {
  id: PlaybookId;
  label: string;
  focus: string;
  recommendedUniverse: 'minimal' | 'glass' | 'neon' | 'brutalist';
  routes: string[];
  kpis: string[];
  theme: Partial<SiteTheme>;
  blocks: Block[];
}

/** Full, realistic page templates. */
export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'saas',
    label: 'SaaS Landing',
    description: 'Complete product page: hero → proof → features → pricing → FAQ',
    theme: { primary: '#4f46e5', accent: '#f43f5e', background: '#ffffff', foreground: '#0f172a', radius: 10, fontFamily: 'Inter' },
    blocks: [
      { type: 'navbar', props: { brand: 'Flowbase', links: 'Product\nPricing\nCustomers\nDocs', cta: 'Start free' } },
      { type: 'hero', props: { title: 'Build faster with confidence', subtitle: 'Launch product pages with clear structure, smooth interactions, and performance-first defaults.', align: 'center', ctaPrimary: 'Start free trial', ctaSecondary: 'Watch demo' } },
      { type: 'logos', props: { heading: 'Trusted by fast-moving teams', items: 'Northwind\nGlobex\nInitech\nUmbrella\nHooli' } },
      { type: 'features', props: { heading: 'Why teams switch', subheading: 'Everything you need to go from idea to launch.', items: 'Fast onboarding | Guide users to value in the first 30 seconds.\nTrust-focused UI | Use hierarchy and micro-feedback to reduce friction.\nBuilt to scale | Components and tokens that grow with your product.' } },
      { type: 'stats', props: { items: '2.4k | Teams onboarded\n38% | Faster launches\n99.9% | Uptime\n4.9/5 | Average rating' } },
      { type: 'testimonial', props: { quote: 'We shipped our new site in two weeks instead of two months — and conversions went up 31%.', author: 'Priya Natarajan', role: 'VP Marketing, Globex' } },
      { type: 'pricing', props: { heading: 'Simple, transparent pricing', plans: 'Starter | $0 | /month | 1 project; Community support; Basic analytics\n*Pro | $29 | /month | Unlimited projects; Priority support; Advanced analytics; Custom domain\nTeam | $99 | /month | Everything in Pro; SSO; Audit logs; Dedicated manager', cta: 'Choose plan' } },
      { type: 'faq', props: { heading: 'Frequently asked questions', items: 'Is there a free trial? | Yes — every paid plan starts with a 14-day free trial, no card required.\nCan I cancel anytime? | Absolutely. Plans are month-to-month and you can cancel in one click.\nDo you offer discounts? | Nonprofits and education teams get 50% off. Contact us for details.' } },
      { type: 'cta', props: { title: 'Start building today', subtitle: 'Free for 14 days. No credit card required.', buttonText: 'Start free trial' } },
      { type: 'footer', props: { brand: 'Flowbase', tagline: 'Ship better websites, faster.', links: 'Privacy\nTerms\nStatus\nContact', copyright: '© 2026 Flowbase Inc.' } },
    ],
  },
  {
    id: 'agency',
    label: 'Agency Site',
    description: 'Story-led homepage with proof sections',
    theme: { primary: '#0f172a', accent: '#f97316', background: '#fafaf9', foreground: '#0c0a09', radius: 4, fontFamily: 'Space Grotesk', headingScale: 1.333 },
    blocks: [
      { type: 'navbar', props: { brand: 'Studio North', links: 'Work\nServices\nProcess\nAbout', cta: 'Start a project' } },
      { type: 'hero', props: { title: 'Design that moves business', subtitle: 'A creative-first studio building brands and websites that earn attention — and keep it.', align: 'left', ctaPrimary: 'See our work', ctaSecondary: 'Book discovery call' } },
      { type: 'logos', props: { heading: 'Selected clients', items: 'Aperture\nMeridian\nVolt\nCanopy\nHalcyon' } },
      { type: 'text', props: { content: 'Selected Work', size: 'xl', align: 'left' } },
      { type: 'card', props: { title: 'Meridian Bank — rebrand & website', content: '+64% qualified leads within 90 days of launch. Show outcomes, not only visuals.', blur: 'lg' } },
      { type: 'card', props: { title: 'Volt Mobility — product launch', content: 'Launch site reached 1.2M visitors in week one with a 2.1s median load time.', blur: 'md' } },
      { type: 'testimonial', props: { quote: 'They understood our business before they opened Figma. The work speaks for itself.', author: 'Marcus Webb', role: 'CMO, Meridian' } },
      { type: 'cta', props: { title: 'Have a project in mind?', subtitle: 'We take on four new clients per quarter.', buttonText: 'Book discovery call' } },
      { type: 'footer', props: { brand: 'Studio North', tagline: 'Brand, web and product design.', links: 'Instagram\nLinkedIn\nDribbble\nContact', copyright: '© 2026 Studio North' } },
    ],
  },
  {
    id: 'firm',
    label: 'Professional Firm',
    description: 'Authority + clarity + conversion path',
    theme: { primary: '#1e3a5f', accent: '#b8860b', background: '#ffffff', foreground: '#111827', radius: 6, fontFamily: 'Serif', headingScale: 1.25 },
    blocks: [
      { type: 'navbar', props: { brand: 'Hartwell & Co.', links: 'Services\nIndustries\nTeam\nInsights', cta: 'Request consultation' } },
      { type: 'hero', props: { title: 'Trusted experts for complex work', subtitle: 'Communicate credibility with structure, clarity, and consistency.', align: 'left', ctaPrimary: 'Request consultation', ctaSecondary: 'Our services' } },
      { type: 'stats', props: { items: '35+ | Years of practice\n1,200 | Clients advised\n$4B | Transactions supported\n98% | Client retention' } },
      { type: 'features', props: { heading: 'How we help', subheading: 'Specialist advice across the full lifecycle of your business.', items: 'Clear services | Make offerings understandable in one quick scan.\nStrong proof | Use case outcomes, credentials, and testimonials.\nDirect access | Work with senior partners, not junior staff.' } },
      { type: 'testimonial', props: { quote: 'Hartwell gave us clarity at the moment we needed it most. Exceptional judgment.', author: 'Elena Duarte', role: 'CFO, Canopy Health' } },
      { type: 'cta', props: { title: 'Speak with a partner', subtitle: 'Confidential, no-obligation first consultation.', buttonText: 'Request consultation' } },
      { type: 'footer', props: { brand: 'Hartwell & Co.', tagline: 'Advisors for high-stakes decisions.', links: 'Privacy\nLegal notices\nCareers\nContact', copyright: '© 2026 Hartwell & Co. LLP' } },
    ],
  },
];

export const PLAYBOOKS: Playbook[] = [
  {
    id: 'saas',
    label: 'SaaS Growth',
    focus: 'Convert visitors to trials with clear value hierarchy.',
    recommendedUniverse: 'minimal',
    routes: ['/', '/features', '/pricing', '/docs', '/contact'],
    kpis: ['Trial conversion', 'Activation rate', 'Demo requests'],
    theme: { primary: '#4f46e5', accent: '#f43f5e', background: '#ffffff', foreground: '#0f172a', radius: 10, fontFamily: 'Inter' },
    blocks: [
      { type: 'hero', props: { title: 'Your team, 10x faster', subtitle: 'Turn complexity into simple workflows with a conversion-focused landing experience.', align: 'left', ctaPrimary: 'Start free trial', ctaSecondary: '' } },
      { type: 'feature', props: { title: 'Fast setup', desc: 'Guide users to first value in under 5 minutes.' } },
      { type: 'feature', props: { title: 'Clear pricing communication', desc: 'Reduce friction with transparent plans and comparison points.' } },
      { type: 'button', props: { text: 'Start Free Trial', variant: 'primary', size: 'lg' } },
    ],
  },
  {
    id: 'agency',
    label: 'Agency Authority',
    focus: 'Show outcomes and credibility with a narrative flow.',
    recommendedUniverse: 'glass',
    routes: ['/', '/work', '/services', '/process', '/contact'],
    kpis: ['Qualified leads', 'Proposal requests', 'Case study engagement'],
    theme: { primary: '#0f172a', accent: '#f97316', background: '#fafaf9', foreground: '#0c0a09', radius: 4, fontFamily: 'Space Grotesk' },
    blocks: [
      { type: 'hero', props: { title: 'Creative work that drives growth', subtitle: 'A story-led website blueprint for design and marketing agencies.', align: 'center', ctaPrimary: '', ctaSecondary: '' } },
      { type: 'text', props: { content: 'Featured Case Studies', size: 'xl', align: 'left' } },
      { type: 'card', props: { title: 'Revenue-focused redesign', content: 'Show measurable outcomes from your best projects.', blur: 'lg' } },
      { type: 'button', props: { text: 'Book Intro Call', variant: 'outline', size: 'default' } },
    ],
  },
  {
    id: 'firm',
    label: 'Professional Firm',
    focus: 'Communicate trust, expertise, and clear services.',
    recommendedUniverse: 'brutalist',
    routes: ['/', '/services', '/industries', '/team', '/insights', '/contact'],
    kpis: ['Consultation bookings', 'Qualified inquiry rate', 'Trust signal engagement'],
    theme: { primary: '#1e3a5f', accent: '#b8860b', background: '#ffffff', foreground: '#111827', radius: 6, fontFamily: 'Serif' },
    blocks: [
      { type: 'hero', props: { title: 'Trusted advisors for high-stakes decisions', subtitle: 'A strong, credible website foundation for firms and consultancies.', align: 'left', ctaPrimary: '', ctaSecondary: '' } },
      { type: 'feature', props: { title: 'Clear expertise map', desc: 'Make services and specialization instantly understandable.' } },
      { type: 'feature', props: { title: 'Proof-first content', desc: 'Use outcomes, credentials, and testimonials to build confidence.' } },
      { type: 'button', props: { text: 'Request Consultation', variant: 'primary', size: 'lg' } },
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-commerce Launch',
    focus: 'Drive product discovery and checkout confidence.',
    recommendedUniverse: 'neon',
    routes: ['/', '/shop', '/product/[slug]', '/cart', '/faq'],
    kpis: ['Add-to-cart rate', 'Checkout completion', 'AOV'],
    theme: { primary: '#db2777', accent: '#7c3aed', background: '#ffffff', foreground: '#18181b', radius: 14, fontFamily: 'Inter' },
    blocks: [
      { type: 'hero', props: { title: 'Products designed to stand out', subtitle: 'Build a high-intent shopping journey with speed and clarity.', align: 'center', ctaPrimary: 'Shop now', ctaSecondary: '' } },
      { type: 'card', props: { title: 'Top Product Highlight', content: 'Combine social proof and urgency near your hero CTA.', blur: 'md' } },
      { type: 'feature', props: { title: 'Trust at checkout', desc: 'Surface delivery, returns, and guarantee details early.' } },
      { type: 'button', props: { text: 'Shop Now', variant: 'primary', size: 'lg' } },
    ],
  },
  {
    id: 'portfolio',
    label: 'Portfolio Identity',
    focus: 'Show craft depth and distinct personal voice.',
    recommendedUniverse: 'glass',
    routes: ['/', '/projects', '/about', '/process', '/contact'],
    kpis: ['Project views', 'Contact conversions', 'Time on work pages'],
    theme: { primary: '#0d9488', accent: '#f59e0b', background: '#fcfcfc', foreground: '#111111', radius: 16, fontFamily: 'Space Grotesk' },
    blocks: [
      { type: 'hero', props: { title: 'Crafting experiences that feel alive', subtitle: 'A portfolio layout that balances storytelling and clear action.', align: 'center', ctaPrimary: '', ctaSecondary: '' } },
      { type: 'text', props: { content: 'Selected Projects', size: 'xl', align: 'left' } },
      { type: 'card', props: { title: 'Featured Build', content: 'Highlight process, challenge, and measurable impact.', blur: 'lg' } },
      { type: 'button', props: { text: 'Start a Project', variant: 'outline', size: 'default' } },
    ],
  },
];
