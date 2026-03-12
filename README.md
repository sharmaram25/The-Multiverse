# 🌌 The Multiverse

### A Multi-Dimensional Design System & Interactive Portfolio

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-white?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Motion](https://img.shields.io/badge/Motion-12.23-purple?style=for-the-badge&logo=framer)](https://motion.dev/)

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-00AD9F?style=for-the-badge)](https://the-multiverse.netlify.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

**The Multiverse** is a high-performance, experimental design playground that explores the concept of "Interface Relativity"—the idea that a single application can exist simultaneously across multiple visual dimensions, each governed by different aesthetic laws and interaction patterns.

Built with Next.js 16 (Turbopack), React 19, and cutting-edge web technologies, this project demonstrates advanced front-end patterns including 3D WebGL portals, complex motion choreography, dynamic theming, and virtualized performance optimization.

<div align="center">

| 🎨 **4 Design Universes** | ⚡ **32 Interactive Pages** | 🧪 **5 Experimental Labs** | 📦 **5MB Static Build** |
|:---:|:---:|:---:|:---:|

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Design Universes](#-design-universes)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Build & Deploy](#-build--deploy)
- [Design Token System](#-design-token-system)
- [Interactive Labs](#-interactive-labs)
- [Architecture](#-architecture)
- [Performance](#-performance)
- [Hidden Features](#-hidden-features)
- [Contributing](#-contributing)
- [Author](#-author)

---

## ✨ Features

### Core Capabilities

- **🎭 Multi-Theme Architecture** - Seamlessly switch between 4 distinct design systems with live CSS variable interpolation
- **🌀 3D WebGL Portal** - Interactive Three.js portal with orbit controls, particle effects, and dimensional transitions
- **📜 Scroll-Driven Animations** - Sophisticated scroll choreography using Motion/Framer Motion with spring physics
- **🎯 Micro-Interactions** - Liquid toggles, magnetic buttons, tilt cards, and elastic hover states
- **⚡ Turbopack Build** - Sub-second hot reloads and optimized production builds
- **📱 Fully Responsive** - Mobile-first design with adaptive layouts and touch interactions

### Advanced Patterns

- **Virtualized Lists** - Renders 10,000+ items efficiently with only visible DOM nodes
- **Image Lazy Loading** - Intersection Observer-based loading with blur placeholders
- **Motion Choreography** - Coordinated enter/exit animations via TransitionProvider
- **State Persistence** - Zustand-powered theme preferences with localStorage sync
- **Accessibility** - Reduced motion support, focus management, and ARIA compliance

---

## 🎨 Design Universes

Four distinct visual dimensions, each with unique design tokens, interaction patterns, and spatial logic:

<table>
<tr>
<td width="25%" align="center">

### ⚪ Minimal

_The Architecture of Silence_

High whitespace, monochromatic palette, hairline borders, 200ms fades

</td>
<td width="25%" align="center">

### ✨ Glass

_The Physics of Translucency_

Backdrop blur, layered depth, spring physics, floating momentum

</td>
<td width="25%" align="center">

### ⚡ Neon

_The Digital Frontier_

Cyberpunk aesthetics, glowing shadows, scanline overlays, kinetic glitch

</td>
<td width="25%" align="center">

### 🔳 Brutalist

_The Raw Expression_

Thick borders, hard shadows, hyper-colors, zero-latency transitions

</td>
</tr>
</table>

| Token | Minimal | Glass | Neon | Brutalist |
|:------|:--------|:------|:-----|:----------|
| **Grid Unit** | 8px | 12px | 4px | 0px |
| **Border Radius** | 2px | 24px | 0px | 0px |
| **Shadow** | None | Multi-layer blur | Additive glow | 8px hard offset |
| **Transition** | Linear fade | Spring physics | Glitch/snap | Instant |

---

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 16.1.6** - App Router, Turbopack, Static Export
- **React 19** - Server Components, Suspense, Concurrent Features
- **TypeScript 5.9** - Strict mode, advanced type inference

### Styling & Animation
- **Tailwind CSS 4.2** - JIT compilation, @theme tokens, container queries
- **Motion (Framer Motion) 12.23** - Spring physics, gesture recognition, layout animations
- **CSS Variables** - Dynamic theming with reactive token system

### 3D & WebGL
- **Three.js 0.183** - WebGL rendering engine
- **@react-three/fiber 8.17** - React reconciler for Three.js
- **@react-three/drei 9.120** - Useful helpers (Float, Stars, MeshTransmissionMaterial)

### State Management
- **Zustand 5** - Lightweight state with middleware and persistence

### Build & Deploy
- **Turbopack** - Rust-based bundler for instant HMR
- **Static Export** - Pre-rendered HTML for CDN deployment
- **Netlify** - Automatic deploys with edge caching

---

## 📁 Project Structure

```
the-multiverse/
├── app/
│   ├── globals.css          # Tailwind v4 @theme configuration
│   ├── layout.tsx           # Root layout with providers
│   ├── loading.tsx          # Global loading state
│   ├── (main)/              # Public routes
│   │   ├── page.tsx         # Homepage
│   │   ├── about/           # About page
│   │   ├── portal/          # 3D WebGL portal
│   │   ├── universes/       # Theme showcase pages
│   │   │   └── [id]/        # Dynamic universe routes
│   │   ├── design-system/   # Token documentation
│   │   ├── experimental/    # WebGL particle lab
│   │   ├── motion-lab/      # Animation playground
│   │   ├── performance/     # Optimization demos
│   │   ├── sandbox/         # Component builder
│   │   └── ...              # 15+ more pages
│   └── (secret)/            # Hidden routes
│       └── universe/secret/ # Easter egg destination
├── components/
│   ├── ui/                  # Core UI components
│   ├── motion/              # Animation components
│   │   ├── cursor.tsx       # Custom cursor
│   │   ├── magnetic.tsx     # Magnetic hover
│   │   ├── parallax.tsx     # Scroll parallax
│   │   └── tilt.tsx         # 3D tilt cards
│   ├── transitions/         # Page transition system
│   │   ├── transition-context.tsx
│   │   ├── page-transition.tsx
│   │   ├── portal-transition.tsx
│   │   └── curtain-transition.tsx
│   └── providers.tsx        # Context composition
├── lib/
│   ├── design-system-store.ts  # Zustand theme store
│   └── utils.ts             # Utility functions (cn, etc.)
├── hooks/
│   ├── use-mobile.ts        # Responsive detection
│   └── use-exploration-tracker.ts
├── public/
│   └── textures/            # Local texture assets
├── types/
│   └── three-jsx.d.ts       # Three.js JSX types
├── netlify.toml             # Deployment configuration
├── next.config.ts           # Next.js configuration
├── postcss.config.js        # PostCSS/Tailwind setup
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** 9+ or **pnpm** 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/sharmaram25/the-multiverse.git
cd the-multiverse

# Install dependencies (use legacy-peer-deps for React 19 compatibility)
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Development Commands

```bash
npm run dev      # Start dev server with Turbopack HMR
npm run build    # Generate optimized static export
npm run start    # Serve production build locally
npm run lint     # Run ESLint checks
npm run clean    # Clear .next cache
```

---

## 📦 Build & Deploy

### Static Export

The project is configured for static export, generating a complete static site in the `out/` directory:

```bash
npm run build
```

**Build Output:**
- 357 files
- 5.03 MB total
- 32 pre-rendered routes
- Zero-JS initial paint for SSG pages

### Deploy to Netlify

**Option 1: Drag & Drop**
1. Run `npm run build`
2. Drag the `out/` folder to [Netlify Drop](https://app.netlify.com/drop)

**Option 2: Git Integration**
1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`

The included `netlify.toml` handles caching headers and SPA routing automatically.

### Deploy to Other Platforms

```bash
# Vercel
vercel --prod

# GitHub Pages
# Add to package.json: "homepage": "https://username.github.io/the-multiverse"
npm run build && npx gh-pages -d out

# Firebase Hosting
firebase deploy
```

---

## 🧩 Design Token System

The Multiverse uses a **Dynamic Token Architecture** managed through Zustand and CSS custom properties:

```css
/* globals.css - Tailwind v4 @theme block */
@theme {
  --color-background: var(--bg);
  --color-foreground: var(--fg);
  --color-primary: var(--primary);
  /* ... dynamic tokens */
}

/* Theme-specific values */
.minimal { --bg: #ffffff; --fg: #111111; }
.glass   { --bg: #0a0a0a; --fg: #ffffff; }
.neon    { --bg: #050505; --fg: #00f3ff; }
.brutalist { --bg: #f0f0f0; --fg: #000000; }
```

Tokens are reactive and synchronized across:
- CSS (via custom properties)
- JavaScript (via Zustand store)
- WebGL (via Three.js uniforms)

---

## 🔬 Interactive Labs

### 🌀 3D Portal (`/portal`)
Interactive WebGL scene with four hoverable universe objects. Click to trigger dimensional transition with camera animation.

### 🧪 Experimental Lab (`/experimental`)
- WebGL particle swarm (5,000 animated points)
- Fluid gradient cursor tracking
- SVG noise generation
- Kinetic typography

### 🎬 Motion Lab (`/motion-lab`)
Spring physics playground with real-time tuning of mass, tension, and friction parameters.

### 🛠 UI Builder (`/builder`)
Drag-and-drop component assembly with cross-universe styling.

### 📊 Performance Observatory (`/performance`)
- FPS monitoring
- Virtualized list demo (10,000 items)
- Lazy loading patterns
- Animation benchmarks

---

## 🏗 Architecture

### Transition Engine

Custom page transitions via `components/transitions/`:

```tsx
// Coordinated exit/enter animations
<TransitionProvider>
  <AnimatePresence mode="wait">
    <PageTransition key={pathname}>
      {children}
    </PageTransition>
  </AnimatePresence>
</TransitionProvider>
```

### State Management

Zustand store with persistence middleware:

```tsx
// lib/design-system-store.ts
export const useDesignSystem = create(
  persist(
    (set) => ({
      theme: 'minimal',
      reducedMotion: false,
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'design-system' }
  )
);
```

### Dynamic Imports

3D components use `next/dynamic` with `ssr: false` to prevent hydration issues:

```tsx
const PortalContent = dynamic(() => import('./portal-content'), {
  ssr: false,
  loading: () => <LoadingState />,
});
```

---

## ⚡ Performance

### Optimizations Applied

- **Static Generation** - All pages pre-rendered at build time
- **Dynamic Imports** - Three.js loaded only when needed
- **Image Optimization** - Lazy loading with blur placeholders
- **CSS Purging** - Tailwind removes unused styles
- **Font Display Swap** - FOUT prevention
- **Turbopack** - Instant development builds

### Lighthouse Scores

| Metric | Score |
|:-------|:------|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

---

## 🔮 Hidden Features

The project contains several "orphan" routes and easter eggs:

- **Konami Code** - Enter ↑↑↓↓←→←→BA on any page
- **Secret Universe** - Accessible via `/universe/secret`
- **Terminal Mode** - Hidden dev mode toggle in Experimental Lab
- **Parallel Dimensions** - Hidden coordinates in the Multiverse Map

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Use TypeScript strict mode
- Add `@ts-nocheck` only for Three.js files (React 19 type incompatibility)
- Test across all four universes before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

### **Ram Sharma**

_Digital Architect & Creative Engineer_

Building bridges between human intuition and machine precision.

[![Portfolio](https://img.shields.io/badge/Portfolio-sharmaram.dev-000000?style=for-the-badge&logo=safari)](https://portfolio-ram-sharma.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-sharmaram25-181717?style=for-the-badge&logo=github)](https://github.com/sharmaram25)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ram_Sharma-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ram-sharma-20rs02/)
[![Instagram](https://img.shields.io/badge/Instagram-@ramsharma.25-E4405F?style=for-the-badge&logo=instagram)](https://www.instagram.com/ramsharma.25/)

---

**⭐ If you found this project useful, please consider giving it a star!**

</div>

---

<div align="center">

_"Design is not just what it looks like and feels like. Design is how it works across dimensions."_

</div>
