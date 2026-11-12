'use client';

import EffectsWorkbench from './experimental-content';

// three.js is loaded on demand inside the particle workbench, so this page stays light.
export default function ExperimentalPage() {
  return <EffectsWorkbench />;
}
