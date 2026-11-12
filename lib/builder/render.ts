/**
 * Single source of truth for builder output.
 * The canvas preview and every export use these functions, so what you see
 * is exactly what you ship. All user text is HTML-escaped.
 */
import { contrastRatio, ensureContrast, mix, normalizeHex, readableOn } from '@/lib/color';
import { fontStack, typeScale } from '@/lib/tokens-export';
import { parseList } from './sections';
import type { BuilderComponent, PageSeo, SiteTheme } from './types';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const str = (props: Record<string, unknown>, key: string, fallback = ''): string => {
  const v = props[key];
  return typeof v === 'string' ? v : fallback;
};

const pick = <T extends string>(value: string, allowed: readonly T[], fallback: T): T =>
  (allowed as readonly string[]).includes(value) ? (value as T) : fallback;

const CHECK_SVG = '<svg class="mv-check" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"/></svg>';
const BOLT_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>';

function paragraphs(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

/** Renders one section to an HTML string. */
export function renderSection(section: BuilderComponent): string {
  const p = section.props;
  const e = escapeHtml;

  switch (section.type) {
    case 'navbar': {
      const links = parseList(p.links).map(([label]) => `<a href="#">${e(label)}</a>`).join('');
      const cta = str(p, 'cta');
      return `<header class="mv-nav"><div class="mv-container mv-nav-inner"><a class="mv-brand" href="#">${e(str(p, 'brand', 'Brand'))}</a><nav class="mv-nav-links" aria-label="Main">${links}</nav>${cta ? `<a class="mv-btn mv-btn-primary mv-btn-sm" href="#">${e(cta)}</a>` : ''}</div></header>`;
    }
    case 'hero': {
      const align = pick(str(p, 'align', 'left'), ['left', 'center', 'right'] as const, 'left');
      const primary = str(p, 'ctaPrimary');
      const secondary = str(p, 'ctaSecondary');
      const actions = primary || secondary
        ? `<div class="mv-actions">${primary ? `<a class="mv-btn mv-btn-primary mv-btn-lg" href="#">${e(primary)}</a>` : ''}${secondary ? `<a class="mv-btn mv-btn-outline mv-btn-lg" href="#">${e(secondary)}</a>` : ''}</div>`
        : '';
      return `<section class="mv-section mv-hero mv-align-${align}"><div class="mv-container"><h1 class="mv-h1">${e(str(p, 'title', 'Untitled hero'))}</h1><p class="mv-lead">${e(str(p, 'subtitle'))}</p>${actions}</div></section>`;
    }
    case 'logos': {
      const items = parseList(p.items).map(([name]) => `<span class="mv-logo">${e(name)}</span>`).join('');
      return `<section class="mv-section mv-section-tight"><div class="mv-container"><p class="mv-eyebrow mv-align-center">${e(str(p, 'heading'))}</p><div class="mv-logos">${items}</div></div></section>`;
    }
    case 'feature': {
      return `<section class="mv-section mv-section-tight"><div class="mv-container"><div class="mv-card mv-feature"><div class="mv-icon">${BOLT_SVG}</div><div><h3 class="mv-h3">${e(str(p, 'title', 'Feature'))}</h3><p class="mv-muted">${e(str(p, 'desc'))}</p></div></div></div></section>`;
    }
    case 'features': {
      const items = parseList(p.items)
        .map(([title, desc = '']) => `<div class="mv-card"><div class="mv-icon">${BOLT_SVG}</div><h3 class="mv-h3">${e(title)}</h3><p class="mv-muted">${e(desc)}</p></div>`)
        .join('');
      const sub = str(p, 'subheading');
      return `<section class="mv-section"><div class="mv-container"><div class="mv-section-head mv-align-center"><h2 class="mv-h2">${e(str(p, 'heading'))}</h2>${sub ? `<p class="mv-lead">${e(sub)}</p>` : ''}</div><div class="mv-grid mv-grid-3">${items}</div></div></section>`;
    }
    case 'stats': {
      const items = parseList(p.items)
        .map(([value, label = '']) => `<div class="mv-stat"><div class="mv-stat-value">${e(value)}</div><div class="mv-muted">${e(label)}</div></div>`)
        .join('');
      return `<section class="mv-section mv-section-tight mv-band"><div class="mv-container"><div class="mv-grid mv-grid-4">${items}</div></div></section>`;
    }
    case 'testimonial': {
      const role = str(p, 'role');
      return `<section class="mv-section"><div class="mv-container mv-narrow"><figure class="mv-quote"><blockquote>&ldquo;${e(str(p, 'quote'))}&rdquo;</blockquote><figcaption><strong>${e(str(p, 'author'))}</strong>${role ? `<span class="mv-muted">${e(role)}</span>` : ''}</figcaption></figure></div></section>`;
    }
    case 'pricing': {
      const cta = str(p, 'cta', 'Choose plan');
      const plans = parseList(p.plans)
        .map(([rawName = '', price = '', period = '', features = '']) => {
          const featured = rawName.startsWith('*');
          const name = featured ? rawName.slice(1).trim() : rawName;
          const list = features.split(';').map((f) => f.trim()).filter(Boolean).map((f) => `<li>${CHECK_SVG}<span>${e(f)}</span></li>`).join('');
          return `<div class="mv-card mv-plan${featured ? ' mv-plan-featured' : ''}">${featured ? '<span class="mv-badge">Most popular</span>' : ''}<h3 class="mv-h3">${e(name)}</h3><div class="mv-price"><span class="mv-price-value">${e(price)}</span><span class="mv-muted">${e(period)}</span></div><ul class="mv-list">${list}</ul><a class="mv-btn ${featured ? 'mv-btn-primary' : 'mv-btn-outline'} mv-btn-block" href="#">${e(cta)}</a></div>`;
        })
        .join('');
      return `<section class="mv-section"><div class="mv-container"><div class="mv-section-head mv-align-center"><h2 class="mv-h2">${e(str(p, 'heading'))}</h2></div><div class="mv-grid mv-grid-3 mv-grid-start">${plans}</div></div></section>`;
    }
    case 'faq': {
      const items = parseList(p.items)
        .map(([q, a = '']) => `<details class="mv-faq"><summary>${e(q)}</summary><p class="mv-muted">${e(a)}</p></details>`)
        .join('');
      return `<section class="mv-section"><div class="mv-container mv-narrow"><h2 class="mv-h2 mv-align-center">${e(str(p, 'heading'))}</h2><div class="mv-faq-list">${items}</div></div></section>`;
    }
    case 'cta': {
      const btn = str(p, 'buttonText');
      return `<section class="mv-section"><div class="mv-container"><div class="mv-cta"><h2 class="mv-h2">${e(str(p, 'title'))}</h2><p class="mv-lead">${e(str(p, 'subtitle'))}</p>${btn ? `<a class="mv-btn mv-btn-inverse mv-btn-lg" href="#">${e(btn)}</a>` : ''}</div></div></section>`;
    }
    case 'text': {
      const size = pick(str(p, 'size', 'base'), ['sm', 'base', 'lg', 'xl'] as const, 'base');
      const align = pick(str(p, 'align', 'left'), ['left', 'center', 'right'] as const, 'left');
      return `<section class="mv-section mv-section-tight"><div class="mv-container mv-text mv-text-${size} mv-align-${align}">${paragraphs(str(p, 'content'))}</div></section>`;
    }
    case 'card': {
      const emphasis = pick(str(p, 'blur', 'md'), ['sm', 'md', 'lg'] as const, 'md');
      return `<section class="mv-section mv-section-tight"><div class="mv-container"><div class="mv-card mv-highlight mv-highlight-${emphasis}"><h3 class="mv-h3">${e(str(p, 'title'))}</h3><p class="mv-muted">${e(str(p, 'content'))}</p></div></div></section>`;
    }
    case 'button': {
      const variant = pick(str(p, 'variant', 'primary'), ['primary', 'outline'] as const, 'primary');
      const size = pick(str(p, 'size', 'default'), ['sm', 'default', 'lg', 'xl'] as const, 'default');
      return `<div class="mv-container mv-section-tight"><a class="mv-btn mv-btn-${variant} mv-btn-${size}" href="#">${e(str(p, 'text', 'Button'))}</a></div>`;
    }
    case 'contact': {
      const fields = parseList(p.fields).map(([label], i) => {
        const id = `f-${section.id}-${i}`;
        const lower = label.toLowerCase();
        const control = lower.includes('message')
          ? `<textarea id="${id}" name="${e(lower.replace(/\W+/g, '-'))}" rows="4"></textarea>`
          : `<input id="${id}" name="${e(lower.replace(/\W+/g, '-'))}" type="${lower.includes('email') ? 'email' : 'text'}"${lower.includes('email') ? ' autocomplete="email"' : lower.includes('name') ? ' autocomplete="name"' : ''} />`;
        return `<div class="mv-field${lower.includes('message') ? ' mv-field-wide' : ''}"><label for="${id}">${e(label)}</label>${control}</div>`;
      }).join('');
      const note = str(p, 'note');
      return `<section class="mv-section"><div class="mv-container mv-narrow"><div class="mv-section-head mv-align-center"><h2 class="mv-h2">${e(str(p, 'heading'))}</h2><p class="mv-lead">${e(str(p, 'subheading'))}</p></div><form class="mv-card mv-form" onsubmit="return false"><div class="mv-form-grid">${fields}</div><button class="mv-btn mv-btn-primary mv-btn-lg mv-btn-block" type="submit">${e(str(p, 'button', 'Send'))}</button>${note ? `<p class="mv-muted mv-form-note">${e(note)}</p>` : ''}</form></div></section>`;
    }
    case 'newsletter': {
      const id = `nl-${section.id}`;
      return `<section class="mv-section mv-section-tight"><div class="mv-container"><div class="mv-newsletter"><div><h2 class="mv-h3">${e(str(p, 'heading'))}</h2><p class="mv-muted">${e(str(p, 'subheading'))}</p></div><form class="mv-inline-form" onsubmit="return false"><label class="mv-sr-only" for="${id}">Email address</label><input id="${id}" type="email" autocomplete="email" placeholder="you@company.com" /><button class="mv-btn mv-btn-primary mv-btn-default" type="submit">${e(str(p, 'button', 'Subscribe'))}</button></form></div></div></section>`;
    }
    case 'team': {
      const items = parseList(p.items).map(([name = '', role = '', bio = '']) => {
        const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
        return `<div class="mv-card mv-person"><div class="mv-avatar" aria-hidden="true">${e(initials)}</div><h3 class="mv-h3">${e(name)}</h3><p class="mv-role">${e(role)}</p><p class="mv-muted">${e(bio)}</p></div>`;
      }).join('');
      return `<section class="mv-section"><div class="mv-container"><div class="mv-section-head mv-align-center"><h2 class="mv-h2">${e(str(p, 'heading'))}</h2></div><div class="mv-grid mv-grid-3">${items}</div></div></section>`;
    }
    case 'comparison': {
      const cols = str(p, 'columns').split('|').map((c) => c.trim()).filter(Boolean);
      const head = `<tr><th scope="col"><span class="mv-sr-only">Feature</span></th>${cols.map((c) => `<th scope="col">${e(c)}</th>`).join('')}</tr>`;
      const rows = parseList(p.rows).map(([feature = '', ...vals]) => `<tr><th scope="row">${e(feature)}</th>${cols.map((_, i) => `<td>${e(vals[i] ?? '')}</td>`).join('')}</tr>`).join('');
      return `<section class="mv-section"><div class="mv-container"><div class="mv-section-head mv-align-center"><h2 class="mv-h2">${e(str(p, 'heading'))}</h2></div><div class="mv-table-wrap"><table class="mv-table"><thead>${head}</thead><tbody>${rows}</tbody></table></div></div></section>`;
    }
    case 'timeline': {
      const items = parseList(p.items).map(([title = '', desc = ''], i) => `<li class="mv-step"><span class="mv-step-num">${String(i + 1).padStart(2, '0')}</span><div><h3 class="mv-h3">${e(title)}</h3><p class="mv-muted">${e(desc)}</p></div></li>`).join('');
      return `<section class="mv-section"><div class="mv-container mv-narrow"><h2 class="mv-h2 mv-align-center">${e(str(p, 'heading'))}</h2><ol class="mv-steps">${items}</ol></div></section>`;
    }
    case 'footer': {
      const links = parseList(p.links).map(([label]) => `<a href="#">${e(label)}</a>`).join('');
      return `<footer class="mv-footer"><div class="mv-container mv-footer-inner"><div><div class="mv-brand">${e(str(p, 'brand'))}</div><p class="mv-muted">${e(str(p, 'tagline'))}</p></div><nav class="mv-footer-links" aria-label="Footer">${links}</nav></div><div class="mv-container mv-copyright mv-muted">${e(str(p, 'copyright'))}</div></footer>`;
    }
    default:
      return '';
  }
}

/** Resolves a full set of CSS variables (with derived, contrast-safe colors) from a site theme. */
export function themeVariables(theme: SiteTheme): Record<string, string> {
  const bg = normalizeHex(theme.background) ?? '#ffffff';
  const fgRaw = normalizeHex(theme.foreground) ?? '#111111';
  const fg = ensureContrast(fgRaw, bg, 7);
  const primary = normalizeHex(theme.primary) ?? '#4f46e5';
  const accent = normalizeHex(theme.accent) ?? primary;
  const scale = typeScale(16, theme.headingScale);
  return {
    '--mv-bg': bg,
    '--mv-fg': fg,
    '--mv-primary': primary,
    '--mv-primary-fg': readableOn(primary),
    '--mv-primary-text': ensureContrast(primary, bg, 4.5),
    '--mv-accent': accent,
    '--mv-muted-bg': mix(bg, fg, 0.04),
    '--mv-muted': ensureContrast(mix(fg, bg, 0.38), bg, 4.5),
    '--mv-border': mix(bg, fg, 0.12),
    '--mv-radius': `${Math.max(0, Math.min(48, theme.radius))}px`,
    '--mv-font': fontStack(theme.fontFamily),
    '--mv-h1': `${scale.h1}px`,
    '--mv-h2': `${scale.h2}px`,
    '--mv-h3': `${Math.max(18, scale.h4)}px`,
  };
}

export interface AccessibilityIssue {
  severity: 'error' | 'warning';
  message: string;
}

/** Quick automated checks so the exported page starts from a sound baseline. */
export function auditProject(sections: BuilderComponent[], theme: SiteTheme, seo?: PageSeo): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  if (sections.length > 0 && !seo?.description?.trim()) issues.push({ severity: 'warning', message: 'No meta description — search engines will pick arbitrary page text. Add one in Page settings.' });
  if ((seo?.title?.length ?? 0) > 60) issues.push({ severity: 'warning', message: 'Page title is over 60 characters and will be truncated in search results.' });
  if ((seo?.description?.length ?? 0) > 160) issues.push({ severity: 'warning', message: 'Meta description is over 160 characters and will be truncated.' });
  const bodyRatio = contrastRatio(theme.foreground, theme.background) ?? 21;
  if (bodyRatio < 4.5) issues.push({ severity: 'error', message: `Body text contrast is ${bodyRatio.toFixed(2)}:1 — WCAG AA needs 4.5:1. Export will auto-correct it.` });
  const btnRatio = contrastRatio(theme.primary, readableOn(theme.primary)) ?? 21;
  if (btnRatio < 4.5) issues.push({ severity: 'warning', message: `Primary button label contrast is ${btnRatio.toFixed(2)}:1 — consider a deeper primary color.` });
  const h1Count = sections.filter((s) => s.type === 'hero').length;
  if (sections.length > 0 && h1Count === 0) issues.push({ severity: 'warning', message: 'No hero section — the page has no <h1> heading, which hurts SEO and screen-reader navigation.' });
  if (h1Count > 1) issues.push({ severity: 'warning', message: `${h1Count} hero sections produce multiple <h1> headings. Keep one per page.` });
  if (sections.length > 0 && !sections.some((s) => s.type === 'cta' || s.type === 'button' || (s.type === 'hero' && str(s.props, 'ctaPrimary')))) {
    issues.push({ severity: 'warning', message: 'No call to action found — visitors have no clear next step.' });
  }
  for (const s of sections) {
    if (s.type === 'hero' && str(s.props, 'title').length > 80) issues.push({ severity: 'warning', message: 'Hero headline is over 80 characters — shorter headlines scan and convert better.' });
  }
  return issues;
}

