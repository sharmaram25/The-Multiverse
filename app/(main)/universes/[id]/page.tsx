import React from 'react';
import { Theme } from '@/components/theme-provider';
import { UniverseContent } from './universe-content';

export function generateStaticParams() {
  return [
    { id: 'minimal' },
    { id: 'glass' },
    { id: 'neon' },
    { id: 'brutalist' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UniversePage({ params }: PageProps) {
  const { id } = await params;
  
  return <UniverseContent id={id as Theme} />;
}
