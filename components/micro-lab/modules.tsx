'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react';
import { AlertCircle, Check, CheckCircle2, Copy, Heart, Info, Loader2, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SegmentControl, SliderControl, TextControl, ToggleControl, Workbench } from '@/components/lab/workbench';

/* -------------------------------------------------------------------------- */
/* Async button                                                               */
/* -------------------------------------------------------------------------- */

export function AsyncButtonBench() {
  const [latency, setLatency] = useState(1200);
  const [outcome, setOutcome] = useState<'success' | 'error'>('success');
  const [resetAfter, setResetAfter] = useState(1600);
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    if (state !== 'idle') return;
    setState('loading');
    timers.current.push(setTimeout(() => {
      setState(outcome);
      timers.current.push(setTimeout(() => setState('idle'), resetAfter));
    }, latency));
  };

  const label = { idle: 'Save changes', loading: 'Saving…', success: 'Saved', error: 'Try again' }[state];

  return (
    <Workbench
      id="async"
      title="Async button"
      description="One control that communicates the whole request lifecycle. The width stays stable, the button is disabled while busy, and the result is announced to screen readers."
      code={[{ label: 'React (Motion)', code: `const [state, setState] = useState('idle'); // idle | loading | success | error

async function onClick() {
  setState('loading');
  try { await save(); setState('success'); }
  catch { setState('error'); }
  finally { setTimeout(() => setState('idle'), ${resetAfter}); }
}

<button onClick={onClick} disabled={state === 'loading'} aria-live="polite" style={{ minWidth: 160 }}>
  <AnimatePresence mode="wait" initial={false}>
    <motion.span key={state} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
      {labels[state]}
    </motion.span>
  </AnimatePresence>
</button>` }]}
      preview={
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={run}
            disabled={state === 'loading'}
            aria-live="polite"
            className={cn(
              'inline-flex h-12 min-w-[180px] items-center justify-center gap-2 overflow-hidden rounded-xl px-6 text-sm font-semibold transition-colors',
              state === 'success' ? 'bg-success text-white' : state === 'error' ? 'bg-destructive text-white' : 'bg-primary text-primary-foreground',
              state === 'loading' && 'cursor-progress opacity-90'
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={state} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="inline-flex items-center gap-2">
                {state === 'loading' && <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 0.8s linear infinite' }} />}
                {state === 'success' && <Check size={16} strokeWidth={3} />}
                {state === 'error' && <AlertCircle size={16} />}
                {label}
              </motion.span>
            </AnimatePresence>
          </button>
          <p className="text-xs text-muted-foreground">Click the button. Outcome and timing are set on the right.</p>
        </div>
      }
      controls={
        <>
          <SegmentControl label="Request outcome" value={outcome} onChange={setOutcome} options={[{ value: 'success', label: 'Success' }, { value: 'error', label: 'Error' }]} />
          <SliderControl label="Network latency" value={latency} min={200} max={4000} step={100} unit="ms" onChange={setLatency} />
          <SliderControl label="Reset after" value={resetAfter} min={600} max={4000} step={100} unit="ms" onChange={setResetAfter} />
          <p className="text-xs text-muted-foreground">Show a spinner only if the request takes longer than ~300ms; faster responses should switch straight to the result.</p>
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Toast system                                                               */
/* -------------------------------------------------------------------------- */

type ToastKind = 'success' | 'info' | 'warning' | 'error';
interface Toast { id: number; kind: ToastKind; title: string; body: string; action?: string }
const TOAST_COPY: Record<ToastKind, Omit<Toast, 'id' | 'kind'>> = {
  success: { title: 'Changes published', body: 'Your page is live.', action: 'View' },
  info: { title: 'New version available', body: 'Reload to get the latest updates.', action: 'Reload' },
  warning: { title: 'Storage almost full', body: 'Export a blueprint to keep a backup.' },
  error: { title: 'Section deleted', body: 'The pricing section was removed.', action: 'Undo' },
};
const TOAST_ICON = { success: CheckCircle2, info: Info, warning: AlertCircle, error: XCircle } as const;
const TOAST_TONE = { success: 'text-success', info: 'text-foreground', warning: 'text-warning', error: 'text-destructive' } as const;

export function ToastBench() {
  const [position, setPosition] = useState<'top-right' | 'bottom-right' | 'bottom-center' | 'top-center'>('bottom-right');
  const [duration, setDuration] = useState(4000);
  const [max, setMax] = useState(3);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [log, setLog] = useState<string | null>(null);
  const nextId = useRef(1);

  const push = (kind: ToastKind) => setToasts((t) => [...t, { id: nextId.current++, kind, ...TOAST_COPY[kind] }].slice(-max));
  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));
  const isTop = position.startsWith('top');
  const align = position.endsWith('center') ? 'items-center left-1/2 -translate-x-1/2' : 'items-end right-4';

  return (
    <Workbench
      id="toasts"
      title="Toast notifications"
      description="A complete toast manager: queue limit, auto-dismiss with a visible timer, pause on hover, actions and keyboard-accessible close buttons."
      code={[{ label: 'React (Motion)', code: `<div role="region" aria-label="Notifications" className="fixed ${position.replace('-', ' ')}">
  <AnimatePresence initial={false}>
    {toasts.slice(-${max}).map((t) => (
      <motion.div
        key={t.id}
        layout
        role="status"
        initial={{ opacity: 0, y: ${isTop ? -16 : 16}, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
        onMouseEnter={${pauseOnHover ? 'pauseTimer' : 'undefined'}}
        onMouseLeave={${pauseOnHover ? 'resumeTimer' : 'undefined'}}
      >
        {t.title}
        {t.action && <button onClick={t.onAction}>{t.action}</button>}
        <button aria-label="Dismiss" onClick={() => dismiss(t.id)}>×</button>
      </motion.div>
    ))}
  </AnimatePresence>
</div>
// Auto-dismiss after ${duration}ms; pause the timer while hovered.` }]}
      preview={
        <div className="relative h-full">
          <div className="flex h-full flex-wrap content-center items-center justify-center gap-2 p-8">
            {(['success', 'info', 'warning', 'error'] as ToastKind[]).map((k) => (
              <button key={k} type="button" onClick={() => push(k)} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold capitalize hover:bg-muted">{k}</button>
            ))}
            {log && <p className="w-full text-center text-xs text-muted-foreground" role="status">{log}</p>}
          </div>
          <div role="region" aria-label="Notifications" className={cn('pointer-events-none absolute flex w-[340px] flex-col gap-2', isTop ? 'top-4' : 'bottom-4', align, isTop ? '' : 'flex-col-reverse')}>
            <AnimatePresence initial={false}>
              {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} duration={duration} pauseOnHover={pauseOnHover} fromTop={isTop} onClose={() => remove(t.id)} onAction={() => { setLog(`Action: ${t.action}`); remove(t.id); }} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      }
      controls={
        <>
          <SegmentControl label="Position" value={position} onChange={setPosition} options={[{ value: 'top-right', label: 'Top right' }, { value: 'top-center', label: 'Top' }, { value: 'bottom-right', label: 'Bottom right' }, { value: 'bottom-center', label: 'Bottom' }]} />
          <SliderControl label="Auto-dismiss" value={duration} min={1500} max={10000} step={500} unit="ms" onChange={setDuration} />
          <SliderControl label="Visible at once" value={max} min={1} max={5} onChange={setMax} />
          <ToggleControl label="Pause on hover" checked={pauseOnHover} onChange={setPauseOnHover} />
        </>
      }
    />
  );
}

function ToastItem({ toast, duration, pauseOnHover, fromTop, onClose, onAction }: { toast: Toast; duration: number; pauseOnHover: boolean; fromTop: boolean; onClose: () => void; onAction: () => void }) {
  const progress = useMotionValue(1);
  const width = useTransform(progress, (p) => `${p * 100}%`);
  const controls = useRef<ReturnType<typeof animate> | null>(null);
  useEffect(() => {
    controls.current = animate(progress, 0, { duration: duration / 1000, ease: 'linear', onComplete: onClose });
    return () => controls.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const Icon = TOAST_ICON[toast.kind];
  return (
    <motion.div
      layout
      role="status"
      initial={{ opacity: 0, y: fromTop ? -16 : 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      onMouseEnter={() => pauseOnHover && controls.current?.pause()}
      onMouseLeave={() => pauseOnHover && controls.current?.play()}
      className="pointer-events-auto relative w-full overflow-hidden rounded-xl border border-border bg-background p-4 shadow-xl"
    >
      <div className="flex gap-3">
        <Icon size={18} className={cn('mt-0.5 shrink-0', TOAST_TONE[toast.kind])} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          <p className="text-xs text-muted-foreground">{toast.body}</p>
        </div>
        {toast.action && <button type="button" onClick={onAction} className="self-start text-xs font-semibold underline underline-offset-2">{toast.action}</button>}
        <button type="button" onClick={onClose} aria-label="Dismiss notification" className="self-start rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X size={14} /></button>
      </div>
      <motion.div aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 bg-primary/60" style={{ width }} />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Inline validation                                                          */
/* -------------------------------------------------------------------------- */

export function ValidationBench() {
  const [timing, setTiming] = useState<'blur' | 'debounce' | 'submit'>('debounce');
  const [delay, setDelay] = useState(500);
  const [shake, setShake] = useState(true);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validate = (v: string, fromSubmit = false) => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (!v) { setError(fromSubmit ? 'Email is required.' : null); setValid(false); if (fromSubmit && shake) setShakeKey((k) => k + 1); return; }
    setError(ok ? null : 'Enter a valid email address, like name@company.com.');
    setValid(ok);
    if (!ok && shake) setShakeKey((k) => k + 1);
  };

  return (
    <Workbench
      id="validation"
      title="Inline field validation"
      description="Validate at the right moment: never on the first keystroke. Errors are linked to the field with aria-describedby and use text, not color alone."
      onReplay={() => { setValue(''); setError(null); setValid(false); }}
      code={[{ label: 'React', code: `<label htmlFor="email">Work email</label>
<input
  id="email"
  type="email"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
  ${timing === 'blur' ? 'onBlur={(e) => validate(e.target.value)}' : timing === 'debounce' ? `onChange={(e) => debounce(() => validate(e.target.value), ${delay})}` : '/* validate in the form onSubmit handler */'}
/>
{error && <p id="email-error" role="alert">{error}</p>}` }]}
      preview={
        <div className="flex h-full items-center justify-center p-8">
          <form
            noValidate
            onSubmit={(e) => { e.preventDefault(); validate(value, true); }}
            className="w-full max-w-sm space-y-3 rounded-2xl border border-border bg-card p-6"
          >
            <label htmlFor="mv-email" className="text-sm font-semibold">Work email</label>
            <motion.div key={shakeKey} animate={shakeKey ? { x: [0, -8, 8, -5, 5, 0] } : undefined} transition={{ duration: 0.35 }} className="relative">
              <input
                id="mv-email"
                type="email"
                value={value}
                aria-invalid={!!error}
                aria-describedby={error ? 'mv-email-error' : undefined}
                placeholder="name@company.com"
                onChange={(e) => {
                  setValue(e.target.value);
                  if (timing === 'debounce') { if (timer.current) clearTimeout(timer.current); const v = e.target.value; timer.current = setTimeout(() => validate(v), delay); }
                  else if (error) setError(null);
                }}
                onBlur={() => timing === 'blur' && validate(value)}
                className={cn('h-11 w-full rounded-lg border bg-background px-3 pr-10 text-sm outline-none focus:ring-2', error ? 'border-destructive focus:ring-destructive/30' : valid ? 'border-success focus:ring-success/30' : 'border-border focus:ring-primary/30')}
              />
              <AnimatePresence>
                {valid && !error && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-success"><CheckCircle2 size={18} /></motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            <AnimatePresence>
              {error && <motion.p id="mv-email-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs font-medium text-destructive">{error}</motion.p>}
            </AnimatePresence>
            <button type="submit" className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground">Continue</button>
          </form>
        </div>
      }
      controls={
        <>
          <SegmentControl label="Validate" value={timing} onChange={setTiming} options={[{ value: 'debounce', label: 'While typing' }, { value: 'blur', label: 'On blur' }, { value: 'submit', label: 'On submit' }]} />
          {timing === 'debounce' && <SliderControl label="Debounce" value={delay} min={150} max={1500} step={50} unit="ms" onChange={setDelay} />}
          <ToggleControl label="Shake on error" checked={shake} onChange={setShake} />
          <p className="text-xs text-muted-foreground">Recommended: validate on blur, then live while correcting an existing error.</p>
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Toggle switch                                                              */
/* -------------------------------------------------------------------------- */

export function SwitchBench() {
  const [on, setOn] = useState(true);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [stiffness, setStiffness] = useState(600);
  const [squash, setSquash] = useState(true);
  const dims = { sm: { w: 36, h: 20, k: 14 }, md: { w: 48, h: 28, k: 20 }, lg: { w: 64, h: 36, k: 28 } }[size];
  const pad = (dims.h - dims.k) / 2;

  return (
    <Workbench
      id="switch"
      title="Toggle switch"
      description="A switch must be operable with Space and Enter, expose role=switch with aria-checked, and keep its label clickable."
      code={[{ label: 'React (Motion)', code: `<button role="switch" aria-checked={on} onClick={() => setOn(!on)}
  style={{ width: ${dims.w}, height: ${dims.h}, borderRadius: 999, padding: ${pad} }}>
  <motion.span
    layout
    transition={{ type: 'spring', stiffness: ${stiffness}, damping: 35 }}
    ${squash ? 'whileTap={{ width: ' + Math.round(dims.k * 1.25) + ' }}' : ''}
    style={{ width: ${dims.k}, height: ${dims.k}, borderRadius: 999, marginLeft: on ? 'auto' : 0 }}
  />
</button>` }]}
      preview={
        <div className="flex h-full items-center justify-center">
          <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-card px-6 py-5">
            <span>
              <span className="block text-sm font-semibold">Email notifications</span>
              <span className="block text-xs text-muted-foreground">{on ? 'You will receive weekly summaries.' : 'Notifications are off.'}</span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => setOn((v) => !v)}
              className={cn('flex shrink-0 rounded-full transition-colors', on ? 'bg-primary' : 'bg-muted ring-1 ring-inset ring-border')}
              style={{ width: dims.w, height: dims.h, padding: pad }}
            >
              <motion.span
                layout
                transition={{ type: 'spring', stiffness, damping: 35 }}
                whileTap={squash ? { width: Math.round(dims.k * 1.25) } : undefined}
                className={cn('block rounded-full shadow', on ? 'bg-primary-foreground' : 'bg-foreground/70')}
                style={{ width: dims.k, height: dims.k, marginLeft: on ? 'auto' : 0 }}
              />
            </button>
          </label>
        </div>
      }
      controls={
        <>
          <SegmentControl label="Size" value={size} onChange={setSize} options={[{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]} />
          <SliderControl label="Spring stiffness" value={stiffness} min={150} max={1000} step={25} onChange={setStiffness} />
          <ToggleControl label="Squash on press" checked={squash} onChange={setSquash} />
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Favorite burst                                                             */
/* -------------------------------------------------------------------------- */

export function FavoriteBench() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(128);
  const [particles, setParticles] = useState(8);
  const [burstKey, setBurstKey] = useState(0);

  return (
    <Workbench
      id="favorite"
      title="Favorite with burst"
      description="A celebratory response for a positive action, paired with an optimistic count update. The burst is decorative and hidden from assistive technology."
      code={[{ label: 'React (Motion)', code: `<button aria-pressed={liked} aria-label={liked ? 'Remove from favorites' : 'Add to favorites'} onClick={toggle}>
  <motion.span animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}>
    <Heart fill={liked ? 'currentColor' : 'none'} />
  </motion.span>
  {liked && Array.from({ length: ${particles} }).map((_, i) => {
    const angle = (i / ${particles}) * Math.PI * 2;
    return <motion.span key={i} aria-hidden
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: Math.cos(angle) * 28, y: Math.sin(angle) * 28, opacity: 0, scale: 0.4 }}
      transition={{ duration: 0.5, ease: 'easeOut' }} />;
  })}
</button>` }]}
      preview={
        <div className="flex h-full items-center justify-center">
          <button
            type="button"
            aria-pressed={liked}
            aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => { setLiked((v) => !v); setCount((c) => c + (liked ? -1 : 1)); if (!liked) setBurstKey((k) => k + 1); }}
            className="relative flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <motion.span key={`h${burstKey}`} animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.35 }} className={liked ? 'text-destructive' : 'text-muted-foreground'}>
                <Heart size={22} fill={liked ? 'currentColor' : 'none'} />
              </motion.span>
              {liked && Array.from({ length: particles }).map((_, i) => {
                const a = (i / particles) * Math.PI * 2;
                return (
                  <motion.span key={`${burstKey}-${i}`} aria-hidden="true" initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(a) * 30, y: Math.sin(a) * 30, opacity: 0, scale: 0.3 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="absolute h-1.5 w-1.5 rounded-full bg-destructive" />
                );
              })}
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums">{count}</span>
          </button>
        </div>
      }
      controls={<SliderControl label="Particles" value={particles} min={0} max={16} onChange={setParticles} />}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Copy button                                                                */
/* -------------------------------------------------------------------------- */

export function CopyBench() {
  const [text, setText] = useState('npm install motion');
  const [copied, setCopied] = useState(false);
  const [hold, setHold] = useState(1500);
  return (
    <Workbench
      id="copy"
      title="Copy to clipboard"
      description="Confirm the copy in place by swapping the icon and label. Falls back gracefully when the Clipboard API is unavailable."
      code={[{ label: 'React', code: `async function copy() {
  try { await navigator.clipboard.writeText(text); }
  catch { /* fallback: select a hidden textarea and execCommand('copy') */ }
  setCopied(true);
  setTimeout(() => setCopied(false), ${hold});
}

<button onClick={copy} aria-live="polite">
  {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
</button>` }]}
      preview={
        <div className="flex h-full items-center justify-center p-8">
          <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-border bg-card p-2 pl-4">
            <code className="min-w-0 flex-1 truncate font-mono text-sm">{text}</code>
            <button
              type="button"
              aria-live="polite"
              onClick={async () => {
                try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
                setCopied(true);
                setTimeout(() => setCopied(false), hold);
              }}
              className="inline-flex h-9 w-24 items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={String(copied)} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.12 }} className="inline-flex items-center gap-1.5">
                  {copied ? <><Check size={14} strokeWidth={3} /> Copied</> : <><Copy size={14} /> Copy</>}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      }
      controls={
        <>
          <TextControl label="Text to copy" value={text} onChange={setText} />
          <SliderControl label="Confirmation shown for" value={hold} min={600} max={4000} step={100} unit="ms" onChange={setHold} />
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Number ticker                                                              */
/* -------------------------------------------------------------------------- */

export function TickerBench() {
  const [target, setTarget] = useState(48250);
  const [duration, setDuration] = useState(900);
  const [format, setFormat] = useState<'number' | 'currency' | 'percent'>('currency');
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (run) value.set(0);
    const unsub = value.on('change', (v) => setDisplay(v));
    const c = animate(value, target, { duration: duration / 1000, ease: [0.16, 1, 0.3, 1] });
    return () => { c.stop(); unsub(); };
  }, [target, duration, value, run]);

  const fmt = (v: number) => format === 'currency'
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
    : format === 'percent' ? `${(v / 1000).toFixed(1)}%` : Math.round(v).toLocaleString();

  return (
    <Workbench
      id="ticker"
      title="Number ticker"
      description="Animate changes to key figures so people notice the difference. Uses tabular numerals so digits do not jitter, and formats with Intl."
      onReplay={() => setRun((r) => r + 1)}
      code={[{ label: 'React (Motion)', code: `const mv = useMotionValue(0);
const [shown, setShown] = useState(0);

useEffect(() => {
  const unsub = mv.on('change', setShown);
  const controls = animate(mv, value, { duration: ${duration / 1000}, ease: [0.16, 1, 0.3, 1] });
  return () => { controls.stop(); unsub(); };
}, [value]);

<span style={{ fontVariantNumeric: 'tabular-nums' }}>{format(shown)}</span>` }]}
      preview={
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <div className="rounded-2xl border border-border bg-card px-10 py-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Monthly revenue</p>
            <p className="mt-2 font-display text-6xl font-bold tabular-nums tracking-tight" aria-live="polite">{fmt(display)}</p>
          </div>
          <div className="flex gap-2">
            {[-5000, -500, 500, 5000].map((d) => (
              <button key={d} type="button" onClick={() => setTarget((t) => Math.max(0, t + d))} className="rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs font-semibold hover:bg-muted">{d > 0 ? '+' : ''}{d.toLocaleString()}</button>
            ))}
          </div>
        </div>
      }
      controls={
        <>
          <SegmentControl label="Format" value={format} onChange={setFormat} options={[{ value: 'currency', label: 'Currency' }, { value: 'number', label: 'Number' }, { value: 'percent', label: 'Percent' }]} />
          <SliderControl label="Duration" value={duration} min={200} max={2500} step={50} unit="ms" onChange={setDuration} />
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Loaders & skeletons                                                        */
/* -------------------------------------------------------------------------- */

export function LoaderBench() {
  const [kind, setKind] = useState<'skeleton' | 'spinner' | 'dots' | 'bar'>('skeleton');
  const [speed, setSpeed] = useState(1.2);
  const [loading, setLoading] = useState(true);

  const css: Record<typeof kind, string> = {
    skeleton: `.skeleton {
  background: linear-gradient(90deg, var(--muted) 25%, color-mix(in srgb, var(--muted), var(--fg) 6%) 50%, var(--muted) 75%);
  background-size: 200% 100%;
  animation: shimmer ${speed}s ease-in-out infinite;
  border-radius: 6px;
}
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`,
    spinner: `.spinner { width: 28px; height: 28px; border-radius: 50%;
  border: 3px solid var(--muted); border-top-color: var(--primary);
  animation: spin ${speed}s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }`,
    dots: `.dots span { width: 8px; height: 8px; border-radius: 50%; background: var(--primary);
  display: inline-block; animation: bounce ${speed}s ease-in-out infinite; }
.dots span:nth-child(2) { animation-delay: ${(speed / 6).toFixed(2)}s; }
.dots span:nth-child(3) { animation-delay: ${(speed / 3).toFixed(2)}s; }
@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); opacity: .5; } 40% { transform: translateY(-8px); opacity: 1; } }`,
    bar: `.bar { height: 3px; overflow: hidden; background: var(--muted); }
.bar::after { content: ''; display: block; width: 40%; height: 100%; background: var(--primary);
  animation: slide ${speed}s ease-in-out infinite; }
@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(250%); } }`,
  };

  return (
    <Workbench
      id="loaders"
      title="Loaders and skeletons"
      description="Prefer skeletons for content with a known layout; they reduce perceived wait and prevent layout shift. Toggle loading to see the content swap in."
      code={[{ label: 'CSS', code: css[kind] + '\n@media (prefers-reduced-motion: reduce) { * { animation-duration: 0s !important; } }' }]}
      preview={
        <div className="flex h-full items-center justify-center p-8">
          <style>{`@keyframes mv-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}@keyframes mv-spin{to{transform:rotate(360deg)}}@keyframes mv-bounce{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-8px);opacity:1}}@keyframes mv-slide{from{transform:translateX(-100%)}to{transform:translateX(250%)}}.mv-skel{background:linear-gradient(90deg,var(--muted) 25%,color-mix(in srgb,var(--muted),var(--fg) 7%) 50%,var(--muted) 75%);background-size:200% 100%;animation:mv-shimmer var(--sp) ease-in-out infinite;border-radius:6px}`}</style>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6" style={{ ['--sp' as string]: `${speed}s` }} aria-busy={loading}>
            {kind === 'bar' && loading && <div className="-mx-6 -mt-6 mb-5 h-[3px] overflow-hidden rounded-t-2xl bg-muted"><div className="h-full w-2/5 bg-primary" style={{ animation: `mv-slide ${speed}s ease-in-out infinite` }} /></div>}
            {loading && kind === 'skeleton' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3"><div className="mv-skel h-11 w-11 !rounded-full" /><div className="flex-1 space-y-2"><div className="mv-skel h-3 w-1/2" /><div className="mv-skel h-2.5 w-1/3" /></div></div>
                <div className="mv-skel h-2.5 w-full" /><div className="mv-skel h-2.5 w-5/6" /><div className="mv-skel h-2.5 w-2/3" />
              </div>
            ) : loading && (kind === 'spinner' || kind === 'dots') ? (
              <div className="flex h-[124px] items-center justify-center" role="status" aria-label="Loading">
                {kind === 'spinner'
                  ? <span className="h-7 w-7 rounded-full border-[3px] border-muted border-t-primary" style={{ animation: `mv-spin ${speed}s linear infinite` }} />
                  : <span className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-primary" style={{ animation: `mv-bounce ${speed}s ease-in-out ${(i * speed) / 6}s infinite` }} />)}</span>}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">JL</div>
                  <div><p className="text-sm font-semibold">Jordan Lee</p><p className="text-xs text-muted-foreground">Head of Growth, Northwind</p></div>
                </div>
                <p className="text-sm text-muted-foreground">We shipped our new site in two weeks instead of two months, and conversions went up 31%.</p>
              </motion.div>
            )}
          </div>
        </div>
      }
      controls={
        <>
          <SegmentControl label="Pattern" value={kind} onChange={setKind} options={[{ value: 'skeleton', label: 'Skeleton' }, { value: 'spinner', label: 'Spinner' }, { value: 'dots', label: 'Dots' }, { value: 'bar', label: 'Progress bar' }]} />
          <SliderControl label="Cycle" value={speed} min={0.4} max={3} step={0.1} unit="s" onChange={setSpeed} />
          <ToggleControl label="Loading" checked={loading} onChange={setLoading} />
        </>
      }
    />
  );
}
