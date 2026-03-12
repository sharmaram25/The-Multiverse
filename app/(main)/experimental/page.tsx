'use client';

import dynamic from 'next/dynamic';

const ExperimentalContent = dynamic(() => import('./experimental-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-xl text-muted-foreground tracking-widest animate-pulse">Loading Lab...</div>
    </div>
  ),
});

export default function ExperimentalPage() {
  return <ExperimentalContent />;
}
