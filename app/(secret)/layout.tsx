'use client';

import React from 'react';
import { Providers } from '@/components/providers';
import { motion } from 'motion/react';

export default function SecretLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="secret-universe min-h-screen bg-black text-[#0f0] font-mono selection:bg-[#0f0] selection:text-black">
      {/* We bypass the global Providers if they include Navbar/Footer, 
          but usually Providers should ONLY include Contexts. 
          Let's check what's in providers.tsx again just to be sure. 
          Actually, I can just wrap the children here without the Navbar/Footer.
      */}
      <main className="min-h-screen">
        {children}
      </main>
      
      {/* Visual noise/grain overlay specific to secret world */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[999] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
}
