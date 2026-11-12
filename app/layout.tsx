import type { Metadata, Viewport } from 'next';
import { Geist, Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { DesktopOnlyGate } from '@/components/desktop-only-gate';

// Self-hosted at build time by next/font: no layout shift, no third-party requests at runtime.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'The Multiverse — Plan, design and ship better websites',
    template: '%s · The Multiverse',
  },
  description:
    'A professional pre-build workspace for product and agency teams: compose pages, define design tokens, audit accessibility and export production-ready HTML, React and design tokens.',
  applicationName: 'The Multiverse',
  keywords: ['website builder', 'design tokens', 'WCAG contrast', 'Tailwind', 'landing page', 'design system', 'UI prototyping'],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'The Multiverse — Plan, design and ship better websites',
    description: 'Compose pages, define tokens, audit contrast and export production-ready code.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#070b17' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geist.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <Providers>
          <DesktopOnlyGate />
          <div className="app-shell">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
