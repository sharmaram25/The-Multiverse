#!/usr/bin/env node
/**
 * Post-build fix for Next.js static export segment prefetching.
 *
 * `next build` with `output: 'export'` writes segment payloads as nested files
 * (`out/builder/__next.<seg>/builder/__PAGE__.txt`), but the client router
 * requests flattened names (`out/builder/__next.<seg>.builder.__PAGE__.txt`).
 * Without this step every prefetch 404s and client navigation degrades to full
 * page reloads. This script writes the flattened copies next to the originals.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(process.argv[2] ?? 'out');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  }));
  return files.flat();
}

async function main() {
  try {
    await fs.access(OUT);
  } catch {
    console.error(`[fix-export-prefetch] ${OUT} not found — run next build first.`);
    process.exit(1);
  }
  const files = await walk(OUT);
  let written = 0;
  for (const file of files) {
    const rel = path.relative(OUT, file).split(path.sep);
    // Find the "__next.<segment>" directory component.
    const idx = rel.findIndex((part, i) => i < rel.length - 1 && part.startsWith('__next.'));
    if (idx === -1) continue;
    const flattened = [...rel.slice(0, idx), rel.slice(idx).join('.')];
    const target = path.join(OUT, ...flattened);
    try {
      await fs.access(target);
    } catch {
      await fs.copyFile(file, target);
      written++;
    }
  }
  console.log(`[fix-export-prefetch] wrote ${written} flattened prefetch payloads`);
}

main().catch((err) => {
  console.error('[fix-export-prefetch] failed:', err);
  process.exit(1);
});
