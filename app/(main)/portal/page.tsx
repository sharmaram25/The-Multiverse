'use client';

import dynamic from 'next/dynamic';

const PortalContent = dynamic(() => import('./portal-content'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl tracking-widest animate-pulse">Loading Multiverse...</div>
    </div>
  ),
});

export default function PortalPage() {
  return <PortalContent />;
}

