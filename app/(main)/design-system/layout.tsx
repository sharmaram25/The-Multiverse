'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Box, Palette, Type, Maximize, Component, Accessibility, Info } from 'lucide-react';

const sidebarItems = [
  { name: 'Overview', path: '/design-system', icon: Info },
  { name: 'Tokens', path: '/design-system/tokens', icon: Box },
  { name: 'Colors', path: '/design-system/colors', icon: Palette },
  { name: 'Typography', path: '/design-system/typography', icon: Type },
  { name: 'Spacing', path: '/design-system/spacing', icon: Maximize },
  { name: 'Components', path: '/design-system/components', icon: Component },
  { name: 'Accessibility', path: '/design-system/accessibility', icon: Accessibility },
];

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-6rem)] max-w-7xl mx-auto w-full px-6 py-12 gap-12">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 hidden md:block">
        <div className="sticky top-32 space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Design System</h3>
            <nav className="flex flex-col space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 max-w-4xl pb-24">
        {children}
      </main>
    </div>
  );
}
