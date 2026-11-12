# The Multiverse

**A website planning workspace.** Compose pages, define design tokens, verify accessibility and export production-ready code — before production code is written.

Everything runs in the browser. There is no account, no backend and nothing is uploaded; work is saved locally and leaves the browser only when you export it.

## What you can do

| Tool | Route | What it produces |
| --- | --- | --- |
| **Project Brief** | `/brief` | Discovery questions → a written brief, sitemap, transparent effort estimate and recommended stack. Sends routes and KPIs to Launch Studio and starts the Builder from the matching template. |
| **Sitemap Planner** | `/multiverse-map` | Editable page hierarchy with a live diagram. Imports from Launch Studio; exports **sitemap.xml**, a Markdown outline and JSON. |
| **UI Builder** | `/builder` | Pages from 19 section types and 3 complete templates. Drag to reorder, undo/redo, device previews, page SEO settings with a search preview, live accessibility checks. Exports **standalone HTML**, a **React component + CSS**, a **JSON blueprint** and a **Markdown brief**. |
| **Design Playground** | `/playground` | Tokens with a token-scoped preview, a palette generator that guarantees WCAG AA, one-click contrast fixes, and exports for **CSS, Tailwind v4/v3, W3C Design Tokens and SCSS**. Shareable links. |
| **Launch Studio** | `/launch-studio` | Editable routes and KPIs plus a categorized launch checklist. Markdown export. |
| **Copy Lab** | `/fresh-lab` | Headline analyzer, readability (Flesch, grade, passive voice), value-proposition builder, CTA checker and page-narrative planner. |
| **Component Generator** | `/sandbox` | Button, badge, alert, input and card configured with any brand colour; exports HTML + CSS, Tailwind or React. |
| **Design System** | `/design-system` | Live documentation of the active universe: tokens, measured contrast, type, spacing, components and a contrast checker. |
| **Performance** | `/performance` | Real Core Web Vitals and runtime metrics from the browser's Performance APIs. |
| **Motion Lab** | `/motion-lab` | Workbenches for easing, spring physics (with CSS `linear()` export), scroll reveal, text reveal, parallax, hover/press, magnetic and marquee. |
| **Interactions** | `/interaction-playground` | Sortable list, drag and throw, swipe to dismiss, 3D tilt, spotlight and proximity grid. |
| **Micro-interactions** | `/micro-interactions` | Async button, toast manager, inline validation, loaders and skeletons, switch, number ticker, copy and favourite. |
| **Effects** | `/experimental` | Mesh gradients, grain, patterns, frosted glass, aurora and an on-demand WebGL particle field — all as CSS where possible. |
| **Theme Lab / Parallel Universes** | `/theme-lab`, `/parallel-universes` | Real interfaces rendered in two or four universes at once, with a wipe comparison. |
| **Scroll Story** | `/story` | Editable scroll-driven narrative exported as a standalone page using CSS scroll-driven animations. |
| **Time Travel** | `/time-travel` | Your page rebuilt live in six eras of web design, with era load times on period connections. |

Every lab workbench lets you tune values, replay the result and copy production code.

Press **Ctrl/⌘ + K** anywhere to open the command palette.

## Universes

Four complete visual systems — each with its own typography, surfaces, depth, background and interaction, not just colors.

| Universe | Character | Type |
| --- | --- | --- |
| Minimal (default) | Editorial restraint — hairline structure, no decoration | Geist |
| Glass | Translucent depth — lit surface edges, slow ambient aurora | Inter |
| Neon | Luminous signal — technical grid, mono labels, glowing edges | Space Grotesk + JetBrains Mono |
| Brutalist | Raw structure — uppercase grotesk, hard offset shadows | Space Grotesk |

Switch with the nav, the floating switcher, the home page strip, or a link: any URL accepts `?universe=glass`.

Every text pair in every universe meets **WCAG 2.2 AA** (most meet AAA). Palettes live in `app/globals.css`; identity rules follow them in the same file.

## Getting started

Requires Node.js 18.18+ and npm 9+.

```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run lint
```

`npm run build` type-checks strictly and fails on type errors.

## Deploying

The site is a static export (`output: 'export'`). Deploy the `out/` folder to any static host. `netlify.toml` is included with security headers (CSP, frame and referrer policies) and long-lived caching for hashed assets; unknown routes fall back to the generated `404.html`.

## Architecture

```text
app/
  (main)/            Product routes (shared nav, footer, universe switcher)
  (secret)/          Hidden universe (unlocked by exploring)
  globals.css        Universe palettes, identities, component materials
components/
  builder/           Builder canvas, sidebar, inspector
  playground/        Token export panel
  docs/              Documentation building blocks
  ui/                Button, Card, Input, Badge, Modal, Tabs
lib/
  builder/           Section schema, renderer, exporters, project store
  color.ts           WCAG contrast, tonal scales, contrast correction
  tokens-export.ts   Token exporters and share-link encoding
  universes.ts       Universe specifications
  site-map.ts        Navigation and command palette source
```

Key decisions:

- **One renderer for preview and export.** `lib/builder/render.ts` produces the HTML shown on the Builder canvas and in every export, so what you see is what you ship. All user text is escaped.
- **Container queries** make Builder device previews behave like real breakpoints.
- **Tailwind v4 `@theme inline`** so universe variables can be scoped to any element (Theme Lab, Playground preview).
- **Validated input everywhere.** Imported blueprints and shared token links are type- and range-checked; unknown keys are dropped.
- **Defensive storage.** Persistence never throws in private mode or when storage is full.
- **Motion** uses transform and opacity only and respects `prefers-reduced-motion`.

## Privacy

No analytics, no cookies and no third-party requests at runtime. Fonts are self-hosted at build time. Exported HTML references Google Fonts only when the chosen font requires it.