/** Scoped stylesheet. Uses container queries so device previews match real breakpoints. */
export const SITE_CSS = `
.mv-site{container-type:inline-size;background:var(--mv-bg);color:var(--mv-fg);font-family:var(--mv-font);line-height:1.6;-webkit-font-smoothing:antialiased;text-align:left}
.mv-site *,.mv-site *::before,.mv-site *::after{box-sizing:border-box}
.mv-site h1,.mv-site h2,.mv-site h3,.mv-site p,.mv-site figure,.mv-site blockquote,.mv-site ul{margin:0;padding:0}
.mv-site a{color:inherit;text-decoration:none}
.mv-site a:focus-visible,.mv-site summary:focus-visible{outline:2px solid var(--mv-primary);outline-offset:3px;border-radius:4px}
.mv-site .mv-container{width:100%;max-width:1120px;margin:0 auto;padding:0 24px}
.mv-site .mv-narrow{max-width:760px}
.mv-site .mv-section{padding:88px 0}
.mv-site .mv-section-tight{padding:40px 0}
.mv-site .mv-band{background:var(--mv-muted-bg);border-top:1px solid var(--mv-border);border-bottom:1px solid var(--mv-border)}
.mv-site .mv-align-left{text-align:left}
.mv-site .mv-align-center{text-align:center}
.mv-site .mv-align-right{text-align:right}
.mv-site .mv-h1{font-size:var(--mv-h1);line-height:1.05;letter-spacing:-0.03em;font-weight:800;margin-bottom:20px}
.mv-site .mv-h2{font-size:var(--mv-h2);line-height:1.15;letter-spacing:-0.02em;font-weight:750;margin-bottom:14px}
.mv-site .mv-h3{font-size:var(--mv-h3);line-height:1.3;font-weight:700;margin-bottom:8px}
.mv-site .mv-lead{font-size:1.2rem;color:var(--mv-muted);max-width:680px}
.mv-site .mv-align-center .mv-lead,.mv-site .mv-align-center.mv-lead{margin-left:auto;margin-right:auto}
.mv-site .mv-align-right .mv-lead{margin-left:auto}
.mv-site .mv-muted{color:var(--mv-muted)}
.mv-site .mv-eyebrow{font-size:.8rem;text-transform:uppercase;letter-spacing:.14em;font-weight:600;color:var(--mv-muted);margin-bottom:20px}
.mv-site .mv-section-head{margin-bottom:48px}
.mv-site .mv-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
.mv-site .mv-align-center .mv-actions{justify-content:center}
.mv-site .mv-align-right .mv-actions{justify-content:flex-end}
.mv-site .mv-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:600;border-radius:var(--mv-radius);border:1px solid transparent;transition:transform .15s ease,box-shadow .15s ease,background .15s ease;cursor:pointer;white-space:nowrap}
.mv-site .mv-btn:hover{transform:translateY(-1px)}
.mv-site .mv-btn-primary{background:var(--mv-primary);color:var(--mv-primary-fg);box-shadow:0 6px 20px -8px var(--mv-primary)}
.mv-site .mv-btn-outline{background:transparent;color:var(--mv-fg);border-color:var(--mv-border)}
.mv-site .mv-btn-outline:hover{border-color:var(--mv-fg)}
.mv-site .mv-btn-inverse{background:var(--mv-primary-fg);color:var(--mv-primary)}
.mv-site .mv-btn-sm{height:36px;padding:0 14px;font-size:.85rem}
.mv-site .mv-btn-default{height:42px;padding:0 18px;font-size:.95rem}
.mv-site .mv-btn-lg{height:50px;padding:0 26px;font-size:1rem}
.mv-site .mv-btn-xl{height:58px;padding:0 34px;font-size:1.1rem}
.mv-site .mv-btn-block{width:100%;height:46px;margin-top:auto}
.mv-site .mv-nav{border-bottom:1px solid var(--mv-border);background:var(--mv-bg)}
.mv-site .mv-nav-inner{display:flex;align-items:center;gap:32px;height:68px}
.mv-site .mv-brand{font-weight:800;font-size:1.2rem;letter-spacing:-0.02em}
.mv-site .mv-nav-links{display:flex;gap:24px;margin-right:auto;font-size:.95rem;color:var(--mv-muted)}
.mv-site .mv-nav-links a:hover{color:var(--mv-fg)}
.mv-site .mv-hero{padding:120px 0 104px;background:radial-gradient(ellipse 80% 60% at 50% 0%,color-mix(in srgb,var(--mv-primary) 14%,transparent),transparent)}
.mv-site .mv-logos{display:flex;flex-wrap:wrap;justify-content:center;gap:16px 48px}
.mv-site .mv-logo{font-weight:800;font-size:1.25rem;letter-spacing:-0.02em;color:var(--mv-muted);opacity:.85}
.mv-site .mv-grid{display:grid;gap:24px}
.mv-site .mv-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.mv-site .mv-grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}
.mv-site .mv-grid-start{align-items:stretch}
.mv-site .mv-card{background:var(--mv-bg);border:1px solid var(--mv-border);border-radius:calc(var(--mv-radius) * 1.5);padding:28px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.mv-site .mv-feature{display:flex;gap:20px;align-items:flex-start}
.mv-site .mv-icon{width:44px;height:44px;border-radius:var(--mv-radius);display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--mv-primary) 12%,transparent);color:var(--mv-primary-text);margin-bottom:16px;flex-shrink:0}
.mv-site .mv-feature .mv-icon{margin-bottom:0}
.mv-site .mv-stat{text-align:center}
.mv-site .mv-stat-value{font-size:2.4rem;font-weight:800;letter-spacing:-0.03em;line-height:1.1;color:var(--mv-primary-text)}
.mv-site .mv-quote{text-align:center}
.mv-site .mv-quote blockquote{font-size:1.6rem;line-height:1.4;font-weight:600;letter-spacing:-0.01em;margin-bottom:24px}
.mv-site .mv-quote figcaption{display:flex;flex-direction:column;gap:2px}
.mv-site .mv-plan{display:flex;flex-direction:column;position:relative}
.mv-site .mv-plan-featured{border:2px solid var(--mv-primary);box-shadow:0 20px 40px -20px var(--mv-primary)}
.mv-site .mv-badge{position:absolute;top:-12px;left:28px;background:var(--mv-primary);color:var(--mv-primary-fg);font-size:.72rem;font-weight:700;padding:4px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.06em}
.mv-site .mv-price{display:flex;align-items:baseline;gap:6px;margin:8px 0 20px}
.mv-site .mv-price-value{font-size:2.6rem;font-weight:800;letter-spacing:-0.03em}
.mv-site .mv-list{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
.mv-site .mv-list li{display:flex;gap:10px;align-items:flex-start}
.mv-site .mv-check{color:var(--mv-primary-text);flex-shrink:0;margin-top:4px}
.mv-site .mv-faq-list{margin-top:32px;border-top:1px solid var(--mv-border)}
.mv-site .mv-faq{border-bottom:1px solid var(--mv-border);padding:20px 0}
.mv-site .mv-faq summary{cursor:pointer;font-weight:600;font-size:1.05rem;list-style:none;display:flex;justify-content:space-between;gap:16px}
.mv-site .mv-faq summary::-webkit-details-marker{display:none}
.mv-site .mv-faq summary::after{content:'+';font-size:1.4rem;line-height:1;color:var(--mv-muted)}
.mv-site .mv-faq[open] summary::after{content:'\\2212'}
.mv-site .mv-faq p{margin-top:12px}
.mv-site .mv-cta{background:var(--mv-primary);color:var(--mv-primary-fg);border-radius:calc(var(--mv-radius) * 2);padding:64px 32px;text-align:center}
.mv-site .mv-cta .mv-lead{color:inherit;opacity:.85;margin:0 auto 28px}
.mv-site .mv-text p+p{margin-top:1em}
.mv-site .mv-text-sm{font-size:.9rem}
.mv-site .mv-text-base{font-size:1rem}
.mv-site .mv-text-lg{font-size:1.2rem}
.mv-site .mv-text-xl{font-size:1.75rem;font-weight:700;letter-spacing:-0.02em;line-height:1.3}
.mv-site .mv-highlight{background:linear-gradient(135deg,color-mix(in srgb,var(--mv-primary) 6%,var(--mv-bg)),var(--mv-bg))}
.mv-site .mv-highlight-lg{border-color:color-mix(in srgb,var(--mv-primary) 45%,var(--mv-border));box-shadow:0 20px 40px -24px var(--mv-primary)}
.mv-site .mv-highlight-sm{box-shadow:none}
.mv-site .mv-footer{border-top:1px solid var(--mv-border);padding:48px 0 32px;margin-top:40px}
.mv-site .mv-footer-inner{display:flex;justify-content:space-between;gap:32px;flex-wrap:wrap}
.mv-site .mv-footer-links{display:flex;gap:24px;color:var(--mv-muted)}
.mv-site .mv-footer-links a:hover{color:var(--mv-fg)}
.mv-site .mv-copyright{margin-top:32px;font-size:.85rem}
.mv-site .mv-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.mv-site .mv-form{display:flex;flex-direction:column;gap:20px}
.mv-site .mv-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.mv-site .mv-field{display:flex;flex-direction:column;gap:6px}
.mv-site .mv-field-wide{grid-column:1/-1}
.mv-site .mv-field label{font-size:.9rem;font-weight:600}
.mv-site input,.mv-site textarea{font:inherit;color:var(--mv-fg);background:var(--mv-bg);border:1px solid var(--mv-border);border-radius:var(--mv-radius);padding:11px 13px;width:100%}
.mv-site input:focus-visible,.mv-site textarea:focus-visible{outline:2px solid var(--mv-primary);outline-offset:1px}
.mv-site .mv-form-note{font-size:.85rem;text-align:center}
.mv-site .mv-newsletter{display:flex;align-items:center;justify-content:space-between;gap:32px;padding:32px;border:1px solid var(--mv-border);border-radius:calc(var(--mv-radius) * 1.5);background:var(--mv-muted-bg)}
.mv-site .mv-inline-form{display:flex;gap:10px;min-width:360px}
.mv-site .mv-person{text-align:center}
.mv-site .mv-avatar{width:64px;height:64px;border-radius:999px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-weight:700;background:var(--mv-primary);color:var(--mv-primary-fg)}
.mv-site .mv-role{color:var(--mv-primary-text);font-weight:600;font-size:.9rem;margin-bottom:8px}
.mv-site .mv-table-wrap{overflow-x:auto;border:1px solid var(--mv-border);border-radius:calc(var(--mv-radius) * 1.5)}
.mv-site .mv-table{width:100%;border-collapse:collapse;font-size:.95rem}
.mv-site .mv-table th,.mv-site .mv-table td{padding:14px 18px;border-bottom:1px solid var(--mv-border);text-align:center}
.mv-site .mv-table thead th{background:var(--mv-muted-bg);font-weight:700}
.mv-site .mv-table tbody th{text-align:left;font-weight:600}
.mv-site .mv-table tbody tr:last-child th,.mv-site .mv-table tbody tr:last-child td{border-bottom:0}
.mv-site .mv-steps{list-style:none;margin:40px 0 0;padding:0;display:flex;flex-direction:column;gap:0;border-left:2px solid var(--mv-border)}
.mv-site .mv-step{display:flex;gap:20px;padding:0 0 32px 28px;position:relative}
.mv-site .mv-step-num{position:absolute;left:-17px;top:0;width:32px;height:32px;border-radius:999px;background:var(--mv-bg);border:2px solid var(--mv-primary);color:var(--mv-primary-text);font-size:.75rem;font-weight:700;display:flex;align-items:center;justify-content:center}
@container (max-width: 900px){
  .mv-site .mv-grid-3{grid-template-columns:repeat(2,minmax(0,1fr))}
  .mv-site .mv-nav-links{display:none}
  .mv-site .mv-nav-inner{justify-content:space-between}
}
@container (max-width: 640px){
  .mv-site .mv-section{padding:56px 0}
  .mv-site .mv-hero{padding:72px 0 64px}
  .mv-site .mv-container{padding:0 18px}
  .mv-site .mv-h1{font-size:calc(var(--mv-h1) * 0.62)}
  .mv-site .mv-h2{font-size:calc(var(--mv-h2) * 0.72)}
  .mv-site .mv-lead{font-size:1.05rem}
  .mv-site .mv-grid-3,.mv-site .mv-grid-4{grid-template-columns:minmax(0,1fr)}
  .mv-site .mv-grid-4{grid-template-columns:repeat(2,minmax(0,1fr))}
  .mv-site .mv-actions{flex-direction:column;align-items:stretch}
  .mv-site .mv-quote blockquote{font-size:1.25rem}
  .mv-site .mv-cta{padding:44px 20px}
  .mv-site .mv-feature{flex-direction:column}
  .mv-site .mv-form-grid{grid-template-columns:minmax(0,1fr)}
  .mv-site .mv-newsletter{flex-direction:column;align-items:stretch}
  .mv-site .mv-inline-form{min-width:0;flex-direction:column}
}
@media (prefers-reduced-motion: reduce){.mv-site .mv-btn{transition:none}.mv-site .mv-btn:hover{transform:none}}
`;
