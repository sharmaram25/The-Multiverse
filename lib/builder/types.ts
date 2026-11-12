export type SectionType =
  | 'navbar'
  | 'hero'
  | 'logos'
  | 'feature'
  | 'features'
  | 'stats'
  | 'testimonial'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'text'
  | 'card'
  | 'button'
  | 'footer'
  | 'contact'
  | 'team'
  | 'comparison'
  | 'newsletter'
  | 'timeline';

/** Kept as `BuilderComponent` for compatibility with v1 JSON blueprints. */
export interface BuilderComponent {
  id: string;
  type: SectionType;
  props: Record<string, unknown>;
}

export interface SiteTheme {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  radius: number;
  fontFamily: string;
  headingScale: number;
}

export interface BuilderProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  sections: BuilderComponent[];
  theme: SiteTheme;
  /** Free-form notes that travel with the blueprint (goals, audience, open questions). */
  notes?: string;
  /** Page-level metadata written into the exported document head. */
  seo?: PageSeo;
}

export interface PageSeo {
  title?: string;
  description?: string;
  ogImage?: string;
  lang?: string;
}

export type FieldKind = 'text' | 'textarea' | 'select' | 'list';

export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  options?: string[];
  /** Shown under list fields to explain the line format. */
  hint?: string;
  placeholder?: string;
}

export interface SectionDef {
  type: SectionType;
  label: string;
  description: string;
  category: 'Structure' | 'Content' | 'Conversion' | 'Social proof' | 'Basic';
  defaultProps: Record<string, unknown>;
  fields: FieldDef[];
}
