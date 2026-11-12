'use client';

import dynamic from 'next/dynamic';

const PortalContent = dynamic(() => import('./portal-content'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-6rem)] bg-black flex items-center justify-center">
      <div className="text-sm text-white/70">Loading 3D scene…</div>
    </div>
  ),
});

export default function PortalPage() {
  return <PortalContent />;
}

