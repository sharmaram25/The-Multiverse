'use client';

import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { UniverseSwitcher } from '@/components/universe-switcher';
import { PageTransition } from '@/components/transitions/page-transition';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="flex-1 pt-20 md:pt-24 min-h-[calc(100vh-100px)]">
          {children}
        </main>
      </PageTransition>
      <Footer />
      <UniverseSwitcher />
    </>
  );
}
