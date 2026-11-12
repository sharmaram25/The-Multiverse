import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-4 font-display text-6xl font-bold tracking-tight">This page does not exist.</h1>
      <p className="mt-5 max-w-md text-lg text-muted-foreground">The link may be outdated, or the address may contain a typo.</p>
      <div className="mt-10 flex items-center gap-3">
        <Link href="/" className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Go to the home page</Link>
        <Link href="/builder" className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground hover:bg-muted">Open the Builder</Link>
      </div>
    </main>
  );
}
